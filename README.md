# ⭐ FreelancerCRM

**FreelancerCRM** is an advanced-level Minimum Viable Product (MVP) version of a modern CRM web application built for learning purposes and upskill reasons, and includes an overview of client relationships, activities, and communication — all presented in a user-friendly, responsive dashboard with a drag-and-drop Kanban interface.

---

## 🌐 Try the App

Test the live application here: 
- **[Live App (Vercel)🚀](https://freelancercrm-deployment.vercel.app)**
- **[API Health Check (Heroku)🛠️](https://freelancercrm-backend-838d0cf51a08.herokuapp.com/api/health)**

<br>

Live application availability (YES/NO): **YES**

---

## 💡 About the Application
I built FreelancerCRM to challenge myself, so I can enhance my development competency by creating a complete full-stack solo project while also exploring different technologies not previously well known to me. The application has a Kanban board UI built with React/Next.js and Tailwind, and a secure Node/Express back-end with both REST and GraphQL endpoints backed by PostgreSQL. I set up JWT authentication, CI/CD with GitHub Actions, and deployed the front-end to Vercel and the back-end to Heroku. I also experimented with infrastructure-as-code using Terraform and lightweight Kubernetes (K3s) although I wouldn’t call myself proficient there yet, but it gave me valuable exposure to how modern apps can be deployed and scaled.

The application contains the following features:
- Manage contacts with fields for name, email, company, status, note, and phone number.
- Organize client workflows using a visual Kanban board with drag-and-drop functionality.
- Includes search, filter, generate and reset contacts buttons.
- Log and track activities linked to each contact.
- User authentication (registration, login, protected routes).
- Profile page with total amount of contacts and activities, and email/password update.
- Supports dark/light mode with a toggle button and your system settings.
- Mobile-friendly and responsive design.

🙏 **Upcoming Features/Fixes:**
- **Non Currently**

---

## 🛠️ Technologies

- **Frontend:** Next.js (TypeScript), React, Apollo Client, Tailwind CSS
- **Backend:** Express.js (Node.js/TypeScript), REST, GraphQL (Apollo Server), Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** JWT
- **DevOps:** Docker, Kubernetes, Terraform, GitHub Actions, Vercel, Heroku
- **Testing:** Jest, Cypress
- **Tools:** VS Code, AI (GPT-4), Framework Documentations, YouTube Guides, StackOverflow

---

## 📦 View/Run the Source Code

```sh
git clone https://github.com/Enock97/FreelancerCRM.git
```

---

## 💻 Local Setup

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Local Development Setup

### Prerequisites

- Node.js v18+
- Docker + Docker Compose
- (Optional) `kubectl` and a local Kubernetes cluster (e.g. minikube or kind)
- (Optional) Terraform configurations

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/FreelancerCRM.git
cd FreelancerCRM
```

### 2. Activate the database

There are two main options:

#### Option A: Local development with SQLite (default in `.env.example`)

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
```

This sets up the SQLite database and runs all Prisma migrations.

#### Option B: PostgreSQL via Docker or Kubernetes

If using Docker or Kubernetes, PostgreSQL will start as a container or pod automatically, and you must configure the `.env` with the correct database URL, e.g.:

```
DATABASE_URL="postgresql://user:password@localhost:5432/freelancercrm"
```

Then run:

```bash
npx prisma generate
npx prisma migrate deploy
```

> Use `migrate deploy` instead of `migrate dev` in production-like environments.

### 3. Start the backend server

```bash
npm run dev
```

API runs on [http://localhost:4000](http://localhost:4000)

### 4. Start the frontend app

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on [http://localhost:3000](http://localhost:3000)

### 5. (Optional) Docker Compose setup

```bash
docker-compose up --build
```

> You must have a valid `docker-compose.yml` that wires up backend, frontend, and Postgres.

### 6. (Optional) Kubernetes deployment

```bash
kubectl apply -f k8s/
```

> This sets up the backend, frontend, and database in a Kubernetes cluster. You must ensure your local cluster supports persistent volumes (e.g., via `local-path-provisioner`).

---

### 7. (Optional) Infrastructure & CI/CD (Terraform + GitHub Actions)

This repo ships with **100 % reproducible infrastructure‑as‑code**.  
Everything that Vercel, Heroku and the CI pipeline need lives in **`/infra`** (Terraform) and **`.github/workflows/ci-tests-deploy-terraform.yml`** (GitHub Actions).

| Layer | Technology | How to use it locally |
|-------|------------|-----------------------|
| Front‑end hosting | **Vercel provider** | `cd infra && terraform apply` creates / updates the Vercel project and triggers a deployment. |
| API + database | **Heroku provider** | Same `terraform apply` provisions the Heroku app, attaches a Postgres **essential‑0** plan, and wires config vars. |
| Remote state | **Terraform Cloud Free** | State is stored remotely (see `infra/backend.tf`). Run `terraform login` once or export `TF_TOKEN_app_terraform_io=<your user token>` before `terraform init`. |
| CI/CD | **GitHub Actions** | One workflow runs tests, deploys the backend slug to Heroku, then applies Terraform. No Heroku autodeploy needed. |

### Quick start (one‑time bootstrap)

```bash
# install Terraform >= 1.7 locally
cd infra

# 1️⃣ log in so Terraform can talk to Terraform Cloud
terraform login   # or set TF_TOKEN_app_terraform_io

# 2️⃣ set the secrets Terraform needs
export TF_VAR_heroku_email="you@example.com"
export TF_VAR_heroku_api_key="heroku-******"
export TF_VAR_vercel_token="vcst_******"
export TF_VAR_jwt_secret="super-secret-jwt-string"

# 3️⃣ spin everything up
terraform init
terraform apply   # review → yes
```

After this:

* `npm test` + `npm run build` are already baked into the GitHub workflow.  
* Pushing to **`main`** automatically runs tests → deploys backend → applies Terraform → deploys front‑end.  
* Need a staging copy? Run `terraform workspace new staging && terraform apply`.

### Changing cloud resources

* **Heroku stack** – edit `stack = "heroku-24"` in `infra/main.tf`.  
* **Database plan** – change `plan = "heroku-postgresql:essential-1"` and `apply`.  
* **New env vars** – add them under `heroku_app_config_association.api_env` and commit.

### Disabling duplicate Heroku builds

Because the GitHub workflow already deploys the slug, **disable “Automatic Deploys”** in the Heroku dashboard to avoid a second build/release.

---

> **Why Terraform?**  
> One command (`terraform apply`) recreates the full Vercel + Heroku stack, including CI secrets and JWTs, so anyone can fork the repo and spin up an identical environment in five minutes.


## 👨‍💻 Developer

**Enock Ladu – Full-Stack Developer**: [LinkedIn Profile](https://www.linkedin.com/in/enock-ladu-b56b0724b/) / Oslo, Norway

---
