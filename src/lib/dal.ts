import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";

export const getCurrentSession = cache(async () => {
  const store = await cookies();
  // Check for presence of backend cookies (e.g. 'access_token' or 'session')
  // This is a heuristic since we can't read HttpOnly cookies easily on client,
  // but Server Components can see all cookies.
  return store.get("accessToken") || store.get("session");
});

export const verifySession = cache(async () => {
  const session = await getCurrentSession();
  // We let the API calls handle the 401s and redirect to login if unauthorized.
  return session;
});
