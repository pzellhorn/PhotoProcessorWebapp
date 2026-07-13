import { Link } from "react-router-dom";
import { photoApi } from "../api/photoApi";
import { useFacesForTag } from "../hooks/useIdentities";
import SmartImage from "./SmartImage";

export default function IdentityCard({ identity }) {
    const { data: faces } = useFacesForTag(identity.tagId);
    const avatarFace = faces?.[0];

    return (
        <Link className="identity-card" to={`/people/${identity.tagId}`}>
            {avatarFace ? (
                <SmartImage src={photoApi.faceThumbnailUrl(avatarFace.fingerprintId, 160)} alt="" loading="lazy" />
            ) : (
                <div className="face-placeholder" />
            )}
            <div className="identity-card-info">
                <span className="identity-label">{identity.label || "Unnamed"}</span>
                <span className="muted">
                    {identity.faceCount} face{identity.faceCount === 1 ? "" : "s"}
                </span>
            </div>
        </Link>
    );
}
