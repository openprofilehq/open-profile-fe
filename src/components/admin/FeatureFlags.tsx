"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { platformFlagsQueryOptions } from "@/api/admin/admin.flags.options";
import {
  updatePlatformFlag,
  type PlatformFlag,
} from "@/api/admin/admin.service";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors",
        "focus-visible:ring-brand-b focus-visible:ring-2 focus-visible:outline-none",
        checked ? "bg-brand-bg" : "bg-neutral-bg",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 translate-x-1 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-6"
        )}
      />
    </button>
  );
}

function FlagRowSkeleton() {
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-80" />
      </div>
      <Skeleton className="h-6 w-11 rounded-full" />
    </div>
  );
}

function FlagRow({
  flag,
  onToggle,
  pending,
}: {
  flag: PlatformFlag;
  onToggle: (key: string, val: boolean) => void;
  pending: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <div className="min-w-0 flex-1">
        <p className="text-primary-text text-sm font-semibold">{flag.label}</p>
        <p className="text-tertiary-text mt-0.5 text-xs">{flag.description}</p>
      </div>
      <Toggle
        checked={flag.enabled}
        onChange={(val) => onToggle(flag.key, val)}
        disabled={pending}
      />
    </div>
  );
}

export default function FeatureFlags() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(platformFlagsQueryOptions);

  const mutation = useMutation({
    mutationFn: ({ key, enabled }: { key: string; enabled: boolean }) =>
      updatePlatformFlag(key, enabled),
    onMutate: async ({ key, enabled }) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "feature-flags"] });
      const previous = queryClient.getQueryData(["admin", "feature-flags"]);
      queryClient.setQueryData(
        ["admin", "feature-flags"],
        (old: typeof data) => {
          if (!old) return old;
          const activeCount = old.flags
            .map((f) => (f.key === key ? { ...f, enabled } : f))
            .filter((f) => f.enabled).length;
          return {
            ...old,
            flags: old.flags.map((f) =>
              f.key === key ? { ...f, enabled } : f
            ),
            environment: { ...old.environment, activeCount },
          };
        }
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["admin", "feature-flags"], context.previous);
      }
      toast.error("Failed to update flag. Please try again.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "feature-flags"] });
    },
  });

  const flags = data?.flags ?? [];
  const env = data?.environment;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-primary-text text-xl font-semibold">
          Feature Flags
        </h1>
        <p className="text-secondary-text mt-0.5 text-sm">
          Manage platform-wide feature defaults. Changes take effect immediately
          for all users.
        </p>
      </div>

      <div className="bg-card border-tertiary-b rounded-[8px] border">
        <div className="px-6 pt-5 pb-2">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-tertiary-text text-xs">Platform Flags</p>
            {isLoading ? (
              <Skeleton className="h-3 w-16" />
            ) : (
              <p className="text-tertiary-text text-xs">
                {env?.activeCount}/{env?.totalCount} active
              </p>
            )}
          </div>

          <ul>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <li
                    key={i}
                    className={cn(i > 0 && "border-tertiary-b border-t")}
                  >
                    <FlagRowSkeleton />
                  </li>
                ))
              : flags.map((flag, i) => (
                  <li
                    key={flag.key}
                    className={cn(i > 0 && "border-tertiary-b border-t")}
                  >
                    <FlagRow
                      flag={flag}
                      onToggle={(key, val) =>
                        mutation.mutate({ key, enabled: val })
                      }
                      pending={mutation.isPending}
                    />
                  </li>
                ))}
          </ul>
        </div>

        <div className="border-tertiary-b border-t px-6 py-5">
          <p className="text-tertiary-text mb-4 text-xs">Environment</p>
          {isLoading ? (
            <div className="flex gap-16">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-x-16 gap-y-4">
              <div>
                <p className="text-tertiary-text text-xs">Last updated</p>
                <p className="text-primary-text mt-0.5 text-sm font-semibold">
                  {env?.lastUpdatedAt ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-tertiary-text text-xs">Updated by</p>
                <p className="text-primary-text mt-0.5 text-sm font-semibold">
                  {env?.updatedBy ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-tertiary-text text-xs">Active flags</p>
                <p className="text-primary-text mt-0.5 text-sm font-semibold">
                  {env ? `${env.activeCount} of ${env.totalCount}` : "—"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
