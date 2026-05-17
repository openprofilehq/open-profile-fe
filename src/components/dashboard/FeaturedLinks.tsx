import { ExternalLink, ImageIcon } from "lucide-react";

const links = [1, 2, 3];

export default function FeaturedLinks() {
  return (
    <section className="rounded-[12px] border border-[#EDEDED] bg-white p-6">
      <h2 className="text-2xl font-bold">Featured Link</h2>

      <div className="mt-6 flex flex-col gap-4">
        {links.map((item) => (
          <a
            key={item}
            href="https://yourlink.com/@title"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-[18px] border border-[#EDEDED] p-4 no-underline"
          >
            <div className="flex items-center gap-5">
              <span className="flex h-14 w-14 items-center justify-center rounded-[12px] border border-[#EDEDED]">
                <ImageIcon className="text-[#A2A2A2]" size={24} />
              </span>

              <div>
                <h3 className="font-bold text-[#050505]">Link</h3>
                <p className="text-[#A2A2A2]">yourlink.com/@title</p>
              </div>
            </div>

            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EDEDED]">
              <ExternalLink className="text-[#A2A2A2]" size={20} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
