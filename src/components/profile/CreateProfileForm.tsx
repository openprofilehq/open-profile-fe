"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useDebounce } from "@/hooks/useDebounce";
import ProgressBar from "../profile/ProgressBar";
import CreateProfileLink from "./CreateProfileLink";
import CreateProfileInfo from "./CreateProfileInfo";
import ProfileLinkSuccess from "./ProfileLinkSuccess";
import { createProfile } from "@/api/profile/profile.service";
import { isApiError } from "@/api/base";

export default function CreateProfileForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const debouncedInput = useDebounce(username, 500);

  const createProfileMutation = useMutation({
    mutationFn: createProfile,
    onSuccess: () => {
      setCurrentStep(3);
    },
    onError: (err) => {
      toast.error(isApiError(err) ? err.message : "Failed to create profile.");
    },
  });

  // TODO: Replace this mock check with a real API check
  const available = debouncedInput === "" ? "" : "This username is available";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  const handleCreateProfile = () => {
    createProfileMutation.mutate({
      username,
      bio,
      // Provide fallback mock values for required fields not yet collected by the UI
      fullName: "User",
      photoUrl: "https://example.com/photo.jpg",
    });
  };

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
              onUpdateStep={handleCreateProfile}
              isPending={createProfileMutation.isPending}
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
