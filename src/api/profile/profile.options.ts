import { mutationOptions } from "@tanstack/react-query";
import { createProfile } from "./profile.service";

export const createProfileOption = mutationOptions({
  mutationKey: ["profile", "create"],
  mutationFn: createProfile,
});
