# ---------- Build stage -------------------------------------------------
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

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
CMD ["node","server.js","--hostname","0.0.0.0","--port","3000"]
