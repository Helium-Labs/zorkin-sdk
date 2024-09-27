import { OAuthClientConfig, OAuthProvider } from './types';
import algosdk from 'algosdk';
import { AuthorizeSessionRequest, GetAuthorizeSessionGroupHashRequest, GetContractAccountRequest } from './zorkin-client/zorkin-server-oapi-client';
export declare function compileLSIGTeal(algod: algosdk.Algodv2, source: string, args?: (Uint8Array | Buffer)[]): Promise<algosdk.LogicSigAccount>;
export interface ZorkinConfig {
    OAuthClients: {
        [K in OAuthProvider]?: OAuthClientConfig;
    };
    clientID: string;
}
export default class ZorkinSDK {
    private clientID;
    private oidcClient;
    private sessionManager;
    private loggedInProvider;
    constructor(zorkinConfig: ZorkinConfig);
    api(): {
        getAuthorizeSessionGroupHash: (getAuthorizeSessionGroupHashRequest: GetAuthorizeSessionGroupHashRequest) => Promise<import("axios").AxiosResponse<import("./zorkin-client/zorkin-server-oapi-client").GetAuthorizeSessionGroupHash200Response, any>>;
        authorizeSession: (authorizeSessionRequest: AuthorizeSessionRequest) => Promise<import("axios").AxiosResponse<import("./zorkin-client/zorkin-server-oapi-client").AuthorizeSession200Response, any>>;
        getContractAccount: (getContractAccountRequest: GetContractAccountRequest) => Promise<import("axios").AxiosResponse<import("./zorkin-client/zorkin-server-oapi-client").GetContractAccount200Response, any>>;
        demoFundContractAccount: (demoFundContractAccountRequest: GetContractAccountRequest) => Promise<import("axios").AxiosResponse<import("./zorkin-client/zorkin-server-oapi-client").DemoFundContractAccount200Response, any>>;
        getActiveSession: (getActiveSessionRequest: GetContractAccountRequest) => Promise<import("axios").AxiosResponse<import("./zorkin-client/zorkin-server-oapi-client").GetActiveSession200Response, any>>;
    };
    sign(tx: algosdk.Transaction): Promise<string>;
    private getBaseAccountLSIG;
    private getAuthorizingAccountLSIG;
    private getContractAccountLSIG;
    private getIsSessionActive;
    private authorizeSession;
    login({ provider }: {
        provider: OAuthProvider;
    }): Promise<string>;
    fundAccountForDemo(): Promise<void>;
    getJWT(): Promise<string>;
    getIsLoggedIn(): Promise<boolean>;
    getAddress(): Promise<string>;
    disconnect(): void;
}
