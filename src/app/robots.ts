import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.NODE_ENV === "production";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return {
    rules: isProd
      ? { userAgent: "*", allow: "/", disallow: ["/api/"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${appUrl}/sitemap.xml`,
    host: appUrl,
  };
}
