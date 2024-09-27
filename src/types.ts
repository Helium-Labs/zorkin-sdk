export type OAuthProvider = 'Google'
export interface OAuthClientConfig {
  OAuthTokenBaseUrl: string
  ClientId: string
}
export interface Keypair { sk: Uint8Array, pk: Uint8Array }
