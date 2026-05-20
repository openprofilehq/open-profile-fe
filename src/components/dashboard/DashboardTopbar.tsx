import Image from "next/image";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

type DashboardTopbarProps = {
  onOpenSidebar: () => void;
};

export default function DashboardTopbar({
  onOpenSidebar,
}: DashboardTopbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#EDEDED] bg-white">
      <div className="flex h-19 items-center justify-between gap-8 px-4 md:px-10 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Open dashboard menu"
            className="rounded-[8px] border border-[#EDEDED] p-2 text-[#050505] lg:hidden"
          >
            <Menu size={22} />
          </button>

          <Image
            src="/logo.svg"
            alt="Open Profile"
            width={180}
            height={40}
            className="h-auto w-36 shrink-0 sm:w-40"
          />
        </div>

        <div className="flex shrink-0 items-center gap-3 md:gap-4">
          <button className="text-[#050505]" aria-label="Search">
            <Search size={24} />
          </button>

          <Button variant="outline" className="hidden border-[#EDEDED] md:flex">
            Upgrade
          </Button>

          <Button className="bg-[#087583] hover:bg-[#065e69]">Publish</Button>
        </div>
      </div>
    </header>
  );
}
