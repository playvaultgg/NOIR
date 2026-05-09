import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * MAISON NOIR — Sovereign Rate Limiting (Shield Layer)
 * Powered by Upstash Redis for global distributed protection.
 */

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error("Upstash Redis environment variables are missing");
}

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// ── Rate Limiters ─────────────────────────────────────────────

// 1. Login Limiter: 5 attempts per 15 minutes per IP
export const loginLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    analytics: true,
    prefix: "noir:ratelimit:login",
});

// 2. Signup Limiter: 3 attempts per 1 hour per IP
export const signupLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 h"),
    analytics: true,
    prefix: "noir:ratelimit:signup",
});

// 3. Checkout Limiter: 10 attempts per 1 minute per UserID
export const checkoutLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
    prefix: "noir:ratelimit:checkout",
});

// 4. API Limiter: 100 attempts per 1 minute per IP (General purpose)
export const apiLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 m"),
    analytics: true,
    prefix: "noir:ratelimit:api",
});

/**
 * Helper to extract IP for rate limiting from request headers.
 */
export function getIp(req) {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    return "127.0.0.1";
}
