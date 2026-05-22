"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function ProfileNotFound() {
  const pathname = usePathname();
  const searched = decodeURIComponent(pathname?.split("/")[1] ?? "");
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  function handleSearch() {
    const username = query.trim();
    if (!username || isSearching) return;
    setIsSearching(true);
    router.push(`/${encodeURIComponent(username)}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 bg-white px-6 py-6">
      <Link href="/">
        <Image
          src="/auth/logo.png"
          alt="Open.Profile"
          width={140}
          height={32}
          priority
        />
      </Link>

      <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-6">
        {/* Search bar */}
        <div className="flex w-full max-w-[480px] flex-col gap-[6px] sm:flex-row">
          <div className="flex h-[50px] flex-1 items-center rounded-[5.57px] border border-[#C9C9C9] bg-[#FAFAFA] px-[12px] focus-within:ring-2 focus-within:ring-[#087583]/40">
            <span
              className="shrink-0 text-[16px] leading-[24px] text-[#454545] select-none"
              style={{ fontFamily: "'Afacad', sans-serif" }}
            >
              open.profile/
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="username"
              className="min-w-0 flex-1 bg-transparent text-[16px] leading-[24px] text-[#454545] outline-none placeholder:text-[#C9C9C9]"
              style={{ fontFamily: "'Afacad', sans-serif" }}
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="h-[56px] w-full rounded-[8px] bg-[#087583] px-[16px] text-[16px] leading-[24px] whitespace-nowrap text-white transition-colors hover:bg-[#065E69] disabled:opacity-80 sm:h-[50px] sm:w-auto"
            style={{ fontFamily: "'Afacad', sans-serif" }}
          >
            {isSearching ? "Searching..." : "Search a Profile"}
          </Button>
        </div>

        {/* Error state */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#087583]/8">
            <SearchX className="h-6 w-6 text-[#087583]" />
          </div>
          <div className="flex flex-col gap-1">
            <p
              className="text-[18px] font-semibold text-[#050505]"
              style={{ fontFamily: "'Afacad', sans-serif" }}
            >
              Your search for{" "}
              <span className="text-[#087583]">&quot;{searched}&quot;</span> was
              not found
            </p>
            <p
              className="text-[15px] text-[#454545]"
              style={{ fontFamily: "'Afacad', sans-serif" }}
            >
              Double-check the username or try a different one.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
