terraform {
  required_version = "~> 1.7"

  required_providers {
    heroku = {
      source  = "heroku/heroku"
      version = "~> 5.0"     # was “~> 6.0” — 5.x is the current major line
    }

    # keep Vercel as-is; 1.9+ is available
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.9"
    }
  }
}
