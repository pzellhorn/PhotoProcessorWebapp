output "webapp_url" {
  description = "URL the webapp is served on."
  value       = "http://localhost:${var.host_port}"
}
