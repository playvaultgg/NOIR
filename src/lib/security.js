/**
 * MAISON NOIR — Sovereign Security Module
 * Senior Developer Standard: Centralized Input Sanitization & Validation
 */

/**
 * Sanitize a string to prevent XSS attacks.
 * Strips dangerous HTML characters from user input.
 */
export function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize an entire object recursively.
 * Used for sanitizing request bodies before database operations.
 */
export function sanitizeObject(obj) {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'string') return sanitizeInput(obj);
    if (Array.isArray(obj)) return obj.map(sanitizeObject);
    if (typeof obj === 'object') {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            sanitized[sanitizeInput(key)] = sanitizeObject(value);
        }
        return sanitized;
    }
    return obj;
}

/**
 * Validate email format.
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate that a value is a positive number (for prices, quantities).
 */
export function isPositiveNumber(value) {
    return typeof value === 'number' && value > 0 && isFinite(value);
}

/**
 * Generate a cryptographic nonce for CSP headers.
 */
export function generateNonce() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
}

/**
 * Rate limit key generator — creates a unique fingerprint per client.
 */
export function getClientFingerprint(request) {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    return `${ip}::${userAgent.substring(0, 50)}`;
}
