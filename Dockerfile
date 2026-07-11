# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 迁移阶段 (用于初始化数据库)
FROM node:18-alpine AS migrator
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/scripts/run-migrations.ts ./
COPY --from=builder /app/lib/db ./lib/db
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/tsconfig.json ./

CMD ["npx", "ts-node", "scripts/run-migrations.ts"]

# 生产阶段
FROM node:18-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
