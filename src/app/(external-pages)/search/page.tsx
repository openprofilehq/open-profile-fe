"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import SearchInput from "@/components/search/SearchInput";
import SearchResultCard, { Profile } from "@/components/search/SearchResultCard";
import EmptyState from "@/components/search/EmptyState";
import LoadingState from "@/components/search/LoadingState";
import NoResultsState from "@/components/search/NoResultsState";
import ErrorState from "@/components/search/ErrorState";
import Footer from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CTA } from "@/components/home/CTA";

type SearchStatus = "idle" | "loading" | "results" | "not-found" | "error";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.staging.open-profile.hng14.com";

function SearchPageInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!query.trim()) {
      setStatus("idle");
      setProfiles([]);
      return;
    }

    let cancelled = false;

    async function fetchProfiles() {
      setStatus("loading");
      try {
        const res = await fetch(
          `${API_BASE}/api/v1/search?q=${encodeURIComponent(query.trim())}`
        );
        if (cancelled) return;

        if (!res.ok) {
          setStatus("error");
          return;
        }

        const data = (await res.json()) as Record<string, unknown>;
        if (cancelled) return;

        const results: Profile[] =
          (data?.data as Profile[]) ??
          (data?.results as Profile[]) ??
          (data?.profiles as Profile[]) ??
          (Array.isArray(data) ? (data as Profile[]) : []);

        const count =
          (data?.total as number) ??
          (data?.count as number) ??
          results.length;

        setTotal(count);

        if (results.length > 0) {
          setProfiles(results);
          setStatus("results");
        } else {
          setProfiles([]);
          setStatus("not-found");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    void fetchProfiles();

    return () => {
      cancelled = true;
    };
  }, [query, retryCount]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* ── Hero ── */}
      <section className="mt-19 bg-[#dceef0] pt-14 pb-16 text-center">
        <h1 className="text-[2rem] md:text-[2.5rem] font-bold text-gray-900 mb-6">
          Find Someone on Open Profile
        </h1>
        <SearchInput initialValue={query} />
      </section>

      {/* ── Body ── */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        {status === "idle" && <EmptyState />}
        {status === "loading" && <LoadingState query={query} />}
        {status === "error" && (
          <ErrorState onRetry={() => setRetryCount((c) => c + 1)} />
        )}
        {status === "not-found" && <NoResultsState query={query} />}

        {status === "results" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Search Results
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {profiles.length === 1
                ? `Found 1 result for "${query}"`
                : `Showing ${profiles.length} of ${total}`}
            </p>
            <div
              className={
                profiles.length === 1
                  ? "flex flex-col gap-3"
                  : "grid grid-cols-1 md:grid-cols-2 gap-4"
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
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-teal-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}