# 开发环境配置指南

> **文档类型**: 实施
> **所属系列**: 运维部署
> **版本**: 1.0.0
> **创建日期**: 2026-01-03
> **最后更新**: 2026-01-03
> **维护人**: YYC³ DevOps Team

## 1. 概述

### 1.1 环境要求

```bash
# 系统要求
OS: macOS, Linux, Windows (WSL2)
RAM: 8GB+ (推荐16GB)
Disk: 20GB+ 可用空间

# 必需软件
Node.js: 18+ (通过Bun安装)
Bun: 1.0+
Git: 2.30+
Docker: 20.10+ (可选)
```

### 1.2 技术栈

- **运行时**: Bun 1.0+
- **框架**: Next.js 15
- **语言**: TypeScript 5.7
- **数据库**: PostgreSQL 16, Redis 7
- **容器**: Docker & Docker Compose

## 2. 环境搭建

### 2.1 安装Bun

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
irm bun.sh/install.ps1 | iex

# 验证安装
bun --version
```

### 2.2 克隆项目

```bash
# 克隆仓库
git clone https://github.com/yyc3/yyc3-mana.git
cd yyc3-mana

# 安装依赖
bun install
```

### 2.3 环境变量配置

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑配置
nano .env.local
```

```env
# .env.local 示例配置

# 应用配置
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# 数据库配置
DATABASE_URL="postgresql://user:password@localhost:5432/yyc3_mana"
REDIS_URL="redis://localhost:6379"

# AI服务配置
OPENAI_API_KEY=your_openai_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
OLLAMA_API_URL=http://localhost:11434

# 认证配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# 对象存储
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
```

## 3. 数据库设置

### 3.1 PostgreSQL

#### 使用Docker启动

```bash
# 创建Docker网络
docker network create yyc3-network

# 启动PostgreSQL
docker run -d \
  --name yyc3-postgres \
  --network yyc3-network \
  -e POSTGRES_USER=yyc3 \
  -e POSTGRES_PASSWORD=yyc3_password \
  -e POSTGRES_DB=yyc3_mana \
  -p 5432:5432 \
  -v yyc3_postgres_data:/var/lib/postgresql/data \
  postgres:16-alpine

# 验证连接
docker exec -it yyc3-postgres psql -U yyc3 -d yyc3_mana
```

#### 初始化数据库

```bash
# 运行迁移
bun run db:migrate

# 或使用Prisma
bunx prisma migrate dev

# 填充种子数据（可选）
bun run db:seed
```

### 3.2 Redis

```bash
# 启动Redis
docker run -d \
  --name yyc3-redis \
  --network yyc3-network \
  -p 6379:6379 \
  -v yyc3_redis_data:/data \
  redis:7-alpine

# 验证连接
docker exec -it yyc3-redis redis-cli ping
```

## 4. 开发服务器

### 4.1 启动开发服务器

```bash
# 开发模式（带热重载）
bun run dev

# 或指定端口
PORT=3001 bun run dev

# 生产模式构建
bun run build
bun run start
```

### 4.2 访问应用

```bash
# 主应用
http://localhost:3000

# API文档
http://localhost:3000/api/docs

# 健康检查
http://localhost:3000/api/health
```

## 5. 开发工具

### 5.1 代码质量工具

```bash
# TypeScript类型检查
bunx tsc --noEmit

# ESLint代码检查
bunx eslint . --ext .ts,.tsx

# Prettier格式化
bunx prettier --write "**/*.{ts,tsx,json,md}"

# 组合检查
bun run lint
bun run format
```

### 5.2 Git Hooks

```bash
# 安装Husky
bunx husky install

# 添加pre-commit钩子
echo "bun run lint-staged" > .husky/pre-commit
chmod +x .husky/pre-commit

# 添加commit-msg钩子
echo "bunx commitlint --edit \$1" > .husky/commit-msg
chmod +x .husky/commit-msg
```

### 5.3 VSCode配置

```json
// .vscode/settings.json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.tsx": "typescriptreact"
  }
}
```

