# ---------- Builder -------------------------------------------------
FROM node:18 AS builder
WORKDIR /app

# 1. full install
COPY package*.json ./
RUN npm ci

# 2. source + build
COPY . .
RUN npm run build          
RUN npx prisma generate    

# ---------- Runtime -------------------------------------------------
FROM node:18-slim
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev       # kun prod-deps

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 5000
CMD ["node", "dist/index.js"]
