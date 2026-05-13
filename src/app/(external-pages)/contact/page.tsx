"use client";

import { useState } from "react";
import { useRef, useEffect } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { CTA } from "@/components/home/CTA";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, ChevronDown } from "lucide-react";
import {
  FaXTwitter,
  FaLinkedinIn,
  FaDribbble,
  FaBehance,
} from "react-icons/fa6";
import { contactAction } from "@/app/actions/contact";

const socials = [
  { label: "X", href: "#", icon: <FaXTwitter size={22} /> },
  { label: "LinkedIn", href: "#", icon: <FaLinkedinIn size={22} /> },
  { label: "Dribbble", href: "#", icon: <FaDribbble size={22} /> },
  { label: "Behance", href: "#", icon: <FaBehance size={22} /> },
];

const industries = [
  "Technology",
  "Design",
  "Marketing",
  "Finance",
  "Healthcare",
  "Education",
  "Other",
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [industry, setIndustry] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isValid = name.trim() && email.trim() && message.trim();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      const result = await contactAction(undefined, new FormData(e.currentTarget));
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        setIndustry("");
        setMessage("");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#065E69] selection:text-white overflow-hidden text-[#050505]">
      <Navbar />
      <div className="pt-[76px]">
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-[32px] md:text-[40px] font-semibold tracking-tight mb-3">
              Get in Touch With Us
            </h1>
            <p className="text-[14px] md:text-[15px] text-[#6B7280]">
              No matter where you are, Open Profile brings solutions closer to
              you.
            </p>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">
            {/* Left — Contact info */}
            <div className="space-y-10">
              <div>
                <h2 className="text-[18px] font-semibold mb-6">Contact Us</h2>
                <ul className="space-y-5">
                  <li className="flex items-start gap-3">
                    <Mail
                      size={18}
                      style={{ color: "#087583" }}
                      className="mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-[13px] font-medium text-[#050505]">
                        Email Address
                      </p>
                      <p className="text-[13px] text-[#5C5E64]">
                        openprofile@email.com
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone
                      size={18}
                      style={{ color: "#087583" }}
                      className="mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-[13px] font-medium text-[#050505]">
                        Phone number
                      </p>
                      <p className="text-[13px] text-[#5C5E64]">
                        +1 234 567 8900
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin
                      size={18}
                      style={{ color: "#087583" }}
                      className="mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-[13px] font-medium text-[#050505]">
                        Our Office Address
                      </p>
                      <p className="text-[13px] text-[#5C5E64]">
                        New York, USA
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Socials */}
              <div>
                <p className="text-[20px] font-medium mb-4 text-[#050505]">
                  Follow us on our social media accounts
                </p>
                <div className="flex items-center gap-4">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="text-[#5C5E64] hover:text-[#065E69] transition-colors"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div>
              <h2 className="text-[18px] font-semibold mb-6">Send a Message</h2>

              {success ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#E6F4F5] flex items-center justify-center">
                    <Mail size={24} style={{ color: "#065E69" }} />
                  </div>
                  <h3 className="text-[17px] font-semibold text-[#050505]">
                    Message Sent!
                  </h3>
                  <p className="text-[13px] text-[#5C5E64] max-w-xs">
                    Thanks for reaching out. We&apos;ll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-[13px] text-[#065E69] font-medium hover:underline mt-2"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <input type="hidden" name="industry" value={industry} />

                  <div className="space-y-1.5">
                    <label
                      htmlFor="name"
                      className="text-[13px] font-medium text-[#050505]"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Shukuneh Itouer"
                      className="w-full px-4 py-3 rounded-[8px] border border-[#E5E7EB] text-[13px] placeholder:text-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#065E69] focus:border-transparent transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="text-[13px] font-medium text-[#050505]"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="shukuneh025@gmail.com"
                      className="w-full px-4 py-3 rounded-[8px] border border-[#E5E7EB] text-[13px] placeholder:text-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#065E69] focus:border-transparent transition"
                    />
                  </div>

                  {/* Custom industry dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#050505]">
                      Industry
                    </label>
                    <div className="relative" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => setOpen((o) => !o)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-[8px] border border-[#E5E7EB] text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-[#065E69] transition"
                      >
                        <span
                          className={
                            industry ? "text-[#050505]" : "text-[#9CA3AF]"
                          }
                        >
                          {industry || "Select..."}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-[#9CA3AF] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                        />
                      </button>

                      <div
                        className={`absolute z-10 mt-1 w-full bg-white border border-[#E5E7EB] rounded-[8px] shadow-lg overflow-hidden transition-all duration-200 origin-top ${
                          open
                            ? "opacity-100 scale-y-100"
                            : "opacity-0 scale-y-0 pointer-events-none"
                        }`}
                      >
                        {industries.map((i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setIndustry(i);
                              setOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#F0FAFB] transition-colors ${
                              industry === i
                                ? "text-[#065E69] font-medium"
                                : "text-[#050505]"
                            }`}
                          >
                            {i}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="message"
                      className="text-[13px] font-medium text-[#050505]"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your messages"
                      className="w-full px-4 py-3 rounded-[8px] border border-[#E5E7EB] text-[13px] placeholder:text-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#065E69] focus:border-transparent transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!isValid || pending}
                    className="w-full bg-[#065E69] text-white text-[14px] font-medium py-3.5 rounded-[8px] transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-[#054f59]"
                  >
                    {pending ? "Sending…" : "Continue"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </main>

        <CTA />
        <Footer />
      </div>
    </div>
  );
}