"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

interface SearchInputProps {
  initialValue?: string;
  className?: string;
}

export default function SearchInput({
  initialValue = "",
  className = "",
}: SearchInputProps) {
  const [query, setQuery] = useState(initialValue);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length < 3) {
      setError("Please enter at least 3 characters to search");
      return;
    }
    setError("");
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div
      className={`mx-auto flex w-full max-w-xl flex-col px-4 md:px-0 ${className}`}
    >
      <form onSubmit={handleSubmit} className="flex w-full flex-col">
        <div className="flex w-full flex-col gap-2 md:flex-row md:gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (error) setError("");
            }}
            placeholder="e.g john-doe"
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          <button
            type="submit"
            style={{ backgroundColor: "#087583" }}
            className="w-full rounded-md px-6 py-3 text-sm font-medium whitespace-nowrap text-white transition-opacity hover:opacity-90 md:w-auto"
          >
            Search a Profile
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-sm text-red-500">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
