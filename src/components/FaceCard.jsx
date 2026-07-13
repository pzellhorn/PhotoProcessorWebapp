import { Link, useLocation } from "react-router-dom";
import { photoApi } from "../api/photoApi";
import SmartImage from "./SmartImage";

export default function FaceCard({ face }) {
    const location = useLocation();

    return (
        <Link
            className="face-card"
            to={`/photos/${face.mediaId}`}
            state={{ from: `${location.pathname}${location.search}` }}
            title="Open photo"
        >
            <SmartImage src={photoApi.faceThumbnailUrl(face.fingerprintId, 160)} alt="" loading="lazy" />
        </Link>
    );
}
