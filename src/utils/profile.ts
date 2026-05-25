import { env } from "@/env/client";

const PROFILE_BASE_URL = env.NEXT_PUBLIC_PROFILE_BASE_URL;

export function getProfileUrl(username?: string) {
  if (!username) return "";
  return `${PROFILE_BASE_URL.replace(/\/$/, "")}/${username}`;
}

export function getDisplayUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function getBaseDisplayUrl() {
  return getDisplayUrl(PROFILE_BASE_URL);
}

export function getImageUrl(path?: string | null) {
  if (!path) return "";

  try {
    if (path.startsWith("http")) {
      const parsedUrl = new URL(path);
      if (
        parsedUrl.hostname === "example.com" ||
        parsedUrl.hostname === "www.example.com"
      ) {
        return "";
      }
    }
  } catch {
    // Fail-safe substring match for relative placeholder links
    if (path.includes("example.com")) {
      return "";
    }
  }

  // Fallback check for any lingering relative example.com references
  if (path.includes("example.com")) {
    return "";
  }

  if (path.startsWith("http")) return path;

  return `${env.NEXT_PUBLIC_API_URL}${path}`;
}

/**
 * Safely sanitizes external and internal user-provided links.
 * Normalizes bare hostnames to include https:// protocol, and actively prevents
 * XSS script injection vectors by rejecting unsafe schemes (e.g. javascript:).
 */
export function sanitizeUrl(url?: string | null): string {
  if (!url) return "#";
  const trimmed = url.trim();

  // Block malicious script injection attempts
  if (/^javascript:/i.test(trimmed)) {
    return "#";
  }

  // Allow standard web links, mail links, and telephone numbers
  if (trimmed.startsWith("/") || /^(https?:|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }

  // Fallback for bare hostnames (e.g. "google.com")
  return `https://${trimmed}`;
}
