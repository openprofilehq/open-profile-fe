import Image from "next/image";
import { getImageUrl } from "@/utils/profile";

type Props = {
  profile?: {
    fullName?: string;
    bio?: string | null;
    photoUrl?: string | null;
  };
  isLoading?: boolean;
};

export default function ProfileSummaryCard({ profile, isLoading }: Props) {
  const profileImageUrl = getImageUrl(profile?.photoUrl);
  return (
    <section className="flex flex-col gap-5 rounded-[12px] border border-[#EDEDED] bg-white p-6 md:flex-row md:items-start">
      {isLoading ? (
        <div className="h-24 w-24 shrink-0 animate-pulse rounded-full bg-gray-200" />
      ) : profileImageUrl ? (
        <Image
          src={profileImageUrl}
          alt={profile?.fullName ?? "Profile avatar"}
          width={96}
          height={96}
          unoptimized
          className="h-24 w-24 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#E5F4F6] text-3xl font-bold text-[#087583]">
          {profile?.fullName?.charAt(0).toUpperCase() ?? "U"}
        </div>
      )}

      <div>
        {isLoading ? (
          <div className="h-9 w-52 animate-pulse rounded bg-gray-200" />
        ) : (
          <h2 className="text-3xl font-bold">
            {profile?.fullName ?? "No Name"}
          </h2>
        )}

        {isLoading ? (
          <div className="mt-4 h-5 w-full animate-pulse rounded bg-gray-200" />
        ) : (
          <p className="mt-4 max-w-[650px] text-xl leading-8 text-[#050505]">
            {profile?.bio ?? "No bio added yet."}
          </p>
        )}
      </div>
    </section>
  );
}
