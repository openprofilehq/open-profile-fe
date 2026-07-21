import { ChangeEvent } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UsernameStatus = "available" | "taken" | "error" | "checking" | "";

type CreateProfileLinkProps = {
  username: string;
  available: string;
  status: UsernameStatus;
  onUpdateUsername: (e: ChangeEvent<HTMLInputElement>) => void;
  onUpdateStep: () => void;
};

export default function CreateProfileLink({
  username,
  available,
  status,
  onUpdateUsername,
  onUpdateStep,
}: CreateProfileLinkProps) {
  const isChecking = status === "checking";
  const isAvailable = status === "available";
  const isUnavailable = status === "taken" || status === "error";

  const canContinue = username.length > 0 && isAvailable;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-1 flex-col justify-center"
    >
      <div className="mb-8 text-center">
        <h1 className="text-brand text-3xl font-bold">Create Your Link</h1>

        <p className="text-secondary-text mx-auto mt-3 max-w-[520px]">
          Your account has been successfully created. You can now create your
          own unique link with your name
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-[560px] flex-col gap-3">
        <label htmlFor="username" className="text-secondary-text font-bold">
          Enter Name
        </label>

        <div className="flex flex-col gap-2 md:flex-row md:gap-3">
          <div className="bg-hover-bg text-primary-text flex h-[56px] items-center rounded-[8px] px-4 text-lg md:w-[170px]">
            open.profile/
          </div>

          <Input
            type="text"
            id="username"
            name="profile-username"
            value={username}
            onChange={onUpdateUsername}
            placeholder="Enter username"
            className={`bg-primary-bg h-[56px] flex-1 rounded-[8px] px-4 text-lg shadow-none ${
              isUnavailable
                ? "border-negative-text text-negative-text"
                : isAvailable
                  ? "border-input-b text-primary-text"
                  : "border-input-b text-primary-text"
            }`}
          />
        </div>

        {available && (
          <span
            className={`text-sm ${
              isUnavailable
                ? "text-negative-text"
                : isChecking
                  ? "text-secondary-text"
                  : "text-positive-text"
            }`}
          >
            {available}
          </span>
        )}

        <Button
          type="button"
          className={`mt-5 h-13 w-full rounded-[10px] text-[16px] font-medium shadow-none transition-colors ${
            canContinue
              ? "bg-brand-hover-bg text-white"
              : "bg-brand-hover-bg/50 cursor-not-allowed text-white"
          }`}
          onClick={onUpdateStep}
          disabled={!canContinue}
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
}
