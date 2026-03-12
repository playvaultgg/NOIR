/**
 * Maison NOIR - Sentry Error Monitoring Utility
 * 
 * This utility provides a centralized way to capture exceptions across
 * the client and server. In production, replace the console logs with
 * Sentry.captureException().
 */

export function captureError(error, context = {}) {
    // Determine environment
    const isProd = process.env.NODE_ENV === "production";

    // Prepare log data
    const logData = {
        message: error.message || "An unknown error occurred",
        stack: error.stack,
        timestamp: new Date().toISOString(),
        context,
        environment: process.env.NODE_ENV
    };

    if (isProd) {
        // Here you would integrate Sentry or LogRocket:
        // Sentry.captureException(error, { extra: context });
        console.error("[SENTRY_LOG]:", JSON.stringify(logData, null, 2));
    } else {
        console.group("🔴 Maison NOIR Internal Error");
        console.error(error);
        console.info("Context:", context);
        console.groupEnd();
    }
}

export function trackEvent(name, properties = {}) {
    const isProd = process.env.NODE_ENV === "production";
    
    if (isProd) {
        // Google Analytics / Plausible event tracking
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag('event', name, properties);
        }
    } else {
        console.log(`[EVENT_TRACKER]: ${name}`, properties);
    }
}
