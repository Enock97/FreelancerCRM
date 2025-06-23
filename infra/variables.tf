# infra/variables.tf
variable "heroku_email" {
  type = string
}

variable "heroku_api_key" {
  type      = string
  sensitive = true   # hide from CLI output
}

variable "vercel_token" {
  type      = string
  sensitive = true
}

variable "jwt_secret" {
  type      = string
  sensitive = true
}

# This one is referenced in main.tf (Heroku app region)
variable "region" {
  type    = string
  default = "us"
}
