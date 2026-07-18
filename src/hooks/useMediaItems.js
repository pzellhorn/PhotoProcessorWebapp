import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { mediaItemApi } from "../api/entityApis";
import { photoApi } from "../api/photoApi";
import { videoApi } from "../api/videoApi";
import { RESUMABLE_THRESHOLD, uploadResumable } from "../api/resumableUpload";

export function useMediaItemPage(page, pageSize) {
  return useQuery({
    queryKey: ["mediaItems", page, pageSize],
    queryFn: () => photoApi.listLibrary(page, pageSize),
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
        const file = files[i];
        onProgress?.(i, files.length, 0);

        if (file.size >= RESUMABLE_THRESHOLD) {
          results.push(
            await uploadResumable(file, (sent, total) =>
              onProgress?.(i, files.length, total ? sent / total : 0),
            ),
          );
        } else {
          const api = file.type.startsWith("video/") ? videoApi : photoApi;
          results.push(await api.upload(file));
        }
      }
      return results;
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["mediaItems"] }),
  });
}
