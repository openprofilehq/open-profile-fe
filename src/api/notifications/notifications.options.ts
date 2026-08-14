import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { QueryStaleTime } from "@/api/base/base.const";
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
  markAsUnread,
} from "./notifications.service";
import { GetNotificationsParams } from "./notifications.type";

export const notificationsQueryOptions = (params?: GetNotificationsParams) =>
  queryOptions({
    queryKey: ["notifications", params?.page ?? 1, params?.limit ?? 20],
    queryFn: ({ signal }) => getNotifications(params, signal),
    staleTime: QueryStaleTime.thirtySeconds,
  });

export const unreadCountQueryOptions = () =>
  queryOptions({
    queryKey: ["notifications", "unread-count"],
    queryFn: ({ signal }) => getUnreadCount(signal),
    staleTime: QueryStaleTime.thirtySeconds,
  });

export const markAsReadMutationOption = mutationOptions({
  mutationKey: ["notifications", "mark-read"],
  mutationFn: (id: string) => markAsRead(id),
});

export const markAsUnreadMutationOption = mutationOptions({
  mutationKey: ["notifications", "mark-unread"],
  mutationFn: (id: string) => markAsUnread(id),
});

export const markAllAsReadMutationOption = mutationOptions({
  mutationKey: ["notifications", "mark-all-read"],
  mutationFn: () => markAllAsRead(),
});
