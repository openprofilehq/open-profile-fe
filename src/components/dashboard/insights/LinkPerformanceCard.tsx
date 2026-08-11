"use client";

import { NormalizedLinkClick } from "@/api/analytics";
import { Link2 } from "lucide-react";

interface LinkPerformanceCardProps {
  links?: NormalizedLinkClick[];
}

export default function LinkPerformanceCard({
  links = [],
}: LinkPerformanceCardProps) {
  const hasLinks = links && links.length > 0;
  const maxClicks = Math.max(...links.map((l) => l.clicks), 1);

  return (
    <div className="border-tertiary-b/70 bg-card flex h-full flex-col justify-between rounded-2xl border p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-secondary-text text-sm font-medium">
          Link Performance
        </p>
        {hasLinks && (
          <div className="text-tertiary-text flex items-center gap-6 text-xs font-medium">
            <span className="w-12 text-right">Clicks</span>
            <span className="w-12 text-right">CTR</span>
          </div>
        )}
      </div>

      {/* Content */}
      {!hasLinks ? (
        <div className="my-auto flex flex-col items-center justify-center py-8 text-center">
          <div className="bg-secondary-bg text-tertiary-text mb-2.5 flex h-10 w-10 items-center justify-center rounded-full">
            <Link2 size={18} />
          </div>
          <p className="text-primary-text text-xs font-medium sm:text-sm">
            No link activity recorded
          </p>
          <p className="text-tertiary-text mt-1 max-w-xs text-xs">
            Link clicks and CTR metrics will appear here once visitors start
            clicking your links.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {links.map((item) => {
            const progressPercent = Math.min(
              100,
              Math.max(item.clicks > 0 ? 8 : 0, (item.clicks / maxClicks) * 100)
            );

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 text-xs sm:text-sm"
              >
                {/* Link Title */}
                <span
                  title={item.title}
                  className="text-primary-text w-28 truncate font-medium sm:w-36"
                >
                  {item.title}
                </span>

                {/* Number of Clicks */}
                <span className="text-primary-text w-12 text-right font-bold">
                  {item.clicks}
                </span>

                {/* Progress Bar */}
                <div className="bg-secondary-bg h-2 flex-1 overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full bg-[#0a92a4]/40 transition-all duration-500 dark:bg-[#0a92a4]/70"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* CTR % */}
                <span className="text-secondary-text w-12 text-right font-medium">
                  {item.ctr.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
