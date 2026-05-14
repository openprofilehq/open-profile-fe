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
    <div className={`flex flex-col w-full max-w-xl mx-auto px-4 md:px-0 ${className}`}>
      <form onSubmit={handleSubmit} className="flex flex-col w-full">
        {/* Stacked on mobile with gap, side-by-side on md+ */}
        <div className="flex flex-col gap-2 md:flex-row md:gap-0 w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (error) setError("");
            }}
            placeholder="e.g john-doe"
            className="
              w-full px-4 py-3 text-sm bg-white
              border border-gray-300
              rounded-md md:rounded-l-md md:rounded-tr-none md:rounded-br-none
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
            "
          />
          <button
            type="submit"
            className="
              w-full md:w-auto
              bg-teal-700 hover:bg-teal-800 text-white
              px-5 py-3 text-sm font-medium
              rounded-md md:rounded-r-md md:rounded-tl-none md:rounded-bl-none
              transition-colors whitespace-nowrap
            "
          >
            Search a Profile
          </button>
        </div>
      </form>

      {/* Validation error */}
      {error && (
        <div className="flex items-center gap-1.5 mt-2 text-red-500 text-sm">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}