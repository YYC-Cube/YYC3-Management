---
description: YYC³ 项目文档库总索引 — 所有文档的入口导航
author: YYC³ 标准化委员会 <admin@0379.email>
version: v3.1.0
created: 2026-07-17
updated: 2026-07-18
status: stable
tags: 文档库,索引,导航
category: index
language: zh-CN
audience: developers,architects,managers
complexity: beginner
---

# YYC³ 文档库总索引

> ***YanYuCloudCube***
> *言启千行代码 丨 语枢万物智能*

---

| 属性 | 值 |
|------|-----|
| **项目** | YYC³ 企业智能管理系统 (YYC3-Management) |
| **版本** | v3.1.0 |
| **基线** | `main` HEAD |
| **前端** | Next.js 16.2 + React 19 + shadcn/ui + Tailwind CSS v4 |
| **后端** | Next.js API Routes + PostgreSQL 15 |
| **语言** | TypeScript 7.0 (strict mode) |
| **包管理** | pnpm / Bun 1.3 |
| **测试** | Vitest v4 + Testing Library |
| **CI/CD** | GitHub Actions (6 workflows) ✅ 5/6 success |
| **数据库** | PostgreSQL 15.15 @ localhost:5433/yyc3_33 |
| **设计语言** | 全量语义化 Token (chart-1~5 / primary / success / muted) |

---

## 项目健康评分

| 维度 | 评分 | 状态 |
|------|:----:|:----:|
| 代码质量 | 9/10 | ✅ |
| 功能完整 | 8/10 | ✅ |
| 用户体验 | 9/10 | ✅ (设计语言语义化完成) |
| 技术架构 | 7/10 | ⚠️ (测试覆盖待提升) |
| 项目管理 | 7/10 | ⚠️ (CI 恢复中) |
| **综合** | **8.0/10** | **📈** |

---

## 文档架构

```
docs/
├── README.md                          ← 本文档（总入口）
├── OPERATIONS.md                      ← 操作手册
│
├── YYC3-Menu-文档规范/                ← 文档规范 & 模板
│   ├── YYC3-Menu-项目全量文档架构.md   ← 全量文档索引
│   ├── YYC3-Menu-文档规范-团队标准化规范.md
│   └── ...
│
├── YYC3-Menu-需求规划/                ← 需求 & 规划
│   ├── 架构类/                        ← 架构需求
│   └── 技巧类/                        ← 需求编写技巧
│
├── YYC3-Menu-架构设计/                ← 架构设计
│   ├── 架构类/                        ← 架构设计文档
│   └── 技巧类/                        ← 架构设计技巧
│
├── YYC3-Menu-开发实施/                ← 开发实施
│   ├── 架构类/                        ← 数据访问层/中间件/AI
│   └── 技巧类/                        ← TS规范/版本控制/效率
│
├── YYC3-Menu-测试验证/                ← 测试 & 验证
│   ├── 架构类/                        ← 测试架构
│   ├── 技巧类/                        ← 测试技巧
│   └── 报告/                          ← 测试报告
│
├── YYC3-Menu-部署发布/                ← 部署 & 运维
│   ├── 架构类/                        ← CI-CD/多环境/灰度
│   └── 技巧类/                        ← Docker/K8s/环境配置
│
├── YYC3-Menu-团队规范/                ← 团队规范
│   ├── YYC3-团队通用-开发文档.md       ← ⭐ 开发者核心文档
│   ├── YYC3-团队规范-开发标准.md       ← 开发标准
│   ├── YYC3-团队核心-五维驱动.md       ← 五维驱动理念
│   └── YYC3-Menu-闭环验收/            ← 闭环验收报告
│       ├── YYC3-Menu-全局现状审核报告.md        ← 全局审核 (v1.1.0)
│       ├── YYC3-Menu-数据库适用性分析报告.md    ← 数据库分析
│       ├── YYC3-Menu-底层测试与可视化报告.md    ← 测试报告
│       └── YYC3-Menu-统一化规范文档.md          ← 设计规范
│
├── YYC3-Menu-实施总结/                ← 实施总结
│   └── YYC3-Menu-实施总结-全局闭环最终报告.md
│
├── YYC3-Menu-运维运营/                ← 运维 & 运营
├── YYC3-Menu-归类迭代/                ← 归档 & 迭代
└── YYC3-Menu-演进拓展/                ← 演进 & 拓展
```

---

## 快速链接

| 用途 | 链接 |
|------|------|
| 开发环境配置 | [开发环境配置指南](./YYC3-Menu-部署发布/技巧类/YYC3-Menu-技巧类-开发环境配置.md) |
| 代码架构说明 | [代码架构实现说明书](./YYC3-Menu-开发实施/架构类/01-YYC3-Menu-架构类-代码架构实现说明书.md) |
| API 文档 | [API 接口文档](./YYC3-Menu-开发实施/架构类/YYC3-Menu-架构类-API接口文档.md) |
| 数据库分析 | [数据库适用性分析报告](./YYC3-Menu-团队规范/YYC3-Menu-闭环验收/YYC3-Menu-数据库适用性分析报告.md) |
| 全局审核 | [全局现状审核报告](./YYC3-Menu-团队规范/YYC3-Menu-闭环验收/YYC3-Menu-全局现状审核报告.md) |
| CI/CD 部署 | [CI/CD 流水线架构文档](./YYC3-Menu-部署发布/架构类/02-YYC3-Menu-架构类-CI_CD流水线架构文档.md) |
| 全量文档索引 | [项目全量文档架构](./YYC3-Menu-文档规范/YYC3-Menu-项目全量文档架构.md) |

---

## 技术栈速览

```
Frontend          Next.js 16.2 + React 19 + Tailwind CSS v4 + shadcn/ui
Type Checking     TypeScript 7.0 (strict mode) + tsc --noEmit
Linting           ESLint 9.39 (flat config: @next/eslint-plugin-next)
Testing           Vitest v4 + @testing-library/react + happy-dom
Database          PostgreSQL 15.15 (local: 5433/yyc3_33, user: yanyu)
Cache             Redis (local: 6379)
CI/CD             GitHub Actions (6 workflows, 5/6 ✅)
Package Manager   Bun 1.3 + pnpm (workspace)
```

---

<p align="center">
  <sub>® YYC³（YanYuCloudCube）言语云立方 丨 文档库总索引 v3.1.0 丨 2026-07-18</sub>
</p>
