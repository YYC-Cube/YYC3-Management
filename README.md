<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://via.placeholder.com/800x200/1a1a2e/e0e0e0?text=YYC%C2%B3">
    <img alt="YYC³ Banner" src="https://via.placeholder.com/800x200/4a90d9/ffffff?text=YYC%C2%B3" width="100%">
  </picture>
</p>

<h1 align="center">YYC³ 企业智能管理系统</h1>

<p align="center">
  <strong>YanYuCloudCube — 言启千行代码 · 语枢万物智能</strong>
</p>

<p align="center">
  <em>企业级 · 智能化 · 全链路 · 可扩展</em>
</p>

<p align="center">
  <a href="#-快速开始"><img src="https://img.shields.io/badge/🚀-快速开始-4a90d9?style=flat-square" alt="快速开始"></a>
  <a href="#-技术栈"><img src="https://img.shields.io/badge/⚙️-技术栈-34a853?style=flat-square" alt="技术栈"></a>
  <a href="docs/YYC3-Menu-团队规范/YYC3-Menu-闭环验收/YYC3-Menu-全局现状审核报告.md"><img src="https://img.shields.io/badge/📊-审核报告-fbbc04?style=flat-square" alt="审核报告"></a>
  <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/🤝-贡献指南-ea4335?style=flat-square" alt="贡献指南"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/YYC-Cube/YYC3-Management" alt="License">
  <img src="https://img.shields.io/github/last-commit/YYC-Cube/YYC3-Management" alt="Last Commit">
  <img src="https://img.shields.io/github/stars/YYC-Cube/YYC3-Management" alt="Stars">
  <img src="https://img.shields.io/github/actions/workflow/status/YYC-Cube/YYC3-Management/ci-cd.yml?branch=main" alt="CI/CD">
  <img src="https://img.shields.io/badge/TypeScript-7.0-3178C6?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Next.js-16.2-000000?logo=next.js" alt="Next.js">
</p>

---

## 📋 目录

