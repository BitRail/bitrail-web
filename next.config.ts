import type { NextConfig } from "next";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const nextConfig: NextConfig = {
  experimental: {},
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Proxy all backend API calls to sbtc-pay (avoids CORS and the HTML 404 error)
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
      {
        source: "/api/chainhooks/:path*",
        destination: `${BACKEND_URL}/api/chainhooks/:path*`,
      },
      {
        source: "/api/cron/:path*",
        destination: `${BACKEND_URL}/api/cron/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        hostname: "avatar.vercel.sh",
      },
      {
        protocol: "https",
        hostname: "static.debank.com",
      },
      {
        protocol: "https",
        hostname: "**", // Allow all HTTPS images
      },
    ],
    unoptimized: true, // Allow loading images without optimization for IPFS/external sources
  },
  webpack: (config, { isServer }) => {
    // Make pino-pretty optional (it's an optional dev dependency from @walletconnect/logger via @stacks/connect)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'pino-pretty': false,
    };

    // Ignore optional dependencies that are not needed in browser
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'pino-pretty': false,
      };
    }

    return config;
  },
};

export default nextConfig;
