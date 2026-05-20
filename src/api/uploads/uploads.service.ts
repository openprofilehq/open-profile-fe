import { callApi } from "@/api/base";

interface ProjectImageUploadUrlResponse {
  uploadUrl: string;
  expectedUrl: string;
}

export async function getProjectImageUploadUrl(file: File): Promise<ProjectImageUploadUrlResponse> {
  return callApi<ProjectImageUploadUrlResponse>({
    url: "/uploads/project-image-url",
    method: "POST",
    data: {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    },
  });
}

export async function uploadToCloudinary(
  uploadUrl: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () =>
      xhr.status < 300
        ? resolve()
        : reject(new Error(`Upload failed: ${xhr.status}`));
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(file);
  });
}