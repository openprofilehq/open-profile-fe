"use client";

import { useState } from "react";
import {
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  UserX,
  Flag,
  ShieldX,
} from "lucide-react";
import { GoArrowUpRight } from "react-icons/go";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  updateUserFeatureFlags,
  type LookupUser,
  type UserActionType,
  type UserFeatureFlags,
  type UserStatus,
} from "@/api/admin/admin.service";
import { StatusBadge, MetricsRow } from "./UserResultCard";

type ActionConfig = {
  action: UserActionType;
  label: string;
  icon: React.ElementType;
  destructive?: boolean;
};

export function getAvailableActions(status: UserStatus): ActionConfig[] {
  const flagForReview: ActionConfig = {
    action: "flag",
    label: "Flag for Review",
    icon: Flag,
  };
  const block: ActionConfig = {
    action: "block",
    label: "Block",
    icon: ShieldX,
    destructive: true,
  };

  switch (status) {
    case "active":
      return [
        { action: "suspend", label: "Suspend", icon: Clock },
        { action: "deactivate", label: "Deactivate", icon: UserX },
        flagForReview,
        block,
      ];
    case "suspended":
      return [
        { action: "reactivate", label: "Reactivate", icon: UserX },
        flagForReview,
        block,
      ];
    case "inactive":
    case "flagged":
      return [
        { action: "reactivate", label: "Reactivate", icon: UserX },
        flagForReview,
        block,
      ];
    case "blocked":
      return [
        { action: "reactivate", label: "Reactivate", icon: UserX },
        flagForReview,
      ];
    default:
      return [flagForReview, block];
  }
}

type FeatureKey = keyof UserFeatureFlags;

const featuresMeta: { key: FeatureKey; label: string; description: string }[] =
  [
    {
      key: "advancedAnalytics",
      label: "Advanced Analytics",
      description: "Access to detailed engagement insights and trend data.",
    },
    {
      key: "premiumTemplates",
      label: "Premium Templates",
      description: "Unlock professionally designed profile layout templates.",
    },
    {
      key: "customDomain",
      label: "Custom Domain",
      description: "Connect a custom domain to their Open.Profile page.",
    },
    {
      key: "inviteLoopBeta",
      label: "Invite Loop Beta",
      description: "Access to the invite loop feature currently in beta.",
    },
  ];

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors",
        "focus-visible:ring-brand-b focus-visible:ring-2 focus-visible:outline-none",
        checked ? "bg-brand-bg" : "bg-neutral-bg",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <span
        className={cn(
          "inline-block h-3.5 w-3.5 translate-x-0.5 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-[18px]"
        )}
      />
    </button>
  );
}

function Divider() {
  return <div className="border-tertiary-b mx-5 border-t-2" />;
}

export type UserManagePanelProps = {
  user: LookupUser;
  onClose: () => void;
  onRequestAction: (action: UserActionType) => void;
  actionPending?: boolean;
};

