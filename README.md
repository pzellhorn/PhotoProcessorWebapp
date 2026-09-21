# PhotoProcessor Webapp

React frontend for the PhotoProcessor API — browse photos, watch ML jobs process them, and manage the people the face-recognition pipeline discovers.

## Quickstart

**Prerequisites:**

1. Run the `PhotoProcessor` API, https://github.com/pzellhorn/PhotoProcessor using the quickstart
2. Install Docker
3. Install Terraform ≥ 1.5 (container).

```bash
terraform -chdir=terraform init
terraform -chdir=terraform apply
```

The API URL is set in .env.development, currently set to localhost:5030.

## Teardown

```bash
terraform -chdir=terraform destroy
```
