"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Flag } from "lucide-react";
import { GoArrowUpRight } from "react-icons/go";
import { TbUserPlus, TbUserCheck } from "react-icons/tb";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  metricsSummaryOptions,
  searchActivityOptions,
  recentActivityOptions,
  platformHealthOptions,
} from "@/api/admin/admin.metrics.options";
import type {
  MetricsRange,
  MetricDelta,
  TimeseriesPoint,
} from "@/api/admin/admin.metrics.service";
import { Skeleton } from "@/components/ui/skeleton";

function formatValue(value: number, key: string): string {
  if (key === "profileCompletionRate") return `${value.toFixed(1)}%`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return value.toLocaleString();
  return String(value);
}

function formatDelta(change: number): string {
  return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
}

function formatDay(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });
}

type MetricCardProps = {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  loading?: boolean;
};

function MetricCard({
  label,
  value,
  delta,
  positive,
  loading,
}: MetricCardProps) {
  if (loading) {
    return (
      <div className="bg-card border-tertiary-b space-y-3 rounded-xl border p-5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-28" />
      </div>
    );
  }

  return (
    <div className="bg-card border-tertiary-b rounded-xl border p-5">
      <p className="text-secondary-text text-sm">{label}</p>
      <p className="text-primary-text mt-2 text-3xl font-semibold">{value}</p>
      <div className="mt-2 flex items-center gap-1.5">
        <span
          className={cn(
            "flex items-center justify-center rounded-full p-1",
            positive ? "bg-delta-positive-bg" : "bg-delta-negative-bg"
          )}
        >
          <GoArrowUpRight
            size={12}
            className={cn(
              positive ? "text-brand-dark-bg" : "text-delta-negative-text",
              !positive && "rotate-90"
            )}
            aria-hidden="true"
          />
        </span>
        <span
          className={cn(
            "text-xs font-medium",
            positive ? "text-brand-dark-bg" : "text-delta-negative-text"
          )}
        >
          {delta}
        </span>
        <span className="text-tertiary-text text-xs">vs last week</span>
      </div>
    </div>
  );
}

