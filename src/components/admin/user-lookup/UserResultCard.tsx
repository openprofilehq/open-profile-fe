import { cn } from "@/lib/utils";
import type { LookupUser, UserStatus } from "@/api/admin/admin.service";

const statusConfig: Record<UserStatus, { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "bg-status-active-bg text-status-active-text",
  },
  suspended: {
    label: "Suspended",
    className: "bg-status-negative-bg text-status-negative-text",
  },
  blocked: {
    label: "Blocked",
    className: "bg-status-negative-bg text-status-negative-text",
  },
  inactive: {
    label: "Inactive",
    className: "bg-status-neutral-bg text-status-neutral-text",
  },
  flagged: {
    label: "Flagged",
    className: "bg-notice-subtle-bg text-notice-text",
  },
};

export function StatusBadge({ status }: { status: UserStatus }) {
  const { label, className } = statusConfig[status];
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-medium",
        className
      )}
    >
      • {label}
    </span>
  );
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

type MetricsRowProps = {
  completion: number;
  views: number;
  clicks: number;
  conversion: number;
};

export function MetricsRow({
  completion,
  views,
  clicks,
  conversion,
}: MetricsRowProps) {
  const metrics = [
    { label: "Completion", value: `${completion}%` },
    { label: "Views", value: formatCount(views) },
    { label: "Clicks", value: formatCount(clicks) },
    { label: "Conversion", value: `${conversion}%` },
  ];

  return (
    <div className="flex items-start">
      {metrics.map(({ label, value }, i) => (
        <div
          key={label}
          className={cn(
            "min-w-0 flex-1 py-0.5",
            i > 0 && "border-tertiary-b border-l pl-4"
          )}
        >
          <p className="text-primary-text truncate text-sm font-semibold">
            {value}
          </p>
          <p className="text-tertiary-text truncate text-xs">{label}</p>
        </div>
      ))}
    </div>
  );
}

type UserResultCardProps = {
  user: LookupUser;
  isSelected: boolean;
  onManage: () => void;
};

export default function UserResultCard({
  user,
  isSelected,
  onManage,
}: UserResultCardProps) {
  return (
    <div
      className={cn(
        "rounded-[8px] border px-5 py-4 transition-colors",
        isSelected
          ? "bg-card-selected-bg border-brand-b ring-brand-b ring-1"
          : "bg-card border-tertiary-b hover:border-secondary-b"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-brand-hover-bg text-inverse-text flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold">
            {user.initials}
          </div>
          <div>
            <p className="text-primary-text text-sm leading-snug font-semibold">
              {user.fullName}
            </p>
            <p className="text-tertiary-text text-xs">@{user.username}</p>
          </div>
        </div>
        <StatusBadge status={user.status} />
      </div>

      <div className="mt-3">
        <MetricsRow
          completion={user.completion}
          views={user.views}
          clicks={user.clicks}
          conversion={user.conversion}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-tertiary-text text-xs">
          Last active {user.lastActiveAt}
        </p>
        <button
          onClick={onManage}
          className={cn(
            "border-tertiary-b rounded-[8px] border px-3 py-1 text-xs font-medium transition-colors",
            isSelected
              ? "bg-white-bg text-secondary-text hover:bg-hover-bg"
              : "text-secondary-text hover:bg-hover-bg"
          )}
        >
          Manage
        </button>
      </div>
    </div>
  );
}
