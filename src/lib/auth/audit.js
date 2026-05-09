import prisma from "@/lib/prisma";

/**
 * MAISON NOIR — Audit Ledger (Layer 6)
 * Immutable logging system for every security-relevant action.
 */

/**
 * Log a security action to the database.
 * INSERT-only: This table should never be updated or deleted.
 */
export async function logAction({ userId, action, req, metadata = {} }) {
    try {
        const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
        const userAgent = req.headers.get("user-agent") || "unknown";
        
        // We'll use a SHA-256 hash of IP + UA as a simple fingerprint if full fingerprint isn't provided
        const fingerprint = metadata.fingerprint || "unknown";

        await prisma.auditlog.create({
            data: {
                userId,
                action, // Must match AuditAction enum
                ipAddress,
                fingerprint,
                metadata: {
                    ...metadata,
                    userAgent
                }
            }
        });
    } catch (error) {
        console.error("[AUDIT] Failed to write audit log:", error.message);
    }
}

/**
 * Get recent login attempts for account lockout logic.
 */
export async function getRecentLoginAttempts(userId, minutes = 15) {
    const since = new Date(Date.now() - minutes * 60 * 1000);
    
    return await prisma.auditlog.count({
        where: {
            userId,
            action: "LOGIN_FAILED",
            createdAt: { gte: since }
        }
    });
}
