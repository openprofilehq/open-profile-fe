import type { NextConfig } from "next";

const apiUrl = process.env.API_BASE_URL;
const apiHostname = apiUrl ? new URL(apiUrl).hostname : undefined;

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  images: {
    remotePatterns: [
      ...(apiHostname
        ? [{ protocol: "https" as const, hostname: apiHostname }]
        : []),
      {
        protocol: "https" as const,
        hostname: "api.staging.open-profile.hng14.com",
      },
    ],
  },
};

export default nextConfig;
