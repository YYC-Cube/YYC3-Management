# API 接口文档

> **文档类型**: 开发
> **所属系列**: API文档
> **版本**: 1.0.0
> **创建日期**: 2026-01-03
> **最后更新**: 2026-01-03
> **维护人**: YYC³ API Team

## 1. 概述

### 1.1 API基础信息

```
Base URL: http://localhost:3000/api
协议: HTTP/HTTPS
数据格式: JSON
字符编码: UTF-8
认证方式: JWT Bearer Token
```

### 1.2 响应格式

所有API响应遵循统一格式：

```typescript
// 成功响应
interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
}

// 错误响应
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}
```

### 1.3 状态码

| 状态码 | 说明 | 使用场景 |
|--------|------|----------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 204 | No Content | 删除成功 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未认证 |
| 403 | Forbidden | 无权限 |
| 404 | Not Found | 资源不存在 |
| 422 | Unprocessable Entity | 验证失败 |
| 500 | Internal Server Error | 服务器错误 |

## 2. 认证API

### 2.1 用户登录

```
POST /api/auth/login
```

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "admin"
    }
  }
}
```

### 2.2 用户注册

```
POST /api/auth/register
```

**请求体**:
```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "name": "Jane Doe"
}
```

### 2.3 Token刷新

```
POST /api/auth/refresh
```

**请求头**:
```
Authorization: Bearer <refresh_token>
```

## 3. Analytics API

### 3.1 获取仪表板数据

```
GET /api/analytics/dashboard
```

**响应**:
```json
{
  "success": true,
  "data": {
    "metrics": [
      {
        "name": "total_users",
        "value": 1250,
        "change": 5.2,
        "period": "7d"
      }
    ],
    "charts": {
      "userGrowth": [...],
      "revenue": [...]
    },
    "insights": [
      {
        "type": "opportunity",
        "message": "用户增长速度加快",
        "confidence": 0.85
      }
    ]
  }
}
```

### 3.2 生成预测

```
POST /api/analytics/predict
```

**请求体**:
```json
{
  "metric": "revenue",
  "horizon": 30,
  "confidence": 0.95
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "forecast": [
      { "date": "2026-01-04", "value": 15000 },
      { "date": "2026-01-05", "value": 15200 }
    ],
    "confidence": 0.92,
    "trend": "increasing"
  }
}
```

### 3.3 异常检测

```
POST /api/analytics/anomalies
```

**请求体**:
```json
{
  "metric": "page_views",
  "timeRange": "24h",
  "threshold": 2
}
```

## 4. Education API

### 4.1 获取AI指导

```
GET /api/education/coaching/guidance
```

**查询参数**:
```
learner_id: string
topic: string
goal: string
```

**响应**:
```json
{
  "success": true,
  "data": {
    "guidance": "建议从基础概念开始学习...",
    "learningPath": {
      "steps": [
        { "order": 1, "topic": "基础", "estimatedTime": "2h" }
      ]
    },
    "recommendations": [
      { "type": "resource", "content": "推荐文档" }
    ]
  }
}
```

### 4.2 生成培训内容

```
POST /api/education/content/generate
```

**请求体**:
```json
{
  "topic": "TypeScript高级特性",
  "targetAudience": {
    "level": "intermediate",
    "learningStyle": "visual"
  },
  "format": "interactive"
}
```

## 5. Calling API

### 5.1 执行呼叫

```
POST /api/calling/execute
```

**请求体**:
```json
{
  "customerId": "customer_123",
  "workflowId": "workflow_456",
  "script": {
    "greeting": "您好，我是...",
    "purpose": "sales_call"
  }
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "callId": "call_789",
    "status": "initiated",
    "estimatedDuration": 300
  }
}
```

### 5.2 获取呼叫结果

```
GET /api/calling/calls/:callId
```

**响应**:
```json
{
  "success": true,
  "data": {
    "callId": "call_789",
    "status": "completed",
    "outcome": "successful",
    "duration": 285,
    "transcript": "...",
    "sentiment": {
      "overall": "positive",
      "score": 0.75
    }
  }
}
```

## 6. Marketing API

### 6.1 创建营销活动

```
POST /api/marketing/campaigns
```

**请求体**:
```json
{
  "name": "春季促销",
  "type": "email",
  "targetAudience": {
    "segments": ["active_users", "recent_purchasers"]
  },
  "content": {
    "subject": "春季特惠",
    "body": "..."
  },
  "schedule": {
    "start": "2026-01-10T09:00:00Z",
    "end": "2026-01-20T18:00:00Z"
  }
}
```

### 6.2 获取活动分析

```
GET /api/marketing/campaigns/:campaignId/analytics
```

**响应**:
```json
{
  "success": true,
  "data": {
    "campaignId": "camp_123",
    "metrics": {
      "sent": 10000,
      "opened": 6500,
      "clicked": 1200,
      "converted": 350,
      "roi": 3.5
    },
    "trends": {
      "opens": "increasing",
      "clicks": "stable"
    }
  }
}
```

## 7. CRM API

### 7.1 获取客户360视图

```
GET /api/crm/customers/:customerId/360
```

**响应**:
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "customer_123",
      "name": "张三",
      "email": "zhangsan@example.com",
      "phone": "+86138****1234"
    },
    "interactions": [
      {
        "type": "call",
        "date": "2026-01-03",
        "outcome": "interested"
      }
    ],
    "transactions": [
      {
        "id": "txn_456",
        "amount": 2999,
        "date": "2026-01-01"
      }
    ],
    "insights": {
      "lifetimeValue": 15000,
      "churnRisk": "low",
      "nextBestAction": "follow_up_call"
    }
  }
}
```

