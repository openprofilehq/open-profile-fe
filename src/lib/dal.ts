import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export const getCurrentSession = cache(async () => {
  return getSession();
});

export const verifySession = cache(async () => {
  const session = await getCurrentSession();
  if (!session?.accessToken) redirect("/login");
  return session;
});
