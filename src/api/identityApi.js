import { httpClient } from "./httpClient";

export const identityApi = {
  listIdentities: () => httpClient.get("/api/Identity/ListIdentities"),

  getFacesForTag: (tagId) =>
    httpClient.get("/api/Identity/GetFacesForTag", { tagId }),

  merge: (sourceTagId, targetTagId) =>
    httpClient.post("/api/Identity/Merge", { sourceTagId, targetTagId }),
};
