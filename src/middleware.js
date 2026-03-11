import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

        // Protect Admin routes - strictly for ADMIN role
        if (isAdminRoute && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    },
    {
        callbacks: {
            // Basic check: is the user logged in at all?
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    // Define which paths trigger this middleware
    matcher: ["/admin/:path*", "/dashboard/:path*"],
};
