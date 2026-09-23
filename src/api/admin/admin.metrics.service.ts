import { callApi } from "@/api/base";

export type MetricsRange = "this_week" | "last_thirty_days";

export type MetricDelta = {
  current: number;
  previous: number;
  change: number;
};

export type TimeseriesPoint = {
  date: string;
  value: number;
};

export type MetricsSummaryData = {
  totalUsers: MetricDelta;
  publishedProfiles: MetricDelta;
  profileCompletionRate: MetricDelta;
  weeklyActiveProfiles: MetricDelta;
  invitesSent: MetricDelta;
  invitesClaimed: MetricDelta;
};

export async function getMetricsSummary(range: MetricsRange = "this_week") {
  return callApi<MetricsSummaryData>({
    url: "/admin/metrics/summary",
    method: "GET",
    params: { range },
  });
}

export type SearchActivityData = {
  totalSearches: MetricDelta;
  timeseries: TimeseriesPoint[];
};

export async function getSearchActivity(range: MetricsRange = "this_week") {
  return callApi<SearchActivityData>({
    url: "/admin/metrics/search-activity",
    method: "GET",
    params: { range },
  });
}

export type RecentActivityData = {
  newUsersToday: number;
  profilesPublishedToday: number;
  invitesSentToday: number;
  invitesClaimedToday: number;
};

export async function getRecentActivity() {
  return callApi<RecentActivityData>({
    url: "/admin/metrics/recent-activity",
    method: "GET",
  });
}

export type PlatformHealthData = {
  profileCompletionRate: MetricDelta;
  publishingActivity: TimeseriesPoint[];
};

export async function getPlatformHealth(range: MetricsRange = "this_week") {
  return callApi<PlatformHealthData>({
    url: "/admin/metrics/platform-health",
    method: "GET",
    params: { range },
  });
}
