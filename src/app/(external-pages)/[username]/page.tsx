import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params;

  // TODO: fetch real user data
  const user = {
    name: "Lucy Udoh",
    username,
    avatar: "/user-placeholder.jpg",
    bio: "Passionate about designing products that are simple, useful, and beautiful. I love transforming ideas into intuitive digital experiences. Always designing with users at the heart of every decision.",
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("");

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

      <div className="relative flex flex-1 items-center justify-center px-4 py-10">
        <div className="absolute bottom-15 left-0 z-0 hidden lg:block">
          <Image
            src="/auth/left-img.png"
            alt=""
            width={270}
            height={350}
            className="object-contain"
          />
        </div>

        {/* Profile empty state */}
        <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-4 text-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-xl font-bold text-[#050505]">{user.name}</h1>
            <p className="text-sm text-gray-500">{user.username}</p>
          </div>

          <p className="text-justify text-sm leading-relaxed text-[#050505]">
            {user.bio}
          </p>
        </div>

        <div className="absolute top-15 right-0 z-0 hidden lg:block">
          <Image
            src="/auth/right-img.png"
            alt=""
            width={270}
            height={350}
            className="object-contain"
          />
        </div>
      </div>

      <footer className="py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Open Profile. All rights reserved.
      </footer>
    </div>
  );
}
