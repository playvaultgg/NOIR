import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

/**
 * MAISON NOIR — Redis-Backed Rate Limiter (Upstash)
 * Enterprise-grade, distributed rate limiting with sliding window algorithm.
 *
 * Unlike the old LRU cache limiter, this persists across deploys
 * and works correctly in Vercel's serverless/edge environment.
 *
 * Route Profiles:
 *   LOGIN    → 5 attempts per 15 minutes (brute-force prevention)
 *   SIGNUP   → 3 attempts per hour (spam prevention)
 *   CHECKOUT → 10 attempts per minute (abuse prevention)
 *   API      → 60 requests per minute (general API protection)
 *   STRICT   → 3 requests per minute (sensitive operations)
 */

// ── Redis Client ─────────────────────────────────────────────

let redis;

function getRedis() {
  if (!redis) {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.warn("[RATE-LIMIT] Upstash Redis not configured. Rate limiting disabled.");
      return null;
    }
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redis;
}

// ── Rate Limit Profiles ──────────────────────────────────────

const PROFILES = {
  LOGIN: {
    prefix: "rl:login",
    limiter: Ratelimit.slidingWindow(5, "15 m"),  // 5 attempts per 15 min
    retryAfter: 900, // seconds
  },
  SIGNUP: {
    prefix: "rl:signup",
    limiter: Ratelimit.slidingWindow(3, "1 h"),    // 3 attempts per hour
    retryAfter: 3600,
  },
  CHECKOUT: {
    prefix: "rl:checkout",
    limiter: Ratelimit.slidingWindow(10, "1 m"),   // 10 per minute
    retryAfter: 60,
  },
  API: {
    prefix: "rl:api",
    limiter: Ratelimit.slidingWindow(60, "1 m"),   // 60 per minute
    retryAfter: 60,
  },
  STRICT: {
    prefix: "rl:strict",
    limiter: Ratelimit.slidingWindow(3, "1 m"),    // 3 per minute (password reset, MFA, etc.)
    retryAfter: 60,
  },
  PASSWORD_RESET: {
    prefix: "rl:pwreset",
    limiter: Ratelimit.slidingWindow(3, "15 m"),   // 3 per 15 min
    retryAfter: 900,
  },
};

// ── Create Limiter Instance ──────────────────────────────────

function createLimiter(profileName) {
  const redisClient = getRedis();
  if (!redisClient) return null;

  const profile = PROFILES[profileName];
  if (!profile) {
    console.error(`[RATE-LIMIT] Unknown profile: ${profileName}`);
    return null;
  }

  return new Ratelimit({
    redis: redisClient,
    limiter: profile.limiter,
    prefix: profile.prefix,
    analytics: true,
  });
}

// ── Get Client Identifier ────────────────────────────────────

export function getClientIdentifier(request, userId) {
  if (userId) return `user:${userId}`;

  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return `ip:${ip}`;
}

// ── Rate Limit Check ─────────────────────────────────────────

/**
 * Check rate limit for a specific profile and identifier.
 *
 * @param {string} profileName - One of: LOGIN, SIGNUP, CHECKOUT, API, STRICT
 * @param {string} identifier  - Client identifier (IP or userId)
 * @returns {{ success: boolean, remaining: number, reset: number, retryAfter: number }}
 */
export async function checkRateLimit(profileName, identifier) {
  const limiter = createLimiter(profileName);

  // If Redis is not configured, allow all requests (dev mode)
  if (!limiter) {
    return { success: true, remaining: 999, reset: 0, retryAfter: 0 };
  }

  const profile = PROFILES[profileName];
  const result = await limiter.limit(identifier);

  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
    retryAfter: result.success ? 0 : profile.retryAfter,
  };
}

// ── Rate Limit Response ──────────────────────────────────────

/**
 * Returns a 429 Too Many Requests response with proper headers.
 */
export function rateLimitResponse(result, profileName) {
  const profile = PROFILES[profileName];

  return NextResponse.json(
    {
      error: "Too many requests. Please try again later.",
      code: "RATE_LIMIT_EXCEEDED",
      retryAfter: profile.retryAfter,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(profile.retryAfter),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(result.reset),
      },
    }
  );
}

// ── Middleware Wrapper ────────────────────────────────────────

/**
 * Rate limiting middleware for API routes.
 *
 * Usage:
 *   import { withRateLimit } from "@/lib/rateLimit/redis-limiter";
 *
 *   export const POST = withRateLimit("LOGIN")(async (req) => {
 *     // ... handler logic
 *   });
 */
export function withRateLimit(profileName) {
  return function middleware(handler) {
    return async function rateLimitedHandler(request, context) {
      const identifier = getClientIdentifier(request);
      const result = await checkRateLimit(profileName, identifier);

      if (!result.success) {
        console.warn(
          `[RATE-LIMIT] ${profileName} limit exceeded for ${identifier}`
        );
        return rateLimitResponse(result, profileName);
      }

      // Inject rate limit info into response headers
      const response = await handler(request, context);

      if (response?.headers) {
        response.headers.set("X-RateLimit-Remaining", String(result.remaining));
        response.headers.set("X-RateLimit-Reset", String(result.reset));
      }

      return response;
    };
  };
}

/**
 * Inline rate limit check for use inside existing handlers.
 *
 * Usage:
 *   const { limited, response } = await inlineRateLimit(req, "LOGIN");
 *   if (limited) return response;
 */
export async function inlineRateLimit(request, profileName, userId) {
  const identifier = getClientIdentifier(request, userId);
  const result = await checkRateLimit(profileName, identifier);

  if (!result.success) {
    console.warn(
      `[RATE-LIMIT] ${profileName} limit exceeded for ${identifier}`
    );
    return { limited: true, response: rateLimitResponse(result, profileName) };
  }

  return { limited: false, response: null, remaining: result.remaining };
}
