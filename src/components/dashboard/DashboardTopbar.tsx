import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardTopbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#EDEDED] bg-white">
      <div className="flex h-19 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Open Profile"
            width={180}
            height={40}
            className="h-auto w-40"
          />
        </div>

        <div className="flex items-center gap-4">
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
