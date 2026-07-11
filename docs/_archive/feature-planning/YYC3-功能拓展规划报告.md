# 📋 YYC³ v3.0 功能拓展规划报告

> **版本**: v3.0 | **日期**: 2026-07-11
> **基线**: 5个真实功能 + 22个API路由 + 14张数据库表
> **目标**: 从"5个真实功能"到"20+真实功能"，全面消灭Mock数据

---

## 一、现状基线

### 已有真实功能 (5个)

| 功能 | API | 数据库 | Hook | 前端连接 |
|------|-----|--------|------|----------|
| 客户管理 | ✅ CRUD+搜索 | ✅ | ✅ useCustomers | ✅ |
| 任务管理 | ✅ CRUD+状态 | ✅ | ✅ useTasks | ✅ |
| 项目管理 | ✅ CRUD | ✅ | ✅ useProjects | ✅ |
| 用户管理 | ✅ CRUD+搜索 | ✅ | ✅ useUsers | ✅ |
| AI对话 | ✅ GLM-4 | — | — | ✅ |

### 已有后端但前端未连接 (4个 — "接线"即可激活)

| 功能 | 后端状态 | 前端现状 | 工作量 |
|------|---------|---------|--------|
| **财务管理** | Repository+API+Hook 完整 | 页面用硬编码¥金额 | **0.5天** |
| **工作流审批** | 引擎+API 完整 | 页面用假审批数据 | **1天** |
| **通知系统** | API存在(返回空) | 5条假通知 | **1天** |
| **实时推送** | SSE端点+Hook 完整 | 零使用 | **0.5天** |

### 数据库表已建但无代码 (3个)

| 表 | 迁移文件 | 需要 |
|---|---------|------|
| okr_objectives | 009 | Repository + API + Hook |
| okr_key_results | 010 | 同上 |
| notifications | 005 | 连接现有API至DB |

---

## 二、功能拓展清单

### P0 — "接线"激活已有后端 (第1周, 3天)

| # | 功能 | 描述 | 技术路径 | 工作量 |
|---|------|------|---------|--------|
| F-01 | **财务页面连接** | finance/page.tsx → useFinance Hook | 替换硬编码→SWR数据 | 0.5天 |
| F-02 | **通知系统真实化** | 连接notifications API至DB + 前端 | 写NotificationRepository + 前端用Hook | 1天 |
| F-03 | **审批页面连接** | oa-approval组件 → /api/workflows | 替换假数据→真实工作流引擎 | 1天 |
| F-04 | **实时通知推送** | Header集成useRealtime | SSE订阅 + 通知徽章实时更新 | 0.5天 |

### P1 — 核心功能补全 (第2-3周, 10天)

| # | 功能 | 描述 | 技术路径 | 工作量 |
|---|------|------|---------|--------|
| F-05 | **OKR管理后端化** | 连接okr_objectives表 | Repository+API+Hook+前端 | 3天 |
| F-06 | **数据导出中心** | 通用CSV/Excel/PDF导出API | /api/export + 复用lib/utils/data-import-export | 2天 |
| F-07 | **通知偏好设置** | 用户可配置通知渠道(站内/邮件/推送) | settings表扩展 + /api/notifications/preferences | 2天 |
| F-08 | **系统监控真实化** | 真实CPU/内存/磁盘指标 | /api/system/monitor → Node.js os模块 | 1天 |
| F-09 | **日程管理后端化** | schedule页面 → 真实CRUD | migration + repository + API + 前端 | 2天 |

### P2 — 智能化增强 (第4-5周, 10天)

| # | 功能 | 描述 | 技术路径 | 工作量 |
|---|------|------|---------|--------|
| F-10 | **AI智能报表** | 自然语言→数据报表 | /api/ai/report → GLM-4分析+recharts | 3天 |
| F-11 | **客户画像360** | 客户全息视图(订单+任务+沟通+AI评分) | /api/customers/[id]/profile → 聚合查询+AI评分 | 3天 |
| F-12 | **智能任务分配** | AI推荐最优负责人 | /api/ai/task-assign → 基于负载+技能匹配 | 2天 |
| F-13 | **异常检测告警** | 自动检测数据异常(收入下降/任务积压) | 定时扫描+AI判断+SSE推送 | 2天 |

### P3 — 集成与生态 (第6-8周, 15天)

