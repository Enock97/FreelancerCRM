# infra/providers.tf
provider "heroku" {
  email   = var.heroku_email
  api_key = var.heroku_api_key
}

provider "vercel" {
  api_token = var.vercel_token
}
