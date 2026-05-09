import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * MAISON NOIR — Zod Validation Middleware
 * Enterprise-grade request validation for all API routes.
 *
 * Features:
 *   - Validates request body, query params, and route params
 *   - XSS sanitization on all string inputs
 *   - Structured error responses with field-level detail
 *   - Audit-ready logging of rejected requests
 *
 * Usage:
 *   import { withValidation } from "@/middleware/withValidation";
 *   import { LoginSchema } from "@/lib/validation/schemas";
 *
 *   export const POST = withValidation(LoginSchema)(async (req, { validated }) => {
 *     const { email, password } = validated;
 *     // ... business logic
 *   });
 */

// ── XSS Sanitizer ────────────────────────────────────────────

const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,        // onclick=, onerror=, etc.
  /data:\s*text\/html/gi,
  /vbscript:/gi,
  /expression\s*\(/gi,  // CSS expression()
];

function sanitizeString(input) {
  if (typeof input !== "string") return input;

  let sanitized = input;

  // Strip dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, "");
  }

  // Encode critical HTML entities
  sanitized = sanitized
    .replace(/&(?!amp;|lt;|gt;|quot;|#x27;|#x2F;)/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return sanitized;
}

function sanitizeDeep(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "string") return sanitizeString(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeDeep);
  if (typeof obj === "object" && !(obj instanceof Date)) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = sanitizeDeep(value);
    }
    return result;
  }
  return obj;
}

// ── Error Formatter ──────────────────────────────────────────

function formatZodErrors(error) {
  return error.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
    code: err.code,
  }));
}

// ── Validation Middleware Factory ─────────────────────────────

/**
 * Creates a validated API route handler.
 *
 * @param {z.ZodSchema} bodySchema   - Zod schema for request body (POST/PUT/PATCH)
 * @param {z.ZodSchema} [querySchema] - Optional Zod schema for URL query params
 * @param {z.ZodSchema} [paramsSchema] - Optional Zod schema for route params
 *
 * @returns {Function} Middleware that wraps an API handler
 */
export function withValidation(bodySchema, querySchema, paramsSchema) {
  return function middleware(handler) {
    return async function validatedHandler(request, context) {
      try {
        const validated = {};

        // ── 1. Validate Route Params ────────────────────────
        if (paramsSchema && context?.params) {
          const resolvedParams = await context.params;
          const paramsResult = paramsSchema.safeParse(resolvedParams);
          if (!paramsResult.success) {
            return NextResponse.json(
              {
                error: "Invalid route parameters",
                details: formatZodErrors(paramsResult.error),
              },
              { status: 400 }
            );
          }
          validated.params = paramsResult.data;
        }

        // ── 2. Validate Query Params ────────────────────────
        if (querySchema) {
          const url = new URL(request.url);
          const queryObj = Object.fromEntries(url.searchParams.entries());
          const queryResult = querySchema.safeParse(queryObj);
          if (!queryResult.success) {
            return NextResponse.json(
              {
                error: "Invalid query parameters",
                details: formatZodErrors(queryResult.error),
              },
              { status: 400 }
            );
          }
          validated.query = queryResult.data;
        }

        // ── 3. Validate Request Body ────────────────────────
        if (
          bodySchema &&
          ["POST", "PUT", "PATCH"].includes(request.method)
        ) {
          let body;
          try {
            body = await request.json();
          } catch {
            return NextResponse.json(
              { error: "Invalid JSON in request body" },
              { status: 400 }
            );
          }

          // Sanitize all string inputs before validation
          const sanitizedBody = sanitizeDeep(body);

          const bodyResult = bodySchema.safeParse(sanitizedBody);
          if (!bodyResult.success) {
            // Log the rejected request for security monitoring
            console.warn(
              `[GATEKEEPER] Validation rejected: ${request.method} ${request.url}`,
              {
                errors: formatZodErrors(bodyResult.error),
                ip: request.headers.get("x-forwarded-for") || "unknown",
                userAgent: request.headers.get("user-agent")?.substring(0, 100),
              }
            );

            return NextResponse.json(
              {
                error: "Validation failed",
                details: formatZodErrors(bodyResult.error),
              },
              { status: 422 }
            );
          }
          validated.body = bodyResult.data;
        }

        // ── 4. Execute Handler with Validated Data ──────────
        return handler(request, { ...context, validated });
      } catch (error) {
        if (error instanceof ZodError) {
          return NextResponse.json(
            {
              error: "Validation error",
              details: formatZodErrors(error),
            },
            { status: 422 }
          );
        }
        throw error; // Re-throw unexpected errors
      }
    };
  };
}

/**
 * Standalone validation helper for use inside existing handlers.
 *
 * Usage:
 *   import { validateBody } from "@/middleware/withValidation";
 *   import { LoginSchema } from "@/lib/validation/schemas";
 *
 *   export async function POST(req) {
 *     const { data, error } = await validateBody(req, LoginSchema);
 *     if (error) return error; // Returns NextResponse with 422
 *     // data is now typed and validated
 *   }
 */
export async function validateBody(request, schema) {
  try {
    const body = await request.json();
    const sanitized = sanitizeDeep(body);
    const result = schema.safeParse(sanitized);

    if (!result.success) {
      console.warn(
        `[GATEKEEPER] Inline validation rejected: ${request.method} ${request.url}`,
        { errors: formatZodErrors(result.error) }
      );

      return {
        data: null,
        error: NextResponse.json(
          {
            error: "Validation failed",
            details: formatZodErrors(result.error),
          },
          { status: 422 }
        ),
      };
    }

    return { data: result.data, error: null };
  } catch {
    return {
      data: null,
      error: NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      ),
    };
  }
}

/**
 * Validate query params from a request URL.
 */
export function validateQuery(request, schema) {
  const url = new URL(request.url);
  const queryObj = Object.fromEntries(url.searchParams.entries());
  const result = schema.safeParse(queryObj);

  if (!result.success) {
    return {
      data: null,
      error: NextResponse.json(
        {
          error: "Invalid query parameters",
          details: formatZodErrors(result.error),
        },
        { status: 400 }
      ),
    };
  }

  return { data: result.data, error: null };
}
