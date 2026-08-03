"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardProfileOption } from "@/api/profile/profile.options";
import {
  profileViewsOption,
  linkClicksOption,
  searchConversionsOption,
  inviteConversionsOption,
  DailyViewData,
  LinkClickItem,
} from "@/api/analytics";

import TimeRangeSelector, { TimeRange } from "./TimeRangeSelector";
import InsightsOverviewCard from "./InsightsOverviewCard";
import ViewsTrendChart from "./ViewsTrendChart";
import PerformanceCard from "./PerformanceCard";
import LinkPerformanceCard from "./LinkPerformanceCard";
import KeyInsightCard from "./KeyInsightCard";
import InsightsEmptyState from "./InsightsEmptyState";
import InsightsErrorState from "./InsightsErrorState";
import InsightsSkeleton from "./InsightsSkeleton";

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatLocalDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Extraction helpers for API responses that may wrap data or use camelCase/snake_case
function pickNumber(obj: unknown, ...keys: string[]): number | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  const record = obj as Record<string, unknown>;

  for (const key of keys) {
    if (typeof record[key] === "number") return record[key] as number;
  }

  if (record.data && typeof record.data === "object") {
    const dataRecord = record.data as Record<string, unknown>;
    for (const key of keys) {
      if (typeof dataRecord[key] === "number") return dataRecord[key] as number;
    }
  }

  return undefined;
}

function pickArray<T>(obj: unknown, ...keys: string[]): T[] {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj as T[];
  if (typeof obj !== "object") return [];
  const record = obj as Record<string, unknown>;

  if (Array.isArray(record.data)) return record.data as T[];

  for (const key of keys) {
    if (Array.isArray(record[key])) return record[key] as T[];
  }

  return [];
}

// Normalize conversion rates to 0-1 scale
function normalizeRate(rate?: number | null): number {
  if (rate == null || Number.isNaN(rate)) return 0;
  return rate > 1 ? rate / 100 : rate;
}

