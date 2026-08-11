"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function InsightsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Top Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="border-tertiary-b/70 bg-card rounded-2xl border p-5 sm:p-6 lg:col-span-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-4 h-9 w-28" />
          <Skeleton className="mt-1 h-3 w-32" />
          <Skeleton className="mt-6 h-4 w-40" />
        </div>
        <div className="border-tertiary-b/70 bg-card rounded-2xl border p-5 sm:p-6 lg:col-span-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="mt-4 h-36 w-full rounded-xl sm:h-44" />
        </div>
      </div>

      {/* Second Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="border-tertiary-b/70 bg-card rounded-2xl border p-5 sm:p-6 lg:col-span-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-4 h-8 w-20" />
          <Skeleton className="mt-1 h-4 w-28" />
          <Skeleton className="mt-1 h-3 w-48" />
          <Skeleton className="mt-6 h-8 w-20" />
          <Skeleton className="mt-1 h-4 w-32" />
          <Skeleton className="mt-1 h-3 w-52" />
        </div>
        <div className="border-tertiary-b/70 bg-card rounded-2xl border p-5 sm:p-6 lg:col-span-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="mt-5 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-2 flex-1 rounded-full" />
                <Skeleton className="h-4 w-10" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Insight Skeleton */}
      <div className="border-tertiary-b/70 bg-card flex items-start gap-4 rounded-2xl border p-4 sm:p-5">
        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
    </div>
  );
}
