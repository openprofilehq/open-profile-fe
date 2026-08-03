"use client";

import { useMemo, useState } from "react";
import { DailyViewData } from "@/api/analytics/analytics.type";
import { TimeRange } from "./TimeRangeSelector";

interface ViewsTrendChartProps {
  data?: DailyViewData[];
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

function formatLocalDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export default function ViewsTrendChart({
  data = [],
  timeRange,
  endDate,
}: ViewsTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Parse and normalize time-series chart data based on real date range and API counts
  const chartData = useMemo(() => {
    // Create lookup map of date -> view count from API data
    const viewsByDateMap = new Map<string, number>();

    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (!item) return;
        const count = item.views ?? item.count ?? item.total ?? 0;
        const rawDate = item.date || item.day;
        if (rawDate) {
          const cleanDate = rawDate.includes("T")
            ? rawDate.split("T")[0]
            : rawDate;
          viewsByDateMap.set(
            cleanDate,
            (viewsByDateMap.get(cleanDate) || 0) + count
          );
        }
      });
    }

    const pointsCount = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const end = endDate ? parseLocalDate(endDate) : new Date();
    const result = [];

    // Generate date sequence using local date arithmetic
    for (let i = pointsCount - 1; i >= 0; i--) {
      const d = new Date(end.getFullYear(), end.getMonth(), end.getDate() - i);
      const isoDate = formatLocalDate(d);

      let label = "";
      if (timeRange === "7d") {
        label = WEEKDAY_NAMES[d.getDay()];
      } else {
        label = `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
      }

      const views = viewsByDateMap.get(isoDate) ?? 0;

      result.push({
        date: isoDate,
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
