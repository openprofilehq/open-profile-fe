"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SearchInput from "@/components/search/SearchInput";
import SearchResultCard from "@/components/search/SearchResultCard";
import EmptyState from "@/components/search/EmptyState";
import LoadingState from "@/components/search/LoadingState";
import NoResultsState from "@/components/search/NoResultsState";
import ErrorState from "@/components/search/ErrorState";
import { Navbar } from "@/components/layout/Navbar";
import { CTA } from "@/components/home/CTA";
import { useProfileSearch } from "@/hooks/useProfileSearch";

function SearchPageInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [retryCount, setRetryCount] = useState(0);

  const { profiles, total, status } = useProfileSearch(query, retryCount);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      {/* ── Hero ── */}
      <section className="mt-19 bg-[#dceef0] pt-14 pb-16 text-center">
        <h1 className="mb-6 text-[2rem] font-bold text-gray-900 md:text-[2.5rem]">
          Find Someone on Open Profile
        </h1>
        <SearchInput initialValue={query} />
      </section>

      {/* ── Body ── */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {status === "idle" && <EmptyState />}
        {status === "loading" && <LoadingState query={query} />}
        {status === "error" && (
          <ErrorState onRetry={() => setRetryCount((c) => c + 1)} />
        )}
        {status === "not-found" && <NoResultsState query={query} />}

        {status === "results" && (
          <div>
            <h2 className="mb-1 text-lg font-semibold text-gray-900">
              Search Results
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              {profiles.length === 1
                ? `Found 1 result for "${query}"`
                : `Showing ${profiles.length} of ${total}`}
            </p>
            <div
              className={
                profiles.length === 1
                  ? "flex flex-col gap-3"
                  : "grid grid-cols-1 gap-4 md:grid-cols-2"
              }
            >
              {profiles.map((profile) => (
                <SearchResultCard key={profile.id} profile={profile} />
              ))}
            </div>
          </div>
        )}
      </main>

      <CTA />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}
