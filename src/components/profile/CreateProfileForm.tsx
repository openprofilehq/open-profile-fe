"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useDebounce } from "@/hooks/useDebounce";
import ProgressBar from "../profile/ProgressBar";
import CreateProfileLink from "./CreateProfileLink";
import CreateProfileInfo from "./CreateProfileInfo";
import ProfileLinkSuccess from "./ProfileLinkSuccess";

export default function CreateProfileForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileLink, setProfileLink] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const debouncedInput = useDebounce(profileLink, 500);

  const validLinks = ["oyinkan", "delbie", "solari"];
  const available =
    debouncedInput === ""
      ? ""
      : validLinks.includes(debouncedInput)
        ? "Available"
        : "Not available";

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <>
      <ProgressBar
        currentStep={currentStep}
        onUpdateStep={() => setCurrentStep(3)}
      />

      <AuthLayout>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {currentStep === 1 && (
            <CreateProfileLink
              profileLink={profileLink}
              available={available}
              onUpdateLink={(e) => setProfileLink(e.target.value)}
              onUpdateStep={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <CreateProfileInfo
              fullName={fullName}
              bio={bio}
              onUpdateFullName={(e) => setFullName(e.target.value)}
              onUpdateBio={(e) => setBio(e.target.value)}
              onUpdateStep={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 3 && (
            <ProfileLinkSuccess profileLink={profileLink} />
          )}
        </form>
      </AuthLayout>
    </>
  );
}
