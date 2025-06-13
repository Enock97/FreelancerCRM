# ---------- Builder -------------------------------------------------
FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci
ENV NODE_ENV=production

COPY . .
RUN npm run build
RUN npx prisma generate

# ---------- Runtime -------------------------------------------------
FROM node:20-slim AS runtime
WORKDIR /app

# Install OpenSSL + dev libs required by Prisma engines
RUN apt-get update && apt-get install -y openssl libssl-dev

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 5000
CMD ["node", "dist/index.js"]
