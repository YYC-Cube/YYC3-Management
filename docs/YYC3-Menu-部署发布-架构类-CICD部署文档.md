# YYC3 CI/CD和部署文档

## 概述

本文档描述了YYC3项目的CI/CD管道和部署配置，包括Docker容器化、Kubernetes部署和自动化部署流程。

## 目录

- [Docker部署](#docker部署)
- [Kubernetes部署](#kubernetes部署)
- [CI/CD管道](#cicd管道)
- [监控和日志](#监控和日志)
- [故障排查](#故障排查)

## Docker部署

### 前置要求

- Docker 20.10+
- Docker Compose 2.0+

### 快速开始

```bash
# 克隆仓库
git clone https://github.com/your-org/yyc3.git
cd yyc3

# 使用部署脚本
./deploy.sh start

# 或者手动启动
docker-compose up -d
```

### 环境配置

创建 `.env.docker` 文件并配置必要的环境变量：

```bash
# 应用配置
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# 数据库配置
DATABASE_URL=postgresql://yyc3user:yyc3password@postgres:5432/yyc3db

# Redis配置
REDIS_URL=redis://redis:6379

# AI服务配置
AI_MODEL_PROVIDER=openai
AI_API_KEY=your-api-key-here
AI_MODEL=gpt-4

# 安全配置
JWT_SECRET=your-jwt-secret-here
ENCRYPTION_KEY=your-encryption-key-here
```

### 服务说明

| 服务 | 端口 | 说明 |
|------|------|------|
| app | 3000 | Next.js应用 |
| redis | 6379 | Redis缓存 |
| postgres | 5432 | PostgreSQL数据库 |
| nginx | 80, 443 | Nginx反向代理 |

### 常用命令

```bash
# 启动服务
./deploy.sh start

# 停止服务
./deploy.sh stop

# 重启服务
./deploy.sh restart

# 查看日志
./deploy.sh logs

# 查看状态
./deploy.sh status

# 清理资源
./deploy.sh cleanup
```

## Kubernetes部署

### 前置要求

- kubectl 1.25+
- Kubernetes集群 1.25+
- Helm 3.0+ (可选)

### 快速开始

```bash
# 克隆仓库
git clone https://github.com/your-org/yyc3.git
cd yyc3

# 使用部署脚本
./k8s/deploy.sh deploy

# 或者手动部署
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/config.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/app.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/security.yaml
```

### 配置说明

#### 命名空间

- 名称: `yyc3`
- 用途: 隔离YYC3应用资源

#### 配置和密钥

- ConfigMap: `yyc3-config` - 应用配置
- Secret: `yyc3-secrets` - 敏感信息

#### 部署配置

| 组件 | 副本数 | 资源请求 | 资源限制 |
|------|--------|----------|----------|
| app | 3 | 512Mi/250m | 1Gi/1000m |
| redis | 1 | 256Mi/100m | 512Mi/500m |
| postgres | 1 | 512Mi/250m | 2Gi/1000m |

#### 自动扩缩容

- 最小副本: 3
- 最大副本: 10
- CPU目标利用率: 70%
- 内存目标利用率: 80%

### 常用命令

```bash
# 部署应用
./k8s/deploy.sh deploy

# 删除部署
./k8s/deploy.sh delete

# 查看状态
./k8s/deploy.sh status

# 查看日志
./k8s/deploy.sh logs

# 扩缩容
./k8s/deploy.sh scale 5

# 查看Pod状态
kubectl get pods -n yyc3

# 查看服务状态
kubectl get svc -n yyc3

# 查看Ingress状态
kubectl get ingress -n yyc3
```

## CI/CD管道

### GitHub Actions工作流

项目使用GitHub Actions实现CI/CD自动化，包含以下工作流：

#### 1. CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

**触发条件:**
- 推送到 main 或 develop 分支
- Pull Request 到 main 或 develop 分支
- 手动触发

**工作流步骤:**
1. **代码检查**
   - ESLint检查
   - cSpell拼写检查

2. **测试**
   - 单元测试
   - 集成测试
   - E2E测试
   - 测试覆盖率报告

3. **构建**
   - Next.js应用构建
   - Docker镜像构建
   - 安全扫描

4. **部署**
   - Docker镜像推送到GHCR
   - Kubernetes部署

#### 2. Code Quality (`.github/workflows/code-quality.yml`)

**触发条件:**
- 推送到 main 或 develop 分支
- Pull Request 到 main 或 develop 分支
- 每周日自动运行

**工作流步骤:**
1. **代码质量检查**
   - ESLint检查
   - Prettier格式检查
   - TypeScript类型检查

2. **复杂度分析**
   - 代码复杂度分析
   - 重复代码检测

3. **安全扫描**
   - 依赖漏洞扫描
   - 代码安全分析

### 部署流程

1. **开发环境**
   - 推送到 `develop` 分支
   - 自动运行CI检查
   - 部署到开发环境

2. **生产环境**
   - 合并到 `main` 分支
   - 自动运行完整CI/CD流程
   - 部署到生产环境

### 环境变量配置

在GitHub仓库设置中配置以下Secrets:

| Secret名称 | 说明 |
|-----------|------|
| DOCKER_USERNAME | Docker Hub用户名 |
| DOCKER_PASSWORD | Docker Hub密码 |
| GHCR_TOKEN | GitHub Container Registry Token |
| KUBE_CONFIG | Kubernetes配置 |
| SLACK_WEBHOOK | Slack通知Webhook |

## 监控和日志

### 健康检查

应用提供以下健康检查端点:

- `/api/health` - 健康检查
- `/api/ready` - 就绪检查
- `/api/live` - 存活检查

### 日志查看

```bash
# Docker环境
docker-compose logs -f app

# Kubernetes环境
kubectl logs -f -n yyc3 -l app=yyc3

# 查看所有Pod日志
kubectl logs -f -n yyc3 --all-containers=true
```

### 监控指标

应用暴露以下监控指标:

- HTTP请求指标
- 数据库连接指标
- Redis缓存指标
- AI服务调用指标
- 自定义业务指标

## 故障排查

### 常见问题

#### 1. 容器启动失败

```bash
# 查看容器日志
docker-compose logs app

# 检查环境变量
docker-compose config

# 重新构建
docker-compose up -d --build
```

#### 2. 数据库连接失败

```bash
# 检查数据库状态
docker-compose ps postgres

# 查看数据库日志
docker-compose logs postgres

# 测试连接
docker-compose exec postgres psql -U yyc3user -d yyc3db
```

#### 3. Redis连接失败

```bash
# 检查Redis状态
docker-compose ps redis

# 查看Redis日志
docker-compose logs redis

# 测试连接
docker-compose exec redis redis-cli ping
```

#### 4. Pod无法启动

```bash
# 查看Pod状态
kubectl get pods -n yyc3

# 查看Pod详情
kubectl describe pod <pod-name> -n yyc3

# 查看Pod日志
kubectl logs <pod-name> -n yyc3

# 查看事件
kubectl get events -n yyc3 --sort-by='.lastTimestamp'
```

#### 5. Ingress无法访问

```bash
# 查看Ingress状态
kubectl get ingress -n yyc3

# 查看Ingress详情
kubectl describe ingress yyc3-ingress -n yyc3

# 查看Nginx Ingress Controller日志
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx
```

### 性能优化

#### 1. 资源优化

```bash
# 查看资源使用情况
kubectl top pods -n yyc3
kubectl top nodes

# 调整资源限制
kubectl edit deployment yyc3-app -n yyc3
```

#### 2. 扩缩容

```bash
# 手动扩缩容
kubectl scale deployment yyc3-app -n yyc3 --replicas=5

# 查看HPA状态
kubectl get hpa -n yyc3
```

#### 3. 缓存优化

```bash
# 查看Redis缓存状态
docker-compose exec redis redis-cli info stats

# 清理缓存
docker-compose exec redis redis-cli FLUSHALL
```

## 安全最佳实践

1. **使用非root用户运行容器**
2. **限制容器资源使用**
3. **使用Secrets管理敏感信息**
4. **启用网络策略**
5. **定期更新镜像和依赖**
6. **启用审计日志**
7. **使用TLS加密通信**
8. **实施RBAC权限控制**

## 备份和恢复

### 数据库备份

```bash
# 备份PostgreSQL数据库
docker-compose exec postgres pg_dump -U yyc3user yyc3db > backup.sql

# 恢复数据库
docker-compose exec -T postgres psql -U yyc3user yyc3db < backup.sql
```

### Redis备份

```bash
# 备份Redis数据
docker-compose exec redis redis-cli BGSAVE

# 复制RDB文件
docker cp redis:/data/dump.rdb ./backup/
```

## 联系支持

如有问题，请联系:
- 技术支持: support@yyc3.com
- 文档: https://docs.yyc3.com
- GitHub Issues: https://github.com/your-org/yyc3/issues
