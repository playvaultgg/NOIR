"use client";

import { useEffect } from "react";
import { useParams, usePathname } from "next/navigation";

export default function DiscoveryObserver() {
    const params = useParams();
    const pathname = usePathname();

    useEffect(() => {
        // Only track single product pages
        if (pathname.includes("/product/") && params.id) {
            const productId = params.id;
            
            try {
                const existing = JSON.parse(localStorage.getItem("maison_signature_v1") || "[]");
                
                // Filter out duplicates and keep only last 5 IDs for efficiency
                const updated = [
                    productId,
                    ...existing.filter(id => id !== productId)
                ].slice(0, 5);
                
                localStorage.setItem("maison_signature_v1", JSON.stringify(updated));
                console.log("[MAISON SIGNATURE] Behavioral node synchronized:", productId);
            } catch (e) {
                console.error("Signature synchronization failed.");
            }
        }
    }, [params, pathname]);

    return null; // Silent observer
}
