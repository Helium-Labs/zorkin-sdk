import * as ed from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha512';
import { AssertDefined, base64urlToBuffer, bufferToBase64url } from './util';
ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));
// Key pair generation using Ed25519
async function generateEd25519KeyPair() {
    const sk = ed.utils.randomPrivateKey();
    const pk = ed.getPublicKey(sk);
    return {
        sk,
        pk,
    };
}
export class SessionManager {
    static SESSION_PK_KEY = 'ed25519SessionPK';
    static SESSION_SK_KEY = 'ed25519SessionSK';
    /**
     * Generates a new Ed25519 key pair.
     * Uses SubtleCrypto if available; falls back to '@noble/ed25519' if not.
     * @returns A promise that resolves to the public key.
     */
    async generateKey() {
        // Generate key pair
        const keyPair = await generateEd25519KeyPair();
        localStorage.setItem(SessionManager.SESSION_PK_KEY, bufferToBase64url(keyPair.pk));
        localStorage.setItem(SessionManager.SESSION_SK_KEY, bufferToBase64url(keyPair.sk));
        return keyPair.pk;
    }
    /**
     * Retrieves the stored public key.
     * @returns A promise that resolves to the public key.
     */
    async getPublicKey() {
        const b64url = localStorage.getItem(SessionManager.SESSION_PK_KEY);
        if (!b64url) {
            return undefined;
        }
        // Convert from base64url to Uint8Array
        const publicKey = base64urlToBuffer(b64url);
        return publicKey;
    }
    /**
     * Retrieves the stored private key.
     * @returns A promise that resolves to the private key.
     */
    async getPrivateKey() {
        const b64url = localStorage.getItem(SessionManager.SESSION_SK_KEY);
        if (!b64url) {
            return undefined;
        }
        // Convert from base64url to Uint8Array
        const privateKey = base64urlToBuffer(b64url);
        return privateKey;
    }
    /**
     * Signs a message using the stored private key.
     * @param message - The message to sign as Uint8Array.
     * @returns A promise that resolves to the signature as Uint8Array.
     */
    async sign(message) {
        const privateKey = await this.getPrivateKey();
        AssertDefined(privateKey, "Private key must be defined");
        const signature = ed.sign(message, privateKey);
        return signature;
    }
}
