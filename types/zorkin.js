import { GetAuthorizeSessionGroupHashApi, AuthorizeSessionApi, GetContractAccountApi, DemoFundContractAccountApi, GetActiveSessionApi, Configuration } from './zorkin-client';
import { AssertDefined, base64urlToBuffer, bufferToBase64url, getNonce, getTealInstanceFromTemplateMap } from './util';
import OIDCClient from './jwt';
import { SessionManager } from './crypto';
import algosdk from 'algosdk';
import { compileTeal } from '@algorandfoundation/algokit-utils';
import { algod } from './algod';
import { EXP_VALID_CONSTANT } from './constants';
const asBase64Bytes = (str) => `base64(${str})`;
export async function compileLSIGTeal(algod, source, args = []) {
    const compiledTeal = await compileTeal(source, algod);
    const smartSig = new algosdk.LogicSigAccount(Buffer.from(compiledTeal.compiled, 'base64'), args);
    return smartSig;
}
export default class ZorkinSDK {
    clientID;
    oidcClient;
    sessionManager;
    loggedInProvider;
    constructor(zorkinConfig) {
        this.oidcClient = new OIDCClient(zorkinConfig.OAuthClients);
        this.clientID = zorkinConfig.clientID;
        this.sessionManager = new SessionManager();
        this.loggedInProvider = 'Google';
    }
    api() {
        const config = new Configuration({ accessToken: this.getJWT() });
        return {
            getAuthorizeSessionGroupHash: (getAuthorizeSessionGroupHashRequest) => {
                const getAuthorizeSessionGroupHashApi = new GetAuthorizeSessionGroupHashApi(config);
                return getAuthorizeSessionGroupHashApi.getAuthorizeSessionGroupHash(getAuthorizeSessionGroupHashRequest);
            },
            authorizeSession: (authorizeSessionRequest) => {
                const authorizeSessionApi = new AuthorizeSessionApi(config);
                return authorizeSessionApi.authorizeSession(authorizeSessionRequest);
            },
            getContractAccount: (getContractAccountRequest) => {
                const getContractAccountApi = new GetContractAccountApi(config);
                return getContractAccountApi.getContractAccount(getContractAccountRequest);
            },
            demoFundContractAccount: (demoFundContractAccountRequest) => {
                const demoFundContractAccountApi = new DemoFundContractAccountApi(config);
                return demoFundContractAccountApi.demoFundContractAccount(demoFundContractAccountRequest);
            },
            getActiveSession: (getActiveSessionRequest) => {
                const getActiveSessionApi = new GetActiveSessionApi(config);
                return getActiveSessionApi.getActiveSession(getActiveSessionRequest);
            }
        };
    }
    async sign(tx) {
        await this.authorizeSession();
        tx = algosdk.decodeUnsignedTransaction(algosdk.encodeObj(tx.get_obj_for_encoding()));
        algosdk.instantiateTxnIfNeeded(tx);
        const atc = new algosdk.AtomicTransactionComposer();
        const currentAuthorizingSessionAccountSigner = async (txnGroup, indexesToSign) => {
            AssertDefined(txnGroup[0], "txnGroup[0] must be defined");
            const isProvingAccessMode = algosdk.encodeUint64(0);
            const signedTx = await Promise.all(indexesToSign.map(async (i) => {
                AssertDefined(txnGroup[i], "txnGroup[i] must be defined");
                const txSessionSignature = await this.sessionManager.sign(Uint8Array.from(txnGroup[i].rawTxID()));
                const lsig = await this.getAuthorizingAccountLSIG([isProvingAccessMode, txSessionSignature]);
                const signedSmartSigTxn = algosdk.signLogicSigTransactionObject(txnGroup[i], lsig);
                return signedSmartSigTxn.blob;
            }));
            return signedTx;
        };
        atc.addTransaction({
            txn: tx,
            signer: currentAuthorizingSessionAccountSigner
        });
        atc.buildGroup();
        const txIds = await atc.submit(algod);
        const txId = txIds.pop();
        AssertDefined(txId, "TxID must be defined");
        return txId;
    }
    async getBaseAccountLSIG(args) {
        const baseSessionPK = Uint8Array.from(new Array(32).fill(0));
        return await this.getContractAccountLSIG(baseSessionPK, args);
    }
    async getAuthorizingAccountLSIG(args) {
        const baseSessionPK = await this.sessionManager.getPublicKey();
        AssertDefined(baseSessionPK, "Must have generated session key");
        return await this.getContractAccountLSIG(baseSessionPK, args);
    }
    async getContractAccountLSIG(sessionPK, args) {
        const jwt = await this.oidcClient.getCachedJWT();
        AssertDefined(jwt, "JWT must be defined. User must login.");
        const res = await this.api().getContractAccount({
            clientID: this.clientID,
            clientJWT: jwt
        });
        const addressSeed = base64urlToBuffer(res.data.addressSeed);
        const contractAccountTealSourceCode = res.data.contractAccountTealSourceCode;
        const tenantAuthAppId = res.data.tenantAuthAppId;
        const addrSeedB64 = Buffer.from(addressSeed).toString('base64');
        const sessionKeyB64 = Buffer.from(sessionPK).toString('base64');
        const templateMap = {
            TMPL_ADDR: asBase64Bytes(addrSeedB64),
            TMPL_EPK: asBase64Bytes(sessionKeyB64),
            TMPL_TENANT_AUTH_APP_ID: tenantAuthAppId.toString(),
        };
        const lsigArgs = args ?? [
            Uint8Array.from(new Array(32).fill(0))
        ];
        const contractAccountSourceInstance = getTealInstanceFromTemplateMap(templateMap, contractAccountTealSourceCode);
        const smartSig = await compileLSIGTeal(algod, contractAccountSourceInstance, lsigArgs);
        return smartSig;
    }
    async getIsSessionActive() {
        try {
            const jwt = await this.getJWT();
            const activeSessionRes = await this.api().getActiveSession({ clientID: this.clientID, clientJWT: jwt });
            const activeSessionPk = base64urlToBuffer(activeSessionRes.data.activeSessionPK);
            const storedSessionPk = await this.sessionManager.getPublicKey();
            if (storedSessionPk === undefined) {
                return false;
            }
            return activeSessionPk.slice().toString() === storedSessionPk.slice().toString();
        }
        catch (e) {
            return false;
        }
    }
    async authorizeSession() {
        const isSessionActive = await this.getIsSessionActive();
        if (isSessionActive) {
            return;
        }
        const newSessionPK = await this.sessionManager.generateKey();
        const nonce = await getNonce(newSessionPK, EXP_VALID_CONSTANT);
        const clientJWT = await this.oidcClient.loginWithOIDC({ nonce, provider: this.loggedInProvider, ignoreCache: true });
        const authorizingTxnGroupHashReq = await this.api().getAuthorizeSessionGroupHash({ clientID: this.clientID, clientJWT, sessionPK: bufferToBase64url(newSessionPK) });
        const groupTxnId = base64urlToBuffer(authorizingTxnGroupHashReq.data.groupTxnId);
        const groupTxnIdSessionSignature = await this.sessionManager.sign(groupTxnId);
        await this.api().authorizeSession({ clientJWT, clientID: this.clientID, sessionPK: bufferToBase64url(newSessionPK), groupTxnIdSessionSignature: bufferToBase64url(groupTxnIdSessionSignature) });
    }
    async login({ provider }) {
        const clientJWT = await this.oidcClient.loginWithOIDC({ provider });
        this.loggedInProvider = provider;
        // should succeed if they're authorized
        await this.api().getActiveSession({ clientID: this.clientID, clientJWT });
        return clientJWT;
    }
    async fundAccountForDemo() {
        const jwt = await this.oidcClient.getCachedJWT();
        AssertDefined(jwt, "JWT is expired or missing. User must login.");
        await this.api().demoFundContractAccount({ clientID: this.clientID, clientJWT: jwt });
    }
    async getJWT() {
        const jwt = this.oidcClient.getCachedJWT();
        AssertDefined(jwt, "JWT is expired or missing. User must login.");
        return jwt;
    }
    async getIsLoggedIn() {
        const jwt = this.oidcClient.getCachedJWT();
        if (jwt == undefined) {
            return false;
        }
        try {
            await this.api().getActiveSession({ clientID: this.clientID, clientJWT: jwt });
            return true;
        }
        catch (e) {
            return false;
        }
    }
    // get the address of the zorkin
    async getAddress() {
        const lsig = await this.getBaseAccountLSIG();
        return lsig.address();
    }
    disconnect() {
    }
}
