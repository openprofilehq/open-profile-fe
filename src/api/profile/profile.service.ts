import { callApi } from "@/api/base";
import {
  CreateProfileRequest,
  CreateProfileResponse,
  UsernameCheckResponse,
  ProfileResponse,
} from "./profile.type";

export function createProfile(data: CreateProfileRequest) {
  return callApi<CreateProfileResponse>({
    url: "/profile",
    method: "POST",
    data,
  });
}

export function checkUsername(username: string, signal?: AbortSignal) {
  return callApi<UsernameCheckResponse>({
    url: "/usernames/check",
    method: "GET",
    params: { username },
    signal,
  });
}

export function getProfileByUsername(username: string) {
  return callApi<ProfileResponse>({
    url: `/profile/${username}`,
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
