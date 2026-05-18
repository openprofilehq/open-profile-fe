"use client";

import Link from "next/link";
import { useTransition, useState } from "react";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

const accountSettings = [
  {
    title: "Personal Information",
    description:
      "Edit your photo, name, username, bio, and contact information.",
    action: "Edit profile",
    href: "/dashboard/profile-builder",
  },
  {
    title: "Email Address",
    description: "Manage the email connected to your account.",
    action: "Update email",
    href: "/dashboard/settings/email",
  },
  {
    title: "Password & Security",
    description: "Change your password and keep your account secure.",
    action: "Update password",
    href: "/dashboard/settings/security",
  },
];

const profilePreferences = [
  {
    title: "Profile Preview Settings",
    description: "Adjust how your profile appears before publishing.",
    action: "Preview profile",
    href: "/dashboard/profile-builder",
  },
  {
    title: "Personal Customization",
    description: "Customize your profile appearance, theme, and layout.",
    action: "Customize profile",
    href: "/dashboard/profile-builder",
  },
];

const nextBillingDate: string | null = null;

export default function SettingsContent() {
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isPending, startTransition] = useTransition();

  const billingDateLabel = nextBillingDate
    ? new Date(nextBillingDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not available";

  function handleLogout() {
    startTransition(() => {
      void logout();
    });
  }

  return (
    <div className="mx-auto w-full max-w-[1030px]">
      <div>
        <h1 className="text-3xl font-bold text-[#101828]">Settings</h1>
        <p className="mt-1 text-[#454545]">
          Manage your account, profile preferences, and personal settings.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_296px]">
        <div className="flex flex-col gap-4">
          <section className="rounded-[10px] border border-[#D9E2EA] bg-white p-6">
            <h2 className="text-xl font-bold text-[#050505]">
              Account Settings
            </h2>

            <div className="mt-5 flex flex-col">
              {accountSettings.map((item, index) => (
                <div
                  key={item.title}
                  className={`flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between ${
                    index !== accountSettings.length - 1
                      ? "border-b border-[#EDEDED]"
                      : ""
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-[#050505]">{item.title}</h3>
                    <p className="mt-1 text-sm text-[#747474]">
                      {item.description}
                    </p>
                  </div>

                  <Link
                    href={item.href}
                    className="inline-flex h-10 items-center justify-center rounded-[8px] border border-[#EDEDED] px-4 font-semibold text-[#050505]"
                  >
                    {item.action}
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[10px] border border-[#D9E2EA] bg-white p-6">
            <h2 className="text-xl font-bold text-[#050505]">
              Profile Preferences
            </h2>

            <div className="mt-5 flex flex-col">
              <div className="flex items-center justify-between border-b border-[#EDEDED] py-4">
                <div>
                  <h3 className="font-bold text-[#050505]">
                    Profile visibility
                  </h3>
                  <p className="mt-1 text-sm text-[#747474]">
                    Control whether your profile is public or private.
                  </p>
                </div>

                <button
                  type="button"
                  aria-pressed={isProfileVisible}
                  aria-label={
                    isProfileVisible
                      ? "Make profile private"
                      : "Make profile public"
                  }
                  onClick={() => setIsProfileVisible((value) => !value)}
                  className={`relative h-7 w-12 rounded-full transition-colors ${
                    isProfileVisible ? "bg-[#087583]" : "bg-[#E5EAF0]"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
                      isProfileVisible ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {profilePreferences.map((item, index) => (
                <div
                  key={item.title}
                  className={`flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between ${
                    index !== profilePreferences.length - 1
                      ? "border-b border-[#EDEDED]"
                      : ""
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-[#050505]">{item.title}</h3>
                    <p className="mt-1 text-sm text-[#747474]">
                      {item.description}
                    </p>
                  </div>

                  <Link
                    href={item.href}
                    className="inline-flex h-10 items-center justify-center rounded-[8px] border border-[#EDEDED] px-4 font-semibold text-[#050505]"
                  >
                    {item.action}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-4">
          <section className="rounded-[10px] border border-[#EDEDED] bg-white p-5">
            <h2 className="text-xl font-bold text-[#050505]">
              Payment Information
            </h2>
            <p className="mt-1 text-sm text-[#454545]">
              Manage your subscription, payment details, and billing
              information.
            </p>

            <div className="mt-4 rounded-[8px] bg-[#F5F5F5] p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#454545] uppercase">Current Plan</p>
                <span className="rounded-full bg-[#E9FFE9] px-2 py-1 text-[10px] text-[#087A32]">
                  PRO
                </span>
              </div>

              <p className="mt-3 font-bold text-[#050505]">$29.00 / Month</p>
              <p className="mt-2 text-xs text-[#747474]">
                Next billing date: {billingDateLabel}
              </p>
            </div>

            <Link
              href="/dashboard/settings/billing"
              className="mx-auto mt-3 flex h-11 w-full items-center justify-center rounded-[8px] bg-[#087583] font-semibold text-white md:max-w-[260px]"
            >
              Manage billing
            </Link>
          </section>

          <section className="rounded-[10px] border border-[#EDEDED] bg-white p-5">
            <h2 className="text-xl font-bold text-[#050505]">
              Account Actions
            </h2>

            <div className="mt-4 flex items-start gap-3">
              <LogOut className="mt-1 text-[#D92D20]" size={22} />
              <div>
                <p className="font-bold text-[#050505]">Log Out</p>
                <p className="text-xs text-[#747474]">
                  Sign out from your account on this device.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={isPending}
              onClick={handleLogout}
              className="mx-auto mt-4 block h-10 w-full rounded-[8px] border border-[#F04438] text-[#D92D20] disabled:cursor-not-allowed disabled:opacity-60 md:max-w-[260px]"
            >
              {isPending ? "Logging out..." : "Log out"}
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}
