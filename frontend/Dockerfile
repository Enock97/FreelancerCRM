# ======= frontend/Dockerfile =======

# ---------- Build stage -------------------------------------------------
FROM node:18-alpine AS builder
WORKDIR /app

# Install all deps (including devDeps, so Next can build)
COPY package*.json ./
RUN npm ci

COPY . .

# Disable Next.js telemetry and build
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------- Runtime stage -----------------------------------------------
FROM node:18-alpine AS runtime
WORKDIR /app

# Switch to production mode
ENV NODE_ENV=production

# Copy standalone output + static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static     ./.next/static
COPY --from=builder /app/public           ./public

# Copy only production node_modules
COPY --from=builder /app/node_modules     ./node_modules

EXPOSE 3000
CMD ["node", "server.js"]
