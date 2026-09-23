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

export const USER_SEARCH_MIN_LENGTH = 2;

type ApiUserStatus =
  | "active"
  | "suspended"
  | "deactivated"
  | "flagged_for_review"
  | "blocked";

type ApiUserSummary = {
  id: string;
  fullName: string | null;
  username: string | null;
  email: string;
  status: ApiUserStatus;
  role: UserRole | null;
  isPublished: boolean;
  isActive: boolean;
  photoUrl: string | null;
  createdAt: string;
};

type ApiUserDetail = ApiUserSummary & {
  profileCompletion: number;
  views: number;
  clicks: number;
  searchConversion: number;
};

type AdminEnvelope<T> = { success: boolean; data: T };

type ApiUserSearchData = {
  results: ApiUserSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const STATUS_FROM_API: Record<ApiUserStatus, UserStatus> = {
  active: "active",
  suspended: "suspended",
  deactivated: "inactive",
  flagged_for_review: "flagged",
  blocked: "blocked",
};

const ACTION_TO_API: Record<UserActionType, string> = {
  suspend: "suspend",
  reactivate: "reactivate",
  deactivate: "deactivate",
  flag: "flag_for_review",
  block: "block",
};

const EMPTY_FEATURE_FLAGS: UserFeatureFlags = {
  advancedAnalytics: false,
  premiumTemplates: false,
  customDomain: false,
  inviteLoopBeta: false,
};

function toInitials(fullName: string | null, username: string | null) {
  const source = (fullName || username || "").trim();
  if (!source) return "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function toLookupUser(user: ApiUserSummary | ApiUserDetail): LookupUser {
  const detail = user as Partial<ApiUserDetail>;
  return {
    id: user.id,
    fullName: user.fullName ?? "",
    username: user.username ?? "",
    initials: toInitials(user.fullName, user.username),
    status: STATUS_FROM_API[user.status] ?? "active",
    completion: detail.profileCompletion ?? 0,
    views: detail.views ?? 0,
    clicks: detail.clicks ?? 0,
    conversion: detail.searchConversion ?? 0,
    lastActiveAt: "",
    memberSince: user.createdAt,
    featureFlags: EMPTY_FEATURE_FLAGS,
  };
}

export async function searchUsers(query: string, signal?: AbortSignal) {
  const envelope = await callApi<AdminEnvelope<ApiUserSearchData>>({
    url: "/admin/users",
    method: "GET",
    params: { q: query },
    signal,
  });

  const data = envelope?.data;
  return {
    users: (data?.results ?? []).map(toLookupUser),
    total: data?.total ?? 0,
  } satisfies UserLookupResponse;
}

export async function getLookupUserDetail(
  userId: string,
  signal?: AbortSignal
) {
  const envelope = await callApi<AdminEnvelope<ApiUserDetail>>({
    url: `/admin/users/${userId}`,
    method: "GET",
    signal,
  });

  return toLookupUser(envelope.data);
}

export async function performUserAction(
  userId: string,
  action: UserActionType
) {
  return callApi<{ success: boolean }>({
    url: `/admin/users/${userId}/status`,
    method: "PATCH",
    data: { action: ACTION_TO_API[action] },
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
