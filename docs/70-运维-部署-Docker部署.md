# Docker 部署指南

> **文档类型**: 实施
> **所属系列**: 运维部署
> **版本**: 1.0.0
> **创建日期**: 2026-01-03
> **最后更新**: 2026-01-03
> **维护人**: YYC³ DevOps Team

## 1. 概述

### 1.1 Docker化优势

- 🐳 **环境一致性** - 开发、测试、生产环境完全一致
- 🚀 **快速部署** - 秒级启动应用
- 📦 **依赖隔离** - 应用依赖完全隔离
- 🔧 **易于管理** - 统一的容器管理方式
- 📈 **可扩展性** - 支持水平扩展

### 1.2 架构设计

```mermaid
graph TB
    subgraph "应用层"
        A[Next.js App Container]
    end

    subgraph "数据层"
        B[(PostgreSQL Container)]
        C[(Redis Container)]
    end

    subgraph "反向代理"
        D[Nginx Container]
    end

    A --> B
    A --> C
    D --> A
```

## 2. Docker配置

### 2.1 Dockerfile

```dockerfile
# Dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

# 安装依赖
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production

# 复制源代码
COPY . .

# 构建应用
RUN bun run build

# 生产镜像
FROM oven/bun:1 AS production
WORKDIR /app

ENV NODE_ENV=production

# 复制构建产物
COPY --from=base /app/public ./public
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD bun --version || exit 1

# 启动应用
CMD ["node", "server.js"]
```

### 2.2 .dockerignore

```text
# Dependencies
node_modules
npm-debug.log
yarn-error.log
bun.lockb

# Testing
coverage
.nyc_output

# Next.js
.next/
out/
build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
```

### 2.3 docker-compose.yml

```yaml
version: '3.8'

services:
  # Next.js应用
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    container_name: yyc3-mana-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://yyc3:${POSTGRES_PASSWORD}@postgres:5432/yyc3_mana
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - yyc3-network
    volumes:
      - ./public:/app/public
      - ./.env.local:/app/.env.local:ro

  # PostgreSQL数据库
  postgres:
    image: postgres:16-alpine
    container_name: yyc3-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: yyc3
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: yyc3_mana
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - yyc3-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U yyc3"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis缓存
  redis:
    image: redis:7-alpine
    container_name: yyc3-redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - yyc3-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

  # Nginx反向代理
  nginx:
    image: nginx:alpine
    container_name: yyc3-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    networks:
      - yyc3-network

networks:
  yyc3-network:
    driver: bridge

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
```

### 2.4 Nginx配置

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name localhost;

        client_max_body_size 20M;

        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

## 3. 部署流程

### 3.1 构建镜像

```bash
# 构建应用镜像
docker build -t yyc3-mana:latest .

# 或使用docker-compose构建
docker-compose build

# 查看镜像
docker images | grep yyc3-mana
```

### 3.2 启动服务

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f app

# 查看特定服务日志
docker logs -f yyc3-mana-app
```

### 3.3 数据库初始化

```bash
# 运行数据库迁移
docker-compose exec app bun run db:migrate

# 填充种子数据
docker-compose exec app bun run db:seed

# 进入PostgreSQL
docker-compose exec postgres psql -U yyc3 -d yyc3_mana
```

## 4. 生产部署

### 4.1 环境变量

```bash
# .env.production
NODE_ENV=production
POSTGRES_PASSWORD=your_secure_password
```

### 4.2 构建生产镜像

```bash
# 构建优化后的镜像
docker build \
  --target production \
  --tag yyc3-mana:prod \
  --build-arg NODE_ENV=production \
  .

# 推送到镜像仓库
docker tag yyc3-mana:prod registry.example.com/yyc3-mana:latest
docker push registry.example.com/yyc3-mana:latest
```

### 4.3 启动生产环境

```bash
# 使用生产配置启动
docker-compose -f docker-compose.prod.yml up -d

# 验证服务
docker-compose ps
curl http://localhost/api/health
```

## 5. 容器管理

### 5.1 常用命令

```bash
# 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 停止容器
docker-compose stop

# 启动容器
docker-compose start

# 重启容器
docker-compose restart

# 删除容器
docker-compose down

# 删除容器和卷
docker-compose down -v
```

### 5.2 进入容器

```bash
# 进入应用容器
docker-compose exec app bash

# 进入PostgreSQL容器
docker-compose exec postgres sh

