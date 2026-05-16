import Image from "next/image";
import { motion } from "motion/react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { env } from "@/env/client";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfileLinkSuccess({
  username,
  bio,
  photoUrl,
  onContinue,
}: {
  username: string;
  bio: string;
  photoUrl?: string;
  onContinue?: () => void;
}) {
  const profileUrl = `${env.NEXT_PUBLIC_PROFILE_BASE_URL}/${encodeURIComponent(username)}`;
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(profileUrl).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => toast.error("Failed to copy link.")
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-center text-3xl font-bold">
          Your profile has been published
        </h2>

        <div className="flex w-full flex-col items-center justify-center">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              width={80}
              height={80}
              className="mt-3 h-20 w-20 rounded-full object-cover"
              alt=""
            />
          ) : (
            <Image
              src="/avatar.png"
              width={80}
              height={80}
              className="mt-3 h-20 w-20 rounded-full object-cover"
              alt=""
            />
          )}

          <span className="mt-4 flex items-center gap-2 text-center font-bold text-[#747474]">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#747474] no-underline visited:text-[#747474] hover:text-[#747474] hover:no-underline"
              style={{ textDecoration: "none" }}
            >
              {profileUrl}
            </a>
            <button
              type="button"
              onClick={copyLink}
              className="shrink-0 cursor-pointer"
            >
              {copied ? (
                <Check size={18} className="text-[#087583]" />
              ) : (
                <Copy
                  size={18}
                  className="rotate-90 transform text-[#747474]"
                />
              )}
            </button>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="mt-3 text-center">{bio}</p>

        <Button
          type="button"
          className="mt-4 h-13 w-full rounded-[10px] bg-[#087583] text-[16px] font-normal shadow-none transition-colors"
          onClick={onContinue}
        >
          Continue To Dashboard
        </Button>
      </div>
    </motion.div>
  );
}
