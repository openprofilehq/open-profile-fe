"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCheck, BellOff } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  notificationsQueryOptions,
  unreadCountQueryOptions,
  markAsReadMutationOption,
  markAsUnreadMutationOption,
  markAllAsReadMutationOption,
} from "@/api/notifications/notifications.options";
import { NotificationItem } from "@/api/notifications/notifications.type";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import {
  NotificationSidebar,
  NotificationTab,
} from "@/components/notifications/NotificationSidebar";
import { NotificationSkeleton } from "@/components/notifications/NotificationSkeleton";
import { Button } from "@/components/ui/button";

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "mock-1",
    userId: "user-1",
    type: "SYSTEM_ANNOUNCEMENT",
    title: "Don't forget to complete your profile to unlock more features.",
    body: "",
    readAt: null,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "mock-2",
    userId: "user-1",
    type: "SYSTEM_ANNOUNCEMENT",
    title: "Your password was changed successfully.",
    body: "",
    readAt: "2026-08-14T09:00:00.000Z",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "mock-3",
    userId: "user-1",
    type: "PROFILE_VIEW_MILESTONE",
    title: "Cody Searched for you Profile",
    body: "",
    readAt: null,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: "mock-4",
    userId: "user-1",
    type: "PROFILE_VIEW_MILESTONE",
    title: "Anonymous Searched for your profile",
    body: "",
    readAt: "2026-08-14T08:00:00.000Z",
    createdAt: new Date(Date.now() - 28800000).toISOString(),
  },
  {
    id: "mock-5",
    userId: "user-1",
    type: "PROFILE_VIEW_MILESTONE",
    title: "Your Appeared in 5 searches this week",
    body: "",
    readAt: "2026-08-13T12:00:00.000Z",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "mock-6",
    userId: "user-1",
    type: "SYSTEM_ANNOUNCEMENT",
    title: "Welcome aboard! Your account is all set up and ready to go.",
    body: "",
    readAt: "2026-08-12T10:00:00.000Z",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

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
    onError: () => toast.error("Failed to mark notification as read."),
  });

  const markUnreadMutation = useMutation({
    ...markAsUnreadMutationOption,
    onSuccess: (_, id) => {
      setReadStateMap((prev) => ({ ...prev, [id]: false }));
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => toast.error("Failed to mark notification as unread."),
  });

  const markAllReadMutation = useMutation({
    ...markAllAsReadMutationOption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read.");
    },
    onError: () => toast.error("Failed to mark all notifications as read."),
  });

  const rawItems = data?.items?.length ? data.items : MOCK_NOTIFICATIONS;

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
        item.title.toLowerCase().includes("search")
    ).length;
    const read = items.filter((item) => !!item.readAt).length;

    return {
      all: items.length,
      searches,
      unread: serverUnreadCount || unread,
      read,
    };
  }, [items, serverUnreadCount]);

  const filteredItems = useMemo(() => {
    switch (activeTab) {
      case "searches":
        return items.filter(
          (item) =>
            item.type === "PROFILE_VIEW_MILESTONE" ||
            item.title.toLowerCase().includes("search")
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
    if (id.startsWith("mock-")) {
      setReadStateMap((prev) => ({ ...prev, [id]: true }));
      return;
    }
    markReadMutation.mutate(id);
  };

  const handleMarkAsUnread = (id: string) => {
    if (id.startsWith("mock-")) {
      setReadStateMap((prev) => ({ ...prev, [id]: false }));
      return;
    }
    markUnreadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    const updatedMap: Record<string, boolean> = {};
    items.forEach((item) => {
      updatedMap[item.id] = true;
    });
    setReadStateMap(updatedMap);
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

        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <NotificationSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={counts}
          />

          <div className="flex-1 space-y-4">
            {isLoading ? (
              <NotificationSkeleton />
            ) : filteredItems.length === 0 ? (
              <div className="bg-card border-tertiary-b flex flex-col items-center justify-center rounded-2xl border p-12 text-center shadow-xs">
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
