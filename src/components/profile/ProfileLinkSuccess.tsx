import Image from "next/image";
import { useRef } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

export default function ProfileLinkSuccess({
  profileLink,
}: {
  profileLink: string;
}) {
  const profileRef = useRef<HTMLDivElement>(null);

  function runTest() {
    navigator.clipboard.writeText(profileRef.current?.textContent || "");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex flex-col items-center justify-center">
        <Image src="/badge-check.svg" width={80} height={80} alt="" />

        <h2 className="mt-3 text-center text-3xl font-bold">
          Your profile has been published
        </h2>

        <p className="my-2 text-center">
          Your account URL has been created successfully
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex w-full items-center gap-4">
          <div
            className="border-primary w-full rounded-lg border p-4"
            ref={profileRef}
          >
            open.profile/{profileLink}
          </div>

          <span title="Copy profile link">
            <Copy className="cursor-pointer" onClick={runTest} />
          </span>
        </div>

        <div className="flex flex-col items-center justify-center md:flex-row md:gap-3">
          <Button
            type="button"
            className="mt-4 h-13 w-62 rounded-[10px] bg-[#087583] text-[16px] font-normal shadow-none transition-colors"
          >
            Go To Dashboard
          </Button>

          <Button
            variant="outline"
            type="button"
            className="mt-4 h-13 w-62 rounded-[10px] text-[16px] font-medium shadow-none transition-colors"
          >
            Unpublish
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
