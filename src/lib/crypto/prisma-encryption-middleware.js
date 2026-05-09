import { encrypt, decrypt, isEncrypted } from "@/lib/crypto/field-encryption";

/**
 * MAISON NOIR — Prisma Encryption Extension
 * Automatically encrypts PII fields on write and decrypts on read.
 * 
 * Note: Upgraded to Prisma 5+ Extensions ($extends) to resolve 
 * the '$use is not a function' error in Prisma v7.
 *
 * Protected Fields by Model:
 *   address  → street, city, state, postalCode
 *   user     → mfaSecret
 */

const ENCRYPTED_FIELDS = {
  address: ["street", "city", "state", "postalCode"],
  user: ["mfaSecret"],
};

// ── Encryption Helpers ───────────────────────────────────────

function encryptData(modelName, data) {
  if (!data || typeof data !== "object") return data;

  const fields = ENCRYPTED_FIELDS[modelName.toLowerCase()];
  if (!fields) return data;

  const encrypted = { ...data };
  for (const field of fields) {
    if (encrypted[field] && typeof encrypted[field] === "string") {
      encrypted[field] = encrypt(encrypted[field]);
    }
  }
  return encrypted;
}

function decryptRecord(modelName, record) {
  if (!record || typeof record !== "object") return record;

  const fields = ENCRYPTED_FIELDS[modelName.toLowerCase()];
  if (!fields) return record;

  const decrypted = { ...record };
  for (const field of fields) {
    if (decrypted[field] && typeof decrypted[field] === "string" && isEncrypted(decrypted[field])) {
      try {
        decrypted[field] = decrypt(decrypted[field]);
      } catch (error) {
        console.error(`[CRYPTO-EXT] Failed to decrypt ${modelName}.${field}:`, error.message);
      }
    }
  }

  return decrypted;
}

// ── Prisma Extension ──────────────────────────────────────────

/**
 * Creates a Prisma extension for field-level encryption.
 * 
 * @returns {import('@prisma/client').Prisma.Extension}
 */
export const encryptionExtension = {
  name: "encryption",
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        // ── 1. Handle Writes (Encryption) ─────────────────────
        
        // Handle single create/update
        if (["create", "update", "upsert"].includes(operation)) {
          if (args.data) {
            args.data = encryptData(model, args.data);
          }
          if (operation === "upsert") {
            if (args.create) args.create = encryptData(model, args.create);
            if (args.update) args.update = encryptData(model, args.update);
          }
        }

        // Handle bulk create/update
        if (["createMany", "updateMany"].includes(operation)) {
          if (Array.isArray(args.data)) {
            args.data = args.data.map(item => encryptData(model, item));
          } else if (args.data) {
            args.data = encryptData(model, args.data);
          }
        }

        // ── 2. Execute Query ──────────────────────────────────
        const result = await query(args);

        // ── 3. Handle Reads (Decryption) ──────────────────────
        if (!result) return result;

        if ([
          "findUnique", "findUniqueOrThrow", 
          "findFirst", "findFirstOrThrow", 
          "findMany", "create", "update", "upsert"
        ].includes(operation)) {
          if (Array.isArray(result)) {
            return result.map(record => decryptRecord(model, record));
          }
          return decryptRecord(model, result);
        }

        return result;
      }
    }
  }
};

// ── Standalone Helpers ────────────────────────────────────────

export function encryptAddress(address) {
  return encryptData("address", address);
}

export function decryptAddress(address) {
  return decryptRecord("address", address);
}
