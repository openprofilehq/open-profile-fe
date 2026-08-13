"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface SearchEmptyStateProps {
  query: string;
}

export default function SearchEmptyState({ query }: SearchEmptyStateProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);

  const trimmedEmail = email.trim();
  const isValidEmail = Boolean(
    trimmedEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
  );
  const isInvalidEmail = Boolean(trimmedEmail && !isValidEmail && touched);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail || isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 500);
  }

  return (
    <div className="mx-auto flex w-full max-w-[680px] flex-col gap-4 py-4">
      {/* Top Card: Profile Not Found (darker, defined border matching mockup) */}
      <div className="bg-card flex flex-col items-center rounded-[12px] border border-[#98A2B3]/60 px-6 py-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] md:px-8 md:py-10">
        <div className="mb-5 flex h-[48px] w-[48px] items-center justify-center rounded-[10px] bg-[#E6F7F9]">
          <Search className="text-[#087583]" size={22} />
        </div>
        <h3 className="text-primary-text text-[20px] font-bold md:text-[22px]">
          No profile found for &lsquo;{query}&rsquo;
        </h3>
        <p className="text-secondary-text mt-2 max-w-[460px] text-[14px] leading-relaxed md:text-[15px]">
          Try a different name or username, or invite them to create their Open
          Profile.
        </p>
      </div>

      {/* Bottom Card: Invite Form (lighter, subtle border matching mockup) */}
      <div className="bg-card flex flex-col items-center rounded-[12px] border border-[#EAECF0] px-6 py-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] md:px-8 md:py-10">
        <h3 className="text-primary-text text-[20px] font-bold md:text-[22px]">
          Invite them to join Open.Profile
        </h3>
        <p className="text-secondary-text mt-2 mb-6 max-w-[520px] text-[14px] leading-relaxed md:text-[15px]">
          We&apos;ll send an email with a secure link they can use to create and
          claim their profile.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[540px] flex-col justify-center gap-3 sm:flex-row"
        >
          <div className="flex flex-1 flex-col">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (!touched) setTouched(true);
              }}
              onBlur={() => setTouched(true)}
              placeholder="Enter their email address"
              className={`h-[48px] flex-1 rounded-[8px] border px-4 text-[15px] transition-colors outline-none ${
                isInvalidEmail
                  ? "bg-background border-[#F04438] text-[#D92D20] focus:border-[#F04438]"
                  : "border-secondary-b bg-secondary-bg/40 text-primary-text placeholder:text-disabled-text focus:border-brand-hover-bg focus:bg-background"
              }`}
            />
            {isInvalidEmail && (
              <p className="mt-1.5 text-left text-[13px] font-normal text-[#D92D20]">
                Invalid email address
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValidEmail || isSubmitting}
            className={`h-[48px] rounded-[8px] px-6 text-[15px] font-medium whitespace-nowrap transition-all ${
              isValidEmail
                ? "bg-brand-hover-bg cursor-pointer text-white hover:opacity-90"
                : "cursor-not-allowed bg-[#F3F4F6] text-[#9CA3AF] dark:bg-neutral-800 dark:text-neutral-500"
            }`}
          >
            {isSubmitting ? "Sending..." : "Send Invite"}
          </button>
        </form>

        <p className="text-disabled-text mt-4 text-[12px] md:text-[13px]">
          They&apos;ll receive an email to claim their profile. You&apos;ll be
          notified when they join.
        </p>
      </div>
    </div>
  );
}
