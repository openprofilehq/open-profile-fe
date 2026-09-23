import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "See how OpenProfile turns your work into one shareable, verified link.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
