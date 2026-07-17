---
description: YYC3 YYC3 项目文档 - 📅 YYC³ 功能拓展实施计划
author: YYC3 团队 <admin@0379.email>
version: v3.0.0
created: 2026-07-18
updated: 2026-07-18
status: stable
tags: documentation
category: general
language: zh-CN
audience: developers
complexity: intermediate
---

# 📅 YYC³ 功能拓展实施计划

> **版本**: v3.0 | **日期**: 2026-07-11
> **周期**: 8周 | **阶段**: P0(接线) → P1(补全) → P2(智能化) → P3(集成)

---

## 一、任务分解

### P0: 接线激活已有后端 (第1周)

| 任务ID | 任务 | 依赖 | 工作量 | 负责模块 |
|--------|------|------|--------|---------|
| P0-T01 | 财务页面连接 useFinance | 无 | 0.5天 | app/finance/ |
| P0-T02 | NotificationRepository 编写 | 无 | 0.5天 | lib/db/ |
| P0-T03 | 通知API连接DB | P0-T02 | 0.3天 | app/api/notifications/ |
| P0-T04 | 通知页面用Hook替换假数据 | P0-T03 | 0.3天 | app/notifications/ |
| P0-T05 | 审批页面连接 /api/workflows | 无 | 1天 | components/oa-approval.tsx |
| P0-T06 | Header集成useRealtime | P0-T03 | 0.4天 | components/header.tsx |

**P0 里程碑验收**: finance/notifications/approval 三个页面不再包含任何硬编码业务数据。

### P1: 核心功能补全 (第2-3周)

| 任务ID | 任务 | 依赖 | 工作量 |
|--------|------|------|--------|
| P1-T01 | OKR Model + Repository | 无 | 0.5天 |
| P1-T02 | OKR API路由 | P1-T01 | 0.5天 |
| P1-T03 | OKR Hook + 前端连接 | P1-T02 | 2天 |
| P1-T04 | 导出API (/api/export) | 无 | 2天 |
| P1-T05 | 通知偏好设置 | P0-T02 | 2天 |
| P1-T06 | 系统监控真实化 | 无 | 1天 |
| P1-T07 | 日程管理 migration+API+前端 | 无 | 2天 |

**P1 里程碑验收**: 真实功能数 ≥ 10, Mock数据页面 ≤ 5。

### P2: 智能化增强 (第4-5周)

| 任务ID | 任务 | 依赖 | 工作量 |
|--------|------|------|--------|
| P2-T01 | AI智能报表 API | P1完成 | 3天 |
| P2-T02 | 客户画像360 API | 无 | 3天 |
| P2-T03 | 智能任务分配 API | 无 | 2天 |
| P2-T04 | 异常检测+告警 | P0-T06 | 2天 |

### P3: 集成与生态 (第6-8周)

| 任务ID | 任务 | 依赖 | 工作量 |
|--------|------|------|--------|
| P3-T01 | 微信OAuth登录 | 无 | 3天 |
| P3-T02 | 开放API v1 + OpenAPI | 无 | 3天 |
| P3-T03 | Webhook系统 | 无 | 3天 |
| P3-T04 | 邮件通知 | 无 | 2天 |
| P3-T05 | 数据备份/恢复 | 无 | 2天 |
| P3-T06 | PWA增强 | 无 | 2天 |

---

## 二、里程碑

```
Week 1        Week 3         Week 5          Week 8
  │              │               │               │
  ▼              ▼               ▼               ▼
 M1: 接线完成  M2: 核心补全   M3: AI增强     M4: 集成就绪
 ─────────    ──────────     ─────────     ──────────
 4功能激活     OKR+导出       AI报表         微信OAuth
 Mock-4       +监控+日程     客户360         开放API
              真实功能≥10    智能分配        Webhook
                            异常检测        邮件+备份
```

### 里程碑验收标准

| 里程碑 | 验收项 | 测试方法 |
|--------|--------|---------|
| **M1** | finance/notifications/approval 页面无硬编码 | grep "模拟\|mock\|hardcode" = 0 |
| **M2** | OKR/日程 CRUD可用, 导出功能可用 | 手动操作测试 |
| **M3** | AI报表生成≥3种, 客户360显示评分 | API调用测试 |
| **M4** | 微信扫码登录, OpenAPI文档可访问 | 集成测试 |

---

## 三、风险评估

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|---------|
| AI API费用超预算 | 中 | 中 | 使用GLM-4-flash免费额度 + 缓存AI响应 + 请求频率限制 |
| SSE连接不稳定 | 低 | 中 | 降级为30s轮询作为fallback |
| OKR表结构与组件不匹配 | 中 | 低 | 先读取migration DDL, 对齐字段 |
| 导出大数据量OOM | 低 | 高 | 流式导出 + 分页查询 + 10万行限制 |
| 微信OAuth审核延迟 | 高 | 中 | 先开发调试模式(mock OAuth), 后接入真实 |
| 前端Mock数据替换引入bug | 中 | 中 | 逐页面替换 + 每个页面替换后验证 |

---

## 四、质量保障计划

### 测试策略

| 层级 | 方法 | 覆盖目标 |
|------|------|---------|
| API单元测试 | Vitest + route handler直接调用 | 每个新API路由至少3个测试 |
| 组件测试 | RTL + renderWithProviders | 新组件 ≥ 1 smoke test |
| 集成测试 | API → Repository → DB (mock) | 关键CRUD流程 |
| E2E | Playwright (M4阶段引入) | 登录→CRUD→导出 核心流程 |

### 代码质量

| 检查项 | 工具 | 频率 |
|--------|------|------|
| TypeScript零error | `tsc --noEmit` | 每次提交 |
| ESLint零warning | `next lint` | 每次提交 |
| `any`类型 = 0 | grep | 每次提交 |
| 新功能有Zod验证 | code review | 每次PR |
| 新API有认证守卫 | code review | 每次PR |

### 文档同步

| 文档 | 更新时机 |
|------|---------|
| README.md | 每个里程碑 |
| AGENTS.md | 新增模块时 |
| STANDARDS.md | 发现新的不一致时 |
| FEATURE-SPEC.md | 新功能设计时 |
| ISSUE-LIST.md | 发现新问题时 |