export default function UserManagePanel({
  user,
  onClose,
  onRequestAction,
  actionPending = false,
}: UserManagePanelProps) {
  const queryClient = useQueryClient();
  const [flags, setFlags] = useState<UserFeatureFlags>({
    ...user.featureFlags,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isDirty = (Object.keys(flags) as FeatureKey[]).some(
    (k) => flags[k] !== user.featureFlags[k]
  );

  const saveMutation = useMutation({
    mutationFn: () => updateUserFeatureFlags(user.id, { featureFlags: flags }),
    onSuccess: () => {
      toast.success("Feature flags updated.");
      queryClient.invalidateQueries({ queryKey: ["admin", "user-lookup"] });
    },
    onError: () => toast.error("Failed to save changes."),
  });

  const availableActions = getAvailableActions(user.status);

  return (
    <div className="bg-card border-card-selected-border flex flex-col rounded-[8px] border shadow-sm">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-brand-hover-bg text-inverse-text flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold">
              {user.initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-primary-text text-sm font-semibold">
                  {user.fullName}
                </p>
                <StatusBadge status={user.status} />
              </div>
              <p className="text-tertiary-text text-xs">@{user.username}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="text-tertiary-text hover:bg-hover-bg shrink-0 rounded-full p-1 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <div className="mt-4">
          <MetricsRow
            completion={user.completion}
            views={user.views}
            clicks={user.clicks}
            conversion={user.conversion}
          />
        </div>

        <p className="text-tertiary-text mt-3 text-xs">
          Last active {user.lastActiveAt} · Member since {user.memberSince}
        </p>
      </div>

      <div className="px-5 py-4">
        <p className="text-secondary-text mb-3 text-sm">Account Actions</p>
        <div className="flex items-center justify-between">
          <a
            href={`/${user.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link-text hover:text-link-hover-text flex items-center gap-1 text-sm font-medium transition-colors"
          >
            View Profile
            <GoArrowUpRight size={15} aria-hidden="true" />
          </a>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              disabled={actionPending}
              className="border-tertiary-b text-primary-text hover:bg-hover-bg flex items-center gap-1.5 rounded-[8px] border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
            >
              More Actions
              {dropdownOpen ? (
                <ChevronUp size={13} aria-hidden="true" />
              ) : (
                <ChevronDown size={13} aria-hidden="true" />
              )}
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10 hidden lg:block"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="bg-card border-tertiary-b absolute top-full right-0 z-20 mt-1 hidden w-44 rounded-[8px] border py-1 shadow-lg lg:block">
                  {availableActions.map(
                    ({ action, label, icon: Icon, destructive }) => (
                      <button
                        key={action}
                        onClick={() => {
                          setDropdownOpen(false);
                          onRequestAction(action);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors",
                          destructive
                            ? "border-tertiary-b text-danger-text hover:bg-negative-subtle-bg border-t"
                            : "text-primary-text hover:bg-hover-bg"
                        )}
                      >
                        <Icon size={15} aria-hidden="true" />
                        {label}
                      </button>
                    )
                  )}
                </div>
              </>
            )}
          </div>

          {dropdownOpen && (
            <div className="lg:hidden">
              <div
                className="fixed inset-0 z-40 bg-black/40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="bg-card fixed inset-x-0 bottom-0 z-50 rounded-t-[16px] pb-8 shadow-xl">
                <div className="flex justify-center pt-3 pb-4">
                  <div className="bg-neutral-bg h-1 w-10 rounded-full" />
                </div>
                <div className="flex items-center gap-3 px-5 pb-4">
                  <div className="bg-brand-hover-bg text-inverse-text flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    {user.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-primary-text text-sm font-semibold">
                      {user.fullName}
                    </p>
                    <p className="text-tertiary-text text-xs">
                      @{user.username}
                    </p>
                  </div>
                  <StatusBadge status={user.status} />
                </div>
                <Divider />
                <ul className="mt-1">
                  {availableActions.map(
                    ({ action, label, icon: Icon, destructive }) => (
                      <li key={action}>
                        {destructive && <Divider />}
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            onRequestAction(action);
                          }}
                          className={cn(
                            "flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-medium transition-colors",
                            destructive
                              ? "text-danger-text hover:bg-negative-subtle-bg"
                              : "text-primary-text hover:bg-hover-bg"
                          )}
                        >
                          <Icon size={18} aria-hidden="true" />
                          {label}
                        </button>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <Divider />

      <div className="flex-1 px-5 py-4">
        <p className="text-secondary-text mb-1 text-sm">Feature Access</p>
        <ul className="mt-1">
          {featuresMeta.map(({ key, label, description }, i) => (
            <li key={key}>
              {i > 0 && <Divider />}
              <div className="flex items-start justify-between gap-6 py-3">
                <div className="min-w-0">
                  <p className="text-primary-text text-sm font-semibold">
                    {label}
                  </p>
                  <p className="text-tertiary-text mt-0.5 text-xs">
                    {description}
                  </p>
                </div>
                <Toggle
                  checked={flags[key]}
                  onChange={(val) =>
                    setFlags((prev) => ({ ...prev, [key]: val }))
                  }
                  disabled={saveMutation.isPending}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Divider />

      <div className="flex flex-col gap-3 px-5 py-3">
        <p className="text-tertiary-text text-xs">
          Changes apply only to this user.
        </p>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setFlags({ ...user.featureFlags })}
            disabled={!isDirty || saveMutation.isPending}
            className="border-tertiary-b text-secondary-text hover:bg-hover-bg rounded-[8px] border px-4 py-1.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40"
          >
            Reset
          </button>
          <button
            onClick={() => saveMutation.mutate()}
            disabled={!isDirty || saveMutation.isPending}
            className={cn(
              "rounded-[8px] border px-4 py-1.5 text-sm font-medium transition-colors",
              isDirty && !saveMutation.isPending
                ? "bg-brand-bg border-brand-bg text-inverse-text hover:bg-brand-hover-bg"
                : "border-tertiary-b bg-disabled-bg text-disabled-text cursor-not-allowed"
            )}
          >
            {saveMutation.isPending ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
