import { useEffect, useState } from "react";
import { Profile } from "@/components/search/SearchResultCard";

export type SearchStatus =
  | "idle"
  | "loading"
  | "results"
  | "not-found"
  | "error";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export function useProfileSearch(query: string, retryCount: number) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<SearchStatus>(
    query.trim() ? "loading" : "idle"
  );

  useEffect(() => {
    if (!query.trim()) return;

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

        const inner = data?.data as Record<string, unknown> | undefined;
        const results: Profile[] = Array.isArray(inner?.results)
          ? (inner.results as Profile[])
          : [];
        const count = (inner?.total as number) ?? results.length;

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

  return { profiles, total, status };
}
