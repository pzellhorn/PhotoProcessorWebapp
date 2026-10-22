import { isJobActive } from "../domain/jobStatus";
import { useFlowerIdentification } from "../hooks/useFlower";

const minConfidenceScore = 0.3;

function formatPercent(score) {
  return `${Math.round(score * 100)}%`;
}

function SpeciesName({ prediction }) {
  return (
    <>
      {prediction.commonName && <span>{prediction.commonName} · </span>}
      <em>{prediction.scientificName}</em>
    </>
  );
}

export default function FlowerPanel({ mediaId, flowerJob }) {
  const { data: flower } = useFlowerIdentification(mediaId, flowerJob?.status);

  if (flowerJob && isJobActive(flowerJob.status)) {
    return <p className="muted flower-panel">Identifying flowers…</p>;
  }

  if (!flower?.isFlower || flower.predictions.length === 0) return null;

  const [top, ...others] = flower.predictions;

  return (
    <div className="flower-panel">
      <h2 className="section-heading">Flower</h2>
      <p className="flower-name">
        <SpeciesName prediction={top} />
      </p>
      <p className="muted">
        {top.family} · {formatPercent(top.score)} match
        {top.score < minConfidenceScore &&
          " — uncertain, see other possibilities"}
      </p>
      {others.length > 0 && (
        <details className="flower-others">
          <summary className="muted">Other possibilities</summary>
          <ul>
            {others.map((prediction) => (
              <li key={prediction.scientificName}>
                <SpeciesName prediction={prediction} />{" "}
                <span className="muted">
                  {prediction.family} · {formatPercent(prediction.score)}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
