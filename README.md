# FreelancerCRM
```md
FreelancerCRM er en fullstack CRM-applikasjon rettet mot freelancere og konsulenter som trenger enkel og effektiv kundehåndtering. Applikasjonen lar deg registrere kontakter, endre pipeline-status, sette opp aktiviteter og holde oversikt over leads, tilbud og salg.
```

---

## Stack
- **Frontend**: React, TypeScript, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM
- **Database**: PostgreSQL (via Docker)
- **Autentisering**: JWT
- **DevOps**: Docker Compose

---

## Komme i gang

### 1. Klon prosjektet
```bash
git clone https://github.com/Enock97/FreelancerCRM.git
cd FreelancerCRM
```

---

### 2. Kjør med Docker (backend + database)
Krever at du har [Docker Desktop](https://www.docker.com/products/docker-desktop) installert.

```bash
cp .env.example .env
docker-compose up --build
```

- API: `http://localhost:5000/api/health`
- PostgreSQL kjører på `localhost:5432`

---

### 3. Start frontend
```bash
cd frontend
npm install
npm run dev
```

- Webapp: `http://localhost:5173`

---

### 4. Backend for utvikling uten Docker (valgfritt)
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

---

## .env-format

Opprett `.env` i `backend/` med følgende verdier:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/freelancecrm"
JWT_SECRET="your-secret-string"
PORT=5000
```

---

## Scripts

```bash
# Frontend
npm run dev         # Starter React/Vite

# Backend
npm run dev         # Starter Express + ts-node-dev
npx prisma migrate dev --name init
npx prisma generate
```

---

## Utvikler

Enock Ladu – Fullstack utvikler  
[LinkedIn Profil](https://www.linkedin.com/in/enock-ladu-b56b0724b/) / Oslo, Norge
```