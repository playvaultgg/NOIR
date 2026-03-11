/**
 * NOIR ULTRA Analytics Layer
 * Centralizes event tracking for business intelligence and high-revenue optimization.
 */

export const trackEvent = (eventName, params = {}) => {
    // 1. Log to console for development transparency
    if (process.env.NODE_ENV === 'development') {
        console.log(`[NOIR Analytics] Event: ${eventName}`, params);
    }

    // 2. Window-level GA4 / Facebook Pixel pushes (standard)
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, params);
    }

    // 3. PostHog / Mixpanel (future placeholders)
};

export const ANALYTICS_EVENTS = {
    PRODUCT_VIEW: 'product_view',
    ADD_TO_CART: 'add_to_cart',
    CHECKOUT_START: 'begin_checkout',
    PAYMENT_INFO: 'add_payment_info',
    PURCHASE: 'purchase',
    WISHLIST_ADD: 'add_to_wishlist',
    CART_REMINDER_SHOWN: 'cart_reminder_interaction',
    EXIT_INTENT: 'exit_intent_detected'
};
