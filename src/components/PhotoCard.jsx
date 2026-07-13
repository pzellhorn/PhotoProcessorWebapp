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

export default function PhotoCard({ mediaItem }) {
    const location = useLocation();
    const isVideo = mediaItem.mediaType === MEDIA_TYPE_VIDEO;
    const duration = isVideo ? formatDuration(mediaItem.durationMs) : null;

    return (
        <Link
            className="photo-card"
            to={`/photos/${mediaItem.mediaItemId}`}
            state={{ from: `${location.pathname}${location.search}` }}
        >
            <SmartImage src={photoApi.thumbnailUrl(mediaItem.mediaItemId, 320)} alt="" loading="lazy" />
            {isVideo && (
                <>
                    <span className="video-play-glyph">▶</span>
                    {duration && <span className="video-duration">{duration}</span>}
                </>
            )}
        </Link>
    );
}
