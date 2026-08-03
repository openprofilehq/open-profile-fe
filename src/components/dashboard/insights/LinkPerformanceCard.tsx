"use client";

import { LinkClickItem } from "@/api/analytics/analytics.type";
import { Link2 } from "lucide-react";

interface LinkPerformanceCardProps {
  links?: LinkClickItem[];
  totalClicks?: number;
}

export default function LinkPerformanceCard({
  links = [],
  totalClicks = 0,
}: LinkPerformanceCardProps) {
  const hasLinks = links && links.length > 0;
  const maxClicks = Math.max(
    ...links.map((l) => l.clicks ?? l.total_clicks ?? 0),
    1
  );
  const calculatedTotal =
    totalClicks > 0
      ? totalClicks
      : links.reduce((sum, l) => sum + (l.clicks ?? l.total_clicks ?? 0), 0);

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
          {links.map((item, index) => {
            const clicks = item.clicks ?? item.total_clicks ?? 0;
            const title =
              item.title ||
              item.label ||
              item.name ||
              item.url ||
              `Link ${index + 1}`;

            let ctrValue = 0;
            if (item.ctr != null) {
              ctrValue = item.ctr <= 1 ? item.ctr * 100 : item.ctr;
            } else if (item.click_through_rate != null) {
              ctrValue =
                item.click_through_rate <= 1
                  ? item.click_through_rate * 100
                  : item.click_through_rate;
            } else if (calculatedTotal > 0) {
              ctrValue = (clicks / calculatedTotal) * 100;
            }

            const progressPercent = Math.min(
              100,
              Math.max(clicks > 0 ? 8 : 0, (clicks / maxClicks) * 100)
            );

            return (
              <div
                key={item.id ?? item.linkId ?? item.link_id ?? index}
                className="flex items-center justify-between gap-3 text-xs sm:text-sm"
              >
                {/* Link Title */}
                <span
                  title={title}
                  className="text-primary-text w-28 truncate font-medium sm:w-36"
                >
                  {title}
                </span>

                {/* Number of Clicks */}
                <span className="text-primary-text w-12 text-right font-bold">
                  {clicks}
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
                  {ctrValue.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
