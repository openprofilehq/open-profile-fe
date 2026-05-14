import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type Profile = {
  id: string;
  fullName?: string | null;
  username?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
};

interface SearchResultCardProps {
  profile: Profile;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function SearchResultCard({ profile }: SearchResultCardProps) {
  const name = profile.fullName?.trim() || profile.username || "Unknown User";
  const username = profile.username || profile.id;
  const bio = profile.bio?.trim();
  const initials = getInitials(name);
  const profileHref = profile.username ? `/${profile.username}` : "/";

  return (
    <div className="flex flex-col p-4 bg-white border border-gray-200 rounded-lg gap-3">
      {/* Top: avatar + info */}
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12 flex-shrink-0">
          {profile.photoUrl ? (
            <AvatarImage src={profile.photoUrl} alt={`${name} profile picture`} />
          ) : (
            <AvatarFallback className="bg-teal-600 text-white text-sm font-semibold">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{name}</p>
          <p className="text-xs text-gray-500 truncate">@{username}</p>
          {bio && (
            <p className="text-xs text-gray-600 leading-relaxed mt-1">{bio}</p>
          )}
        </div>

        {/* Desktop: button on the right */}
        <div className="hidden md:block flex-shrink-0 self-center">
          <Link href={profileHref}>
            <button className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors whitespace-nowrap">
              View Profile
            </button>
          </Link>
        </div>
      </div>

      {/* Mobile: full-width button below */}
      <div className="md:hidden">
        <Link href={profileHref} className="block w-full">
          <button className="w-full bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium py-2.5 rounded-md transition-colors">
            View Profile
          </button>
        </Link>
      </div>
    </div>
  );
}