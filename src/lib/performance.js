/**
 * MAISON NOIR — Performance Monitor
 * Senior Developer Standard: Tracks Core Web Vitals, API latency, and resource timing.
 * 
 * Usage: Import in layout.js or a client component:
 *   import { initPerformanceMonitor } from '@/lib/performance';
 *   useEffect(() => { initPerformanceMonitor(); }, []);
 */

/**
 * Core Web Vitals observer.
 * Captures LCP, FID, CLS, FCP, and TTFB.
 */
export function initPerformanceMonitor() {
    if (typeof window === "undefined") return;

    // Largest Contentful Paint
    observeMetric("largest-contentful-paint", (entries) => {
        const lcp = entries[entries.length - 1];
        reportMetric("LCP", lcp.startTime);
    });

    // First Input Delay
    observeMetric("first-input", (entries) => {
        const fid = entries[0];
        reportMetric("FID", fid.processingStart - fid.startTime);
    });

    // Cumulative Layout Shift
    observeMetric("layout-shift", (entries) => {
        let clsScore = 0;
        entries.forEach(entry => {
            if (!entry.hadRecentInput) clsScore += entry.value;
        });
        reportMetric("CLS", clsScore);
    });

    // Navigation Timing
    if (window.performance?.timing) {
        window.addEventListener("load", () => {
            setTimeout(() => {
                const timing = performance.timing;
                const metrics = {
                    dns: timing.domainLookupEnd - timing.domainLookupStart,
                    tcp: timing.connectEnd - timing.connectStart,
                    ttfb: timing.responseStart - timing.requestStart,
                    domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
                    fullLoad: timing.loadEventEnd - timing.navigationStart,
                };
                reportMetric("NAVIGATION", metrics);
            }, 100);
        });
    }
}

/**
 * API Request Timing Wrapper.
 * Wraps fetch calls to measure and log response times.
 */
export function measureApiCall(name, fetchPromise) {
    const start = performance.now();

    return fetchPromise.then(result => {
        const duration = Math.round(performance.now() - start);
        reportMetric("API_CALL", { name, duration, status: "success" });
        return result;
    }).catch(error => {
        const duration = Math.round(performance.now() - start);
        reportMetric("API_CALL", { name, duration, status: "error", error: error.message });
        throw error;
    });
}

/**
 * Generic PerformanceObserver wrapper.
 */
function observeMetric(type, callback) {
    try {
        const observer = new PerformanceObserver((list) => {
            callback(list.getEntries());
        });
        observer.observe({ type, buffered: true });
    } catch (e) {
        // Silently fail if browser doesn't support this metric
    }
}

/**
 * Report metric to console (dev) or analytics endpoint (prod).
 */
function reportMetric(name, value) {
    if (process.env.NODE_ENV === "development") {
        console.log(`[PERF] ${name}:`, typeof value === "number" ? `${Math.round(value)}ms` : value);
    }

    // Production: send to analytics
    if (process.env.NODE_ENV === "production" && typeof window !== "undefined") {
        try {
            navigator.sendBeacon?.("/api/analytics/track", JSON.stringify({
                eventType: `PERF_${name}`,
                metadata: { value, url: window.location.pathname },
            }));
        } catch (e) {
            // Silently fail
        }
    }
}
