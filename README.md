<picture>
  <source media="(prefers-color-scheme: dark)" srcset="Family-001.png">
  <source media="(prefers-color-scheme: light)" srcset="Family-001.png">
  <img alt="YYC³ 企业智能管理系统" src="Family-001.png" width="100%">
</picture>

# 🔖 YYC³ 企业智能管理系统 v3.0

> 「YanYuCloudCube」
> 「<admin@0379.email>」
> 「万象归元于云枢 丨深栈智启新纪元」

---

[![Version](https://img.shields.io/badge/Version-3.0.0-blue.svg)](https://github.com/yyc3/yyc3-mana/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deploy Pages](https://github.com/yyc3/yyc3-mana/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/yyc3/yyc3-mana/actions/workflows/deploy-pages.yml)
[![CI/CD Pipeline](https://github.com/yyc3/yyc3-mana/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/yyc3/yyc3-mana/actions/workflows/ci-cd.yml)
[![Code Quality](https://github.com/yyc3/yyc3-mana/actions/workflows/code-quality.yml/badge.svg)](https://github.com/yyc3/yyc3-mana/actions/workflows/code-quality.yml)
[![Security Scan](https://github.com/yyc3/yyc3-mana/actions/workflows/security-scan.yml/badge.svg)](https://github.com/yyc3/yyc3-mana/actions/workflows/security-scan.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178c6.svg)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8.svg)](https://tailwindcss.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-000000.svg)](https://ui.shadcn.com)
[![SWR](https://img.shields.io/badge/SWR-2.4-teal.svg)](https://swr.vercel.app)
[![Zustand](https://img.shields.io/badge/Zustand-5-orange.svg)](https://zustand-demo.pmnd.rs)
[![Zod](https://img.shields.io/badge/Zod-4-3e67b1.svg)](https://zod.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791.svg)](https://postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7-dc382d.svg)](https://redis.io)
[![Bun](https://img.shields.io/badge/Bun-1.1-f9f9f9.svg)](https://bun.sh)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deployed-222.svg)](https://management.yyc3.vip)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/yyc3/yyc3-mana/pulls)

**YYC³ 管理项目是一款现代化的企业级智能管理系统，基于 Next.js 16 + React 19 + TypeScript 7 构建**，涵盖客户管理、任务管理、项目管理、AI 助手、多平台渠道管理等核心业务模块，支持模型自主编辑配置、Ollama 本地扫描、可视化模型测试、统一认证架构。

---

## 📋 目录

- [快速开始](#-快速开始)
- [核心功能](#-核心功能)
- [技术栈](#-技术栈)
- [项目结构](#-项目结构)
- [API 文档](#-api-文档)
- [开发指南](#-开发指南)
- [部署](#-部署指南)

---

## ⚡ 快速开始

```bash
git clone https://github.com/yyc3/yyc3-mana.git
cd yyc3-mana
bun install     # 或 npm install
cp .env.example .env.local   # 配置环境变量
bun run dev      # 启动开发服务器 → localhost:3223
```

### 环境变量

```env
# 数据库
DATABASE_URL=postgresql://user:pass@localhost:5432/yyc3_mana

# Redis (缓存)
REDIS_URL=redis://localhost:6379

# AI (智谱GLM-4)
ZHIPU_API_KEY=your_key

# 认证
JWT_SECRET=your_secret_min_32_chars

# 前端
NEXT_PUBLIC_API_BASE_URL=http://localhost:3223
```

---

## 🚀 核心功能

### 真实可用 (生产级)

| 模块 | 说明 |
|------|------|
| **客户管理** | 完整CRUD + 分页搜索 + Zod验证 + Redis缓存 |
| **任务管理** | 状态跟踪 + 优先级 + 进度管理 + 缓存 |
| **项目管理** | 团队协作 + 预算控制 + 进度可视化 |
| **用户管理** | RBAC角色 + 部门管理 + 在线状态 |
| **财务管理** | 收支记录 + 分类统计 + 汇总报表 |
| **AI助手** | 真实GLM-4对话 + 多模型支持 |
| **全局搜索** | 跨表并行搜索 (用户/客户/任务/项目) |
| **仪表板** | 真实聚合统计 (4表并行查询) |

### 技术能力

| 能力 | 实现 |
|------|------|
| **认证** | JWT (HMAC-SHA256) + Middleware路由保护 + API守卫 |
| **数据获取** | SWR (去重/缓存/乐观更新/自动重验证) |
| **缓存** | Redis (列表缓存 + 标签失效) |
| **安全** | SQL注入防护(列名白名单) + XSS防护 + CSRF |
| **国际化** | 自研i18n引擎 (zh-CN/en) |
| **PWA** | Service Worker + 离线支持 + 全端图标 |
| **多端适配** | PC/平板/手机响应式 + 移动端底部导航 + 侧边栏抽屉 + 安全区域适配 |
| **审计** | 操作日志记录 (system_logs表) |
| **无障碍** | Skip-link + ARIA landmarks + 焦点管理 |

---

## 📋 技术栈

| 层 | 技术 | 版本 |
|---|---|---|
| 前端框架 | Next.js (App Router) | 16.x |
| UI | React + TypeScript | 19 / 7.x |
| 样式 | Tailwind CSS + shadcn/ui | 4.x |
| 状态 | Zustand + SWR | 5.x / 2.4 |
| 数据库 | PostgreSQL (pg) + Redis | 15+ / 7 |
| 验证 | Zod | 4.x |
| AI | Vercel AI SDK + ZhipuAdapter | 7.x |
| 测试 | Vitest + Testing Library | 4.x |
| i18n | 自研 @yyc3/i18n-core | 2.3 |

---

## 📁 项目结构

```
app/                    Next.js App Router (49页面, 22 API路由)
  api/                  22个API路由 (含认证+验证+缓存)
  (feature)/page.tsx   功能页面
  layout.tsx           根布局 (I18nProvider + AIWidget)
components/             React组件 (33个业务 + UI组件库)
  sidebar.tsx          响应式侧边栏 (桌面固定/移动端抽屉)
  bottom-nav.tsx       移动端底部导航 (xs/sm显示)
  header.tsx           响应式头部
hooks/                  9个自定义Hook (SWR驱动)
lib/                    12个核心模块
  api/                 API工具 (auth-guard, response-handler, cache)
  db/                  数据层 (repositories + cache + redis)
  i18n/                自研i18n引擎
  model-adapter/       AI多模型适配器
  agentic-core/        Agent引擎
  validations/         Zod schemas
store/                  Zustand状态 (4 stores)
migrations/             12个SQL迁移
```

---

## 🔌 API 文档

### 认证

所有API（除 `/api/health`）需 Bearer Token：

```
Authorization: Bearer <jwt_token>
```

### 核心端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET/POST | `/api/customers` | 客户列表/创建 |
| GET/PUT/DELETE | `/api/customers/:id` | 客户详情/更新/删除 |
| GET/POST | `/api/tasks` | 任务列表/创建 |
| GET/POST | `/api/projects` | 项目列表/创建 |
| GET/POST | `/api/users` | 用户列表/创建 |
| GET/POST | `/api/finance` | 财务记录列表/创建 |
| GET | `/api/finance/summary` | 财务收支汇总 |
| GET | `/api/dashboard/stats` | 仪表板聚合统计 |
| GET | `/api/search?q=` | 全局搜索 |
| POST | `/api/ai/chat` | AI对话 (GLM-4) |
| GET | `/api/ai/models` | 可用AI模型列表 |
| GET | `/api/health` | 健康检查 |

---

## 🛠️ 开发指南

### 常用命令

```bash
bun run dev           # 开发服务器 (port 3223)
bun run build         # 生产构建
bun run start         # 生产服务器
bun run lint          # ESLint
bun run type-check    # TypeScript检查
bun run test          # 运行测试
bun run test:coverage # 覆盖率报告
bun run db:migrate    # 数据库迁移
```

### 代码规范

- TypeScript strict模式 (零 `any`)
- Zod验证所有API输入
- Repository Pattern (SQL仅在 `lib/db/repositories/`)
- `@/` 路径别名 → 项目根
- SWR驱动数据获取 (`useSWRResource<T>()`)
- Redis缓存列表查询 (`withCache()`)

### 多端适配

系统遵循 [YYC3-多端适配-规范文档](./docs/YYC3-团队通用-标规文档/YYC3-多端适配-规范文档.md)，在单一 Next.js 应用内实现 PC / 平板 / 手机 H5 / PWA 的全端适配：

| 特性 | 实现方式 |
|------|---------|
| **响应式断点** | Tailwind `xs(480px)/sm/md/lg/xl` 五级断点 |
| **侧边栏** | 桌面端固定可折叠侧栏；移动端 (<768px) 汉堡菜单 + 滑出抽屉 + 遮罩 + ESC关闭 |
| **底部导航** | 移动端 (xs/sm) 固定底部导航栏 (首页/任务/客户/通知)，44px 触摸目标 |
| **安全区域** | `viewport-fit=cover` + `env(safe-area-inset-*)` 适配刘海屏/Home Indicator |
| **PWA** | `display_override` + `id` + 导航预加载 + 分层缓存 (static/runtime/api) |
| **触摸优化** | iOS 输入框 16px 防缩放、点击高亮移除、文字防选中 |
| **无障碍** | WCAG 2.5.5 触摸目标 ≥ 44px、ARIA landmarks、焦点管理 |

### 文档架构全景

```
📁 docs/                                    # 全量文档库 (80+ 文档)
├── 📋 YYC3-Menu-文档索引-总览.md            # 文档总索引
├── 📋 README.md                            # 文档库说明
│
├── 🏗️ YYC3-Menu-架构设计/                   # 架构设计 (20+ 文档)
│   ├── 📐 架构类/                           #   总体/微服务/数据/安全/接口/AI 架构
│   └── 💡 技巧类/                           #   架构评审、微服务拆分、性能优化
│
├── 💻 YYC3-Menu-开发实施/                    # 开发实施 (10+ 文档)
│   ├── 📐 架构类/                           #   代码架构、API接口、组件开发、AI集成
│   └── 💡 技巧类/                           #   TypeScript规范、编码规范、版本控制
│
├── 🔌 YYC3-Menu-需求规划/                    # 需求规划 (8 文档)
│   ├── 📐 架构类/                           #   业务架构、数据架构、智能化能力
│   └── 💡 技巧类/                           #   需求编写、跨部门协同、优先级排序
│
├── 🧪 YYC3-Menu-测试验证/                    # 测试验证 (15+ 文档)
│   ├── 📐 架构类/                           #   测试架构、性能/安全/AI专项测试
│   └── 💡 技巧类/                           #   用例设计、自动化脚本、缺陷管理
│
├── 🚀 YYC3-Menu-部署发布/                    # 部署发布 (8 文档)
│   ├── 📐 架构类/                           #   CICD流水线、多环境部署、灰度发布
│   └── 💡 技巧类/                           #   Docker/K8s部署、问题排查
│
├── ⚙️ YYC3-Menu-运维运营/                    # 运维运营 (8 文档)
│   ├── 📐 架构类/                           #   运维架构、智能运维、灾备、系统扩容
│   └── 💡 技巧类/                           #   监控告警、日志分析、性能优化
│
├── 📊 YYC3-Menu-实施总结/                    # 实施总结 (30+ 文档)
│   └── 📋 各阶段实施报告/                    #   Phase1-3、Week1-6、性能优化、UI增强
│
├── 📖 YYC3-Menu-文档规范/                    # 文档规范 (8 文档)
│   └── 📋 规范文件/                         #   文档架构、术语表、团队规范、安全策略
│
├── 🔄 YYC3-Menu-归类迭代/                    # 归类迭代 (3 文档)
│   └── 📋 迭代文件/                         #   归档架构、系统迭代、资产沉淀
│
├── 📋 YYC3-Menu-团队规范/                    # 团队规范 (3 文档)
├── 📋 YYC3-Menu-审核分析/                    # 审核分析 (6 文档)
├── 📋 YYC3-Menu-业务管理/                    # 业务管理 (1 文档)
│
├── 📋 YYC3-Mune-文档规范/                    # Mune文档规范 (9 文档)
├── 📋 YYC3-团队通用-标规文档/                # 团队通用标准 (5 文档)
├── 📋 YYC3-安全审计与修复报告.md
├── 📋 YYC3-分析问题汇总清单.md
├── 📋 YYC3-深度全面审核报告.md
├── 📋 YYC3-MVP功能拓展方案.md
├── 📋 YYC3-深度测试审核报告.md
├── 📋 YYC3-功能规格文档.md
├── 📋 YYC3-功能拓展实施计划.md
├── 📋 YYC3-功能拓展规划报告.md
├── 📋 YYC3-统一化规范文档.md
├── 📋 YYC3-分析改进路线图.md
└── 📋 YYC3-闭环验收提示词.md
```

### 快速导航

| 文档 | 说明 |
|------|------|
| [AGENTS.md](./AGENTS.md) | AI Agent 开发指南 |
| [AUDIT-REPORT.md](./AUDIT-REPORT.md) | 项目全面审核报告 |
| [SECURITY-FIXES.md](./SECURITY-FIXES.md) | 安全修复记录 |
| [TEST-AUDIT-REPORT.md](./TEST-AUDIT-REPORT.md) | 测试深度审核 |
| [MVP-EXPANSION-PLAN.md](./MVP-EXPANSION-PLAN.md) | 功能拓展方案 |
| [ISSUE-LIST.md](./ISSUE-LIST.md) | 问题追踪清单 |
| [IMPROVEMENT-ROADMAP.md](./IMPROVEMENT-ROADMAP.md) | 改进路线图 |
| [docs/YYC3-Menu-文档索引-总览.md](./docs/YYC3-Menu-文档索引-总览.md) | 全量文档索引总览 |
| [docs/YYC3-Menu-架构设计/架构类/01-YYC3-Menu-架构类-总体架构设计文档.md](./docs/YYC3-Menu-架构设计/架构类/01-YYC3-Menu-架构类-总体架构设计文档.md) | 总体架构设计 |
| [docs/YYC3-Menu-开发实施/架构类/01-YYC3-Menu-架构类-代码架构实现说明书.md](./docs/YYC3-Menu-开发实施/架构类/01-YYC3-Menu-架构类-代码架构实现说明书.md) | 代码架构实现 |
| [docs/YYC3-Menu-部署发布/架构类/YYC3-Menu-架构类-CICD部署文档.md](./docs/YYC3-Menu-部署发布/架构类/YYC3-Menu-架构类-CICD部署文档.md) | CICD 部署文档 |

---

## 🐳 部署指南

### GitHub Pages (静态部署)

项目支持通过 GitHub Pages 进行静态部署，自动推送 `main` 分支即触发部署。

**域名**: `management.yyc3.vip` (via [public/CNAME](./public/CNAME))

**部署流程** (`.github/workflows/deploy-pages.yml`):

1. 推送 `main` 分支 → 自动触发
2. 静态导出 (`NEXT_STATIC_EXPORT=true`) → 输出至 `out/`
3. 验证 CNAME + 添加 `.nojekyll` → 上传 artifact
4. 部署至 GitHub Pages → 健康检查

**首次配置**:

1. GitHub 仓库 → Settings → Pages → Source: `GitHub Actions`
2. DNS: 添加 CNAME 记录 `management` → `yyc3-cube.github.io`
3. GitHub 仓库 → Settings → Pages → Custom domain: `management.yyc3.vip`

**本地测试静态导出**:

```bash
NEXT_STATIC_EXPORT=true NEXT_PUBLIC_GITHUB_PAGES=true NEXT_PUBLIC_CUSTOM_DOMAIN=true bun run build
# 输出目录: ./out/
```

### Docker (全功能部署)

```bash
docker-compose up -d    # 启动 (含迁移)
```

### Docker Compose 服务

- **app**: Next.js 应用 (port 3000)
- **migrator**: 数据库迁移 (一次性)
- **postgres**: PostgreSQL 16
- **redis**: Redis 7
- **nginx**: 反向代理

### CI/CD 工作流

| 工作流 | 文件 | 触发条件 | 说明 |
|--------|------|---------|------|
| **Deploy Pages** | `deploy-pages.yml` | push(main) | GitHub Pages 静态部署 |
| **CI/CD Pipeline** | `ci-cd.yml` | push/PR(main,develop) | Lint→Test→Build→Docker→Deploy(VPS) |
| **CI/CD Testing** | `ci-cd-testing.yml` | push/PR(main,develop) | Lint→Test→Integration→Build |
| **Code Quality** | `code-quality.yml` | push/PR + 周期 | ESLint/Prettier/复杂度/重复代码 |
| **Security Scan** | `security-scan.yml` | push/PR + 每日 | CodeQL/Snyk/gitleaks/依赖审计 |

---

## 📄 许可证

MIT License © YYC³ Team
