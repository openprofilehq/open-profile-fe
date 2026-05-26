import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type {
  UpsertDraftRequest,
  ProfileAppearanceRequest,
} from "./profile.type";
import {
  createProfile,
  checkUsername,
  getDashboardProfile,
  getProfileContent,
  getDraftState,
  upsertDraft,
  publishProfile,
  updateProfileAppearance,
} from "./profile.service";
import { isQueryEnabled } from "@/api/base/base.util";
import { QueryStaleTime } from "@/api/base/base.const";

export const createProfileOption = mutationOptions({
  mutationKey: ["profile", "create"],
  mutationFn: createProfile,
});

export function dashboardProfileOption() {
  return queryOptions({
    queryKey: ["profile", "dashboard"],
    queryFn: ({ signal }) => getDashboardProfile(signal),
    staleTime: QueryStaleTime.fiveMins,
  });
}

export function checkUsernameOption(username: string | undefined) {
  return queryOptions({
    queryKey: ["username-availability", username],
    enabled: isQueryEnabled(username),
    queryFn: ({ signal }) => checkUsername(username!, signal),
    staleTime: QueryStaleTime.fiveMins,
  });
}

export function profileContentOption() {
  return queryOptions({
    queryKey: ["profile", "content"],
    queryFn: ({ signal }) => getProfileContent(signal),
    staleTime: 0,
  });
}

export function draftStateOption() {
  return queryOptions({
    queryKey: ["profile", "draft-state"],
    queryFn: ({ signal }) => getDraftState(signal),
    staleTime: 0,
  });
}

export const upsertDraftOption = mutationOptions({
  mutationKey: ["profile", "draft", "upsert"],
  mutationFn: (variables: {
    data: UpsertDraftRequest;
    draftVersion?: string | null;
  }) => upsertDraft(variables.data, variables.draftVersion),
});

export const publishProfileOption = mutationOptions({
  mutationKey: ["profile", "publish"],
  mutationFn: publishProfile,
});

export const updateProfileAppearanceOption = mutationOptions({
  mutationKey: ["profile", "appearance", "update"],
  mutationFn: (data: ProfileAppearanceRequest) => updateProfileAppearance(data),
});
