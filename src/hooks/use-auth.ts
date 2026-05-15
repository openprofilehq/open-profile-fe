import { getCurrentUser } from "@/api/auth/auth.service";
import { queryOptions } from "@tanstack/react-query";

export const userQueryOptions = queryOptions({
  queryKey: ["current-user"],
  queryFn: ({ signal }) => getCurrentUser({ signal }),
  retry: false,
  staleTime: 1000 * 60 * 5,
});