"use client";

import { TrendingDown, TrendingUp } from "lucide-react";

interface InsightsOverviewCardProps {
  totalViews?: number;
  changePercentage?: number | null;
}

export default function InsightsOverviewCard({
  totalViews = 0,
  changePercentage = 0,
}: InsightsOverviewCardProps) {
  const percent = changePercentage ?? 0;
  const isNeutral = percent === 0;
  const isPositive = percent > 0;
  const formattedViews = new Intl.NumberFormat().format(totalViews);
  const formattedChange = Math.abs(percent).toFixed(0);

  return (
    <div className="border-tertiary-b/70 bg-card flex h-full flex-col justify-between rounded-2xl border p-5 sm:p-6">
      <div>
        <p className="text-secondary-text text-sm font-medium">Overview</p>
        <div className="mt-4">
          <h2 className="text-primary-text text-3xl font-bold tracking-tight sm:text-4xl">
            {formattedViews}
          </h2>
          <p className="text-tertiary-text mt-1 text-xs font-normal sm:text-sm">
            Total profile views
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold sm:text-sm">
        {isNeutral ? (
          <span className="text-secondary-text font-semibold">0%</span>
        ) : isPositive ? (
          <>
            <TrendingUp
              className="shrink-0 text-[#065e69] dark:text-[#31e47f]"
              size={16}
            />
            <span className="text-[#065e69] dark:text-[#31e47f]">
              {formattedChange}%
            </span>
          </>
        ) : (
          <>
            <TrendingDown className="text-danger-text shrink-0" size={16} />
            <span className="text-danger-text">{formattedChange}%</span>
          </>
        )}
        <span className="text-tertiary-text font-normal">
          vs previous period
        </span>
      </div>
    </div>
  );
}
