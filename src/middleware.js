import { NextResponse } from "next/server";

/**
 * MAISON NOIR — Root Edge Middleware
 * Chains: Security Headers (CSP) → Route Protection
 *
 * Runs on Vercel's Edge Runtime before every request.
 * This is the first line of defense for the entire application.
 */

// ── Security Headers ─────────────────────────────────────────

function injectSecurityHeaders(response) {
  // Content Security Policy — controls what resources can load
  const cspDirectives = [
    "default-src 'self'",
    // Scripts: self + inline (Next.js needs it) + eval (dev only) + trusted CDNs
    `script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV === "development" ? "'unsafe-eval'" : ""} https://checkout.razorpay.com https://www.googletagmanager.com https://www.google-analytics.com`,
    // Styles: self + inline (Tailwind/Framer inject inline styles)
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    // Images: self + external image providers
    "img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com https://source.unsplash.com https://lh3.googleusercontent.com https://www.gstatic.com https://grainy-gradients.vercel.app https://loremflickr.com",
    // Fonts: self + Google Fonts
    "font-src 'self' https://fonts.gstatic.com data:",
    // API connections: self + payment gateways + analytics
    "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com https://www.google-analytics.com https://vitals.vercel-insights.com https://*.vercel.app wss://*.vercel.app",
    // Frames: only Razorpay checkout
    "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com",
    // Workers: self (for Three.js / service workers)
    "worker-src 'self' blob:",
    // Media: self + blob (for 3D assets)
    "media-src 'self' blob:",
    // Object embeds: none
    "object-src 'none'",
    // Base URI: self only
    "base-uri 'self'",
    // Form submissions: self only
    "form-action 'self'",
    // Frame ancestors: prevent clickjacking
    "frame-ancestors 'none'",
    // Block mixed content
    "upgrade-insecure-requests",
  ].join("; ");

  response.headers.set("Content-Security-Policy", cspDirectives);

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // Prevent MIME-type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Enable XSS filter (legacy browsers)
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Control referrer information leakage
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // HSTS: force HTTPS for 1 year + subdomains + preload list
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // Restrict browser features
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );

  // Remove server identification
  response.headers.delete("X-Powered-By");
  response.headers.delete("Server");

  return response;
}

// ── Protected Route Definitions ──────────────────────────────

const PROTECTED_ROUTES = ["/account", "/checkout", "/admin"];
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
const ADMIN_ROUTES = ["/admin"];

// ── Main Middleware ──────────────────────────────────────────

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets and API routes
  // (API routes handle their own auth via withApiSecurity)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static files (images, fonts, etc.)
  ) {
    return NextResponse.next();
  }

  // Create response and inject security headers
  const response = NextResponse.next();
  injectSecurityHeaders(response);

  // ── Route Protection Logic ──────────────────────────────
  // Note: Full auth verification happens in API routes.
  // This middleware handles CSP + basic redirect logic.
  // Token-based auth checks will be added in Module 1.

  return response;
}

// ── Matcher Config ───────────────────────────────────────────
// Run middleware on all routes except static assets

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)",
  ],
};
