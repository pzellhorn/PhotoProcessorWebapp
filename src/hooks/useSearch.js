import { useQuery } from "@tanstack/react-query";
import { searchApi } from "../api/searchApi";

export function useSearch(text, count = 24) {
  const query = text?.trim() ?? "";

  return useQuery({
    queryKey: ["search", query, count],
    queryFn: async () => {
      const results = await searchApi.searchByText(query, count);
      return results.map((result) => ({
        mediaItemId: result.mediaId,
        mediaType: result.mediaType,
        durationMs: result.durationMs,
        distance: result.distance,
      }));
    },
    enabled: query.length > 0,
  });
}
