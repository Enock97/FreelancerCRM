<!-- infra/README.md -->
# FreelancerCRM – Terraform stack

```bash
# one-time setup
cd infra
terraform init         # pulls providers & configures remote backend

# import existing live resources (run once)
terraform import heroku_app.api freelancercrm-api
terraform import heroku_addon.db freelancercrm-api::DATABASE
terraform import vercel_project.web freelancercrm-web

# everyday workflow
terraform plan
terraform apply        # deploys changes to Heroku + Vercel
