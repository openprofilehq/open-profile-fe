import Image from "next/image";
import { getImageUrl } from "@/utils/profile";
import { Skeleton } from "../ui/skeleton";

type Props = {
  profile?: {
    fullName?: string;
    bio?: string | null;
    photoUrl?: string | null;
  };
  isLoading?: boolean;
};

export default function ProfileSummaryCard({ profile, isLoading }: Props) {
  const rawUrl = profile?.photoUrl;
  const profileImageUrl = rawUrl ? (rawUrl.startsWith("/profile-preview/") ? rawUrl : getImageUrl(rawUrl)) : null;

  return (
    <section className="flex flex-col gap-5 rounded-[12px] border border-border bg-background p-6 md:flex-row md:items-start">
      {isLoading ? (
        <Skeleton className="h-24 w-24 shrink-0 rounded-full" />
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
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-brand-subtle-bg text-3xl font-bold text-brand-hover-bg">
          {profile?.fullName?.charAt(0).toUpperCase() ?? "U"}
        </div>
      )}

      <div className="min-w-0 flex-1">
        {isLoading ? (
          <Skeleton className="h-9" />
        ) : (
          <h2 className="text-3xl font-bold break-all">
            {profile?.fullName ?? "No Name"}
          </h2>
        )}

        {isLoading ? (
          <Skeleton className="mt-4 h-5" />
        ) : (
          <p className="mt-4 max-w-[650px] break-all text-xl leading-8 text-primary-text">
            {profile?.bio ?? "No bio added yet."}
          </p>
        )}
      </div>
    </section>
  );
}
