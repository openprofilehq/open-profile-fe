"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, AlertCircle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";

type SearchResult = {
  id?: string;
  name?: string;
  fullName?: string;
  username?: string;
  title?: string;
  role?: string;
  bio?: string;
  avatar?: string;
  profileImage?: string;
  profilePicture?: string;
  slug?: string;
};

export default function SearchPage() {
  const router = useRouter();
  const params = useSearchParams();

  const initialQuery = params.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  async function runSearch(value: string) {
    const searchValue = value.trim();

    setError("");

    if (searchValue.length < 3) {
      setResults([]);
      setSearched(false);
      setError("Please enter at least 3 characters to search");
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(searchValue)}`
      );

      const data = await res.json();

      if (!res.ok) {
        const errorMessage =
          typeof data?.message === "string" ? data.message : "Search failed";

        throw new Error(errorMessage);
      }

      const list = Array.isArray(data)
        ? data
        : data?.data?.results || data?.results || data?.users || [];

      setResults(list);
      router.replace(`/search?q=${encodeURIComponent(searchValue)}`);
    } catch (err) {
      setResults([]);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    runSearch(query);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#050505]">
      <Navbar />

      <section className="bg-[#E5F7FA] px-4 pt-[120px] pb-12 md:pt-[150px] md:pb-20">
        <div className="mx-auto max-w-[680px] text-center">
          <h1 className="text-[30px] leading-tight font-semibold md:text-[48px]">
            Find Someone on Open Profile
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mt-6 flex w-full flex-col gap-3 md:flex-row"
          >
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.length >= 3) setError("");
              }}
              placeholder="e.g john-doe"
              className="h-[56px] w-full rounded-[8px] bg-white px-4 text-[16px] outline-none md:flex-1"
            />

            <button
              type="submit"
              disabled={loading}
              className="h-[56px] w-full rounded-[8px] bg-[#087583] px-8 font-medium text-white disabled:opacity-60 md:w-auto"
            >
              {loading ? "Searching..." : "Search a Profile"}
            </button>
          </form>

          {error && (
            <p className="mt-3 flex items-center gap-2 text-left text-[14px] text-[#FF3158]">
              <AlertCircle size={16} />
              {error}
            </p>
          )}
        </div>
      </section>

      {!searched && (
        <section className="flex min-h-[440px] items-center justify-center px-4">
          <div className="max-w-[460px] text-center">
            <div className="mx-auto mb-6 flex h-[42px] w-[42px] items-center justify-center rounded-[8px] bg-[#D8F3F6]">
              <Search className="text-[#087583]" size={24} />
            </div>

            <h2 className="text-[22px] font-semibold">
              Discover your Network on Open Profile
            </h2>

            <p className="mt-3 text-[16px] leading-[26px] text-[#666]">
              Search by name or username to find freelancers, creators, and
              builders. Every profile is verified and searchable.
            </p>
          </div>
        </section>
      )}

      {searched && (
        <section className="mx-auto max-w-[1040px] px-4 py-12">
          <h2 className="mb-1 text-[18px] font-semibold">Search Results</h2>
          <p className="mb-8 text-sm text-[#777]">
            Showing {results.length} results
          </p>

          {results.length === 0 && !loading ? (
            <p className="text-[#666]">No profiles found.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {results.map((user, index) => {
                const name =
                  user.name ||
                  user.fullName ||
                  user.username ||
                  "Open Profile User";

                const role =
                  user.role || user.title || user.bio || "Open Profile member";

                const image =
                  user.avatar ||
                  user.profileImage ||
                  user.profilePicture ||
                  "/hero/avatar.png";

                const slug = user.slug || user.username || user.id || "";

                return (
                  <div
                    key={user.id || user.username || index}
                    className="flex items-center justify-between gap-4 rounded-[8px] border border-[#EEEEEE] p-5"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <Image
                        src={image}
                        alt={name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">{name}</h3>
                        <p className="line-clamp-2 text-sm text-[#666]">
                          {role}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={slug ? `/profile/${slug}` : "#"}
                      className="shrink-0 rounded-[6px] bg-[#087583] px-6 py-3 text-sm text-white"
                    >
                      View Profile
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      <section className="px-4 pt-16 pb-24">
        <div className="relative mx-auto flex min-h-[300px] max-w-[1040px] items-center overflow-hidden rounded-[12px] bg-[#087583] px-6 md:min-h-[260px] md:px-16">
          <div className="relative z-10 max-w-[420px]">
            <h2 className="text-[30px] leading-tight font-semibold text-white md:text-[36px]">
              Not on Open Profile yet?
            </h2>

            <p className="mt-4 text-[16px] leading-[26px] text-white">
              Create your searchable profile in under 2 minutes. Be discovered,
              verified, and trusted.
            </p>

            <Link
              href="/signup"
              className="mt-6 inline-flex rounded-[8px] bg-white px-6 py-4 font-semibold text-[#087583]"
            >
              Create Your Profile Now
            </Link>
          </div>

          <Image
            src="/cta/ctamobile.svg"
            alt=""
            width={80}
            height={50}
            className="absolute right-[0px] bottom-[0px] md:hidden"
            style={{ height: "auto" }}
          />

          <Image
            src="/cta/cta.svg"
            alt=""
            width={320}
            height={100}
            className="absolute right-[0px] bottom-[-1px] hidden md:block"
            style={{ height: "auto" }}
          />
        </div>
      </section>
    </main>
  );
}
