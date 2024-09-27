export function getRandomBytes(length) {
    if (length <= 0) {
        throw new Error('Length must be greater than 0');
    }
    const global = globalThis;
    if (global.crypto?.getRandomValues) {
        const randomValues = new Uint8Array(length);
        global.crypto.getRandomValues(randomValues);
        return randomValues;
    }
    // @ts-ignore
    // eslint-disable-next-line no-unused-labels
    NODE: {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const crypto = require('crypto');
        return crypto.randomBytes(length);
    }
    // @ts-ignore
    throw new Error('Random byte generation is not supported in this environment');
}
