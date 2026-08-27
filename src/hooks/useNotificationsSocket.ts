"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { env } from "@/env/client";
import { ROUTES } from "@/constants/routes";
import { NotificationItem } from "@/api/notifications/notifications.type";

interface UseNotificationsSocketOptions {
  enabled?: boolean;
}

function getSocketBaseUrl(): string {
  return env.NEXT_PUBLIC_SOCKET_URL || env.NEXT_PUBLIC_API_URL;
}

export function useNotificationsSocket(
  options: UseNotificationsSocketOptions = {}
) {
  const { enabled = true } = options;
  const queryClient = useQueryClient();
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);

  const reconnect = useCallback(() => {
    if (socketRef.current?.disconnected) {
      socketRef.current.connect();
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const baseUrl = getSocketBaseUrl();
    const socketUrl = `${baseUrl.replace(/\/$/, "")}/notifications`;

    const socketInstance = io(socketUrl, {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["polling", "websocket"],
    });

    socketRef.current = socketInstance;

    socketInstance.on("notification:new", (payload: NotificationItem) => {
      // Optimistically increment unread count for immediate badge UI response
      queryClient.setQueryData(
        ["notifications", "unread-count"],
        (old: number = 0) => old + 1
      );

      // Invalidate notifications queries to trigger background UI refetch
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      if (payload.title) {
        toast(payload.title, {
          description: payload.body,
          action: {
            label: "View",
            onClick: () => {
              const targetUrl =
                (payload.metadata?.url as string) ||
                ROUTES.dashboard.notifications;
              router.push(targetUrl);
            },
          },
        });
      }
    });

    socketInstance.on("disconnect", (reason) => {
      if (process.env.NODE_ENV === "development") {
        console.warn("[useNotificationsSocket] Socket disconnected:", reason);
        if (reason === "io server disconnect") {
          console.warn(
            "[useNotificationsSocket] Server disconnected the socket immediately. This indicates missing or unauthenticated cookies in the socket handshake."
          );
        }
      }
    });

    socketInstance.on("connect_error", (error) => {
      if (process.env.NODE_ENV === "development") {
        console.warn("[useNotificationsSocket] Socket status:", error.message);
      }
    });

    const handleFocus = () => {
      if (socketInstance.disconnected) {
        socketInstance.connect();
      }
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };

    const handleOnline = () => {
      if (socketInstance.disconnected) {
        socketInstance.connect();
      }
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };

    // Auto-reconnect when REST client completes a silent 401 token refresh
    const handleAuthRefreshed = () => {
      if (socketInstance.disconnected) {
        socketInstance.connect();
      }
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("online", handleOnline);
    window.addEventListener("auth:refreshed", handleAuthRefreshed);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("auth:refreshed", handleAuthRefreshed);
      socketInstance.disconnect();
      socketRef.current = null;
    };
  }, [enabled, queryClient, router]);

  return {
    reconnect,
    getSocket: () => socketRef.current,
  };
}
