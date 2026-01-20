# YYC³ 企业智能管理系统 API 文档

## 概述

YYC³ 企业智能管理系统提供完整的 RESTful API，用于管理用户、客户、任务、项目等核心业务数据。

**基础URL**: `http://localhost:3223/api`

**认证方式**: Bearer Token (待实现)

**响应格式**:

所有API响应遵循统一的JSON格式：

```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

错误响应格式：

```json
{
  "success": false,
  "error": "错误描述",
  "code": "ERROR_CODE",
  "details": {}
}
```

## HTTP状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 500 | 服务器内部错误 |
| 503 | 服务不可用 |

## 通用查询参数

### 分页参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | integer | 1 | 页码 |
| limit | integer | 10 | 每页数量 (1-100) |

### 搜索参数

| 参数 | 类型 | 说明 |
|------|------|------|
| search | string | 模糊搜索关键词 |

---

## 用户管理 API

### 获取用户列表

**请求**:
```
GET /api/users
```

**查询参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| page | integer | 页码 |
| limit | integer | 每页数量 |
| search | string | 搜索关键词 (用户名/邮箱/姓名/手机号) |
| status | string | 状态筛选 (active/inactive/locked/pending) |
| department | string | 部门筛选 |
| role | string | 角色筛选 |

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@0379.email",
      "phone": "13800138000",
      "real_name": "管理员",
      "avatar": "/avatars/admin.jpg",
      "status": "active",
      "role": "admin",
      "department": "技术部",
      "position": "技术总监",
      "last_login": "2024-01-19T10:30:00Z",
      "login_count": 100,
      "is_online": true,
      "location": "北京市",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-19T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### 获取用户详情

**请求**:
```
GET /api/users/{id}
```

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| id | integer | 用户ID |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@0379.email",
    ...
  }
}
```

### 创建用户

**请求**:
```
POST /api/users
```

