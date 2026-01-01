/**

* @file 智枢服务化平台 API 完整手册
* @description 智枢服务化平台的API接口开发与调用规范
* @module api-manual
* @author YYC
* @version 1.0.0
* @created 2024-10-15
* @updated 2024-10-15
 */

# 智枢服务化平台 API 完整手册 v1.0

## 文档说明

**文档版本**: v1.0
**创建日期**: 2024-10-15
**最后更新**: 2024-10-15
**文档作者**: YYC
**适用范围**: 智枢服务化平台所有API接口开发与调用规范

## 平台简介

智枢服务化平台是一个基于微服务架构的企业级服务化平台，旨在提供高可用、高扩展、智能化的服务管理能力。平台采用"四层一体分层架构"设计，包括基础设施层、数据层、平台层和应用层，支持单元自治、智能化运维，实现业务快速交付和持续优化。平台核心价值体现在"五高五标五化"：高性能、高可用、高扩展、高安全、高智能；标准化、规范化、模块化、服务化、组件化；数字化、网络化、智能化、自动化、生态化。

## 一、API 总体设计规范

### 1.1 基本信息

* **基础 URL：** `https://api.zhishu-platform.com/api/v1`
* **请求格式：** JSON
* **响应格式：** JSON
* **字符编码：** UTF-8
* **API 版本：** v1
* **最大请求大小：** 10MB
* **默认超时时间：** 30秒

### 1.2 统一响应格式

```json
{
  "success": true,
  "code": "200",
  "message": "操作成功",
  "data": {},
  "timestamp": 1672531200000,
  "requestId": "req_123456789",
  "pagination": null,
  "metadata": {}
}
```text

**字段说明：**
- `success`: 请求是否成功（true/false）
- `code`: 业务状态码
- `message`: 响应消息
- `data`: 业务数据（可为任意JSON类型）
- `timestamp`: 响应时间戳
- `requestId`: 请求唯一标识
- `pagination`: 分页信息（仅在列表查询时返回）
- `metadata`: 附加元数据信息

### 1.3 HTTP 状态码

- **200：** 请求成功
- **201：** 创建成功
- **204：** 删除成功（无返回内容）
- **400：** 参数错误
- **401：** 未授权
- **403：** 禁止访问
- **404：** 资源不存在
- **405：** 方法不允许
- **429：** 请求频率过高
- **500：** 服务器错误
- **503：** 服务不可用（临时）
- **504：** 网关超时

### 1.4 错误响应

```json
{
  "success": false,
  "code": "INVALID_PARAMETER",
  "message": "参数验证失败",
  "timestamp": 1672531200000,
  "requestId": "req_123456789",
  "errors": {
    "email": "邮箱格式不正确"
  },
  "traceId": "trace_123456789"
}
```text

**错误码规范：**
- `INVALID_PARAMETER`: 参数无效
- `UNAUTHORIZED`: 未授权访问
- `FORBIDDEN`: 禁止访问
- `NOT_FOUND`: 资源不存在
- `SERVER_ERROR`: 服务器内部错误
- `BUSINESS_ERROR`: 业务逻辑错误
- `RATE_LIMIT_EXCEEDED`: 请求频率超限
- `VALIDATION_ERROR`: 数据验证失败
- `DUPLICATE_RESOURCE`: 资源重复

---

## 二、认证授权 API

### 2.1 用户注册

**端点：** `POST /auth/register`

**请求体：**
```json
{
  "username": "admin",
  "email": "admin@zhishu-platform.com",
  "password": "StrongPass@123",
  "phone": "13800138000",
  "department_id": "dept_001",
  "role_ids": ["role_admin"]
}
```text

**响应：**
```json
{
  "success": true,
  "data": {
    "user_id": "user_001",
    "username": "admin",
    "email": "admin@zhishu-platform.com",
    "status": "active",
    "created_at": "2024-10-15T08:00:00Z"
  }
}
```text

### 2.2 用户登录

**端点：** `POST /auth/login`

**请求体：**
```json
{
  "username": "admin",
  "password": "StrongPass@123",
  "captcha_code": "ABCD1234",
  "captcha_token": "captcha_123456789"
}
```text

**响应：**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "ref_token_...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "user_id": "user_001",
      "username": "admin",
      "display_name": "系统管理员",
      "roles": ["ADMIN", "SUPER_ADMIN"],
      "permissions": ["user:create", "user:update", "user:delete"],
      "department": "IT部门"
    }
  }
}
```text

### 2.3 刷新令牌

**端点：** `POST /auth/refresh-token`

**请求体：**
```json
{
  "refresh_token": "ref_token_...",
  "client_id": "web_client_001"
}
```text

**响应：**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```text