```json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

## 6. 调试配置

### 6.1 Chrome DevTools

```typescript
// next.config.mjs
export default {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = 'cheap-module-source-map';
    }
    return config;
  }
};
```

### 6.2 VSCode调试

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "bun run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node-terminal",
      "request": "launch",
      "command": "bun run dev",
      "console": "integratedTerminal",
      "serverReadyAction": {
        "pattern": "started server on .+, url: (https?://.+)",
        "uriFormat": "%s",
        "action": "debugWithChrome"
      }
    }
  ]
}
```

## 7. 常用命令

### 7.1 开发命令

```bash
# 启动开发服务器
bun run dev

# 构建生产版本
bun run build

# 启动生产服务器
bun run start

# 类型检查
bun run type-check

# 代码检查
bun run lint

# 格式化代码
bun run format
```

### 7.2 数据库命令

```bash
# 运行迁移
bun run db:migrate

# 重置数据库
bun run db:reset

# 填充种子数据
bun run db:seed

# 打开Prisma Studio
bunx prisma studio
```

### 7.3 测试命令

```bash
# 运行所有测试
bun test

# 运行单元测试
bun test:unit

# 运行集成测试
bun test:integration

# 测试覆盖率
bun test:coverage

# 监听模式
bun test --watch
```

## 8. 故障排查

### 8.1 常见问题

**问题1: 端口被占用**

```bash
# 查找占用3000端口的进程
lsof -i :3000

# 杀死进程
kill -9 <PID>

# 或使用其他端口
PORT=3001 bun run dev
```

**问题2: 依赖安装失败**

```bash
# 清理缓存
rm -rf node_modules bun.lockb
bun install

# 或使用镜像
bun install --registry https://registry.npmmirror.com
```

**问题3: 数据库连接失败**

```bash
# 检查PostgreSQL状态
docker ps | grep postgres

# 查看日志
docker logs yyc3-postgres

# 重启数据库
docker restart yyc3-postgres
```

**问题4: TypeScript错误**

```bash
# 清理构建缓存
rm -rf .next
bun run build

# 重启TypeScript服务器
# 在VSCode中: Cmd+Shift+P -> "TypeScript: Restart TS Server"
```

### 8.2 日志查看

```bash
# 应用日志
tail -f logs/app.log

# 错误日志
tail -f logs/error.log

# Docker日志
docker logs -f yyc3-postgres
docker logs -f yyc3-redis
```

## 9. 性能优化

### 9.1 开发性能

```typescript
// vite.config.ts (如果使用Vite)
export default {
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
};
```

### 9.2 构建优化

```javascript
// next.config.mjs
export default {
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizeCss: true,
  },
};
```

## 10. 最佳实践

### 10.1 开发流程

1. **功能开发**
   ```bash
   git checkout -b feature/your-feature
   bun run dev
   # 开发...
   bun run type-check
   bun run lint
   bun test
   git commit -m "feat: add your feature"
   ```

2. **代码审查**
   ```bash
   # 提交前检查
   bun run type-check && bun run lint && bun test

   # 格式化代码
   bun run format
   ```

3. **提交代码**
   ```bash
   git add .
   git commit -m "type: description"
   git push origin feature/your-feature
   ```

### 10.2 环境管理

- ✅ 使用`.env.local`存储本地配置
- ✅ 不要提交`.env.local`到版本控制
- ✅ 为不同环境使用不同的环境变量文件
- ✅ 定期更新依赖: `bun update`

### 10.3 安全实践

- ✅ 不要在代码中硬编码密钥
- ✅ 使用环境变量管理敏感信息
- ✅ 定期更新依赖修复安全漏洞
- ✅ 使用`.gitignore`排除敏感文件

## 附录

### A. 相关文档

- [Docker部署指南](./70-运维-部署-Docker部署.md)
- [Kubernetes部署指南](./70-运维-部署-Kubernetes部署.md)
- [系统监控配置](./70-运维-监控-系统监控.md)

### B. 变更记录

| 版本 | 日期 | 作者 | 变更内容 |
|------|------|------|----------|
| 1.0.0 | 2026-01-03 | YYC³ | 初始版本 |

---

**维护团队**: YYC³ DevOps Team
**联系方式**: admin@0379.email
