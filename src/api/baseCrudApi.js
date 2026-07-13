import { httpClient } from "./httpClient";

export function createCrudApi(controller) {
  const base = `/api/${controller}`;

  return {
    get: (id) => httpClient.get(`${base}/Get`, { id }),

    getFor: (key, propertyName) =>
      httpClient.get(`${base}/GetFor`, { key, propertyName }),

    list: (page = 1, pageSize = 50) =>
      httpClient.get(`${base}/List`, { page, pageSize }),

    upsert: (requestDto) => httpClient.post(`${base}/Upsert`, requestDto),

    upsertMany: (requestDtos) =>
      httpClient.post(`${base}/UpsertMany`, requestDtos),

    delete: (id) => httpClient.delete(`${base}/Delete`, { id }),
  };
}
