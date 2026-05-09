import crypto from "crypto";

/**
 * MAISON NOIR — Enterprise Encryption Utility (AES-256-GCM)
 * Used for protecting PII fields in the database.
 */

const ENCRYPTION_KEY = process.env.FIELD_ENCRYPTION_KEY; // Must be 64 chars hex (32 bytes)
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // Standard for GCM
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypt plaintext using AES-256-GCM.
 * Returns: iv:authTag:ciphertext (base64 encoded)
 */
export function encrypt(plaintext) {
    if (!plaintext) return null;
    if (!ENCRYPTION_KEY) throw new Error("FIELD_ENCRYPTION_KEY is not defined");

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, "hex"), iv);

    let encrypted = cipher.update(plaintext, "utf8", "base64");
    encrypted += cipher.final("base64");

    const authTag = cipher.getAuthTag().toString("base64");

    // Format: iv:authTag:encryptedContent
    return `${iv.toString("base64")}:${authTag}:${encrypted}`;
}

/**
 * Decrypt ciphertext using AES-256-GCM.
 */
export function decrypt(ciphertext) {
    if (!ciphertext) return null;
    if (!ENCRYPTION_KEY) throw new Error("FIELD_ENCRYPTION_KEY is not defined");

    try {
        const [ivBase64, authTagBase64, encryptedBase64] = ciphertext.split(":");
        
        const iv = Buffer.from(ivBase64, "base64");
        const authTag = Buffer.from(authTagBase64, "base64");
        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, "hex"), iv);

        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encryptedBase64, "base64", "utf8");
        decrypted += decipher.final("utf8");

        return decrypted;
    } catch (error) {
        console.error("[CRYPTO] Decryption failed:", error.message);
        return null;
    }
}

/**
 * Generate a deterministic fingerprint hash from request headers.
 */
export function generateFingerprint(req) {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const acceptLanguage = req.headers.get("accept-language") || "en";

    const raw = `${ip}|${userAgent}|${acceptLanguage}`;
    
    return crypto
        .createHash("sha256")
        .update(raw)
        .digest("hex");
}