### 2.4 获取验证码

**端点：** `GET /auth/captcha`

**查询参数：**
- `type`: 验证码类型 (image/sms/email)
- `format`: 验证码格式

**响应：**
```json
{
  "success": true,
  "data": {
    "captcha_token": "captcha_123456789",
    "image_data": "base64编码的图片数据",
    "expires_at": "2024-10-15T08:05:00Z"
  }
}
```text

### 2.5 用户登出

**端点：** `POST /auth/logout`

**请求头：**
```text
Authorization: Bearer access_token_...
```text

**响应：**
```json
{
  "success": true,
  "message": "登出成功"
}
```text

---

## 三、平台服务管理 API

### 3.1 获取服务列表

**端点：** `GET /services`

**查询参数：**

- `page` (可选) - 页码，默认1
- `page_size` (可选) - 每页数量，默认20
- `status` (可选) - 服务状态 (active/inactive/error)
- `category` (可选) - 服务类别
- `keyword` (可选) - 搜索关键词

**请求头：**
```text
Authorization: Bearer access_token_...
```text

**响应：**
```json
{
  "success": true,
  "data": [
    {
      "service_id": "svc_001",
      "service_name": "用户认证服务",
      "service_code": "auth-service",
      "category": "core",
      "status": "active",
      "version": "1.0.0",
      "description": "提供用户认证、授权等核心功能",
      "created_at": "2024-10-15T08:00:00Z",
      "updated_at": "2024-10-15T08:00:00Z",
      "metadata": {
        "instance_count": 3,
        "health_score": 98.5
      }
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 100,
    "total_pages": 5
  }
}
```text

### 3.2 获取服务详情

**端点：** `GET /services/{service_id}`

**请求头：**
```text
Authorization: Bearer access_token_...
```text

**响应：**
```json
{
  "success": true,
  "data": {
    "service_id": "svc_001",
    "service_name": "用户认证服务",
    "service_code": "auth-service",
    "category": "core",
    "status": "active",
    "version": "1.0.0",
    "description": "提供用户认证、授权等核心功能",
    "config": {
      "replicas": 3,
      "resources": {
        "cpu": "1",
        "memory": "2Gi"
      }
    },
    "instances": [
      {
        "instance_id": "ins_001",
        "status": "healthy",
        "ip": "192.168.1.101"
      }
    ],
    "health": {
      "status": "healthy",
      "checks": [
        {
          "name": "http",
          "status": "passing"
        }
      ]
    }
  }
}
```text

### 3.3 创建服务

**端点：** `POST /services`

**请求体：**
```json
{
  "service_name": "订单服务",
  "service_code": "order-service",
  "category": "business",
  "description": "处理订单相关业务逻辑",
  "config": {
    "replicas": 2,
    "resources": {
      "cpu": "1",
      "memory": "2Gi"
    },
    "ports": [
      {
        "container_port": 8080,
        "service_port": 80
      }
    ]
  },
  "metadata": {
    "owner": "business_team",
    "critical": true
  }
}
```text

**响应：**
```json
{
  "success": true,
  "data": {
    "service_id": "svc_002",
    "service_name": "订单服务",
    "status": "pending",
    "created_at": "2024-10-15T09:00:00Z"
  }
}
```text

### 3.4 更新服务

**端点：** `PUT /services/{service_id}`

**请求体：**
```json
{
  "service_name": "订单服务(更新)",
  "config": {
    "replicas": 3
  }
}
```text

**响应：**
```json
{
  "success": true,
  "data": {
    "service_id": "svc_002",
    "service_name": "订单服务(更新)",
    "status": "updating"
  }
}
```text

### 3.5 删除服务

**端点：** `DELETE /services/{service_id}`

**请求头：**
```text
Authorization: Bearer access_token_...
```text

**响应：**
```json
{
  "success": true,
  "message": "服务删除成功"
}
```text

---

## 四、单元自治管理 API

### 4.1 获取自治单元列表

**端点：** `GET /autonomous-units`

**查询参数：**
- `page` - 页码
- `page_size` - 每页数量
- `status` - 单元状态

**响应：**
```json
{
  "success": true,
  "data": [
    {
      "unit_id": "unit_001",
      "unit_name": "用户服务单元",
      "status": "active",
      "services": ["auth-service", "user-service"],
      "resources": {
        "cpu_usage": 0.45,
        "memory_usage": 0.62
      },
      "autonomy_level": "high"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 50,
    "total_pages": 3
  }
}
```text

