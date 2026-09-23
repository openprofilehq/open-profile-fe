import { queryOptions } from "@tanstack/react-query";
import { QueryStaleTime } from "@/api/base/base.const";
import { searchUsers } from "@/api/admin/admin.service";

export const userSearchQueryOptions = (query: string) =>
  queryOptions({
    queryKey: ["admin", "user-lookup", query],
    queryFn: ({ signal }) => searchUsers(query, signal),
    staleTime: QueryStaleTime.oneMin,
    retry: false,
    enabled: query.trim().length > 0,
  });
