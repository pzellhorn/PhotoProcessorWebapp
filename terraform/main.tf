# Builds this webapp (Vite -> nginx) and runs it as a container.
# Self-contained: the build context is this repo's root (..), so there is no
# path into any other repo.
#
# Usage:
#   cd terraform && terraform init && terraform apply

terraform {
  required_version = ">= 1.5"

  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {
  host = var.docker_host
}

resource "docker_image" "webapp" {
  name = "photoprocessor/webapp:latest"

  build {
    context = abspath("${path.module}/..")
    tag     = ["photoprocessor/webapp:latest"]
    # Baked into the bundle: the browser calls the API at this URL directly.
    build_args = {
      VITE_API_BASE_URL = var.api_base_url
    }
  }
}

resource "docker_container" "webapp" {
  name  = "photoprocessor-webapp"
  image = docker_image.webapp.image_id

  ports {
    internal = 80
    external = var.host_port
  }

  restart = "unless-stopped"
}
