import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useFacesForTag,
  useIdentities,
  useMergeIdentities,
  useRenameIdentity,
} from "../hooks/useIdentities";
import FaceCard from "../components/FaceCard";
import usePageTitle from "../hooks/usePageTitle";

export default function PersonPage() {
  const { tagId } = useParams();
  const navigate = useNavigate();

  const { data: identities } = useIdentities();
  const { data: faces, isLoading, isError, error } = useFacesForTag(tagId);
  const rename = useRenameIdentity();
  const merge = useMergeIdentities();

  const identity = identities?.find((i) => i.tagId === tagId);
  const mergeTargets = (identities ?? []).filter((i) => i.tagId !== tagId);

  const [editedLabel, setEditedLabel] = useState(null);
  const label = editedLabel ?? identity?.label ?? "";

  const [mergeTargetId, setMergeTargetId] = useState("");

  usePageTitle(identity?.label || "Unnamed person");

  useEffect(() => {
    setEditedLabel(null);
    setMergeTargetId("");
  }, [tagId]);

  function onSaveLabel(event) {
    event.preventDefault();
    rename.mutate({ tagId, label });
  }

  function onMerge() {
    if (!mergeTargetId) return;

    const target = mergeTargets.find((i) => i.tagId === mergeTargetId);
    const confirmed = window.confirm(
      `Merge "${identity?.label || "Unnamed"}" into "${target?.label || "Unnamed"}"? ` +
        "All faces move to the target and this identity is deleted.",
    );
    if (!confirmed) return;

    merge.mutate(
      { sourceTagId: tagId, targetTagId: mergeTargetId },
      { onSuccess: () => navigate(`/people/${mergeTargetId}`) },
    );
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <Link className="muted" to="/people">
            ← People
          </Link>
          <h1>{identity?.label || "Unnamed"}</h1>
        </div>
      </div>

      <div className="person-actions">
        <form className="rename-form" onSubmit={onSaveLabel}>
          <input
            type="text"
            placeholder="Name this person"
            value={label}
            onChange={(event) => setEditedLabel(event.target.value)}
          />
          <button className="primary" type="submit" disabled={rename.isPending}>
            {rename.isPending ? "Saving…" : "Save name"}
          </button>
        </form>

        <div className="merge-form">
          <select
            value={mergeTargetId}
            onChange={(event) => setMergeTargetId(event.target.value)}
          >
            <option value="">Merge into…</option>
            {mergeTargets.map((target) => (
              <option key={target.tagId} value={target.tagId}>
                {target.label || "Unnamed"} ({target.faceCount})
              </option>
            ))}
          </select>
          <button
            className="danger"
            disabled={!mergeTargetId || merge.isPending}
            onClick={onMerge}
          >
            {merge.isPending ? "Merging…" : "Merge"}
          </button>
        </div>
      </div>

      {rename.isError && <p className="error-text">{rename.error.message}</p>}
      {merge.isError && <p className="error-text">{merge.error.message}</p>}

      {isLoading && <p className="muted">Loading faces…</p>}
      {isError && <p className="error-text">{error.message}</p>}

      <div className="face-grid">
        {faces?.map((face) => (
          <FaceCard key={face.fingerprintId} face={face} />
        ))}
      </div>
    </section>
  );
}
