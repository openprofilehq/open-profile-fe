import { callApi } from "@/api/base";

export type CreateProfileRequest = {
  username: string;
  fullName?: string;
  bio: string;
  photoUrl?: string;
};

export async function createProfile(data: CreateProfileRequest) {
  return callApi({
    url: `/profile`,
    method: "POST",
    data,
  });
}
