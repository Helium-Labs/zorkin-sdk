import { GetAuthorizeSessionGroupHashApi, AuthorizeSessionApi, GetContractAccountApi, DemoFundContractAccountApi, GetActiveSessionApi, Configuration } from './zorkin-client'
import { AssertDefined, base64urlToBuffer, bufferToBase64url, getNonce, getTealInstanceFromTemplateMap } from './util'
import OIDCClient from './jwt'
import { OAuthClientConfig, OAuthProvider } from './types'
import { SessionManager } from './crypto'
import algosdk, { waitForConfirmation } from 'algosdk'
import { compileTeal } from '@algorandfoundation/algokit-utils'
import { CompiledTeal } from '@algorandfoundation/algokit-utils/types/app'
import { algod } from './algod'
import { AuthorizeSessionRequest, GetAuthorizeSessionGroupHashRequest, GetContractAccountRequest } from './zorkin-client/zorkin-server-oapi-client'
import { EXP_VALID_CONSTANT } from './constants'

const asBase64Bytes = (str: string): string => `base64(${str})`

export async function compileLSIGTeal(algod: algosdk.Algodv2, source: string, args: (Uint8Array | Buffer)[] = []): Promise<algosdk.LogicSigAccount> {
  const compiledTeal: CompiledTeal = await compileTeal(source, algod)
  const smartSig = new algosdk.LogicSigAccount(
    Buffer.from(compiledTeal.compiled, 'base64'),
    args
  )
  return smartSig
}

export interface ZorkinConfig {
  OAuthClients: {
    [K in OAuthProvider]?: OAuthClientConfig;
  },
  clientID: string,
}

export default class ZorkinSDK {
  private clientID: string
  private oidcClient: OIDCClient
  private sessionManager: SessionManager
  private loggedInProvider: OAuthProvider
  constructor(zorkinConfig: ZorkinConfig) {
    this.oidcClient = new OIDCClient(zorkinConfig.OAuthClients)
    this.clientID = zorkinConfig.clientID
    this.sessionManager = new SessionManager()
    this.loggedInProvider = 'Google'
  }

  public api() {
    const config: Configuration = new Configuration({ accessToken: this.getJWT() })
    return {
      getAuthorizeSessionGroupHash: (getAuthorizeSessionGroupHashRequest: GetAuthorizeSessionGroupHashRequest) => {
        const getAuthorizeSessionGroupHashApi = new GetAuthorizeSessionGroupHashApi(config)
        return getAuthorizeSessionGroupHashApi.getAuthorizeSessionGroupHash(getAuthorizeSessionGroupHashRequest)
      },
      authorizeSession: (authorizeSessionRequest: AuthorizeSessionRequest) => {
        const authorizeSessionApi = new AuthorizeSessionApi(config)
        return authorizeSessionApi.authorizeSession(authorizeSessionRequest)
      },
      getContractAccount: (getContractAccountRequest: GetContractAccountRequest) => {
        const getContractAccountApi = new GetContractAccountApi(config)
        return getContractAccountApi.getContractAccount(getContractAccountRequest)
      },
      demoFundContractAccount: (demoFundContractAccountRequest: GetContractAccountRequest) => {
        const demoFundContractAccountApi = new DemoFundContractAccountApi(config)
        return demoFundContractAccountApi.demoFundContractAccount(demoFundContractAccountRequest)
      },
      getActiveSession: (getActiveSessionRequest: GetContractAccountRequest) => {
        const getActiveSessionApi = new GetActiveSessionApi(config)
        return getActiveSessionApi.getActiveSession(getActiveSessionRequest)
      }
    }
  }

  public async sign(tx: algosdk.Transaction): Promise<string> {
    await this.authorizeSession()
    tx = algosdk.decodeUnsignedTransaction(algosdk.encodeObj(tx.get_obj_for_encoding()))
    algosdk.instantiateTxnIfNeeded(tx)

    const atc = new algosdk.AtomicTransactionComposer()
    const currentAuthorizingSessionAccountSigner = async (txnGroup: algosdk.Transaction[], indexesToSign: number[]): Promise<Uint8Array[]> => {
      AssertDefined(txnGroup[0], "txnGroup[0] must be defined")
      const isProvingAccessMode = algosdk.encodeUint64(0)
      const signedTx = await Promise.all(indexesToSign.map(async i => {
        AssertDefined(txnGroup[i], "txnGroup[i] must be defined")
        const txSessionSignature = await this.sessionManager.sign(Uint8Array.from(txnGroup[i].rawTxID()))
        const lsig = await this.getAuthorizingAccountLSIG([isProvingAccessMode, txSessionSignature])
        const signedSmartSigTxn = algosdk.signLogicSigTransactionObject(txnGroup[i], lsig)
        return signedSmartSigTxn.blob
      }))
      return signedTx
    }
    atc.addTransaction({
      txn: tx,
      signer: currentAuthorizingSessionAccountSigner
    })
    atc.buildGroup()
    const txIds = await atc.submit(algod)
    const txId = txIds.pop()
    AssertDefined(txId, "TxID must be defined")
    try {
      await waitForConfirmation(algod, txId, 2)
    } catch (e) {
      return txId
    }
    return txId
  }

