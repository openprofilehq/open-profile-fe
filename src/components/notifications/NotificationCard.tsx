"use client";

import Link from "next/link";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { motion } from "motion/react";
import { NotificationItem } from "@/api/notifications/notifications.type";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";

interface NotificationCardProps {
  notification: NotificationItem;
  onMarkAsRead?: (id: string) => void;
  onMarkAsUnread?: (id: string) => void;
  isPending?: boolean;
}

export function NotificationCard({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  isPending = false,
}: NotificationCardProps) {
  const isUnread = !notification.readAt;
  const isWelcomeOrProfilePrompt =
    notification.type === "SYSTEM_ANNOUNCEMENT" ||
    notification.title.toLowerCase().includes("complete your profile") ||
    notification.title.toLowerCase().includes("welcome aboard");

  const actionUrl =
    (notification.metadata?.url as string) || ROUTES.dashboard.profileBuilder;

  const formattedDate = notification.createdAt
    ? new Date(notification.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
      className={`group relative rounded-2xl border p-5 transition-all duration-200 sm:p-6 ${
        isUnread
          ? "border-brand/30 bg-card shadow-xs"
          : "border-tertiary-b/70 bg-card/60 hover:bg-card"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5 pr-2">
          <div className="flex items-center gap-2">
            {isUnread && (
              <span
                aria-label="Unread notification"
                className="h-2 w-2 shrink-0 rounded-full bg-[#0f766e]"
              />
            )}
            <h3 className="text-primary-text text-sm font-semibold sm:text-base">
              {notification.title}
            </h3>
          </div>

          {notification.body && (
            <p className="text-secondary-text text-xs leading-relaxed font-normal sm:text-sm">
              {notification.body}
            </p>
          )}

          {formattedDate && (
            <div className="text-tertiary-text flex items-center gap-1 pt-1 text-[11px]">
              <Clock size={12} />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>

        {/* Action Button if welcome / onboarding prompt */}
        {isWelcomeOrProfilePrompt && (
          <div className="mt-2 shrink-0 sm:mt-0 sm:self-end">
            <Button
              asChild
              className="h-9 rounded-xl bg-[#87c4c4] px-4 text-xs font-semibold text-white shadow-none transition-all hover:bg-[#0f766e] active:scale-95 dark:bg-[#0f766e] dark:hover:bg-[#139a8c]"
            >
              <Link href={actionUrl}>Start Building</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Quick Mark Read / Unread toggle */}
      <div className="bg-background/90 absolute top-4 right-4 hidden items-center gap-1 rounded-lg border p-1 opacity-0 backdrop-blur-xs transition-opacity group-hover:flex group-hover:opacity-100">
        {isUnread ? (
          <button
            type="button"
            onClick={() => onMarkAsRead?.(notification.id)}
            disabled={isPending}
            title="Mark as read"
            className="text-tertiary-text hover:text-primary-text hover:bg-hover-bg rounded p-1 transition-colors disabled:opacity-40"
          >
            <CheckCircle2 size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onMarkAsUnread?.(notification.id)}
            disabled={isPending}
            title="Mark as unread"
            className="text-tertiary-text hover:text-primary-text hover:bg-hover-bg rounded p-1 transition-colors disabled:opacity-40"
          >
            <Circle size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
