import { getRandomBytes } from './random'
import { bufferToBase64url } from './util'
import { OAuthClientConfig, OAuthProvider } from './types'

export default class OIDCClient {
  OAuthClients: {
    [K in OAuthProvider]?: OAuthClientConfig;
  }
  constructor(OAuthClients: {
    [K in OAuthProvider]?: OAuthClientConfig;
  }) {
    this.OAuthClients = OAuthClients

    this.initialize()
      .then(() => {
        console.log('JWT Handler initialized')
      })
      .catch((err) => {
        console.error('JWT Handler initialization failed', err)
      })
  }

  private async initialize(): Promise<void> {
    // The URL hash has changed
    function extractToken(): string | null {
      const hash: string = window.location.hash
      const params = new URLSearchParams(hash.substring(1)) // Remove the '#' part
      return params.get('id_token') // Replace 'token' with the actual parameter name
    }
    function extractAuthCodeAndState(): {
      state?: string
      code: string
    } | null {
      const query: string = window.location.search
      const params = new URLSearchParams(query) // Remove the '#' part
      const code = params.get('code')
      if (code === null) {
        return null
      }
      const state = params.get('state') ?? undefined
      return { code, state }
    }
    function extractError(): string | null {
      const hash: string = window.location.hash
      const params = new URLSearchParams(hash.substring(1)) // Remove the '#' part
      return params.get('error') // Replace 'token' with the actual parameter name
    }

    if (extractError() !== null) {
      window?.parent?.postMessage(
        { eventname: 'jwt', error: extractError() },
        window.location.origin
      )
      window.close()
    }

    const token = extractToken()
    const authCodeAndState = extractAuthCodeAndState()

    if (token !== null) {
      window.opener.postMessage(
        { eventname: 'jwt', jwt: token },
        window.location.origin
      )
      // also post the message to any parent iframe listener, as this may be within an iframe to initiate silent oauth2 to the parent
      window.parent.postMessage(
        { eventname: 'jwt', jwt: token },
        window.location.origin
      )
      window.close()
    }

    if (authCodeAndState !== null) {
      window.opener.postMessage(
        { eventname: 'code', codePayload: JSON.stringify(authCodeAndState) },
        window.location.origin
      )
      // also post the message to any parent iframe listener, as this may be within an iframe to initiate silent oauth2 to the parent
      window.parent.postMessage(
        { eventname: 'code', codePayload: JSON.stringify(authCodeAndState) },
        window.location.origin
      )
      window.close()
    }
  }

  private async waitForNextJWT(): Promise<string> {
    return await new Promise((resolve, reject) => {
      // Named function for handling the message event
      function messageHandler(event: any): void {
        // Resolve the promise with the event data
        if (event.origin !== window.location.origin) {
          return
        }
        if (event.data.eventname === 'jwt') {
          const error = event.data.error
          if (error !== undefined) {
            reject(new Error(error))
          }
          const jwt = event.data.jwt
          resolve(jwt)
        }

        // Remove the event listener after handling the event
        window.removeEventListener('message', messageHandler)

        // Clear the timeout if set
        if (messageHandler.timeoutId !== undefined) {
          clearTimeout(messageHandler.timeoutId)
        }
      }

      // Attach the event listener
      window.addEventListener('message', messageHandler)

      // Optional: Implement a timeout to reject the promise
      messageHandler.timeoutId = setTimeout(() => {
        window.removeEventListener('message', messageHandler)
        reject(new Error('Timeout waiting for the message'))
      }, 30000) // Set timeout as desired, e.g., 30 seconds
    })
  }

  public getCachedJWT(): string | undefined {
    const storedJWT = sessionStorage.getItem('jwt');
    if (storedJWT !== null) {
      // Decode JWT and check exp field
      const jwtParts = storedJWT.split('.');
      if (jwtParts.length === 3) {
        const payload = jwtParts[1];
        const payloadJson = JSON.parse(
          atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
        );
        const exp = payloadJson.exp;
        const currentTime = Math.floor(Date.now() / 1000);
        if (exp && exp > currentTime) {
          // JWT is valid, return it
          return storedJWT;
        } else {
          // JWT expired, remove it
          sessionStorage.removeItem('jwt');
        }
      } else {
        // Invalid JWT format, remove it
        sessionStorage.removeItem('jwt');
      }
    }
  }

  private async storeJWT(jwt: string): Promise<void> {
    sessionStorage.setItem('jwt', jwt);
  }

  // get jwt: first attempt silent auth, then popup auth
  private async getJWT(loginURL: string, withoutSilentAuth: boolean = false, ignoreCache: boolean = false): Promise<string> {
    const storedJWT = await this.getCachedJWT()
    if (storedJWT && !ignoreCache) {
      return storedJWT
    }

    if (withoutSilentAuth) {
      window.open(loginURL, '_blank', 'width=500,height=600')
      const jwt = await this.waitForNextJWT()
      this.storeJWT(jwt)
      return jwt
    }

    let jwt = ''
    try {
      const silentAuthIframe = document.createElement('iframe')
      silentAuthIframe.src = loginURL
      silentAuthIframe.style.display = 'none' // Hide the iframe
      silentAuthIframe.width = '0'
      silentAuthIframe.height = '0'
      document.body.appendChild(silentAuthIframe)

      jwt = await this.waitForNextJWT()
      // remove silentAuthIframe iframe
      silentAuthIframe.remove()
    } catch (err) {
      console.warn('Silent auth failed, attempting popup auth', err)
      window.open(loginURL, '_blank', 'width=500,height=600')
      jwt = await this.waitForNextJWT()
    }

    if (jwt === '') {
      throw new Error('JWT is empty')
    }

    this.storeJWT(jwt)
    return jwt
  }

  public async loginWithOIDC({ provider, nonce, ignoreCache = false }: { provider: OAuthProvider, nonce?: string, ignoreCache?: boolean }): Promise<string> {
    // get the config for this provider
    const providerConfig = this.OAuthClients[provider]
    if (providerConfig === undefined) {
      throw new Error('You have not defined the OAuth provider in the config.')
    }

    const params = new URLSearchParams({
      // See below for how to configure client ID and redirect URL
      client_id: providerConfig.ClientId,
      redirect_uri: window.location.origin,
      scope: 'openid email',
      response_type: 'id_token',
      nonce: nonce ?? bufferToBase64url(getRandomBytes(32)),
      state: bufferToBase64url(getRandomBytes(32))
    })
    const loginURL = `${providerConfig.OAuthTokenBaseUrl}?${params.toString()}`
    const jwt = await this.getJWT(loginURL, true, ignoreCache)
    return jwt
  }
}
