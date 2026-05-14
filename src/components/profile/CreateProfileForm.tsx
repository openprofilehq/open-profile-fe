"use client";

import React, { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useDebounce } from "@/hooks/useDebounce";
import ProgressBar from "../profile/ProgressBar";
import CreateProfileLink from "./CreateProfileLink";
import CreateProfileInfo from "./CreateProfileInfo";
import ProfileLinkSuccess from "./ProfileLinkSuccess";

export default function CreateProfileForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const debouncedInput = useDebounce(username, 500);

  const validLinks = ["oyinkan", "delbie", "solari"];
  const available =
    debouncedInput === ""
      ? ""
      : validLinks.includes(debouncedInput)
        ? "This username is available"
        : "This username is not available";

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <>
      <ProgressBar currentStep={currentStep} />

      <AuthLayout>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {currentStep === 1 && (
            <CreateProfileLink
              username={username}
              available={available}
              onUpdateUsername={(e) => setUsername(e.target.value)}
              onUpdateStep={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <CreateProfileInfo
              bio={bio}
              onUpdateBio={(e) => setBio(e.target.value)}
              onUpdateStep={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 3 && (
            <ProfileLinkSuccess username={username} bio={bio} />
          )}
        </form>
      </AuthLayout>
    </>
  );
}
