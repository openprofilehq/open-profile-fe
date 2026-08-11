"use client";

import { useMemo } from "react";
import { NormalizedDailyView } from "@/api/analytics";
import { TimeRange } from "./TimeRangeSelector";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ViewsTrendChartProps {
  data?: NormalizedDailyView[];
  timeRange: TimeRange;
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
    year: year || new Date().getUTCFullYear(),
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

const chartConfig = {
  views: {
    label: "Views",
    color: "#065e69",
  },
} satisfies ChartConfig;

export default function ViewsTrendChart({
  data = [],
  timeRange,
  endDate,
}: ViewsTrendChartProps) {
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
    const now = new Date();
    const endParts = endDate
      ? parseDateKey(endDate)
      : parseDateKey(
          formatDateKey(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate()
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

  return (
    <div className="border-tertiary-b/70 bg-card flex h-full flex-col justify-between rounded-2xl border p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <p className="text-secondary-text text-sm font-medium">{rangeTitle}</p>
        <span className="text-tertiary-text text-xs">{rangeSubtitle}</span>
      </div>

      <div className="relative mt-4 w-full">
        {/* Screen Reader Accessible Data List */}
        <ul className="sr-only">
          {chartData.map((point) => (
            <li key={point.date}>
              {point.date}: {point.views} view{point.views === 1 ? "" : "s"}
            </li>
          ))}
        </ul>

        {/* Shadcn Chart Component */}
        <ChartContainer config={chartConfig} className="h-44 w-full">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#065e69" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#065e69" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              className="stroke-tertiary-b/30"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              className="text-tertiary-text text-[11px]"
              tickMargin={8}
              interval={timeRange === "7d" ? 0 : "preserveStartEnd"}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              className="text-tertiary-text text-[11px]"
              allowDecimals={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value, payload) => {
                    const item = payload?.[0]?.payload as
                      | { date?: string }
                      | undefined;
                    return item?.date ? `${item.date} (${value})` : value;
                  }}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#065e69"
              strokeWidth={2.5}
              fill="url(#viewsGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
