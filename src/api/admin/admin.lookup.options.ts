import { queryOptions } from "@tanstack/react-query";
import { QueryStaleTime } from "@/api/base/base.const";
import {
  getLookupUserDetail,
  searchUsers,
  USER_SEARCH_MIN_LENGTH,
} from "@/api/admin/admin.service";

export const userSearchQueryOptions = (query: string) =>
  queryOptions({
    queryKey: ["admin", "user-lookup", query],
    queryFn: ({ signal }) => searchUsers(query, signal),
    staleTime: QueryStaleTime.oneMin,
    retry: false,
    enabled: query.trim().length >= USER_SEARCH_MIN_LENGTH,
  });

export const userDetailQueryOptions = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["admin", "user-detail", userId],
    queryFn: ({ signal }) => getLookupUserDetail(userId as string, signal),
    staleTime: QueryStaleTime.oneMin,
    retry: false,
    enabled: Boolean(userId),
  });
