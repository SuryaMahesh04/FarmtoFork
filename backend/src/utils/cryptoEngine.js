const crypto = require('crypto');

// Algorithm configurations
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Ensures we always have a 32-byte key for AES-256
 */
const getEncryptionKey = () => {
    const secret = process.env.MASTER_ENCRYPTION_KEY;
    if (!secret) {
        throw new Error('MASTER_ENCRYPTION_KEY is not defined in environment variables');
    }
    // Hash the secret to ensure it's exactly 32 bytes
    return crypto.createHash('sha256').update(secret).digest();
};

/**
 * Encrypt a plaintext string using AES-256-GCM
 * @param {string|number|object} data - Data to encrypt
 * @returns {object} - Encrypted object containing iv, authTag, and ciphertext
 */
const encrypt = (data) => {
    if (data === null || data === undefined) return null;
    
    // Convert data to string if it's not
    const plaintext = typeof data === 'object' ? JSON.stringify(data) : String(data);
    
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    
    return {
        ciphertext,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
    };
};

/**
 * Decrypt a ciphertext object back to plaintext
 * @param {object} encryptedData - Object containing iv, authTag, and ciphertext
 * @returns {string} - Decrypted plaintext string
 */
const decrypt = (encryptedData) => {
    if (!encryptedData || !encryptedData.ciphertext) return null;
    
    try {
        const key = getEncryptionKey();
        const iv = Buffer.from(encryptedData.iv, 'hex');
        const authTag = Buffer.from(encryptedData.authTag, 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        
        decipher.setAuthTag(authTag);
        let plaintext = decipher.update(encryptedData.ciphertext, 'hex', 'utf8');
        plaintext += decipher.final('utf8');
        
        return plaintext;
    } catch (error) {
        console.error('Decryption failed, data might be tampered or corrupted', error);
        return '***ENCRYPTED/CORRUPT***';
    }
};

/**
 * Generate a blind index (one-way hash) for searchable fields
 * @param {string} data - Field to index
 * @returns {string} - Hash of the field
 */
const generateBlindIndex = (data) => {
    if (!data) return null;
    const stringData = String(data).toLowerCase().trim();
    const key = getEncryptionKey();
    return crypto.createHmac('sha256', key).update(stringData).digest('hex');
};

/**
 * Sign a document payload to detect tampering
 * @param {object} payload - Entire document object sans signature fields
 * @returns {string} - Digital signature
 */
const signPayload = (payload) => {
    const key = getEncryptionKey();
    // Deterministic stringification
    const dataString = JSON.stringify(payload, Object.keys(payload).sort());
    return crypto.createHmac('sha256', key).update(dataString).digest('hex');
};

/**
 * Verify a document payload signature
 * @param {object} payload - Entire document object sans signature fields
 * @param {string} providedSignature - The signature stored in DB
 * @returns {boolean} - true if intact, false if tampered
 */
const verifySignature = (payload, providedSignature) => {
    if (!providedSignature) return false;
    const computedSignature = signPayload(payload);
    return computedSignature === providedSignature;
};

module.exports = {
    encrypt,
    decrypt,
    generateBlindIndex,
    signPayload,
    verifySignature
};
