import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { progressApi } from "../api/progressApi";

export function useProgress() {
  return useQuery({
    queryKey: ["progress"],
    queryFn: () => progressApi.getProgress(),
    refetchInterval: 5000,
  });
}

export function useBackfill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobType) => progressApi.backfill(jobType),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["progress"] }),
  });
}

export function useScaleWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobType, replicas }) => progressApi.scale(jobType, replicas),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["progress"] }),
  });
}
