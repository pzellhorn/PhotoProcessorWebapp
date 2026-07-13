import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { identityApi } from "../api/identityApi";
import { tagApi } from "../api/entityApis";

export function useIdentities() {
  return useQuery({
    queryKey: ["identities"],
    queryFn: () => identityApi.listIdentities(),
  });
}

export function useFacesForTag(tagId) {
  return useQuery({
    queryKey: ["faces", tagId],
    queryFn: () => identityApi.getFacesForTag(tagId),
    enabled: Boolean(tagId),
  });
}

export function useRenameIdentity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tagId, label }) => {
      const tag = await tagApi.get(tagId);
      return tagApi.upsert({ ...tag, label });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["identities"] }),
  });
}

export function useMergeIdentities() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sourceTagId, targetTagId }) =>
      identityApi.merge(sourceTagId, targetTagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["identities"] });
      queryClient.invalidateQueries({ queryKey: ["faces"] });
    },
  });
}