### 4.2 获取自治单元详情

**端点：** `GET /autonomous-units/{unit_id}`

**响应：**
```json
{
  "success": true,
  "data": {
    "unit_id": "unit_001",
    "unit_name": "用户服务单元",
    "description": "处理用户相关业务的自治单元",
    "status": "active",
    "services": ["auth-service", "user-service"],
    "config": {
      "auto_scaling": true,
      "min_replicas": 2,
      "max_replicas": 10
    },
    "metrics": {
      "throughput": 1000,
      "latency": 50,
      "error_rate": 0.001
    }
  }
}
```text

### 4.3 创建自治单元

**端点：** `POST /autonomous-units`

**请求体：**
```json
{
  "unit_name": "订单处理单元",
  "description": "处理订单相关业务的自治单元",
  "service_ids": ["order-service", "payment-service"],
  "config": {
    "auto_scaling": true,
    "min_replicas": 2,
    "max_replicas": 10,
    "scaling_metrics": ["cpu", "memory", "request_count"]
  },
  "policies": {
    "fault_tolerance": true,
    "circuit_breaker": true
  }
}
```text

**响应：**
```json
{
  "success": true,
  "data": {
    "unit_id": "unit_002",
    "unit_name": "订单处理单元",
    "status": "creating"
  }
}
```text

---

## 五、智能运维 API

### 5.1 获取系统监控数据

**端点：** `GET /ops/monitoring`

**查询参数：**
- `start_time` - 开始时间
- `end_time` - 结束时间
- `metrics` - 监控指标（多个用逗号分隔）
- `service_id` - 服务ID（可选）

**响应：**
```json
{
  "success": true,
  "data": {
    "metrics": [
      {
        "name": "cpu_usage",
        "data": [
          {"timestamp": "2024-10-15T08:00:00Z", "value": 0.45},
          {"timestamp": "2024-10-15T08:01:00Z", "value": 0.47}
        ]
      },
      {
        "name": "memory_usage",
        "data": [
          {"timestamp": "2024-10-15T08:00:00Z", "value": 0.62},
          {"timestamp": "2024-10-15T08:01:00Z", "value": 0.63}
        ]
      }
    ]
  }
}
```text

### 5.2 获取告警列表

**端点：** `GET /ops/alerts`

**查询参数：**
- `status` - 告警状态（active/resolved）
- `severity` - 严重程度（critical/warning/info）
- `start_time` - 开始时间
- `end_time` - 结束时间

**响应：**
```json
{
  "success": true,
  "data": [
    {
      "alert_id": "alert_001",
      "title": "CPU使用率过高",
      "description": "服务 auth-service CPU使用率超过80%",
      "severity": "warning",
      "status": "active",
      "source": "monitoring",
      "created_at": "2024-10-15T09:30:00Z",
      "service_id": "svc_001"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 10,
    "total_pages": 1
  }
}
```text

### 5.3 获取智能建议

**端点：** `GET /ops/ai-insights`

**查询参数：**
- `service_id` - 服务ID（可选）
- `time_range` - 时间范围（1h/24h/7d）

**响应：**
```json
{
  "success": true,
  "data": {
    "insights": [
      {
        "id": "insight_001",
        "title": "服务性能优化建议",
        "description": "auth-service 在10:00-12:00负载较高，建议增加2个副本",
        "priority": "high",
        "action": "增加副本数",
        "confidence": 0.95
      },
      {
        "id": "insight_002",
        "title": "资源利用分析",
        "description": "user-service 内存使用率持续偏低，建议降低内存配置",
        "priority": "medium",
        "action": "调整资源配置",
        "confidence": 0.85
      }
    ]
  }
}
```text

---

## 六、数据服务 API

### 6.1 获取数据字典

**端点：** `GET /data/dictionaries/{dict_code}`

**响应：**
```json
{
  "success": true,
  "data": {
    "dict_code": "user_status",
    "dict_name": "用户状态",
    "items": [
      {"value": "active", "label": "活跃"},
      {"value": "inactive", "label": "禁用"},
      {"value": "pending", "label": "待审核"}
    ]
  }
}
```text

### 6.2 获取数据报表

**端点：** `POST /data/reports`

**请求体：**
```json
{
  "report_type": "service_performance",
  "start_date": "2024-10-01",
  "end_date": "2024-10-15",
  "dimensions": ["service", "unit"],
  "metrics": ["throughput", "latency", "error_rate"],
  "filters": {
    "service_ids": ["svc_001", "svc_002"],
    "status": "active"
  }
}
```text

