import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { createProfile, checkUsername } from "./profile.service";
import { isQueryEnabled } from "@/api/base/base.util";
import { QueryStaleTime } from "@/api/base/base.const";
import { isApiError } from "@/api/base";

export const createProfileOption = mutationOptions({
  mutationKey: ["profile", "create"],
  mutationFn: createProfile,
});

export function checkUsernameOption(username: string | undefined) {
  return queryOptions({
    queryKey: ["username-availability", username],
    enabled: isQueryEnabled(username),
    queryFn: ({ signal }) => checkUsername(username!, signal),
    staleTime: QueryStaleTime.fiveMins,
  });
}

/** Probes whether the current user already has a profile by attempting to create one.
 *  409 = profile exists, any other error = no profile (or unknown). */
export function hasProfileOption(userId: string | undefined, skip = false) {
  return queryOptions({
    queryKey: ["profile", "exists", userId],
    enabled: !!userId && !skip,
    staleTime: Infinity,
    retry: false,
    queryFn: async () => {
      try {
        await createProfile({ username: "__probe__", fullName: " ", bio: "" });
        return false;
      } catch (err) {
        if (isApiError(err) && err.status === 409) return true;
        return false;
      }
    },
  });
}
