export type NotificationType =
  | "INVITE_CLAIMED"
  | "SYSTEM_ANNOUNCEMENT"
  | "PROFILE_VIEW_MILESTONE"
  | (string & {});

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  metadata?: Record<string, unknown> | null;
  dedupeKey?: string | null;
  readAt?: string | null;
  createdAt: string;
}

export interface NotificationsResponse {
  items: NotificationItem[];
  total: number;
  page: number;
  limit: number;
}

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
}
