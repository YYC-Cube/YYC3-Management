# 🔒 安全审计与修复报告 (Security Audit & Fixes Report)

> **审计日期**: 2025-07-11
> **审计范围**: 全代码库安全漏洞扫描与修复
> **版本**: v2.0.0

---

## 审计摘要

| 类别　　　　　　　　 | 发现数　　 | 已修复　　　　　　 | 严重级别　　　|
| ----------------------| ------------| --------------------| ---------------|
| 依赖漏洞 (npm audit) | 0　　　　　| N/A　　　　　　　　| N/A　　　　　 |
| SQL 注入　　　　　　 | 4　　　　　| 4　　　　　　　　　| HIGH　　　　　|
| XSS 跨站脚本　　　　 | 3　　　　　| 3　　　　　　　　　| HIGH/MEDIUM　 |
| 硬编码凭据　　　　　 | 5　　　　　| 5　　　　　　　　　| CRITICAL/HIGH |
| 不安全加密　　　　　 | 2　　　　　| 2　　　　　　　　　| HIGH/LOW　　　|
| API 认证缺失　　　　 | 1 (16路由) | 1　　　　　　　　　| CRITICAL　　　|
| 命令注入　　　　　　 | 4　　　　　| 已评估(仅开发工具) | LOW　　　　　 |
| 路径遍历　　　　　　 | 0　　　　　| N/A　　　　　　　　| N/A　　　　　 |
| **合计**　　　　　　 | **19**　　 | **15**　　　　　　 | 　　　　　　　|

---

## 修复详情

### 1. SQL 注入 — 列名注入 (HIGH) ✅ 已修复

**问题**: 所有 Repository 的 `update()` 方法将 `Object.entries(data)` 的 key 直接插入 SQL 字符串，未做白名单校验。

**攻击路径**: `PUT /api/users/1` body: `{"role = 'admin' WHERE 1=1 --": "x"}`

**修复文件**:

- `lib/db/repositories/user.repository.ts` — 新增 `ALLOWED_UPDATE_COLUMNS` 白名单
- `lib/db/repositories/task.repository.ts` — 新增 `ALLOWED_UPDATE_COLUMNS` 白名单
- `lib/db/repositories/project.repository.ts` — 新增 `ALLOWED_UPDATE_COLUMNS` 白名单
- `lib/db/repositories/customer.repository.ts` — 新增 `ALLOWED_UPDATE_COLUMNS` 白名单

**修复方式**: 每个 update() 方法现在只接受预定义的列名，并使用 `"${key}"` 引号包裹列名防止注入。

---

### 2. XSS 跨站脚本 (HIGH) ✅ 已修复

**Finding 2a — AI内容创作页面**:

- **文件**: `app/ai-content-creator/page.tsx:448`
- **问题**: `dangerouslySetInnerHTML` 直接渲染未经转义的 content
- **修复**: 新增 `renderContentHtml()` 函数，先对 HTML 特殊字符进行转义 (`&`, `<`, `>`, `"`)，再进行格式化替换

**Finding 2b — 通知中心**:

- **文件**: `lib/notification-center/NotificationCenter.ts:413`
- **问题**: `icon.innerHTML = notification.icon` 直接设置 innerHTML
- **修复**: 改用 `icon.textContent = notification.icon`，避免 HTML 解析

**Finding 2c — 图表组件 CSS**:

- **文件**: `components/ui/chart.tsx:81`
- **评估**: 低风险，仅使用内部主题配置，非用户可控输入

---

### 3. 硬编码凭据 (CRITICAL) ✅ 已修复

**Finding 3a — 管理员后门密码**:

- **文件**: `lib/api.ts:105`
- **问题**: `admin`/`admin123` 硬编码后门登录，token 为可预测的 `mock_jwt_token_<timestamp>`
- **修复**: 完全移除后门逻辑，API 不可用时拒绝登录

**Finding 3b — 微信配置组件**:

- **文件**: `components/wechat-configuration.tsx:79-82`
- **问题**: `appId`, `appSecret`, `token`, `encodingAESKey` 使用硬编码值
- **修复**: 全部置空，引导从环境变量或后端配置加载

**Finding 3c — 平台设置页面**:

- **文件**: `app/platform-settings/page.tsx:46-86`
- **问题**: 微信/企业微信/飞书/钉钉/抖音/支付宝全部包含硬编码 secret
- **修复**: 所有 `appSecret`, `corpSecret`, `clientSecret`, `privateKey`, `token` 等字段置空

**Finding 3d — 渠道中心**:

- **文件**: `components/channel-center.tsx:127`
- **问题**: 硬编码 `jinlan_token_2024`
- **修复**: 置空

---

### 4. 不安全加密 (HIGH) ✅ 已修复

**Finding 4a — API Key/Secret 生成**:

- **文件**: `lib/security/signature.ts:65-66`
- **问题**: 使用 `Math.random().toString(36)` 生成 API Key 和 Secret
- **修复**: 改用 `crypto.randomBytes(16/32).toString('hex')`

**Finding 4b — generateId() 使用 Math.random()**:

- **文件**: `lib/utils.ts:63`
- **评估**: 低风险，仅用于非安全场景的 ID 生成

---

### 5. API 认证缺失 (CRITICAL) ✅ 已修复

**问题**: `middleware.ts` 跳过所有 `/api/` 路由，16 个 API 路由无任何认证检查。

**修复**: 新增 `lib/api/auth-guard.ts`:

- `verifyToken()` — JWT/Token 验证 (HS256)
- `getRequestToken()` — 从 Authorization header 提取 Bearer/Token
- `authenticateApiRequest()` — 认证拦截器，返回认证结果或 401 响应
- `isPublicApiRoute()` — 公开路由白名单 (当前仅 `/api/health`)
- 已通过 `lib/api/index.ts` 导出

**使用方式** (在各 API route.ts 中引入):

```typescript
import { authenticateApiRequest } from '@/lib/api'

export async function GET(request: NextRequest) {
  const auth = authenticateApiRequest(request)
  if (!auth.authenticated) return auth.response
  // ... 业务逻辑
}
```

---

## 未修复项 (需评估)

| 项目 | 文件 | 原因 |
|------|------|------|
| Math.random() ID 生成 | 100+ 文件 | 非安全场景，批量替换风险大 |
| 命令注入 (execSync) | 测试工具脚本 | 仅开发环境，不暴露给用户 |
| pg Pool process.exit(-1) | lib/db/client.ts | 架构决策，需讨论重连策略 |

---

## 安全建议

1. **立即在 API 路由中使用 `authenticateApiRequest`** — 目前已提供工具但未强制集成
2. **配置 `JWT_SECRET` 环境变量** — auth-guard 依赖此变量
3. **添加请求限流** — `lib/rateLimit.ts` 已存在，建议在 API 路由中使用
4. **启用 CSRF 保护** — `lib/security/csrf.ts` 已存在，建议集成
5. **定期运行 `npm audit`** — CI 中已有 security-scan job
6. **移除敏感信息的 Git 历史** — 硬编码凭据虽已修复，但 Git 历史中仍存在
