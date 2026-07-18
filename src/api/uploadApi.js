import { httpClient } from "./httpClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const uploadApi = {
  create: (fileName, totalBytes, contentHash) =>
    httpClient.post("/api/Upload/Create", {
      fileName,
      totalBytes,
      contentHash,
    }),

  status: (uploadId) => httpClient.get("/api/Upload/Status", { uploadId }),

  abort: (uploadId) => httpClient.delete("/api/Upload/Abort", { uploadId }),

  chunk: async (uploadId, blob, offset, totalBytes) => {
    const end = offset + blob.size - 1;
    const response = await fetch(
      `${API_BASE_URL}/api/Upload/Chunk?uploadId=${uploadId}`,
      {
        method: "PUT",
        headers: {
          "Content-Range": `bytes ${offset}-${end}/${totalBytes}`,
          "Content-Type": "application/octet-stream",
        },
        body: blob,
      },
    );

    if (!response.ok) {
      throw new Error(
        `Chunk upload failed (${response.status}): ${await response.text()}`,
      );
    }

    return response.json();
  },
};

export async function sha256Hex(file) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    await file.arrayBuffer(),
  );
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
