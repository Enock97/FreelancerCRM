# ---------- Builder -------------------------------------------------
FROM node:18-alpine AS builder
WORKDIR /app

# 1. Installer alle deps (inkludert dev)
COPY package*.json ./
RUN npm ci

# 2. Kopiér resten av koden & bygg
COPY . .
RUN npm run build      # --> dist/

# 3. Generér Prisma-klient (trenger dev-deps)
RUN npx prisma generate

# ---------- Runtime -------------------------------------------------
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# 4. Kun prod-deps
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

# 5. Kopiér compiled kode + Prisma-client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 5000
CMD ["node", "dist/index.js"]
