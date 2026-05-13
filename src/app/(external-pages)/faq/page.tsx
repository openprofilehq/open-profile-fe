"use client";

import { Navbar } from "@/components/layout/Navbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

export default function Page() {
  const faqData = [
    {
      question: "Is OpenProfile free to Use ?",
      answer:
        "Yes! Creating your profile and getting verified is completely free. There are no hidden fees or credit card requirements.",
    },
    {
      question: "How does verification work ?",
      answer:
        "Yes! Creating your profile and getting verified is completely free. There are no hidden fees or credit card requirements.",
    },
    {
      question: "Can people find me if I don't share my profile link ?",
      answer:
        "Yes! Creating your profile and getting verified is completely free. There are no hidden fees or credit card requirements.",
    },
    {
      question: "What happens when someone invites me ?",
      answer:
        "Yes! Creating your profile and getting verified is completely free. There are no hidden fees or credit card requirements.",
    },
    {
      question: "How do I share my profile",
      answer:
        "Yes! Creating your profile and getting verified is completely free. There are no hidden fees or credit card requirements.",
    },
    {
      question: "What types of information can I add to my profile?",
      answer:
        "Yes! Creating your profile and getting verified is completely free. There are no hidden fees or credit card requirements.",
    },
    {
      question: "How many links can I add?",
      answer:
        "Yes! Creating your profile and getting verified is completely free. There are no hidden fees or credit card requirements.",
    },
    {
      question: "Can I change my profile picture anytime?",
      answer:
        "Yes! Creating your profile and getting verified is completely free. There are no hidden fees or credit card requirements.",
    },
    {
      question: "Will my profile changes be visible instantly?",
      answer:
        "Yes! Creating your profile and getting verified is completely free. There are no hidden fees or credit card requirements.",
    },
    {
      question: "What should I do if I forget my password?",
      answer:
        "Yes! Creating your profile and getting verified is completely free. There are no hidden fees or credit card requirements.",
    },
    {
      question: "How do I delete my profile if I no longer need it?",
      answer:
        "Yes! Creating your profile and getting verified is completely free. There are no hidden fees or credit card requirements.",
    },
    {
      question: "Is it possible to recover a deleted profile?",
      answer:
        "Yes! Creating your profile and getting verified is completely free. There are no hidden fees or credit card requirements.",
    },
    {
      question: "How can I update my email address on my account?",
      answer:
        "Yes! Creating your profile and getting verified is completely free. There are no hidden fees or credit card requirements.",
    },
  ];

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
    <div>
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-[#DBEFF2] space-y-1 py-10 mt-19 flex items-center justify-center flex-col text-center lg:py-17"
      >
        <p className="font-semibold tracking-[-1.51px] leading-18 text-[36px] lg:text-[60px] lg:leading-18">
          Frequently asked questions
        </p>
        <p className="text-[18px] leading-6.5 text-[#454545] max-w-82.5 lg:max-w-full">
          Still have questions? Our support team is here to assist.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mx-auto mt-10 lg:pt-16 lg:pb-20"
      >
        <Accordion
          type="single"
          collapsible
          className="w-full mx-auto max-w-182.5"
        >
          {faqData.map((item, index) => (
            <motion.div key={index} variants={itemVariants}>
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger
                  className={`hover:no-underline text-[20px] border-t px-6 ${index === 0 ? "border-t-0" : ""}`}
                >
                  <span className="pr-4">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-[18px] text-[#525252] leading-relaxed pb-6 px-6">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>

      <section className="mt-[153px] px-4 lg:border-t lg:border-b-[#FEFEFE] lg:mt-0 lg:pt-12.75">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-brand rounded-[8px] md:rounded-[32px] overflow-hidden flex items-center w-full max-w-6xl mx-auto justify-between px-4 lg:px-16 py-10 lg:py-18">
            <div className="relative z-10 max-w-105 space-y-6">
              <div className="flex flex-col gap-2">
                <p className="text-[32px] font-semibold text-[#FEFEFE] leading-[1.2] tracking-tight md:whitespace-nowrap">
                  Be the profile people find first
                </p>
                <p className="md:text-[15px] text-[#FEFEFE] font-normal leading-relaxed">
                  Create one searchable profile that shows who you are, what you
                  do and why people should trust you
                </p>
              </div>
              <div>
                <Button
                  variant="secondary"
                  size="lg"
                  className="rounded-[12px] p-6"
                >
                  <Link href="/signup">Create Your Profile Now</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block absolute right-0 md:w-[320px] md:h-65 lg:w-100 lg:h-82.5">
              <Image src="/cta/cta.svg" className="object-cover" alt="" fill />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-[111px]">
        <Footer />
      </section>
    </div>
  );
}
