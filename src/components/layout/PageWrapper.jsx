"use client";

import { usePathname } from "next/navigation";

export default function PageWrapper({ children }) {
    const pathname = usePathname();
    const isAuthPage = ["/login", "/register", "/forgot-password"].includes(pathname) || pathname.startsWith("/admin");

    // If it's the auth page, we remove all padding to give the Auth layout full edge-to-edge space.
    // Like Zara or premium app experiences, Authentication requires complete focus without layout gaps.
    return (
        <main className={isAuthPage ? "min-h-screen" : "min-h-screen pt-20 pb-32 lg:pb-0"}>
            {children}
        </main>
    );
}