function MiniLineChart({ data }: { data: TimeseriesPoint[] }) {
  const chartData = data.map((p) => ({
    day: formatDay(p.date),
    value: p.value,
  }));
  return (
    <ResponsiveContainer width="100%" height={48}>
      <LineChart
        data={chartData}
        margin={{ top: 4, right: 4, left: 4, bottom: 4 }}
      >
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--brand-bg)"
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<MetricsRange>("this_week");

  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const { data: summary, isLoading: summaryLoading } = useQuery(
    metricsSummaryOptions(activeTab)
  );
  const { data: searchData, isLoading: searchLoading } = useQuery(
    searchActivityOptions(activeTab)
  );
  const { data: recentData, isLoading: recentLoading } = useQuery(
    recentActivityOptions()
  );
  const { data: healthData, isLoading: healthLoading } = useQuery(
    platformHealthOptions(activeTab)
  );

  const metricCards: Array<{
    label: string;
    key: keyof NonNullable<typeof summary>;
    delta: MetricDelta | undefined;
  }> = [
    { label: "Total Users", key: "totalUsers", delta: summary?.totalUsers },
    {
      label: "Published Profiles",
      key: "publishedProfiles",
      delta: summary?.publishedProfiles,
    },
    {
      label: "Profile Completion Rate",
      key: "profileCompletionRate",
      delta: summary?.profileCompletionRate,
    },
    {
      label: "Weekly Active Profiles",
      key: "weeklyActiveProfiles",
      delta: summary?.weeklyActiveProfiles,
    },
    {
      label: "Total Searches",
      key: "invitesSent",
      delta: summary?.invitesSent,
    },
    {
      label: "Invite Conversion Rate",
      key: "invitesClaimed",
      delta: summary?.invitesClaimed,
    },
  ];

  const searchChartData = (searchData?.timeseries ?? []).map((p) => ({
    day: formatDay(p.date),
    searches: p.value,
  }));

  const totalSearches = searchData?.totalSearches;
  const searchDeltaPositive = (totalSearches?.change ?? 0) >= 0;

  const recentRows = [
    {
      icon: TbUserPlus,
      label: "New users today",
      value: recentData?.newUsersToday,
      danger: false,
    },
    {
      icon: TbUserCheck,
      label: "Profiles published today",
      value: recentData?.profilesPublishedToday,
      danger: false,
    },
    {
      icon: Flag,
      label: "Flagged for review",
      value: recentData?.invitesSentToday,
      danger: false,
    },
    {
      icon: TbUserPlus,
      label: "Active suspensions",
      value: recentData?.invitesClaimedToday,
      danger: true,
    },
  ];

  const completionRate = healthData?.profileCompletionRate;
  const publishingTimeseries = healthData?.publishingActivity ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary-text text-xl font-semibold">
          Platform Overview
        </h1>
        <p className="text-secondary-text mt-0.5 text-sm">
          Platform-wide metrics and operational health · {today}
        </p>
      </div>

      <div className="bg-secondary-bg border-tertiary-b flex w-full gap-1 rounded-lg border p-1">
        {(["this_week", "last_thirty_days"] as MetricsRange[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              activeTab === tab
                ? "bg-white-bg text-link-hover-text"
                : "text-secondary-text hover:text-primary-text"
            )}
          >
            {tab === "this_week" ? "This Week" : "Last 30 Days"}
          </button>
        ))}
      </div>

      <div>
        <p className="text-secondary-text mb-3 text-sm font-medium">
          Key metrics
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metricCards.map(({ label, key, delta }) => (
            <MetricCard
              key={label}
              label={label}
              value={delta ? formatValue(delta.current, key as string) : "—"}
              delta={delta ? formatDelta(delta.change) : "—"}
              positive={(delta?.change ?? 0) >= 0}
              loading={summaryLoading}
            />
          ))}
        </div>
      </div>

      <div className="bg-card border-tertiary-b rounded-xl border p-5">
        <div className="mb-4 flex items-start justify-between">
          <p className="text-secondary-text text-sm font-medium">
            Search Activity
          </p>
          <div className="text-right">
            {searchLoading ? (
              <Skeleton className="ml-auto h-6 w-20" />
            ) : (
              <>
                <p className="text-primary-text text-lg font-semibold">
                  {totalSearches
                    ? formatValue(totalSearches.current, "totalSearches")
                    : "—"}
                </p>
                <div className="flex items-center justify-end gap-1.5">
                  <span className="bg-delta-positive-bg flex items-center justify-center rounded-full p-1">
                    <GoArrowUpRight
                      size={12}
                      className={cn(
                        searchDeltaPositive
                          ? "text-brand-dark-bg"
                          : "text-delta-negative-text",
                        !searchDeltaPositive && "rotate-90"
                      )}
                      aria-hidden="true"
                    />
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      searchDeltaPositive
                        ? "text-brand-dark-bg"
                        : "text-delta-negative-text"
                    )}
                  >
                    {totalSearches ? formatDelta(totalSearches.change) : "—"}
                  </span>
                  <span className="text-tertiary-text text-xs">
                    vs last week
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="h-48">
          {searchLoading ? (
            <Skeleton className="h-full w-full rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={searchChartData}
                margin={{ top: 4, right: 4, left: 4, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="searchGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--brand-bg)"
                      stopOpacity={0.15}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--brand-bg)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "var(--tertiary-text)" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--tertiary-b)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "var(--primary-text)",
                  }}
                  formatter={(v: unknown) => {
                    const n = typeof v === "number" ? v : 0;
                    return [
                      n >= 1_000_000
                        ? `${(n / 1_000_000).toFixed(2)}M`
                        : `${(n / 1000).toFixed(0)}k`,
                      "Searches",
                    ];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="searches"
                  stroke="var(--brand-bg)"
                  strokeWidth={2}
                  fill="url(#searchGradient)"
                  dot={false}
                  activeDot={{ r: 4, fill: "var(--brand-bg)" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="bg-card border-tertiary-b rounded-xl border p-5">
          <p className="text-secondary-text mb-4 text-sm font-medium">
            Recent Activity
          </p>
          {recentLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <ul className="divide-tertiary-b divide-y">
              {recentRows.map(({ icon: Icon, label, value, danger }) => (
                <li
                  key={label}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "flex items-center justify-center rounded-full p-1.5",
                        danger
                          ? "bg-activity-danger-bg"
                          : "bg-delta-positive-bg"
                      )}
                    >
                      <Icon
                        size={14}
                        className={
                          danger
                            ? "text-delta-negative-text"
                            : "text-tertiary-text"
                        }
                        aria-hidden="true"
                      />
                    </span>
                    <span
                      className={cn(
                        "text-sm",
                        danger
                          ? "text-delta-negative-text"
                          : "text-primary-text"
                      )}
                    >
                      {label}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      danger ? "text-delta-negative-text" : "text-primary-text"
                    )}
                  >
                    {value ?? "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-card border-tertiary-b rounded-xl border p-5">
          <p className="text-secondary-text mb-4 text-sm font-medium">
            Platform Health
          </p>
          {healthLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-secondary-text text-sm">Completion Rate</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="text-primary-text text-sm font-semibold">
                      {completionRate
                        ? formatValue(
                            completionRate.current,
                            "profileCompletionRate"
                          )
                        : "—"}
                    </span>
                    <span className="bg-delta-positive-bg flex items-center justify-center rounded-full p-1">
                      <GoArrowUpRight
                        size={12}
                        className="text-brand-dark-bg"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-brand-dark-bg text-xs font-medium">
                      {completionRate
                        ? formatDelta(completionRate.change)
                        : "—"}
                    </span>
                  </div>
                </div>
                <div className="w-28 shrink-0">
                  {completionRate && (
                    <MiniLineChart
                      data={[
                        { date: "prev", value: completionRate.previous },
                        { date: "curr", value: completionRate.current },
                      ]}
                    />
                  )}
                </div>
              </div>

              <div className="border-tertiary-b border-t" />

              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-secondary-text text-sm">
                    Publishing Activity
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="text-primary-text text-sm font-semibold">
                      {publishingTimeseries.length > 0
                        ? `${publishingTimeseries[publishingTimeseries.length - 1].value} today`
                        : "—"}
                    </span>
                    <span className="bg-delta-positive-bg flex items-center justify-center rounded-full p-1">
                      <GoArrowUpRight
                        size={12}
                        className="text-brand-dark-bg"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-brand-dark-bg text-xs font-medium">
                      {completionRate
                        ? formatDelta(completionRate.change)
                        : "—"}
                    </span>
                  </div>
                </div>
                <div className="w-28 shrink-0">
                  {publishingTimeseries.length > 0 && (
                    <MiniLineChart data={publishingTimeseries} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
