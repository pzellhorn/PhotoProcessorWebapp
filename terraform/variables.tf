variable "docker_host" {
  description = "Docker daemon endpoint. Windows named pipe by default; Linux/macOS use unix:///var/run/docker.sock."
  type        = string
  default     = "npipe:////./pipe/docker_engine"
}

variable "api_base_url" {
  description = "API base URL baked into the bundle (must be reachable from the browser)."
  type        = string
  default     = "http://localhost:5030"
}

variable "host_port" {
  description = "Host port the webapp is served on. Defaults to 5175, which is in the API's dev CORS allow-list."
  type        = number
  default     = 5175
}
