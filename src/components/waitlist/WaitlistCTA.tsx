"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { joinWaitlistAction } from "@/app/actions/waitlist";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" } as const,
});

export function WaitlistCTA() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleBlur = () => {
    if (email && !EMAIL_RE.test(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!EMAIL_RE.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", email);

      const result = await joinWaitlistAction(undefined, formData);

      if (result?.success) {
        toast.success("Successfully joined the waitlist!");
        setEmail("");
        setEmailError("");
      } else if (result?.error) {
        toast.error(result.error);
      }
    });
  };

  return (
    <section className="relative w-full bg-[#FAFAFA] py-16 px-6 overflow-hidden">
      <div className="absolute left-0 bottom-0 h-auto w-auto select-none pointer-events-none hidden lg:block">
        <Image
          src="/waitlist/cta-left.svg"
          alt=""
          width={400}
          height={400}
          className="h-[400px] w-auto object-contain"
          style={{ width: "auto" }}
        />
      </div>
      <div className="absolute right-0 top-0 h-auto w-auto select-none pointer-events-none hidden lg:block">
        <Image
          src="/waitlist/cta-right.svg"
          alt=""
          width={400}
          height={600}
          className="h-[400px] w-auto object-contain"
          style={{ width: "auto" }}
        />
      </div>

      <div className="max-w-[1280px] mx-auto relative overflow-hidden bg-[#171717] rounded-[24px] py-16 px-6 md:px-12 flex flex-col items-center text-center">
        <div className="relative z-10 max-w-[700px] w-full flex flex-col items-center">
          <motion.h2
            {...fadeUp(0)}
            className="text-[32px] md:text-[48px] font-semibold text-white mb-4 leading-[1.2]"
            style={{ fontFamily: "'Afacad', sans-serif" }}
          >
            Ready to own your online identity?
          </motion.h2>

          <motion.p
            {...fadeUp(0.1)}
            className="text-[16px] md:text-[18px] text-[#E5E5E5] mb-10 max-w-[540px]"
            style={{ fontFamily: "'Afacad', sans-serif" }}
          >
            Join the waitlist and be among the first to access the new way to
            present yourself online.
          </motion.p>

          <motion.form
            {...fadeUp(0.2)}
            onSubmit={handleSubmit}
            className="w-full max-w-[500px] flex flex-col md:flex-row gap-3 mb-2"
          >
            <div className="flex-1">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                onBlur={handleBlur}
                disabled={isPending}
                className={`w-full h-[54px] px-5 rounded-[10px] border bg-white text-[#050505] placeholder:text-[#999] outline-none transition-colors ${
                  emailError
                    ? "border-red-400"
                    : "border-transparent focus:border-[#087583]"
                }`}
                style={{ fontFamily: "'Afacad', sans-serif" }}
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="h-[54px] px-8 bg-[#087583] text-white rounded-[10px] font-medium hover:bg-[#065E69] transition-colors whitespace-nowrap disabled:opacity-50"
              style={{ fontFamily: "'Afacad', sans-serif" }}
            >
              {isPending ? "Joining..." : "Get Early Access"}
            </button>
          </motion.form>

          {/* Error message */}
          <div className="h-6 w-full text-center">
            {emailError && (
              <p
                className="text-xs text-red-400 font-medium"
                style={{ fontFamily: "'Afacad', sans-serif" }}
              >
                {emailError}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
