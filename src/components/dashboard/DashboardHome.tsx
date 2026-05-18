import FeaturedLinks from "./FeaturedLinks";
import HighlightCard from "./HighlightCard";
import ProfileOverviewCard from "./ProfileOverviewCard";
import ProfileSummaryCard from "./ProfileSummaryCard";

export default function DashboardHome() {
  return (
    <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="flex flex-col gap-4">
        <ProfileOverviewCard />
      </div>

      <div className="flex flex-col gap-6">
        <ProfileSummaryCard />
        <FeaturedLinks />
        <HighlightCard />
      </div>
    </div>
  );
}
