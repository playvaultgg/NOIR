import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

/**
 * MAISON NOIR — Role-Based Access Control Middleware
 * Enforces role-level authorization on API routes.
 *
 * Role Hierarchy (highest → lowest):
 *   SUPER_ADMIN > ADMIN > SELLER > USER > GUEST
 *
 * Usage:
 *   import { withRoles } from "@/middleware/withRoles";
 *
 *   // Only ADMIN and SUPER_ADMIN can access
 *   export const POST = withRoles(["ADMIN", "SUPER_ADMIN"])(handler);
 *
 *   // Inline check
 *   import { requireRole } from "@/middleware/withRoles";
 *   const { session, error } = await requireRole(["ADMIN"]);
 */

// ── Role Hierarchy Map (for "at least" checks) ──────────────

const ROLE_HIERARCHY = {
  GUEST: 0,
  USER: 1,
  SELLER: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};

// ── Wrapper Style ────────────────────────────────────────────

/**
 * @param {string[]} allowedRoles - Array of roles permitted to access this route
 */
export function withRoles(allowedRoles) {
  return function middleware(handler) {
    return async function roleProtectedHandler(request, context) {
      const session = await getServerSession(authOptions);

      // Step 1: Must be authenticated
      if (!session?.user) {
        return NextResponse.json(
          {
            error: "Authentication required",
            code: "UNAUTHORIZED",
          },
          { status: 401 }
        );
      }

      // Step 2: Must have an allowed role
      const userRole = session.user.role;
      if (!allowedRoles.includes(userRole)) {
        console.warn(
          `[RBAC] Access denied: User ${session.user.id} with role "${userRole}" attempted to access ${request.method} ${request.url}. Allowed: [${allowedRoles.join(", ")}]`
        );

        return NextResponse.json(
          {
            error: "Insufficient permissions",
            code: "FORBIDDEN",
            required: allowedRoles,
          },
          { status: 403 }
        );
      }

      return handler(request, { ...context, session });
    };
  };
}

// ── Inline Style ─────────────────────────────────────────────

/**
 * @param {string[]} allowedRoles - Array of roles permitted
 */
export async function requireRole(allowedRoles) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json(
        { error: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 }
      ),
    };
  }

  if (!allowedRoles.includes(session.user.role)) {
    console.warn(
      `[RBAC] Inline access denied: User ${session.user.id} role="${session.user.role}" required=[${allowedRoles.join(", ")}]`
    );

    return {
      session: null,
      error: NextResponse.json(
        {
          error: "Insufficient permissions",
          code: "FORBIDDEN",
          required: allowedRoles,
        },
        { status: 403 }
      ),
    };
  }

  return { session, error: null };
}

// ── Minimum Role Check ──────────────────────────────────────

/**
 * Check if a user has at least a minimum role level.
 *
 * Usage:
 *   import { hasMinimumRole } from "@/middleware/withRoles";
 *   if (hasMinimumRole(session.user.role, "ADMIN")) { ... }
 */
export function hasMinimumRole(userRole, minimumRole) {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[minimumRole] || 0);
}
