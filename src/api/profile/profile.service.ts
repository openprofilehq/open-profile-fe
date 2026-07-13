import { callApi } from "@/api/base";
import {
  CreateProfileRequest,
  CreateProfileResponse,
  UsernameCheckResponse,
  ProfileResponse,
  DashboardProfileResponse,
  ProfileContentResponse,
  UpsertDraftRequest,
  UpsertDraftResponse,
  DraftStateResponse,
  PublishProfileResponse,
  ProfileAppearanceRequest,
  ProfileAppearanceResponse,
  GetProfileAppearanceResponse,
  CreateSkillRequest,
  UpdateSkillRequest,
  ReorderSkillsRequest,
  ReorderSkillsResponse,
  SkillResponseDto,
  CreateEducationRequest,
  UpdateEducationRequest,
  ReorderEducationRequest,
  ReorderEducationResponse,
  EducationResponseDto,
  CreateWorkExperienceRequest,
  UpdateWorkExperienceRequest,
  ReorderWorkExperienceRequest,
  ReorderWorkExperienceResponse,
  WorkExperienceResponseDto,
  ProfileComponentUpdateRequest,
  ReorderProfileComponentsRequest,
} from "./profile.type";

export function createProfile(data: CreateProfileRequest) {
  return callApi<CreateProfileResponse>({
    url: "/profiles",
    method: "POST",
    data,
  });
}

export function getDashboardProfile(signal?: AbortSignal) {
  return callApi<DashboardProfileResponse>({
    url: "/profiles/dashboard",
    method: "GET",
    signal,
  });
}

export async function checkUsername(username: string, signal?: AbortSignal) {
  const data = await callApi<
    UsernameCheckResponse & { statusCode?: number; error?: string }
  >({
    url: "/usernames/check",
    method: "GET",
    params: { username },
    signal,
  });

  if (data.error === "USERNAME_TAKEN" || data.statusCode === 409) {
    return { available: false, username };
  }

  return data;
}

export function getProfileByUsername(username: string) {
  return callApi<ProfileResponse>({
    url: `/profiles/${username}`,
    method: "GET",
  });
}

export function searchProfiles(q: string, signal?: AbortSignal) {
  return callApi<ProfileResponse[]>({
    url: "/search",
    method: "GET",
    params: { q },
    signal,
  });
}

export function getProfileContent(signal?: AbortSignal) {
  return callApi<ProfileContentResponse>({
    url: "/profiles/content",
    method: "GET",
    signal,
  });
}

export function getDraftState(signal?: AbortSignal) {
  return callApi<DraftStateResponse>({
    url: "/profiles/content/state",
    method: "GET",
    signal,
  });
}

/**
 * Saves or updates a draft of the profile content.
 *
 * @note The `_draftVersion` parameter represents the optimistic concurrency version (`updatedAt`).
 * We temporarily exclude forwarding this version inside the custom `X-Draft-Version` header
 * because the remote staging server CORS preflight configuration rejects custom headers.
 * Forwarding will be re-enabled once the CORS configuration is updated on the backend.
 */
export function upsertDraft(
  data: UpsertDraftRequest,
  _draftVersion?: string | null
) {
  const headers: Record<string, string> = {};
  // Temporarily commented out due to staging server CORS preflight blocking x-draft-version header
  /*
  if (_draftVersion) {
    headers["X-Draft-Version"] = _draftVersion;
  }
  */
  return callApi<UpsertDraftResponse>({
    url: "/profiles/content",
    method: "PUT",
    data,
    headers: Object.keys(headers).length > 0 ? headers : undefined,
  });
}

export function updateProfile(
  username: string,
  data: { fullName?: string; bio?: string | null; photoUrl?: string | null }
) {
  return callApi<DashboardProfileResponse>({
    url: `/profiles/${username}`,
    method: "PATCH",
    data,
  });
}

export function publishProfile() {
  return callApi<PublishProfileResponse>({
    url: "/profiles/publish",
    method: "POST",
  });
}

