import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming soon",
  description: "This part of OpenProfile is still in development.",
  robots: { index: false, follow: false },
};

import ComingSoon from "@/components/shared/ComingSoon";

export default function ComingSoonPage() {
  return (
    <div>
      <ComingSoon />
    </div>
  );
}
