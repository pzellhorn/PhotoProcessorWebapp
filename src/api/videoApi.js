import { httpClient } from "./httpClient";

export const videoApi = {
  upload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return httpClient.postForm("/api/Video/Upload", formData);
  },
};
