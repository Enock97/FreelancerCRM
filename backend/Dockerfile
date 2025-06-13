FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN npx prisma generate

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
