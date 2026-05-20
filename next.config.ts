import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: "api.staging.open-profile.hng14.com",
        pathname: "/**",
      },
      {
        protocol: "https" as const,
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;