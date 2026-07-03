import React from "react";
import Image from "next/image";
import Link from "next/link";

const copyright = "© 2026 Open Profile";

const CreatedOn = () => (
  <div className="text-tertiary-text flex items-center gap-1.5 text-[13px]">
    Created on
    <Link href="/">
      <Image
        src="/auth/logo.png"
        alt="Open.Profile"
        width={90}
        height={20}
        className="ml-0.5 object-contain dark:invert"
      />
    </Link>
  </div>
);

export function TemplateFooter() {
  return (
    <footer className="border-border mt-24 border-t pt-6 pb-6">
      {/* Mobile: centered, stacked */}
      <div className="flex flex-col items-center gap-2 sm:hidden">
        <CreatedOn />
        <p className="text-tertiary-text text-[13px]">{copyright}</p>
      </div>

      {/* Desktop: space-between */}
      <div className="hidden items-center justify-between sm:flex">
        <p className="text-tertiary-text text-[13px]">{copyright}</p>
        <CreatedOn />
      </div>
    </footer>
  );
}
