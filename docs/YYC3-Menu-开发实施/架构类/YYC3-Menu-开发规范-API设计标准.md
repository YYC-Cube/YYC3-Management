# API 设计规范

## 1. 总体原则

### 1.1 RESTful 设计
- 使用标准 HTTP 方法（GET, POST, PUT, PATCH, DELETE）
- 资源命名使用名词复数形式
- URL 层级清晰，符合资源关系
- 使用 HTTP 状态码表示操作结果

### 1.2 统一响应格式
```typescript
{
  "success": boolean,
  "data": any,
  "error": {
    "code": string,
    "message": string,
    "details": any
  },
  "meta": {
    "timestamp": string,
    "requestId": string,
    "version": string
  }
}
```

### 1.3 版本控制
- URL 路径版本：`/api/v1/users`
- 请求头版本：`Accept: application/vnd.yyc3.v1+json`
- 使用语义化版本号（SemVer）

## 2. URL 设计规范

### 2.1 命名约定
```
✅ 正确:
GET    /api/v1/users
GET    /api/v1/users/{id}
POST   /api/v1/users
PUT    /api/v1/users/{id}
DELETE /api/v1/users/{id}

GET    /api/v1/users/{userId}/orders
GET    /api/v1/users/{userId}/orders/{orderId}

❌ 错误:
GET    /api/v1/getUsers
POST   /api/v1/createUser
GET    /api/v1/user/{id}
GET    /api/v1/usersOrders
```

### 2.2 资源嵌套
- 最多嵌套 2 层：`/resources/{id}/subresources/{id}`
- 深层嵌套使用查询参数：`/orders?userId=123&status=pending`

### 2.3 过滤、排序、分页
```
过滤: /api/v1/users?status=active&role=admin
排序: /api/v1/users?sort=createdAt:desc
分页: /api/v1/users?page=1&limit=20
搜索: /api/v1/users?q=zhang&fields=name,email
```

## 3. HTTP 方法规范

### 3.1 GET - 获取资源
- 幂等操作，无副作用
- 不修改服务器状态
- 可缓存

```typescript
// 列表查询
GET /api/v1/users?page=1&limit=20
Response: 200 OK
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "limit": 20
  }
}

// 单个资源
GET /api/v1/users/123
Response: 200 OK
{
  "success": true,
  "data": {
    "id": "123",
    "name": "张三",
    "email": "zhang@example.com"
  }
}
```

### 3.2 POST - 创建资源
- 非幂等操作
- 返回 201 Created
- 返回新创建资源的 URL 和内容

```typescript
POST /api/v1/users
Request Body:
{
  "name": "张三",
  "email": "zhang@example.com"
}

Response: 201 Created
Location: /api/v1/users/123
{
  "success": true,
  "data": {
    "id": "123",
    "name": "张三",
    "email": "zhang@example.com",
    "createdAt": "2024-01-20T10:00:00Z"
  }
}
```

### 3.3 PUT - 完整更新资源
- 幂等操作
- 替换整个资源
- 必须提供所有字段

```typescript
PUT /api/v1/users/123
Request Body:
{
  "name": "张三",
  "email": "zhang@example.com",
  "phone": "13800138000"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "123",
    "name": "张三",
    "email": "zhang@example.com",
    "phone": "13800138000",
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}
```

### 3.4 PATCH - 部分更新资源
- 幂等操作
- 只更新指定字段
- 可选择性提供字段

```typescript
PATCH /api/v1/users/123
Request Body:
{
  "phone": "13800138000"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "123",
    "name": "张三",
    "email": "zhang@example.com",
    "phone": "13800138000",
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}
```

### 3.5 DELETE - 删除资源
- 幂等操作
- 返回 204 No Content 或 200 OK

```typescript
DELETE /api/v1/users/123

Response: 204 No Content
// 或
Response: 200 OK
{
  "success": true,
  "data": {
    "id": "123",
    "deletedAt": "2024-01-20T10:00:00Z"
  }
}
```

## 4. HTTP 状态码规范

### 4.1 成功响应 (2xx)
- `200 OK`: 请求成功
- `201 Created`: 资源创建成功
- `202 Accepted`: 请求已接受，异步处理中
- `204 No Content`: 请求成功但无返回内容

### 4.2 重定向 (3xx)
- `301 Moved Permanently`: 资源永久移动
- `302 Found`: 资源临时移动
- `304 Not Modified`: 资源未修改，使用缓存

### 4.3 客户端错误 (4xx)
- `400 Bad Request`: 请求参数错误
- `401 Unauthorized`: 未认证
- `403 Forbidden`: 无权限
- `404 Not Found`: 资源不存在
- `409 Conflict`: 资源冲突
- `422 Unprocessable Entity`: 业务逻辑错误
- `429 Too Many Requests`: 请求过于频繁

