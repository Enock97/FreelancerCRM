# infra/backend.tf
terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "enock-labs"        # change to your TFC org
    workspaces {
      name = "freelancercrm"
    }
  }
}
