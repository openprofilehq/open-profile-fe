import { ChangeEvent } from "react";
import { motion } from "motion/react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CreateProfileInfoProps = {
  fullName: string;
  bio: string;
  onUpdateFullName: (e: ChangeEvent<HTMLInputElement>) => void;
  onUpdateBio: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onUpdateStep: () => void;
};

export default function CreateProfileInfo({
  fullName,
  bio,
  onUpdateFullName,
  onUpdateBio,
  onUpdateStep,
}: CreateProfileInfoProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mb-1 text-center">
          <h1 className="text-primary text-3xl font-bold">
            Tell us about yourself
          </h1>

          <p className="my-2 text-[#454545]">
            This is what people will see when they search you
          </p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="border-brand mx-auto flex h-16 w-16 items-center justify-center rounded-full border-3 border-dashed">
            <Camera className="text-brand" />
          </div>

          <Button
            type="button"
            className="mx-auto mt-5 h-13 w-40 rounded-[10px] text-center text-lg font-normal shadow-none transition-colors"
          >
            Upload a Photo
          </Button>
        </div>

        <div className="mt-16 flex flex-col gap-1.5">
          <div>
            <label className="mb-1 inline-block font-bold text-[#454545]">
              Full Name
            </label>

            <Input
              type="text"
              name="fullname"
              value={fullName}
              onChange={onUpdateFullName}
              placeholder="Enter your name"
              className="bg-white py-6 placeholder:text-lg"
            />
          </div>

          <div className="mt-4">
            <label className="mb-1 inline-block font-bold text-[#454545]">
              Bio
            </label>

            <textarea
              className="w-full resize-none rounded-lg border-2 border-[#ededed] bg-white p-3"
              onChange={onUpdateBio}
              rows={5}
              placeholder="Product designer & side project builder based in lagos"
            >
              {bio}
            </textarea>
          </div>

          <Button
            type="button"
            className="mt-4 h-13 w-full rounded-[10px] bg-[#087583] text-[16px] font-medium shadow-none transition-colors"
            onClick={onUpdateStep}
          >
            Continue
          </Button>
        </div>
      </motion.div>
    </>
  );
}
