# 🎨 YYC³ 统一化规范文档 (Design & Code Standard)

> **版本**: v3.0.0 | **生效日期**: 2026-07-11
> **适用范围**: 全部前端组件、API路由、Hooks、Lib模块、文档

---

## 一、设计语言规范

### 1.1 颜色系统

**原则：禁止在业务代码中使用原始 Tailwind 颜色名，必须使用语义化 CSS 变量 token。**

#### 语义化 Token 映射表

| 用途 | ✅ 正确用法 (语义token) | ❌ 错误用法 (原始值) |
|------|------------------------|---------------------|
| 页面背景 | `bg-background` | `bg-white`, `bg-slate-50` |
| 页面文字 | `text-foreground` | `text-slate-900`, `text-gray-900` |
| 次要文字 | `text-muted-foreground` | `text-slate-500`, `text-gray-500` |
| 卡片背景 | `bg-card` | `bg-white` |
| 边框 | `border-border` | `border-slate-200`, `border-gray-200` |
| 主要按钮 | `bg-primary hover:bg-primary/90` | `bg-blue-600 hover:bg-blue-700` |
| 主要按钮文字 | `text-primary-foreground` | `text-white` |
| 危险操作 | `bg-destructive` | `bg-red-600` |
| 次要按钮 | `bg-secondary` | `bg-slate-100` |

#### 状态色 (通过 StatusBadge 组件统一)

```tsx
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge'

// ✅ 正确
<StatusBadge variant={getStatusVariant(customer.status)}>
  {customer.status}
</StatusBadge>

// ❌ 错误 — 不要手写状态色
<span className="bg-green-100 text-green-800 border-green-200">活跃</span>
```

| 状态 | Variant | 颜色 |
|------|---------|------|
| 活跃/完成/成功 | `success` | green-100/800 |
| 待处理/审核中 | `warning` | yellow-100/800 |
| 失败/离线/取消 | `danger` | red-100/800 |
| 进行中 | `info` | blue-100/800 |
| 中性 | `neutral` | slate-100/800 |

#### 主题色 (每个功能模块)

侧边栏导航已为每个模块定义颜色 (在 `lib/theme-colors.ts`)。模块页面内的强调色应从 `getThemeForPath(pathname)` 获取，不硬编码。

### 1.2 排版系统

| 级别 | Tailwind Class | 用途 |
|------|---------------|------|
| H1 | `text-2xl font-bold` | 页面标题 (PageContainer title) |
| H2 | `text-xl font-semibold` | 区块标题 (CardTitle) |
| H3 | `text-lg font-medium` | 子标题 |
| Body | `text-sm` | 正文 |
| Caption | `text-xs text-muted-foreground` | 辅助说明 (CardDescription) |

### 1.3 图标系统

统一使用 `lucide-react`，禁止混用其他图标库。

```tsx
import { Users, CheckSquare, BarChart3 } from "lucide-react"
```

图标尺寸标准：
- 按钮内图标: `h-4 w-4`
- 列表项图标: `h-5 w-5`
- 卡片头部图标: `h-6 w-6`

### 1.4 组件规范

**按钮**: 一律使用 `<Button>` 组件 (`@/components/ui/button`)，禁止原生 `<button>`。
```tsx
// ✅ 正确
<Button variant="default" size="sm">保存</Button>
<Button variant="outline">取消</Button>
<Button variant="destructive">删除</Button>

// ❌ 错误
<button className="bg-blue-600 ...">保存</button>
```

**卡片**: 使用 `<Card>` + `<CardHeader>` + `<CardContent>` 结构。

**表单**: 使用 `<Input>`, `<Select>`, `<Switch>`, `<Label>` — 不用原生 HTML 元素。

---

## 二、代码规范

### 2.1 文件头注释模板

所有 `.ts` / `.tsx` 文件必须有标准头：

```typescript
/**
 * @fileoverview <文件功能简述>
 * @description <详细说明>
 * @author YYC³
 * @version 3.0.0
 * @created YYYY-MM-DD
 * @license MIT
 */
```

### 2.2 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件名 | kebab-case | `customer-management.tsx` |
| 组件名 | PascalCase | `CustomerManagement` |
| 函数名 | camelCase | `fetchCustomers` |
| 常量 | UPPER_SNAKE | `MAX_FILE_SIZE` |
| Hook名 | use前缀 | `useCustomers` |
| 类型/接口 | PascalCase | `Customer`, `ApiResponse` |
| API路由目录 | kebab-case | `app/api/customer-reports/` |

### 2.3 导入导出规范

**引号**: 统一双引号 `"`
```tsx
// ✅ 正确
import { useState } from "react"
import { Button } from "@/components/ui/button"

// ❌ 错误
import { useState } from 'react'
```

**导入顺序**:
1. React/Next.js (`react`, `next/navigation`, `next/link`)
2. 第三方库 (`lucide-react`, `swr`)
3. 内部组件 (`@/components/ui/*`)
4. 内部Hook (`@/hooks/*`)
5. 内部Lib (`@/lib/*`)
6. 类型导入 (`import type { ... }`)
7. 样式 (`./globals.css`)

