interface ProjectImageUploadUrlResponse {
  uploadUrl: string;
  expectedUrl: string;
}

export async function uploadProjectImage(
  file: File,
  onProgress?: (pct: number) => void,
  signal?: AbortSignal
): Promise<string> {
  // Request signed upload URL from local proxy route to ensure same-origin
  const res = await fetch("/api/v1/uploads/project-image-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, fileType: file.type, fileSize: file.size }),
    signal,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to request upload URL: ${res.status} ${res.statusText} - ${text}`);
  }

  const { uploadUrl, expectedUrl } = (await res.json()) as ProjectImageUploadUrlResponse;

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const TIMEOUT_MS = 60_000;
    let settled = false;

    const cleanup = () => {
      if (signal && onAbort) signal.removeEventListener("abort", onAbort);
    };

    const onAbort = () => {
      if (settled) return;
      settled = true;
      try {
        xhr.abort();
      } catch (e) {
        // ignore
      }
      reject(new Error("Upload cancelled"));
    };

    if (signal) signal.addEventListener("abort", onAbort);

    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.timeout = TIMEOUT_MS;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (settled) return;
      settled = true;
      cleanup();
      xhr.status < 300 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`));
    };

    xhr.onerror = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error("Network error during upload"));
    };

    xhr.ontimeout = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error("Upload timed out. Please try again."));
    };

    xhr.send(file);
  });

  return expectedUrl;
}