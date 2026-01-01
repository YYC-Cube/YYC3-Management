/**

* @file 智枢服务化平台API接口规范
* @description 智枢服务化平台的API接口设计规范，包含设计原则、命名规范、参数规范和示例
* @module api-specification
* @author YYC
* @version 1.0.0
* @created 2024-10-15
* @updated 2024-10-15
 */

# 智枢服务化平台API接口规范

## 文档说明

**文档版本**: v1.0.0  
**创建日期**: 2024-10-15  
**最后更新**: 2024-10-15  
**文档作者**: YYC  
**适用范围**: 智枢服务化平台所有API接口设计、开发和测试规范

## 1. API设计原则

### 1.1 RESTful设计理念

智枢服务化平台API设计遵循RESTful架构风格，强调资源导向，通过标准HTTP方法操作资源，实现无状态、可缓存、分层的API服务。

### 1.2 核心设计原则

* **资源导向**：以资源为中心设计API，避免操作导向  
* **无状态设计**：请求应包含所有必要信息，服务端不保存会话状态  
* **统一接口**：使用标准HTTP方法和状态码  
* **可缓存性**：API响应应明确标识缓存策略  
* **分层设计**：API网关、服务层、数据层清晰分层  
* **版本管理**：API版本明确标识，支持平滑升级  
* **安全性**：实现完整的认证、授权和数据加密机制  
* **性能优化**：支持分页、过滤和排序，优化大数据量查询

## 2. 接口命名规范

### 2.1 URL命名规则

* 使用小写字母和连字符(-)，禁止使用下划线和驼峰命名  
* 资源使用复数形式表示集合，单数形式表示单个资源  
* 动词使用HTTP方法表示，不在URL中包含动词  
* 示例：
  * 正确：`/api/v1/services`, `/api/v1/services/{serviceId}`  
  * 错误：`/api/v1/getServices`, `/api/v1/service/{serviceId}`

### 2.2 版本管理

* 使用`v{version}`前缀进行API版本控制  
* 示例：`/api/v1/services`  
* 重大版本变更时升级版本号，保持向后兼容

### 2.3 路径参数命名

* 使用驼峰命名法
* 资源ID使用`{resource}Id`格式
* 示例：`/api/v1/menus/{menuId}/items/{itemId}`

## 3. HTTP方法与资源操作

### 3.1 标准HTTP方法映射

| HTTP方法 | 资源操作 | 幂等性 | 成功状态码 |
|----------|----------|--------|------------|
| GET | 获取资源 | ✅ | 200 OK |
| POST | 创建资源 | ❌ | 201 Created |
| PUT | 更新资源(全量) | ✅ | 200 OK / 204 No Content |
| PATCH | 更新资源(部分) | ✅ | 200 OK / 204 No Content |
| DELETE | 删除资源 | ✅ | 204 No Content |
| HEAD | 获取资源头信息 | ✅ | 200 OK |
| OPTIONS | 获取资源支持的方法 | ✅ | 200 OK |

### 3.2 批量操作

* 批量获取：`GET /api/v1/menus?ids=1,2,3`
* 批量创建：`POST /api/v1/menus/batch`
* 批量更新：`PUT /api/v1/menus/batch`
* 批量删除：`DELETE /api/v1/menus/batch?ids=1,2,3`

## 4. 请求规范

### 4.1 请求头

#### 4.1.1 必需头信息

* `Content-Type`：请求体类型，如`application/json`
* `Authorization`：认证信息，格式为`Bearer {token}`
* `X-Request-Id`：请求唯一标识，用于追踪

#### 4.1.2 可选头信息

* `Accept-Language`：语言偏好
* `X-Client-Version`：客户端版本
* `X-Timezone`：时区信息

### 4.2 请求参数

#### 4.2.1 查询参数

* 用于过滤、排序、分页等操作
* 支持数组参数：`?ids=1,2,3`或`?ids[]=1&ids[]=2`
* 支持范围查询：`?price[min]=10&price[max]=100`
* 排序参数：`?sort=createdAt:desc,price:asc`

#### 4.2.2 分页参数

* `page`：页码，从1开始
* `pageSize`：每页数量，默认20，最大100
* 示例：`?page=1&pageSize=20`

### 4.3 请求体

* 使用JSON格式
* 字段命名使用驼峰命名法
* 空值使用`null`，避免使用空字符串或特殊值
* 布尔值使用`true`/`false`，不使用数字或字符串
* 日期时间使用ISO 8601格式：`2024-10-15T12:00:00Z`

## 5. 响应规范

### 5.1 响应格式

```json
{
  "code": 200,
  "message": "成功",
  "data": {...},
  "meta": {...}
}
```text

### 5.2 响应字段说明

- `code`：业务状态码，与HTTP状态码一致
- `message`：响应描述信息
- `data`：响应数据，根据接口不同而变化
- `meta`：元数据，包含分页信息、统计信息等

