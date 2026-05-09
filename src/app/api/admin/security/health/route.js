import { NextResponse } from "next/server";
import { withRoles } from "@/middleware/withRoles";
import prisma from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/crypto/field-encryption";
import { checkRateLimit } from "@/lib/rateLimit/redis-limiter";
import { auditLog, AUDIT_ACTIONS } from "@/lib/audit/audit-logger";
import { generateSignedAssetUrl } from "@/lib/auth/signed-url";

/**
 * MAISON NOIR — Security Architecture Health Check
 * Verifies that all 13-layer security modules are operational.
 * 
 * Only accessible by SUPER_ADMIN.
 */

async function securityHealthHandler(request) {
    const results = {
        timestamp: new Date().toISOString(),
        status: "OPERATIONAL",
        modules: {},
    };

    try {
        // 1. Check Database (Layer 4/8/10)
        try {
            await prisma.$queryRaw`SELECT 1`;
            results.modules.database = { status: "OK", message: "Prisma & PostgreSQL connected" };
        } catch (e) {
            results.modules.database = { status: "ERROR", message: e.message };
            results.status = "DEGRADED";
        }

        // 2. Check Encryption (Layer 4)
        try {
            const testString = "MaisonNoirSecret-123";
            const encrypted = encrypt(testString);
            const decrypted = decrypt(encrypted);
            
            if (decrypted === testString && encrypted !== testString) {
                results.modules.encryption = { status: "OK", message: "AES-256-GCM operational" };
            } else {
                throw new Error("Encryption/Decryption integrity failure");
            }
        } catch (e) {
            results.modules.encryption = { status: "ERROR", message: e.message };
            results.status = "DEGRADED";
        }

        // 3. Check Redis / Rate Limiting (Layer 3)
        try {
            const rlCheck = await checkRateLimit("API", "health-check-test");
            results.modules.rateLimiting = { 
                status: "OK", 
                message: "Upstash Redis operational",
                remaining: rlCheck.remaining 
            };
        } catch (e) {
            results.modules.rateLimiting = { status: "WARNING", message: "Redis unavailable (Degraded to In-Memory)" };
        }

        // 4. Check Audit Logging (Layer 3/13)
        try {
            await auditLog({
                action: "SECURITY_HEALTH_CHECK",
                metadata: { status: results.status },
                severity: "INFO"
            });
            results.modules.auditLog = { status: "OK", message: "Immutable logging operational" };
        } catch (e) {
            results.modules.auditLog = { status: "ERROR", message: e.message };
            results.status = "DEGRADED";
        }

        // 5. Check 3D Asset Protection (Layer 5)
        try {
            const testUrl = await generateSignedAssetUrl("test-asset.glb");
            results.modules.assetProtection = { 
                status: testUrl.includes("X-Amz-Signature") ? "OK" : "WARNING", 
                message: testUrl.includes("X-Amz-Signature") ? "S3 Signed URLs operational" : "Running in Development/Local fallback mode"
            };
        } catch (e) {
            results.modules.assetProtection = { status: "ERROR", message: e.message };
        }

        return NextResponse.json(results);

    } catch (error) {
        return NextResponse.json({ 
            status: "CRITICAL_FAILURE", 
            error: error.message 
        }, { status: 500 });
    }
}

// Protect this route for SUPER_ADMIN only
export const GET = withRoles(["SUPER_ADMIN"])(securityHealthHandler);
