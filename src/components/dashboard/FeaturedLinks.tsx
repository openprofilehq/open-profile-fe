import { ExternalLink, ImageIcon } from "lucide-react";

const links = [1, 2, 3];

export default function FeaturedLinks() {
  return (
    <section className="rounded-[12px] border border-[#EDEDED] bg-white p-6">
      <h2 className="text-2xl font-bold">Featured Link</h2>

      <div className="mt-6 flex flex-col gap-4">
        {links.map((item) => (
          <div
            key={item}
            className="flex items-center justify-between rounded-[18px] border border-[#EDEDED] p-4"
          >
            <div className="flex items-center gap-5">
              <span className="flex h-14 w-14 items-center justify-center rounded-[12px] border border-[#EDEDED]">
                <ImageIcon className="text-[#A2A2A2]" size={24} />
              </span>

              <div>
                <h3 className="font-bold">Link</h3>
                <p className="text-[#A2A2A2]">yourlink.com/@title</p>
              </div>
            </div>

            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EDEDED]">
              <ExternalLink className="text-[#A2A2A2]" size={20} />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
