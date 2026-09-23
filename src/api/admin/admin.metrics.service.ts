import { callApi } from "@/api/base";

type AdminEnvelope<T> = { success: boolean; data: T };

export type MetricsRange = "this_week" | "last_thirty_days" | "all_time";

export type MetricDelta = {
  current: number;
  previous: number;
  change: number | null;
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
  const envelope = await callApi<AdminEnvelope<MetricsSummaryData>>({
    url: "/admin/metrics/summary",
    method: "GET",
    params: { range },
  });

  return envelope.data;
}

export type SearchActivityData = {
  totalSearches: MetricDelta;
  timeseries: TimeseriesPoint[];
};

export async function getSearchActivity(range: MetricsRange = "this_week") {
  const envelope = await callApi<AdminEnvelope<SearchActivityData>>({
    url: "/admin/metrics/search-activity",
    method: "GET",
    params: { range },
  });

  return envelope.data;
}

export type RecentActivityData = {
  newUsersToday: number;
  profilesPublishedToday: number;
  invitesSentToday: number;
  invitesClaimedToday: number;
};

export async function getRecentActivity() {
  const envelope = await callApi<AdminEnvelope<RecentActivityData>>({
    url: "/admin/metrics/recent-activity",
    method: "GET",
  });

  return envelope.data;
}

export type PlatformHealthData = {
  profileCompletionRate: MetricDelta;
  publishingActivity: TimeseriesPoint[];
};

export async function getPlatformHealth(range: MetricsRange = "this_week") {
  const envelope = await callApi<AdminEnvelope<PlatformHealthData>>({
    url: "/admin/metrics/platform-health",
    method: "GET",
    params: { range },
  });

  return envelope.data;
}