export function updateProfileAppearance(data: ProfileAppearanceRequest) {
  return callApi<ProfileAppearanceResponse>({
    url: "/profiles/appearance",
    method: "PATCH",
    data,
  });
}

export function getProfileAppearance(signal?: AbortSignal) {
  return callApi<GetProfileAppearanceResponse>({
    url: "/profiles/appearance",
    method: "GET",
    signal,
  });
}

export function getProfileSkills(signal?: AbortSignal) {
  return callApi<SkillResponseDto[]>({
    url: "/profiles/me/skills",
    method: "GET",
    signal,
  });
}

export function createProfileSkill(data: CreateSkillRequest) {
  return callApi<SkillResponseDto>({
    url: "/profiles/me/skills",
    method: "POST",
    data,
  });
}

export function updateProfileSkill(skillId: string, data: UpdateSkillRequest) {
  return callApi<SkillResponseDto>({
    url: `/profiles/me/skills/${skillId}`,
    method: "PATCH",
    data,
  });
}

export function deleteProfileSkill(skillId: string) {
  return callApi<void>({
    url: `/profiles/me/skills/${skillId}`,
    method: "DELETE",
  });
}

export function reorderProfileSkills(data: ReorderSkillsRequest) {
  return callApi<ReorderSkillsResponse>({
    url: "/profiles/me/skills/order",
    method: "PUT",
    data,
  });
}

export function getProfileEducation(signal?: AbortSignal) {
  return callApi<EducationResponseDto[]>({
    url: "/profiles/me/education",
    method: "GET",
    signal,
  });
}

export function createProfileEducation(data: CreateEducationRequest) {
  return callApi<EducationResponseDto>({
    url: "/profiles/me/education",
    method: "POST",
    data,
  });
}

export function updateProfileEducation(
  educationId: string,
  data: UpdateEducationRequest
) {
  return callApi<EducationResponseDto>({
    url: `/profiles/me/education/${educationId}`,
    method: "PATCH",
    data,
  });
}

export function deleteProfileEducation(educationId: string) {
  return callApi<void>({
    url: `/profiles/me/education/${educationId}`,
    method: "DELETE",
  });
}

export function reorderProfileEducation(data: ReorderEducationRequest) {
  return callApi<ReorderEducationResponse>({
    url: "/profiles/me/education/order",
    method: "PUT",
    data,
  });
}

export function getProfileWorkExperience(signal?: AbortSignal) {
  return callApi<WorkExperienceResponseDto[]>({
    url: "/profiles/me/work-experience",
    method: "GET",
    signal,
  });
}

export function createProfileWorkExperience(data: CreateWorkExperienceRequest) {
  return callApi<WorkExperienceResponseDto>({
    url: "/profiles/me/work-experience",
    method: "POST",
    data,
  });
}

export function updateProfileWorkExperience(
  workExperienceId: string,
  data: UpdateWorkExperienceRequest
) {
  return callApi<WorkExperienceResponseDto>({
    url: `/profiles/me/work-experience/${workExperienceId}`,
    method: "PATCH",
    data,
  });
}

export function deleteProfileWorkExperience(workExperienceId: string) {
  return callApi<void>({
    url: `/profiles/me/work-experience/${workExperienceId}`,
    method: "DELETE",
  });
}

export function reorderProfileWorkExperience(
  data: ReorderWorkExperienceRequest
) {
  return callApi<ReorderWorkExperienceResponse>({
    url: "/profiles/me/work-experience/order",
    method: "PUT",
    data,
  });
}

export function updateProfileComponent(
  componentId: string,
  data: ProfileComponentUpdateRequest
) {
  return callApi<unknown>({
    url: `/profiles/me/components/${componentId}`,
    method: "PATCH",
    data,
  });
}

export function reorderProfileComponents(
  data: ReorderProfileComponentsRequest
) {
  return callApi<unknown>({
    url: "/profiles/me/components/order",
    method: "PUT",
    data,
  });
}
