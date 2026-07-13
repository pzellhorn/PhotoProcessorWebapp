import { useSearchParams } from "react-router-dom";
import { useIdentities } from "../hooks/useIdentities";
import IdentityCard from "../components/IdentityCard";
import usePageTitle from "../hooks/usePageTitle";

export default function PeoplePage() {
    const { data: identities, isLoading, isError, error } = useIdentities();
    const [searchParams, setSearchParams] = useSearchParams();

    usePageTitle("People");

    const namedOnly = searchParams.get("named") === "1";
    const multiOnly = searchParams.get("min") === "2";

    function toggleParam(key, value, enabled) {
        const next = new URLSearchParams(searchParams);
        if (enabled) next.set(key, value);
        else next.delete(key);
        setSearchParams(next, { replace: true });
    }

    const filtered = (identities ?? [])
        .filter((identity) => !namedOnly || identity.label)
        .filter((identity) => !multiOnly || identity.faceCount > 1)
        .sort((a, b) => b.faceCount - a.faceCount);

    return (
        <section>
            <div className="page-header">
                <h1>People</h1>
                <div className="filter-bar">
                    <button
                        className={`chip-toggle ${namedOnly ? "active" : ""}`}
                        onClick={() => toggleParam("named", "1", !namedOnly)}
                    >
                        Named only
                    </button>
                    <button
                        className={`chip-toggle ${multiOnly ? "active" : ""}`}
                        onClick={() => toggleParam("min", "2", !multiOnly)}
                    >
                        2+ faces
                    </button>
                    {identities && (
                        <span className="muted">
                            {filtered.length} of {identities.length}
                        </span>
                    )}
                </div>
            </div>

            {isLoading && <p className="muted">Loading people…</p>}
            {isError && <p className="error-text">{error.message}</p>}
            {identities && identities.length === 0 && (
                <p className="muted">No people yet — they appear as photos with faces are processed.</p>
            )}
            {identities && identities.length > 0 && filtered.length === 0 && (
                <p className="muted">No people match the current filters.</p>
            )}

            <div className="identity-grid">
                {filtered.map((identity) => (
                    <IdentityCard key={identity.tagId} identity={identity} />
                ))}
            </div>
        </section>
    );
}
