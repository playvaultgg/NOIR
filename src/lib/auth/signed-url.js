import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * MAISON NOIR — 3D Asset Protection
 * Generates time-limited signed URLs for protected 3D assets (GLTF/GLB).
 * 
 * Flow:
 * 1. Request asset from private S3 bucket
 * 2. Generate pre-signed URL (15 min expiry)
 * 3. Client uses this URL in Three.js GLTFLoader
 */

const s3Client = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

/**
 * Generate a signed URL for a specific asset in S3.
 * 
 * @param {string} key - The S3 object key (path to the 3D model)
 * @param {number} expiresIn - Expiry time in seconds (default 900s / 15min)
 * @returns {Promise<string>} - The pre-signed URL
 */
export async function generateSignedAssetUrl(key, expiresIn = 900) {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        console.warn("[SECURITY] AWS credentials missing. Signed URL generation skipped.");
        return key; // Fallback to raw key/URL in dev if credentials aren't set
    }

    try {
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn });
        return url;
    } catch (error) {
        console.error("[SECURITY] Error generating signed URL:", error);
        throw new Error("Failed to secure asset URL");
    }
}
