import { env } from "@/env/client";

export function getProfileUrl(username?: string) {
  if (!username) return "";
  return `${env.NEXT_PUBLIC_PROFILE_BASE_URL}/${username}`;
}

export function getDisplayUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function getImageUrl(path?: string | null) {
  if (!path) return "";
  if (path.includes("example.com")) return "";

  if (path.startsWith("http")) return path;

  return `${env.NEXT_PUBLIC_API_URL}${path}`;
}
