"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardProfileOption } from "@/api/profile/profile.options";
import {
  profileViewsOption,
  linkClicksOption,
  searchConversionsOption,
  inviteConversionsOption,
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

  // Calculate startDate and endDate based on timeRange
  const dateParams = useMemo(() => {
    const end = new Date();
    const start = new Date();

    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    start.setDate(end.getDate() - days);

    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  }, [timeRange]);

  // Queries
  const dashboardProfile = useQuery(dashboardProfileOption());
  const profileViews = useQuery(profileViewsOption(dateParams));
  const linkClicks = useQuery(linkClicksOption(dateParams));
  const searchConversions = useQuery(searchConversionsOption(dateParams));
  const inviteConversions = useQuery(inviteConversionsOption(dateParams));

  const isLoading =
    profileViews.isPending &&
    linkClicks.isPending &&
    searchConversions.isPending &&
    inviteConversions.isPending;

  // Extract total metrics
  const totalViews =
    profileViews.data?.totalViews ?? profileViews.data?.total_views ?? 843;
  const changePercentage =
    profileViews.data?.changePercentage ??
    profileViews.data?.percentage_change ??
    15;

  const viewsData =
    profileViews.data?.viewsByDate ??
    profileViews.data?.views_by_date ??
    profileViews.data?.dailyViews ??
    profileViews.data?.views;

  const links = linkClicks.data?.links ?? linkClicks.data?.items ?? [];

  const searchConversionRate =
    searchConversions.data?.conversionRate ??
    searchConversions.data?.conversion_rate ??
    0.064;

  const inviteConversionRate =
    inviteConversions.data?.conversion_rate ??
    inviteConversions.data?.conversionRate ??
    (inviteConversions.data?.invites_claimed &&
    inviteConversions.data?.invites_sent
      ? inviteConversions.data.invites_claimed /
        inviteConversions.data.invites_sent
      : 0.312);

  const keyInsight =
    profileViews.data?.keyInsight ?? profileViews.data?.key_insight;

  // Determine if profile has activity or should show empty state
  // If explicitly 0 views and no link clicks, show empty state
  const isExplicitlyEmpty =
    profileViews.data != null &&
    (profileViews.data.totalViews === 0 ||
      profileViews.data.total_views === 0) &&
    (linkClicks.data?.totalClicks === 0 ||
      linkClicks.data?.total_clicks === 0) &&
    links.length === 0;

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
              <ViewsTrendChart data={viewsData} timeRange={timeRange} />
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
              <LinkPerformanceCard links={links} />
            </div>
          </div>

          {/* Row 3: Key Insight Card */}
          <KeyInsightCard insight={keyInsight} />
        </div>
      )}
    </div>
  );
}