### 5.3 分页响应格式

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    { "id": 1, "name": "..." },
    { "id": 2, "name": "..." }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```text

### 5.4 HTTP状态码规范

| 状态码 | 含义 | 适用场景 |
|--------|------|----------|
| 200 OK | 成功 | GET请求成功，PUT/PATCH请求成功 |
| 201 Created | 创建成功 | POST请求成功创建资源 |
| 204 No Content | 成功无内容 | DELETE请求成功，PUT/PATCH请求成功但无需返回内容 |
| 400 Bad Request | 请求错误 | 请求参数错误，格式不符合要求 |
| 401 Unauthorized | 未授权 | 未提供认证信息或认证失败 |
| 403 Forbidden | 禁止访问 | 权限不足，无法访问资源 |
| 404 Not Found | 资源不存在 | 请求的资源不存在 |
| 405 Method Not Allowed | 不支持的方法 | 请求的HTTP方法不被支持 |
| 409 Conflict | 冲突 | 请求与资源当前状态冲突 |
| 429 Too Many Requests | 请求过多 | 触发限流策略 |
| 500 Internal Server Error | 服务器错误 | 服务器内部错误 |
| 502 Bad Gateway | 网关错误 | 上游服务错误 |
| 503 Service Unavailable | 服务不可用 | 服务暂时不可用，如维护中 |

## 6. 错误处理规范

### 6.1 错误响应格式

```json
{
  "code": 400,
  "message": "请求参数错误",
  "errors": [
    {
      "field": "name",
      "message": "名称不能为空",
      "code": "FIELD_REQUIRED"
    },
    {
      "field": "price",
      "message": "价格必须大于0",
      "code": "INVALID_VALUE"
    }
  ]
}
```text

### 6.2 错误码规范

| 错误码类型 | 格式 | 示例 |
|------------|------|------|
| 业务错误 | 大写字母+下划线 | INVALID_PARAMETER |
| 系统错误 | SYS_+错误码 | SYS_DATABASE_ERROR |
| 权限错误 | PERMISSION_+错误码 | PERMISSION_DENIED |
| 参数错误 | FIELD_+错误码 | FIELD_REQUIRED |

### 6.3 异常日志记录

- 记录详细的错误信息，包括请求参数、错误堆栈
- 敏感信息脱敏处理
- 关联请求ID，便于问题追踪

## 7. 认证与授权

### 7.1 认证机制

- **OAuth 2.0 + JWT**：主要认证方式
- **API Key**：适用于服务间调用
- **Token格式**：`Bearer {jwt_token}`

### 7.2 Token规范

- JWT包含：`iss`, `sub`, `iat`, `exp`, `jti`等标准字段
- 自定义字段：`userId`, `roles`, `permissions`
- Token有效期：默认2小时，可配置
- Refresh Token：7天有效期

### 7.3 授权模型

- **基于角色(RBAC)**：用户→角色→权限
- **权限粒度**：资源+操作+条件
- **权限表示**：`resource:action:condition`
- 示例：`menu:read:*`, `menu:create:own`

## 8. 接口安全规范

### 8.1 数据安全

- 传输加密：TLS 1.2+
- 敏感数据脱敏：响应中敏感字段脱敏
- 密码存储：bcrypt/Argon2等强哈希算法

### 8.2 接口保护

- **请求限流**：基于IP、用户ID的限流策略
- **请求验证**：严格的输入参数校验
- **CSRF防护**：使用CSRF Token
- **XSS防护**：输出转义、Content-Security-Policy

### 8.3 敏感操作

- **二次验证**：关键操作需要二次确认
- **操作日志**：记录敏感操作的详细日志
- **防重放攻击**：使用nonce和timestamp

## 9. API文档规范

### 9.1 API文档格式

- 使用OpenAPI 3.0规范
- 文档应包含：接口描述、请求参数、响应格式、错误码、示例

### 9.2 文档生成

- 从代码注释自动生成API文档
- 提供交互式API测试工具
- 版本控制与文档同步

## 10. 性能优化

### 10.1 缓存策略

- **HTTP缓存**：合理使用Cache-Control、ETag
- **条件请求**：支持If-Modified-Since、If-None-Match
- **部分响应**：支持字段过滤，减少传输数据量

### 10.2 批量处理

- 提供批量操作接口，减少网络请求次数
- 批量操作有合理的数量限制

### 10.3 异步操作

- 长时间运行的操作使用异步处理
- 提供任务状态查询接口
- 支持回调通知机制

## 11. 核心业务API示例

### 11.1 智能菜单系统API

#### 11.1.1 菜单管理

```text
# 获取菜单列表
GET /api/v1/menus

# 创建新菜单
POST /api/v1/menus
Request Body:
{
  "name": "冬季菜单",
  "description": "2024年冬季新品菜单",
  "effectiveDate": "2024-12-01T00:00:00Z",
  "expiryDate": "2025-02-28T23:59:59Z",
  "status": "active"
}

# 获取菜单详情
GET /api/v1/menus/{menuId}

# 更新菜单信息
PUT /api/v1/menus/{menuId}

# 删除菜单
DELETE /api/v1/menus/{menuId}
```text

#### 11.1.2 菜品管理

```text
# 获取菜品列表
GET /api/v1/menus/{menuId}/items

