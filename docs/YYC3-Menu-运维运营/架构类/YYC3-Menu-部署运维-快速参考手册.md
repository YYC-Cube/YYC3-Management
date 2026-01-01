# YYC³智能AI浮窗系统 - 快速参考手册

> 5分钟快速了解系统架构、部署和使用

---

## 🎯 系统概览

YYC³智能AI浮窗系统是一个基于微服务架构的智能AI平台，实现了：

- 🤖 **自治AI引擎**: 事件驱动的智能决策系统
- 🔌 **模型适配器**: 统一多模型接口（OpenAI、本地模型）
- 🧠 **学习系统**: 三层自适应学习架构
- 🎯 **目标管理**: OKR驱动的完整生命周期管理

---

## ⚡ 快速开始

### 1️⃣ 一键部署

```bash
# 克隆并进入项目
git clone <repo-url> && cd yyc3-mana

# 配置环境（填入真实API密钥）
cp .env.example .env.production
nano .env.production

# 执行部署脚本
chmod +x scripts/deploy-complete.sh
./scripts/deploy-complete.sh

# 等待2-3分钟，完成！
```

### 2️⃣ 访问系统

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端应用 | <http://localhost:3200> | 主界面 |
| API网关 | <http://localhost:8080> | REST API |
| Grafana | <http://localhost:3100> | 监控面板 (admin/admin123) |
| Prometheus | <http://localhost:9090> | 指标查询 |
| Jaeger | <http://localhost:16686> | 分布式追踪 |

---

## 🏗️ 架构速览

```
┌─────────────────────────────────────────────────┐
│  Frontend (Next.js)  ← 用户界面                 │
└──────────────┬──────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────┐
│  API Gateway (Nginx)  ← 负载均衡 + 限流         │
└───┬───────┬───────┬───────┬─────────────────────┘
    │       │       │       │
    ▼       ▼       ▼       ▼
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│AI引擎│ │模型 │ │学习 │ │目标 │
│:3000│ │:3001│ │:3002│ │:3003│
└──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘
   └───────┴───────┴───────┘
           │       │
    ┌──────┴───┐  │
    │ Redis    │  │  Prometheus
    │ MongoDB  │  │  Grafana
    │ Postgres │  │  Jaeger
    └──────────┘  └─ Kibana
```

---

## 📦 核心组件

### 1. 自治AI引擎 (Port 3000)

**职责**: 智能任务调度和决策
**文件**: `lib/autonomous-engine/AutonomousAIEngine.ts`

```typescript
// 发送消息
await engine.handleMessage({
  type: 'user_request',
  content: { action: 'analyze', data: {...} }
});

// 执行任务
const result = await engine.planAndExecute({
  goal: 'Analyze customer data',
  context: {...}
});
```

### 2. 模型适配器 (Port 3001)

**职责**: 统一AI模型调用接口
**文件**: `lib/model-adapter/`

```typescript
// 支持的模型
OpenAI: gpt-4-turbo-preview, gpt-3.5-turbo
Anthropic: claude-3-opus, claude-3-sonnet
Local: qwen, glm, llama (via Ollama)

// 使用示例
const adapter = ModelAdapterFactory.createAdapter('openai');
const response = await adapter.chat([
  { role: 'user', content: 'Hello' }
]);
```

### 3. 学习系统 (Port 3002)

**职责**: 多层次智能学习
**文件**: `lib/learning-system/UnifiedLearningSystem.ts`

```typescript
// 三层学习
行为层: 用户习惯识别 → 快速适应
策略层: 决策优化 → 提升成功率
知识层: 知识图谱 → 精准推荐
```

### 4. 目标管理 (Port 3003)

**职责**: OKR生命周期管理
**文件**: `lib/goal-management/EnhancedGoalManagement.ts`

```typescript
// 8阶段完整流程
创建 → 规划 → 执行 → 监控 → 调整 → 完成 → 评估 → 学习

// SMART验证 + OKR对齐 + 健康度评分
```

---

## 🛠️ 常用命令

### Docker管理

```bash
# 查看服务状态
docker-compose -f docker-compose.complete.yml ps

# 查看日志（实时）
docker-compose -f docker-compose.complete.yml logs -f <service-name>

# 重启服务
docker-compose -f docker-compose.complete.yml restart <service-name>

# 扩容服务
docker-compose -f docker-compose.complete.yml up -d --scale model-adapter=5

# 停止所有服务
docker-compose -f docker-compose.complete.yml down

# 停止并删除数据
docker-compose -f docker-compose.complete.yml down -v
```

### 健康检查

```bash
# 检查所有服务
curl http://localhost:3000/health  # AI引擎
curl http://localhost:3001/health  # 模型适配器
curl http://localhost:3002/health  # 学习系统
curl http://localhost:3003/health  # 目标管理
curl http://localhost:8080/health  # API网关
```

### 监控查询

