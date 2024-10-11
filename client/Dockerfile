FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --force

COPY . .

RUN npm run build

#############################################
#             Production Image              #
#############################################
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --only=production --force

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]