**请求体**:
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "phone": "13900139000",
  "real_name": "新用户",
  "avatar": "/avatars/newuser.jpg",
  "role": "user",
  "department": "产品部",
  "position": "产品经理",
  "status": "active"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "username": "newuser",
    "email": "newuser@example.com",
    ...
  }
}
```

### 更新用户

**请求**:
```
PUT /api/users/{id}
```

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| id | integer | 用户ID |

**请求体**:
```json
{
  "real_name": "更新后的姓名",
  "department": "技术部",
  "status": "active"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "real_name": "更新后的姓名",
    ...
  }
}
```

### 删除用户

**请求**:
```
DELETE /api/users/{id}
```

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| id | integer | 用户ID |

**响应示例**:
```json
{
  "success": true,
  "message": "用户删除成功"
}
```

---

## 客户管理 API

### 获取客户列表

**请求**:
```
GET /api/customers
```

**查询参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| page | integer | 页码 |
| limit | integer | 每页数量 |
| search | string | 搜索关键词 (姓名/公司/电话/邮箱) |
| level | string | 客户等级 (普通/重要/VIP) |
| status | string | 状态筛选 (活跃/潜在/休眠) |

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "张三",
      "company": "ABC科技有限公司",
      "phone": "13800138001",
      "email": "zhangsan@abc.com",
      "level": "VIP",
      "status": "活跃",
      "address": "北京市朝阳区",
      "notes": "重要客户",
      "created_by": 1,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-19T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### 获取客户详情

**请求**:
```
GET /api/customers/{id}
```

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| id | integer | 客户ID |

### 创建客户

**请求**:
```
POST /api/customers
```

**请求体**:
```json
{
  "name": "李四",
  "company": "XYZ有限公司",
  "phone": "13900139001",
  "email": "lisi@xyz.com",
  "level": "重要",
  "status": "活跃",
  "address": "上海市浦东新区",
  "notes": "潜在客户"
}
```

### 更新客户

**请求**:
```
PUT /api/customers/{id}
```

**请求体**:
```json
{
  "level": "VIP",
  "status": "活跃",
  "notes": "已签约客户"
}
```

### 删除客户

**请求**:
```
DELETE /api/customers/{id}
```

---

## 任务管理 API

### 获取任务列表

**请求**:
```
GET /api/tasks
```

**查询参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| page | integer | 页码 |
| limit | integer | 每页数量 |
| search | string | 搜索关键词 (标题/描述) |
| status | string | 状态筛选 (待处理/进行中/已完成/已取消/逾期) |
| priority | string | 优先级 (低/中/高/紧急) |
| assignee_id | integer | 负责人ID |
| created_by | integer | 创建人ID |

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "完成项目文档",
      "description": "编写项目技术文档和用户手册",
      "assignee_id": 2,
      "priority": "高",
      "status": "进行中",
      "progress": 50,
      "due_date": "2024-01-25",
      "completed_at": null,
      "created_by": 1,
      "created_at": "2024-01-15T00:00:00Z",
      "updated_at": "2024-01-19T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### 获取任务详情

**请求**:
```
GET /api/tasks/{id}
```

### 创建任务

**请求**:
```
POST /api/tasks
```

**请求体**:
```json
{
  "title": "新任务",
  "description": "任务描述",
  "assignee_id": 2,
  "priority": "中",
  "status": "待处理",
  "progress": 0,
  "due_date": "2024-01-30"
}
```

### 更新任务

**请求**:
```
PUT /api/tasks/{id}
```

**请求体**:
```json
{
  "status": "进行中",
  "progress": 30
}
```

### 删除任务

**请求**:
```
DELETE /api/tasks/{id}
```

---

## 项目管理 API

### 获取项目列表

**请求**:
```
GET /api/projects
```

**查询参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| page | integer | 页码 |
| limit | integer | 每页数量 |
| search | string | 搜索关键词 (项目名称/描述) |
| status | string | 状态筛选 (计划中/进行中/已完成/已暂停/延期) |
| priority | string | 优先级 (低/中/高) |
| manager_id | integer | 项目经理ID |
| type | string | 项目类型 |

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "企业管理系统开发",
      "description": "开发完整的企业管理系统",
      "manager_id": 1,
      "team_size": 10,
      "progress": 75,
      "status": "进行中",
      "priority": "高",
      "start_date": "2024-01-01",
      "end_date": "2024-06-30",
      "budget": 500000.00,
      "type": "软件开发",
      "created_by": 1,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-19T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### 获取项目详情

**请求**:
```
GET /api/projects/{id}
```

### 创建项目

**请求**:
```
POST /api/projects
```

**请求体**:
```json
{
  "name": "新项目",
  "description": "项目描述",
  "manager_id": 1,
  "team_size": 5,
  "progress": 0,
  "status": "计划中",
  "priority": "中",
  "start_date": "2024-02-01",
  "end_date": "2024-08-31",
  "budget": 300000.00,
  "type": "软件开发"
}
```

### 更新项目

**请求**:
```
PUT /api/projects/{id}
```

**请求体**:
```json
{
  "progress": 80,
  "status": "进行中"
}
```

### 删除项目

**请求**:
```
DELETE /api/projects/{id}
```

---

## 通知管理 API

### 获取通知列表

**请求**:
```
GET /api/notifications
```

**查询参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| page | integer | 页码 |
| limit | integer | 每页数量 |
| user_id | integer | 用户ID |
| is_read | boolean | 是否已读 |
| type | string | 通知类型 |
| priority | string | 优先级 (低/普通/高/紧急) |

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "新任务分配",
      "message": "您有一个新任务待处理",
      "type": "task",
      "priority": "高",
      "user_id": 2,
      "from_user": "admin",
      "is_read": false,
      "read_at": null,
      "created_at": "2024-01-19T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### 创建通知

**请求**:
```
POST /api/notifications
```

**请求体**:
```json
{
  "title": "系统通知",
  "message": "系统将于今晚进行维护",
  "type": "system",
  "priority": "普通",
  "user_id": 1
}
```

### 标记通知为已读

**请求**:
```
PUT /api/notifications/{id}/read
```

### 删除通知

**请求**:
```
DELETE /api/notifications/{id}
```

---

## 系统设置 API

### 获取系统设置

**请求**:
```
GET /api/system/settings
```

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "key": "site_name",
      "value": "YYC³企业管理系统",
      "category": "basic",
      "description": "站点名称",
      "updated_by": 1,
      "updated_at": "2024-01-19T10:30:00Z"
    }
  ]
}
```

### 更新系统设置

**请求**:
```
PUT /api/system/settings
```

**请求体**:
```json
{
  "key": "site_name",
  "value": "新站点名称",
  "category": "basic",
  "description": "站点名称"
}
```

---

## 健康检查 API

### 健康检查

**请求**:
```
GET /api/health
```

**响应示例**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-19T10:30:00Z",
  "database": "connected",
  "redis": "connected"
}
```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| VALIDATION_ERROR | 数据验证失败 |
| UNAUTHORIZED | 未授权访问 |
| FORBIDDEN | 权限不足 |
| NOT_FOUND | 资源不存在 |
| CONFLICT | 资源冲突 |
| INTERNAL_SERVER_ERROR | 服务器内部错误 |
| SERVICE_UNAVAILABLE | 服务不可用 |

---

## 数据库迁移

运行数据库迁移：

```bash
bun run db:migrate
```

这将执行所有待执行的迁移脚本，创建必要的数据库表结构。

---

## 开发说明

### 环境变量

在项目根目录创建 `.env.local` 文件：

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=yyc3_mana
DB_USER=postgres
DB_PASSWORD=password

REDIS_URL=redis://localhost:6379
```

### 启动开发服务器

```bash
bun run dev
```

### 运行测试

```bash
bun run test
```

---

## 版本历史

### v1.0.0 (2024-01-19)

- 初始版本发布
- 实现用户管理 API
- 实现客户管理 API
- 实现任务管理 API
- 实现项目管理 API
- 实现通知管理 API
- 实现系统设置 API
- 添加数据库迁移支持
- 添加 API 验证和错误处理中间件

---

## 联系方式

如有问题或建议，请联系：

- 邮箱: admin@0379.email
- 网站: https://yyc3.0379.love