```bash
# Prometheus指标
http://localhost:9090/graph
查询示例:
- rate(http_requests_total[5m])           # 请求率
- ai_engine_tasks_active                  # 活跃任务数
- histogram_quantile(0.95, ...)           # P95延迟

# Grafana仪表板
http://localhost:3100/dashboards
默认密码: admin/admin123
```

---

## 🐛 故障排查

### 问题1: 服务无法启动

```bash
# 1. 查看详细日志
docker-compose -f docker-compose.complete.yml logs <service>

# 2. 检查端口占用
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# 3. 检查磁盘空间
df -h

# 解决: 释放端口或增加资源
```

### 问题2: 数据库连接失败

```bash
# 1. 检查数据库服务
docker-compose -f docker-compose.complete.yml ps redis mongo postgres

# 2. 测试连接
docker-compose -f docker-compose.complete.yml exec redis redis-cli ping
docker-compose -f docker-compose.complete.yml exec mongo mongosh --eval "db.runCommand({ping:1})"

# 解决: 等待20-30秒让数据库完全启动
```

### 问题3: AI模型调用失败

```bash
# 1. 检查环境变量
docker-compose -f docker-compose.complete.yml exec model-adapter env | grep API_KEY

# 2. 验证API密钥
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# 解决: 更新 .env.production 中的API密钥
```

---

## 📊 性能优化

### 缓存配置

```bash
# Redis缓存
- AI响应: 1小时 TTL
- 用户会话: 30分钟 TTL
- 静态资源: 1年 TTL
```

### 限流设置

```nginx
# Nginx限流
普通API: 100 req/s
AI模型: 10 req/s（考虑成本）
连接数: 10个/IP
```

### 扩容策略

```bash
# 横向扩展（增加实例数）
docker-compose -f docker-compose.complete.yml up -d --scale model-adapter=5

# 垂直扩展（增加资源）
# 编辑 docker-compose.complete.yml
services:
  model-adapter:
    deploy:
      resources:
        limits:
          memory: 8G  # 从4G增加到8G
```

---

## 🔐 安全最佳实践

1. **密钥管理**
   - ⚠️ 切勿提交 `.env.production` 到Git
   - 使用强密码（16位+特殊字符）
   - 定期轮换API密钥

2. **网络隔离**
   - 后端数据库不暴露到公网
   - 使用Docker网络隔离

3. **SSL/TLS**

   ```nginx
   # 生产环境启用HTTPS
   listen 443 ssl http2;
   ssl_protocols TLSv1.2 TLSv1.3;
   ```

4. **访问控制**
   - API网关添加身份认证
   - 数据库创建只读用户
   - 日志记录所有操作

---

## 📚 文档导航

| 文档 | 说明 |
|------|------|
| [完整部署指南](DEPLOYMENT_GUIDE_COMPLETE.md) | 详细部署步骤和配置 |
| [架构设计文档](AI智能浮窗系统/01-可插拔式拖拽移动AI系统.md) | 核心架构设计 |
| [深度方案文档](AI智能浮窗系统/02-智能插拔式可移动AI执行方案.md) | 深度组件设计 |
| [API文档](AI_WIDGET_ENHANCED_ARCHITECTURE.md) | 完整API参考 |
| [实施报告](DEEP_ARCHITECTURE_IMPLEMENTATION_REPORT.md) | 实施成果总结 |

---

## 🎓 学习路径

### 初学者（1-2天）

1. 阅读本快速参考手册
2. 执行一键部署脚本
3. 访问Grafana监控面板
4. 查看示例页面 <http://localhost:3200/enhanced-ai-demo>

### 进阶（3-5天）

1. 阅读完整部署指南
2. 了解核心组件实现
3. 调试单个微服务
4. 配置Prometheus告警

### 高级（1-2周）

1. 研究架构设计文档
2. 自定义模型适配器
3. 扩展学习系统
4. 实现自定义优化循环

---

## 💬 常见问题

**Q: 最低系统配置要求？**
A: 4核CPU + 8GB内存 + 50GB磁盘

**Q: 支持哪些AI模型？**
A: OpenAI (GPT-4/3.5)、Anthropic (Claude)、本地模型 (Ollama)

**Q: 如何备份数据？**

```bash
# MongoDB备份
docker-compose exec mongo mongodump --out /backup

# PostgreSQL备份
docker-compose exec postgres pg_dump yyc3 > backup.sql
```

**Q: 如何升级系统？**

```bash
# 1. 备份数据
# 2. 拉取最新代码
git pull origin main

# 3. 重新构建
docker-compose -f docker-compose.complete.yml build

# 4. 重启服务
docker-compose -f docker-compose.complete.yml up -d
```

**Q: 如何查看系统资源使用？**

```bash
# 实时资源监控
docker stats

# 访问Grafana仪表板
open http://localhost:3100
```

---

## 🆘 获取帮助

遇到问题？

1. 查看本手册的故障排查章节
2. 阅读完整部署指南
3. 检查日志文件
4. 访问监控面板诊断
5. 联系技术支持

---

**最后更新**: 2024-01-15 | **版本**: v1.0.0
