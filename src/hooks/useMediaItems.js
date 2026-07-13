import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { mediaItemApi } from "../api/entityApis";
import { photoApi } from "../api/photoApi";
import { videoApi } from "../api/videoApi";

export function useMediaItemPage(page, pageSize) {
  return useQuery({
    queryKey: ["mediaItems", page, pageSize],
    queryFn: () => mediaItemApi.list(page, pageSize),
    placeholderData: keepPreviousData,
  });
}

export function useDeletePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mediaId) => photoApi.delete(mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mediaItems"] });
      queryClient.invalidateQueries({ queryKey: ["identities"] });
      queryClient.invalidateQueries({ queryKey: ["faces"] });
    },
  });
}

export function useUploadPhotos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ files, onProgress }) => {
      const results = [];
      for (let i = 0; i < files.length; i++) {
        onProgress?.(i, files.length);
        const file = files[i];
        const api = file.type.startsWith("video/") ? videoApi : photoApi;
        results.push(await api.upload(file));
      }
      return results;
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["mediaItems"] }),
  });
}
