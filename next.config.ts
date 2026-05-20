import type { NextConfig } from "next";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const apiHostname = NEXT_PUBLIC_API_URL
  ? new URL(NEXT_PUBLIC_API_URL).hostname
  : null;

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  images: {
    qualities: [75, 100],
    remotePatterns: [
      ...(apiHostname
        ? [{ protocol: "https" as const, hostname: apiHostname, pathname: "/**" }]
        : []),
      {
        protocol: "https" as const,
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;