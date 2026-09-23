import { ApiOptions, callApi } from "@/api/base";
import type {
  BillingInfo,
  ChangePasswordRequest,
  UpdateEmailRequest,
  UpdateEmailResponse,
  UpdatePreferencesRequest,
  UpdateVisibilityRequest,
  UserPreferences,
  UserSettings,
  VisibilityResponse,
} from "@/api/users/users.type";

export function getUserSettings({ signal }: ApiOptions = {}) {
  return callApi<UserSettings>({
    url: "/users/me/settings",
    method: "GET",
    signal,
  });
}

export function getBillingInfo({ signal }: ApiOptions = {}) {
  return callApi<BillingInfo>({
    url: "/users/me/billing",
    method: "GET",
    signal,
  });
}

export function getUserPreferences({ signal }: ApiOptions = {}) {
  return callApi<UserPreferences>({
    url: "/users/me/preferences",
    method: "GET",
    signal,
  });
}

export function updateUserPreferences(data: UpdatePreferencesRequest) {
  return callApi<UserPreferences>({
    url: "/users/me/preferences",
    method: "PATCH",
    data,
  });
}

export function updateEmail(data: UpdateEmailRequest) {
  return callApi<UpdateEmailResponse>({
    url: "/users/me/email",
    method: "PATCH",
    data,
  });
}

export function changePassword(data: ChangePasswordRequest) {
  return callApi<{ message?: string }>({
    url: "/auth/password",
    method: "PATCH",
    data,
  });
}

export function updateProfileVisibility(data: UpdateVisibilityRequest) {
  return callApi<VisibilityResponse>({
    url: "/profiles/me/visibility",
    method: "PATCH",
    data,
  });
}
