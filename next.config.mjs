/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'grainy-gradients.vercel.app' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  transpilePackages: ["recharts", "d3-shape", "d3-interpolate", "d3-color"],
};

export default nextConfig;
