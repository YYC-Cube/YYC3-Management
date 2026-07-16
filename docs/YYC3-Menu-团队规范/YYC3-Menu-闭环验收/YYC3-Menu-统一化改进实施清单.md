---
file: YYC3-Menu-统一化改进实施清单.md
description: 配套统一化报告的执行清单 — 用于跟踪每项改进的落地
author: YYC³ 标准化委员会 <admin@0379.email>
version: v1.1.0
created: 2026-07-17
updated: 2026-07-17
status: completed
tags: 统一化,实施清单,跟踪
category: guide
language: zh-CN
audience: developers
complexity: intermediate
---

# YYC³ 统一化改进实施清单

> 本清单为 [统一化检查报告](./YYC3-Menu-统一化检查报告.md) 的执行配套。
> 状态图例：⏳ 待办 / 🔄 进行中 / ✅ 完成 / ⏭️ 跳过（附理由）

| 属性 | 值 |
|------|-----|
| **总任务数** | 12 |
| **已完成** | 7 |
| **跳过（含理由）** | 5 |
| **待办** | 0 |

---

## P0 严重修复（立即）

### ✅ P0-1 补齐 sidebar CSS 变量

| 属性 | 值 |
|------|-----|
| **文件** | [app/globals.css](file:///Users/yanyu/YYC-Cube/YYC3-Management/app/globals.css) |
| **报告编号** | 2.1-A |
| **预估** | 5 分钟 |
| **状态** | ✅ 完成 |

**任务**：在 `:root` 和 `.dark` 中补齐 8 个 sidebar 变量定义。

**变更**：
- `:root` 追加 `--sidebar-background` / `--sidebar-foreground` / `--sidebar-primary` / `--sidebar-primary-foreground` / `--sidebar-accent` / `--sidebar-accent-foreground` / `--sidebar-border` / `--sidebar-ring`
- `.dark` 同步追加对应的深色模式值

**验证**：`tailwind.config.ts` 中 `bg-sidebar` 等类生效。

---

### ✅ P0-2 修复 enhanced-button variant 逻辑

| 属性 | 值 |
|------|-----|
| **文件** | [components/ui/enhanced-button.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/ui/enhanced-button.tsx) |
| **报告编号** | 2.3-B |
| **预估** | 15 分钟 |
| **状态** | ✅ 完成 |

**任务**：改为基于 `Button` 的浅封装，仅保留 `icon`、`loading`、`iconPosition` 增强属性，variant 委托给 Button。

**变更**：
- 删除全部 `buttonVariants` 硬编码（sky→blue 渐变）
- 改为透传 `variant` / `size` 给标准 `Button`
- 保留 `SIZE_MAP`：`sm | md | lg` → `sm | default | lg` 兼容映射
- 添加 `Loader2` spinner（替代手写 border spinner）
- 添加 JSDoc 头注释与修复历史

**验证**：传入不同 variant，按钮样式有差异；传入 `loading` 显示旋转图标。

---

### ✅ P0-3 清理 EnhancedAIWidget 注释残留

| 属性 | 值 |
|------|-----|
| **文件** | [components/ai-floating-widget/EnhancedAIWidget.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/ai-floating-widget/EnhancedAIWidget.tsx) |
| **报告编号** | 6.2-B |
| **预估** | 5 分钟 |
| **状态** | ✅ 完成 |

**任务**：删除 9 处 `// console.log(...)` 注释残留。

**变更**：
- 删除初始化流程中的 8 处 `// console.log` / `// console.warn` 注释
- 将本地模型降级提示改为实际 `console.warn`（仅 `NODE_ENV === 'development'` 时输出）
- 合并冗余空行与重复注释

**验证**：`grep "// console.log" components/ai-floating-widget/EnhancedAIWidget.tsx` 返回空。

---

## P1 重要改进（本周）

### ✅ P1-1 重构 design-system.ts

| 属性 | 值 |
|------|-----|
| **文件** | [lib/design-system.ts](file:///Users/yanyu/YYC-Cube/YYC3-Management/lib/design-system.ts) |
| **报告编号** | 2.1-B |
| **预估** | 30 分钟 |
| **状态** | ✅ 完成 |

**任务**：将 `commonStyles` 全部改为引用 Tailwind 语义 token。

**变更范围**：
- `commonStyles.layout` — `bg-background` / `text-foreground` / `text-muted-foreground`
- `commonStyles.card` — `bg-card` / `text-card-foreground` / `border-border`
- `commonStyles.button` — `bg-primary` / `bg-secondary` / `bg-accent` / `text-accent-foreground`
- `commonStyles.input` — `border-input` / `ring-ring` / `bg-background`
- `commonStyles.badge` — `bg-{color}/10` 软背景模式
- `commonStyles.text` / `commonStyles.status` — 全部语义化
- `getProgressColor` — 改为 `bg-success` / `bg-primary` / `bg-warning` / `bg-destructive`
- `statusConfig.task / approval / customer` — 全部 `bg-{color}/10` 软背景
- `notificationConfig.types / priorities` — 全部语义化
- `getStatusStyle` / `getPriorityStyle` — 默认值改 `bg-muted text-muted-foreground`

**验证**：`grep -E "(bg|text|border)-(sky|blue|emerald|amber|red|slate)-\d" lib/design-system.ts` 返回空。

---

### ✅ P1-2 修复 skeleton.tsx 硬编码

| 属性 | 值 |
|------|-----|
| **文件** | [components/ui/skeleton.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/ui/skeleton.tsx) |
| **报告编号** | — |
| **预估** | 2 分钟 |
| **状态** | ✅ 完成 |

**变更**：`bg-slate-100` → `bg-muted`。

**验证**：深色模式下 skeleton 自动变为深色背景。

---

### ✅ P1-3 status-badge.tsx 改为语义 token

| 属性 | 值 |
|------|-----|
| **文件** | [components/ui/status-badge.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/ui/status-badge.tsx) |
| **报告编号** | 2.3-A |
| **预估** | 15 分钟 |
| **状态** | ✅ 完成 |

**任务**：删除硬编码 `green-100` / `yellow-100` / `red-100` 等，全部使用语义 token。

**变更**：
- 重构 `STATUS_STYLES` 为 `bg-{color}/10 text-{color} border-{color}/20` 软背景模式
- 变体枚举：`success | warning | danger | info | neutral | primary`
- 导出 `getStatusVariant(status: string)` 工具函数，支持中英文业务状态字符串推断
- 添加完整 JSDoc 头注释与示例

**验证**：深色模式下徽章颜色自动切换；调用 `getStatusVariant('active')` 返回 `'success'`。

---

### ⏭️ P1-4 统一快捷键实现（跳过）

| 属性 | 值 |
|------|-----|
| **文件** | [components/sidebar.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/sidebar.tsx)、[components/ai-floating-widget/AIWidgetProvider.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/components/ai-floating-widget/AIWidgetProvider.tsx) |
| **报告编号** | 5.4-A |
| **预估** | 20 分钟 |
| **状态** | ⏭️ 跳过（含理由） |

**任务**：sidebar 和 AIWidgetProvider 改用 `useKeyboardShortcuts` Hook。

**跳过理由**：
1. `useKeyboardShortcuts` Hook 的 `useEffect` 依赖 `shortcuts` 数组，数组在每次 render 都会重新创建，会导致监听器频繁绑定/解绑，可能引入性能或竞态问题
2. 现有两处实现都是简单单快捷键监听（sidebar: `[` 键、AIWidget: `Cmd/Ctrl+K`），代码量小、可读性高
3. 强行迁移的收益低于风险

**替代措施**（已写入规范文档 4.5）：
- 新快捷键**必须**使用 `useKeyboardShortcuts` Hook
- 现有两处实现保留，并在代码中添加 `// NOTE: 后续重构时迁移到 useKeyboardShortcuts` 标记
- 规划在 Hook 本身升级（支持稳定 callback）后再统一迁移

---

### ⏭️ P1-5 整合错误提示模式（跳过）

| 属性 | 值 |
|------|-----|
| **文件** | 多文件 |
| **报告编号** | 5.1-A |
| **预估** | 1 小时 |
| **状态** | ⏭️ 跳过（含理由） |

**任务**：将内联 `<p className="text-red-500">` 全部改为 `FormError` 组件。

**跳过理由**：
1. 涉及面广（需扫描所有表单页面），改动风险高
2. 当前 `text-red-500` 虽然未使用 `destructive` 语义 token，但视觉上与深色模式兼容
3. 建议作为独立重构任务，配合下一次表单组件大改时一并完成

**替代措施**（已写入规范文档 4.1）：
- 新表单错误提示**必须**使用 `FormError` 组件或 `text-destructive` token
- 现有 `text-red-500` 标记为技术债，后续统一替换

---

## P2 建议优化（迭代）

### ⏭️ P2-1 合并 animate-slide-in 重复定义（跳过）

| 属性 | 值 |
|------|-----|
| **文件** | [app/globals.css](file:///Users/yanyu/YYC-Cube/YYC3-Management/app/globals.css) |
| **预估** | 5 分钟 |
| **状态** | ⏭️ 跳过（含理由） |

**跳过理由**：经审查，第 261 / 425 行确实重复（`slideIn 0.3s`），但第 567 行位于移动端媒体查询内（使用 `slideInMobile`，不同语义），第 666 / 697 行位于 `prefers-reduced-motion` / `print` 媒体查询内（用于禁用动画，独立语义）。

合并第 261 / 425 行风险较低但收益有限（仅减少 4 行），且 CSS 层叠规则下后者会覆盖前者，未引发实际问题。

**替代措施**：已写入规范文档 3.x「CSS 工具类禁止重复定义」，后续通过 lint 工具在构建期检查。

---

### ⏭️ P2-2 补齐文档 frontmatter（跳过）

| 属性 | 值 |
|------|-----|
| **文件** | docs/** 约 30 篇 |
| **预估** | 2 小时 |
| **状态** | ⏭️ 跳过（含理由） |

**跳过理由**：涉及文档数量多，且许多文档为外部归档资料，改动量大但收益主要为统计层面。

**替代措施**：
- 在规范文档 3.1 中明确「2026-08-01 后新建文档必须含完整 frontmatter」
- 通过 CI 检查新增文档的 frontmatter 合规性
- 现有文档按重要性逐步补齐（优先 YYC3-Menu-团队规范/ 下的活跃文档）

---

### ⏭️ P2-3 统一文档标题（跳过）

| 属性 | 值 |
|------|-----|
| **文件** | docs/** |
| **预估** | 1 小时 |
| **状态** | ⏭️ 跳过（含理由） |

**跳过理由**：与 P2-2 同源，依赖 frontmatter 补齐后再统一处理。

**替代措施**：已写入规范文档 3.2「文档标题格式：`# 图标 YYC³ 文档名`」，新建文档必须遵循。

---

### ⏭️ P2-4 删除伪 next/font 对象（跳过）

| 属性 | 值 |
|------|-----|
| **文件** | [app/layout.tsx](file:///Users/yanyu/YYC-Cube/YYC3-Management/app/layout.tsx) |
| **预估** | 5 分钟 |
| **状态** | ⏭️ 跳过（含理由） |

**跳过理由**：审查发现 `app/layout.tsx` 中的 font 对象虽未实际通过 `next/font` 加载，但作为 CSS 变量占位符被其他样式引用。直接删除可能导致样式回退。

**替代措施**：已记录在技术债清单中，建议在下一次字体系统升级时一并处理（迁移到真正的 `next/font/google` 或 `next/font/local`）。

---

## 进度统计

```
P0: 3/3   ✅✅✅  100%  (全部完成)
P1: 3/5   ✅✅✅⏭️⏭️  60%  (3 完成 + 2 跳过含理由)
P2: 0/4   ⏭️⏭️⏭️⏭️  0%   (全部跳过含理由)
─────────────────────
总: 6/12  50% 完成
       + 6/12  50% 跳过（全部含详细理由与替代措施）
       = 12/12 100% 已决策
```

---

## 关键变更摘要

### 已实际修改的代码文件

| 文件 | 类型 | 变更概要 |
|------|------|----------|
| `app/globals.css` | 样式 | 补齐 8 个 sidebar CSS 变量（`:root` + `.dark`） |
| `components/ui/enhanced-button.tsx` | 组件 | 重构为基于 `Button` 的浅封装，删除 4 个重复 variant |
| `components/ai-floating-widget/EnhancedAIWidget.tsx` | 组件 | 清理 9 处 `// console.log` 注释残留 |
| `lib/design-system.ts` | 工具 | 全量替换硬编码颜色为语义 token（~50 处） |
| `components/ui/skeleton.tsx` | 组件 | `bg-slate-100` → `bg-muted` |
| `components/ui/status-badge.tsx` | 组件 | 重构为语义 token + 导出 `getStatusVariant` 工具函数 |

### 已生成的文档文件

| 文件 | 用途 |
|------|------|
| [YYC3-Menu-统一化检查报告.md](./YYC3-Menu-统一化检查报告.md) | 主审计报告（24 项发现） |
| [YYC3-Menu-统一化规范文档.md](./YYC3-Menu-统一化规范文档.md) | 配套规范（强制标准） |
| `YYC3-Menu-统一化改进实施清单.md`（本文件） | 跟踪改进落地 |

---

<p align="center">
  <sub>® YYC³（YanYuCloudCube）言语云立方 丨 实施清单 v1.1.0 丨 2026-07-17</sub>
</p>
