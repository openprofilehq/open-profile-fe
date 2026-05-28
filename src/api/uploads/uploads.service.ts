import { callApi } from "@/api/base";

export type UploadCategory = "profiles" | "projects" | "portfolio";

export const SUPPORTED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

export const SUPPORTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const SUPPORTED_IMAGE_ACCEPT =
  ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp";

export const SUPPORTED_IMAGE_HELPER_TEXT =
  "Supported formats: JPG, JPEG, PNG, or WEBP.";

export const UNSUPPORTED_IMAGE_MESSAGE =
  "Unsupported image format. Please upload a JPG, PNG, or WEBP file.";

export function isSupportedImageFile(file: File) {
  const fileName = file.name.toLowerCase();

  const hasSupportedExtension = SUPPORTED_IMAGE_EXTENSIONS.some((extension) =>
    fileName.endsWith(extension)
  );

  const hasSupportedMimeType = SUPPORTED_IMAGE_MIME_TYPES.includes(file.type);

  return hasSupportedExtension && hasSupportedMimeType;
}

export function uploadImage(file: File, category: UploadCategory) {
  const form = new FormData();
  form.append("file", file);

  return callApi<{ url: string; path: string }>({
    url: `/uploads/${category}/image-url`,
    method: "POST",
    data: form,
  });
}
