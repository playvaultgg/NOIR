import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * MAISON NOIR — Sovereign Proxy / Middleware
 * 
 * Note: This project uses 'proxy.js' as the middleware convention.
 * Chains: Rate Limiting → Authorization → Security Headers
 */

// ── In-Memory Rate Limiter (Dev Fallback) ─────────────────────
const rateLimitMap = new Map();

const devRateLimit = (req) => {
    const { pathname } = req.nextUrl;
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
    return null;
};

// ── Security Headers (Sovereign Standard) ────────────────────
const injectSecurityHeaders = (response) => {
    const cspDirectives = [
        "default-src 'self'",
        `script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV === "development" ? "'unsafe-eval'" : ""} https://checkout.razorpay.com https://www.googletagmanager.com https://www.google-analytics.com`,
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com https://source.unsplash.com https://lh3.googleusercontent.com https://www.gstatic.com https://grainy-gradients.vercel.app https://loremflickr.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com https://www.google-analytics.com https://vitals.vercel-insights.com https://*.vercel.app wss://*.vercel.app",
        "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com",
        "worker-src 'self' blob:",
        "media-src 'self' blob:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests",
    ].join("; ");

    response.headers.set("Content-Security-Policy", cspDirectives);
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");
    response.headers.delete("X-Powered-By");
    
    return response;
};

// ── Main Middleware ──────────────────────────────────────────
export default withAuth(
    function middleware(req) {
        // 1. Rate Limiting
        const rateLimitResponse = devRateLimit(req);
        if (rateLimitResponse) return rateLimitResponse;

        // 2. Admin Authorization
        const { pathname } = req.nextUrl;
        if (pathname.startsWith("/admin")) {
            if (req.nextauth.token?.role !== "ADMIN") {
                return NextResponse.redirect(new URL("/", req.url));
            }
        }

        // 3. Finalize with Security Headers
        const response = NextResponse.next();
        return injectSecurityHeaders(response);
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;
                
                // ── PUBLIC ROUTE BYPASS (Essential to prevent redirect loops) ──
                if (
                    pathname === "/" ||
                    pathname.startsWith("/api/auth") ||    // Required for NextAuth
                    pathname.startsWith("/login") ||       // Sign-in page
                    pathname.startsWith("/register") ||    // Sign-up page
                    pathname.startsWith("/forgot-password") ||
                    pathname.startsWith("/contact") ||
                    pathname.startsWith("/about") ||
                    pathname.startsWith("/collections") ||
                    pathname.startsWith("/products") ||
                    pathname.startsWith("/api/checkout") || // Allow guest checkout
                    pathname.startsWith("/api/showroom") || // Allow public 3D viewing
                    pathname.startsWith("/api/ai")          // Allow public AI features
                ) {
                    return true;
                }
                
                // Everything else (Account, Orders, Admin) requires a valid token
                return !!token;
            },
        },
    }
);

export const config = { 
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)"] 
};
