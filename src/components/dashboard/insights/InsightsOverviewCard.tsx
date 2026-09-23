"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import clsx from "clsx";

interface InsightsOverviewCardProps {
  totalViews?: number;
  uniqueViewers?: number;
  changePercentage?: number | null;
}

function formatCompactNumber(num: number): string {
  if (num >= 1000) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);
  }
  return new Intl.NumberFormat("en-US").format(num);
}

export default function InsightsOverviewCard({
  totalViews = 0,
  uniqueViewers = 0,
  changePercentage = 0,
}: InsightsOverviewCardProps) {
  const percent = changePercentage ?? 0;
  const isNeutral = percent === 0;
  const isPositive = percent > 0;
  const isNegative = percent < 0;
  const formattedViews = formatCompactNumber(totalViews);
  const formattedUnique = formatCompactNumber(uniqueViewers);
  const formattedChange = Math.abs(percent).toFixed(0);

  return (
    <div className="border-tertiary-b/70 bg-card flex h-full flex-col justify-between rounded-2xl border p-5 sm:p-6">
      {/* Top Title */}
      <div>
        <p className="text-secondary-text text-sm font-medium">Overview</p>

        {/* Primary Metric & Subtitle */}
        <div className="mt-5">
          <h2 className="text-primary-text text-3xl font-bold tracking-tight sm:text-4xl">
            {formattedViews}
          </h2>
          <div className="text-secondary-text mt-1.5 flex flex-wrap items-center gap-1.5 text-xs sm:text-sm">
            <span>Total profile views</span>
            {uniqueViewers > 0 && (
              <>
                <span className="text-tertiary-text">•</span>
                <span className="text-tertiary-text">
                  {formattedUnique} unique{" "}
                  {uniqueViewers === 1 ? "viewer" : "viewers"}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Trend Indicator */}
      <div className="mt-8 flex items-center gap-2 text-xs sm:text-sm">
        <div
          className={clsx(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
            isPositive &&
              "bg-[#f0f9fa] text-[#0a92a4] dark:bg-[#0a92a4]/20 dark:text-[#38bdf8]",
            isNegative &&
              "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
            isNeutral && "bg-secondary-bg text-secondary-text"
          )}
        >
          {isNegative ? (
            <ArrowDownRight size={14} className="stroke-[2.5]" />
          ) : (
            <ArrowUpRight
              size={14}
              className={clsx("stroke-[2.5]", isNeutral && "opacity-50")}
            />
          )}
        </div>

        <span className="text-primary-text font-bold">{formattedChange}%</span>
        <span className="text-tertiary-text font-normal">
          vs previous period
        </span>
      </div>
    </div>
  );
}
