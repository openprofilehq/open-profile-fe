"use client";

import { useMemo, useState } from "react";
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
import InsightsSkeleton from "./InsightsSkeleton";

export default function InsightsDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");

  // Calculate ISO startDate and endDate based on timeRange
  const { startDate, endDate, dateParams } = useMemo(() => {
    const end = new Date();
    const start = new Date();

    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    start.setDate(end.getDate() - (days - 1));

    const startDateStr = start.toISOString().split("T")[0];
    const endDateStr = end.toISOString().split("T")[0];

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

  // 1. Process Profile Views data
  const viewsData: DailyViewData[] = useMemo(() => {
    const raw = profileViews.data;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw.data)) return raw.data;
    if (Array.isArray(raw.viewsByDate)) return raw.viewsByDate;
    if (Array.isArray(raw.views_by_date)) return raw.views_by_date;
    if (Array.isArray(raw.dailyViews)) return raw.dailyViews;
    if (Array.isArray(raw.daily_views)) return raw.daily_views;
    if (Array.isArray(raw.views)) return raw.views;
    return [];
  }, [profileViews.data]);

  const totalViews = useMemo(() => {
    const raw = profileViews.data;
    if (!raw) return 0;
    if (typeof raw.totalViews === "number") return raw.totalViews;
    if (typeof raw.total_views === "number") return raw.total_views;
    if (
      raw.data &&
      typeof (raw.data as Record<string, unknown>).total_views === "number"
    ) {
      return (raw.data as Record<string, unknown>).total_views as number;
    }
    // Sum from daily views
    if (viewsData.length > 0) {
      return viewsData.reduce(
        (sum, item) => sum + (item.views ?? item.count ?? item.total ?? 0),
        0
      );
    }
    return 0;
  }, [profileViews.data, viewsData]);

  const changePercentage = useMemo(() => {
    const raw = profileViews.data;
    if (!raw) return 0;
    if (typeof raw.changePercentage === "number") return raw.changePercentage;
    if (typeof raw.percentage_change === "number") return raw.percentage_change;
    if (typeof raw.viewsChangePercentage === "number")
      return raw.viewsChangePercentage;
    if (typeof raw.views_change_percentage === "number")
      return raw.views_change_percentage;
    return 0;
  }, [profileViews.data]);

  // 2. Process Link Clicks data
  const links: LinkClickItem[] = useMemo(() => {
    const raw = linkClicks.data;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw.data)) return raw.data;
    if (Array.isArray(raw.links)) return raw.links;
    if (Array.isArray(raw.items)) return raw.items;
    return [];
  }, [linkClicks.data]);

  const totalClicks = useMemo(() => {
    const raw = linkClicks.data;
    if (!raw) return 0;
    if (typeof raw.totalClicks === "number") return raw.totalClicks;
    if (typeof raw.total_clicks === "number") return raw.total_clicks;
    if (links.length > 0) {
      return links.reduce(
        (sum, l) => sum + (l.clicks ?? l.total_clicks ?? 0),
        0
      );
    }
    return 0;
  }, [linkClicks.data, links]);

  // 3. Process Search Conversions
  const searchConversionRate = useMemo(() => {
    const raw = searchConversions.data;
    if (!raw) return 0;
    if (typeof raw.conversionRate === "number") return raw.conversionRate;
    if (typeof raw.conversion_rate === "number") return raw.conversion_rate;
    if (raw.data && typeof raw.data.conversion_rate === "number") {
      return raw.data.conversion_rate;
    }
    const impressions = raw.searchImpressions ?? raw.search_impressions;
    const views =
      raw.profileViews ?? raw.profile_views ?? raw.profile_views_from_search;
    if (impressions && impressions > 0 && views != null) {
      return views / impressions;
    }
    return 0;
  }, [searchConversions.data]);

  // 4. Process Invite Conversions
  const inviteConversionRate = useMemo(() => {
    const raw = inviteConversions.data;
    if (!raw) return 0;
    if (typeof raw.conversion_rate === "number") return raw.conversion_rate;
    if (typeof raw.conversionRate === "number") return raw.conversionRate;
    if (raw.data && typeof raw.data.conversion_rate === "number") {
      return raw.data.conversion_rate;
    }
    const sent = raw.invites_sent ?? raw.invitesSent;
    const claimed = raw.invites_claimed ?? raw.invitesClaimed;
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

    // Generate dynamic insight based on real view distribution if points exist
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
          const dayOfWeek = new Date(d.date).getDay();
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
          try {
            dayName = new Date(maxDay.date).toLocaleDateString("en-US", {
              weekday: "long",
            });
          } catch {
            dayName = maxDay.date;
          }
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
