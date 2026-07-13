import { httpClient } from "./httpClient";

export const fingerprintApi = {
  searchByFingerprint: (fingerprintId, count = 10) =>
    httpClient.get("/api/Fingerprint/SearchByFingerprint", {
      fingerprintId,
      count,
    }),
};
