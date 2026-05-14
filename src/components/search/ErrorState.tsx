interface ErrorStateProps {
  onRetry?: () => void;
}

export default function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-lg bg-red-50 flex items-center justify-center mb-5">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-sm text-gray-500 max-w-xs mb-6">
        We couldn&apos;t complete your search. Please check your connection and
        try again.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}