"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutOption } from "@/api/auth/auth.options";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    ...logoutOption,
    onSettled: async () => {
      // Clear the client-set token cookies
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      // Bust the cached user so nothing stale lingers
      await queryClient.resetQueries({ queryKey: ["auth", "me"] });
      router.replace("/login");
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold">Coming Soon</h1>
      <p className="text-muted-foreground">
        Your dashboard is on its way. Stay tuned!
      </p>
      <Button
        variant="outline"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
      >
        {logoutMutation.isPending ? "Logging out…" : "Log out"}
      </Button>
    </div>
  );
}
