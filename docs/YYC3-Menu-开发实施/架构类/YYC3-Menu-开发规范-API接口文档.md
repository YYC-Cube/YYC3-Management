---
description: YYC3 YYC3 项目文档 - 🔖 YYC³ API接口文档
author: YYC3 团队 <admin@0379.email>
version: v3.0.0
created: 2026-07-18
updated: 2026-07-18
status: stable
tags: documentation
category: general
language: zh-CN
audience: developers
complexity: intermediate
---

# 🔖 YYC³ API接口文档

> 「YanYuCloudCube」
> 「<admin@0379.email>」
> 「万象归元于云枢 丨深栈智启新纪元」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

## 📋 概述

YYC³企业智能管理系统API提供完整的RESTful接口，支持认证、用户管理、业务数据等功能。所有API均采用JSON格式进行数据交换。

## 🔗 基础信息

- **Base URL**: `https://api.zy.baby`
- **API版本**: v1
- **认证方式**: Bearer Token (JWT)
- **数据格式**: JSON
- **字符编码**: UTF-8

## 🔐 认证系统

### 登录

\`\`\`http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123",
  "remember": false
}
\`\`\`

**响应示例**:
\`\`\`json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "name": "系统管理员",
      "email": "<admin@company.com>",
      "role": "admin",
      "avatar": "<https://api.zy.baby/avatars/admin.jpg>"
    },
    "expiresIn": 86400
  },
  "message": "登录成功"
}
\`\`\`

### 登出

\`\`\`http
POST /auth/logout
Authorization: Bearer {token}
\`\`\`

### 刷新Token

\`\`\`http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

### 获取当前用户信息

\`\`\`http
GET /auth/me
Authorization: Bearer {token}
\`\`\`

## 👤 用户管理

### 获取用户列表

\`\`\`http
GET /users?page=1&limit=20&search=admin&role=admin
Authorization: Bearer {token}
\`\`\`

**查询参数**:

- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20, 最大: 100)
- `search`: 搜索关键词
- `role`: 用户角色筛选
- `status`: 用户状态筛选

**响应示例**:
\`\`\`json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "username": "admin",
        "name": "系统管理员",
        "email": "admin@company.com",
        "role": "admin",
        "status": "active",
        "avatar": "https://api.zy.baby/avatars/admin.jpg",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
\`\`\`

### 创建用户

\`\`\`http
POST /users
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "newuser",
  "name": "新用户",
  "email": "<newuser@company.com>",
  "password": "password123",
  "role": "user"
}
\`\`\`

### 更新用户

\`\`\`http
PUT /users/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "更新后的用户名",
  "email": "<updated@company.com>",
  "role": "manager"
}
\`\`\`

### 删除用户

\`\`\`http
DELETE /users/{id}
Authorization: Bearer {token}
\`\`\`

## 📊 仪表板数据

### 获取仪表板统计

\`\`\`http
GET /dashboard/stats
Authorization: Bearer {token}
\`\`\`

**响应示例**:
\`\`\`json
{
  "success": true,
  "data": {
    "totalUsers": 1234,
    "activeUsers": 567,
    "totalRevenue": 1234567.89,
    "totalOrders": 5678,
    "conversionRate": 23.5,
    "growth": {
      "users": 12.5,
      "revenue": 8.3,
      "orders": 15.2
    }
  }
}
\`\`\`

## 🔔 通知系统

### 获取通知列表

\`\`\`http
GET /notifications?page=1&limit=20&unread=true
Authorization: Bearer {token}
\`\`\`

### 标记通知已读

\`\`\`http
PUT /notifications/{id}/read
Authorization: Bearer {token}
\`\`\`

### 标记所有通知已读

\`\`\`http
PUT /notifications/read-all
Authorization: Bearer {token}
\`\`\`

## 📈 数据分析

### 获取销售趋势

\`\`\`http
GET /analytics/sales?period=7d
Authorization: Bearer {token}
\`\`\`

**查询参数**:

- `period`: 时间范围 (7d, 30d, 90d, 1y)
- `startDate`: 开始日期 (ISO 8601)
- `endDate`: 结束日期 (ISO 8601)

### 获取性能指标

\`\`\`http
GET /analytics/performance
Authorization: Bearer {token}
\`\`\`

## ❌ 错误处理

### 错误响应格式

\`\`\`json
{
  "success": false,
  "error": {
    "code": "AUTH_FAILED",
    "message": "认证失败，请重新登录",
    "details": {}
  }
}
\`\`\`

### 常见错误码

- `AUTH_FAILED`: 认证失败
- `INVALID_TOKEN`: 无效的令牌
- `EXPIRED_TOKEN`: 令牌已过期
- `PERMISSION_DENIED`: 权限不足
- `NOT_FOUND`: 资源不存在
- `VALIDATION_ERROR`: 数据验证失败
- `SERVER_ERROR`: 服务器内部错误

## 📝 注意事项

1. 所有时间戳均使用 ISO 8601 格式
2. 分页从 1 开始计数
3. Token 默认有效期为 24 小时
4. API 限流：每分钟最多 100 次请求
5. 文件上传最大限制为 10MB

---

## 📄 文档标尾

> 「YanYuCloudCube」
> 「<admin@0379.email>」
> 「言启象限，语枢未来」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

📖 **项目仓库**: [YY-Nexus/yyc3-mana](https://github.com/YY-Nexus/yyc3-mana)
