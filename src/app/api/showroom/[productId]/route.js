import { NextResponse } from "next/server";
import { withAuth } from "@/middleware/withAuth";
import { withValidation } from "@/middleware/withValidation";
import { ProductParamsSchema } from "@/lib/validation/schemas";
import { generateSignedAssetUrl } from "@/lib/auth/signed-url";
import prisma from "@/lib/prisma";
import { inlineRateLimit } from "@/lib/rateLimit/redis-limiter";

/**
 * MAISON NOIR — Showroom Asset API
 * Provides secured, time-limited URLs for 3D product models.
 * 
 * Logic:
 * 1. Validate productId
 * 2. Authenticate user
 * 3. Rate limit access (prevent bulk scraping of 3D assets)
 * 4. Fetch asset metadata from DB
 * 5. Generate signed URL
 */

async function showroomHandler(request, { params, session }) {
    const { productId } = params;

    // 1. Rate Limiting (Protected from scraping)
    const { limited, response } = await inlineRateLimit(request, "API", session.user.id);
    if (limited) return response;

    try {
        // 2. Fetch Product 3D Metadata
        // Note: Assuming there's a field or relation for 3D models.
        // If not, we'll search the product record.
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { 
                id: true, 
                name: true,
                // In a real implementation, we'd have a specific field for the 3D key
                // For now, we'll assume the imageUrls contains a 3D key or we use a placeholder
            }
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // 3. Generate Signed URL
        // Placeholder key: product-assets/[productId]/model.glb
        const s3Key = `product-assets/${productId}/model.glb`;
        const signedUrl = await generateSignedAssetUrl(s3Key);

        return NextResponse.json({
            productId: product.id,
            name: product.name,
            assetUrl: signedUrl,
            expiresIn: 900, // 15 minutes
        });

    } catch (error) {
        console.error("[SHOWROOM_API] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// Chain: Validation (Params) -> Auth -> Handler
export const GET = withValidation(null, null, ProductParamsSchema)(
    withAuth(showroomHandler)
);
