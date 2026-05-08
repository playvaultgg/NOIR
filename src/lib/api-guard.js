import { NextResponse } from 'next/server';

/**
 * MAISON NOIR — API Security Guard
 * Senior Developer Standard: Reusable middleware for protecting API routes.
 *
 * Usage in any API route:
 *   import { withApiSecurity } from '@/lib/api-guard';
 *   export const POST = withApiSecurity(handler, { methods: ['POST'], rateLimit: 10 });
 */

import { rateLimit } from '@/lib/rate-limit';
import { getClientFingerprint } from '@/lib/security';

const limiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 500 });

export function withApiSecurity(handler, options = {}) {
    const {
        methods = ['GET', 'POST'],
        rateLimitMax = 30,
        requireAuth = false,
    } = options;

    return async function securedHandler(request, context) {
        // 1. Method Validation
        if (!methods.includes(request.method)) {
            return NextResponse.json(
                { error: `Method ${request.method} not allowed` },
                { status: 405 }
            );
        }

        // 2. Rate Limiting
        const fingerprint = getClientFingerprint(request);
        const { isRateLimited, remaining } = limiter.check(null, rateLimitMax, fingerprint);

        if (isRateLimited) {
            return NextResponse.json(
                { error: 'Rate limit exceeded. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': '60',
                        'X-RateLimit-Remaining': '0',
                    },
                }
            );
        }

        // 3. Request Size Guard (prevent payload attacks)
        const contentLength = request.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > 1_000_000) {
            return NextResponse.json(
                { error: 'Request payload too large' },
                { status: 413 }
            );
        }

        // 4. Execute the actual handler
        try {
            const response = await handler(request, context);

            // Inject security headers into the response
            response.headers.set('X-RateLimit-Remaining', String(remaining));
            response.headers.set('X-Content-Type-Options', 'nosniff');

            return response;
        } catch (error) {
            console.error('[API-GUARD] Unhandled Error:', error);
            return NextResponse.json(
                { error: 'Internal server error' },
                { status: 500 }
            );
        }
    };
}
