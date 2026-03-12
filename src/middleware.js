import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Simple Memory-based Rate Limiter fallback for development
// In production, Upstash Redis or a similar service is recommended.
const rateLimitMap = new Map();

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    // Only rate limit API routes and sensitive paths
    if (pathname.startsWith("/api/checkout") || pathname.startsWith("/api/auth")) {
        const ip = req.ip || "127.0.0.1";
        const now = Date.now();
        const windowSize = 60 * 1000; // 1 minute
        const maxRequests = 10; // Max 10 requests per minute per IP

        const userRequests = rateLimitMap.get(ip) || [];
        const validRequests = userRequests.filter(timestamp => now - timestamp < windowSize);
        
        if (validRequests.length >= maxRequests) {
            return new NextResponse(
                JSON.stringify({ error: "Too many requests. Please try again in a minute." }),
                { status: 429, headers: { 'content-type': 'application/json' } }
            );
        }

        validRequests.push(now);
        rateLimitMap.set(ip, validRequests);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/api/:path*"],
};
