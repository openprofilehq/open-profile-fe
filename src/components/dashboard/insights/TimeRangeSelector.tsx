"use client";

export type TimeRange = "7d" | "30d" | "90d";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  disabled?: boolean;
}

const ranges: { label: string; value: TimeRange }[] = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
];

export default function TimeRangeSelector({
  value,
  onChange,
  disabled = false,
}: TimeRangeSelectorProps) {
  return (
    <div
      role="group"
      aria-label="Time range selector"
      className="border-tertiary-b/60 bg-secondary-bg inline-flex w-full items-center justify-between rounded-xl border p-1 sm:w-auto sm:justify-start"
    >
      {ranges.map((range) => {
        const isActive = value === range.value;
        return (
          <button
            key={range.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(range.value)}
            className={`flex-1 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all sm:flex-initial sm:text-sm ${
              isActive
                ? "bg-card text-brand-hover-bg dark:text-brand-text shadow-xs"
                : "text-secondary-text hover:text-primary-text hover:bg-hover-bg/50"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
}
