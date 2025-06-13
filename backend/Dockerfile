# ---------- Builder -------------------------------------------------
FROM node:18 AS builder
WORKDIR /app

# 1) Only copy package files, install deps (incl. devDeps so tsc is here)
COPY package*.json ./
RUN npm ci

# 2) Copy source (won't overwrite node_modules thanks to .dockerignore)
COPY . .

# 3) Build & generate
RUN npm run build
RUN npx prisma generate

# ---------- Runtime -------------------------------------------------
FROM node:18-slim AS runtime
WORKDIR /app

# Install OpenSSL + libssl for Prisma native bindings
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl libssl-dev \
 && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

# Only production deps
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

# Copy build outputs
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 5000
CMD ["node", "dist/index.js"]
