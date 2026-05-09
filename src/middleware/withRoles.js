import { NextResponse } from "next/server";

/**
 * RBAC Middleware Wrapper
 * Ensures the authenticated user has one of the required roles.
 */
export function withRoles(allowedRoles) {
    return async (req) => {
        if (!req.user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return NextResponse.json({ 
                error: "Access denied: insufficient permissions" 
            }, { status: 403 });
        }

        return null; // Success — continue chain
    };
}
