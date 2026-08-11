"use client";

interface PerformanceCardProps {
  searchConversionRate?: number | null;
  inviteConversionRate?: number | null;
}

export default function PerformanceCard({
  searchConversionRate = null,
  inviteConversionRate = null,
}: PerformanceCardProps) {
  // Format percentage rates accurately based on actual numbers
  const formatRate = (rate?: number | null) => {
    if (rate == null || Number.isNaN(rate)) {
      return "0.0%";
    }
    const percent = rate <= 1 ? rate * 100 : rate;
    return `${percent.toFixed(1)}%`;
  };

  return (
    <div className="border-tertiary-b/70 bg-card flex h-full flex-col justify-between rounded-2xl border p-5 sm:p-6">
      <p className="text-secondary-text text-sm font-medium">Performance</p>

      <div className="space-y-6 pt-2">
        {/* Metric 1: Search -> Profile */}
        <div>
          <h3 className="text-primary-text text-2xl font-bold tracking-tight sm:text-3xl">
            {formatRate(searchConversionRate)}
          </h3>
          <p className="text-primary-text mt-1 text-xs font-semibold sm:text-sm">
            Search → Profile
          </p>
          <p className="text-tertiary-text mt-0.5 text-xs">
            Of search impressions that led to a profile view
          </p>
        </div>

        {/* Metric 2: Invite Conversion */}
        <div className="border-tertiary-b/30 border-t pt-4">
          <h3 className="text-primary-text text-2xl font-bold tracking-tight sm:text-3xl">
            {formatRate(inviteConversionRate)}
          </h3>
          <p className="text-primary-text mt-1 text-xs font-semibold sm:text-sm">
            Invite Conversion
          </p>
          <p className="text-tertiary-text mt-0.5 text-xs">
            Of invite link clicks that became a profile visit
          </p>
        </div>
      </div>
    </div>
  );
}
