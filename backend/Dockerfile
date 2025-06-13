# ---------- Builder -------------------------------------------------
FROM node:18 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

ENV NODE_ENV=production

COPY . .

# Bygg TypeScript via npm script ("build": "npm exec tsc")
RUN npm run build

# Generer Prisma-klient
RUN npx prisma generate

# ---------- Runtime -------------------------------------------------
FROM node:18-slim AS runtime
WORKDIR /app

# Installér OpenSSL + libssl for Prisma native bindings
RUN apt-get update && apt-get install -y openssl libssl-dev

# Prod-avhengigheter
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

# Bygget kode og prisma-binaries
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 5000
CMD ["node", "dist/index.js"]
