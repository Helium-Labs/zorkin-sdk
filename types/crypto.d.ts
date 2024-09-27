export declare class SessionManager {
    private static readonly SESSION_PK_KEY;
    private static readonly SESSION_SK_KEY;
    /**
     * Generates a new Ed25519 key pair.
     * Uses SubtleCrypto if available; falls back to '@noble/ed25519' if not.
     * @returns A promise that resolves to the public key.
     */
    generateKey(): Promise<Uint8Array>;
    /**
     * Retrieves the stored public key.
     * @returns A promise that resolves to the public key.
     */
    getPublicKey(): Promise<Uint8Array | undefined>;
    /**
     * Retrieves the stored private key.
     * @returns A promise that resolves to the private key.
     */
    private getPrivateKey;
    /**
     * Signs a message using the stored private key.
     * @param message - The message to sign as Uint8Array.
     * @returns A promise that resolves to the signature as Uint8Array.
     */
    sign(message: Uint8Array): Promise<Uint8Array>;
}
