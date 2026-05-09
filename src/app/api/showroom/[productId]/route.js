import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { verifyAccessToken } from "@/lib/crypto/tokens";
import { apiLimiter, getIp } from "@/lib/rateLimit/limiter";
import { logAction } from "@/lib/auth/audit";
import prisma from "@/lib/prisma";

/**
 * MAISON NOIR — Protected 3D Asset Server
 * Serves time-limited signed URLs for high-end boutique assets.
 */

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export async function GET(req, { params }) {
    const { productId } = params;
    const token = req.cookies.get("access_token")?.value;

    try {
        // 1. Verify user session & Identity
        if (!token) throw new Error("Unauthorized");
        const userPayload = await verifyAccessToken(token);

        // 2. Role-Based Access Check
        // Ensure user is authenticated (roles like USER, ADMIN, etc.)
        const allowedRoles = ["USER", "SELLER", "ADMIN", "SUPER_ADMIN"];
        if (!allowedRoles.includes(userPayload.role)) {
            return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
        }

        // 3. Application-Level Rate Limiting
        const ip = getIp(req);
        const { success } = await apiLimiter.limit(`showroom:${userPayload.userId}`);
        if (!success) {
            return NextResponse.json({ error: "Too many asset requests" }, { status: 429 });
        }

        // 4. Fetch the private asset identifier from DB
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { slug: true, category: true }
        });

        if (!product) {
            return NextResponse.json({ error: "Product asset not found" }, { status: 404 });
        }

        // 5. Generate Cloudinary Signed URL (15 min expiry)
        // Note: 'public_id' should point to the private 3D asset in Cloudinary
        const publicId = `showroom/models/${product.slug || productId}`;
        
        const signedUrl = cloudinary.utils.private_download_url(publicId, "glb", {
            expires_at: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes
        });

        // 6. Log access in AuditLog
        await logAction({
            userId: userPayload.userId,
            action: "ADMIN_ACTION", // Using ADMIN_ACTION or a custom action like ASSET_ACCESS if defined
            req,
            metadata: { 
                productId, 
                assetType: "3D_MODEL",
                reason: "Signed URL generation for showroom"
            }
        });

        // 7. Return signed URL — NEVER the raw asset URL
        return NextResponse.json({ 
            url: signedUrl,
            expiresIn: "15m",
            type: "GLB"
        });

    } catch (error) {
        console.error("[SHOWROOM-API] Error:", error.message);
        return NextResponse.json(
            { error: error.message === "Unauthorized" ? "Authentication required" : "Internal server error" }, 
            { status: error.message === "Unauthorized" ? 401 : 500 }
        );
    }
}
