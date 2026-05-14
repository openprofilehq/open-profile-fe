"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useDebounce } from "@/hooks/useDebounce";
import ProgressBar from "../profile/ProgressBar";
import CreateProfileLink from "./CreateProfileLink";
import CreateProfileInfo from "./CreateProfileInfo";
import ProfileLinkSuccess from "./ProfileLinkSuccess";
import { checkUsername } from "@/api/profile/profile.service";
import { createProfileOption } from "@/api/profile/profile.options";
import { isApiError } from "@/api/base";

type UsernameStatus =
  | ""
  | "available"
  | "taken"
  | "invalid"
  | "checking"
  | "error";

export default function CreateProfileForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [fullName, setFullName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("");
  const debouncedUsername = useDebounce(username, 500);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!debouncedUsername) {
      Promise.resolve().then(() => setUsernameStatus(""));
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    Promise.resolve().then(() => setUsernameStatus("checking"));

    checkUsername(debouncedUsername, controller.signal)
      .then((res) => setUsernameStatus(res.available ? "available" : "taken"))
      .catch((err) => {
        if (err?.name === "CanceledError" || err?.name === "AbortError") return;
        if (isApiError(err) && err.message?.toLowerCase().includes("format")) {
          setUsernameStatus("invalid");
        } else {
          setUsernameStatus("error");
        }
      });
  }, [debouncedUsername]);

  const availableLabel =
    usernameStatus === "available"
      ? "This username is available"
      : usernameStatus === "taken"
        ? "This username is not available"
        : usernameStatus === "invalid"
          ? "Invalid username format"
          : usernameStatus === "checking"
            ? "Checking…"
            : usernameStatus === "error"
              ? "Could not check availability"
              : "";

  const createProfile = useMutation({
    ...createProfileOption,
    onSuccess: () => setCurrentStep(3),
    onError: (err) =>
      toast.error(isApiError(err) ? err.message : "Failed to create profile."),
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (currentStep !== 2) return;
    createProfile.mutate({
      username,
      fullName,
      bio,
      // only pass photoUrl if it's a real URL (not a blob preview)
      ...(photoUrl && photoUrl.startsWith("http") ? { photoUrl } : {}),
    });
  }

  return (
    <>
      <ProgressBar currentStep={currentStep} />

      <AuthLayout>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {currentStep === 1 && (
            <CreateProfileLink
              username={username}
              available={availableLabel}
              onUpdateUsername={(e) => setUsername(e.target.value)}
              onUpdateStep={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <CreateProfileInfo
              bio={bio}
              fullName={fullName}
              onUpdateBio={(e) => setBio(e.target.value)}
              onUpdateFullName={(e) => setFullName(e.target.value)}
              onUpdateStep={() =>
                handleSubmit({
                  preventDefault: () => {},
                } as React.FormEvent<HTMLFormElement>)
              }
              isPending={createProfile.isPending}
              photoUrl={photoUrl}
              onPhotoUrl={setPhotoUrl}
            />
          )}

          {currentStep === 3 && (
            <ProfileLinkSuccess
              username={username}
              bio={bio}
              photoUrl={photoUrl || undefined}
              onContinue={() => router.replace("/dashboard")}
            />
          )}
        </form>
      </AuthLayout>
    </>
  );
}
