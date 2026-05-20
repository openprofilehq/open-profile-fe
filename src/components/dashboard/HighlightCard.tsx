import Image from "next/image";
import { getImageUrl } from "@/utils/profile";

type Props = {
  profile?: {
    photoUrl?: string | null;
    fullName?: string;
    bio?: string | null;
  };
};

export default function HighlightCard({ profile }: Props) {
  const imageSrc = getImageUrl(profile?.photoUrl);

  return (
    <section className="rounded-[12px] border border-tertiary-b bg-white p-6">
      <h2 className="text-2xl font-bold">Highlight</h2>

      <div className="mt-6 flex flex-col gap-8 rounded-[28px] border border-tertiary-b p-6 md:flex-row md:items-center">
        <div className="flex flex-1 justify-center bg-neutral-bg p-10">
          {imageSrc ? (
            <div className="relative h-[180px] w-full max-w-[260px]">
              <Image
                src={imageSrc}
                alt={profile?.fullName ?? "Profile image"}
                fill
                className="rounded-[12px] object-cover"
              />
            </div>
          ) : (
            <div className="flex h-[180px] w-full max-w-[260px] items-center justify-center rounded-[12px] bg-white text-tertiary-text">
              No image yet
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-bold">
            {profile?.fullName ?? "No title yet"}
          </h3>
          <p className="mt-4 text-lg text-tertiary-text">
            {profile?.bio ?? "No bio added yet."}
          </p>
        </div>
      </div>
    </section>
  );
}
