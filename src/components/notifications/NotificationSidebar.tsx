"use client";

export type NotificationTab = "all" | "searches" | "unread" | "read";

interface NotificationSidebarProps {
  activeTab: NotificationTab;
  onTabChange: (tab: NotificationTab) => void;
  counts: {
    all: number;
    searches: number;
    unread: number;
    read: number;
  };
}

const tabs: { id: NotificationTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "searches", label: "Searches" },
  { id: "unread", label: "Unread" },
  { id: "read", label: "Read" },
];

export function NotificationSidebar({
  activeTab,
  onTabChange,
  counts,
}: NotificationSidebarProps) {
  return (
    <>
      {/* Mobile Top Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:hidden">
        {tabs.map((tab) => {
          const count = counts[tab.id];
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-card text-primary-text border-tertiary-b border shadow-xs"
                  : "text-secondary-text hover:bg-hover-bg"
              }`}
            >
              <span>{tab.label}</span>
              {count > 0 && (
                <span
                  className={`flex h-4 min-w-4 items-center justify-center rounded-md px-1.5 text-[10px] leading-none font-bold ${
                    isActive
                      ? "bg-[#0f766e] text-white"
                      : "bg-[#0f766e]/80 text-white"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Desktop Left Sidebar Card */}
      <div className="bg-card border-tertiary-b hidden w-60 shrink-0 space-y-1.5 rounded-2xl border p-4 shadow-xs md:flex md:flex-col">
        {tabs.map((tab) => {
          const count = counts[tab.id];
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-hover-bg text-primary-text font-semibold"
                  : "text-secondary-text hover:bg-hover-bg hover:text-primary-text"
              }`}
            >
              <span>{tab.label}</span>
              {count > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-[#0f766e] px-1.5 text-xs leading-none font-bold text-white">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
