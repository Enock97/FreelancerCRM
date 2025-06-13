# ---------- Builder -------------------------------------------------
FROM node:20 AS builder
WORKDIR /app

# 1. full install
COPY package*.json ./
RUN npm ci

# 2. source + build
COPY . .
RUN npm run build
RUN npx prisma generate

# ---------- Runtime -------------------------------------------------
FROM node:20-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Install OpenSSL (required by Prisma)
RUN apt-get update && apt-get install -y openssl

# 1. install prod-deps only
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

# 2. copy built code and prisma binaries
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 5000
CMD ["node", "dist/index.js"]
