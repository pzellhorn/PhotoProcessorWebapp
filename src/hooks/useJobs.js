import { useQuery } from "@tanstack/react-query";
import { jobApi } from "../api/entityApis";
import { isJobActive } from "../domain/jobStatus";

export function useJobsForMedia(mediaId) {
  return useQuery({
    queryKey: ["jobs", mediaId],
    queryFn: () => jobApi.getFor(mediaId, "MediaId"),
    enabled: Boolean(mediaId),
    refetchInterval: (query) =>
      query.state.data?.some((job) => isJobActive(job.status)) ? 2000 : false,
  });
}
