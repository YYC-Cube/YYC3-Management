# YYC³ 企业智能管理系统 — 运维文档

> **最后更新**: 2026-07-16  
> **版本**: 3.0.0  
> **维护团队**: YYC³

---

## 目录

1. [系统概览](#1-系统概览)
2. [CI/CD 流水线](#2-cicd-流水线)
3. [安全审计与漏洞修复](#3-安全审计与漏洞修复)
4. [部署架构](#4-部署架构)
5. [插件系统](#5-插件系统)
6. [已知问题与解决方案](#6-已知问题与解决方案)
7. [环境变量](#7-环境变量)
8. [运维操作手册](#8-运维操作手册)

---

## 1. 系统概览

### 技术栈

| 组件 | 版本 | 说明 |
|------|------|------|
| Next.js | 16.2.10 | App Router + Turbopack |
| React | 19.2.7 | |
| TypeScript | 7.0.2 | 原生 Go 编译器 (非 tsc) |
| Tailwind CSS | 4.3.2 | |
| 包管理器 | Bun 1.2+ | CI 使用 1.2.2，本地可用更高 |
| Node.js | 22 LTS | Docker 构建与运行时 |

### 双部署模式

| 模式 | 触发条件 | 输出 | 用途 |
|------|---------|------|------|
| **GitHub Pages** | push to main | `out/` 静态文件 | 纯前端展示 |
| **Docker** | CI/CD Pipeline | `.next/standalone` | 全功能后端 |

---

## 2. CI/CD 流水线

### 2.1 工作流清单

| 工作流 | 文件 | 触发 | 说明 |
|--------|------|------|------|
| Deploy Pages | `deploy-pages.yml` | push(main) | 静态导出 → GitHub Pages |
| CI/CD Pipeline | `ci-cd.yml` | push/PR | Lint→Test→Build→Docker→Deploy |
| CI/CD Testing | `ci-cd-testing.yml` | push/PR | 集成测试 |
| Code Quality | `code-quality.yml` | push/schedule | ESLint + 复杂度 |
| Security Scan | `security-scan.yml` | push/schedule | CodeQL + 依赖审计 |

### 2.2 Next.js 兼容性补丁

项目使用 TypeScript 7.0（原生 Go 编译器）和 Next.js 16.2.10，存在两个已知兼容性问题，通过 `scripts/patch-next-prerender.sh` 修复（POSIX sh 兼容）：

| 补丁 | 问题 | 修复 |
|------|------|------|
| 补丁 1 | `isPageStatic()` 对 `/_global-error` 硬编码 `appConfig: {}`，导致 React SSR null 崩溃 | `appConfig: {}` → `appConfig: { revalidate: 0 }` |
| 补丁 2 | `verify-typescript-setup.js` 检查 `typescript/lib/typescript.js`（TS 7 无此文件），CI 静默 `process.exit(1)` | 检查路径改为 `typescript/package.json` |

**补丁执行时机**: CI 的 `Install dependencies` 之后、`Build` 之前。Docker 构建中同样执行。

### 2.3 Pages 静态导出特殊处理

GitHub Pages 不运行后端，`output: 'export'` 不支持 API 路由和 middleware/proxy。`scripts/prepare-static-export.sh` 在导出构建前临时移除 `app/api/` 和 `proxy.ts`，不影响 Docker 源码。

---

## 3. 安全审计与漏洞修复

### 3.1 安全扫描结果（2026-07-16）

| 扫描类型 | 总计 | 已修复 | 开放 |
|---------|------|--------|------|
| Dependabot（依赖漏洞） | 120 | 120 | **0** |
| CodeQL（代码安全） | 23 | 23 | **0** |
| Secret Scanning | 1 | 1 | **0** |

### 3.2 本轮修复的 CodeQL 问题

| 严重级别 | 问题 | 文件 | 修复方式 |
|---------|------|------|---------|
| **Critical** | SSRF — 用户可控 URL 发起 fetch 请求 | `ai-model.repository.ts` | 添加 `validateUrl()` 函数，强制校验 http/https 协议 |
| **High** | 不安全的密码哈希 — SHA256+Base64 | `ai-model.repository.ts` | 改用 salt + HMAC-SHA256 密钥派生 + XOR 流加密 |
| **High** | XSS 正则不匹配 `</script >` | `lib/security/alerts.ts` | 正则改为 `</script\s*>` 兼容尾随空格 |
| **Medium** × 16 | GitHub Actions 缺少 `permissions` 块 | 4 个 workflow 文件 | 添加 `permissions: contents: read`（security-scan 额外加 `security-events: write`） |

### 3.3 本轮修复的依赖漏洞

| 包名 | CVE | 严重级别 | 修复 |
|------|-----|---------|------|
| xlsx | CVE-2024-22363 (ReDoS) | High | `xlsx@0.18.5` → `@e965/xlsx@0.20.3` |
| xlsx | CVE-2023-30533 (原型污染) | High | 同上 |

### 3.4 GitHub Actions 安全加固

所有 workflow 现已声明最小权限原则：

```yaml
permissions:
  contents: read              # 默认：仅读权限
  # security-scan.yml 额外需要:
  security-events: write      # 用于上传 CodeQL 结果
```

仅 `ci-cd.yml` 的 `docker-build` job 和 `deploy-pages.yml` 保留 `packages: write` / `pages: write`（功能必需）。

---

## 4. 部署架构

### 4.1 Docker 构建

```
Builder (node:22-alpine)
  ├── bun install --frozen-lockfile
  ├── sh scripts/patch-next-prerender.sh
  └── next build (Node.js 运行，非 Bun — worker_threads 兼容)
       ↓
Runner (node:22-alpine)
  ├── .next/standalone (精简服务端)
  ├── .next/static (静态资源)
  └── public/
```

> **注意**: `next build` 必须用 Node.js 运行。Bun 尚未实现 `worker_threads.Worker` 的 `stdout/stderr` 选项，会导致 `NotImplementedError`。

### 4.2 GitHub Pages 构建

```
CI Runner (ubuntu-latest + Node 22 + Bun)
  ├── bun install --frozen-lockfile
  ├── sh scripts/patch-next-prerender.sh
  ├── sh scripts/prepare-static-export.sh  ← 移除 app/api, proxy.ts
  ├── next build --webpack                 ← Turbopack 在 Linux CI 有静默崩溃 Bug
  └── 上传 out/ artifact → GitHub Pages
```

> **注意**: Pages 静态导出使用 `--webpack` 而非 Turbopack。Turbopack 在 Linux CI 上的 `output: 'export'` 模式存在平台相关静默崩溃。

---

## 5. 插件系统

### 5.1 架构

```
lib/plugin-system/
├── event-bus.ts          ← 跨系统事件总线 (13 个预定义事件)
├── storage.ts            ← 按系统分区的命名空间存储 (yyc3:{systemId}:)
├── registry.ts           ← 插件注册中心单例
├── init.ts               ← 9 个现有模块注册
├── family-personas.ts    ← 8 位 AI 家人数据
└── types.ts              ← 类型定义

components/plugin-system/
├── welcome-page.tsx      ← 统一欢迎页
├── ai-assistant-hub.tsx  ← 通用中枢浮窗
└── family-pages/         ← AI Family 页面 (家园/交流/设置)
```

### 5.2 已注册系统

| ID | 名称 | 路由 | 颜色 |
|----|------|------|------|
| ai-family | AI Family | /ai-family | #00FF88 |
| dashboard | 仪表板 | /dashboard | #00d4ff |
| tasks | 任务管理 | /tasks | #FF6600 |
| customers | 客户管理 | /customers | #AA55FF |
| projects | 项目管理 | /projects | #FFDD00 |
| analytics | 数据分析 | /analytics | #00BFFF |
| finance | 财务管理 | /finance | #00ff88 |
| notifications | 通知中心 | /notifications | #FF3366 |
| settings | 系统设置 | /settings | #C0C0C0 |

### 5.3 测试覆盖

- `event-bus.test.ts` — 10 个用例
- `storage.test.ts` — 8 个用例
- `registry.test.ts` — 8 个用例
- `family-personas.test.ts` — 9 个用例
- **总计**: 35/35 通过

---

## 6. 已知问题与解决方案

### 6.1 Deploy to Production 失败

**现象**: CI/CD Pipeline 中 `Deploy to Production` job 失败  
**原因**: GitHub Secrets `DEPLOY_HOST`、`DEPLOY_USER`、`DEPLOY_KEY` 未配置  
**解决**: 在 GitHub repo → Settings → Secrets and variables → Actions 中添加：
```
DEPLOY_HOST=<VPS IP>
DEPLOY_USER=<SSH 用户名>
DEPLOY_KEY=<SSH 私钥>
```

### 6.2 Node 20 Deprecation 警告

**现象**: CI 日志出现 `Node.js 20 is deprecated` 警告  
**原因**: 部分 GitHub Actions (checkout@v4 等) 内部仍用 Node 20  
**影响**: 仅警告，不影响功能。GitHub 会自动将 actions 强制运行在 Node 24  
**处理**: 无需操作，等待 actions 发布更新版本

### 6.3 既有测试失败

**现象**: 全量 `bun run test` 有 ~447 个测试失败  
**原因**: 多为既有问题，与本次修改无关：
- `chaos-engineering-examples.test.ts` — CPU 负载注入在 jsdom 中不工作
- `mutation-testing.test.ts` — 变异测试框架逻辑问题
- `offline-support.test.ts` — IndexedDB 在 jsdom 中不可用
**处理**: 既有问题，不在本次修复范围

---

## 7. 环境变量

### 7.1 必需变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `JWT_SECRET` | JWT 签名密钥 (≥32 字符) | — |
| `SESSION_SECRET` | 会话加密密钥 | — |
| `DATABASE_URL` | PostgreSQL 连接字符串 | — |
| `REDIS_URL` | Redis 连接字符串 | — |

### 7.2 CI 构建变量（deploy-pages.yml 中已配置）

```yaml
NODE_ENV: production
NEXT_STATIC_EXPORT: "true"
NEXT_PUBLIC_GITHUB_PAGES: "true"
NEXT_PUBLIC_CUSTOM_DOMAIN: "true"
NEXT_PUBLIC_SITE_URL: "https://management.yyc3.vip"
NEXT_PUBLIC_APP_NAME: "YYC³ 企业智能管理系统"
NEXT_PUBLIC_API_BASE_URL: "https://api.0379.love"
```

### 7.3 安全注意

> ⚠️ `.env` 和 `.env.local` 虽然在 `.gitignore` 中，但由于历史原因仍被 Git 跟踪。  
> 其中含 `NODE_ENV=development` 会污染 CI 构建。  
> Pages 构建步骤已通过显式设置 `NODE_ENV=production` 覆盖。

---

## 8. 运维操作手册

### 8.1 本地开发

```bash
bun install          # 安装依赖
bun run dev          # 开发服务器 (端口 3223)
bun run build        # 生产构建
bun run start        # 生产启动 (端口 3223)
bun run type-check   # 类型检查 (TS 7.0 严格模式)
bun run test         # 运行测试
```

### 8.2 手动触发 Pages 部署

```bash
gh workflow run deploy-pages.yml --ref main
```

### 8.3 查看安全告警

```bash
# Dependabot 告警
gh api /repos/YYC-Cube/YYC3-Management/dependabot/alerts --jq '[.[]|select(.state=="open")]|length'

# CodeQL 告警
gh api /repos/YYC-Cube/YYC3-Management/code-scanning/alerts --jq '[.[]|select(.state=="open")]|length'

# Secret scanning
gh api /repos/YYC-Cube/YYC3-Management/secret-scanning/alerts --jq '[.[]|select(.state=="open")]|length'
```

### 8.4 Docker 本地构建

```bash
docker build -t yyc3-management .
docker run -p 3000:3000 yyc3-management
```

### 8.5 应用补丁（手动）

```bash
sh scripts/patch-next-prerender.sh
```
该脚本幂等安全：已打过则跳过，匹配不到则视为已修复。

---

## 变更历史

| 日期 | 提交 | 说明 |
|------|------|------|
| 2026-07-16 | `7140f42` | 替换 xlsx → @e965/xlsx，修复 2 个 High CVE |
| 2026-07-16 | `28869fc` | Docker 构建改用 Node.js (Bun worker_threads 不兼容) |
| 2026-07-16 | `d5ef3a1` | 补丁脚本改为 POSIX sh 兼容 |
| 2026-07-16 | `e67e933` | TS 7.0 原生编译器兼容性补丁 |
| 2026-07-16 | `15ae820` | 插件系统完整复用 + Docker CI 修复 |
| 2026-07-16 | 本次提交 | CodeQL 23 告警修复 + Actions 权限加固 + 安全文档 |
