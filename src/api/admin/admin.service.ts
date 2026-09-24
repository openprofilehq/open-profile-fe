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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = await callApi<any>({
    url: "/admin/users",
    method: "GET",
    params: {
      page,
      limit,
      ...(search ? { q: search } : {}),
    },
    signal,
  });

  const data = raw?.results ? raw : (raw?.data ?? raw);
  return {
    users: (data?.results ?? []) as unknown as AdminUser[],
    total: data?.total ?? 0,
    page: data?.page ?? page,
    limit: data?.limit ?? limit,
  } satisfies AdminUsersResponse;
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

export type ApiUserDetail = ApiUserSummary & {
  profileCompletion: number;
  views: number;
  clicks: number;
  searchConversion: number;
};

export type ApiUserSearchData = {
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

function toLookupUser(user: any): LookupUser {
  if (!user) return {} as LookupUser;
  const fullName = user.fullName ?? user.name ?? user.display_name ?? "";
  const username = user.username ?? user.user_name ?? user.handle ?? "";
  const email = user.email ?? "";
  const displayName = fullName || username || email || "User";
  const displayUsername = username || (email ? email.split("@")[0] : "user");
  const status =
    STATUS_FROM_API[user.status as ApiUserStatus] ?? user.status ?? "active";

  return {
    id: user.id ?? user._id ?? String(Math.random()),
    fullName: displayName,
    username: displayUsername,
    initials: toInitials(fullName, username || email),
    status: (["active", "suspended", "inactive", "flagged", "blocked"].includes(
      status
    )
      ? status
      : "active") as UserStatus,
    completion: Math.round(user.profileCompletion ?? user.completion ?? 0),
    views: user.views ?? 0,
    clicks: user.clicks ?? 0,
    conversion: user.searchConversion ?? user.conversion ?? 0,
    lastActiveAt: user.lastActiveAt ?? "",
    memberSince: user.createdAt ?? user.memberSince ?? "",
    featureFlags: user.featureFlags ?? EMPTY_FEATURE_FLAGS,
  };
}

export async function searchUsers(query: string, signal?: AbortSignal) {
  const trimmed = query.trim();
  if (trimmed.length < USER_SEARCH_MIN_LENGTH) {
    return { users: [], total: 0 };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let raw: any = null;
  try {
    raw = await callApi<any>({
      url: "/admin/users",
      method: "GET",
      params: { q: trimmed },
      signal,
    });
  } catch {
    // proceed to fallback
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let list: any[] = [];
  if (Array.isArray(raw)) {
    list = raw;
  } else if (Array.isArray(raw?.results)) {
    list = raw.results;
  } else if (Array.isArray(raw?.users)) {
    list = raw.users;
  } else if (Array.isArray(raw?.items)) {
    list = raw.items;
  } else if (Array.isArray(raw?.data)) {
    list = raw.data;
  } else if (Array.isArray(raw?.data?.results)) {
    list = raw.data.results;
  } else if (Array.isArray(raw?.data?.users)) {
    list = raw.data.users;
  } else if (Array.isArray(raw?.data?.items)) {
    list = raw.data.items;
  }

  // Fallback to public search endpoint /search if admin endpoint returns 0 results
  if (list.length === 0) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fallbackRaw = await callApi<any>({
        url: "/search",
        method: "GET",
        params: { q: trimmed },
        signal,
      });

      const fallbackData = fallbackRaw?.data ?? fallbackRaw;
      const fallbackList =
        fallbackData?.results ??
        fallbackData?.users ??
        (Array.isArray(fallbackData) ? fallbackData : []);

      if (Array.isArray(fallbackList) && fallbackList.length > 0) {
        list = fallbackList;
      }
    } catch {
      // ignore fallback failure
    }
  }

  const total = raw?.total ?? raw?.data?.total ?? list.length;

  return {
    users: list.map(toLookupUser),
    total,
  } satisfies UserLookupResponse;
}

export async function getLookupUserDetail(
  userId: string,
  signal?: AbortSignal
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = await callApi<any>({
    url: `/admin/users/${userId}`,
    method: "GET",
    signal,
  });

  const user = raw?.id ? raw : (raw?.data ?? raw);
  return toLookupUser(user);
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
