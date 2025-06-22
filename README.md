# ⭐ FreelancerCRM

**FreelancerCRM** is a Minimum Viable Product (MVP) version of a modern CRM web application built for freelancers and small teams who need a simple overview of client relationships, activities, and communication — all presented in a user-friendly, responsive dashboard with a drag-and-drop Kanban interface.

---

## 🌐 Try the App

Test the live application here: 
- **[Live App (Vercel)🚀](https://freelancercrm-deployment.vercel.app)**
- **[API Health Check (Heroku)🛠️](https://freelancercrm-backend-838d0cf51a08.herokuapp.com/api/health)**

<br>

Live application availability (YES/NO): **YES**

---

## 💡 About the Application

- Manage contacts with fields for name, email, company, status, note, and phone number.
- Organize client workflows using a visual Kanban board with drag-and-drop functionality.
- Log and track activities linked to each contact.
- User authentication (registration, login, protected routes).
- Profile page with total amount of contacts and activities, and email/password update.
- Supports dark/light mode.
- Mobile-friendly and responsive design.
- Full front-end availability on Vercel, and back-end on Heroku.

🙏 **Upcoming Features:**
- **Non Currently**

---

## 🛠️ Technologies

- **Frontend:** Next.js (TypeScript), React, Apollo Client, Tailwind CSS
- **Backend:** Express.js (Node.js/TypeScript), REST, GraphQL (Apollo Server), Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** JWT
- **DevOps:** Docker, Kubernetes, GitHub Actions, Vercel, Heroku
- **Testing:** Jest
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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Local Development Setup

### Prerequisites

- Node.js v18+
- Docker + Docker Compose
- (Optional) `kubectl` and a local Kubernetes cluster (e.g. minikube or kind)

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


## 👨‍💻 Developer

**Enock Ladu – Full-Stack Developer**: [LinkedIn Profile](https://www.linkedin.com/in/enock-ladu-b56b0724b/) / Oslo, Norway

---