### 2.4 API路由模式

所有API路由必须遵循统一模式：

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiRequest } from '@/lib/api/auth-guard'
import { checkDatabaseConnection } from '@/lib/db/client'
import { withCache, invalidateResourceCache, buildCacheKey } from '@/lib/db/cache'
import { writeAuditLog } from '@/lib/audit/logger'

export async function GET(request: NextRequest) {
  try {
    // 1. 认证
    const auth = authenticateApiRequest(request)
    if (!auth.authenticated) return auth.response

    // 2. 数据库连接检查
    if (!(await checkDatabaseConnection())) {
      return NextResponse.json({ success: false, error: '数据库连接失败' }, { status: 503 })
    }

    // 3. 缓存查询
    const cacheKey = buildCacheKey('resource', params)
    const result = await withCache(cacheKey, () => repository.findAll(params))

    // 4. 返回
    return NextResponse.json({ success: true, data: result.data })
  } catch (error: unknown) {
    console.error('操作失败:', error)
    return NextResponse.json({ success: false, error: '操作失败' }, { status: 500 })
  }
}
```

### 2.5 错误处理规范

**API路由**: 统一 `catch (error: unknown)` + `console.error` + 标准JSON响应
**前端Hook**: SWR自动处理错误，通过 `error` 字段暴露
**Toast**: 统一 `toast({ title, description, variant })` 格式

### 2.6 数据获取规范

禁止在Hook中直接使用 `fetch()`。统一使用：

```typescript
// 列表 + CRUD
const { items, create, update, remove, isLoading } = useSWRResource<T>('/api/resource')

// 单个资源
const { data } = useSWR('/api/resource/id', fetcher)
```

---

## 三、交互体验规范

### 3.1 加载状态

**统一使用** `<PageLoadingSkeleton />` 组件。所有 `loading.tsx` 文件必须：

```tsx
import { PageLoadingSkeleton } from "@/components/ui/loading-skeleton"
export default function Loading() {
  return <PageLoadingSkeleton />
}
```

禁止 `return null` 或自定义骨架屏。

### 3.2 表单交互

| 场景 | 规范 |
|------|------|
| 必填标识 | `<Label>` + 红色 `*` 后缀 |
| 验证错误 | `aria-describedby` + 红色文字提示 |
| 提交按钮 | `disabled={isLoading}` + `Loader2` 动画 |
| 成功反馈 | `toast({ title: "操作成功" })` |
| 失败反馈 | `toast({ title: "操作失败", variant: "destructive" })` |

### 3.3 弹窗 (Dialog)

使用 shadcn `<Dialog>` 组件，配置统一：
- `aria-labelledby` 指向 DialogTitle
- 关闭按钮在右上角 (`<DialogClose>`)
- 确认/取消按钮在底部，确认在右

### 3.4 表格操作

| 操作 | 组件 | 规范 |
|------|------|------|
| 新增 | `<Button>` + `Plus` 图标 | 右上角 |
| 编辑 | `<Button variant="ghost" size="sm">` + `Pencil` 图标 | 行末 |
| 删除 | `<Button variant="ghost" size="sm">` + `Trash2` 图标 | 行末 + 确认弹窗 |
| 搜索 | `<Input>` + `Search` 图标 | 左上角 |
| 筛选 | `<Select>` | 搜索右侧 |

### 3.5 错误边界

- 页面级: `app/error.tsx` (已存在)
- 全局级: `app/global-error.tsx` (已存在)
- 加载级: `app/loading.tsx` → `<PageLoadingSkeleton />`

---

## 四、文档规范

### 4.1 API文档格式

每个API端点文档化时使用此模板：

```markdown
### POST /api/resource

**认证**: 需要 Bearer Token

**请求体**:
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | ✅ | 资源名称 |

**响应** (201):
```json
{ "success": true, "data": { "id": 1, "name": "..." } }
```

**错误码**:
| 状态码 | 说明 |
|--------|------|
| 400 | 数据验证失败 |
| 401 | 未认证 |
| 403 | 无权限 |
| 503 | 数据库不可用 |
```

### 4.2 组件文档

```markdown
### ComponentName

**用途**: 一句话描述

**Props**:
| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|

**示例**:
```tsx
<ComponentName prop="value" />
```
```

### 4.3 根目录文档命名

| 文档 | 命名规范 | 用途 |
|------|---------|------|
| 核心文档 | `UPPERCASE.md` | README, AGENTS, SECURITY |
| 报告类 | `UPPERCASE-REPORT.md` | AUDIT-REPORT, TEST-AUDIT-REPORT |
| 清单类 | `UPPERCASE-LIST.md` | ISSUE-LIST |
| 方案类 | `UPPERCASE-PLAN.md` | MVP-EXPANSION-PLAN |
