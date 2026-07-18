import { httpClient } from "./httpClient";

export const searchApi = {
  searchByText: (text, count = 24) =>
    httpClient.get("/api/Search/SearchByText", { text, count }),
};
