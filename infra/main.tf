# infra/main.tf
# ----------- Heroku backend ------------------
resource "heroku_app" "api" {
  name   = "freelancercrm-api"
  region = var.region
  stack  = "heroku-22"
}

resource "heroku_addon" "db" {
  app_id = heroku_app.api.id
  plan   = "heroku-postgresql:essential-0"
}

resource "heroku_app_config_association" "api_env" {
  app_id = heroku_app.api.id

  vars = {
    JWT_SECRET = var.jwt_secret
  }
}

# ----------- Vercel frontend -----------------
resource "vercel_project" "web" {
  name           = "freelancercrm-web"
  framework      = "nextjs"

  # NEW: point Vercel at the folder that holds package.json
  root_directory = "frontend"
}


resource "vercel_deployment" "prod" {
  project_id = vercel_project.web.id        # your existing project resource
  files      = data.vercel_project_directory.frontend.files
  production = true                         # or var.is_prod in more advanced setups
}