"use client";

import { useRouter } from "next/navigation";
import { callApi } from "@/api/base";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await callApi({ url: "/auth/logout", method: "POST" });
    } finally {
      document.cookie = "auth=; path=/; max-age=0";
      document.cookie = "access_token=; path=/; max-age=0";
      router.replace("/login");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold">Coming Soon</h1>
      <p className="text-muted-foreground">
        Your dashboard is on its way. Stay tuned!
      </p>
      <Button variant="outline" onClick={handleLogout}>
        Log out
      </Button>
    </div>
  );
}
