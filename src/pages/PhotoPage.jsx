import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { photoApi } from "../api/photoApi";
import { videoApi } from "../api/videoApi";
import { useJobsForMedia } from "../hooks/useJobs";
import { useDeletePhoto } from "../hooks/useMediaItems";
import { useMediaItem, useVideoRenditions } from "../hooks/useVideo";
import { jobStatusLabel } from "../domain/jobStatus";
import usePageTitle from "../hooks/usePageTitle";
import SmartImage from "../components/SmartImage";
import VideoPlayer from "../components/VideoPlayer";

const MEDIA_TYPE_VIDEO = 2;

export default function PhotoPage() {
  const { mediaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const startAt = searchParams.has("t") ? Number(searchParams.get("t")) : null;
  const { data: jobs } = useJobsForMedia(mediaId);
  const { data: mediaItem } = useMediaItem(mediaId);
  const deletePhoto = useDeletePhoto();

  const isVideo = mediaItem?.mediaType === MEDIA_TYPE_VIDEO;
  const { data: renditions } = useVideoRenditions(mediaId, isVideo);
  const masterRendition = renditions?.find((r) => r.format === "hls");

  usePageTitle(isVideo ? "Video" : "Photo");

  const backTo = location.state?.from ?? "/photos";

  function onDelete() {
    const confirmed = window.confirm(
      "Delete this item? Its faces are removed from People as well. This cannot be undone.",
    );
    if (!confirmed) return;

    deletePhoto.mutate(mediaId, { onSuccess: () => navigate("/photos") });
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <Link className="muted" to={backTo}>
            ← Back
          </Link>
          <h1>{isVideo ? "Video" : "Photo"}</h1>
        </div>
        <div className="job-chips">
          {jobs?.map((job) => (
            <span
              key={job.jobId}
              className={`chip chip-${jobStatusLabel(job.status).toLowerCase()}`}
            >
              {jobStatusLabel(job.status)}
            </span>
          ))}
          <button
            className="danger"
            disabled={deletePhoto.isPending}
            onClick={onDelete}
          >
            {deletePhoto.isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>

      {deletePhoto.isError && (
        <p className="error-text">{deletePhoto.error.message}</p>
      )}

      {isVideo ? (
        masterRendition ? (
          <VideoPlayer
            src={videoApi.streamUrl(mediaId, masterRendition.assetPath)}
            poster={photoApi.thumbnailUrl(mediaId, 640)}
            startAt={startAt}
          />
        ) : (
          <div className="video-processing">
            <SmartImage
              className="photo-full"
              src={photoApi.thumbnailUrl(mediaId, 640)}
              alt=""
            />
            <p className="muted">
              Transcoding… the player appears when it's ready.
            </p>
          </div>
        )
      ) : (
        <>
          <SmartImage
            className="photo-full"
            src={photoApi.downloadUrl(mediaId)}
            alt=""
          />
          <p>
            <a
              className="muted"
              href={photoApi.downloadUrl(mediaId)}
              target="_blank"
              rel="noreferrer"
            >
              Open original
            </a>
          </p>
        </>
      )}
    </section>
  );
}
