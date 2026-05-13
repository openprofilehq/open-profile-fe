import { ChangeEvent } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type createProfileLinkProps = {
  profileLink: string;
  available: string;
  onUpdateLink: (e: ChangeEvent<HTMLInputElement>) => void;
  onUpdateStep: () => void;
};

// onValidate: (val: string) => void;

export default function CreateProfileLink({
  profileLink,
  available,
  onUpdateLink,
  onUpdateStep,
}: createProfileLinkProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="mb-1 text-center">
        <h1 className="text-primary text-3xl font-bold">Create Your Link</h1>

        <p className="mt-1 text-[#454545]">
          Your account has been successfully created. You can now create your
          own unique link with you name
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-bold text-[#454545]">Enter Name</label>

        <Input
          type="text"
          name="profile-link"
          value={profileLink}
          onChange={onUpdateLink}
          placeholder="open.profile/"
          className={`bg-[#FAFAFA] py-6 ${available === "Not available" ? "border-[#FF4D4D]" : "border-[#EDEDED]"} placeholder:text-lg`}
        />

        <span
          className={`${available === "Not available" ? "text-[#FF4D4D]" : "text-[#145B33]"} text-sm`}
        >
          {available}
        </span>

        <Button
          type="button"
          className={`mt-4 h-13 w-full rounded-[10px] bg-[#087583] text-[16px] font-medium shadow-none transition-colors ${profileLink.length === 0 || available === "Not available" ? "cursor-not-allowed" : "cursor-pointer"}`}
          onClick={onUpdateStep}
          disabled={profileLink.length === 0 || available === "Not available"}
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
}