### 4.3 服务器错误 (5xx)
- `500 Internal Server Error`: 服务器内部错误
- `502 Bad Gateway`: 网关错误
- `503 Service Unavailable`: 服务不可用
- `504 Gateway Timeout`: 网关超时

## 5. 错误处理规范

### 5.1 错误响应格式
```typescript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求参数验证失败",
    "details": [
      {
        "field": "email",
        "message": "邮箱格式不正确",
        "value": "invalid-email"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-20T10:00:00Z",
    "requestId": "req-123456",
    "version": "v1"
  }
}
```

### 5.2 错误代码规范
```
业务错误: BIZ_*
  BIZ_USER_NOT_FOUND
  BIZ_INSUFFICIENT_BALANCE
  BIZ_ORDER_EXPIRED

验证错误: VAL_*
  VAL_INVALID_EMAIL
  VAL_REQUIRED_FIELD
  VAL_OUT_OF_RANGE

系统错误: SYS_*
  SYS_DATABASE_ERROR
  SYS_NETWORK_ERROR
  SYS_TIMEOUT

认证错误: AUTH_*
  AUTH_TOKEN_EXPIRED
  AUTH_INVALID_CREDENTIALS
  AUTH_INSUFFICIENT_PERMISSIONS
```

## 6. 安全规范

### 6.1 认证
- 使用 JWT Token 或 OAuth 2.0
- Token 放在 Authorization Header
- 设置合理的过期时间

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 6.2 HTTPS
- 生产环境强制使用 HTTPS
- 敏感信息加密传输

### 6.3 输入验证
- 验证所有输入参数
- 防止 SQL 注入、XSS 攻击
- 限制请求大小

### 6.4 速率限制
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
```

## 7. 性能优化

### 7.1 缓存
- 使用 ETag 和 Last-Modified
- 设置合理的 Cache-Control

```
Cache-Control: max-age=3600, must-revalidate
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

### 7.2 压缩
- 启用 Gzip/Brotli 压缩
- 压缩文本类响应

```
Accept-Encoding: gzip, deflate, br
Content-Encoding: gzip
```

### 7.3 分页
- 使用 cursor-based pagination
- 限制单页数据量

```typescript
// Offset-based
GET /api/v1/users?page=1&limit=20

// Cursor-based
GET /api/v1/users?cursor=eyJpZCI6MTIzfQ&limit=20

Response:
{
  "data": [...],
  "pagination": {
    "nextCursor": "eyJpZCI6MTQzfQ",
    "hasMore": true
  }
}
```

## 8. 文档规范

### 8.1 API 文档
- 使用 OpenAPI/Swagger 3.0
- 提供完整的接口说明
- 包含请求/响应示例
- 标注必填/可选参数

### 8.2 注释规范
```typescript
/**
 * 创建用户
 * 
 * @route POST /api/v1/users
 * @group Users - 用户管理
 * @param {CreateUserDTO} body.required - 用户信息
 * @returns {User} 200 - 成功创建的用户
 * @returns {Error} 400 - 参数错误
 * @returns {Error} 409 - 用户已存在
 * @security JWT
 */
```

## 9. 最佳实践

### 9.1 幂等性
- GET, PUT, DELETE 必须幂等
- POST 通过唯一 ID 实现幂等

### 9.2 异步处理
```typescript
// 长时间操作返回任务 ID
POST /api/v1/exports
Response: 202 Accepted
{
  "success": true,
  "data": {
    "taskId": "task-123",
    "status": "processing"
  }
}

// 查询任务状态
GET /api/v1/exports/task-123
Response: 200 OK
{
  "success": true,
  "data": {
    "taskId": "task-123",
    "status": "completed",
    "result": {
      "downloadUrl": "https://..."
    }
  }
}
```

### 9.3 批量操作
```typescript
// 批量创建
POST /api/v1/users/batch
Request: {
  "users": [...]
}

// 批量查询
POST /api/v1/users/query
Request: {
  "ids": ["1", "2", "3"]
}

// 批量更新
PATCH /api/v1/users/batch
Request: {
  "updates": [
    { "id": "1", "status": "active" },
    { "id": "2", "status": "inactive" }
  ]
}
```

### 9.4 跨域处理
```
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

## 10. 测试规范

### 10.1 单元测试
- 覆盖所有 API 端点
- 测试各种成功和失败场景
- 验证响应格式和状态码

### 10.2 集成测试
- 测试完整的业务流程
- 验证多个 API 的协作
- 测试认证和权限

### 10.3 性能测试
- 负载测试
- 压力测试
- 并发测试

---

**遵循本规范，确保 API 的一致性、可维护性和易用性。**
