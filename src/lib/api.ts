import "server-only";
import { env } from "@/env/server";
import { getSession, createSession, deleteSession } from "@/lib/session";
import { unauthorized } from "next/navigation";

export function extractTokensFromResponse(headers: Headers) {
  const cookies: string[] =
    typeof (headers as unknown as { getSetCookie?: () => string[] })
      .getSetCookie === "function"
      ? (headers as unknown as { getSetCookie: () => string[] }).getSetCookie()
      : (headers.get("set-cookie") ?? "")
          .split(/,(?=[^ ])/)
          .map((s) => s.trim());

  const find = (names: string[]) => {
    for (const cookie of cookies) {
      for (const name of names) {
        const m = cookie.match(new RegExp(`^${name}=([^;]+)`, "i"));
        if (m) return decodeURIComponent(m[1]);
      }
    }
    return undefined;
  };

  return {
    accessToken: find(["access_token", "accessToken"]),
    refreshToken: find(["refresh_token", "refreshToken"]),
  };
}

type ApiOptions = Omit<RequestInit, "body"> & { body?: unknown };

export async function apiFetch(path: string, options: ApiOptions = {}) {
  const session = await getSession();
  const { body, headers, ...rest } = options;

  const requestConfig: RequestInit = {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(session?.accessToken
        ? { Authorization: `Bearer ${session.accessToken}` }
        : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  };

  let res = await fetch(`${env.API_BASE_URL}${path}`, requestConfig).catch(
    (e: unknown) => {
      throw new Error(
        `API unreachable at ${env.API_BASE_URL}${path}: ${e instanceof Error ? e.message : String(e)}`
      );
    }
  );

  // If unauthorized, attempt to refresh the token using the refresh token
  if (
    res.status === 401 &&
    session?.refreshToken &&
    path !== "/api/auth/refresh"
  ) {
    const refreshRes = await fetch(`${env.API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });

    if (refreshRes.ok) {
      const { accessToken, refreshToken } = await refreshRes.json();

      try {
        await createSession({ accessToken, refreshToken });
      } catch (_e) {
        // In Server Components, createSession will throw because cookies cannot be modified.
        // We throw unauthorized() to trigger the Next.js boundary instead.
        unauthorized();
      }

      // Retry the original request with the new access token
      const retryConfig: RequestInit = {
        ...requestConfig,
        headers: {
          ...requestConfig.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      };

      res = await fetch(`${env.API_BASE_URL}${path}`, retryConfig);
    } else {
      try {
        await deleteSession();
      } catch (_e) {
        unauthorized();
      }
    }
  }

  return res;
}
