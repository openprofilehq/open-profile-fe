"use client";

import { useState } from "react";
import { ChartNoAxesCombined, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getProfileUrl } from "@/utils/profile";

interface InsightsEmptyStateProps {
  username?: string | null;
}

export default function InsightsEmptyState({
  username,
}: InsightsEmptyStateProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const profileUrl = getProfileUrl(username || undefined);

    if (navigator.share && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "My Open Profile",
          text: "Check out my Open Profile!",
          url: profileUrl || window.location.origin,
        });
        return;
      } catch {
        // Fallback to clipboard copy
      }
    }

    try {
      await navigator.clipboard.writeText(profileUrl || window.location.origin);
      setCopied(true);
      toast.success("Profile link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="border-tertiary-b/70 bg-card mx-auto flex min-h-[380px] w-full max-w-2xl flex-col items-center justify-center rounded-2xl border p-8 text-center sm:min-h-[440px] sm:p-12">
      {/* Chart Icon in Teal Circle */}
      <div className="text-brand-hover-bg dark:text-brand-text mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#065e69]/10 dark:bg-[#0a92a4]/20">
        <ChartNoAxesCombined size={26} strokeWidth={2.2} />
      </div>

      {/* Title */}
      <h3 className="text-primary-text text-base font-bold sm:text-lg">
        No profile activity yet
      </h3>

      {/* Subtitle */}
      <p className="text-secondary-text mt-2 max-w-sm text-xs leading-relaxed sm:text-sm">
        Views and link clicks will appear here once you start sharing your
        profile.
      </p>

      {/* Share Button */}
      <div className="mt-6">
        <Button
          type="button"
          onClick={handleShare}
          className="bg-brand-hover-bg hover:bg-brand-active-bg rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-all active:scale-95"
        >
          {copied ? (
            <>
              <Check size={16} />
              Copied Link
            </>
          ) : (
            <>
              <Copy size={16} />
              Share Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
