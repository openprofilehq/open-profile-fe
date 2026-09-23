import { callApi } from "@/api/base";
import { UserRole } from "@/api/auth/auth.type";

export type AdminUser = {
  id: string;
  email: string;
  fullName: string | null;
  username: string | null;
  role: UserRole | null;
  isVerified: boolean;
  onboardingComplete: boolean;
  isPublished: boolean;
  authProvider: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminUsersResponse = {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
};

export type AdminUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
  signal?: AbortSignal;
};

export async function getAdminUsers({
  page = 1,
  limit = 20,
  search,
  signal,
}: AdminUsersParams = {}) {
  return callApi<AdminUsersResponse>({
    url: "/admin/users",
    method: "GET",
    params: {
      page,
      limit,
      ...(search ? { search } : {}),
    },
    signal,
  });
}

export type UserStatus =
  | "active"
  | "suspended"
  | "inactive"
  | "flagged"
  | "blocked";

export type UserFeatureFlags = {
  advancedAnalytics: boolean;
  premiumTemplates: boolean;
  customDomain: boolean;
  inviteLoopBeta: boolean;
};

export type LookupUser = {
  id: string;
  fullName: string;
  username: string;
  initials: string;
  status: UserStatus;
  completion: number;
  views: number;
  clicks: number;
  conversion: number;
  lastActiveAt: string;
  memberSince: string;
  featureFlags: UserFeatureFlags;
};

export type UserLookupResponse = {
  users: LookupUser[];
  total: number;
};

export type UserActionType =
  | "suspend"
  | "reactivate"
  | "deactivate"
  | "flag"
  | "block";

export type UpdateUserFlagsPayload = {
  featureFlags: Partial<UserFeatureFlags>;
};

export async function searchUsers(query: string, signal?: AbortSignal) {
  return callApi<UserLookupResponse>({
    url: "/admin/users/search",
    method: "GET",
    params: { q: query },
    signal,
  });
}

export async function performUserAction(
  userId: string,
  action: UserActionType
) {
  return callApi<{ success: boolean }>({
    url: `/admin/users/${userId}/action`,
    method: "POST",
    data: { action },
  });
}

export async function updateUserFeatureFlags(
  userId: string,
  payload: UpdateUserFlagsPayload
) {
  return callApi<{ success: boolean }>({
    url: `/admin/users/${userId}/feature-flags`,
    method: "PATCH",
    data: payload,
  });
}

export type PlatformFlag = {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
};

export type FeatureFlagsResponse = {
  flags: PlatformFlag[];
  environment: {
    lastUpdatedAt: string;
    updatedBy: string;
    activeCount: number;
    totalCount: number;
  };
};

export async function getPlatformFlags() {
  return callApi<FeatureFlagsResponse>({
    url: "/admin/feature-flags",
    method: "GET",
  });
}

export async function updatePlatformFlag(key: string, enabled: boolean) {
  return callApi<{ success: boolean }>({
    url: `/admin/feature-flags/${key}`,
    method: "PATCH",
    data: { enabled },
  });
}
