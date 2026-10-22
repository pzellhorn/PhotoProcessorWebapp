import { ApiError, httpClient } from "./httpClient";

export const flowerApi = {
  getForMedia: async (mediaId) => {
    try {
      return await httpClient.get("/api/Flower/GetForMedia", { mediaId });
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },
};
