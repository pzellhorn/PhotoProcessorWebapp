const GRAFANA_URL = import.meta.env.VITE_GRAFANA_URL ?? "http://localhost:3001";
const DASHBOARD_UID = "photoprocessor-pipeline";
const DASHBOARD_SLUG = "photoprocessor-pipeline";

export function grafanaDashboardUrl() {
  return `${GRAFANA_URL}/d/${DASHBOARD_UID}/${DASHBOARD_SLUG}?orgId=1&refresh=10s`;
}

export default function GrafanaPanel({ panelId, title, height = 220, range = "now-1h" }) {
  const src =
    `${GRAFANA_URL}/d-solo/${DASHBOARD_UID}/${DASHBOARD_SLUG}` +
    `?orgId=1&panelId=${panelId}&from=${range}&to=now&theme=dark&refresh=10s`;

  return (
    <div className="grafana-panel">
      <div className="grafana-panel-head">
        <span>{title}</span>
        <a className="muted" href={grafanaDashboardUrl()} target="_blank" rel="noreferrer">
          open in Grafana ↗
        </a>
      </div>
      <iframe src={src} title={title} height={height} frameBorder="0" loading="lazy" />
    </div>
  );
}
