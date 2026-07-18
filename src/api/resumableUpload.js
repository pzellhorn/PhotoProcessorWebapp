import { uploadApi, sha256Hex } from "./uploadApi";

export const RESUMABLE_THRESHOLD = 8 * 1024 * 1024;
const PRE_HASH_LIMIT = 64 * 1024 * 1024;

const MAX_RETRIES = 5;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function uploadResumable(file, onProgress) {
  const contentHash =
    file.size <= PRE_HASH_LIMIT ? await sha256Hex(file) : undefined;

  const created = await uploadApi.create(file.name, file.size, contentHash);

  // Server already has these bytes - nothing to send.
  if (created.duplicate) {
    onProgress?.(file.size, file.size);
    return { mediaId: created.mediaId, duplicate: true };
  }

  const { uploadId, chunkSize } = created;
  let offset = created.receivedBytes ?? 0;
  let attempts = 0;

  onProgress?.(offset, file.size);

  while (offset < file.size) {
    const blob = file.slice(offset, Math.min(offset + chunkSize, file.size));

    try {
      const status = await uploadApi.chunk(uploadId, blob, offset, file.size);
      offset = status.receivedBytes;
      attempts = 0;
      onProgress?.(offset, file.size);

      if (status.complete) {
        return { mediaId: status.mediaId, duplicate: status.duplicate };
      }
    } catch (error) {
      attempts += 1;
      if (attempts > MAX_RETRIES) throw error;

      await delay(500 * attempts);

      // Ask the server where it actually got to and carry on from there.
      const status = await uploadApi.status(uploadId);
      offset = status.receivedBytes;
      onProgress?.(offset, file.size);

      if (status.complete) {
        return { mediaId: status.mediaId, duplicate: status.duplicate };
      }
    }
  }

  const final = await uploadApi.status(uploadId);
  return { mediaId: final.mediaId, duplicate: final.duplicate };
}
