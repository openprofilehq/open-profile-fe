export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const IMAGE_MAX_MB = 5;
export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
export const IMAGE_HELPER_TEXT = `JPG, PNG, WebP or GIF. Max size: ${IMAGE_MAX_MB} MB.`;

const ALLOWED_TYPES = new Set(IMAGE_ACCEPT.split(","));

export function validateImageFile(file: File): string {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Only JPG, PNG, WebP or GIF images are allowed.";
  }
  if (file.size > IMAGE_MAX_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return `This image is ${sizeMb} MB. Images must be ${IMAGE_MAX_MB} MB or smaller.`;
  }
  return "";
}

export function isLocalImageUrl(value?: string | null): boolean {
  return (
    typeof value === "string" &&
    (value.startsWith("data:") || value.startsWith("blob:"))
  );
}
