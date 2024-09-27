export declare const sha256: {
    (msg: import("@noble/hashes/utils").Input): Uint8Array;
    outputLen: number;
    blockLen: number;
    create(): import("@noble/hashes/utils").Hash<import("@noble/hashes/sha256").SHA256>;
};
export declare function base64ToBase64url(base64: string): string;
export declare function bufferToBase64url(buffer: Uint8Array | ArrayBuffer): string;
export declare function base64urlToBuffer(base64url: string): Uint8Array;
export declare function getNonce(sessionPK: Uint8Array, expValidity: number): Promise<string>;
export declare function Assert(value: boolean, message: string): asserts value is true;
export declare function AssertDefined<T>(value: T | undefined | null, message: string): asserts value is T;
export declare function getTealInstanceFromTemplateMap(templateMap: Record<string, string>, source: string): string;
