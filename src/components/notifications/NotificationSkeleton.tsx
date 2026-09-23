"use client";

export function NotificationSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-card border-tertiary-b animate-pulse rounded-2xl border p-5 shadow-xs transition-all"
        >
          <div className="bg-muted/60 h-4 w-3/4 rounded" />
          <div className="bg-muted/40 mt-2.5 h-3.5 w-1/2 rounded" />
        </div>
      ))}
    </div>
  );
}
