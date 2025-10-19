FROM node:20-alpine AS base

LABEL org.opencontainers.image.source="https://github.com/weeduo-it/all4esthetic"

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/qrcode.zip ./qrcode.zip

EXPOSE 3000

CMD ["npm", "start"]