**响应：**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_throughput": 150000,
      "avg_latency": 45,
      "avg_error_rate": 0.002
    },
    "details": [
      {
        "service_id": "svc_001",
        "service_name": "用户认证服务",
        "throughput": 80000,
        "latency": 50,
        "error_rate": 0.001
      },
      {
        "service_id": "svc_002",
        "service_name": "订单服务",
        "throughput": 70000,
        "latency": 40,
        "error_rate": 0.003
      }
    ]
  }
}
```text

---

## 七、安全管理 API

### 7.1 获取安全审计日志

**端点：** `GET /security/audit-logs`

**查询参数：**
- `page` - 页码
- `page_size` - 每页数量
- `action_type` - 操作类型
- `user_id` - 用户ID
- `start_time` - 开始时间
- `end_time` - 结束时间

**响应：**
```json
{
  "success": true,
  "data": [
    {
      "log_id": "log_001",
      "action_type": "login",
      "user_id": "user_001",
      "username": "admin",
      "ip_address": "192.168.1.100",
      "user_agent": "Mozilla/5.0 ...",
      "status": "success",
      "timestamp": "2024-10-15T08:00:00Z",
      "details": "用户登录成功"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 1000,
    "total_pages": 50
  }
}
```text

### 7.2 获取安全漏洞扫描结果

**端点：** `GET /security/vulnerabilities`

**查询参数：**
- `severity` - 严重程度
- `status` - 状态
- `service_id` - 服务ID

**响应：**
```json
{
  "success": true,
  "data": [
    {
      "vuln_id": "vuln_001",
      "title": "不安全的依赖包",
      "description": "依赖包 lodash@4.17.11 存在安全漏洞",
      "severity": "medium",
      "status": "open",
      "service_id": "svc_001",
      "affected_component": "lodash",
      "recommendation": "更新到 lodash@4.17.21 或更高版本",
      "discovered_at": "2024-10-15T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 10,
    "total_pages": 1
  }
}
```text

---

## 八、系统管理 API

### 8.1 获取系统配置

**端点：** `GET /system/configs`

**请求头：**
```text
Authorization: Bearer access_token_...
```text

**响应：**
```json
{
  "success": true,
  "data": {
    "configs": [
      {"key": "system.version", "value": "1.0.0"},
      {"key": "system.debug", "value": "false"},
      {"key": "api.rate_limit", "value": "1000"}
    ]
  }
}
```text

### 8.2 更新系统配置

**端点：** `PUT /system/configs/{config_key}`

**请求体：**
```json
{
  "value": "1.1.0"
}
```text

**响应：**
```json
{
  "success": true,
  "data": {
    "key": "system.version",
    "value": "1.1.0",
    "updated_at": "2024-10-15T10:00:00Z"
  }
}
```text

### 8.3 获取系统健康状态

**端点：** `GET /system/health`

**响应：**
```json
{
  "success": true,
  "data": {
    "status": "UP",
    "components": {
      "database": {"status": "UP"},
      "redis": {"status": "UP"},
      "elasticsearch": {"status": "UP"},
      "message_queue": {"status": "UP"}
    },
    "uptime": 2592000,
    "version": "1.0.0"
  }
}
```text

---

## 九、API 版本控制与兼容性

### 9.1 版本管理策略

- **URL路径版本化**：在API路径中包含版本信息，如 `/api/v1/...`
- **向后兼容性**：新版本API必须保持对旧版本客户端的兼容性至少6个月
- **废弃通知**：API废弃前至少提前3个月发布通知
- **强制升级期**：废弃后的3个月为强制升级期，之后旧版本API将不再可用

### 9.2 兼容性保障

- 新增字段不影响现有客户端解析
- 不删除已有字段或修改字段类型
- 参数新增提供默认值
- 响应格式保持稳定

---

## 十、API 最佳实践

### 10.1 性能优化建议

- 使用缓存减少数据库查询
- 批量操作替代单条操作
- 合理设置超时时间
- 使用分页机制处理大数据集
- 优化查询条件和索引

### 10.2 安全最佳实践

- 所有API必须进行认证授权
- 敏感数据传输使用HTTPS
- 输入数据严格验证
- 防止SQL注入、XSS等常见攻击
- 实施请求频率限制

### 10.3 错误处理最佳实践

- 使用明确的错误码和错误消息
- 提供详细的错误日志（包含requestId和traceId）
- 对用户友好的错误提示
- 内部错误不暴露系统敏感信息

---

**手册版本：** v1.0  
**最后更新：** 2024-10-15  
**维护单位：** 智枢服务化平台技术团队
**联系邮箱：** tech@zhishu-platform.com

