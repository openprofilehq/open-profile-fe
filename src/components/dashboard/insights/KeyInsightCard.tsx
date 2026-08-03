"use client";

import { Lightbulb } from "lucide-react";

interface KeyInsightCardProps {
  insight?: string;
}

export default function KeyInsightCard({
  insight = "Your profile gets 2.3x more visits on weekdays. Try sharing new content on Tuesdays for maximum reach.",
}: KeyInsightCardProps) {
  return (
    <div className="border-tertiary-b/70 bg-card flex items-start gap-4 rounded-2xl border p-4 sm:p-5">
      <div className="text-brand-hover-bg dark:text-brand-text flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#065e69]/10 dark:bg-[#0a92a4]/20">
        <Lightbulb size={20} />
      </div>
      <div>
        <h4 className="text-primary-text text-sm font-semibold">Key Insight</h4>
        <p className="text-secondary-text mt-0.5 text-xs leading-relaxed sm:text-sm">
          {insight}
        </p>
      </div>
    </div>
  );
}
