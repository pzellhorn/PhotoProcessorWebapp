import { httpClient } from "./httpClient";

export const progressApi = {
  getProgress: () => httpClient.get("/api/Progress/GetProgress"),

  backfill: (jobType) => httpClient.post(`/api/Progress/Backfill?jobType=${jobType}`),
};