| # | 功能 | 描述 | 技术路径 | 工作量 |
|---|------|------|---------|--------|
| F-14 | **微信OAuth登录** | 微信扫码登录 | /api/auth/wechat → OAuth callback | 3天 |
| F-15 | **开放API v1** | 版本化API + OpenAPI文档 | /api/v1/ 前缀 + swagger.json | 3天 |
| F-16 | **Webhook系统** | 事件→外部Webhook推送 | /api/webhooks + 注册管理 + HMAC签名 | 3天 |
| F-17 | **邮件通知** | SMTP邮件发送 | nodemailer + /api/notifications/email | 2天 |
| F-18 | **数据备份导出** | 全量数据备份/恢复 | /api/backup + pg_dump集成 | 2天 |
| F-19 | **移动端PWA增强** | 离线编辑+推送+安装提示 | SW升级 + push notification API | 2天 |

---

## 三、价值评估与优先级矩阵

```
  高价值
    │
    │  F-01(财务接线)     F-05(OKR)        F-10(AI报表)
    │  F-02(通知真实化)   F-06(导出)       F-11(客户360)
    │  F-03(审批连接)     F-08(监控)       F-14(微信OAuth)
    │  F-04(实时推送)
    │─────────────────────────────────────────
    │  F-07(通知偏好)     F-09(日程)       F-15(开放API)
    │  F-17(邮件)                          F-16(Webhook)
    │                                      F-18(备份)
  低价值
    低难度                                  高难度
```

---

## 四、技术实现路径

### 架构原则

1. **SWR优先**: 所有新功能使用 `useSWRResource<T>()` 或 `useSWR()`
2. **缓存优先**: 列表API使用 `withCache()`, 变更时 `invalidateResourceCache()`
3. **认证守卫**: 所有API路由 `authenticateApiRequest()` 开头
4. **审计日志**: 所有变更操作 `writeAuditLog()`
5. **语义化UI**: 使用 `StatusBadge` / `PageLoadingSkeleton` / `<Button>` / `<Card>`

### 数据流标准

```
用户操作 → SWR Hook → API路由(auth+cache+validation) → Repository(parameterized SQL) → PostgreSQL
                ↑                                                         ↓
                └────────── SWR mutate (乐观更新) ← invalidateResourceCache ←┘
```

### 技术选型

| 需求 | 方案 | 理由 |
|------|------|------|
| 实时通知 | SSE (已有) | 比WebSocket轻量, Next.js原生支持 |
| 导出 | xlsx + papaparse (已有) | 零新增依赖 |
| 邮件 | nodemailer | 企业标配 |
| OAuth | 自实现(微信API) | 避免引入Passport.js过重 |
| 文档 | OpenAPI 3.0 JSON | 自动生成 |
| AI分析 | ZhipuAdapter (已有) | GLM-4-flash免费额度 |

---

## 五、资源需求与时间表

| 阶段 | 时间 | 人力 | 交付物 |
|------|------|------|--------|
| **P0 接线周** | 第1周 (3天) | 1人 | 4个功能从Mock→真实 |
| **P1 核心补全** | 第2-3周 (10天) | 1-2人 | 5个新功能后端化 |
| **P2 智能化** | 第4-5周 (10天) | 1-2人 | 4个AI驱动功能 |
| **P3 集成生态** | 第6-8周 (15天) | 2人 | 6个集成功能 |
| **总计** | **8周** | — | **19个功能** |

### 关键里程碑

| 里程碑 | 日期(估) | 验收标准 |
|--------|---------|---------|
| M1: Mock清零 | 第1周末 | finance/notifications/approval/realtime 全部连接真实后端 |
| M2: 核心补全 | 第3周末 | OKR/导出/监控/日程 全部后端化, 真实功能数≥10 |
| M3: AI增强 | 第5周末 | AI报表/客户360/智能分配/异常检测 可用 |
| M4: 集成就绪 | 第8周末 | 微信登录/开放API/Webhook/邮件 可用 |

### 预期效果

| 指标 | 当前 | M1后 | M2后 | M4后 |
|------|------|------|------|------|
| 真实功能数 | 5 | **9** | **14** | **20+** |
| Mock数据页面 | ~13 | **~9** | **~4** | **0** |
| API路由数 | 22 | 24 | 32 | 40+ |
| 竞品对标评分 | 3/10 | 5/10 | 7/10 | 8.5/10 |
