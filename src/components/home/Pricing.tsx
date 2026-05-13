"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";

interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  buttonText: string;
  highlighted?: boolean;
  featureTitle?: string;
}

const plans: PricingPlan[] = [
  {
    name: "Free",
    price: "0",
    features: [
      "Public profile (basic)",
      "Username URL",
      "Add links",
      "Limited template",
      "Email verification",
      "Search visibility",
    ],
    buttonText: "Get Started with free",
  },
  {
    name: "Pro",
    price: "8",
    featureTitle: "Includes everything in free +",
    features: [
      "Verification badge",
      "Unlimited links",
      "Custom themes (colors, fonts)",
      "Priority in search results",
      "Analytics (profile views, clicks)",
      "Username URL",
    ],
    buttonText: "Get Started with Pro",
    highlighted: true,
  },
  {
    name: "Elite",
    price: "20",
    featureTitle: "Includes everything in Pro +",
    features: [
      "Custom domain (yourname.com)",
      "Advanced analytics",
      "Featured placement in search",
      "Invite growth tools",
      "Early access features",
      "Priority support",
    ],
    buttonText: "Get Started with elite",
  },
];

export function Pricing() {
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
    <section className="w-full bg-[#FAFAFA] py-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center"
      >
        <motion.h2
          variants={itemVariants}
          className="text-[28px] md:text-[40px] font-semibold text-center text-[#050505] mb-10"
        >
          Choose the plan that fits your needs.
        </motion.h2>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`rounded-[16px] p-4 xl:p-8 flex flex-col h-full border ${
                plan.highlighted
                  ? "bg-[#087583] border-[#087583] text-white "
                  : "bg-white border-[#E5E5E5] text-[#050505]"
              }`}
            >
              <div className="mb-8">
                <p
                  className={`text-[16px] font-medium mb-4 ${
                    plan.highlighted ? "text-white" : "text-[#525252]"
                  }`}
                >
                  {plan.name}
                </p>
                <div
                  className={`flex items-baseline gap-1 border-b ${
                    plan.highlighted ? "border-white/20" : "border-[#E5E5E5]"
                  }`}
                >
                  <span className="text-[36px] font-bold">${plan.price}</span>
                  <span
                    className={`text-[15px] ${
                      plan.highlighted ? "text-white/80" : "text-[#525252]"
                    }`}
                  >
                    /month
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <p
                  className={`text-[14px] font-bold mb-6 ${
                    plan.highlighted ? "text-white" : "text-[#050505]"
                  }`}
                >
                  {plan.featureTitle || "Includes:"}
                </p>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, fIndex) => (
                    <li
                      key={fIndex}
                      className="flex items-start gap-3 text-[14px]"
                    >
                      <Check
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          plan.highlighted ? "text-white" : "text-[#087583]"
                        }`}
                      />
                      <span
                        className={
                          plan.highlighted ? "text-white" : "text-[#525252]"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant="outline"
                className={`w-full py-4 h-auto rounded-[8px] font-bold text-[14px] transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-white text-[#087583] hover:bg-white/95 border-transparent"
                    : "bg-white text-[#087583] hover:bg-[#087583]/5 border-[#087583]"
                }`}
              >
                {plan.buttonText}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
