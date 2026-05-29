import React from "react";
import Image from "next/image";

export function TemplateFooter() {
  return (
    <footer className="mt-24 flex items-center justify-between border-t border-border pt-6 pb-6">
      <p className="text-[13px] text-tertiary-text">
        © 2026 Open Profile
      </p>
      <div className="text-[13px] text-tertiary-text flex items-center gap-1.5">
        Created on
        <Image
          src="/auth/logo.png"
          alt="Open.Profile"
          width={90}
          height={20}
          className="object-contain dark:invert ml-0.5"
        />
      </div>
    </footer>
  );
}
