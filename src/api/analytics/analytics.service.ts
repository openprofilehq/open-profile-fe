import { callApi } from "@/api/base";
import {
  AnalyticsDateRangeParams,
  ProfileViewsResponse,
  LinkClicksResponse,
  SearchConversionsResponse,
  InviteConversionsResponse,
} from "./analytics.type";

function toRangeParams(params?: AnalyticsDateRangeParams) {
  return {
    ...(params?.startDate ? { startDate: params.startDate } : {}),
    ...(params?.endDate ? { endDate: params.endDate } : {}),
  };
}

export function getProfileViews(
  params?: AnalyticsDateRangeParams,
  signal?: AbortSignal
) {
  return callApi<ProfileViewsResponse>({
    url: "/analytics/profile-views",
    method: "GET",
    params: toRangeParams(params),
    signal,
  });
}

export function getLinkClicks(
  params?: AnalyticsDateRangeParams,
  signal?: AbortSignal
) {
  return callApi<LinkClicksResponse>({
    url: "/analytics/link-clicks",
    method: "GET",
    params: toRangeParams(params),
    signal,
  });
}

export function getSearchConversions(
  params?: AnalyticsDateRangeParams,
  signal?: AbortSignal
) {
  return callApi<SearchConversionsResponse>({
    url: "/analytics/search-conversions",
    method: "GET",
    params: toRangeParams(params),
    signal,
  });
}

export function getInviteConversions(
  params?: AnalyticsDateRangeParams,
  signal?: AbortSignal
) {
  return callApi<InviteConversionsResponse>({
    url: "/analytics/invite-conversions",
    method: "GET",
    params: toRangeParams(params),
    signal,
  });
}