  private async getBaseAccountLSIG(args?: Uint8Array[]): Promise<algosdk.LogicSigAccount> {
    const baseSessionPK = Uint8Array.from(new Array(32).fill(0))
    return await this.getContractAccountLSIG(baseSessionPK, args)
  }

  private async getAuthorizingAccountLSIG(args?: Uint8Array[]): Promise<algosdk.LogicSigAccount> {
    const authorizingSessionPK = await this.sessionManager.getPublicKey()
    AssertDefined(authorizingSessionPK, "Must have generated session key")
    return await this.getContractAccountLSIG(authorizingSessionPK, args)
  }

  private async getContractAccountLSIG(sessionPK: Uint8Array, args?: Uint8Array[]): Promise<algosdk.LogicSigAccount> {
    const jwt = this.oidcClient.getCachedJWT()
    AssertDefined(jwt, "JWT must be defined. User must login.")
    const res = await this.api().getContractAccount({
      clientID: this.clientID,
      clientJWT: jwt
    })

    const addressSeed: Uint8Array = base64urlToBuffer(res.data.addressSeed)
    const contractAccountTealSourceCode: string = res.data.contractAccountTealSourceCode
    const tenantAuthAppId: number = res.data.tenantAuthAppId
    const addrSeedB64 = Buffer.from(addressSeed).toString('base64')
    const sessionKeyB64 = Buffer.from(sessionPK).toString('base64')
    const templateMap: any = {
      TMPL_ADDR: asBase64Bytes(addrSeedB64),
      TMPL_EPK: asBase64Bytes(sessionKeyB64),
      TMPL_TENANT_AUTH_APP_ID: tenantAuthAppId.toString(),
    }
    const lsigArgs: Uint8Array[] = args ?? [
      Uint8Array.from(new Array(32).fill(0))
    ]
    const contractAccountSourceInstance = getTealInstanceFromTemplateMap(
      templateMap,
      contractAccountTealSourceCode
    )

    const smartSig = await compileLSIGTeal(algod, contractAccountSourceInstance, lsigArgs)

    return smartSig
  }

  private async getIsSessionActive(): Promise<boolean> {
    try {
      const jwt = await this.getJWT()
      const activeSessionRes = await this.api().getActiveSession({ clientID: this.clientID, clientJWT: jwt })
      const activeSessionPk = base64urlToBuffer(activeSessionRes.data.activeSessionPK)
      const storedSessionPk = await this.sessionManager.getPublicKey()
      if (storedSessionPk === undefined) {
        return false
      }
      return activeSessionPk.slice().toString() === storedSessionPk.slice().toString()
    } catch (e) {
      return false
    }
  }

  private async authorizeSession() {
    const isSessionActive = await this.getIsSessionActive()
    if (isSessionActive) {
      return
    }
    const newSessionPK = await this.sessionManager.generateKey()
    const nonce = await getNonce(newSessionPK, EXP_VALID_CONSTANT)
    const clientJWT = await this.oidcClient.loginWithOIDC({ nonce, provider: this.loggedInProvider, ignoreCache: true })
    const authorizingTxnGroupHashReq = await this.api().getAuthorizeSessionGroupHash({ clientID: this.clientID, clientJWT, sessionPK: bufferToBase64url(newSessionPK) })
    const groupTxnId = base64urlToBuffer(authorizingTxnGroupHashReq.data.groupTxnId)
    const groupTxnIdSessionSignature = await this.sessionManager.sign(groupTxnId)
    await this.api().authorizeSession({ clientJWT, clientID: this.clientID, sessionPK: bufferToBase64url(newSessionPK), groupTxnIdSessionSignature: bufferToBase64url(groupTxnIdSessionSignature) })
  }

  public async login({ provider }: { provider: OAuthProvider }) {
    const clientJWT = await this.oidcClient.loginWithOIDC({ provider })
    this.loggedInProvider = provider
    // should succeed if they're authorized
    await this.api().getActiveSession({ clientID: this.clientID, clientJWT })
    return clientJWT
  }

  public async fundAccountForDemo() {
    const jwt = this.oidcClient.getCachedJWT()
    AssertDefined(jwt, "JWT is expired or missing. User must login.")
    await this.api().demoFundContractAccount({ clientID: this.clientID, clientJWT: jwt })
  }

  public async getJWT() {
    const jwt = this.oidcClient.getCachedJWT()
    AssertDefined(jwt, "JWT is expired or missing. User must login.")
    return jwt
  }

  public async getIsLoggedIn() {
    const jwt = this.oidcClient.getCachedJWT()
    if (jwt == undefined) {
      return false
    }
    try {
      await this.api().getActiveSession({ clientID: this.clientID, clientJWT: jwt })
      return true
    } catch (e) {
      return false
    }
  }

  // get the address of the zorkin
  public async getAddress(): Promise<string> {
    const lsig = await this.getBaseAccountLSIG()
    return lsig.address()
  }

  public disconnect(): void {
  }

}
