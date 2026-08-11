"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InsightsErrorStateProps {
  onRetry: () => void;
}

export default function InsightsErrorState({
  onRetry,
}: InsightsErrorStateProps) {
  return (
    <div className="border-tertiary-b/70 bg-card mx-auto flex min-h-[380px] w-full max-w-2xl flex-col items-center justify-center rounded-2xl border p-8 text-center sm:min-h-[440px] sm:p-12">
      <div className="bg-danger-bg/10 text-danger-text mb-4 flex h-14 w-14 items-center justify-center rounded-full">
        <AlertCircle size={26} strokeWidth={2.2} />
      </div>

      <h3 className="text-primary-text text-base font-bold sm:text-lg">
        Failed to load insights
      </h3>

      <p className="text-secondary-text mt-2 max-w-sm text-xs leading-relaxed sm:text-sm">
        We encountered an error while fetching your analytics. Please try again.
      </p>

      <div className="mt-6">
        <Button
          type="button"
          onClick={onRetry}
          className="bg-brand-hover-bg hover:bg-brand-active-bg rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-all active:scale-95"
        >
          <RefreshCw size={16} />
          Retry
        </Button>
      </div>
    </div>
  );
}
