# infra/vercel_files.tf
#
# Reads every file under your Next.js source tree so the
# vercel_deployment resource can upload them.

data "vercel_project_directory" "frontend" {
    path = "${path.module}/../frontend"
}
