import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type ProfileResponse } from "@/api/profile/profile.type";
import { env as serverEnv } from "@/env/server";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params;

  const res = await fetch(
    `${serverEnv.API_BASE_URL}/api/v1/profiles/${encodeURIComponent(username)}`,
    { cache: "no-store" }
  );

  if (!res.ok) notFound();

  const json = await res.json();
  const profile: ProfileResponse = json.data ?? json;

  const name = profile.fullName ?? username;
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const photoSrc = profile.photoUrl
    ? profile.photoUrl.startsWith("http")
      ? profile.photoUrl
      : new URL(profile.photoUrl, serverEnv.API_BASE_URL).toString()
    : "";

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <div className="flex justify-center pt-6">
        <Link href="/">
          <Image
            src="/auth/logo.png"
            alt="Open.Profile"
            width={140}
            height={32}
            priority
          />
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#EDEDED] bg-white p-8 text-center shadow-sm sm:flex-row sm:text-left">
          <Avatar className="h-20 w-20 shrink-0">
            <AvatarImage src={photoSrc} alt={name} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold text-[#050505]">{name}</h1>
            <p className="text-sm text-gray-500">@{profile.username}</p>
            {profile.bio && (
              <p className="mt-2 text-sm leading-relaxed text-[#454545]">
                {profile.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      <footer className="py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Open Profile. All rights reserved.
      </footer>
    </div>
  );
}
