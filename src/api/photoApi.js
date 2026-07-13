import { httpClient } from "./httpClient";

export const photoApi = {
  upload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return httpClient.postForm("/api/Photo/Upload", formData);
  },

  downloadUrl: (mediaId) => httpClient.url("/api/Photo/Download", { mediaId }),

  thumbnailUrl: (mediaId, width = 320) =>
    httpClient.url("/api/Photo/Thumbnail", { mediaId, width }),

  faceThumbnailUrl: (fingerprintId, width = 160) =>
    httpClient.url("/api/Photo/GetFaceThumbnail", { fingerprintId, width }),

  delete: (mediaId) => httpClient.delete("/api/Photo/Delete", { mediaId }),
};
