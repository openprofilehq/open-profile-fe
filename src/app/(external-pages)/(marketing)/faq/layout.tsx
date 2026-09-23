import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to the most common questions about OpenProfile.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
