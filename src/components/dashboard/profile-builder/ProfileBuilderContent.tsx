import { ImageIcon, Link2, Palette, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const builderItems = [
  {
    title: "Profile Details",
    description: "Update your name, bio, avatar, and public profile content.",
    icon: ImageIcon,
  },
  {
    title: "Links",
    description: "Add, remove, or reorder links shown on your profile.",
    icon: Link2,
  },
  {
    title: "Appearance",
    description: "Customize your profile theme, colors, and layout style.",
    icon: Palette,
  },
];

export default function ProfileBuilderContent() {
  return (
    <div className="mx-auto w-full max-w-[920px]">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#050505]">Profile Builder</h1>
          <p className="mt-2 text-[#747474]">
            Manage the content and appearance of your public profile.
          </p>
        </div>

        <Button className="h-11 rounded-[10px] bg-[#087583] text-white hover:bg-[#065e69]">
          <Plus size={18} />
          Add Section
        </Button>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {builderItems.map((item) => {
          const Icon = item.icon;

          return (
            <section
              key={item.title}
              className="flex items-center justify-between rounded-[12px] border border-[#EDEDED] bg-white p-5"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#E5F4F6] text-[#087583]">
                  <Icon size={22} />
                </span>

                <div>
                  <h2 className="text-lg font-bold text-[#050505]">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-[#747474]">{item.description}</p>
                </div>
              </div>

              <button className="rounded-[8px] border border-[#EDEDED] px-4 py-2 text-sm font-medium text-[#050505]">
                Manage
              </button>
            </section>
          );
        })}
      </div>
    </div>
  );
}
