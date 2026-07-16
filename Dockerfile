# syntax=docker/dockerfile:1
# =============================================================
# YYC³ 企业智能管理系统 — 多阶段 Docker 构建
# 构建阶段使用 Node.js (Next.js 需要 worker_threads，Bun 尚未完全支持)
# 包安装使用 Bun (保持与 CI lockfile 一致)
# =============================================================

# ==========================================
# 构建阶段
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# 安装 Bun (仅用于 bun install，保持 lockfile 一致性)
RUN npm install -g bun@1.2

# 复制 lockfile 与 manifest（利用 Docker 层缓存）
COPY bun.lock package.json ./

# 安装依赖（生产 + 开发，构建时需要 TypeScript/PostCSS 等）
RUN bun install --frozen-lockfile

# 复制源码（.dockerignore 已排除 node_modules/.next 等）
COPY . .

# 应用与 CI 一致的 Next.js 兼容性补丁
RUN sh scripts/patch-next-prerender.sh

# 构建 standalone 产物（使用 Node.js 运行，非 Bun — worker_threads 兼容）
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN node_modules/.bin/next build

# ==========================================
# 迁移阶段（用于初始化数据库）
# ==========================================
FROM node:22-alpine AS migrator
RUN npm install -g bun@1.2
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/scripts/run-migrations.ts ./
COPY --from=builder /app/lib/db ./lib/db
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/tsconfig.json ./

CMD ["bun", "run", "scripts/run-migrations.ts"]

# ==========================================
# 生产阶段（精简运行时镜像）
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