export default function InsightsDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");

  // Calculate local startDate and endDate based on timeRange
  const { startDate, endDate, dateParams } = useMemo(() => {
    const end = new Date();
    const start = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate() -
        ((timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90) - 1)
    );

    const startDateStr = formatLocalDate(start);
    const endDateStr = formatLocalDate(end);

    return {
      startDate: startDateStr,
      endDate: endDateStr,
      dateParams: {
        startDate: startDateStr,
        endDate: endDateStr,
      },
    };
  }, [timeRange]);

  // Queries
  const dashboardProfile = useQuery(dashboardProfileOption());
  const profileViews = useQuery(profileViewsOption(dateParams));
  const linkClicks = useQuery(linkClicksOption(dateParams));
  const searchConversions = useQuery(searchConversionsOption(dateParams));
  const inviteConversions = useQuery(inviteConversionsOption(dateParams));

  const isLoading =
    (profileViews.isPending && !profileViews.data) ||
    (linkClicks.isPending && !linkClicks.data) ||
    (searchConversions.isPending && !searchConversions.data) ||
    (inviteConversions.isPending && !inviteConversions.data);

  const isError =
    profileViews.isError ||
    linkClicks.isError ||
    searchConversions.isError ||
    inviteConversions.isError;

  const handleRetry = useCallback(() => {
    profileViews.refetch();
    linkClicks.refetch();
    searchConversions.refetch();
    inviteConversions.refetch();
  }, [profileViews, linkClicks, searchConversions, inviteConversions]);

  // 1. Process Profile Views data
  const viewsData: DailyViewData[] = useMemo(() => {
    return pickArray<DailyViewData>(
      profileViews.data,
      "viewsByDate",
      "views_by_date",
      "dailyViews",
      "daily_views",
      "views"
    );
  }, [profileViews.data]);

  const totalViews = useMemo(() => {
    const explicit = pickNumber(profileViews.data, "totalViews", "total_views");
    if (explicit != null) return explicit;

    if (viewsData.length > 0) {
      return viewsData.reduce(
        (sum, item) => sum + (item.views ?? item.count ?? item.total ?? 0),
        0
      );
    }
    return 0;
  }, [profileViews.data, viewsData]);

  const changePercentage = useMemo(() => {
    return (
      pickNumber(
        profileViews.data,
        "changePercentage",
        "percentage_change",
        "viewsChangePercentage",
        "views_change_percentage"
      ) ?? 0
    );
  }, [profileViews.data]);

  // 2. Process Link Clicks data
  const links: LinkClickItem[] = useMemo(() => {
    return pickArray<LinkClickItem>(linkClicks.data, "links", "items");
  }, [linkClicks.data]);

  const totalClicks = useMemo(() => {
    const explicit = pickNumber(linkClicks.data, "totalClicks", "total_clicks");
    if (explicit != null) return explicit;

    if (links.length > 0) {
      return links.reduce(
        (sum, l) => sum + (l.clicks ?? l.total_clicks ?? 0),
        0
      );
    }
    return 0;
  }, [linkClicks.data, links]);

  // 3. Process Search Conversions (Normalized to 0-1 scale)
  const searchConversionRate = useMemo(() => {
    const rate = pickNumber(
      searchConversions.data,
      "conversionRate",
      "conversion_rate"
    );
    if (rate != null) return normalizeRate(rate);

    const impressions = pickNumber(
      searchConversions.data,
      "searchImpressions",
      "search_impressions"
    );
    const views = pickNumber(
      searchConversions.data,
      "profileViews",
      "profile_views",
      "profile_views_from_search"
    );

    if (impressions && impressions > 0 && views != null) {
      return views / impressions;
    }
    return 0;
  }, [searchConversions.data]);

  // 4. Process Invite Conversions (Normalized to 0-1 scale)
  const inviteConversionRate = useMemo(() => {
    const rate = pickNumber(
      inviteConversions.data,
      "conversionRate",
      "conversion_rate"
    );
    if (rate != null) return normalizeRate(rate);

    const sent = pickNumber(
      inviteConversions.data,
      "invites_sent",
      "invitesSent"
    );
    const claimed = pickNumber(
      inviteConversions.data,
      "invites_claimed",
      "invitesClaimed"
    );

    if (sent && sent > 0 && claimed != null) {
      return claimed / sent;
    }
    return 0;
  }, [inviteConversions.data]);

  // 5. Generate Dynamic Data-Driven Key Insight
  const keyInsight = useMemo(() => {
    const rawInsight =
      profileViews.data?.keyInsight ?? profileViews.data?.key_insight;
    if (rawInsight) return rawInsight;

    if (viewsData.length > 0) {
      let maxDay: DailyViewData | null = null;
      let maxCount = 0;
      let weekdayCount = 0;
      let weekendCount = 0;

      for (const d of viewsData) {
        const count = d.views ?? d.count ?? d.total ?? 0;
        if (count > maxCount || !maxDay) {
          maxCount = count;
          maxDay = d;
        }
        if (d.date) {
          const [y, m, dayNum] = d.date.split("-").map(Number);
          const dayOfWeek = new Date(y, (m || 1) - 1, dayNum || 1).getDay();
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            weekendCount += count;
          } else {
            weekdayCount += count;
          }
        }
      }

      if (maxDay && maxCount > 0) {
        let dayName = maxDay.day;
        if (!dayName && maxDay.date) {
          const [y, m, dayNum] = maxDay.date.split("-").map(Number);
          dayName =
            WEEKDAY_NAMES[new Date(y, (m || 1) - 1, dayNum || 1).getDay()];
        }
        if (
          weekdayCount > 0 &&
          weekendCount > 0 &&
          weekdayCount > weekendCount * 1.5
        ) {
          const ratio = (weekdayCount / (weekendCount || 1)).toFixed(1);
          return `Your profile gets ${ratio}x more visits on weekdays. Try sharing updates during peak business hours for maximum reach.`;
        }
        return `Your profile received peak traffic on ${dayName || "your top day"} with ${maxCount} views.`;
      }
    }

    if (links.length > 0) {
      const topLink = [...links].sort(
        (a, b) => (b.clicks ?? 0) - (a.clicks ?? 0)
      )[0];
      if (topLink && (topLink.clicks ?? 0) > 0) {
        return `Your "${topLink.title || "featured"}" link is currently your top performer with ${topLink.clicks} clicks.`;
      }
    }

    return null;
  }, [profileViews.data, viewsData, links]);

  // Determine if profile has zero total activity across all metrics
  const isExplicitlyEmpty =
    !isLoading &&
    !isError &&
    totalViews === 0 &&
    totalClicks === 0 &&
    links.length === 0 &&
    searchConversionRate === 0 &&
    inviteConversionRate === 0;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-primary-text text-2xl font-bold tracking-tight sm:text-3xl">
            Insights
          </h1>
          <p className="text-secondary-text mt-1 text-sm">
            How is your profile performing?
          </p>
        </div>

        {/* Filter Pills */}
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <InsightsSkeleton />
      ) : isError ? (
        <InsightsErrorState onRetry={handleRetry} />
      ) : isExplicitlyEmpty ? (
        <InsightsEmptyState username={dashboardProfile.data?.username} />
      ) : (
        <div className="space-y-6">
          {/* Row 1: Overview & Views Trend Chart */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <InsightsOverviewCard
                totalViews={totalViews}
                changePercentage={changePercentage}
              />
            </div>
            <div className="lg:col-span-2">
              <ViewsTrendChart
                data={viewsData}
                timeRange={timeRange}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
          </div>

          {/* Row 2: Performance & Link Performance */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <PerformanceCard
                searchConversionRate={searchConversionRate}
                inviteConversionRate={inviteConversionRate}
              />
            </div>
            <div className="lg:col-span-2">
              <LinkPerformanceCard links={links} totalClicks={totalClicks} />
            </div>
          </div>

          {/* Row 3: Key Insight Card */}
          <KeyInsightCard insight={keyInsight} />
        </div>
      )}
    </div>
  );
}
