import type { NextConfig } from "next";

const apiUrl = process.env.API_BASE_URL;
const apiHostname = apiUrl ? new URL(apiUrl).hostname : undefined;

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  typescript: {
    ignoreBuildErrors: process.env.SKIP_TYPE_CHECK === "1",
  },
  experimental: {
    authInterrupts: true,
  },
  async rewrites() {
    if (process.env.NODE_ENV !== "development") return [];
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.API_BASE_URL}/api/v1/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      ...(apiHostname
        ? [{ protocol: "https" as const, hostname: apiHostname }]
        : []),
      ...(process.env.NODE_ENV === "development"
        ? [
            {
              protocol: "http" as const,
              hostname: "localhost",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
