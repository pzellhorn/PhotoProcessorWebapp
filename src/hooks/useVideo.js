import { useQuery } from "@tanstack/react-query";
import { mediaItemApi } from "../api/entityApis";
import { videoApi } from "../api/videoApi";

export function useMediaItem(mediaId) {
  return useQuery({
    queryKey: ["mediaItem", mediaId],
    queryFn: () => mediaItemApi.get(mediaId),
    enabled: Boolean(mediaId),
  });
}

export function useVideoRenditions(mediaId, enabled) {
  return useQuery({
    queryKey: ["renditions", mediaId],
    queryFn: () => videoApi.getRenditions(mediaId),
    enabled: Boolean(mediaId) && enabled,
    // Poll while empty so the player appears as soon as transcoding finishes.
    refetchInterval: (query) =>
      query.state.data && query.state.data.length > 0 ? false : 3000,
  });
}
