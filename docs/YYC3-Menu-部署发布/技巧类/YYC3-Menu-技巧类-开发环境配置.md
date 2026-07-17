---
description: YYC3 项目文档 - 开发环境配置指南
author: YYC3 团队 <admin@0379.email>
version: v3.1.0
created: 2026-07-18
updated: 2026-07-18
status: stable
tags: documentation,开发环境,配置
category: general
language: zh-CN
audience: developers
complexity: intermediate
---

# 开发环境配置指南

> **文档类型**: 实施
> **版本**: 3.1.0
> **创建日期**: 2026-01-03
> **最后更新**: 2026-07-18
> **维护人**: YYC³ DevOps Team

## 1. 概述

### 1.1 环境要求

```bash
# 系统要求
OS: macOS, Linux, Windows (WSL2)
RAM: 8GB+ (推荐16GB)
Disk: 20GB+ 可用空间

# 必需软件
Bun: 1.3+
Git: 2.30+
PostgreSQL: 15+ (推荐 Homebrew: `brew install postgresql@15`)
Redis: 7+ (可选)

# 可选软件
Docker: 20.10+
```

### 1.2 技术栈（当前）

- **运行时**: Bun 1.3
- **框架**: Next.js 16.2 (App Router)
- **语言**: TypeScript 7.0 (strict mode)
- **UI**: shadcn/ui + Radix UI + Tailwind CSS v4
- **数据库**: PostgreSQL 15.15 (本地 5433/yyc3_33)
- **缓存**: Redis 7 (本地 6379)
- **容器**: Docker & Docker Compose
- **测试**: Vitest v4 + Testing Library

## 2. 环境搭建

### 2.1 安装Bun

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# 验证安装
bun --version  # 应 >= 1.3
```

### 2.2 克隆项目

```bash
# 克隆仓库
git clone https://github.com/YYC-Cube/YYC3-Management.git
cd YYC3-Management

# 安装依赖
bun install
```

### 2.3 环境变量配置

```bash
# .env 为配置清单（含所有占位变量）
# .env.local 为本地实际配置（.gitignore 忽略）
cp .env .env.local
```

```env
# .env.local 核心配置

# 应用
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3223
PORT=3223

# 数据库（本地 PG 15, 免密用户 yanyu）
DATABASE_URL=postgresql://yanyu@localhost:5433/yyc3_33
DB_HOST=localhost
DB_PORT=5433
DB_USER=yanyu
DB_NAME=yyc3_33

# Redis
REDIS_URL=redis://localhost:6379

# AI 服务（以占位值填入实际 key）
OPENAI_API_KEY=your_openai_api_key_here
ZHIPU_API_KEY=your_zhipu_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here
OLLAMA_BASE_URL=http://localhost:11434

# 安全（开发环境可使用默认占位）
JWT_SECRET=your_jwt_secret_key_here_min_32_characters
SESSION_SECRET=your_session_secret_here_min_32_characters
```

> 完整变量清单见 `.env` 文件，共 75 个变量（含注释），覆盖代码库 60 个 `process.env.X` 引用。

## 3. 数据库设置

### 3.1 PostgreSQL（Homebrew 安装）

```bash
# 安装 PostgreSQL 15
brew install postgresql@15

# 启动服务
brew services start postgresql@15

# 确认端口为 5433，创建数据库
createdb yyc3_33

# 验证连接
psql -h localhost -p 5433 -d yyc3_33 -c "SELECT current_database();"
# 应输出:  yyc3_33
```

### 3.2 使用Docker启动（备选）

```bash
# 启动 PostgreSQL + Redis
docker compose up -d postgres redis

# 验证连接
docker compose exec postgres psql -U yyc3user -d yyc3db -c "SELECT 1;"
```

### 3.3 数据库迁移

```bash
# 手动执行迁移 SQL
psql -h localhost -p 5433 -d yyc3_33 -f lib/db/migrations/001_optimize_v2.pgsql

# 或通过代码迁移（开发中）
npx tsx lib/db/migrations/index.ts
```

## 4. 开发命令

```bash
# 启动开发服务器 (port 3223)
bun run dev

# 类型检查
bun run type-check  # tsc --noEmit

# Lint
bun run lint        # ESLint 9 flat config

# 运行测试
bun run test                      # 全量测试
bun run test:lib                  # 核心库测试
bun run test:coverage             # 覆盖度报告

# 构建
bun run build      # next build

# 代码格式化
npx prettier --write .
```

---

<p align="center">
  <sub>® YYC³（YanYuCloudCube）言语云立方 丨 开发环境配置指南 v3.1.0 丨 2026-07-18</sub>
</p>
