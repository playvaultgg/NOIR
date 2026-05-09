import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

/**
 * MAISON NOIR — Authentication Middleware
 * Verifies that the request has a valid authenticated session.
 *
 * Usage (wrapper style):
 *   import { withAuth } from "@/middleware/withAuth";
 *
 *   export const GET = withAuth(async (req, { session }) => {
 *     // session.user.id, session.user.role are guaranteed available
 *   });
 *
 * Usage (inline style):
 *   import { requireAuth } from "@/middleware/withAuth";
 *
 *   export async function GET(req) {
 *     const { session, error } = await requireAuth();
 *     if (error) return error;
 *     // session is available
 *   }
 */

// ── Wrapper Style ────────────────────────────────────────────

export function withAuth(handler) {
  return async function authenticatedHandler(request, context) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Authentication required",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    return handler(request, { ...context, session });
  };
}

// ── Inline Style ─────────────────────────────────────────────

export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json(
        {
          error: "Authentication required",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      ),
    };
  }

  return { session, error: null };
}
