import { callApi } from "@/api/base";

interface ProjectImageUploadUrlResponse {
  uploadUrl: string;
  expectedUrl: string;
}

export async function uploadProjectImage(
  file: File,
  onProgress?: (pct: number) => void,
  signal?: AbortSignal
): Promise<string> {
  // Use callApi so baseURL + auth cookies are handled automatically
  const { uploadUrl, expectedUrl } =
    await callApi<ProjectImageUploadUrlResponse>({
      url: "/uploads/project-image-url",
      method: "POST",
      data: {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      },
      signal,
    });

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const TIMEOUT_MS = 60_000;

    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.timeout = TIMEOUT_MS;

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
    xhr.ontimeout = () => reject(new Error("Upload timed out. Please try again."));

    signal?.addEventListener("abort", () => {
      xhr.abort();
      reject(new Error("Upload cancelled"));
    });

    xhr.send(file);
  });

  return expectedUrl;
}