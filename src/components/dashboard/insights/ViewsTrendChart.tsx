"use client";

import { useMemo, useState } from "react";
import { DailyViewData } from "@/api/analytics/analytics.type";
import { TimeRange } from "./TimeRangeSelector";

interface ViewsTrendChartProps {
  data?: DailyViewData[];
  timeRange: TimeRange;
}

export default function ViewsTrendChart({
  data = [],
  timeRange,
}: ViewsTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Parse and normalize time-series chart data
  const chartData = useMemo(() => {
    if (data && data.length > 0) {
      return data.map((item, idx) => {
        let label = item.day;
        if (!label && item.date) {
          try {
            const parsed = new Date(item.date);
            label = parsed.toLocaleDateString("en-US", { weekday: "short" });
          } catch {
            label = `Day ${idx + 1}`;
          }
        }
        return {
          date: item.date || `2026-07-${idx + 1}`,
          label: label || `D${idx + 1}`,
          views: item.views ?? item.count ?? 0,
        };
      });
    }

    // Default 7-day pattern if no explicit points provided
    const defaultDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const defaultViews = [65, 95, 88, 142, 195, 110, 102];
    return defaultDays.map((day, idx) => ({
      date: `Day ${idx + 1}`,
      label: day,
      views: defaultViews[idx] ?? 0,
    }));
  }, [data]);

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
  const paddingX = 40;
  const paddingTop = 25;
  const paddingBottom = 25;

  const innerWidth = svgWidth - paddingX * 2;
  const innerHeight = svgHeight - paddingTop - paddingBottom;

  const maxViews = Math.max(...chartData.map((d) => d.views), 10);
  const minViews = 0;

  const points = useMemo(() => {
    const total = chartData.length;
    if (total <= 1) {
      return [{ x: svgWidth / 2, y: svgHeight / 2, ...chartData[0] }];
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
                  width={innerWidth / points.length}
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
            className="bg-primary-text text-inverse-text pointer-events-none absolute -top-8 -translate-x-1/2 rounded-md px-2.5 py-1 text-[11px] font-medium shadow-md transition-all"
            style={{
              left: `${(points[hoveredIndex].x / svgWidth) * 100}%`,
            }}
          >
            {points[hoveredIndex].label}: {points[hoveredIndex].views} views
          </div>
        )}

        {/* X-Axis Labels */}
        <div className="border-tertiary-b/30 text-tertiary-text mt-2 flex justify-between border-t pt-2 text-[11px] sm:text-xs">
          {points.map((point, i) => (
            <span
              key={i}
              className={`text-center transition-colors ${
                hoveredIndex === i ? "text-primary-text font-semibold" : ""
              }`}
            >
              {point.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
