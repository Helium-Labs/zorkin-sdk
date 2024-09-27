/* tslint:disable */
/* eslint-disable */
/**
 * OpenAPI
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, setBearerAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
// @ts-ignore
import { BASE_PATH, BaseAPI, operationServerMap } from './base';
/**
 * AuthorizeSessionApi - axios parameter creator
 * @export
 */
export const AuthorizeSessionApiAxiosParamCreator = function (configuration) {
    return {
        /**
         *
         * @summary Authorize Session with provided Client JWT, signature of authorizing group tx made with provided Session PK for Client ID
         * @param {AuthorizeSessionRequest} [authorizeSessionRequest]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        authorizeSession: async (authorizeSessionRequest, options = {}) => {
            const localVarPath = `/api/authorize`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            // authentication ZorkinSentryBearerAuth required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration);
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            localVarRequestOptions.data = serializeDataIfNeeded(authorizeSessionRequest, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    };
};
/**
 * AuthorizeSessionApi - functional programming interface
 * @export
 */
export const AuthorizeSessionApiFp = function (configuration) {
    const localVarAxiosParamCreator = AuthorizeSessionApiAxiosParamCreator(configuration);
    return {
        /**
         *
         * @summary Authorize Session with provided Client JWT, signature of authorizing group tx made with provided Session PK for Client ID
         * @param {AuthorizeSessionRequest} [authorizeSessionRequest]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async authorizeSession(authorizeSessionRequest, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.authorizeSession(authorizeSessionRequest, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['AuthorizeSessionApi.authorizeSession']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    };
};
/**
 * AuthorizeSessionApi - factory interface
 * @export
 */
export const AuthorizeSessionApiFactory = function (configuration, basePath, axios) {
    const localVarFp = AuthorizeSessionApiFp(configuration);
    return {
        /**
         *
         * @summary Authorize Session with provided Client JWT, signature of authorizing group tx made with provided Session PK for Client ID
         * @param {AuthorizeSessionRequest} [authorizeSessionRequest]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        authorizeSession(authorizeSessionRequest, options) {
            return localVarFp.authorizeSession(authorizeSessionRequest, options).then((request) => request(axios, basePath));
        },
    };
};
/**
 * AuthorizeSessionApi - object-oriented interface
 * @export
 * @class AuthorizeSessionApi
 * @extends {BaseAPI}
 */
export class AuthorizeSessionApi extends BaseAPI {
    /**
     *
     * @summary Authorize Session with provided Client JWT, signature of authorizing group tx made with provided Session PK for Client ID
     * @param {AuthorizeSessionRequest} [authorizeSessionRequest]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthorizeSessionApi
     */
    authorizeSession(authorizeSessionRequest, options) {
        return AuthorizeSessionApiFp(this.configuration).authorizeSession(authorizeSessionRequest, options).then((request) => request(this.axios, this.basePath));
    }
}
/**
 * DemoFundContractAccountApi - axios parameter creator
 * @export
 */
export const DemoFundContractAccountApiAxiosParamCreator = function (configuration) {
    return {
        /**
         *
         * @summary Fund a contract account (testnet) for the demo
         * @param {GetContractAccountRequest} [getContractAccountRequest]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        demoFundContractAccount: async (getContractAccountRequest, options = {}) => {
            const localVarPath = `/api/demo-fund-contract-account`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            // authentication ZorkinSentryBearerAuth required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration);
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            localVarRequestOptions.data = serializeDataIfNeeded(getContractAccountRequest, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    };
};
/**
 * DemoFundContractAccountApi - functional programming interface
 * @export
 */
export const DemoFundContractAccountApiFp = function (configuration) {
    const localVarAxiosParamCreator = DemoFundContractAccountApiAxiosParamCreator(configuration);
    return {
        /**
         *
         * @summary Fund a contract account (testnet) for the demo
         * @param {GetContractAccountRequest} [getContractAccountRequest]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async demoFundContractAccount(getContractAccountRequest, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.demoFundContractAccount(getContractAccountRequest, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DemoFundContractAccountApi.demoFundContractAccount']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    };
};
/**
 * DemoFundContractAccountApi - factory interface
 * @export
 */
export const DemoFundContractAccountApiFactory = function (configuration, basePath, axios) {
    const localVarFp = DemoFundContractAccountApiFp(configuration);
    return {
        /**
         *
         * @summary Fund a contract account (testnet) for the demo
         * @param {GetContractAccountRequest} [getContractAccountRequest]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        demoFundContractAccount(getContractAccountRequest, options) {
            return localVarFp.demoFundContractAccount(getContractAccountRequest, options).then((request) => request(axios, basePath));
        },
    };
};
/**
 * DemoFundContractAccountApi - object-oriented interface
 * @export
 * @class DemoFundContractAccountApi
 * @extends {BaseAPI}
 */
export class DemoFundContractAccountApi extends BaseAPI {
    /**
     *
     * @summary Fund a contract account (testnet) for the demo
     * @param {GetContractAccountRequest} [getContractAccountRequest]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DemoFundContractAccountApi
     */
    demoFundContractAccount(getContractAccountRequest, options) {
        return DemoFundContractAccountApiFp(this.configuration).demoFundContractAccount(getContractAccountRequest, options).then((request) => request(this.axios, this.basePath));
    }
}
/**
 * GetActiveSessionApi - axios parameter creator
 * @export
 */
export const GetActiveSessionApiAxiosParamCreator = function (configuration) {
    return {
        /**
         *
         * @summary Get currently active session public key
         * @param {GetContractAccountRequest} [getContractAccountRequest]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getActiveSession: async (getContractAccountRequest, options = {}) => {
            const localVarPath = `/api/get-active-session`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            // authentication ZorkinSentryBearerAuth required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration);
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            localVarRequestOptions.data = serializeDataIfNeeded(getContractAccountRequest, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    };
};
/**
 * GetActiveSessionApi - functional programming interface
 * @export
 */
export const GetActiveSessionApiFp = function (configuration) {
    const localVarAxiosParamCreator = GetActiveSessionApiAxiosParamCreator(configuration);
    return {
        /**
         *
         * @summary Get currently active session public key
         * @param {GetContractAccountRequest} [getContractAccountRequest]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getActiveSession(getContractAccountRequest, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getActiveSession(getContractAccountRequest, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['GetActiveSessionApi.getActiveSession']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    };
};
/**
 * GetActiveSessionApi - factory interface
 * @export
 */
export const GetActiveSessionApiFactory = function (configuration, basePath, axios) {
    const localVarFp = GetActiveSessionApiFp(configuration);
    return {
        /**
         *
         * @summary Get currently active session public key
         * @param {GetContractAccountRequest} [getContractAccountRequest]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getActiveSession(getContractAccountRequest, options) {
            return localVarFp.getActiveSession(getContractAccountRequest, options).then((request) => request(axios, basePath));
        },
    };
};
/**
 * GetActiveSessionApi - object-oriented interface
 * @export
 * @class GetActiveSessionApi
 * @extends {BaseAPI}
 */
export class GetActiveSessionApi extends BaseAPI {
    /**
     *
     * @summary Get currently active session public key
     * @param {GetContractAccountRequest} [getContractAccountRequest]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GetActiveSessionApi
     */
    getActiveSession(getContractAccountRequest, options) {
        return GetActiveSessionApiFp(this.configuration).getActiveSession(getContractAccountRequest, options).then((request) => request(this.axios, this.basePath));
    }
}
/**
 * GetAuthorizeSessionGroupHashApi - axios parameter creator
 * @export
 */
export const GetAuthorizeSessionGroupHashApiAxiosParamCreator = function (configuration) {
    return {
        /**
         *
         * @summary Get Group Hash of Authorizing Tx
         * @param {GetAuthorizeSessionGroupHashRequest} [getAuthorizeSessionGroupHashRequest]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAuthorizeSessionGroupHash: async (getAuthorizeSessionGroupHashRequest, options = {}) => {
            const localVarPath = `/api/authorize/group-tx-id`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            // authentication ZorkinSentryBearerAuth required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration);
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            localVarRequestOptions.data = serializeDataIfNeeded(getAuthorizeSessionGroupHashRequest, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    };
};
/**
 * GetAuthorizeSessionGroupHashApi - functional programming interface
 * @export
 */
export const GetAuthorizeSessionGroupHashApiFp = function (configuration) {
    const localVarAxiosParamCreator = GetAuthorizeSessionGroupHashApiAxiosParamCreator(configuration);
    return {
        /**
         *
         * @summary Get Group Hash of Authorizing Tx
         * @param {GetAuthorizeSessionGroupHashRequest} [getAuthorizeSessionGroupHashRequest]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getAuthorizeSessionGroupHash(getAuthorizeSessionGroupHashRequest, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getAuthorizeSessionGroupHash(getAuthorizeSessionGroupHashRequest, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['GetAuthorizeSessionGroupHashApi.getAuthorizeSessionGroupHash']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    };
};
/**
 * GetAuthorizeSessionGroupHashApi - factory interface
 * @export
 */
export const GetAuthorizeSessionGroupHashApiFactory = function (configuration, basePath, axios) {
    const localVarFp = GetAuthorizeSessionGroupHashApiFp(configuration);
    return {
        /**
         *
         * @summary Get Group Hash of Authorizing Tx
         * @param {GetAuthorizeSessionGroupHashRequest} [getAuthorizeSessionGroupHashRequest]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAuthorizeSessionGroupHash(getAuthorizeSessionGroupHashRequest, options) {
            return localVarFp.getAuthorizeSessionGroupHash(getAuthorizeSessionGroupHashRequest, options).then((request) => request(axios, basePath));
        },
    };
};
/**
 * GetAuthorizeSessionGroupHashApi - object-oriented interface
 * @export
 * @class GetAuthorizeSessionGroupHashApi
 * @extends {BaseAPI}
 */
export class GetAuthorizeSessionGroupHashApi extends BaseAPI {
    /**
     *
     * @summary Get Group Hash of Authorizing Tx
     * @param {GetAuthorizeSessionGroupHashRequest} [getAuthorizeSessionGroupHashRequest]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GetAuthorizeSessionGroupHashApi
     */
    getAuthorizeSessionGroupHash(getAuthorizeSessionGroupHashRequest, options) {
        return GetAuthorizeSessionGroupHashApiFp(this.configuration).getAuthorizeSessionGroupHash(getAuthorizeSessionGroupHashRequest, options).then((request) => request(this.axios, this.basePath));
    }
}
/**
 * GetContractAccountApi - axios parameter creator
 * @export
 */
export const GetContractAccountApiAxiosParamCreator = function (configuration) {
    return {
        /**
         *
         * @summary Get Contract Account LSIG source code, along with parameters to reproduce in the client
         * @param {GetContractAccountRequest} [getContractAccountRequest]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getContractAccount: async (getContractAccountRequest, options = {}) => {
            const localVarPath = `/api/get-contract-account`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            // authentication ZorkinSentryBearerAuth required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration);
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            localVarRequestOptions.data = serializeDataIfNeeded(getContractAccountRequest, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    };
};
/**
 * GetContractAccountApi - functional programming interface
 * @export
 */
export const GetContractAccountApiFp = function (configuration) {
    const localVarAxiosParamCreator = GetContractAccountApiAxiosParamCreator(configuration);
    return {
        /**
         *
         * @summary Get Contract Account LSIG source code, along with parameters to reproduce in the client
         * @param {GetContractAccountRequest} [getContractAccountRequest]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getContractAccount(getContractAccountRequest, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getContractAccount(getContractAccountRequest, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['GetContractAccountApi.getContractAccount']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    };
};
/**
 * GetContractAccountApi - factory interface
 * @export
 */
export const GetContractAccountApiFactory = function (configuration, basePath, axios) {
    const localVarFp = GetContractAccountApiFp(configuration);
    return {
        /**
         *
         * @summary Get Contract Account LSIG source code, along with parameters to reproduce in the client
         * @param {GetContractAccountRequest} [getContractAccountRequest]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getContractAccount(getContractAccountRequest, options) {
            return localVarFp.getContractAccount(getContractAccountRequest, options).then((request) => request(axios, basePath));
        },
    };
};
/**
 * GetContractAccountApi - object-oriented interface
 * @export
 * @class GetContractAccountApi
 * @extends {BaseAPI}
 */
export class GetContractAccountApi extends BaseAPI {
    /**
     *
     * @summary Get Contract Account LSIG source code, along with parameters to reproduce in the client
     * @param {GetContractAccountRequest} [getContractAccountRequest]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GetContractAccountApi
     */
    getContractAccount(getContractAccountRequest, options) {
        return GetContractAccountApiFp(this.configuration).getContractAccount(getContractAccountRequest, options).then((request) => request(this.axios, this.basePath));
    }
}
