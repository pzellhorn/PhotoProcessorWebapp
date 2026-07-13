import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { photoApi } from "../api/photoApi";
import { useJobsForMedia } from "../hooks/useJobs";
import { useDeletePhoto } from "../hooks/useMediaItems";
import { jobStatusLabel } from "../domain/jobStatus";
import usePageTitle from "../hooks/usePageTitle";
import SmartImage from "../components/SmartImage";

export default function PhotoPage() {
  const { mediaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: jobs } = useJobsForMedia(mediaId);
  const deletePhoto = useDeletePhoto();

  usePageTitle("Photo");

  const backTo = location.state?.from ?? "/photos";

  function onDelete() {
    const confirmed = window.confirm(
      "Delete this photo? Its faces are removed from People as well. This cannot be undone.",
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
          <h1>Photo</h1>
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
    </section>
  );
}
