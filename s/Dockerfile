# Builder Stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

# 🏃 Runner Stage
FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=builder /app /app

EXPOSE 5000
CMD ["npm", "start"]