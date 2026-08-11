"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardProfileOption } from "@/api/profile/profile.options";
import {
  profileViewsOption,
  linkClicksOption,
  searchConversionsOption,
  inviteConversionsOption,
  normalizeProfileViews,
  normalizeLinkClicks,
  normalizeSearchConversions,
  normalizeInviteConversions,
  NormalizedAnalyticsDashboard,
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

function formatLocalDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function InsightsDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");

  // Calculate local startDate and endDate based on timeRange
  const { endDate, dateParams } = useMemo(() => {
    const end = new Date();
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const start = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate() - (days - 1)
    );

    const startDateStr = formatLocalDateKey(start);
    const endDateStr = formatLocalDateKey(end);

    return {
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
    (dashboardProfile.isPending && !dashboardProfile.data) ||
    (profileViews.isPending && !profileViews.data) ||
    (linkClicks.isPending && !linkClicks.data) ||
    (searchConversions.isPending && !searchConversions.data) ||
    (inviteConversions.isPending && !inviteConversions.data);

  const isError =
    dashboardProfile.isError ||
    profileViews.isError ||
    linkClicks.isError ||
    searchConversions.isError ||
    inviteConversions.isError;

  const handleRetry = useCallback(() => {
    dashboardProfile.refetch();
    profileViews.refetch();
    linkClicks.refetch();
    searchConversions.refetch();
    inviteConversions.refetch();
  }, [
    dashboardProfile,
    profileViews,
    linkClicks,
    searchConversions,
    inviteConversions,
  ]);

  // Normalize all analytics responses into a single trusted shape
  const analytics: NormalizedAnalyticsDashboard = useMemo(() => {
    const { viewsData, totalViews, changePercentage, keyInsight } =
      normalizeProfileViews(profileViews.data);
    const { links, totalClicks } = normalizeLinkClicks(linkClicks.data);
    const searchConversionRate = normalizeSearchConversions(
      searchConversions.data
    );
    const inviteConversionRate = normalizeInviteConversions(
      inviteConversions.data
    );

    return {
      viewsData,
      totalViews,
      changePercentage,
      links,
      totalClicks,
      searchConversionRate,
      inviteConversionRate,
      keyInsight,
    };
  }, [
    profileViews.data,
    linkClicks.data,
    searchConversions.data,
    inviteConversions.data,
  ]);

  // Generate Dynamic Data-Driven Key Insight if none provided by API
  const displayKeyInsight = useMemo(() => {
    if (analytics.keyInsight) return analytics.keyInsight;

    if (analytics.viewsData.length > 0) {
      let maxCount = 0;
      let maxDayDate: string | null = null;
      let weekdayCount = 0;
      let weekendCount = 0;
      let numWeekdays = 0;
      let numWeekendDays = 0;

      for (const d of analytics.viewsData) {
        if (d.views > maxCount || !maxDayDate) {
          maxCount = d.views;
          maxDayDate = d.date;
        }
        if (d.date) {
          const [y, m, dayNum] = d.date.split("-").map(Number);
          const dayOfWeek = new Date(
            Date.UTC(y, (m || 1) - 1, dayNum || 1)
          ).getUTCDay();
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            weekendCount += d.views;
            numWeekendDays++;
          } else {
            weekdayCount += d.views;
            numWeekdays++;
          }
        }
      }

      if (maxDayDate && maxCount > 0) {
        const [y, m, dayNum] = maxDayDate.split("-").map(Number);
        const dayName =
          WEEKDAY_NAMES[
            new Date(Date.UTC(y, (m || 1) - 1, dayNum || 1)).getUTCDay()
          ];

        const avgWeekday = numWeekdays > 0 ? weekdayCount / numWeekdays : 0;
        const avgWeekend =
          numWeekendDays > 0 ? weekendCount / numWeekendDays : 0;

        if (avgWeekday > 0 && avgWeekend > 0 && avgWeekday > avgWeekend * 1.5) {
          const ratio = (avgWeekday / avgWeekend).toFixed(1);
          return `Your profile gets ${ratio}x more visits on weekdays. Try sharing updates during peak business hours for maximum reach.`;
        }
        return `Your profile received peak traffic on ${dayName || "your top day"} with ${maxCount} views.`;
      }
    }

    if (analytics.links.length > 0) {
      const topLink = [...analytics.links].sort(
        (a, b) => b.clicks - a.clicks
      )[0];
      if (topLink && topLink.clicks > 0) {
        return `Your "${topLink.title}" link is currently your top performer with ${topLink.clicks} clicks.`;
      }
    }

    return null;
  }, [analytics]);

  // Determine if profile has zero total activity across all metrics
  const isExplicitlyEmpty =
    !isLoading &&
    !isError &&
    analytics.totalViews === 0 &&
    analytics.totalClicks === 0 &&
    analytics.links.length === 0 &&
    analytics.searchConversionRate === 0 &&
    analytics.inviteConversionRate === 0;

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
                totalViews={analytics.totalViews}
                changePercentage={analytics.changePercentage}
              />
            </div>
            <div className="lg:col-span-2">
              <ViewsTrendChart
                data={analytics.viewsData}
                timeRange={timeRange}
                endDate={endDate}
              />
            </div>
          </div>

          {/* Row 2: Performance & Link Performance */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <PerformanceCard
                searchConversionRate={analytics.searchConversionRate}
                inviteConversionRate={analytics.inviteConversionRate}
              />
            </div>
            <div className="lg:col-span-2">
              <LinkPerformanceCard links={analytics.links} />
            </div>
          </div>

          {/* Row 3: Key Insight Card */}
          <KeyInsightCard insight={displayKeyInsight} />
        </div>
      )}
    </div>
  );
}
