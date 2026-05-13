"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { joinWaitlistAction } from "@/app/actions/waitlist";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" } as const,
});

export function WaitlistHero() {
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
    <section className="relative w-full min-h-screen md:min-h-[700px] md:h-[700px] bg-[#FAFAFA] overflow-hidden flex flex-col items-center pt-8 md:pt-12 px-6">
      {/* Background Images */}
      <div className="absolute -left-0 bottom-0 hidden lg:block select-none pointer-events-none">
        <Image
          src="/waitlist/image-left.svg"
          alt=""
          width={400}
          height={600}
          priority
          className="w-auto h-[500px]"
          style={{ width: "auto" }}
        />
      </div>
      <div className="absolute -right-0 -top-[5px] hidden lg:block select-none pointer-events-none">
        <Image
          src="/waitlist/image-right.svg"
          alt=""
          width={400}
          height={600}
          priority
          className="w-auto h-[500px]"
          style={{ width: "auto" }}
        />
      </div>

      {/* Logo */}
      <motion.div {...fadeUp(0)} className="mb-16 md:mb-24 z-10 mt-10">
        <Image
          src="/logo.svg"
          alt="Open Profile"
          width={170}
          height={32}
          className="h-[32px] w-auto"
          style={{ width: "auto" }}
        />
      </motion.div>

      {/* Content */}
      <div className="max-w-[800px] w-full text-center flex flex-col items-center z-10">
        <motion.h1
          {...fadeUp(0.1)}
          className="text-[40px] md:text-[60px] font-semibold leading-[1.1] tracking-[-1.5px] text-[#050505] mb-6"
          style={{ fontFamily: "'Afacad', sans-serif" }}
        >
          Join the waitlist for <br className="hidden md:block" />
          <span className="text-[#087583]">Openprofile</span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.2)}
          className="text-[16px] md:text-[18px] leading-[26px] text-[#454545] max-w-[740px] mb-10"
          style={{ fontFamily: "'Afacad', sans-serif" }}
        >
          Stop losing clients to identity doubt. Open Profile is the first
          searchable identity platform with built-in verification, designed to
          turn your online presence into a professional powerhouse.
        </motion.p>

        {/* Form */}
        <motion.form
          {...fadeUp(0.3)}
          onSubmit={handleSubmit}
          className="w-full max-w-[580px] flex flex-col md:flex-row gap-2.5 mb-2 px-0"
        >
          <div className="flex-1 flex flex-col gap-1.5 items-start">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              onBlur={handleBlur}
              disabled={isPending}
              className={`w-full h-[50px] px-4 rounded-[8px] border bg-[#FAFAFA] text-[#050505] placeholder:text-[#999] outline-none transition-colors ${
                emailError
                  ? "border-red-400"
                  : "border-[#E5E5E5] focus:border-[#087583]"
              }`}
              style={{ fontFamily: "'Afacad', sans-serif" }}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full md:w-auto h-[50px] px-8 bg-[#262626] text-white rounded-[8px] font-medium hover:bg-[#333] transition-colors whitespace-nowrap disabled:opacity-50"
            style={{ fontFamily: "'Afacad', sans-serif" }}
          >
            {isPending ? "Joining..." : "Join the Waitlist"}
          </button>
        </motion.form>

        {/* Error message */}
        <div className="h-6 mb-2 text-left w-full max-w-[580px]">
          {emailError && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 font-medium"
              style={{ fontFamily: "'Afacad', sans-serif" }}
            >
              {emailError}
            </motion.p>
          )}
        </div>

        {/* Social Proof */}
        <motion.div {...fadeUp(0.4)} className="flex items-center gap-1">
          <div className="relative w-[60px] h-8">
            <Image
              src="/waitlist/users.svg"
              alt="Users"
              fill
              className="object-contain object-left"
            />
          </div>
          <p
            className="text-[14px] md:text-[15px] text-[#454545]"
            style={{ fontFamily: "'Afacad', sans-serif" }}
          >
            <span className="hidden md:inline">
              Join the waitlist to secure your verified badge and unique URL
            </span>
            <span className="inline md:hidden">
              Join over 2000+ creators and freelancers that trusts us all over
              the world.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
