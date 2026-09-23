import { callApi } from "@/api/base/base.service";
import {
  GetNotificationsParams,
  NotificationsResponse,
} from "./notifications.type";

export async function getNotifications(
  params?: GetNotificationsParams,
  signal?: AbortSignal
): Promise<NotificationsResponse> {
  return callApi<NotificationsResponse>({
    url: "/notifications",
    method: "GET",
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 20,
    },
    signal,
  });
}

export async function getUnreadCount(signal?: AbortSignal): Promise<number> {
  return callApi<number>({
    url: "/notifications/unread-count",
    method: "GET",
    signal,
  });
}

export async function markAsRead(id: string): Promise<{ success: boolean }> {
  return callApi<{ success: boolean }>({
    url: `/notifications/${id}/read`,
    method: "PATCH",
  });
}

export async function markAsUnread(id: string): Promise<{ success: boolean }> {
  return callApi<{ success: boolean }>({
    url: `/notifications/${id}/unread`,
    method: "PATCH",
  });
}

export async function markAllAsRead(): Promise<{ success: boolean }> {
  return callApi<{ success: boolean }>({
    url: "/notifications/read-all",
    method: "PATCH",
  });
}
