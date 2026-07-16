---
file: YYC3-Menu-统一化规范文档.md
description: YYC³ 项目统一化规范 — 设计语言/代码/文档/交互四维标准
author: YYC³ 标准化委员会 <admin@0379.email>
version: v1.0.0
created: 2026-07-17
updated: 2026-07-17
status: stable
tags: 统一化,规范,设计语言,代码规范,文档规范,交互规范
category: policy
language: zh-CN
audience: developers,designers,managers
complexity: advanced
---

# YYC³ 项目统一化规范文档

> ***YanYuCloudCube***
> *言启千行代码 丨 语枢万物智能*
> *本规范为 [统一化检查报告](./YYC3-Menu-统一化检查报告.md) 的配套执行标准*

| 属性 | 值 |
|------|-----|
| **适用版本** | v3.0+ |
| **技术栈基线** | Next.js 16 + React 19 + TypeScript 7 + Tailwind 4 + shadcn/ui + Radix UI |
| **强制级别** | 🔴 必须 / 🟠 应当 / 🟡 建议 |

---

## 📋 目录

- [1. 设计语言规范](#1-设计语言规范)
- [2. 代码规范](#2-代码规范)
- [3. 文档规范](#3-文档规范)
- [4. 交互规范](#4-交互规范)
- [5. 浮窗AI规范](#5-浮窗ai规范)
- [6. 附录：决策表](#6-附录决策表)

---

## 1. 设计语言规范

### 1.1 颜色系统

#### 🔴 1.1.1 必须使用语义 token

所有颜色应用必须通过 Tailwind 语义化 utility 引用 CSS 变量，禁止硬编码色值。

**✅ 正确**：

```tsx
<div className="bg-background text-foreground" />
<div className="bg-primary text-primary-foreground hover:bg-primary/90" />
<div className="text-muted-foreground border-b border-border" />
<div className="bg-destructive/10 text-destructive" />  {/* 软背景 */}
```

**❌ 错误**：

```tsx
<div className="bg-white text-slate-900" />            {/* 硬编码 */}
<div className="bg-sky-400 text-blue-600" />           {/* 硬编码 */}
<div className="bg-green-100 text-emerald-800" />      {/* 硬编码 */}
```

#### 🔴 1.1.2 可用语义 token 清单

| Token | 用途 | 浅色值 | 深色值 |
|-------|------|--------|--------|
| `bg-background` / `text-foreground` | 页面背景/前景 | white | slate-950 |
| `bg-card` / `text-card-foreground` | 卡片背景/前景 | white | slate-950 |
| `bg-popover` / `text-popover-foreground` | 弹出层背景/前景 | white | slate-950 |
| `bg-primary` / `text-primary-foreground` | 主色（品牌色） | blue-600 | blue-500 |
| `bg-secondary` / `text-secondary-foreground` | 次要按钮/标签 | slate-100 | slate-800 |
| `bg-muted` / `text-muted-foreground` | 静默背景/说明文字 | slate-100 | slate-800 |
| `bg-accent` / `text-accent-foreground` | 强调/悬停 | slate-100 | slate-800 |
| `bg-destructive` / `text-destructive-foreground` | 错误/危险 | red-500 | red-900 |
| `bg-success` / `text-success-foreground` | 成功 | green-500 | — |
| `bg-warning` / `text-warning-foreground` | 警告 | amber-500 | — |
| `border-border` | 边框 | slate-200 | slate-800 |
| `border-input` | 输入框边框 | slate-200 | slate-800 |
| `ring-ring` | 焦点环 | blue-600 | blue-300 |
| `bg-sidebar` / `text-sidebar-foreground` | 侧边栏 | (待补齐) | (待补齐) |
| `bg-chart-1..5` | 图表色 | — | — |

#### 🟠 1.1.3 状态色规范

状态色必须通过扩展的 `success` / `warning` 或基于 `destructive` 的软背景实现：

```tsx
// ✅ 推荐方式
<Badge variant="default">普通</Badge>
<Badge variant="success">成功</Badge>      {/* bg-success */}
<Badge variant="warning">警告</Badge>      {/* bg-warning */}
<Badge variant="destructive">失败</Badge>

// ✅ 自定义状态徽章（基于 Badge 扩展）
<Badge className="bg-success/10 text-success border-success/20">活跃</Badge>
<Badge className="bg-warning/10 text-warning border-warning/20">待处理</Badge>
<Badge className="bg-destructive/10 text-destructive border-destructive/20">已取消</Badge>
```

#### 🟡 1.1.4 渐变与阴影

- 渐变：仅用于品牌标识、Hero 区、AI 浮窗头部等强调区域，常规 UI 禁用
- 阴影：使用 Tailwind 预设 `shadow-sm` / `shadow-md` / `shadow-lg`，不自定义

### 1.2 排版系统

#### 🔴 1.2.1 字体栈

```css
font-family: "Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont,
             "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans SC", sans-serif;
```

- 正文：`font-sans`（默认）
- 等宽：`font-mono`（代码、数字、ID）

#### 🔴 1.2.2 字号阶梯

| Tailwind 类 | px（桌面） | px（移动） | 用途 |
|------------|-----------|-----------|------|
| `text-xs` | 12px | 12px | 标签、辅助文字 |
| `text-sm` | 14px | 14px | 正文小、表单 |
| `text-base` | 16px | 16px | 正文（默认） |
| `text-lg` | 18px | 16px | 副标题 |
| `text-xl` | 20px | 18px | 卡片标题 |
| `text-2xl` | 24px | 20px | 页面标题 |
| `text-3xl` | 30px | 24px | Hero 标题 |

#### 🟠 1.2.3 行高与字重

- 正文行高：`leading-relaxed`（1.625）
- 标题行高：`leading-tight`（1.25）
- 字重：`font-medium`（500）/ `font-semibold`（600）/ `font-bold`（700）
- **禁止** `font-normal` 用于标题，**禁止** `font-light` 用于正文

### 1.3 组件样式规范

#### 🔴 1.3.1 单一组件源（Single Source of Truth）

每个 UI 原语只允许一个标准实现：

| 原语 | 标准组件 | 禁止变体 |
|------|---------|---------|
| 按钮 | `components/ui/button.tsx` | ❌ `enhanced-button.tsx`（待迁移） |
| 卡片 | `components/ui/card.tsx` | ❌ `enhanced-card.tsx`（待迁移） |
| 进度条 | `components/ui/progress.tsx` | ❌ `enhanced-progress.tsx` / `interactive-progress.tsx` |
| 徽章 | `components/ui/badge.tsx` | ❌ `status-badge.tsx`（应改为 Badge 的 variant） |
| 骨架屏 | `components/ui/skeleton.tsx` + `loading-skeleton.tsx`（组合） | — |
| 输入框 | `components/ui/input.tsx` | — |
| 对话框 | `components/ui/dialog.tsx` | — |

#### 🔴 1.3.2 组件 variant 规范

**Button variant**（不可扩展，需扩展时向 `button.tsx` 提 PR）：

```tsx
const buttonVariants = {
  variant: {
    default, destructive, outline, secondary, ghost, link, success, warning
  },
  size: { default: 'h-10', sm: 'h-9', lg: 'h-11', icon: 'h-10 w-10' }
}
```

#### 🟠 1.3.3 组件封装原则

需要增强标准组件时（如添加 `icon`、`loading`），必须基于标准组件浅封装：

```tsx
// ✅ 正确：基于 Button 浅封装
export function IconButton({ icon: Icon, loading, children, ...props }) {
  return (
    <Button disabled={loading} {...props}>
      {loading ? <Loader2 className="animate-spin" /> : <Icon />}
      {children}
    </Button>
  )
}

// ❌ 错误：复制粘贴 Button 源码并修改
export function EnhancedButton(...) {
  const buttonVariants = { /* 重新定义 */ }
  return <button className={buttonVariants[variant]} />
}
```

### 1.4 图标系统

#### 🔴 1.4.1 唯一图标库

- **必须** 使用 `lucide-react`
- **禁止** 引入 `@heroicons/react`、`react-icons/*`、`@radix-ui/react-icons`

#### 🔴 1.4.2 图标尺寸

| 用途 | 类名 | 尺寸 |
|------|------|------|
| 表格行内 / 标签前 | `h-3.5 w-3.5` 或 `h-4 w-4` | 14-16px |
| 按钮内 | `h-4 w-4`（默认） / `h-5 w-5`（lg） | 16-20px |
| 卡片标题前 | `h-5 w-5` | 20px |
| Hero 区 / 空状态 | `h-8 w-8` / `h-12 w-12` | 32-48px |

#### 🟠 1.4.3 图标命名

- 使用 `PascalCase`：`ChevronDown`、`MessageSquare`
- 别名导入避免冲突：`import { ChevronDown as ChevronDownIcon } from 'lucide-react'`

### 1.5 交互模式

#### 🔴 1.5.1 过渡动画

| 场景 | 类名 | 时长 |
|------|------|------|
| 按钮/链接悬停 | `transition-colors duration-200` | 200ms |
| 卡片/模态出场 | `transition-all duration-300` | 300ms |
| 页面切换 | `transition-opacity duration-500` | 500ms |

#### 🔴 1.5.2 焦点环

所有可交互元素必须包含：

```tsx
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

#### 🔴 1.5.3 触摸目标

- 移动端所有可点击元素：`min-w-[44px] min-h-[44px]`（WCAG 2.5.5）
- 使用 `.touch-target` utility

---

## 2. 代码规范

### 2.1 命名规范

#### 🔴 2.1.1 强制命名约定

| 类型 | 约定 | 示例 |
|------|------|------|
| 文件（组件） | `kebab-case.tsx` | `advanced-search-bar.tsx` |
| 文件（非组件） | `kebab-case.ts` | `format-currency.ts` |
| React 组件 | `PascalCase` | `IntelligentAIWidget` |
| Hook 函数 | `useXxx` | `useAIWidget` |
| 普通函数 | `camelCase` | `formatCurrency` |
| 常量 | `camelCase` 或 `UPPER_SNAKE` | `commonStyles` / `MAX_SIZE` |
| 类型/接口 | `PascalCase` | `WidgetPosition` |
| 枚举值 | 中文业务值 + 引号 | `'待处理'`、`'进行中'` |
| CSS 变量 | `--kebab-case` | `--primary-foreground` |
| CSS 类 | `kebab-case` 或 Tailwind | `.responsive-card` |

### 2.2 代码格式

#### 🔴 2.2.1 强制格式

- 缩进：**2 空格**（.editorconfig 强制）
- 引号：**单引号** `'`
- 分号：**始终使用**
- 行尾：**LF**
- 最大行宽：**120 字符**
- 末尾换行：**是**

#### 🟠 2.2.2 import 顺序

```tsx
// 1. React / Next.js
import React, { useState, useEffect } from 'react'
import Link from 'next/link'

// 2. 第三方库（按字母序）
import { motion } from 'framer-motion'
import { SomeType } from 'zod'

// 3. @/lib（按字母序）
import { cn } from '@/lib/utils'
import { ApiErrorHandler } from '@/lib/api/response-handler'

// 4. @/components（按字母序）
import { Button } from '@/components/ui/button'
import { IntelligentAIWidget } from '@/components/ai-floating-widget'

// 5. 相对路径
import { SubComponent } from './SubComponent'

// 6. 类型（独立 import type）
import type { ReactNode } from 'react'
```

### 2.3 注释规范

#### 🔴 2.3.1 文件头注释（强制）

所有 `.tsx` / `.ts` 业务文件必须以 JSDoc 头注释开始：

```tsx
/**
 * @fileoverview 一句话功能描述
 * @description 详细描述（可选，多行）
 * @author YYC³
 * @version 3.0.0
 * @created YYYY-MM-DD
 * @modified YYYY-MM-DD
 * @copyright Copyright (c) 2025-2026 YYC³
 * @license MIT
 */
```

**例外**：shadcn/ui 原生组件（`components/ui/*` 来自 `bunx shadcn-ui add`）保留上游风格。

#### 🟠 2.3.2 函数注释

公共 API 函数必须使用 JSDoc：

```tsx
/**
 * 格式化金额为人民币显示
 * @param amount - 金额（分）
 * @param withSymbol - 是否包含 ￥ 符号
 * @returns 形如 "￥1,234" 的字符串
 * @example
 * formatCurrency(123456) // "￥1,235"
 */
export function formatCurrency(amount: number, withSymbol = true): string { ... }
```

#### 🟡 2.3.3 行内注释

- 中文注释，说明"为什么"而非"是什么"
- 避免明显注释：`const count = 0 // 计数器初始化为 0` ❌
- 推荐意图注释：`const count = 0 // 首次渲染不触发副作用` ✅

#### 🔴 2.3.4 禁止注释代码

- 所有注释掉的代码必须删除
- 调试用 `console.log` 必须通过 `logger` 工具或环境变量门控
- 历史代码通过 Git 追溯，无需在源码中保留

### 2.4 文件结构

#### 🔴 2.4.1 目录布局（强制）

```
app/                    # 路由（每个页面 ≤ 200 行，复杂逻辑抽到 components）
  ├── [route]/
  │   ├── page.tsx     # 页面入口
  │   ├── loading.tsx  # 路由级 loading
  │   └── error.tsx    # 路由级 error boundary
  ├── layout.tsx
  └── globals.css

components/
  ├── ui/              # shadcn/ui 原语（不修改样式，仅扩展 variant）
  ├── [业务模块]/       # 模块化目录（如 ai-floating-widget）
  └── [业务组件].tsx

hooks/                 # 自定义 Hook（一文件一 Hook）
lib/
  ├── api/             # API 客户端与中间件
  ├── validations/     # Zod schema
  ├── utils/           # 通用工具
  └── [领域]/          # 领域目录（agentic-core、i18n、db）
stores/                # Zustand store（一文件一 store）
types/                 # 全局类型定义
```

### 2.5 导入导出

#### 🔴 2.5.1 命名导出（强制）

```tsx
// ✅ 正确：命名导出
export function Button(...) {}
export const Button = React.forwardRef(...)
export { Button, buttonVariants }

// ❌ 错误：默认导出（除页面组件）
export default Button
```

**例外**：
- Next.js 页面（`page.tsx`）：`export default`
- 根 `layout.tsx`：`export default`
- 兼容第三方库的桥接模块可同时提供 `export default`

#### 🔴 2.5.2 type 导入

类型必须用 `import type`：

```tsx
import type { ReactNode, FC } from 'react'
import { useState } from 'react'  // 值导入
```

#### 🟠 2.5.3 模块出口文件

复杂模块（≥ 3 个文件）必须提供 `index.ts`：

```tsx
// components/ai-floating-widget/index.ts
export { IntelligentAIWidget } from './IntelligentAIWidget'
export { EnhancedAIWidget } from './EnhancedAIWidget'
export { AIWidgetProvider, useAIWidget, AIWidgetTrigger } from './AIWidgetProvider'
export { AIWidgetProvider as default } from './AIWidgetProvider'
```

---

## 3. 文档规范

### 3.1 frontmatter（强制）

#### 🔴 3.1.1 所有 Markdown 文档必须包含 frontmatter

```yaml
---
file: 文件名.md
description: 一句话描述
author: YYC³ <admin@0379.email>
version: v1.0.0
created: YYYY-MM-DD
updated: YYYY-MM-DD
status: draft | stable | deprecated
tags: 标签1,标签2
category: policy | spec | guide | reference
language: zh-CN
audience: developers | designers | managers | ops
complexity: beginner | intermediate | advanced
---
```

### 3.2 标题层级

#### 🔴 3.2.1 标题格式

```markdown
# 图标 YYC³ 文档标题
```

- **必须**：以单个 `#` 开始，全文仅一个 `#`
- **图标**：可选 emoji（📊、📋、🔧、📖、🚀）
- **命名**：`YYC³ ` 前缀 + 文档名（无文件扩展名）
- **副标题**：`> ***YanYuCloudCube***` + 标语

#### 🔴 3.2.2 层级约束

- `#`：仅一次（文档标题）
- `##`：主要章节
- `###`：子章节
- `####`：更细分区
- **禁止** 跳级（如 `#` 直接跳到 `###`）

### 3.3 API 文档格式

#### 🔴 3.3.1 标准结构

```markdown
### POST /api/v1/customers

创建新客户

#### 权限
- `customer:create`

#### 请求参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | ✅ | 客户名称（2-50 字符） |
| email | string | ❌ | 联系邮箱 |

#### 请求示例

\`\`\`bash
curl -X POST https://api.yyc3.vip/v1/customers \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"示例客户"}'
\`\`\`

#### 响应结构

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 客户 ID |
| name | string | 客户名称 |

#### 响应示例

\`\`\`json
{ "id": "cus_001", "name": "示例客户" }
\`\`\`

#### 错误码

| HTTP | code | 说明 |
|------|------|------|
| 400 | INVALID_PARAMS | 参数错误 |
| 401 | UNAUTHORIZED | 未认证 |
| 409 | DUPLICATE | 客户已存在 |
```

### 3.4 组件文档格式

#### 🔴 3.4.1 Props Table

```markdown
## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'default' \| 'success' \| 'warning'` | `'default'` | 视觉变体 |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| loading | `boolean` | `false` | 加载状态 |
| onClick | `() => void` | — | 点击回调 |
```

### 3.5 用户文档格式

- 包含 TOC（目录）
- 包含 FAQ（常见问题）
- 步骤型文档使用有序列表 + 截图
- 中文优先，关键术语括号附英文

### 3.6 开发文档格式

- Quickstart（5 分钟上手）
- Prerequisites（前置依赖）
- Installation（安装步骤）
- Usage（基础用法）
- Advanced（进阶）
- Contribution（贡献指南）

---

## 4. 交互规范

### 4.1 表单交互

#### 🔴 4.1.1 提交流程

```
用户填写 → 客户端 Zod 验证 → 字段错误内联显示 → 提交按钮 loading → 成功 toast / 失败 toast
```

#### 🔴 4.1.2 错误展示三层

| 层级 | 组件 | 触发条件 |
|------|------|---------|
| **字段错误** | `FormError` | Zod 字段校验失败 |
| **操作错误** | `toast({ variant: "destructive" })` | API 失败、业务异常 |
| **页面错误** | `error.tsx` + 重试按钮 | 路由级崩溃 |

**禁止**：
- 在字段下方用 `<p className="text-red-500">` 内联（应用 `FormError`）
- 用 `alert()` / `confirm()`（应用 Dialog）

### 4.2 弹窗行为

#### 🔴 4.2.1 统一组件

所有模态/非模态弹窗必须使用 `components/ui/dialog.tsx`（基于 Radix Dialog）。

**禁止**：自实现 portal + fixed 定位。

#### 🔴 4.2.2 关闭交互

- 点击遮罩关闭（默认）
- ESC 键关闭（默认）
- 关闭按钮在右上角（`<DialogClose>` 或自定义 `X` 图标）
- **禁止**：提交中、加载中允许关闭（应用 `onPointerDownOutside={e => e.preventDefault()}`）

#### 🟠 4.2.3 动画

```tsx
className="data-[state=open]:animate-in data-[state=closed]:animate-out
           data-[state=closed]:fade-out-80 data-[state=open]:fade-in-0
           data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
```

### 4.3 加载状态

#### 🔴 4.3.1 三层加载

| 层级 | 组件 | 适用场景 |
|------|------|---------|
| **路由级** | `loading.tsx` + `LoadingSkeleton` | 首次进入页面 |
| **组件级** | `<Skeleton>` | 卡片内、列表项 |
| **操作级** | 按钮 `loading` prop | 提交、保存 |

#### 🟠 4.3.2 骨架屏样式

```tsx
<Skeleton className="h-4 w-48" />     {/* 标题骨架 */}
<Skeleton className="h-8 w-full" />   {/* 内容骨架 */}
```

- 颜色：`bg-muted` 自动适应深色模式
- 圆角：`rounded-md`（与文本行匹配）
- 动画：`animate-pulse`（默认）

### 4.4 错误提示

#### 🔴 4.4.1 Toast 规范

```tsx
toast({
  title: "客户创建成功",           // 简洁标题（必填）
  description: "客户 ID: cus_001", // 补充说明（可选）
  variant: "default",              // default | destructive
})
```

**禁止**：
- `title` 使用英文（如 "Success"）
- 单纯 `description` 无 `title`
- 在 toast 中放复杂操作按钮（最多 1 个 action）

### 4.5 快捷键

#### 🔴 4.5.1 唯一实现路径

**必须** 使用 `lib/utils/keyboard-shortcuts.tsx` 的 `useKeyboardShortcuts` Hook：

```tsx
import { useKeyboardShortcuts } from '@/lib/utils/keyboard-shortcuts'

useKeyboardShortcuts({
  'mod+k': () => toggleAIWidget(),       // Ctrl/Cmd+K
  'mod+b': () => toggleSidebar(),        // Ctrl/Cmd+B
  'esc':   () => closeDialog(),          // ESC
})
```

**禁止**：在业务组件内直接 `window.addEventListener('keydown', ...)`。

#### 🟠 4.5.2 全局快捷键注册表

| 快捷键 | 功能 | 实现位置 |
|--------|------|---------|
| `Ctrl/Cmd + K` | 打开 AI 浮窗 | `AIWidgetProvider` |
| `Ctrl/Cmd + B` | 折叠侧边栏 | `Sidebar` |
| `ESC` | 关闭弹窗 | Radix Dialog 内置 |
| `Tab` | 焦点前进 | 浏览器默认 |
| `Shift + Tab` | 焦点后退 | 浏览器默认 |

#### 🟡 4.5.3 快捷键提示

触发元素必须提供 `title` 或 `aria-label`：

```tsx
<button title="打开AI助手 (Ctrl/Cmd + K)" aria-label="打开AI助手">
```

---

## 5. 浮窗AI规范

### 5.1 架构原则

#### 🔴 5.1.1 单一全局入口

浮窗 AI 必须通过 `app/layout.tsx` 的 `AIWidgetProvider` 全局挂载，**禁止**：
- 在业务页面独立引入 `<IntelligentAIWidget />`
- 在业务页面独立引入 `<EnhancedAIWidget />`
- 重复实例化 `AgenticCore`

**唯一例外**：`/ai-floating-demo` 与 `/enhanced-ai-demo` 演示页（应在文档明确标注"仅演示"）。

### 5.2 触发方式

#### 🔴 5.2.1 触发器 API

```tsx
import { useAIWidget } from '@/components/ai-floating-widget'

function MyComponent() {
  const { showWidget, hideWidget, toggleWidget } = useAIWidget()

  return <Button onClick={toggleWidget}>AI 助手</Button>
}
```

#### 🔴 5.2.2 全局快捷键

`Ctrl/Cmd + K` 必须在 `AIWidgetProvider` 内监听，不可在其他组件重复监听。

### 5.3 视觉规范

#### 🟠 5.3.1 浮窗尺寸

| 属性 | 值 |
|------|-----|
| 默认尺寸 | 400 × 600 |
| 最小尺寸 | 300 × 400 |
| 最大尺寸 | 800 × 800 |
| 默认位置 | 右上角（距右 20px，距上 100px） |
| z-index | `z-[100]` |

#### 🟠 5.3.2 颜色规范

浮窗必须使用语义 token，**禁止** 硬编码 sky/blue 渐变。

```tsx
// ✅ 正确
<div className="bg-popover text-popover-foreground border border-border shadow-lg" />

// ❌ 错误
<div className="bg-gradient-to-br from-sky-400 to-blue-500 text-white" />
```

### 5.4 行为规范

#### 🔴 5.4.1 关闭交互

- 点击浮窗外部：**不关闭**（浮窗为非模态）
- 点击关闭按钮（`X`）：关闭
- 再次按 `Ctrl/Cmd + K`：切换显隐
- ESC 键：关闭

#### 🔴 5.4.2 拖拽与缩放

- 标题栏可拖拽（cursor: `grab` / `grabbing`）
- 右下角可缩放（cursor: `nwse-resize`）
- 边界约束：浮窗不可拖出视口

#### 🟠 5.4.3 SSR 安全

窗口尺寸相关的初始化必须使用 `useEffect`：

```tsx
// ✅ 正确
const [position, setPosition] = useState<WidgetPosition>({ x: 100, y: 100 })
useEffect(() => {
  setPosition({ x: window.innerWidth - 420, y: 100 })
}, [])

// ❌ 错误（hydration 不匹配）
const position = { x: window.innerWidth - 420, y: 100 }
```

### 5.5 多模型切换

#### 🟡 5.5.1 模型清单

模型列表维护在 `IntelligentAIWidget.tsx` 的 `AI_MODELS` 常量，修改需同步：
1. [docs/YYC3-Menu-开发实施/架构类/YYC3-Menu-架构类-API接口文档.md](../../开发实施/架构类/YYC3-Menu-架构类-API接口文档.md)
2. [lib/agentic-core/](../../../../lib/agentic-core/) 的模型适配器

---

## 6. 附录：决策表

### 6.1 组件选型决策

| 场景 | 选择 | 理由 |
|------|------|------|
| 主操作按钮（提交、保存） | `Button variant="default"` | 主色突出 |
| 次要操作（取消） | `Button variant="outline"` | 弱化 |
| 危险操作（删除） | `Button variant="destructive"` | 警示 |
| 链接式按钮 | `Button variant="link"` | 内联导航 |
| 图标按钮 | `Button size="icon"` | 紧凑 |
| 状态展示 | `Badge` + 扩展 className | 统一原语 |
| 表单字段错误 | `<FormError>` | 一致样式 |
| 操作结果 | `toast()` | 非阻塞 |
| 页面级错误 | `error.tsx` | 路由级 |

### 6.2 颜色选型决策

| 场景 | 选择 | 理由 |
|------|------|------|
| 页面背景 | `bg-background` | 自适应深色 |
| 卡片背景 | `bg-card` | 区分页面 |
| 主色按钮 | `bg-primary` | 品牌色 |
| 危险操作 | `bg-destructive` | 警示 |
| 成功状态 | `bg-success` 或 `bg-success/10` | 扩展色 |
| 警告状态 | `bg-warning` 或 `bg-warning/10` | 扩展色 |
| 静默文字 | `text-muted-foreground` | 不抢眼 |
| 边框 | `border-border` | 统一灰度 |

### 6.3 注释决策

| 场景 | 选择 |
|------|------|
| 业务组件文件头 | JSDoc 头注释（强制） |
| shadcn/ui 原语 | 保留上游风格 |
| 公共函数 | JSDoc 函数注释 |
| 私有工具函数 | 行内注释（意图） |
| 调试代码 | 删除或 logger 门控 |

### 6.4 弹窗决策

| 场景 | 选择 |
|------|------|
| 确认删除 | `Dialog` + destructive Button |
| 表单编辑 | `Dialog` 或全屏页 |
| 信息展示 | `Popover`（非模态） |
| 下拉选择 | `Select` 或 `DropdownMenu` |
| 长内容 | 路由 + `loading.tsx` |

---

## 7. 检查清单（PR 自检）

提交 PR 前请逐项确认：

### 设计语言
- [ ] 所有颜色使用 `bg-*` / `text-*` 语义 token
- [ ] 无硬编码 sky / blue / slate 等色值
- [ ] 字号使用 Tailwind 预设
- [ ] 图标全部来自 lucide-react
- [ ] 焦点环完整

### 代码规范
- [ ] 文件名 kebab-case
- [ ] 组件名 PascalCase
- [ ] 2 空格缩进
- [ ] 单引号
- [ ] JSDoc 头注释
- [ ] 命名导出
- [ ] import 顺序正确
- [ ] type 与 value 分开 import

### 文档规范
- [ ] frontmatter 完整
- [ ] 标题格式 `# 图标 YYC³ 文档名`
- [ ] 层级不跳级
- [ ] API 文档按 3.3 格式

### 交互规范
- [ ] 表单错误用 FormError
- [ ] 操作结果用 toast
- [ ] 弹窗用 Dialog
- [ ] 加载用 Skeleton
- [ ] 快捷键用 useKeyboardShortcuts Hook

### 浮窗AI
- [ ] 未在业务页独立挂载浮窗
- [ ] 使用 useAIWidget 触发
- [ ] 浮窗内颜色用语义 token

---

<p align="center">
  <sub>® YYC³（YanYuCloudCube）言语云立方 丨 统一化规范 v1.0.0 丨 2026-07-17</sub>
</p>
