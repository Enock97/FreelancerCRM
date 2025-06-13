# ---------- Build stage -------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------- Runtime stage -----------------------------------------------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# 1. standalone server and static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static     ./.next/static
COPY --from=builder /app/public           ./public

# 2. package.json + node_modules required by server.js
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules  ./node_modules

EXPOSE 3000

# Use server created by `next build` (already inside standalone folder)
CMD ["node", "server.js"]