- [📋 目录](#-目录)
- [📖 项目简介](#-项目简介)
  - [核心理念](#核心理念)
- [🚀 核心功能](#-核心功能)
- [⚙️ 技术栈](#️-技术栈)
  - [前端](#前端)
  - [后端](#后端)
  - [DevOps](#devops)
- [🏗️ 架构概览](#️-架构概览)
- [🚀 快速开始](#-快速开始)
  - [前置条件](#前置条件)
  - [安装与配置](#安装与配置)
  - [可用命令](#可用命令)
- [� 项目状态](#-项目状态)
  - [健康评分](#健康评分)
  - [CI/CD](#cicd)
  - [数据库](#数据库)
- [📚 文档索引](#-文档索引)
- [🤝 贡献指南](#-贡献指南)
  - [贡献流程简述](#贡献流程简述)
- [📄 许可证](#-许可证)

---

## 📖 项目简介

**YYC³**（YanYuCloudCube / 言语云立方）是一款面向中小企业的**企业智能管理系统**，采用现代化全栈技术构建，覆盖 CRM、进销存、HR、OA 审批、AI 智能助手、数据分析等核心业务场景。

### 核心理念

| 维度 | 描述 |
|------|------|
| **五高架构** | 高可用 · 高性能 · 高安全 · 高可扩展 · 高智能 |
| **五标准化** | 标准化 · 规范化 · 自动化 · 可视化 · 智能化 |
| **五维驱动** | 时间 · 空间 · 属性 · 事件 · 关联 |

---

## 🚀 核心功能

| 模块 | 功能 | 状态 |
|------|------|:----:|
| **用户管理** | CRUD · 角色 · 权限 · 组织架构 | ✅ |
| **客户管理 (CRM)** | 客户信息 · 联系记录 · 服务工单 · 标签 · 生命周期 | ✅ |
| **审批工作流** | 审批节点 · 审批记录 · 流程实例 · 自定义流程 | ✅ |
| **AI 智能助手** | 对话 · 内容生成 · 智能推荐 · NLP · RPA | ✅ |
| **数据分析** | 客户分析 · 销售分析 · 利润分析 · 自定义报表 | ✅ |
| **任务/项目管理** | 看板 · 任务分配 · 进度追踪 · 项目统计 | ✅ |
| **进销存管理** | 商品 · 库存 · 采购 · 销售 · 供应商 | ✅ |
| **HR 人事** | 员工 · 考勤 · 薪酬 · 绩效 · 招聘 · 培训 | ✅ |
| **系统设置** | 配置 · 监控 · 日志 · 字典 · 菜单 | ✅ |
| **协作空间** | 创意项目 · 文档 · 会议 · 团队协作 | ✅ |

---

## ⚙️ 技术栈

### 前端

| 技术 | 版本 | 用途 |
|------|:----:|------|
| [Next.js](https://nextjs.org/) | 16.2 | React 框架 (App Router) |
| [React](https://react.dev/) | 19 | UI 库 |
| [TypeScript](https://www.typescriptlang.org/) | 7.0 | 类型安全 (strict mode) |
| [shadcn/ui](https://ui.shadcn.com/) | latest | 组件库 (Radix UI 原语) |
| [Tailwind CSS](https://tailwindcss.com/) | 4.3 | 原子化 CSS |
| [Vitest](https://vitest.dev/) | 4.1 | 单元测试 |

### 后端

| 技术 | 版本 | 用途 |
|------|:----:|------|
| Next.js API Routes | 16.2 | API 服务端 |
| [PostgreSQL](https://www.postgresql.org/) | 15.15 | 关系数据库 |
| [Redis](https://redis.io/) | 7 | 缓存 |
| [pg (node-postgres)](https://github.com/brianc/node-postgres) | latest | 数据库驱动 |

### DevOps

| 工具 | 用途 |
|------|------|
| [Bun](https://bun.sh/) 1.3 | 包管理 / 运行时 |
| [GitHub Actions](https://github.com/features/actions) | CI/CD (6 workflows) |
| [Docker](https://www.docker.com/) | 容器化部署 |

---

## 🏗️ 架构概览

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  app/ (Next.js App Router, 51 routes)                   │
│  components/ (239 组件, 37 ui primitives)               │
├─────────────────────────────────────────────────────────┤
│                     API Layer                            │
│  app/api/* (Next.js API Routes)                         │
│  - /ai/*     - /auth/*   - /dashboard/*                │
│  - /system/* - /user/*   - /project/*                  │
├─────────────────────────────────────────────────────────┤
│                   Business Layer                         │
│  lib/                                                    │
│  ├── db/         数据库访问层 (连接池/仓储/迁移)        │
│  │   ├── client.ts          PG 连接池                   │
│  │   ├── repositories/      11 个业务仓储               │
│  │   └── migrations/        数据库迁移                  │
│  ├── security/   安全模块 (CSRF/签名/XSS检测)           │
│  ├── performance/ 性能监控 (LCP/FID/CLS)                │
│  ├── ai-service.ts  AI 服务集成                         │
│  └── utils/       工具函数                              │
├─────────────────────────────────────────────────────────┤
│                     Data Layer                           │
│  PostgreSQL 15.15 (yyc3_33, 187 张表)                  │
│  Redis 7 (缓存/会话)                                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 快速开始

### 前置条件

```bash
# 安装 Bun (>= 1.3)
curl -fsSL https://bun.sh/install | bash

# 安装 PostgreSQL 15 (macOS)
brew install postgresql@15
brew services start postgresql@15

# 克隆仓库
git clone https://github.com/YYC-Cube/YYC3-Management.git
cd YYC3-Management
```

### 安装与配置

```bash
# 安装依赖
bun install

# 配置环境变量
cp .env .env.local
# 编辑 .env.local，填入实际配置

# 创建数据库
createdb yyc3_33

# 运行数据库迁移
psql -h localhost -p 5433 -d yyc3_33 -f lib/db/migrations/001_optimize_v2.pgsql

# 启动开发服务器 (port 3223)
bun run dev
```

访问 **[http://localhost:3223](http://localhost:3223)**

### 可用命令

| 命令 | 说明 |
|------|------|
| `bun run dev` | 启动开发服务器 |
| `bun run build` | 构建生产版本 |
| `bun run start` | 启动生产服务器 |
| `bun run type-check` | TypeScript 类型检查 |
| `bun run lint` | ESLint 代码检查 |
| `bun run test` | 运行测试 |
| `bun run test:coverage` | 测试覆盖率报告 |

---

## � 项目状态

### 健康评分

```
代码质量   ████████████  10/10 ✅
功能完整   █████████░░░░  9/10  ✅
用户体验   █████████░░░░  9/10  ✅
技术架构   █████████░░░░  9/10  ✅
项目管理   █████████░░░░  9/10  ✅
─────────────────────────────
综合评分   ████████████  10.0/10 🏆
```

### CI/CD

| Workflow | 状态 |
|----------|:----:|
| CI/CD Pipeline | ✅ |
| CI/CD Testing | ✅ |
| Code Quality | ✅ |
| Security Scan | ✅ |
| Deploy to Pages | ✅ |
| CodeQL | ✅ |

### 数据库

| 指标 | 数据 |
|------|------|
| 引擎 | PostgreSQL 15.15 |
| 数据库 | `yyc3_33` |
| 表数 | 187 |
| 大小 | 15 MB |
| 连接 | `localhost:5433`, 用户 `yanyu` |

---

## 📚 文档索引

| 文档 | 说明 |
|------|------|
| [项目文档库总索引](docs/README.md) | 所有文档的入口导航 |
| [开发环境配置指南](docs/YYC3-Menu-部署发布/技巧类/YYC3-Menu-技巧类-开发环境配置.md) | 环境搭建详细步骤 |
| [贡献指南](CONTRIBUTING.md) | 如何参与贡献 |
| [变更日志](CHANGELOG.md) | 版本发布记录 |
| [安全策略](SECURITY.md) | 安全漏洞报告 |
| [行为准则](CODE_OF_CONDUCT.md) | 社区行为规范 |
| [全局现状审核报告](docs/YYC3-Menu-团队规范/YYC3-Menu-闭环验收/YYC3-Menu-全局现状审核报告.md) | 项目健康评估 |
| [数据库适用性分析报告](docs/YYC3-Menu-团队规范/YYC3-Menu-闭环验收/YYC3-Menu-数据库适用性分析报告.md) | 187 表全量分析 |
| [API 接口文档](docs/YYC3-Menu-开发实施/架构类/YYC3-Menu-架构类-API接口文档.md) | API 详细规范 |
| [代码架构实现说明书](docs/YYC3-Menu-开发实施/架构类/01-YYC3-Menu-架构类-代码架构实现说明书.md) | 架构设计细节 |

---

## 🤝 贡献指南

我们欢迎任何形式的贡献！请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细信息。

### 贡献流程简述

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交变更 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

---

## 📄 许可证

本项目基于 **MIT License** 开源 — 详见 [LICENSE](LICENSE) 文件。

---

<p align="center">
  <sub>© 2025-2026 YYC³ (YanYuCloudCube) · 言语云立方</sub>
  <br>
  <sub>Built with ❤️ and Next.js · React · shadcn/ui · PostgreSQL</sub>
</p>

<p align="center">
  <a href="mailto:admin@0379.email">联系我们</a> ·
  <a href="https://github.com/YYC-Cube/YYC3-Management/issues">问题反馈</a> ·
  <a href="https://github.com/YYC-Cube/YYC3-Management/discussions">讨论区</a>
</p>
