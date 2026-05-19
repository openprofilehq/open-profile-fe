import { callApi } from "@/api/base";
import {
  CreateProfileRequest,
  CreateProfileResponse,
  UsernameCheckResponse,
  ProfileResponse,
  DashboardProfileResponse,
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
