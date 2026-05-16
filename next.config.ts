import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.staging.open-profile.hng14.com",
      },
    ],
  },
};

export default nextConfig;
