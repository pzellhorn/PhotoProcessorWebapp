import { httpClient } from "./httpClient";

export const videoApi = {
  upload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return httpClient.postForm("/api/Video/Upload", formData);
  },

  getRenditions: (mediaId) =>
    httpClient.get("/api/Video/GetRenditions", { mediaId }),

  streamUrl: (mediaId, assetPath) =>
    httpClient.url(`/api/Video/Stream/${mediaId}/${assetPath}`),
};
