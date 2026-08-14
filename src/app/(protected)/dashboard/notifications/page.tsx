"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCheck, BellOff } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { isApiError } from "@/api/base";
import {
  notificationsQueryOptions,
  unreadCountQueryOptions,
  markAsReadMutationOption,
  markAsUnreadMutationOption,
  markAllAsReadMutationOption,
} from "@/api/notifications/notifications.options";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import {
  NotificationSidebar,
  NotificationTab,
} from "@/components/notifications/NotificationSidebar";
import { NotificationSkeleton } from "@/components/notifications/NotificationSkeleton";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");
  const [readStateMap, setReadStateMap] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useQuery(
    notificationsQueryOptions({ page: 1, limit: 50 })
  );
  const { data: serverUnreadCount = 0 } = useQuery(unreadCountQueryOptions());

  const markReadMutation = useMutation({
    ...markAsReadMutationOption,
    onSuccess: (_, id) => {
      setReadStateMap((prev) => ({ ...prev, [id]: true }));
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err) =>
      toast.error(
        isApiError(err) ? err.message : "Failed to mark notification as read."
      ),
  });

  const markUnreadMutation = useMutation({
    ...markAsUnreadMutationOption,
    onSuccess: (_, id) => {
      setReadStateMap((prev) => ({ ...prev, [id]: false }));
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err) =>
      toast.error(
        isApiError(err) ? err.message : "Failed to mark notification as unread."
      ),
  });

  const markAllReadMutation = useMutation({
    ...markAllAsReadMutationOption,
    onSuccess: () => {
      setReadStateMap({});
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read.");
    },
    onError: (err) =>
      toast.error(
        isApiError(err)
          ? err.message
          : "Failed to mark all notifications as read."
      ),
  });

  const rawItems = data?.items ?? [];

  const items = useMemo(() => {
    return rawItems.map((item) => {
      if (item.id in readStateMap) {
        return {
          ...item,
          readAt: readStateMap[item.id] ? new Date().toISOString() : null,
        };
      }
      return item;
    });
  }, [rawItems, readStateMap]);

  const counts = useMemo(() => {
    const unread = items.filter((item) => !item.readAt).length;
    const searches = items.filter(
      (item) =>
        item.type === "PROFILE_VIEW_MILESTONE" ||
        (item.title && item.title.toLowerCase().includes("search")) ||
        (item.body && item.body.toLowerCase().includes("viewed"))
    ).length;
    const read = items.filter((item) => !!item.readAt).length;

    return {
      all: items.length,
      searches,
      unread:
        typeof serverUnreadCount === "number" ? serverUnreadCount : unread,
      read,
    };
  }, [items, serverUnreadCount]);

  const filteredItems = useMemo(() => {
    switch (activeTab) {
      case "searches":
        return items.filter(
          (item) =>
            item.type === "PROFILE_VIEW_MILESTONE" ||
            (item.title && item.title.toLowerCase().includes("search")) ||
            (item.body && item.body.toLowerCase().includes("viewed"))
        );
      case "unread":
        return items.filter((item) => !item.readAt);
      case "read":
        return items.filter((item) => !!item.readAt);
      case "all":
      default:
        return items;
    }
  }, [items, activeTab]);

  const handleMarkAsRead = (id: string) => {
    markReadMutation.mutate(id);
  };

  const handleMarkAsUnread = (id: string) => {
    markUnreadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllReadMutation.mutate();
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl space-y-6 pb-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-primary-text text-2xl font-bold tracking-tight sm:text-3xl">
              Notifications
            </h1>
            <p className="text-secondary-text mt-1 text-sm">
              Stay updated with your profile activity and system updates.
            </p>
          </div>

          {counts.unread > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAllReadMutation.isPending}
              className="border-tertiary-b text-primary-text hover:bg-hover-bg gap-1.5 self-start rounded-xl text-xs font-semibold sm:self-auto"
            >
              <CheckCheck size={14} />
              <span>Mark all as read</span>
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
          <NotificationSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={counts}
          />

          <div className="flex-1 space-y-4 md:flex md:flex-col md:justify-stretch">
            {isLoading ? (
              <NotificationSkeleton />
            ) : filteredItems.length === 0 ? (
              <div className="bg-card border-tertiary-b flex flex-1 flex-col items-center justify-center rounded-2xl border p-8 text-center shadow-xs md:h-full">
                <div className="bg-hover-bg text-tertiary-text mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                  <BellOff size={22} />
                </div>
                <h3 className="text-primary-text text-base font-semibold">
                  No notifications found
                </h3>
                <p className="text-tertiary-text mt-1 text-xs sm:text-sm">
                  You have no notifications under the `{activeTab}` filter right
                  now.
                </p>
              </div>
            ) : (
              filteredItems.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAsUnread={handleMarkAsUnread}
                  isPending={
                    markReadMutation.isPending || markUnreadMutation.isPending
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
