"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initPerformanceMonitor } from "@/lib/performance";

/**
 * MAISON NOIR — Client-Side Monitoring Provider
 * Senior Standard: Auto-initializes performance monitoring and page view tracking.
 * 
 * Add to layout.js: <MonitoringProvider />
 */
export default function MonitoringProvider() {
    const pathname = usePathname();

    // Initialize Core Web Vitals tracking once
    useEffect(() => {
        initPerformanceMonitor();
    }, []);

    // Track page views on route change
    useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            console.log(`[MONITOR] Page View: ${pathname}`);
        }

        // Production: fire page view event
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "page_view", {
                page_path: pathname,
                page_title: document.title,
            });
        }
    }, [pathname]);

    return null; // Invisible provider
}
