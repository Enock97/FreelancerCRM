# ---------- Build stage -------------------------------------------------
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN echo "┌── /app/src ───────────────────────────────────" \
 && ls -R src \
 && echo "└── /app/src/components ───────────────────────" \
 && ls -R src/components

RUN npm run build

# ---------- Runtime stage -----------------------------------------------
FROM node:18-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static     ./.next/static
COPY --from=builder /app/public           ./public
COPY --from=builder /app/node_modules     ./node_modules

EXPOSE 3000
CMD ["node", "server.js"]
