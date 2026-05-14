interface NoResultsStateProps {
  query: string;
}

export default function NoResultsState({ query }: NoResultsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center mb-5">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9ca3af"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No results found
      </h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
        We couldn&apos;t find any published profiles matching{" "}
        <span className="font-medium text-gray-700">&quot;{query}&quot;</span>.
        Try a different name or username.
      </p>
    </div>
  );
}