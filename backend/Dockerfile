# ======= backend/Dockerfile =======

# ---------- Builder -------------------------------------------------
FROM node:18 AS builder
WORKDIR /app

# Install all deps (including devDeps, so tsc is available)
COPY package*.json ./
RUN npm ci

COPY . .

# Build TypeScript and generate Prisma client
RUN npm run build
RUN npx prisma generate

# ---------- Runtime -------------------------------------------------
FROM node:18-slim AS runtime
WORKDIR /app

# Install OpenSSL + libssl for Prisma native bindings
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl libssl-dev \
 && rm -rf /var/lib/apt/lists/*

# Switch to production mode for the runtime
ENV NODE_ENV=production

# Install only production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

# Copy built code and Prisma artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 5000
CMD ["node", "dist/index.js"]
