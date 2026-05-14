export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {/* Smaller icon box */}
      <div
        className="w-10 h-10 rounded-md flex items-center justify-center mb-4"
        style={{ backgroundColor: "#DBEFF2" }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#087583"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Discover your Network on Open Profile
      </h3>
      <p className="text-sm text-gray-500 max-w-[340px] leading-relaxed">
        Search by name or username to find freelancers, creators, and builders.
        Every profile is verified and searchable.
      </p>
    </div>
  );
}