## 8. Security API

### 8.1 检查权限

```
POST /api/security/permissions/check
```

**请求体**:
```json
{
  "userId": "user_123",
  "resource": "customer_data",
  "action": "read"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "allowed": true,
    "reason": "user_has_permission"
  }
}
```

### 8.2 审计日志

```
GET /api/security/audit/logs
```

**查询参数**:
```
startDate: string
endDate: string
userId?: string
action?: string
limit: number = 50
offset: number = 0
```

## 9. WebSocket API

### 9.1 连接

```
ws://localhost:3000/api/stream
```

**连接参数**:
```json
{
  "token": "jwt_token",
  "channels": ["analytics", "notifications"]
}
```

### 9.2 消息格式

**服务器推送**:
```json
{
  "type": "metric_update",
  "channel": "analytics",
  "data": {
    "metric": "page_views",
    "value": 1234,
    "timestamp": "2026-01-03T10:30:00Z"
  }
}
```

**客户端发送**:
```json
{
  "type": "subscribe",
  "channel": "analytics"
}
```

## 10. 错误处理

### 10.1 错误码

| 错误码 | 说明 |
|--------|------|
| VALIDATION_ERROR | 参数验证失败 |
| AUTHENTICATION_ERROR | 认证失败 |
| AUTHORIZATION_ERROR | 授权失败 |
| NOT_FOUND_ERROR | 资源不存在 |
| CONFLICT_ERROR | 资源冲突 |
| RATE_LIMIT_ERROR | 请求频率超限 |
| INTERNAL_ERROR | 内部错误 |

### 10.2 错误响应示例

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "验证失败",
    "details": {
      "email": "邮箱格式不正确",
      "password": "密码长度至少8位"
    }
  },
  "timestamp": "2026-01-03T10:30:00Z"
}
```

## 11. 限流规则

### 11.1 速率限制

```
认证用户: 1000 requests/hour
未认证用户: 100 requests/hour
WebSocket: 10 messages/second
```

### 11.2 响应头

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1704286800
```

## 12. SDK和客户端

### 12.1 JavaScript SDK

```typescript
import { YYC3Client } from '@yyc3/sdk';

const client = new YYC3Client({
  baseURL: 'http://localhost:3000/api',
  token: 'your_token'
});

// Analytics
const dashboard = await client.analytics.getDashboard();

// Education
const guidance = await client.education.getGuidance({
  topic: 'TypeScript',
  goal: 'master_advanced'
});

// Calling
const call = await client.calling.execute({
  customerId: 'customer_123',
  workflowId: 'workflow_456'
});
```

### 12.2 Python SDK

```python
from yyc3 import YYC3Client

client = YYC3Client(
    base_url='http://localhost:3000/api',
    token='your_token'
)

# Analytics
dashboard = client.analytics.get_dashboard()

# Marketing
campaign = client.marketing.create_campaign(
    name='春季促销',
    type='email'
)
```

## 附录

### A. 相关文档

- [TypeScript类型定义](./10-开发-API-类型定义.md)
- [WebSocket文档](./10-开发-API-WebSocket文档.md)
- [认证授权指南](./60-Security-设计-安全中心设计.md)

### B. 变更记录

| 版本 | 日期 | 作者 | 变更内容 |
|------|------|------|----------|
| 1.0.0 | 2026-01-03 | YYC³ | 初始版本 |

---

**维护团队**: YYC³ API Team
**联系方式**: admin@0379.email
**API Base URL**: http://localhost:3000/api
