/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ── CDN: Standalone output for containerized edge deployment ──
  output: "standalone",

  // ── CDN: Image Optimization Pipeline ──
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'grainy-gradients.vercel.app' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'loremflickr.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,       // 24 hours
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ── CDN: Static Asset Cache Headers ──
  async headers() {
    return [
      {
        // Immutable static assets (JS/CSS bundles with content hash)
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Optimized images
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // Public folder assets (fonts, icons, logos)
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // API routes — never cache
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
    ];
  },

  // ── Production Optimization ──
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  transpilePackages: ["recharts", "d3-shape", "d3-interpolate", "d3-color"],

  // ── CDN: Compression ──
  compress: true,

  // ── CDN: Powered-by header removal (security + smaller responses) ──
  poweredByHeader: false,
};

export default nextConfig;
