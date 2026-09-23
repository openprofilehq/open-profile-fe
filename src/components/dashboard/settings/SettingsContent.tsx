"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { dashboardProfileOption } from "@/api/profile/profile.options";
import {
  billingInfoQueryOptions,
  updateVisibilityOption,
  userSettingsQueryOptions,
} from "@/api/users/users.options";
import { isApiError } from "@/api/base";
import { ROUTES } from "@/constants/routes";
import { getProfileUrl } from "@/utils/profile";
import ChangePasswordDialog from "./ChangePasswordDialog";
import UpdateEmailDialog from "./UpdateEmailDialog";

const ACTION_CLASS =
  "inline-flex h-10 items-center justify-center rounded-[8px] border border-[#EDEDED] px-4 font-semibold text-[#050505] disabled:cursor-not-allowed disabled:opacity-50";

export default function SettingsContent() {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const queryClient = useQueryClient();

  const dashboardProfile = useQuery(dashboardProfileOption());
  const settings = useQuery(userSettingsQueryOptions);
  const billing = useQuery(billingInfoQueryOptions);

  const profile = dashboardProfile.data;
  const isGoogleAccount = settings.data?.authProvider === "google";
  const profileVisibility = profile?.isPublic ?? false;

  const visibilityMutation = useMutation({
    ...updateVisibilityOption,
    onSuccess: (data) => {
      toast.success(
        data.isPublic
          ? "Your profile is now public."
          : "Your profile is now private."
      );
      queryClient.invalidateQueries({
        queryKey: dashboardProfileOption().queryKey,
      });
    },
    onError: (err) =>
      toast.error(
        isApiError(err) ? err.message : "Could not update profile visibility."
      ),
  });

  const planName = billing.data?.plan ?? "Free";
  const billingDateLabel = billing.data?.nextBillingDate
    ? new Date(billing.data.nextBillingDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not available";

  const accountSettings = [
    {
      title: "Personal Information",
      description:
        "Edit your photo, name, username, bio, and contact information.",
      action: "Edit profile",
      href: ROUTES.dashboard.profileBuilder,
    },
    {
      title: "Email Address",
      description: isGoogleAccount
        ? "Your email is managed by Google and cannot be changed here."
        : "Manage the email connected to your account.",
      action: "Update email",
      onClick: () => setEmailOpen(true),
      disabled: isGoogleAccount,
    },
    {
      title: "Password & Security",
      description: isGoogleAccount
        ? "You sign in with Google, so there is no password to change."
        : "Change your password and keep your account secure.",
      action: "Update password",
      onClick: () => setPasswordOpen(true),
      disabled: isGoogleAccount,
    },
  ];

  const profilePreferences = [
    {
      title: "Profile Preview Settings",
      description: "See your profile exactly as visitors do.",
      action: "Preview profile",
      href: profile?.username ? getProfileUrl(profile.username) : undefined,
      external: true,
    },
    {
      title: "Personal Customization",
      description: "Customize your profile appearance, theme, and layout.",
      action: "Customize profile",
      href: ROUTES.dashboard.profileBuilder,
    },
  ];

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

            {settings.data?.email && (
              <p className="mt-1 text-sm text-[#747474]">
                Signed in as {settings.data.email}
              </p>
            )}

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

                  {item.href ? (
                    <Link href={item.href} className={ACTION_CLASS}>
                      {item.action}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={item.onClick}
                      disabled={item.disabled}
                      className={ACTION_CLASS}
                    >
                      {item.action}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[10px] border border-[#D9E2EA] bg-white p-6">
            <h2 className="text-xl font-bold text-[#050505]">
              Profile Preferences
            </h2>

            <div className="mt-5 flex flex-col">
              <div className="flex items-center justify-between gap-4 border-b border-[#EDEDED] py-4">
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
                  aria-pressed={profileVisibility}
                  aria-label={
                    profileVisibility
                      ? "Make profile private"
                      : "Make profile public"
                  }
                  disabled={visibilityMutation.isPending}
                  onClick={() =>
                    visibilityMutation.mutate({ isPublic: !profileVisibility })
                  }
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-60 ${
                    profileVisibility ? "bg-[#087583]" : "bg-[#E5EAF0]"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
                      profileVisibility ? "left-6" : "left-1"
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

                  {item.href ? (
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className={ACTION_CLASS}
                    >
                      {item.action}
                    </Link>
                  ) : (
                    <button type="button" disabled className={ACTION_CLASS}>
                      {item.action}
                    </button>
                  )}
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
                  {planName}
                </span>
              </div>

              <p className="mt-3 font-bold text-[#050505]">
                {planName === "Free" ? "No charge" : "See your plan"}
              </p>
              <p className="mt-2 text-xs text-[#747474]">
                Next billing date: {billingDateLabel}
              </p>
            </div>

            <Link
              href={ROUTES.comingSoon}
              className="mx-auto mt-3 flex h-11 w-full items-center justify-center rounded-[8px] bg-[#087583] font-semibold text-white md:max-w-[260px]"
            >
              Manage billing
            </Link>
          </section>
        </aside>
      </div>

      <ChangePasswordDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
      />
      <UpdateEmailDialog
        open={emailOpen}
        onOpenChange={setEmailOpen}
        currentEmail={settings.data?.email}
      />
    </div>
  );
}
