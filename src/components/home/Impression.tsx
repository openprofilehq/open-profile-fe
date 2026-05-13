"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { UserIcon } from "../icons/UserIcon";
import { QuestionIcon } from "../icons/QuestionIcon";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const CARD_W = 143;
const CARD_H = 72;

// outer container dimensions at 1440px
const OUTER_W = 528;
const OUTER_H = 420;

// svg dimensions
const SVG_W = 363;
const SVG_H = 274;

// offset between outer container and centered SVG
const OFFSET_X = (OUTER_W - SVG_W) / 2; // 82.5
const OFFSET_Y = (OUTER_H - SVG_H) / 2; // 73

const socials = [
  {
    label: "GitHub",
    sub: "Projects",
    bg: "#171717",
    icon: "/impression/icon-github.svg",
  },
  {
    label: "Behance",
    sub: "Portfolio",
    bg: "#548BF1",
    icon: "/impression/icon-behance.svg",
  },
  {
    label: "LinkedIn",
    sub: "Experience",
    bg: "#548BF1",
    icon: "/impression/icon-linkedin.svg",
  },
  {
    label: "X",
    sub: "Thoughts",
    bg: "#171717",
    icon: "/impression/icon-twitter.svg",
  },
];

// card center positions in outer container space → converted to SVG coordinate space
const lines = [
  // top-left card (pl-[19px] offset)
  {
    x1: 19 + CARD_W / 2 - OFFSET_X,
    y1: CARD_H / 2 - OFFSET_Y,
    x2: SVG_W / 2,
    y2: SVG_H / 2,
  },
  // top-right card
  {
    x1: OUTER_W - CARD_W + CARD_W / 2 - OFFSET_X,
    y1: CARD_H / 2 - OFFSET_Y,
    x2: SVG_W / 2,
    y2: SVG_H / 2,
  },
  // bottom-left card (pb-1.5 offset)
  {
    x1: CARD_W / 2 - OFFSET_X,
    y1: OUTER_H - CARD_H + CARD_H / 2 - OFFSET_Y,
    x2: SVG_W / 2,
    y2: SVG_H / 2,
  },
  // bottom-right card (pr-0.5 offset)
  {
    x1: OUTER_W - CARD_W + CARD_W / 2 - OFFSET_X,
    y1: OUTER_H - CARD_H + CARD_H / 2 - OFFSET_Y,
    x2: SVG_W / 2,
    y2: SVG_H / 2,
  },
];

export default function Impression() {
  return (
    <div className="font-afacad text-primary grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-20 w-full items-center">
      {/* left visual */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex relative items-center justify-center w-full max-w-[528px] mx-auto overflow-hidden"
        style={{ aspectRatio: `${OUTER_W} / ${OUTER_H}` }}
      >
        {/* SVG — dashes + user icon only, centered inside outer container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width={SVG_W}
            height={SVG_H}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* dashes from card centers to user icon */}
            {lines.map((line, i) => (
              <motion.line
                key={i}
                {...line}
                stroke="#ABABAB"
                strokeWidth="1"
                strokeDasharray="6 6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
              />
            ))}

            {/* user icon at center */}
            <motion.g
              initial={{ scale: 0.7, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ transformOrigin: `${SVG_W / 2}px ${SVG_H / 2}px` }}
            >
              {/* circle bg */}
              <circle
                cx={SVG_W / 2}
                cy={SVG_H / 2}
                r="30"
                fill="#FEFEFE"
                stroke="white"
                strokeWidth="2"
              />
              {/* user icon */}
              <UserIcon x={SVG_W / 2 - 20} y={SVG_H / 2 - 20} />

              {/* red question badge */}
              <circle
                cx={SVG_W / 2 + 20}
                cy={SVG_H / 2 + 20}
                r="11"
                fill="#FF4D4D"
                stroke="white"
                strokeWidth="2"
              />
              {/* question icon */}
              <QuestionIcon x={SVG_W / 2 + 14} y={SVG_H / 2 + 14} />
            </motion.g>
          </svg>
        </div>

        {/* social cards — HTML divs absolutely positioned at corners */}

        {/* top row */}
        <div className="absolute top-0 left-0 right-0 flex items-start justify-between sm:pl-[19px] gap-4">
          {socials.slice(0, 2).map(({ label, sub, bg, icon }, i) => (
            <motion.div
              key={label}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
              className="w-[143px] h-18 bg-[#FEFEFE] border border-[#EDEDED] rounded-[16px] flex items-center justify-start gap-2 pl-4 rotate-[0.82deg]"
            >
              <div
                style={{ backgroundColor: bg }}
                className="shrink-0 h-8.5 w-8.5 border border-[#EDEDED] flex items-center justify-center rounded-[4px]"
              >
                <Image src={icon} alt={label} width={24} height={24} />
              </div>
              <p className="text-[14px] leading-5 flex flex-col">
                <span>{label}</span>
                <span>{sub}</span>
              </p>
            </motion.div>
          ))}
        </div>

        {/* bottom row */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between sm:pr-0.5 sm:pb-1.5 gap-4">
          {socials.slice(2).map(({ label, sub, bg, icon }, i) => (
            <motion.div
              key={label}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.15 }}
              className="w-[143px] h-18 bg-[#FEFEFE] border border-[#EDEDED] rounded-[16px] flex items-center justify-start gap-2 pl-4 rotate-[0.82deg]"
            >
              <div
                style={{ backgroundColor: bg }}
                className="shrink-0 h-8.5 w-8.5 border border-[#EDEDED] flex items-center justify-center rounded-[4px]"
              >
                <Image src={icon} alt={label} width={24} height={24} />
              </div>
              <p className="text-[14px] leading-5 flex flex-col">
                <span>{label}</span>
                <span>{sub}</span>
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* right text */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col items-start gap-6 justify-center w-full"
      >
        <div className="space-y-4">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-[28px] md:text-[34px] lg:text-[40px] leading-9 md:leading-11 lg:leading-12 tracking-[-1px] font-semibold font-afacad"
          >
            Your Links Are Scattered.{" "}
            <span className="text-[#087583]">
              Your First Impression Should Not Be
            </span>
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-[15px] md:text-[16px] lg:text-[18px] leading-6 lg:leading-6.5 flex flex-col font-afacad gap-4 md:gap-6"
          >
            <span>
              Your projects may be on GitHub. Your designs may be on Behance.
              Your thoughts may be on X. Your experience may be on LinkedIn. But
              when someone wants to know who you are, what you do, and whether
              they can trust you, they should not have to piece it together
              across platforms.
            </span>
            <span>
              Open Profile gives you one clear place to be found, understood and
              contacted — a single, clean profile link that represents
              everything about you.
            </span>
          </motion.p>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            href="/signup"
            className="font-medium text-[#FEFEFE] bg-brand h-12 rounded-[8px] px-4 cursor-pointer flex items-center justify-center"
          >
            Create Your Profile Now
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
