interface LoadingStateProps {
  query?: string;
}

export default function LoadingState({ query }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      {/* Teal ring spinner — matches Figma */}
      <div className="w-12 h-12 rounded-full border-4 border-teal-600 border-t-transparent animate-spin mb-5" />

      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {query ? `Searching for ${query}` : "Searching..."}
      </h3>
      <p className="text-sm text-gray-500">Looking through thousands of profiles...</p>
    </div>
  );
}