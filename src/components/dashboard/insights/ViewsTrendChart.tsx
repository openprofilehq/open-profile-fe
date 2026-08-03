"use client";

import { useMemo, useState } from "react";
import { NormalizedDailyView } from "@/api/analytics";
import { TimeRange } from "./TimeRangeSelector";

interface ViewsTrendChartProps {
  data?: NormalizedDailyView[];
  timeRange: TimeRange;
  startDate?: string;
  endDate?: string;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseDateKey(dateStr: string) {
  const clean = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  const [year, month, day] = clean.split("-").map(Number);
  return {
    year: year || 2026,
    month: (month || 1) - 1, // 0-indexed month
    day: day || 1,
    dateString: clean,
  };
}

function formatDateKey(year: number, monthIndex: number, day: number): string {
  const m = String(monthIndex + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export default function ViewsTrendChart({
  data = [],
  timeRange,
  endDate,
}: ViewsTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Generate chart data using stable API date keys and pure UTC date arithmetic
  const chartData = useMemo(() => {
    const viewsByDateMap = new Map<string, number>();

    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (!item || !item.date) return;
        const cleanDate = item.date.includes("T")
          ? item.date.split("T")[0]
          : item.date;
        viewsByDateMap.set(
          cleanDate,
          (viewsByDateMap.get(cleanDate) || 0) + (item.views || 0)
        );
      });
    }

    const pointsCount = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const endParts = endDate
      ? parseDateKey(endDate)
      : parseDateKey(
          formatDateKey(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
          )
        );

    const result = [];

    for (let i = pointsCount - 1; i >= 0; i--) {
      // Step days back in UTC so calendar days are never shifted by browser timezone or DST
      const d = new Date(
        Date.UTC(endParts.year, endParts.month, endParts.day - i)
      );
      const year = d.getUTCFullYear();
      const month = d.getUTCMonth();
      const day = d.getUTCDate();
      const dateKey = formatDateKey(year, month, day);

      const label =
        timeRange === "7d"
          ? WEEKDAY_NAMES[d.getUTCDay()]
          : `${MONTH_NAMES[month]} ${day}`;

      const views = viewsByDateMap.get(dateKey) ?? 0;

      result.push({
        date: dateKey,
        label,
        views,
      });
    }

    return result;
  }, [data, timeRange, endDate]);

  const rangeTitle =
    timeRange === "7d"
      ? "Weekly Trend"
      : timeRange === "30d"
        ? "Monthly Trend"
        : "Quarterly Trend";

  const rangeSubtitle =
    timeRange === "7d"
      ? "Daily views, last 7 days"
      : timeRange === "30d"
        ? "Daily views, last 30 days"
        : "Daily views, last 90 days";

  // Chart coordinates
  const svgWidth = 600;
  const svgHeight = 160;
  const paddingX = 30;
  const paddingTop = 25;
  const paddingBottom = 25;

  const innerWidth = svgWidth - paddingX * 2;
  const innerHeight = svgHeight - paddingTop - paddingBottom;

  const maxViews = Math.max(...chartData.map((d) => d.views), 5);
  const minViews = 0;

  const points = useMemo(() => {
    const total = chartData.length;
    if (total <= 1) {
      return [
        { x: svgWidth / 2, y: svgHeight - paddingBottom, ...chartData[0] },
      ];
    }

    return chartData.map((d, index) => {
      const x = paddingX + (index / (total - 1)) * innerWidth;
      const normalizedY = (d.views - minViews) / (maxViews - minViews || 1);
      const y = svgHeight - paddingBottom - normalizedY * innerHeight;
      return { x, y, ...d };
    });
  }, [
    chartData,
    innerWidth,
    innerHeight,
    maxViews,
    minViews,
    paddingX,
    paddingBottom,
  ]);

  // Construct SVG path command
  const pathD = useMemo(() => {
    if (points.length === 0) return "";
    return points.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      return `${acc} L ${point.x} ${point.y}`;
    }, "");
  }, [points]);

  // Labels to display on X-axis (sample down for 30d / 90d)
  const displayLabels = useMemo(() => {
    if (timeRange === "7d") {
      return points.map((p, i) => ({ ...p, show: true, originalIndex: i }));
    }
    // Show 6-7 evenly spaced ticks for 30d/90d
    const step = Math.ceil(points.length / 6);
    return points.map((p, i) => ({
      ...p,
      show: i === 0 || i === points.length - 1 || i % step === 0,
      originalIndex: i,
    }));
  }, [points, timeRange]);

  return (
    <div className="border-tertiary-b/70 bg-card flex h-full flex-col justify-between rounded-2xl border p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <p className="text-secondary-text text-sm font-medium">{rangeTitle}</p>
        <span className="text-tertiary-text text-xs">{rangeSubtitle}</span>
      </div>

      {/* SVG Line Chart Area */}
      <div className="relative mt-4 w-full">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="h-36 w-full overflow-visible sm:h-44"
          preserveAspectRatio="none"
        >
          {/* Dashed Horizontal Grid Lines */}
          <line
            x1={paddingX}
            y1={paddingTop}
            x2={svgWidth - paddingX}
            y2={paddingTop}
            stroke="currentColor"
            strokeDasharray="4 4"
            className="text-tertiary-b/40 stroke-current"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={paddingTop + innerHeight / 2}
            x2={svgWidth - paddingX}
            y2={paddingTop + innerHeight / 2}
            stroke="currentColor"
            strokeDasharray="4 4"
            className="text-tertiary-b/40 stroke-current"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={svgHeight - paddingBottom}
            x2={svgWidth - paddingX}
            y2={svgHeight - paddingBottom}
            stroke="currentColor"
            strokeDasharray="4 4"
            className="text-tertiary-b/40 stroke-current"
            strokeWidth="1"
          />

          {/* Main Trend Line */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--brand, #065e69)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brand stroke-current transition-all duration-300"
          />

          {/* Hover hit targets and interactive points */}
          {points.map((point, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <g key={index}>
                {isHovered && (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={5}
                    className="fill-brand stroke-card"
                    strokeWidth="2"
                  />
                )}
                <rect
                  x={point.x - innerWidth / (points.length * 2)}
                  y={0}
                  width={Math.max(innerWidth / points.length, 10)}
                  height={svgHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="bg-primary-text text-inverse-text pointer-events-none absolute -top-8 z-10 -translate-x-1/2 rounded-md px-2.5 py-1 text-[11px] font-medium shadow-md transition-all"
            style={{
              left: `${(points[hoveredIndex].x / svgWidth) * 100}%`,
            }}
          >
            {points[hoveredIndex].date}: {points[hoveredIndex].views} view
            {points[hoveredIndex].views === 1 ? "" : "s"}
          </div>
        )}

        {/* X-Axis Labels */}
        <div className="border-tertiary-b/30 text-tertiary-text mt-2 flex justify-between border-t pt-2 text-[11px] sm:text-xs">
          {timeRange === "7d"
            ? points.map((point, i) => (
                <span
                  key={i}
                  className={`text-center transition-colors ${
                    hoveredIndex === i ? "text-primary-text font-semibold" : ""
                  }`}
                >
                  {point.label}
                </span>
              ))
            : displayLabels
                .filter((l) => l.show)
                .map((labelPoint, i) => (
                  <span
                    key={i}
                    className={`text-center transition-colors ${
                      hoveredIndex === labelPoint.originalIndex
                        ? "text-primary-text font-semibold"
                        : ""
                    }`}
                  >
                    {labelPoint.label}
                  </span>
                ))}
        </div>
      </div>
    </div>
  );
}
