/**
 * MAISON NOIR — CDN & Asset Optimization Utilities
 * Senior Developer Standard: Centralized helpers for edge-optimized content delivery.
 */

/**
 * Generate a responsive image srcSet for CDN delivery.
 * Used with Next.js Image component for optimal loading.
 */
export function generateSrcSet(baseUrl, sizes = [640, 828, 1200, 1920]) {
    return sizes
        .map(size => `${baseUrl}?w=${size}&auto=format&fit=crop ${size}w`)
        .join(', ');
}

/**
 * Determine optimal image quality based on connection speed.
 * Uses the Network Information API when available.
 */
export function getOptimalQuality() {
    if (typeof navigator === 'undefined') return 80;

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!connection) return 80;

    switch (connection.effectiveType) {
        case '4g': return 85;
        case '3g': return 60;
        case '2g': return 40;
        case 'slow-2g': return 30;
        default: return 80;
    }
}

/**
 * Preload critical assets for faster First Contentful Paint.
 * Call this in layout.js or page.js for above-the-fold images.
 */
export function preloadImage(src) {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.type = 'image/webp';
    document.head.appendChild(link);
}

/**
 * Generate Unsplash CDN URL with optimized parameters.
 * Unsplash has its own CDN — this ensures we use it properly.
 */
export function optimizeUnsplashUrl(url, { width = 800, quality = 80, format = 'auto' } = {}) {
    if (!url || !url.includes('unsplash.com')) return url;

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${width}&q=${quality}&auto=format&fit=crop`;
}

/**
 * Cache key generator for client-side caching.
 */
export function getCacheKey(resource, version = '1') {
    return `noir-cdn-${resource}-v${version}`;
}
