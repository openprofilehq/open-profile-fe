import { queryOptions } from "@tanstack/react-query";
import { QueryStaleTime } from "@/api/base/base.const";
import {
  getMetricsSummary,
  getSearchActivity,
  getRecentActivity,
  getPlatformHealth,
  type MetricsRange,
} from "@/api/admin/admin.metrics.service";

export const metricsSummaryOptions = (range: MetricsRange = "this_week") =>
  queryOptions({
    queryKey: ["admin", "metrics", "summary", range],
    queryFn: () => getMetricsSummary(range),
    staleTime: QueryStaleTime.fiveMins,
    retry: false,
  });

export const searchActivityOptions = (range: MetricsRange = "this_week") =>
  queryOptions({
    queryKey: ["admin", "metrics", "search-activity", range],
    queryFn: () => getSearchActivity(range),
    staleTime: QueryStaleTime.fiveMins,
    retry: false,
  });

export const recentActivityOptions = () =>
  queryOptions({
    queryKey: ["admin", "metrics", "recent-activity"],
    queryFn: () => getRecentActivity(),
    staleTime: QueryStaleTime.oneMin,
    retry: false,
  });

export const platformHealthOptions = (range: MetricsRange = "this_week") =>
  queryOptions({
    queryKey: ["admin", "metrics", "platform-health", range],
    queryFn: () => getPlatformHealth(range),
    staleTime: QueryStaleTime.fiveMins,
    retry: false,
  });
