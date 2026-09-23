"use client";

import { cn } from "@/lib/utils";
import type { LookupUser, UserActionType } from "@/api/admin/admin.service";

type ModalConfig = {
  title: string;
  description: (name: string) => string;
  confirmLabel: string;
  confirmClass: string;
};

const modalConfig: Record<UserActionType, ModalConfig> = {
  suspend: {
    title: "Suspend User?",
    description: () =>
      "This user will temporarily lose access to their account until an admin reactivates it.",
    confirmLabel: "Suspend",
    confirmClass: "bg-negative-bg hover:bg-negative-hover-bg text-white",
  },
  block: {
    title: "Block User?",
    description: () =>
      "This user will be permanently blocked and will not be able to sign in to their account.",
    confirmLabel: "Block",
    confirmClass: "bg-negative-bg hover:bg-negative-hover-bg text-white",
  },
  deactivate: {
    title: "Deactivate Account?",
    description: () =>
      "This account will be deactivated and removed from public view. The user can be reactivated later.",
    confirmLabel: "Deactivate",
    confirmClass: "bg-negative-bg hover:bg-negative-hover-bg text-white",
  },
  flag: {
    title: "Flag for Review?",
    description: () =>
      "This account will be marked for admin review. No access changes will occur immediately.",
    confirmLabel: "Flag",
    confirmClass: "bg-negative-bg hover:bg-negative-hover-bg text-white",
  },
  reactivate: {
    title: "Reactivate Account?",
    description: () =>
      "This user will regain full access to their account and profile.",
    confirmLabel: "Reactivate",
    confirmClass: "bg-brand-bg hover:bg-brand-hover-bg text-inverse-text",
  },
};

export type ActionModalProps = {
  action: UserActionType;
  user: LookupUser;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
};

export function ActionModal({
  action,
  user,
  onConfirm,
  onCancel,
  isPending,
}: ActionModalProps) {
  const config = modalConfig[action];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      onClick={() => {
        if (!isPending) onCancel();
      }}
    >
      <div
        className="bg-card w-full max-w-sm rounded-[8px] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-primary-text mb-1 text-base font-semibold">
          {config.title}
        </h2>

        <p className="text-secondary-text mb-5 text-sm">
          {config.description(user.fullName)}
        </p>

        <div className="border-tertiary-b mb-5 flex items-center gap-3 rounded-[8px] border px-3 py-2.5">
          <div className="bg-brand-hover-bg text-inverse-text flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
            {user.initials}
          </div>
          <div className="min-w-0">
            <p className="text-primary-text truncate text-sm font-medium">
              {user.fullName}
            </p>
            <p className="text-tertiary-text truncate text-xs">
              @{user.username}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="border-tertiary-b text-primary-text hover:bg-hover-bg flex-1 rounded-[8px] border py-2.5 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={cn(
              "flex-1 rounded-[8px] py-2.5 text-sm font-semibold transition-colors active:scale-95 disabled:pointer-events-none disabled:opacity-50",
              config.confirmClass
            )}
          >
            {isPending ? `${config.confirmLabel}…` : config.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