# 添加菜品
POST /api/v1/menus/{menuId}/items
Request Body:
{
  "name": "红烧肉",
  "description": "传统红烧肉，肥而不腻",
  "price": 68.00,
  "category": "主菜",
  "tags": ["招牌菜", "热门"],
  "ingredients": ["五花肉", "酱油", "冰糖"],
  "nutritionInfo": {
    "calories": 520,
    "protein": 25,
    "fat": 38,
    "carbs": 15
  }
}

# 获取菜品详情
GET /api/v1/menus/{menuId}/items/{itemId}

# 更新菜品信息
PUT /api/v1/menus/{menuId}/items/{itemId}

# 删除菜品
DELETE /api/v1/menus/{menuId}/items/{itemId}
```text

### 11.2 智能表单系统API

#### 11.2.1 表单模板管理

```text
# 获取表单模板列表
GET /api/v1/form-templates

# 创建表单模板
POST /api/v1/form-templates
Request Body:
{
  "name": "客户反馈表",
  "description": "收集客户用餐体验反馈",
  "fields": [
    {
      "name": "customerName",
      "label": "姓名",
      "type": "text",
      "required": true
    },
    {
      "name": "rating",
      "label": "满意度评分",
      "type": "number",
      "min": 1,
      "max": 5,
      "required": true
    },
    {
      "name": "comments",
      "label": "意见建议",
      "type": "textarea"
    }
  ],
  "status": "active"
}

# 获取表单模板详情
GET /api/v1/form-templates/{templateId}

# 更新表单模板
PUT /api/v1/form-templates/{templateId}

# 删除表单模板
DELETE /api/v1/form-templates/{templateId}
```text

#### 11.2.2 表单数据管理

```text
# 获取表单数据列表
GET /api/v1/form-templates/{templateId}/submissions

# 提交表单数据
POST /api/v1/form-templates/{templateId}/submissions
Request Body:
{
  "data": {
    "customerName": "张先生",
    "rating": 5,
    "comments": "菜品美味，服务周到"
  },
  "metadata": {
    "submittedAt": "2024-10-15T12:30:00Z",
    "source": "instore"
  }
}

# 获取表单数据详情
GET /api/v1/form-templates/{templateId}/submissions/{submissionId}

# 删除表单数据
DELETE /api/v1/form-templates/{templateId}/submissions/{submissionId}
```text

### 11.3 用户管理API

```text
# 获取用户列表
GET /api/v1/users

# 创建用户
POST /api/v1/users
Request Body:
{
  "username": "zhangsan",
  "name": "张三",
  "email": "zhangsan@example.com",
  "phone": "13800138000",
  "roleIds": [1, 3],
  "status": "active"
}

# 获取用户详情
GET /api/v1/users/{userId}

# 更新用户信息
PUT /api/v1/users/{userId}

# 删除用户
DELETE /api/v1/users/{userId}

# 重置密码
POST /api/v1/users/{userId}/reset-password
Request Body:
{
  "newPassword": "NewPass123!"
}
```text

## 12. API版本控制策略

### 12.1 版本控制方式

- **URL路径版本**：`/api/v1/...`, `/api/v2/...`（推荐）
- **Header版本**：`Accept: application/vnd.example.v1+json`
- **Query参数版本**：`?version=1`（不推荐）

### 12.2 版本升级规则

- **向后兼容**：新版本应兼容旧版本API
- **废弃策略**：标记废弃API，设置合理的过渡期
- **文档说明**：清晰说明各版本差异和迁移指南

### 12.3 版本支持周期

- 主版本：支持12个月
- 次版本：支持6个月
- 补丁版本：支持到下一个次版本发布

## 13. 测试环境与生产环境

### 13.1 环境配置

| 环境 | 基础URL | 说明 |
|------|---------|------|
| 开发 | http://dev-api.zhishu.example.com | 开发人员使用 |
| 测试 | http://test-api.zhishu.example.com | 测试团队使用 |
| 预发布 | http://pre-api.zhishu.example.com | 预发布验证 |
| 生产 | https://api.zhishu.example.com | 正式环境 |

### 13.2 环境切换

- 通过环境变量或配置文件切换API环境
- 客户端应支持配置不同环境的API地址

## 14. 文档维护

### 14.1 文档更新

- API变更时同步更新文档
- 文档更新应包含变更日志
- 重大变更应通知相关团队

### 14.2 文档验证

- 定期验证文档与实际API的一致性
- 提供API测试工具验证接口功能
- 收集开发者反馈，持续优化文档

## 15. 总结

本规范定义了智枢服务化平台API接口的设计标准和最佳实践，旨在确保API的一致性、可用性、安全性和可维护性。所有API开发和使用都应遵循本规范，确保平台的整体质量和开发效率。

API设计是一个持续优化的过程，本规范将根据实际使用情况和技术发展不断更新完善。

---

**文档版本历史**

| 版本 | 修改日期 | 修改内容 | 修改人 |
|------|----------|----------|--------|
| 1.0.0 | 2024-10-15 | 初始版本 | YYC |


