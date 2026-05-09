import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/crypto/tokens";

/**
 * Authentication Middleware Wrapper
 * Verifies the presence and validity of the Access Token in cookies.
 */
export async function withAuth(req) {
    const token = req.cookies.get("access_token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    try {
        const payload = await verifyAccessToken(token);
        // Add payload to request for downstream middlewares
        req.user = payload;
        return null; // Success — continue chain
    } catch (error) {
        return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }
}
