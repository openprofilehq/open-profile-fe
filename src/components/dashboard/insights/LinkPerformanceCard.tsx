"use client";

import { LinkClickItem } from "@/api/analytics/analytics.type";

interface LinkPerformanceCardProps {
  links?: LinkClickItem[];
}

const defaultLinks: LinkClickItem[] = [
  { title: "LinkedIn", clicks: 284, ctr: 33.7 },
  { title: "GitHub", clicks: 201, ctr: 23.8 },
  { title: "Personal Website", clicks: 147, ctr: 17.4 },
  { title: "Resume PDF", clicks: 98, ctr: 11.6 },
  { title: "Twitter / X", clicks: 43, ctr: 5.1 },
];

export default function LinkPerformanceCard({
  links = defaultLinks,
}: LinkPerformanceCardProps) {
  const displayLinks = links.length > 0 ? links : defaultLinks;
  const maxClicks = Math.max(...displayLinks.map((l) => l.clicks), 1);

  return (
    <div className="border-tertiary-b/70 bg-card flex h-full flex-col justify-between rounded-2xl border p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-secondary-text text-sm font-medium">
          Link Performance
        </p>
        <div className="text-tertiary-text flex items-center gap-6 text-xs font-medium">
          <span className="w-12 text-right">Clicks</span>
          <span className="w-12 text-right">CTR</span>
        </div>
      </div>

      {/* Rows */}
      <div className="mt-5 space-y-4">
        {displayLinks.map((item, index) => {
          const ctrValue =
            item.ctr != null
              ? item.ctr <= 1
                ? (item.ctr * 100).toFixed(1)
                : item.ctr.toFixed(1)
              : ((item.clicks / maxClicks) * 100).toFixed(1);

          const progressPercent = Math.min(
            100,
            Math.max(8, (item.clicks / maxClicks) * 100)
          );

          return (
            <div
              key={item.id ?? item.linkId ?? item.title ?? index}
              className="flex items-center justify-between gap-3 text-xs sm:text-sm"
            >
              {/* Link Title */}
              <span className="text-primary-text w-28 truncate font-medium sm:w-36">
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
                {ctrValue}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
