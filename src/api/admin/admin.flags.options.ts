import { queryOptions } from "@tanstack/react-query";
import { QueryStaleTime } from "@/api/base/base.const";
import { getPlatformFlags } from "@/api/admin/admin.service";

export const platformFlagsQueryOptions = queryOptions({
  queryKey: ["admin", "feature-flags"],
  queryFn: () => getPlatformFlags(),
  staleTime: QueryStaleTime.oneMin,
  retry: false,
});
