import type { NextConfig } from "next";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const parsedApiUrl = NEXT_PUBLIC_API_URL ? new URL(NEXT_PUBLIC_API_URL) : null;
const apiHostname = parsedApiUrl?.hostname ?? null;
const apiProtocol = parsedApiUrl?.protocol.replace(":", "") ?? null;

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  images: {
    qualities: [75, 100],
    remotePatterns: [
      ...(apiHostname
        ? [
            {
              protocol: (apiProtocol === "http" ? "http" : "https") as "http" | "https",
              hostname: apiHostname,
              pathname: "/**",
            },
          ]
        : []),
      {
        protocol: "https" as "http" | "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;