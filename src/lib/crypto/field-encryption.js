import crypto from "crypto";

/**
 * MAISON NOIR — Field-Level Encryption (AES-256-GCM)
 * Encrypts PII data before it reaches the database.
 *
 * Algorithm: AES-256-GCM (Authenticated Encryption with Associated Data)
 *   - 256-bit key (32 bytes)
 *   - 96-bit IV (12 bytes, randomly generated per encryption)
 *   - 128-bit auth tag (16 bytes, ensures integrity)
 *
 * Storage Format: base64(iv):base64(authTag):base64(ciphertext)
 *
 * Environment Variable:
 *   FIELD_ENCRYPTION_KEY — 64-char hex string (32 bytes)
 *   Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */

// ── Key Management ───────────────────────────────────────────

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;        // 96 bits — NIST recommended for GCM
const AUTH_TAG_LENGTH = 16;  // 128 bits
const ENCODING = "base64";
const SEPARATOR = ":";

function getEncryptionKey() {
  const keyHex = process.env.FIELD_ENCRYPTION_KEY;

  if (!keyHex) {
    throw new Error(
      "[CRYPTO] FIELD_ENCRYPTION_KEY environment variable is not set. " +
      "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    );
  }

  if (keyHex.length !== 64) {
    throw new Error(
      `[CRYPTO] FIELD_ENCRYPTION_KEY must be exactly 64 hex characters (32 bytes). Got ${keyHex.length} characters.`
    );
  }

  return Buffer.from(keyHex, "hex");
}

// ── Encrypt ──────────────────────────────────────────────────

/**
 * Encrypt a plaintext string using AES-256-GCM.
 *
 * @param {string} plaintext - The text to encrypt
 * @returns {string} Encrypted string in format: base64(iv):base64(authTag):base64(ciphertext)
 */
export function encrypt(plaintext) {
  if (!plaintext || typeof plaintext !== "string") return plaintext;

  // Don't double-encrypt already encrypted data
  if (isEncrypted(plaintext)) return plaintext;

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  let encrypted = cipher.update(plaintext, "utf8", ENCODING);
  encrypted += cipher.final(ENCODING);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString(ENCODING),
    authTag.toString(ENCODING),
    encrypted,
  ].join(SEPARATOR);
}

// ── Decrypt ──────────────────────────────────────────────────

/**
 * Decrypt an AES-256-GCM encrypted string.
 *
 * @param {string} encryptedText - The encrypted string (iv:authTag:ciphertext)
 * @returns {string} The original plaintext
 */
export function decrypt(encryptedText) {
  if (!encryptedText || typeof encryptedText !== "string") return encryptedText;

  // If it's not encrypted, return as-is
  if (!isEncrypted(encryptedText)) return encryptedText;

  const key = getEncryptionKey();
  const parts = encryptedText.split(SEPARATOR);

  if (parts.length !== 3) {
    console.warn("[CRYPTO] Invalid encrypted format, returning raw value");
    return encryptedText;
  }

  const [ivB64, authTagB64, ciphertextB64] = parts;

  try {
    const iv = Buffer.from(ivB64, ENCODING);
    const authTag = Buffer.from(authTagB64, ENCODING);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertextB64, ENCODING, "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("[CRYPTO] Decryption failed:", error.message);
    // Return the raw value rather than crash the application
    return encryptedText;
  }
}

// ── Detection ────────────────────────────────────────────────

/**
 * Check if a string appears to be encrypted (matches our format).
 * Format: base64:base64:base64 (three colon-separated base64 segments)
 */
export function isEncrypted(text) {
  if (!text || typeof text !== "string") return false;

  const parts = text.split(SEPARATOR);
  if (parts.length !== 3) return false;

  // Each part should be valid base64
  const base64Regex = /^[A-Za-z0-9+/]+=*$/;
  return parts.every((part) => part.length > 0 && base64Regex.test(part));
}

// ── Batch Operations ─────────────────────────────────────────

/**
 * Encrypt specific fields in an object.
 *
 * @param {Object} obj - The object to process
 * @param {string[]} fields - Array of field names to encrypt
 * @returns {Object} New object with specified fields encrypted
 */
export function encryptFields(obj, fields) {
  if (!obj || typeof obj !== "object") return obj;

  const result = { ...obj };
  for (const field of fields) {
    if (result[field] && typeof result[field] === "string") {
      result[field] = encrypt(result[field]);
    }
  }
  return result;
}

/**
 * Decrypt specific fields in an object.
 *
 * @param {Object} obj - The object to process
 * @param {string[]} fields - Array of field names to decrypt
 * @returns {Object} New object with specified fields decrypted
 */
export function decryptFields(obj, fields) {
  if (!obj || typeof obj !== "object") return obj;

  const result = { ...obj };
  for (const field of fields) {
    if (result[field] && typeof result[field] === "string") {
      result[field] = decrypt(result[field]);
    }
  }
  return result;
}

/**
 * Hash a value with SHA-256 (one-way, for comparison purposes).
 * Used for fields that need equality checks but not decryption.
 */
export function hashField(value) {
  if (!value) return null;
  return crypto
    .createHash("sha256")
    .update(String(value))
    .digest("hex");
}
