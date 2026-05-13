"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full border-b border-[#EDEDED] transition-colors duration-300 ${scrolled ? "bg-white/70 backdrop-blur-md" : "bg-white"}`}
      >
        <nav className="flex items-center justify-between pl-[20px] pr-[20px] md:pl-[112px] md:pr-[112px] h-[76px] max-w-[1440px] mx-auto w-full">
          {/* Logo */}
          <Link href="/#" className="flex items-center gap-1 shrink-0">
            <Image
              src="/logo.svg"
              alt="Open Profile"
              width={170}
              height={32}
              className="h-[32px] w-auto"
              style={{ width: "auto" }}
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="#how-it-works"
              className="text-[#050505] font-medium text-[17px] leading-[26px] hover:text-[#087583] transition-colors"
              style={{ fontFamily: "'Afacad', sans-serif" }}
            >
              How it works
            </Link>
            <Link
              href="#pricing"
              className="text-[#050505] font-medium text-[16px] leading-[24px] hover:text-[#087583] transition-colors"
              style={{ fontFamily: "'Afacad', sans-serif" }}
            >
              Pricing
            </Link>
            <Link
              href="/faq"
              className="text-[#050505] font-medium text-[16px] leading-[24px] hover:text-[#087583] transition-colors"
              style={{ fontFamily: "'Afacad', sans-serif" }}
            >
              FAQ
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center justify-center px-[16px] py-[12px] h-[44px] bg-[#FAFAFA] rounded-[8px] text-[#087583] font-semibold text-[15px] hover:bg-[#E5F4F6] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="flex items-center justify-center px-[16px] py-[12px] h-[44px] bg-[#087583] rounded-[8px] text-[#FEFEFE] font-medium text-[15px] hover:bg-[#065E69] transition-colors whitespace-nowrap"
              style={{ fontFamily: "'Afacad', sans-serif" }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 flex flex-col gap-1.5 z-50"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-5 bg-[#050505] transition-transform duration-200 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-[#050505] transition-opacity duration-200 ${mobileOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-[#050505] transition-transform duration-200 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 bg-white z-50 flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between px-6 h-[76px] border-b border-[#EDEDED]">
              <span
                className="text-[#087583] font-semibold text-[18px]"
                style={{ fontFamily: "'Afacad', sans-serif" }}
              >
                Menu
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-[#050505]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col px-6 pt-8 gap-8 flex-1">
              {[
                { label: "How it works", href: "#how-it-works" },
                { label: "Pricing", href: "#pricing" },
                { label: "FAQ", href: "#faq" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[#050505] font-medium text-[18px]"
                  style={{ fontFamily: "'Afacad', sans-serif" }}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3 px-6 pb-10">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full h-[52px] bg-[#F5F5F5] rounded-[10px] text-[#087583] font-semibold text-[16px] flex items-center justify-center border border-[#EDEDED]"
                style={{ fontFamily: "'Afacad', sans-serif" }}
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="w-full h-[52px] bg-[#087583] rounded-[10px] text-white font-medium text-[16px] flex items-center justify-center"
                style={{ fontFamily: "'Afacad', sans-serif" }}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
