import { NextResponse } from "next/server";
import { apiLimiter, getIp } from "@/lib/rateLimit/limiter";
import { verifyAccessToken } from "@/lib/crypto/tokens";

/**
 * MAISON NOIR — Central Security Proxy (The Gatekeeper)
 * Chains: Rate Limiting -> Auth -> RBAC -> Audit Triggers
 */

export async function middleware(req) {
    const pathname = req.nextUrl.pathname;

    // ── 1. GLOBAL RATE LIMITING ──
    // Apply to all API routes
    if (pathname.startsWith("/api")) {
        const ip = getIp(req);
        const { success, limit, remaining, reset } = await apiLimiter.limit(ip);

        if (!success) {
            return NextResponse.json(
                { error: "Too many requests. Please slow down." },
                { 
                    status: 429,
                    headers: {
                        "Retry-After": new Date(reset).toUTCString(),
                        "X-RateLimit-Limit": limit.toString(),
                        "X-RateLimit-Remaining": remaining.toString()
                    }
                }
            );
        }
    }

    // ── 2. PROTECTED ROUTE DEFINITIONS ──
    const isAuthRoute = pathname.startsWith("/api/user") || 
                       pathname.startsWith("/api/admin") || 
                       pathname.startsWith("/api/seller") ||
                       pathname.startsWith("/api/showroom") ||
                       pathname.startsWith("/api/checkout");

    if (isAuthRoute) {
        const token = req.cookies.get("access_token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        try {
            const user = await verifyAccessToken(token);

            // ── 3. RBAC ENFORCEMENT ──
            if (pathname.startsWith("/api/admin") && !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
                return NextResponse.json({ error: "Admin access required" }, { status: 403 });
            }

            if (pathname.startsWith("/api/seller") && !["SELLER", "ADMIN", "SUPER_ADMIN"].includes(user.role)) {
                return NextResponse.json({ error: "Seller access required" }, { status: 403 });
            }

            // Authentication & Authorization passed
            const response = NextResponse.next();
            
            // Inject security headers
            response.headers.set("X-Frame-Options", "DENY");
            response.headers.set("X-Content-Type-Options", "nosniff");
            response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
            
            return response;
        } catch (error) {
            return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
        }
    }

    return NextResponse.next();
}

// Configure middleware matcher
export const config = {
    matcher: ["/api/:path*"],
};
