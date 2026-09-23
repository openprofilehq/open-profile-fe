"use client";

import { Check } from "lucide-react";
import { motion, Variants } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";

interface PricingPlan {
  name: string;
  priceMonth: string;
  priceYear: string;
  features: string[];
  buttonText: string;
  highlighted?: boolean;
  featureTitle?: string;
  href?: string;
  note?: string;
}

const plans: PricingPlan[] = [
  {
    name: "Free",
    priceMonth: "0",
    priceYear: "0",
    features: [
      "Your page at openprofile.bio/yourname",
      "Links, projects and a call to action",
      "Default profile template",
      "Discoverable in search",
    ],
    buttonText: "Get Started with Free",
    href: "/signup",
  },
  {
    name: "Pro",
    priceMonth: "5",
    priceYear: "50",
    featureTitle: "Everything in Free, plus",
    features: [
      "Every profile template",
      "Profile and link analytics",
      "Notifications",
      "Advanced profile sections",
    ],
    buttonText: "Coming Soon",
    note: "Not available yet. Everything we have shipped so far is free.",
    highlighted: true,
  },
];

export function Pricing() {
  const [isYear, setIsYear] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="pricing" className="bg-primary-bg w-full py-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mx-auto flex w-full max-w-[820px] flex-col items-center px-4 sm:px-6 lg:px-0"
      >
        <motion.h2
          variants={itemVariants}
          className="text-primary-text mb-10 text-center text-[28px] font-semibold md:text-[40px]"
        >
          Start free. Upgrade when there is more.
        </motion.h2>

        <motion.div
          variants={itemVariants}
          className="border-primary-foreground-b bg-background mb-10 inline-flex items-center rounded-2xl border text-center transition-all duration-300"
        >
          <Button
            variant={null}
            size="lg"
            onClick={() => setIsYear(false)}
            className={`w-28 cursor-pointer rounded-2xl px-4 py-3 font-semibold ${
              !isYear ? "bg-brand text-white" : "text-tertiary-foreground-text"
            }`}
          >
            Month
          </Button>
          <Button
            variant={null}
            size="lg"
            onClick={() => setIsYear(true)}
            className={`w-28 cursor-pointer rounded-2xl px-4 py-3 font-semibold ${
              isYear ? "bg-brand text-white" : "text-tertiary-foreground-text"
            }`}
          >
            Year
          </Button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid w-full grid-cols-1 gap-6 md:grid-cols-2"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className={`flex h-full flex-col rounded-[16px] border p-4 xl:p-8 ${
                plan.highlighted
                  ? "bg-brand-hover-bg border-brand text-white"
                  : "border-primary-foreground-b text-primary-text bg-card"
              }`}
            >
              <div className="mb-8">
                <p
                  className={`mb-4 text-base font-medium ${
                    plan.highlighted
                      ? "text-white"
                      : "text-tertiary-foreground-text"
                  }`}
                >
                  {plan.name}
                </p>
                <div
                  className={`flex items-baseline gap-1 border-b pb-4 ${
                    plan.highlighted
                      ? "border-white/20"
                      : "border-primary-foreground-b"
                  }`}
                >
                  <span className="text-[36px] font-bold">
                    ${isYear ? plan.priceYear : plan.priceMonth}
                  </span>
                  <span
                    className={`text-base ${
                      plan.highlighted
                        ? "text-white/80"
                        : "text-tertiary-foreground-text"
                    }`}
                  >
                    {isYear ? "/year" : "/month"}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <p
                  className={`mb-6 text-[14px] font-bold ${
                    plan.highlighted ? "text-white" : "text-primary-text"
                  }`}
                >
                  {plan.featureTitle || "Includes:"}
                </p>
                <ul className="mb-10 space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-[14px]"
                    >
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          plan.highlighted
                            ? "text-white"
                            : "text-link-hover-text"
                        }`}
                      />
                      <span
                        className={
                          plan.highlighted
                            ? "text-white"
                            : "text-tertiary-foreground-text"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.href ? (
                <Link
                  href={plan.href}
                  className="text-link-hover-text border-brand flex h-auto w-full items-center justify-center rounded-[8px] border bg-white py-4 text-[14px] font-bold transition-all duration-300 hover:opacity-90"
                >
                  {plan.buttonText}
                </Link>
              ) : (
                <button
                  disabled
                  className="text-link-hover-text flex h-auto w-full cursor-not-allowed items-center justify-center rounded-[8px] border border-transparent bg-white py-4 text-[14px] font-bold opacity-60"
                >
                  {plan.buttonText}
                </button>
              )}

              {plan.note && (
                <p
                  className={`mt-3 text-center text-[12px] ${
                    plan.highlighted
                      ? "text-white/70"
                      : "text-tertiary-foreground-text"
                  }`}
                >
                  {plan.note}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