# 进入Redis容器
docker-compose exec redis sh
```

### 5.3 日志管理

```bash
# 查看实时日志
docker-compose logs -f

# 查看最近100行日志
docker-compose logs --tail=100

# 查看特定时间日志
docker-compose logs --since 2026-01-01T00:00:00

# 查看特定服务日志
docker-compose logs -f app
```

## 6. 数据备份

### 6.1 PostgreSQL备份

```bash
# 备份数据库
docker-compose exec postgres \
  pg_dump -U yyc3 yyc3_mana > backup_$(date +%Y%m%d).sql

# 从备份恢复
docker-compose exec -T postgres \
  psql -U yyc3 yyc3_mana < backup_20260103.sql
```

### 6.2 卷备份

```bash
# 备份PostgreSQL卷
docker run --rm \
  -v yyc3_postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/postgres_backup_$(date +%Y%m%d).tar.gz /data

# 备份Redis卷
docker run --rm \
  -v yyc3_redis_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/redis_backup_$(date +%Y%m%d).tar.gz /data
```

## 7. 监控和维护

### 7.1 健康检查

```bash
# 检查容器健康状态
docker ps --format "table {{.Names}}\t{{.Status}}"

# 手动健康检查
curl http://localhost:3000/api/health
```

### 7.2 资源监控

```bash
# 查看容器资源使用
docker stats

# 查看特定容器
docker stats yyc3-mana-app

# 查看容器详细信息
docker inspect yyc3-mana-app
```

### 7.3 性能优化

```yaml
# docker-compose优化
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 512M
    environment:
      - NODE_OPTIONS=--max-old-space-size=2048
```

## 8. 安全配置

### 8.1 最小权限

```dockerfile
# 使用非root用户
FROM oven/bun:1 AS base
WORKDIR /app

# 创建应用用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S bun -u 1001

# 切换到应用用户
USER bun
```

### 8.2 镜像扫描

```bash
# 使用Trivy扫描镜像漏洞
trivy image yyc3-mana:latest

# 修复发现的问题后重新构建
docker build --no-cache -t yyc3-mana:latest .
```

### 8.3 网络隔离

```yaml
# 创建隔离网络
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true

services:
  app:
    networks:
      - frontend
      - backend

  postgres:
    networks:
      - backend
```

## 9. 故障排查

### 9.1 常见问题

**容器启动失败**

```bash
# 查看容器日志
docker-compose logs app

# 检查容器状态
docker-compose ps

# 重新构建
docker-compose up -d --build
```

**网络连接问题**

```bash
# 检查网络
docker network ls
docker network inspect yyc3-network

# 重启网络
docker-compose down
docker-compose up -d
```

**数据库连接问题**

```bash
# 检查PostgreSQL状态
docker-compose exec postgres pg_isready

# 查看数据库日志
docker-compose logs postgres

# 重启数据库
docker-compose restart postgres
```

### 9.2 调试技巧

```bash
# 运行交互式容器
docker-compose run --rm app bash

# 查看容器进程
docker-compose exec app ps aux

# 检查环境变量
docker-compose exec app env

# 测试网络连接
docker-compose exec app ping postgres
```

## 10. 最佳实践

### 10.1 镜像优化

- ✅ 使用多阶段构建减小镜像大小
- ✅ 利用Docker缓存加速构建
- ✅ 使用`.dockerignore`排除不必要的文件
- ✅ 定期更新基础镜像修复安全漏洞

### 10.2 部署优化

- ✅ 使用健康检查确保服务可用
- ✅ 配置资源限制防止资源耗尽
- ✅ 使用卷持久化重要数据
- ✅ 实施定期备份策略

### 10.3 安全实践

- ✅ 不在镜像中包含敏感信息
- ✅ 使用环境变量管理配置
- ✅ 定期扫描镜像漏洞
- ✅ 使用最小权限原则运行容器

## 附录

### A. 相关文档

- [开发环境配置](./70-运维-部署-开发环境配置.md)
- [Kubernetes部署指南](./70-运维-部署-Kubernetes部署.md)
- [系统监控配置](./70-运维-监控-系统监控.md)

### B. 变更记录

| 版本 | 日期 | 作者 | 变更内容 |
|------|------|------|----------|
| 1.0.0 | 2026-01-03 | YYC³ | 初始版本 |

---

**维护团队**: YYC³ DevOps Team
**联系方式**: admin@0379.email
