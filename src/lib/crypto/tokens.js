import { SignJWT, jwtVerify } from "jose";
import crypto from "crypto";

/**
 * MAISON NOIR — Sovereign Token Management
 * Using 'jose' for high-performance edge-compatible JWT operations.
 */

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-change-me");

/**
 * Generate an Access Token (15m expiry).
 */
export async function generateAccessToken(userId, role) {
    return await new SignJWT({ userId, role })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("15m")
        .sign(JWT_SECRET);
}

/**
 * Generate a cryptographically secure Refresh Token.
 */
export function generateRefreshToken() {
    return crypto.randomBytes(64).toString("hex");
}

/**
 * Verify an Access Token.
 */
export async function verifyAccessToken(token) {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch (error) {
        throw new Error("Invalid or expired access token");
    }
}

/**
 * Hash a token for secure database storage (SHA-256).
 * Prevents plain-text token theft from database dumps.
 */
export function hashToken(token) {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
}
