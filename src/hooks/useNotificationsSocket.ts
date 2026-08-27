"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { env } from "@/env/client";
import { NotificationItem } from "@/api/notifications/notifications.type";

function getSocketBaseUrl(): string {
  if (env.NEXT_PUBLIC_SOCKET_URL) {
    return env.NEXT_PUBLIC_SOCKET_URL;
  }
  return (
    env.NEXT_PUBLIC_API_URL || "https://api.staging.open-profile.hng14.com"
  );
}

export function useNotificationsSocket(enabled = true) {
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const baseUrl = getSocketBaseUrl();
    const socketUrl = `${baseUrl.replace(/\/$/, "")}/notifications`;

    const isStagingHost = baseUrl.includes("open-profile.hng14.com");

    const socketInstance = io(socketUrl, {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: isStagingHost ? ["polling"] : ["polling", "websocket"],
      upgrade: !isStagingHost,
    });

    socketInstance.on("connect", () => {
      setSocket(socketInstance);
    });

    socketInstance.on("notification:new", (payload: NotificationItem) => {
      // Invalidate notifications queries to trigger UI refetch & unread count badge update
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      if (payload.title) {
        toast(payload.title, {
          description: payload.body,
        });
      }
    });

    socketInstance.on("disconnect", (reason) => {
      setSocket(null);
      if (reason === "io server disconnect") {
        socketInstance.connect();
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

    window.addEventListener("focus", handleFocus);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("online", handleOnline);
      socketInstance.disconnect();
      setSocket(null);
    };
  }, [enabled, queryClient]);

  return {
    socket,
  };
}
