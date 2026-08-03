import { queryOptions } from "@tanstack/react-query";
import { QueryStaleTime } from "@/api/base/base.const";
import {
  getProfileViews,
  getLinkClicks,
  getSearchConversions,
  getInviteConversions,
} from "./analytics.service";
import { AnalyticsDateRangeParams } from "./analytics.type";

export const analyticsKeys = {
  all: ["analytics"] as const,
  profileViews: (params?: AnalyticsDateRangeParams) =>
    [...analyticsKeys.all, "profile-views", params] as const,
  linkClicks: (params?: AnalyticsDateRangeParams) =>
    [...analyticsKeys.all, "link-clicks", params] as const,
  searchConversions: (params?: AnalyticsDateRangeParams) =>
    [...analyticsKeys.all, "search-conversions", params] as const,
  inviteConversions: (params?: AnalyticsDateRangeParams) =>
    [...analyticsKeys.all, "invite-conversions", params] as const,
};

export const profileViewsOption = (params?: AnalyticsDateRangeParams) =>
  queryOptions({
    queryKey: analyticsKeys.profileViews(params),
    queryFn: ({ signal }) => getProfileViews(params, signal),
    staleTime: QueryStaleTime.fiveMins,
  });

export const linkClicksOption = (params?: AnalyticsDateRangeParams) =>
  queryOptions({
    queryKey: analyticsKeys.linkClicks(params),
    queryFn: ({ signal }) => getLinkClicks(params, signal),
    staleTime: QueryStaleTime.fiveMins,
  });

export const searchConversionsOption = (params?: AnalyticsDateRangeParams) =>
  queryOptions({
    queryKey: analyticsKeys.searchConversions(params),
    queryFn: ({ signal }) => getSearchConversions(params, signal),
    staleTime: QueryStaleTime.fiveMins,
  });

export const inviteConversionsOption = (params?: AnalyticsDateRangeParams) =>
  queryOptions({
    queryKey: analyticsKeys.inviteConversions(params),
    queryFn: ({ signal }) => getInviteConversions(params, signal),
    staleTime: QueryStaleTime.fiveMins,
  });
