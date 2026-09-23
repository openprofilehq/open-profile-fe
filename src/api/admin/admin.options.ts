import { queryOptions } from "@tanstack/react-query";
import { QueryStaleTime } from "@/api/base/base.const";
import { getAdminUsers, AdminUsersParams } from "@/api/admin/admin.service";

export const adminUsersQueryOptions = (params: AdminUsersParams = {}) =>
  queryOptions({
    queryKey: ["admin", "users", params],
    queryFn: ({ signal }) => getAdminUsers({ ...params, signal }),
    staleTime: QueryStaleTime.oneMin,
    retry: false,
  });
