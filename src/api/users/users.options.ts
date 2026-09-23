import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { QueryStaleTime } from "@/api/base/base.const";
import {
  changePassword,
  getBillingInfo,
  getUserPreferences,
  getUserSettings,
  updateEmail,
  updateProfileVisibility,
  updateUserPreferences,
} from "@/api/users/users.service";

export const userSettingsQueryOptions = queryOptions({
  queryKey: ["user", "settings"],
  queryFn: ({ signal }) => getUserSettings({ signal }),
  staleTime: QueryStaleTime.fiveMins,
});

export const billingInfoQueryOptions = queryOptions({
  queryKey: ["user", "billing"],
  queryFn: ({ signal }) => getBillingInfo({ signal }),
  staleTime: QueryStaleTime.fifteenMins,
});

export const userPreferencesQueryOptions = queryOptions({
  queryKey: ["user", "preferences"],
  queryFn: ({ signal }) => getUserPreferences({ signal }),
  staleTime: QueryStaleTime.fiveMins,
});

export const updatePreferencesOption = mutationOptions({
  mutationKey: ["user", "preferences", "update"],
  mutationFn: updateUserPreferences,
});

export const updateEmailOption = mutationOptions({
  mutationKey: ["user", "email", "update"],
  mutationFn: updateEmail,
});

export const changePasswordOption = mutationOptions({
  mutationKey: ["auth", "password", "change"],
  mutationFn: changePassword,
});

export const updateVisibilityOption = mutationOptions({
  mutationKey: ["profile", "visibility", "update"],
  mutationFn: updateProfileVisibility,
});
