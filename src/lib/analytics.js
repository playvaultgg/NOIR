/**
 * Maison NOIR Deep Behavioral Tracking Service
 * Captures granular interaction telemetry for Enterprise Intelligence.
 */

export const trackEvent = async (eventType, metadata = {}) => {
    try {
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[ANALYTICS] ${eventType}:`, metadata);
        }

        const response = await fetch("/api/analytics/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ eventType, metadata }),
        });

        if (!response.ok) {
            throw new Error(`Analytics protocol error: ${response.status}`);
        }
    } catch (error) {
        console.warn("[ANALYTICS FAILSAFE] Telemetry sync interrupted.", error.message);
    }
};

export const ANALYTICS_EVENTS = {
    AI_STYLIST: {
        OPEN: "AI_STYLIST_OPEN",
        QUERY: "AI_STYLIST_QUERY",
        OUTFIT_SELECTED: "AI_STYLIST_OUTFIT_SELECTED",
        SENTIMENT_DETECTED: "AI_STYLIST_SENTIMENT",
    },
    SHOWROOM: {
        ENTER: "SHOWROOM_ENTER",
        PRODUCT_VIEW: "SHOWROOM_PRODUCT_VIEW",
        ENVIRONMENT_INTERACT: "SHOWROOM_ENVIRONMENT_INTERACT",
    },
    RUNWAY: {
        VIEW: "RUNWAY_VIEW",
        LOOK_SWITCH: "RUNWAY_LOOK_SWITCH",
        COMPLETION: "RUNWAY_COMPLETION",
    },
    COMMERCE: {
        CART_ADD: "COMMERCE_CART_ADD",
        CHECKOUT_INIT: "COMMERCE_CHECKOUT_INIT",
        CHECKOUT_CONVERSION: "COMMERCE_CHECKOUT_CONVERSION",
        ABANDONMENT: "COMMERCE_ABANDONMENT", // Logic for this would be in cleanup/interval
    }
};
