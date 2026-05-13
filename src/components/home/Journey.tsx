"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Step {
  id: string;
  title: string;
  titleColor: "teal" | "dark";
  description: string;
  icon: string;
  ghostIcon: string;
}

const steps: Step[] = [
  {
    id: "create-profile",
    ghostIcon: "/journey/step01.svg",
    title: "Create Your Profile",
    titleColor: "teal",
    description:
      "Sign up in seconds with email, Google, or LinkedIn. Craft your bio, and link your work.",
    icon: "/journey/User.svg",
  },
  {
    id: "verify-identity",
    ghostIcon: "/journey/step02.svg",
    title: "Verify Your Identity",
    titleColor: "dark",
    description:
      "Verify your email and connect social accounts. Build credibility with verification badges.",
    icon: "/journey/check.svg",
  },
  {
    id: "share-link",
    ghostIcon: "/journey/step03.svg",
    title: "Share Your Link And Get Discovered",
    titleColor: "dark",
    description:
      "Share your link, appear in searches, and grow your network. Not found? Invite them to join.",
    icon: "/journey/cross.svg",
  },
];

function MobileStepCard({ step }: { step: Step }) {
  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      {/* Ghost Number */}
      <Image
        src={step.ghostIcon}
        alt="step number"
        width={140}
        height={140}
        className="absolute right-0 top-[-30px] opacity-100"
      />

      {/* Icon */}
      <div className="relative z-20 mb-8">
        <Image
          src={step.icon}
          alt="step icon"
          width={78}
          height={78}
          className="object-contain"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3
          className={`
            text-[32px]
            font-semisemibold
            leading-[1.1]
            tracking-[-0.03em]
            pb-4
            ${step.titleColor === "teal" ? "text-[#00798C]" : "text-[#202020]"}
          `}
        >
          {step.title}
        </h3>

        <p className="mt-5 text-[17px] leading-[32px] text-[#6B7280]">
          {step.description}
        </p>
      </div>
    </div>
  );
}

export function Journey() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FBFBFB] py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          {/* Badge */}
          <div className="rounded-[24px] bg-[#F2FDFE] pl-3.5 pr-5.5 w-fit flex items-center gap-1 mx-auto h-7.5">
            <Image
              src="/target_assets/icon-flash.svg"
              alt=""
              width={16}
              height={16}
            />
            <p className="font-medium text-[12px] leading-4 text-brand font-sfpror">
              Your Journey Starts Here
            </p>
          </div>

          {/* Heading */}
          <h2
            className="
              mt-6
              max-w-[900px]
              text-[34px]
              md:text-[40px]
              font-semibold
              leading-[1.05]
              tracking-[-0.04em]
              text-[#111111]
            "
          >
            Create the profile people should find first
          </h2>
        </motion.div>

        {/* DESKTOP */}
        <div className="relative hidden lg:block lg:h-[480px] xl:h-[560px]">
          {/* Wave */}
          <div
            className="
              absolute
              left-1/2
              lg:top-[160px]
              xl:top-[180px]
              -translate-x-1/2
              w-[85%]
              xl:w-[75%]
              max-w-[1150px]
              min-w-[900px]
            "
          >
            <Image
              src="/journey/Wave.svg"
              alt="wave"
              width={1150}
              height={280}
              className="h-auto w-full"
              priority
            />
          </div>

          {/* STEP 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="
              absolute
              lg:left-[2%]
              xl:left-[4%]
              lg:top-[150px]
              xl:top-[170px]
              lg:w-[260px]
              xl:w-[320px]
            "
          >
            {/* Ghost */}
            <Image
              src={steps[0].ghostIcon}
              alt="step number"
              width={180}
              height={180}
              className="
                absolute
                lg:-top-[80px]
                xl:-top-[95px]
                lg:left-[-10px]
                xl:left-[0px]
                opacity-100
              "
            />

            {/* Icon */}
            <div
              className="
                absolute
                lg:-left-[20px]
                xl:left-[95px]
                lg:top-[125px]
                xl:top-[130px]
                z-20
              "
            >
              <Image
                src={steps[0].icon}
                alt="step icon"
                width={43}
                height={43}
              />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h3
                className="
                  lg:text-[28px]
                  xl:text-[32px]
                  font-semibold
                  leading-[1.05]
                  tracking-[-0.04em]
                  text-[#00798C]
                "
              >
                {steps[0].title}
              </h3>

              <p
                className="
                  mt-5
                  lg:text-[15px]
                  xl:text-[18px]
                  leading-[1.8]
                  xl:leading-[2]
                  text-[#6B7280]
                "
              >
                {steps[0].description}
              </p>
            </div>
          </motion.div>

          {/* STEP 2 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="
              absolute
              left-1/2
              lg:top-[340px]
              xl:top-[380px]
              lg:w-[300px]
              xl:w-[360px]
              -translate-x-1/2
            "
          >
            {/* Ghost */}
            <Image
              src={steps[1].ghostIcon}
              alt="step number"
              width={180}
              height={180}
              className="
                absolute
                lg:-top-[90px]
                xl:-top-[100px]
                lg:left-[220px]
                xl:left-[250px]
              "
            />

            {/* Icon */}
            <div
              className="
                absolute
                lg:-top-[210px]
                xl:-top-[230px]
                lg:left-[220px]
                xl:left-[250px]
                z-20
              "
            >
              <Image
                src={steps[1].icon}
                alt="step icon"
                width={78}
                height={78}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 lg:pl-[20px] xl:pl-[40px] pt-[10px]">
              <h3
                className="
                  lg:text-[28px]
                  xl:text-[32px]
                  font-semibold
                  leading-[1.05]
                  tracking-[-0.04em]
                  text-[#454545]
                "
              >
                {steps[1].title}
              </h3>

              <p
                className="
                  mt-5
                  lg:text-[15px]
                  xl:text-[18px]
                  leading-[1.8]
                  xl:leading-[2]
                  text-[#6B7280]
                "
              >
                {steps[1].description}
              </p>
            </div>
          </motion.div>

          {/* STEP 3 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="
              absolute
              lg:right-[1%]
              xl:right-[3%]
              lg:top-[310px]
              xl:top-[350px]
              lg:w-[280px]
              xl:w-[360px]
            "
          >
            {/* Ghost */}
            <Image
              src={steps[2].ghostIcon}
              alt="step number"
              width={180}
              height={180}
              className="
                absolute
                lg:-top-[40px]
                xl:-top-[50px]
                lg:-right-[30px]
                xl:-right-[40px]
              "
            />

            {/* Icon */}
            <div
              className="
                absolute
                lg:-top-[110px]
                xl:-top-[105px]
                lg:-right-[20px]
                xl:right-[90px]
                z-20
              "
            >
              <Image
                src={steps[2].icon}
                alt="step icon"
                width={78}
                height={78}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 lg:pt-[30px] xl:pt-[40px]">
              <h3
                className="
                  lg:text-[28px]
                  xl:text-[32px]
                  font-semibold
                  leading-[1.05]
                  tracking-[-0.04em]
                  text-[#202020]
                "
              >
                {steps[2].title}
              </h3>

              <p
                className="
                  mt-5
                  lg:text-[15px]
                  xl:text-[18px]
                  leading-[1.8]
                  xl:leading-[2]
                  text-[#6B7280]
                "
              >
                {steps[2].description}
              </p>
            </div>
          </motion.div>
        </div>

        {/* MOBILE */}
        <div className="mt-20 flex flex-col gap-24 lg:hidden">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.2,
              }}
            >
              <MobileStepCard step={step} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
