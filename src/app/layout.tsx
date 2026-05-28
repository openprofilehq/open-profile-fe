import { Providers } from "@/components/shared/providers";
import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { env } from "@/env/client";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: env.NEXT_PUBLIC_APP_NAME,
    template: `%s · ${env.NEXT_PUBLIC_APP_NAME}`,
  },
  description:
    "OpenProfile — build a verified profile that tells the world exactly who you are.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-afacad h-full antialiased")}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Afacad:wght@400..700&family=Dancing+Script:wght@400..700&family=Inter:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`flex min-h-full flex-col`}
      >
        <Providers>
          {children}
          <Toaster richColors position="top-right" duration={2500} />
        </Providers>
      </body>
    </html>
  );
}
