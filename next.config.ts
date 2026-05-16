import type { NextConfig } from "next";

const apiUrl =
  process.env.API_BASE_URL ?? "https://api.staging.open-profile.hng14.com";
const apiHostname = new URL(apiUrl).hostname;

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: apiHostname,
      },
    ],
  },
};

export default nextConfig;
