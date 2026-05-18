import Image from "next/image";

type Props = {
  profile?: {
    fullName?: string;
    bio?: string | null;
    photoUrl?: string | null;
  };
};

export default function ProfileSummaryCard({ profile }: Props) {
  return (
    <section className="flex flex-col gap-5 rounded-[12px] border border-[#EDEDED] bg-white p-6 md:flex-row md:items-start">
      <Image
        src={
          profile?.photoUrl
            ? `${process.env.NEXT_PUBLIC_API_URL}${profile.photoUrl}`
            : "/avatar.png"
        }
        alt="Profile avatar"
        width={96}
        height={96}
        className="h-24 w-24 rounded-full object-cover"
      />

      <div>
        <h2 className="text-3xl font-bold">{profile?.fullName ?? "No Name"}</h2>

        <p className="mt-4 max-w-[650px] text-xl leading-8 text-[#050505]">
          {profile?.bio ?? "No bio added yet."}
        </p>
      </div>
    </section>
  );
}
