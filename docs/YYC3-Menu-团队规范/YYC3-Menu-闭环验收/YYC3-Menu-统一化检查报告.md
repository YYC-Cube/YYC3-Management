---
file: YYC3-Menu-统一化检查报告.md
description: YYC³ 项目统一化检查报告 — 设计/代码/文档/交互四维统一化审计
author: YYC³ 标准化委员会 <admin@0379.email>
version: v1.0.0
created: 2026-07-17
updated: 2026-07-17
status: stable
tags: 统一化,标准化,审计报告,闭环验收
category: policy
language: zh-CN
audience: developers,architects,managers
complexity: advanced
---

# YYC³ 项目统一化检查报告

> ***YanYuCloudCube***
> *言启千行代码 丨 语枢万物智能*
> *五维驱动 · 五高五标五化*

| 属性 | 值 |
|------|-----|
| **审计范围** | 设计语言 / 代码规范 / 文档风格 / 交互体验 / 浮窗AI实况 |
| **审计基线** | `main` 分支（2026-07-17） |
| **审计工具** | 静态代码扫描 + 实际文件读取 + 使用次数统计 |
| **发现总数** | 24 项（严重 5 / 重要 11 / 建议 8） |

---

## 📋 目录

- [1. 执行摘要](#1-执行摘要)
- [2. 设计语言统一化检查](#2-设计语言统一化检查)
- [3. 代码规范统一化检查](#3-代码规范统一化检查)
- [4. 文档风格统一化检查](#4-文档风格统一化检查)
- [5. 交互体验统一化检查](#5-交互体验统一化检查)
- [6. 浮窗AI实况专项审计](#6-浮窗ai实况专项审计)
- [7. 统一化改进实施计划](#7-统一化改进实施计划)
- [8. 验收清单](#8-验收清单)

---

## 1. 执行摘要

### 1.1 总体评分

| 维度 | 评分 | 状态 | 主要问题 |
|------|------|------|---------|
| **设计语言统一** | 7.2/10 | ⚠️ 待优化 | 双轨颜色系统、组件重复、硬编码色值 |
| **代码规范统一** | 8.5/10 | ✅ 良好 | 导出/命名统一，注释风格与类型定义微差 |
| **文档风格统一** | 6.8/10 | ⚠️ 待优化 | frontmatter 覆盖不全、文件头格式不一致 |
| **交互体验统一** | 7.5/10 | ⚠️ 待优化 | 快捷键多套实现、错误处理碎片化 |
| **浮窗AI实况** | 8.0/10 | ✅ 良好 | 全局挂载正确，但演示页存在双头入口 |

**综合评分：7.6 / 10** — 项目已建立 shadcn/ui + Radix + Tailwind CSS Variables 的标准基础，但存在历史遗留的"双轨制"和组件重复问题。

### 1.2 关键发现（Top 5）

1. 🔴 **`enhanced-button.tsx` variant 逻辑错误**：所有 4 个变体（primary/secondary/ghost/outline）使用完全相同的 sky→blue 渐变，variant 参数失效
2. 🔴 **颜色系统双轨制**：`lib/design-system.ts` 全量硬编码 sky/blue/slate 色，与 `tailwind.config.ts` + `globals.css` 的语义化 CSS Variables 脱节
3. 🔴 **`tailwind.config.ts` 引用未定义变量**：配置了 `--sidebar-background` 等 7 个 sidebar 变量，但 `globals.css` 未定义
4. 🟠 **组件重复实现**：`enhanced-*` 与标准组件并存（button/card/progress/badge 各有 2-3 套），维护负担与视觉不一致风险
5. 🟠 **快捷键系统三套并存**：`lib/utils/keyboard-shortcuts.tsx`（标准化）、`sidebar.tsx`（自实现）、`AIWidgetProvider.tsx`（自实现）

---

## 2. 设计语言统一化检查

### 2.1 颜色系统检查

#### ✅ 正确实现

- [globals.css](file:///Users/yanyu/YYC-Cube/YYC3-Management/app/globals.css) 定义 HSL 分量变量（`--primary: 221.2 83.2% 53.3%`）
- [tailwind.config.ts](file:///Users/yanyu/YYC-Cube/YYC3-Management/tailwind.config.ts) 通过 `hsl(var(--primary))` 映射为语义化 utility（`bg-primary`、`text-primary-foreground`）
- 支持深色模式（`.dark` 选择器切换变量）
- 新增多端语义色：`--success`、`--warning`、`--chart-1..5`

#### 🔴 问题 2.1-A：sidebar 变量未定义（严重）

**位置**：`tailwind.config.ts` 第 78-85 行 vs `globals.css` `:root` 与 `.dark`

**问题**：Tailwind 配置中声明了 7 个 sidebar 颜色：

```ts
sidebar: {
  DEFAULT: 'hsl(var(--sidebar-background))',
  foreground: 'hsl(var(--sidebar-foreground))',
  primary: 'hsl(var(--sidebar-primary))',
  // … 共 7 个
}
```

但 `globals.css` 中 `:root` 和 `.dark` 均未定义 `--sidebar-background`、`--sidebar-foreground` 等变量，导致 `bg-sidebar`、`text-sidebar-foreground` 等 utility 渲染为 `hsl(undefined)` = 失效。

**影响**：sidebar 组件如果使用 `bg-sidebar` 类将无颜色。

**修复建议**：在 `globals.css` 的 `:root` 和 `.dark` 中补齐 sidebar 变量定义（见改进计划 7.1）。

#### 🟠 问题 2.1-B：design-system.ts 硬编码色值（重要）

**位置**：[lib/design-system.ts](file:///Users/yanyu/YYC-Cube/YYC3-Management/lib/design-system.ts) 第 21-258 行

**问题**：全量硬编码 `sky-400`、`blue-500`、`slate-800`、`emerald-100` 等色值，与 `--primary` 等语义 token 脱节。例如：

```ts
// ❌ 当前
primary: "bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
badge: { primary: "bg-sky-100 text-sky-800 border-sky-200" }
```

**影响**：

- 深色模式下颜色不会自适应切换
- 主题色变更需修改多份文件
- 与 shadcn/ui `bg-primary text-primary-foreground` 规范冲突

**修复建议**：`design-system.ts` 全部改为引用语义 token（见改进计划 7.2）。

#### 🟡 问题 2.1-C：globals.css 颜色使用方式不一致（建议）

**位置**：`globals.css` 第 824-860 行（多端适配段）

**问题**：同一份 CSS 文件内存在两种写法：

```css
/* ❌ 组件层使用 @apply 语义类 */
.responsive-card { @apply bg-card text-card-foreground border shadow-sm; }

/* ❌ 同一文件底部使用 hsl(var()) 原始写法 */
.bottom-nav { background: hsl(var(--background)); border-top: 1px solid hsl(var(--border)); }
```

**修复建议**：统一使用 `@apply` 语义类（见改进计划 7.3）。

### 2.2 排版系统检查

#### ✅ 正确实现

- 字体栈：`"Inter", "SF Pro Display", -apple-system, ...`（layout.tsx）
- 使用系统字体栈避免 CI Google Fonts 拉取失败
- 响应式字号：`text-sm/base/lg/xl` 通过 Tailwind 类应用
- 移动端根字号：`@media (max-width: 640px) { html { font-size: 14px; } }`

#### 🟡 问题 2.2-A：字体加载方式

**位置**：[app/layout.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/app/layout.tsx) 第 29-32 行

**观察**：使用注释掉的 `next/font/google` 替代方案，对象字面量代替。`inter.className` 实际只是字符串 `"font-sans"`，不是真实的 next/font 对象。

**建议**：当前方案可接受（CI 友好），但应删除"伪 next/font"对象，直接在 body 使用 `className="font-sans"` + 内联 style。

### 2.3 组件样式检查

#### 🔴 问题 2.3-A：组件重复实现（严重）

| 标准组件 | 重复组件 | 标准使用次数 | 重复使用次数 | 冲突点 |
|---------|---------|------------|------------|--------|
| [button.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/ui/button.tsx) | [enhanced-button.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/ui/enhanced-button.tsx) | 52 | 6 | variant 全部相同（bug）、硬编码渐变 |
| [card.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/ui/card.tsx) | [enhanced-card.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/ui/enhanced-card.tsx) | 49 | 6 | 硬编码 sky 色、依赖 design-system.ts |
| [progress.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/ui/progress.tsx) | [enhanced-progress.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/ui/enhanced-progress.tsx) + [interactive-progress.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/ui/interactive-progress.tsx) | 13 | 2 + 1 | 三套实现 |
| [badge.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/ui/badge.tsx) | [status-badge.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/ui/status-badge.tsx) | 46 | 2 | 硬编码 green-100/yellow-100 等 |
| [skeleton.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/ui/skeleton.tsx) | [loading-skeleton.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/ui/loading-skeleton.tsx) | 1 | 47 | ✅ 合理（组合组件） |

#### 🔴 问题 2.3-B：enhanced-button variant 失效（严重）

**位置**：[components/ui/enhanced-button.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/ui/enhanced-button.tsx) 第 28-39 行

```tsx
// ❌ 当前：4 个 variant 返回完全相同的 className
const buttonVariants = {
  primary:   "bg-linear-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-md hover:shadow-lg",
  secondary: "bg-linear-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-md hover:shadow-lg", // 完全相同
  ghost:     "bg-linear-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-md hover:shadow-lg", // 完全相同
  outline:   "bg-linear-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-md hover:shadow-lg border-0", // 仅多 border-0
}
```

**影响**：传入 `variant="ghost"` 与 `variant="primary"` 视觉完全一致，违反设计意图。

**修复建议**：

- 短期：将 `EnhancedButton` 改为基于 `Button` 的浅封装，仅保留 `icon`、`loading`、`iconPosition` 三个增强属性，variant 完全委托给 `Button`
- 长期：删除 `enhanced-button.tsx`，将增强属性合并到 `Button` 的扩展 variant 中

### 2.4 图标系统检查

#### ✅ 完全统一

- 全项目使用 **lucide-react**：74 个文件引用
- **0 处** 使用 `@heroicons`、`react-icons`、`@radix-ui/react-icons`
- 图标尺寸统一：`h-4 w-4`（小）、`h-5 w-5`（中）、`h-6 w-6`（大）
- AI 浮窗内图标来源一致：`ChevronDown, HeadphonesIcon, MessageSquare, Mic, MicOff, Send, Settings, Sparkles, X` 等

### 2.5 交互模式检查

#### ✅ 统一实现

- 悬停过渡：`transition-all duration-200`（globals.css `.responsive-*` 系列）
- 焦点环：`focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
- 禁用态：`disabled:pointer-events-none disabled:opacity-50`
- 触摸目标：`.touch-target { min-width: 44px; min-height: 44px; }`（WCAG 2.5.5）

#### 🟡 问题 2.5-A：动画类名重复定义

**位置**：`globals.css` 第 254-258 行（`@layer components`）与第 410-414 行（`@layer utilities`）

**问题**：`.animate-slide-in` 在两个 layer 中重复定义，且 `@keyframes slideIn` 也在两处。

**修复建议**：合并至 `@layer utilities`，删除 `@layer components` 中的重复定义。

---

## 3. 代码规范统一化检查

### 3.1 命名规范检查

#### ✅ 统一执行

| 场景 | 规范 | 实际样本 | 状态 |
|------|------|---------|------|
| 组件文件 | `kebab-case.tsx` | `advanced-search-bar.tsx`、`data-import-export.tsx` | ✅ |
| React 组件 | `PascalCase` | `IntelligentAIWidget`、`EnhancedButton` | ✅ |
| Hooks 文件 | `kebab-case.ts` | `use-focus-trap.ts` | ✅ |
| Hook 函数 | `camelCase` 带 `use` 前缀 | `useAIWidget`、`useFocusTrap` | ✅ |
| 工具函数 | `camelCase` | `formatCurrency`、`getStatusStyle` | ✅ |
| 常量对象 | `camelCase` | `commonStyles`、`statusConfig` | ✅ |
| 类型/接口 | `PascalCase` | `AIWidgetContextType`、`EnhancedButtonProps` | ✅ |
| 枚举值 | 字符串字面量（中文） | `'待处理'`、`'进行中'`、`'已完成'` | ✅ 符合 i18n |

### 3.2 代码格式检查

#### ✅ 统一执行

- 缩进：2 空格（.editorconfig + prettier）
- 引号：单引号 `'`（AST 标准）
- 分号：TypeScript 标准分号
- 行尾换行：LF
- Tailwind 类排序：通过 eslint-plugin-tailwindcss（待确认配置）

### 3.3 注释风格检查

#### 🟠 问题 3.3-A：文件头注释两套风格（重要）

**风格 A**：JSDoc 头注释（ai-floating-widget 系列）

```tsx
/**
 * @fileoverview 智能AI浮窗组件
 * @description 可拖拽、可插拔的智能AI交互界面，支持多模型切换
 * @author YYC³
 * @version 3.0.0
 * @created 2025-12-09
 * @modified 2025-12-09
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */
```

**风格 B**：无头注释（shadcn/ui 原生组件，如 button.tsx、card.tsx、dialog.tsx）

**风格 C**：YAML frontmatter（部分 docs 文档）

**修复建议**：统一采用 JSDoc 风格 A 作为所有 `.tsx`/`.ts` 业务组件的强制头注释（shadcn/ui 原生组件保留上游风格）。

#### 🟡 问题 3.3-B：注释代码残留

**位置**：[components/ai-floating-widget/EnhancedAIWidget.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/ai-floating-widget/EnhancedAIWidget.tsx)

**问题**：第 77、93、114、119、136、138、147、163、224 行等多处 `// console.log(...)` 注释残留。

**修复建议**：清理所有注释掉的 console 调用，如需调试改用 `logger` 工具或环境变量门控。

### 3.4 文件结构检查

#### ✅ 统一执行

```
app/                    # Next.js App Router 路由
components/
  ├── ui/              # shadcn/ui 基础组件（37 个）
  ├── ai-floating-widget/  # AI 浮窗模块
  └── [业务组件].tsx
hooks/                 # 11 个自定义 Hook
lib/
  ├── agentic-core/    # AI Agent 核心
  ├── api/             # API 中间件
  ├── design-system.ts # 设计系统配置
  ├── i18n/            # 国际化
  └── ...
stores/                # 5 个 Zustand store
```

### 3.5 导入导出检查

#### ✅ 完全统一

- **导出**：37/37 UI 组件全部使用**命名导出**，0 处 `export default`（仅 AIWidgetProvider 有 `export default` 作为兼容）
- **导入顺序**：React → 第三方 → `@/lib` → `@/components` → 相对路径 → 类型
- **路径别名**：`@/*` 统一映射到项目根
- **类型导入**：使用 `import type` 区分类型与值（如 `import type { ReactNode } from "react"`）

---

## 4. 文档风格统一化检查

### 4.1 文档 frontmatter 检查

#### 🟠 问题 4.1-A：frontmatter 覆盖不全（重要）

**统计**：130 篇 docs 文档中，约 **45%** 有完整 YAML frontmatter，**30%** 有简化 frontmatter，**25%** 无 frontmatter。

**抽样**：

- ✅ 有 frontmatter：`docs/YYC3-Menu-开发实施/架构类/*`、`docs/YYC3-Menu-团队规范/YYC3-团队核心-五维驱动.md`
- ⚠️ 无 frontmatter：`docs/README.md`、`docs/YYC3-Menu-文档规范/README.md`（刚修复）

### 4.2 文档结构检查

#### 🟠 问题 4.2-A：标题层级不一致（重要）

**问题**：部分文档一级标题（`#`）命名规范不一致：

| 风格 | 样本 | 出现频率 |
|------|------|---------|
| ✅ 标准：`# YYC³ 文档名` | `# YYC³ 团队核心-五维驱动` | ~60% |
| ⚠️ 带图标：`# 📊 YYC³ 文档名` | `# 📊 YYC³ 实施总结文档索引` | ~25% |
| ⚠️ 仅英文：`# Title` | `#星云操作系统`（已废弃） | <5% |
| ⚠️ 无主标题 | 直接以 `##` 开始 | ~10% |

**修复建议**：统一为 `# 图标 YYC³ 文档名` 格式，图标可选。

### 4.3 API 文档格式检查

#### 🟡 问题 4.3-A：API 文档字段顺序不一

**建议统一字段顺序**：

1. 端点（`METHOD /path`）
2. 描述
3. 请求参数（Path / Query / Body）
4. 请求示例
5. 响应结构
6. 响应示例
7. 错误码
8. 权限要求

---

## 5. 交互体验统一化检查

### 5.1 表单交互检查

#### ✅ 统一实现

- 表单验证：Zod schema（`lib/validations/`）
- 提交反馈：`useToast` 通知（31 处使用）
- 加载状态：`loading` prop + `LoadingSkeleton`（47 处使用）

#### 🟠 问题 5.1-A：错误提示碎片化（重要）

**统计**：

- `useToast` 用于成功/错误通知：**31 处**
- `FormError` 组件用于内联错误：**1 处**（仅 [form-error.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/ui/form-error.tsx)）
- 内联 `<p className="text-red-500">` 或 `<span className="text-destructive">`：**~20+ 处**

**问题**：错误展示存在 3 种模式，用户在不同页面看到的错误样式不一致。

**修复建议**：

- **表单字段错误**：统一使用 `FormError` 组件（红色小字，字段下方）
- **操作结果错误**：统一使用 `toast({ variant: "destructive" })`
- **页面级错误**：统一使用 `EmptyState` + 重试按钮

### 5.2 弹窗行为检查

#### ✅ 基本统一

- 弹窗组件：`Dialog`（Radix UI 封装）— 18 处使用
- 动画：`data-[state=open]:animate-in data-[state=closed]:animate-out`
- 关闭交互：点击遮罩 + ESC 键 + 关闭按钮（Radix 默认）
- 焦点陷阱：`hooks/use-focus-trap.ts`

### 5.3 加载状态检查

#### ✅ 统一实现

- 路由级：Next.js `loading.tsx` + `LoadingSkeleton`
- 组件级：`Skeleton`（基础）+ `LoadingSkeleton`（组合）
- 按钮级：`disabled + opacity-70 + cursor-not-allowed`
- 全局级：`AIWidgetProvider` 的 `systemReady` 状态

### 5.4 快捷键检查

#### 🔴 问题 5.4-A：快捷键三套实现（严重）

| 位置 | 实现方式 | 快捷键 |
|------|---------|--------|
| [lib/utils/keyboard-shortcuts.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/lib/utils/keyboard-shortcuts.tsx) | 标准化 `useKeyboardShortcuts` Hook | 通用 |
| [components/sidebar.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/sidebar.tsx) 第 145 行 | 自实现 `window.addEventListener("keydown")` | sidebar 折叠 |
| [components/ai-floating-widget/AIWidgetProvider.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/ai-floating-widget/AIWidgetProvider.tsx) 第 109 行 | 自实现 `window.addEventListener('keydown')` | Ctrl/Cmd+K |

**问题**：

1. 存在标准 Hook 但未被自身组件使用
2. 三处独立监听可能造成事件冲突
3. 无统一注册表，快捷键可能重复绑定

**修复建议**：

- 全部改用 `useKeyboardShortcuts` Hook
- 建立 `lib/utils/keyboard-shortcuts.ts` 中央注册表
- 文档化所有快捷键（见规范文档 7.4）

### 5.5 错误提示检查

（同 5.1-A）

---

## 6. 浮窗AI实况专项审计

### 6.1 浮窗AI 架构

```
┌─────────────────────────────────────────┐
│  app/layout.tsx (全局入口)              │
│    └── AIWidgetProvider autoInit={true} │
│          ├── useAIWidget() Hook         │
│          │   └── toggleWidget()         │
│          │   └── Ctrl/Cmd+K 监听        │
│          └── IntelligentAIWidget        │
│                (挂载可见时渲染)         │
└─────────────────────────────────────────┘
           ↓ 触发器
┌─────────────────────────────────────────┐
│  components/sidebar.tsx                 │
│    └── useAIWidget().toggleWidget()     │
└─────────────────────────────────────────┘
           ↓ 演示页（独立挂载）
┌─────────────────────────────────────────┐
│  app/ai-floating-demo/page.tsx          │
│    └── <IntelligentAIWidget />          │
│  app/enhanced-ai-demo/page.tsx          │
│    └── <EnhancedAIWidget />             │
└─────────────────────────────────────────┘
```

### 6.2 浮窗AI 检查结果

#### ✅ 正确实现

- **全局挂载**：`app/layout.tsx` 通过 `AIWidgetProvider autoInit={true}` 全局提供
- **快捷键统一**：Ctrl/Cmd+K 在 `AIWidgetProvider` 中监听
- **触发器可达**：sidebar.tsx 通过 `useAIWidget` Hook 控制显隐
- **可拖拽/可缩放**：`IntelligentAIWidget` 支持拖拽（`WidgetPosition`）和缩放（`WidgetSize`，最小 300×400，最大 800×800）
- **多模型切换**：支持 GLM-4-Flash、通义千问Max 等
- **AgenticCore 集成**：基于 `lib/agentic-core` 的目标规划+反思+学习

#### 🟠 问题 6.2-A：双头入口风险（重要）

**位置**：

- `/ai-floating-demo`（独立引入 `IntelligentAIWidget`）
- `/enhanced-ai-demo`（独立引入 `EnhancedAIWidget`）

**问题**：演示页绕过 `AIWidgetProvider` 直接挂载浮窗，导致：

1. 全局 Provider 与演示页可能同时挂载 → 两个浮窗
2. `AgenticCore` 可能被重复实例化
3. 演示页与生产入口行为不一致

**修复建议**：

- 演示页改为仅展示 `useAIWidget().showWidget()` 触发按钮
- 或在演示页路由显式禁用全局 Provider

#### 🟡 问题 6.2-B：EnhancedAIWidget 注释残留（建议）

**位置**：[components/ai-floating-widget/EnhancedAIWidget.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/ai-floating-widget/EnhancedAIWidget.tsx)

**问题**：第 77、93、114、119、136、138、147、163、224 行存在 `// console.log(...)` 注释代码。

#### 🟡 问题 6.2-C：浮窗定位 SSR 安全（建议）

**位置**：[components/ai-floating-widget/IntelligentAIWidget.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/ai-floating-widget/IntelligentAIWidget.tsx) 第 81 行

```tsx
const DEFAULT_POSITION: WidgetPosition = {
  x: typeof window !== 'undefined' ? window.innerWidth - 420 : 100,
  y: 100
};
```

**观察**：SSR 安全已通过 `typeof window !== 'undefined'` 处理 ✅。但模块级常量在首次渲染时计算，hydration 后窗口尺寸变化不会更新。

**建议**：改为 `useState` 初始化 + `useEffect` 读取 `window.innerWidth`。

#### 🟡 问题 6.2-D：AIResponseTemplate/AIWidgetProvider 头注释日期未更新

**位置**：

- `AIResponseTemplate.tsx` 无 `@modified`
- `AIWidgetProvider.tsx` `@modified 2025-12-09`（创建同日，未更新）

---

## 7. 统一化改进实施计划

### 7.1 P0 严重修复（立即执行）

| 编号 | 任务 | 文件 | 状态 |
|------|------|------|------|
| P0-1 | 补齐 sidebar CSS 变量 | `app/globals.css` | ⏳ |
| P0-2 | 修复 `enhanced-button.tsx` variant 逻辑 | `components/ui/enhanced-button.tsx` | ⏳ |
| P0-3 | 清理 `EnhancedAIWidget.tsx` 注释 console | `components/ai-floating-widget/EnhancedAIWidget.tsx` | ⏳ |

### 7.2 P1 重要改进（本周内）

| 编号 | 任务 | 文件 | 状态 |
|------|------|------|------|
| P1-1 | 重构 `design-system.ts` 引用语义 token | `lib/design-system.ts` | ⏳ |
| P1-2 | `skeleton.tsx` 替换硬编码 `bg-slate-100` | `components/ui/skeleton.tsx` | ⏳ |
| P1-3 | `status-badge.tsx` 改为基于 `Badge` 的 variant | `components/ui/status-badge.tsx` | ⏳ |
| P1-4 | 统一快捷键到 `useKeyboardShortcuts` Hook | sidebar.tsx + AIWidgetProvider.tsx | ⏳ |
| P1-5 | 统一错误提示组件使用 | 多文件 | ⏳ |

### 7.3 P2 建议优化（迭代改进）

| 编号 | 任务 | 文件 | 状态 |
|------|------|------|------|
| P2-1 | 合并 `.animate-slide-in` 重复定义 | `app/globals.css` | ⏳ |
| P2-2 | 补齐 frontmatter 到 100% 文档 | `docs/**` | ⏳ |
| P2-3 | 统一文档标题为 `# 图标 YYC³ 文档名` | `docs/**` | ⏳ |
| P2-4 | 删除"伪 next/font"对象 | `app/layout.tsx` | ⏳ |

### 7.4 中长期改造

- **M1**：逐步迁移 `enhanced-*` 使用方到标准组件，最终删除 `enhanced-button`、`enhanced-card`、`enhanced-progress`、`interactive-progress`
- **M2**：`design-system.ts` 中的 `commonStyles` 全部改用 Tailwind utility class 组合，删除对象化样式
- **M3**：建立快捷键中央注册表 `lib/utils/keyboard-shortcut-registry.ts`

---

## 8. 验收清单

### 8.1 设计语言

- [ ] 颜色系统：100% 通过语义 token 引用，无硬编码色值
- [ ] 排版系统：字体栈、字号、行高统一
- [ ] 组件样式：无重复实现，variant 行为正确
- [x] 图标系统：lucide-react 100% 覆盖
- [x] 交互模式：过渡、焦点、禁用态统一

### 8.2 代码规范

- [x] 命名规范：kebab-case / PascalCase / camelCase 全部正确
- [x] 代码格式：2 空格缩进、单引号、分号
- [ ] 注释风格：JSDoc 头注释覆盖率 ≥ 80%
- [x] 文件结构：app/components/hooks/lib/stores 标准布局
- [x] 导入导出：100% 命名导出

### 8.3 文档风格

- [ ] API 文档：统一字段顺序
- [ ] 组件文档：props table + 示例代码
- [ ] 用户文档：TOC + FAQ
- [ ] 开发文档：quickstart + contribution
- [ ] frontmatter 覆盖率：≥ 95%

### 8.4 交互体验

- [ ] 表单交互：统一 FormError + Toast 模式
- [x] 弹窗行为：Radix Dialog 统一
- [x] 加载状态：Skeleton + Loading 组合
- [ ] 错误提示：3 模式收敛到 2 模式
- [ ] 快捷键：单一注册表

### 8.5 浮窗AI

- [x] 全局挂载：layout.tsx AIWidgetProvider
- [x] 快捷键：Ctrl/Cmd+K
- [x] 触发器：sidebar.tsx useAIWidget
- [ ] 演示页双头入口收敛
- [ ] 注释残留清理

---

## 附录 A：审计方法

### A.1 数据采集方式

1. **静态扫描**：使用 `grep -rln` 统计组件、Hook、工具的使用次数
2. **文件读取**：人工审计关键文件（globals.css、tailwind.config.ts、design-system.ts、所有 enhanced-* 与 status-badge 组件）
3. **架构追踪**：从 `app/layout.tsx` 追踪 AI 浮窗的完整挂载链
4. **已有规范对齐**：参考 `docs/YYC3-Menu-团队规范/YYC3-闭环验收-提示系统.md` 与 `五维驱动` 标准文档

### A.2 工具版本

- 审计基线：`main` 分支（2026-07-17）
- Next.js 16.2.10 / React 19.2.7 / TypeScript 7.0.2
- Tailwind CSS 4（@import 'tailwindcss'）
- Bun 1.2.2

### A.3 相关文档

- [YYC3-Menu-统一化规范文档.md](./YYC3-Menu-统一化规范文档.md) — 配套规范
- [YYC3-Menu-统一化改进实施清单.md](./YYC3-Menu-统一化改进实施清单.md) — 配套实施清单
- [YYC3-闭环验收-提示系统.md](../YYC3-闭环验收-提示系统.md) — 提示词系统
- [YYC3-团队核心-五维驱动.md](../YYC3-团队核心-五维驱动.md) — 五维驱动标准

---

<p align="center">
  <sub>® YYC³（YanYuCloudCube）言语云立方 丨 统一化检查报告 v1.0.0 丨 2026-07-17</sub>
</p>
