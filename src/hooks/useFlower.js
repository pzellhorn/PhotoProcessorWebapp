import { useQuery } from "@tanstack/react-query";
import { flowerApi } from "../api/flowerApi";
import { JobStatus } from "../domain/jobStatus";

export function useFlowerIdentification(mediaId, flowerJobStatus) {
  return useQuery({
    queryKey: ["flower", mediaId],
    queryFn: () => flowerApi.getForMedia(mediaId),
    enabled: Boolean(mediaId) && flowerJobStatus === JobStatus.Done,
  });
}
