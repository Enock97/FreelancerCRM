# ---------- Build stage -------------------------------------------------
FROM node:18-alpine AS builder
WORKDIR /app

# frozen lock file → reproducible & fast
COPY package*.json ./
RUN npm ci

COPY . .
# Disable telemetry & do a standalone build
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build        # produces .next/standalone & .next/static

# ---------- Runtime stage ----------------------------------------------
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Only what the standalone server needs
COPY --from=builder /app/.next/standalone        ./
COPY --from=builder /app/.next/static            ./.next/static
COPY --from=builder /app/public                  ./public
COPY --from=builder /app/package*.json           ./
COPY --from=builder /app/node_modules            ./node_modules

EXPOSE 3000
# JSON array form avoids the warning & handles signals correctly
CMD ["node", "server.js"]
