import { useProgress, useBackfill, useScaleWorker } from "../hooks/useProgress";
import { jobTypeLabel, mediaTypeLabel } from "../domain/jobTypes";
import GrafanaPanel, { grafanaDashboardUrl } from "../components/GrafanaPanel";
import usePageTitle from "../hooks/usePageTitle";

function percent(done, total) {
  if (!total) return 0;
  return Math.round((done / total) * 100);
}

function appliesToLabel(appliesTo) {
  if (!Array.isArray(appliesTo)) return mediaTypeLabel(appliesTo);
  return appliesTo.map(mediaTypeLabel).join(" + ");
}

export default function ProgressPage() {
  const { data, isLoading, isError, error } = useProgress();
  const backfill = useBackfill();
  const scale = useScaleWorker();

  usePageTitle("Progress");

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Progress</h1>
          <span className="muted">
            Live pipeline state and controls — history in Grafana
          </span>
        </div>
        <a className="grafana-link" href={grafanaDashboardUrl()} target="_blank" rel="noreferrer">
          Open Grafana ↗
        </a>
      </div>

      {isLoading && <p className="muted">Loading progress…</p>}
      {isError && <p className="error-text">{error.message}</p>}
      {backfill.isError && <p className="error-text">{backfill.error.message}</p>}
      {scale.isError && <p className="error-text">{scale.error.message}</p>}
      {backfill.data && (
        <p className="muted">
          Enqueued {backfill.data.enqueued} job{backfill.data.enqueued === 1 ? "" : "s"}.
        </p>
      )}

      {data?.map((row) => {
        const coverage = percent(row.done, row.eligibleMedia);
        const idle = row.queueExists && row.consumers === 0;

        return (
          <div className="progress-card" key={row.jobType}>
            <div className="progress-card-head">
              <div>
                <span className="progress-title">{jobTypeLabel(row.jobType)}</span>
                <span className="muted">
                  {" "}· {row.eligibleMedia} {appliesToLabel(row.appliesTo)}
                </span>
              </div>
              <button
                className="primary"
                disabled={row.neverRun === 0 || backfill.isPending}
                onClick={() => backfill.mutate(row.jobType)}
              >
                {row.neverRun === 0 ? "Nothing to run" : `Run for ${row.neverRun} missing`}
              </button>
            </div>

            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${coverage}%` }} />
            </div>
            <span className="muted">
              {row.done} of {row.eligibleMedia} done ({coverage}%)
            </span>

            {row.scalingEnabled && (
              <div className="worker-scale">
                <span className="muted">workers</span>
                <button
                  disabled={row.replicas === 0 || scale.isPending || !row.deploymentFound}
                  onClick={() => scale.mutate({ jobType: row.jobType, replicas: row.replicas - 1 })}
                >
                  −
                </button>
                <span className="worker-count">
                  {row.replicas}
                  {row.readyReplicas !== row.replicas && (
                    <span className="muted"> ({row.readyReplicas} ready)</span>
                  )}
                </span>
                <button
                  disabled={row.replicas >= row.maxReplicas || scale.isPending || !row.deploymentFound}
                  onClick={() => scale.mutate({ jobType: row.jobType, replicas: row.replicas + 1 })}
                >
                  +
                </button>
                <span className="muted">max {row.maxReplicas}</span>
                {!row.deploymentFound && (
                  <span className="chip chip-failed">deployment not found</span>
                )}
              </div>
            )}

            <div className="progress-stats">
              <span className="chip">queue {row.queue}</span>
              <span className={`chip ${row.queueDepth > 0 ? "chip-queued" : ""}`}>
                depth {row.queueDepth}
              </span>
              <span className={`chip ${idle ? "chip-failed" : "chip-done"}`}>
                {row.consumers} consumer{row.consumers === 1 ? "" : "s"}
              </span>
              {!row.queueExists && <span className="chip chip-failed">queue not declared</span>}
              {row.queued > 0 && <span className="chip chip-queued">{row.queued} queued</span>}
              {row.running > 0 && <span className="chip chip-running">{row.running} running</span>}
              {row.failed > 0 && <span className="chip chip-failed">{row.failed} failed</span>}
              {row.neverRun > 0 && <span className="chip">{row.neverRun} never run</span>}
            </div>
          </div>
        );
      })}

      <h2 className="section-heading">Throughput</h2>
      <div className="grafana-grid">
        <GrafanaPanel panelId={2} title="Queue depth" />
        <GrafanaPanel panelId={5} title="Job completion rate" />
        <GrafanaPanel panelId={6} title="Queue wait (p50 / p95)" />
        <GrafanaPanel panelId={7} title="Worker processing time (p50 / p95)" />
      </div>

      <h2 className="section-heading">Semantic search</h2>
      <div className="grafana-grid">
        <GrafanaPanel panelId={14} title="Search latency vs CLIP text encode" />
        <GrafanaPanel panelId={3} title="Workers: desired vs ready vs subscribed" />
      </div>
    </section>
  );
}
