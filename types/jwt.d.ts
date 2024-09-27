import { OAuthClientConfig, OAuthProvider } from './types';
export default class OIDCClient {
    OAuthClients: {
        [K in OAuthProvider]?: OAuthClientConfig;
    };
    constructor(OAuthClients: {
        [K in OAuthProvider]?: OAuthClientConfig;
    });
    private initialize;
    private waitForNextJWT;
    getCachedJWT(): string | undefined;
    private storeJWT;
    private getJWT;
    loginWithOIDC({ provider, nonce, ignoreCache }: {
        provider: OAuthProvider;
        nonce?: string;
        ignoreCache?: boolean;
    }): Promise<string>;
}
