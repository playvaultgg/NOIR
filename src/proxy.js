import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Simple Memory-based Rate Limiter for Dev/Simulation
const rateLimitMap = new Map();

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;

        // 1. Rate Limiting Logic (Injected)
        if (pathname.startsWith("/api/checkout")) {
            const ip = req.ip || "127.0.0.1";
            const now = Date.now();
            const windowSize = 60 * 1000;
            const maxRequests = 10;

            const userRequests = rateLimitMap.get(ip) || [];
            const validRequests = userRequests.filter(ts => now - ts < windowSize);
            
            if (validRequests.length >= maxRequests) {
                return new NextResponse(
                    JSON.stringify({ error: "Too many requests. Please try again in a minute." }),
                    { status: 429, headers: { 'content-type': 'application/json' } }
                );
            }

            validRequests.push(now);
            rateLimitMap.set(ip, validRequests);
        }

        // 2. Admin Check Logic (Existing)
        if (req.nextUrl.pathname.startsWith("/admin")) {
            if (req.nextauth.token?.role !== "ADMIN") {
                return NextResponse.redirect(new URL("/", req.url));
            }
        }

        // 3. Security Headers (Senior Standard)
        const response = NextResponse.next();

        const cspHeader = `
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com;
            style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
            img-src 'self' blob: data: https://images.unsplash.com https://*.razorpay.com https://plus.unsplash.com;
            font-src 'self' https://fonts.gstatic.com;
            frame-src 'self' https://api.razorpay.com;
            connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com;
        `.replace(/\s{2,}/g, ' ').trim();

        response.headers.set('Content-Security-Policy', cspHeader);
        response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
        response.headers.set('X-XSS-Protection', '1; mode=block');
        response.headers.set('X-Frame-Options', 'SAMEORIGIN');
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
        response.headers.set('X-DNS-Prefetch-Control', 'on');

        return response;
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // Allow non-admin routes to bypass mandatory login if they are checkout APIs
                if (req.nextUrl.pathname.startsWith("/api/checkout")) return true;
                return !!token;
            },
        },
    }
);

export const config = { matcher: ["/admin/:path*", "/api/checkout/:path*"] };

