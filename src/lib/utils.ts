import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function maskEmail(email: string) {
  const [name, domain] = email.split("@");

  return `${name.slice(0, 2)}******@${domain}`;
}

export function isSafeReturnTo(value: string | null): value is string {
  if (!value || !value.startsWith("/")) return false;
  return value[1] !== "/" && value[1] !== "\\";
}
