import { Link, useLocation } from "react-router-dom";
import { photoApi } from "../api/photoApi";
import SmartImage from "./SmartImage";

const MEDIA_TYPE_VIDEO = 2;

function formatDuration(ms) {
  if (!ms || ms <= 0) return null;
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function PhotoCard({ mediaItem, to, badgeLabel }) {
  const location = useLocation();
  const isVideo = mediaItem.mediaType === MEDIA_TYPE_VIDEO;
  const duration = isVideo ? formatDuration(mediaItem.durationMs) : null;

  const isMoment = Boolean(to);
  const badge = badgeLabel ?? duration;

  return (
    <Link
      className="photo-card"
      to={to ?? `/photos/${mediaItem.mediaItemId}`}
      state={{ from: `${location.pathname}${location.search}` }}
    >
      <SmartImage
        src={photoApi.thumbnailUrl(mediaItem.mediaItemId, 320)}
        alt=""
        loading="lazy"
      />
      {(isVideo || isMoment) && (
        <>
          <span className="video-play-glyph">▶</span>
          {badge && <span className="video-duration">{badge}</span>}
        </>
      )}
    </Link>
  );
}

export function formatTimestamp(ms) {
  const totalSeconds = Math.floor((ms ?? 0) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
