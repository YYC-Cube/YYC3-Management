# YYC³智能AI浮窗系统 - 完整部署指南

> 基于《02-智能插拔式可移动AI执行方案.md》的深度架构实现

## 📋 目录

- [系统架构概览](#系统架构概览)
- [部署前准备](#部署前准备)
- [快速部署](#快速部署)
- [组件说明](#组件说明)
- [配置详解](#配置详解)
- [监控和运维](#监控和运维)
- [故障排查](#故障排查)
- [性能优化](#性能优化)
- [安全加固](#安全加固)

---

## 系统架构概览

### 架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         用户访问层                                │
│                    Frontend (Next.js)                            │
│                   http://localhost:3200                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API网关层                                   │
│                    Nginx (负载均衡)                               │
│                   http://localhost:8080                          │
└────────┬────────────┬────────────┬────────────┬─────────────────┘
         │            │            │            │
         ▼            ▼            ▼            ▼
┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│自治AI引擎  │ │模型适配器  │ │学习系统    │ │目标管理    │
│ :3000      │ │ :3001      │ │ :3002      │ │ :3003      │
└──────┬─────┘ └──────┬─────┘ └──────┬─────┘ └──────┬─────┘
       │              │              │              │
       └──────┬───────┴──────┬───────┴──────────────┘
              │              │
              ▼              ▼
┌──────────────────┐  ┌──────────────────┐
│   数据存储层      │  │    监控层        │
│                  │  │                  │
│  Redis :6379     │  │  Prometheus      │
│  MongoDB :27017  │  │  :9090           │
│  PostgreSQL      │  │                  │
│  :5432           │  │  Grafana :3100   │
│                  │  │                  │
│                  │  │  Jaeger :16686   │
└──────────────────┘  │                  │
                      │  Kibana :5601    │
                      └──────────────────┘
```

### 核心组件

| 组件 | 端口 | 职责 | 实现文档 |
|------|------|------|----------|
| 前端应用 | 3200 | 用户界面 | Next.js 14 |
| API网关 | 8080 | 请求路由、负载均衡 | Nginx |
| 自治AI引擎 | 3000 | 核心AI逻辑、任务调度 | AutonomousAIEngine.ts |
| 模型适配器 | 3001 | 多模型统一接口 | ModelAdapter系统 |
| 学习系统 | 3002 | 智能学习、优化 | UnifiedLearningSystem.ts |
| 目标管理 | 3003 | OKR管理、生命周期 | EnhancedGoalManagement.ts |
| Redis | 6379 | 缓存、会话 | - |
| MongoDB | 27017 | 文档存储 | - |
| PostgreSQL | 5432 | 关系数据 | - |
| Prometheus | 9090 | 指标采集 | - |
| Grafana | 3100 | 可视化监控 | - |
| Jaeger | 16686 | 分布式追踪 | - |

---

## 部署前准备

### 1. 系统要求

**最低配置**

- CPU: 4核心
- 内存: 8GB RAM
- 磁盘: 50GB 可用空间
- 系统: Linux/macOS/Windows with WSL2

**推荐配置**

- CPU: 8核心+
- 内存: 16GB+ RAM
- 磁盘: 100GB+ SSD
- 网络: 稳定的互联网连接（用于AI模型API）

### 2. 软件依赖

```bash
# Docker和Docker Compose
docker --version        # >= 20.10
docker-compose --version # >= 2.0

# Node.js（本地开发）
node --version          # >= 18.0

# Git
git --version           # >= 2.30

# 可选：性能测试工具
hey --version           # HTTP负载测试
ab --version            # Apache Bench
```

### 3. 环境配置文件

创建 `.env.production` 文件：

```bash
# 数据库密码
MONGO_PASSWORD=your_secure_mongo_password_here
DB_PASSWORD=your_secure_postgres_password_here
REDIS_PASSWORD=your_secure_redis_password_here

# AI模型API密钥
OPENAI_API_KEY=sk-your-openai-api-key-here
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# 监控密码
GRAFANA_PASSWORD=your_secure_grafana_password

# 应用配置
NODE_ENV=production
LOG_LEVEL=info
```

**安全提示**：

- ⚠️ **切勿提交 `.env.production` 到版本控制**
- 使用强密码（至少16位，包含大小写字母、数字、特殊字符）
- 定期更换密码
- 使用密钥管理服务（如AWS Secrets Manager、Azure Key Vault）

---

## 快速部署

### 方案一：自动化脚本部署（推荐）

```bash
# 1. 克隆仓库
git clone <repository-url>
cd yyc3-mana

# 2. 配置环境
cp .env.example .env.production
nano .env.production  # 填入真实配置

# 3. 执行部署脚本
chmod +x scripts/deploy-complete.sh
./scripts/deploy-complete.sh

# 脚本会自动完成：
# ✅ 环境检查
# ✅ Docker镜像构建
# ✅ 基础设施启动（数据库）
# ✅ 核心服务启动
# ✅ 前端和网关启动
# ✅ 监控服务启动
# ✅ 健康检查
# ✅ 数据初始化
```

### 方案二：手动分步部署

#### 步骤1：启动基础设施

```bash
# 启动数据库服务
docker-compose -f docker-compose.complete.yml up -d redis mongo postgres

# 等待服务就绪
sleep 20

# 检查健康状态
docker-compose -f docker-compose.complete.yml ps
```

#### 步骤2：启动核心服务

```bash
# 构建镜像（如果需要）
docker-compose -f docker-compose.complete.yml build

# 启动核心服务
docker-compose -f docker-compose.complete.yml up -d \
    autonomous-engine \
    model-adapter \
    learning-system \
    goal-management

# 查看日志
docker-compose -f docker-compose.complete.yml logs -f autonomous-engine
```

#### 步骤3：启动前端和网关

```bash
# 启动前端和API网关
docker-compose -f docker-compose.complete.yml up -d api-gateway frontend

# 访问应用
open http://localhost:3200
```

#### 步骤4：启动监控（可选）

```bash
# 启动完整监控栈
docker-compose -f docker-compose.complete.yml up -d \
    prometheus \
    grafana \
    jaeger \
    elasticsearch \
    kibana

# 访问监控面板
open http://localhost:3100  # Grafana
open http://localhost:9090  # Prometheus
open http://localhost:16686 # Jaeger
```

---

## 组件说明

### 1. 自治AI引擎 (Autonomous Engine)

**职责**：

- 接收用户消息并解析意图
- 协调各子系统完成任务
- 管理任务生命周期
- 实时事件驱动决策

**关键功能**：

```typescript
// 核心能力
- 事件驱动 + 目标驱动混合架构
- MessageBus：消息总线，实现组件解耦
- TaskScheduler：智能任务调度和优先级管理
- StateManager：状态快照和恢复
```

**健康检查**：

```bash
curl http://localhost:3000/health
# 返回：{"status":"healthy","timestamp":"2024-01-15T10:00:00.000Z"}
```

**指标监控**：

```
# Prometheus指标
ai_engine_tasks_total           # 总任务数
ai_engine_tasks_active          # 活跃任务数
ai_engine_message_queue_size    # 消息队列长度
ai_engine_response_time_seconds # 响应时间
```

### 2. 模型适配器 (Model Adapter)

**职责**：

- 提供统一的AI模型调用接口
- 支持多种模型提供商（OpenAI、Anthropic、本地模型）
- 智能缓存和流式响应
- 模型健康检查和故障转移

**支持的模型**：

- OpenAI: GPT-4, GPT-3.5-turbo
- Anthropic: Claude 3 Opus/Sonnet/Haiku
- Local: Qwen, GLM, Llama via Ollama

**配置示例**：

```typescript
{
  provider: 'openai',
  model: 'gpt-4-turbo-preview',
  streaming: true,
  cacheEnabled: true,
  cacheTTL: 3600
}
```

**健康检查**：

```bash
curl http://localhost:3001/health
# 检查所有已注册模型的健康状态
```

### 3. 学习系统 (Learning System)

**职责**：

- 三层学习架构（行为层、策略层、知识层）
- 用户行为模式识别
- 决策策略优化
- 知识图谱构建和查询

**学习层级**：

| 层级 | 职责 | 学习对象 | 优化目标 |
|------|------|----------|----------|
| 行为层 | 短期适应 | 用户习惯 | 响应速度 |
| 策略层 | 中期优化 | 决策策略 | 任务成功率 |
| 知识层 | 长期积累 | 知识图谱 | 推荐准确度 |

**API示例**：

```bash
# 记录用户行为
curl -X POST http://localhost:3002/api/learning/behavior \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","action":"task_completed","context":{}}'

# 查询推荐
curl http://localhost:3002/api/learning/recommendations?userId=user123
```

### 4. 目标管理 (Goal Management)

**职责**：

- 完整的目标生命周期管理（8阶段）
- SMART目标验证
- OKR对齐检查
- 任务分解和里程碑管理

**生命周期**：

```
创建 → 规划 → 执行 → 监控 → 调整 → 完成 → 评估 → 学习
```

**API示例**：

```bash
# 创建目标
curl -X POST http://localhost:3003/api/goals \
  -H "Content-Type: application/json" \
  -d '{
    "title": "提升系统性能",
    "description": "优化响应时间至2秒以内",
    "type": "performance",
    "objectives": [...]
  }'

# 更新进度
curl -X PATCH http://localhost:3003/api/goals/goal-id/progress \
  -d '{"progress": 75, "healthScore": 85}'
```

---

## 配置详解

### Nginx API网关配置

**限流配置**：

```nginx
# 普通API限流：100 req/s
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/s;

# AI模型限流：10 req/s（考虑成本）
limit_req_zone $binary_remote_addr zone=model_limit:10m rate=10r/s;

# 连接数限制
limit_conn_zone $binary_remote_addr zone=conn_limit:10m;
```

**路由规则**：

```nginx
/api/engine/   → autonomous-engine:3000
/api/models/   → model-adapter:3001
/api/learning/ → learning-system:3002
/api/goals/    → goal-management:3003
/ws/engine     → WebSocket连接
```

**健康检查**：

```bash
curl http://localhost:8080/health
# 返回网关自身健康状态
```

### Prometheus监控配置

**抓取间隔**：

- 核心服务：10秒
- 数据库：15秒
- 前端：30秒

**指标保留**：

- 本地存储：30天
- 可配置远程写入（Cortex/Thanos）实现长期存储

**告警规则**（待配置）：

```yaml
# 示例：高错误率告警
- alert: HighErrorRate
  expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
  for: 5m
  annotations:
    summary: "服务 {{ $labels.service }} 错误率过高"
```

### Docker资源限制

| 服务 | CPU限制 | 内存限制 | CPU保留 | 内存保留 |
|------|---------|----------|---------|----------|
| autonomous-engine | 2核 | 2GB | 1核 | 1GB |
| model-adapter | 1核 | 4GB | 0.5核 | 2GB |
| learning-system | 4核 | 8GB | 2核 | 4GB |
| goal-management | 1核 | 2GB | - | - |
| frontend | 1核 | 1GB | - | - |
| redis | 0.5核 | 2GB | - | - |
| mongo | 2核 | 4GB | - | - |
| postgres | 1核 | 2GB | - | - |

---

## 监控和运维

### 访问监控面板

#### 1. Grafana仪表板

```bash
URL: http://localhost:3100
用户名: admin
密码: <GRAFANA_PASSWORD>
```

**预配置仪表板**：

- 系统概览：CPU、内存、磁盘、网络
- 应用指标：请求量、响应时间、错误率
- AI模型性能：调用次数、平均延迟、成功率
- 数据库监控：连接数、查询性能、缓存命中率

#### 2. Prometheus查询

```bash
URL: http://localhost:9090

# 常用查询
rate(http_requests_total[5m])          # 请求率
histogram_quantile(0.95, ...)           # P95响应时间
up{job="autonomous-engine"}             # 服务状态
```

#### 3. Jaeger分布式追踪

```bash
URL: http://localhost:16686

# 追踪完整请求链路
用户请求 → API网关 → 自治引擎 → 模型适配器 → 学习系统
```

#### 4. Kibana日志查询

```bash
URL: http://localhost:5601

# 创建索引模式
系统日志: system-logs-*
应用日志: app-logs-*
访问日志: access-logs-*
```

### 常用运维命令

```bash
# 查看所有服务状态
docker-compose -f docker-compose.complete.yml ps

# 查看实时日志
docker-compose -f docker-compose.complete.yml logs -f <service-name>

# 重启单个服务
docker-compose -f docker-compose.complete.yml restart autonomous-engine

# 扩容服务（以模型适配器为例）
docker-compose -f docker-compose.complete.yml up -d --scale model-adapter=5

# 查看资源使用
docker stats

# 进入容器调试
docker-compose -f docker-compose.complete.yml exec autonomous-engine sh

# 备份数据库
docker-compose -f docker-compose.complete.yml exec mongo mongodump --out /backup
docker-compose -f docker-compose.complete.yml exec postgres pg_dump yyc3 > backup.sql

# 清理未使用资源
docker system prune -a --volumes
```

---

## 故障排查

### 常见问题

#### 1. 服务无法启动

**症状**：`docker-compose up` 失败或服务不断重启

**排查步骤**：

```bash
# 1. 查看日志
docker-compose -f docker-compose.complete.yml logs <service-name>

# 2. 检查端口占用
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# 3. 检查磁盘空间
df -h

# 4. 检查内存
free -m  # Linux
vm_stat  # macOS

# 5. 验证配置文件
docker-compose -f docker-compose.complete.yml config
```

**解决方案**：

- 释放占用端口或修改配置文件端口
- 清理磁盘空间
- 增加Docker内存限制

#### 2. 数据库连接失败

**症状**：应用日志显示 `Connection refused` 或 `ECONNREFUSED`

**排查步骤**：

```bash
# 1. 检查数据库服务状态
docker-compose -f docker-compose.complete.yml ps redis mongo postgres

# 2. 测试数据库连接
docker-compose -f docker-compose.complete.yml exec redis redis-cli ping
docker-compose -f docker-compose.complete.yml exec mongo mongosh --eval "db.runCommand({ping:1})"
docker-compose -f docker-compose.complete.yml exec postgres psql -U postgres -c "SELECT 1"

# 3. 检查网络
docker network inspect yyc3-mana_yyc3-network
```

**解决方案**：

- 等待数据库完全启动（可能需要20-30秒）
- 检查 `.env.production` 中的密码配置
- 重启数据库服务

#### 3. AI模型调用失败

**症状**：模型适配器返回 `API key invalid` 或 `Rate limit exceeded`

**排查步骤**：

```bash
# 1. 验证API密钥
curl http://localhost:3001/health
# 查看哪些模型不健康

# 2. 检查环境变量
docker-compose -f docker-compose.complete.yml exec model-adapter env | grep API_KEY

# 3. 测试外部API连通性
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

**解决方案**：

- 验证 API 密钥正确性
- 检查 API 额度和限流
- 配置备用模型

#### 4. 内存不足 (OOM)

**症状**：服务被 Killed，日志显示 `OOMKilled`

**排查步骤**：

```bash
# 查看容器资源使用
docker stats --no-stream

# 查看系统内存
free -m
```

**解决方案**：

```bash
# 增加服务内存限制
# 编辑 docker-compose.complete.yml
services:
  autonomous-engine:
    deploy:
      resources:
        limits:
          memory: 4G  # 从2G增加到4G
```

#### 5. 网络超时

**症状**：请求超时或网关返回 `504 Gateway Timeout`

**排查步骤**：

```bash
# 1. 检查服务响应时间
time curl http://localhost:3000/health

# 2. 查看Nginx日志
docker-compose -f docker-compose.complete.yml logs api-gateway | grep "upstream timed out"

# 3. 检查网络延迟
docker-compose -f docker-compose.complete.yml exec frontend ping autonomous-engine
```

**解决方案**：

- 增加Nginx超时配置
- 优化慢查询
- 扩容服务实例

---

## 性能优化

### 1. 缓存策略

**Redis缓存配置**：

```bash
# 最大内存和淘汰策略
maxmemory 2gb
maxmemory-policy allkeys-lru
```

**应用层缓存**：

- AI响应缓存：1小时 TTL
- 用户会话：30分钟 TTL
- 静态资源：1年 TTL

### 2. 数据库优化

**MongoDB索引**：

```javascript
// 已创建索引
db.goals.createIndex({ userId: 1, status: 1 })
db.goals.createIndex({ 'title': 'text', 'description': 'text' })
db.ai_conversations.createIndex({ userId: 1, timestamp: -1 })
```

**PostgreSQL调优**：

```sql
-- 已配置的扩展
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- 模糊查询
CREATE EXTENSION IF NOT EXISTS "btree_gin";  -- 复合索引
```

### 3. 负载均衡

**横向扩展**：

```bash
# 扩展模型适配器到5个实例
docker-compose -f docker-compose.complete.yml up -d --scale model-adapter=5

# Nginx会自动负载均衡
upstream model_adapter {
    least_conn;  # 最少连接算法
    server model-adapter:3001;
}
```

### 4. 性能基准测试

```bash
# HTTP负载测试
hey -n 10000 -c 100 http://localhost:8080/api/engine/health

# 结果示例
Summary:
  Total:        10.2341 secs
  Requests/sec: 977.13
  Average:      102.34 ms
  95th percentile: 250 ms
```

---

## 安全加固

### 1. 网络隔离

```yaml
# 生产环境配置
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # 后端网络不暴露

services:
  frontend:
    networks:
      - frontend
  autonomous-engine:
    networks:
      - frontend
      - backend
  mongo:
    networks:
      - backend  # 仅后端可访问
```

### 2. SSL/TLS配置

```nginx
# Nginx HTTPS配置
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

### 3. 数据库访问控制

```javascript
// MongoDB创建只读用户
db.createUser({
  user: "readonly",
  pwd: "secure_password",
  roles: [{ role: "read", db: "yyc3" }]
})
```

### 4. 密钥管理

```bash
# 使用Docker Secrets（Swarm模式）
echo "my_api_key" | docker secret create openai_key -

# 在服务中引用
services:
  model-adapter:
    secrets:
      - openai_key
```

### 5. 安全扫描

```bash
# Docker镜像安全扫描
docker scan yyc3-autonomous-engine

# 依赖漏洞扫描
npm audit
npm audit fix
```

---

## 附录

### A. 环境变量完整列表

| 变量名 | 必需 | 默认值 | 说明 |
|--------|------|--------|------|
| `NODE_ENV` | 是 | production | 运行环境 |
| `OPENAI_API_KEY` | 否 | - | OpenAI API密钥 |
| `ANTHROPIC_API_KEY` | 否 | - | Anthropic API密钥 |
| `MONGO_PASSWORD` | 是 | - | MongoDB密码 |
| `DB_PASSWORD` | 是 | - | PostgreSQL密码 |
| `REDIS_PASSWORD` | 是 | - | Redis密码 |
| `GRAFANA_PASSWORD` | 是 | admin123 | Grafana密码 |

### B. 端口映射完整列表

| 端口 | 服务 | 协议 | 说明 |
|------|------|------|------|
| 3200 | Frontend | HTTP | 前端应用 |
| 8080 | API Gateway | HTTP | API网关 |
| 3000 | Autonomous Engine | HTTP | 自治引擎 |
| 3001 | Model Adapter | HTTP | 模型适配器 |
| 3002 | Learning System | HTTP | 学习系统 |
| 3003 | Goal Management | HTTP | 目标管理 |
| 6379 | Redis | TCP | 缓存 |
| 27017 | MongoDB | TCP | 文档数据库 |
| 5432 | PostgreSQL | TCP | 关系数据库 |
| 9090 | Prometheus | HTTP | 指标采集 |
| 3100 | Grafana | HTTP | 监控面板 |
| 16686 | Jaeger | HTTP | 分布式追踪 |
| 9200 | Elasticsearch | HTTP | 日志存储 |
| 5601 | Kibana | HTTP | 日志查询 |

### C. 数据持久化

**Docker Volumes**：

```bash
# 查看所有数据卷
docker volume ls | grep yyc3

# 备份数据卷
docker run --rm -v yyc3_mongo-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/mongo-backup.tar.gz /data

# 恢复数据卷
docker run --rm -v yyc3_mongo-data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/mongo-backup.tar.gz -C /
```

### D. 相关文档链接

- [架构设计文档](docs/AI智能浮窗系统/01-可插拔式拖拽移动AI系统.md)
- [深度方案文档](docs/AI智能浮窗系统/02-智能插拔式可移动AI执行方案.md)
- [API文档](docs/AI_WIDGET_ENHANCED_ARCHITECTURE.md)
- [快速开始](docs/QUICK_START.md)

---

## 联系支持

如遇到问题，请：

1. 查看本文档的故障排查章节
2. 搜索GitHub Issues
3. 查看系统日志和监控面板
4. 联系技术支持团队

---

**最后更新**: 2024-01-15
**版本**: 1.0.0
