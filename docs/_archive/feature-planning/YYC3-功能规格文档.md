# 📐 YYC³ 功能规格文档

> **版本**: v3.0 | **日期**: 2026-07-11
> **覆盖**: P0+P1 共9个功能的详细规格

---

## F-01: 财务页面连接真实数据

### 功能描述

将 `app/finance/page.tsx` 从硬编码假数据切换到已有的 `useFinance` Hook和 `/api/finance` API。

### 用户场景

1. 用户进入财务页面 → 看到真实收支记录列表和汇总
2. 用户创建新的收支记录 → 表单提交 → 列表实时更新
3. 用户按类型/分类筛选 → 数据从后端过滤返回

### 技术规格

```
数据源: useFinance() → GET /api/finance (已有, 含Redis缓存)
汇总数据: useFinanceSummary() → GET /api/finance/summary (已有)
变更操作: createRecord() / updateRecord() / deleteRecord() (已有)
```

### 界面规范

- 顶部: 4个统计卡片 (总收入/总支出/净利润/利润率) — 使用 `<Card>` + `<StatisticsDashboard>`
- 中部: 收支趋势图 (recharts AreaChart)
- 下部: 收支记录表格 (`<Table>` + 筛选器 + 分页)
- 操作: 新增按钮(右上) + 编辑/删除(行末)

---

## F-02: 通知系统真实化

### 功能描述

连接 `notifications` 数据库表 → API路由 → 前端页面，替换5条假通知。

### 用户场景

1. 用户登录 → Header徽章显示未读数
2. 用户点击通知 → 标记已读 → 徽章数减少
3. 其他用户创建任务/审批 → 当前用户实时收到通知 (SSE)

### 技术规格

```
新文件:
  lib/db/repositories/notification.repository.ts
  hooks/use-notifications.ts

修改文件:
  app/api/notifications/route.ts → 连接NotificationRepository
  app/api/notifications/[id]/read/route.ts → 连接Repository.markAsRead()
  app/notifications/page.tsx → 使用useNotifications Hook
  components/header.tsx → 集成useRealtime + 未读计数
```

### 数据模型

```sql
-- 表已存在 (migration 005)
notifications(id, user_id, title, message, type, read, created_at)
```

### 界面规范

- Header: 铃铛图标 + 未读数字Badge (红色圆点)
- 通知页: 标签页(全部/未读/重要) + 通知列表卡片
- 通知项: 图标(类型) + 标题 + 内容 + 时间 + 已读/未读样式

---

## F-03: 审批页面连接工作流引擎

### 功能描述

将 `components/oa-approval.tsx` 从假审批数据切换到已有的 `/api/workflows` API。

### 用户场景

1. 用户提交报销/请假申请 → 创建工作流实例 → 进入审批流程
2. 管理者在审批页面看到待审批列表 → 点击通过/驳回
3. 提交者实时看到审批进度

### 技术规格

```
数据源: GET /api/workflows (已有, 工作流引擎完整)
操作: POST /api/workflows (发起) + POST /api/workflows/[id]/approve (审批)
Hook: 新建 hooks/use-workflows.ts (使用useSWRResource)
```

### 界面规范

- 标签页: 待我审批 / 我发起的 / 全部
- 审批卡片: 类型图标 + 标题 + 申请人 + 提交时间 + 当前状态(StatusBadge)
- 操作: 通过按钮(primary) + 驳回按钮(destructive, 弹出原因输入)
- 发起按钮: 右上角, 弹出发起表单Dialog

---

## F-05: OKR管理后端化

### 功能描述

连接 `okr_objectives` + `okr_key_results` 表 → API → Hook → 替换假OKR数据。

### 用户场景

1. 用户创建季度OKR目标 → 添加关键结果 → 设置权重
2. 系统自动计算目标进度 (加权平均关键结果完成率)
3. 仪表板展示团队OKR完成率

### 技术规格

```
新文件:
  lib/db/models/okr.ts (类型定义)
  lib/db/repositories/okr.repository.ts
  app/api/okr/route.ts + [id]/route.ts
  hooks/use-okr.ts

数据模型: (表已存在)
  okr_objectives(id, title, description, owner_id, quarter, year, status, progress, created_at)
  okr_key_results(id, objective_id, title, target_value, current_value, unit, weight, status)
```

---

## F-06: 数据导出中心

### 功能描述

通用导出功能，支持将任何列表数据导出为CSV/Excel/PDF。

### 用户场景

1. 用户在客户/任务/项目列表页 → 点击"导出"按钮
2. 选择格式(CSV/Excel) → 选择字段 → 确认导出
3. 浏览器下载文件

### 技术规格

```
API: POST /api/export
请求体: { resource: "customers", format: "csv" | "xlsx", fields: ["name","phone"], filters: {...} }
响应: 文件流 (application/octet-stream)
依赖: xlsx + papaparse + file-saver (已有)
```

---

## F-08: 系统监控真实化

### 功能描述

将系统监控页面从假CPU/内存数据切换为真实Node.js运行时指标。

### 技术规格

```typescript
// app/api/system/monitor/route.ts
import { monitor } from 'node:os'

// CPU使用率: os.loadavg()
// 内存: process.memoryUsage()
// 运行时间: process.uptime()
// 活跃连接: pg pool totalCount
```

---

## F-10: AI智能报表

### 功能描述

用户用自然语言描述需求，AI自动生成数据报表。

### 用户场景

1. 用户在分析页输入"显示本月客户增长趋势" → AI理解意图
2. AI查询数据库 → 生成结构化数据 → 前端用recharts渲染图表
3. 用户可导出报表

### 技术规格

```
API: POST /api/ai/report
流程: 用户文本 → GLM-4分析意图 → SQL查询 → 数据+图表配置 → 前端渲染
安全: AI生成的SQL经过白名单校验(仅允许SELECT)
```

---

## F-11: 客户画像360

### 功能描述

客户全息视图，聚合所有关联数据 + AI评分。

### 技术规格

```
API: GET /api/customers/[id]/profile
聚合查询: 客户基本信息 + 关联任务 + 关联项目 + 财务记录 + 沟通历史
AI评分: 活跃度/价值/流失风险 三维度评分
```

---

## 交互规范摘要

| 场景 | 规范 |
|------|------|
| 列表加载 | `<PageLoadingSkeleton />` 或 `<TableLoadingSkeleton />` |
| 操作成功 | `toast({ title: "操作成功" })` |
| 操作失败 | `toast({ title: "操作失败", description: errorMsg, variant: "destructive" })` |
| 删除确认 | `<AlertDialog>` + 红色警告文字 |
| 表单提交 | Button `disabled={isLoading}` + Loader2动画 |
| 空状态 | 图标 + 文字提示 + "创建"按钮 |
| 分页 | `<Pagination>` 组件, 底部居中 |
| 筛选 | 顶部搜索框 + Select下拉, 右侧"导出"按钮 |
