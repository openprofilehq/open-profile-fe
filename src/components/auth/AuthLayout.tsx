"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
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

      <div className="flex-1 flex items-center justify-center relative px-4 py-10">
        <div className="hidden lg:block absolute left-0 bottom-15 z-0">
          <Image
            src="/auth/left-img.png"
            alt=""
            width={270}
            height={350}
            className="object-contain"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative z-10 bg-[#FEFEFE] rounded-2xl shadow-none border border-[#EDEDED] w-full max-w-2xl px-6 py-8 sm:px-20 sm:py-14 flex flex-col gap-5"
        >
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex items-center gap-1.5 text-sm font-medium text-[#087583] hover:text-[#065E69] transition-colors cursor-pointer w-fit"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back
          </button>
          {children}
        </motion.div>

        <div className="hidden lg:block absolute right-0 top-15 z-0">
          <Image
            src="/auth/right-img.png"
            alt=""
            width={270}
            height={350}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
