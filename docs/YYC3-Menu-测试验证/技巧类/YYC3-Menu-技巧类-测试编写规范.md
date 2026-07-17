---
description: YYC3 YYC3 项目文档 - YYC³-MANA 测试编写规范
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

# YYC³-MANA 测试编写规范

> **文档类型**: 测试规范
> **所属系列**: 测试文档
> **版本**: 1.0.0
> **创建日期**: 2026-01-03
> **最后更新**: 2026-01-03
> **维护人**: YYC³ QA Team

## 1. 概述

### 1.1 目的

本规范旨在为 YYC³-MANA 项目建立统一、高质量的测试标准，确保代码质量和系统稳定性。

### 1.2 适用范围

- 所有单元测试
- 所有集成测试
- 所有E2E测试
- 所有性能测试

### 1.3 测试目标

```
Phase 1 (Week 1-2):  40% 覆盖率
Phase 1 (Month 2):   60% 覆盖率
Phase 2 (Month 3-4):  70% 覆盖率
最终目标:           80%+ 覆盖率
```

---

## 2. 测试框架

### 2.1 技术栈

```json
{
  "测试框架": "Vitest 4.0+",
  "断言库": "Vitest内置 (Chai兼容)",
  "测试工具": "@testing-library/react",
  "覆盖率工具": "@vitest/coverage-v8",
  "Mock工具": "Vitest vi"
}
```

### 2.2 配置文件

**vitest.config.ts**:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      lines: 60,
      functions: 60,
      branches: 60,
      statements: 60,
    },
  },
});
```

---

## 3. 测试文件结构

### 3.1 目录组织

```
yyc3-mana/
├── core/
│   └── __tests__/
│       ├── analytics/
│       │   ├── PredictiveAnalytics.test.ts
│       │   └── OmniChannelAnalytics.test.ts
│       ├── crm/
│       │   └── AdvancedCustomer360.test.ts
│       ├── workflows/
│       │   └── CallingWorkflowEngine.test.ts
│       └── ai-widget/
│           └── AutonomousAIEngine.test.ts
├── components/
│   └── __tests__/
│       └── ui/
└── lib/
    └── __tests__/
        └── test-utils.ts
```

### 3.2 命名约定

#### 测试文件命名

```typescript
// 规则: *.test.ts 或 *.spec.ts
✅ 推荐: PredictiveAnalytics.test.ts
✅ 推荐: CustomerService.spec.ts
❌ 避免: PredictiveAnalyticsTests.ts
❌ 避免: test_PredictiveAnalytics.ts
```

#### 测试用例命名

```typescript
// 格式: 应该 + 动作 + 结果
it('应该生成销售预测', async () => {});
it('应该计算客户价值', async () => {});
it('应该处理无效输入', async () => {});

// 或者: 当 + 条件 + 那么
it('当客户ID无效时，应该抛出错误', async () => {});
```

---

## 4. 测试编写规范

### 4.1 测试结构 (AAA模式)

每个测试用例应遵循 **Arrange-Act-Assert** 模式：

```typescript
describe('CustomerService', () => {
  it('应该成功创建客户', async () => {
    // Arrange: 准备测试数据和环境
    const customerData = {
      name: '张三',
      email: 'zhangsan@example.com',
    };

    // Act: 执行被测试的操作
    const result = await customerService.create(customerData);

    // Assert: 验证结果
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe('张三');
  });
});
```

### 4.2 测试分组

使用 `describe` 块组织相关测试：

```typescript
describe('PredictiveAnalytics', () => {
  describe('构造函数初始化', () => {
    it('应该正确初始化', () => {});
    it('应该设置默认配置', () => {});
  });

  describe('业务预测生成', () => {
    it('应该生成销售预测', async () => {});
    it('应该包含季节性分析', async () => {});
  });

  describe('错误处理', () => {
    it('应该处理缺失数据', async () => {});
    it('应该处理无效参数', async () => {});
  });
});
```

### 4.3 断言规范

```typescript
// ✅ 使用具体的断言
expect(user.age).toBe(25);
expect(users.length).toBeGreaterThan(0);
expect(response.status).toBe(200);

// ❌ 避免过于宽泛的断言
expect(result).toBeTruthy();
expect(data).toBeDefined();

// ✅ 验证具体属性
expect(customer).toMatchObject({
  name: '张三',
  email: 'zhangsan@example.com',
});

// ✅ 验证数组内容
expect(tags).toContain('VIP');
expect(errors).toHaveLength(3);
```

---

## 5. 测试覆盖率要求

### 5.1 覆盖率指标

| 类型 | Phase 1 | Phase 2 | 最终目标 |
|------|---------|---------|----------|
| **行覆盖率** | 60% | 70% | 80% |
| **函数覆盖率** | 60% | 70% | 80% |
| **分支覆盖率** | 60% | 70% | 80% |
| **语句覆盖率** | 60% | 70% | 80% |

### 5.2 模块覆盖率优先级

**P0 (必须覆盖)**:
- ✅ Analytics (智能分析)
- ✅ CRM (客户管理)
- ✅ Security (安全中心)
- ✅ AI Widget (AI助手)

**P1 (重要覆盖)**:
- ⚠️ Education (教育培训)
- ⚠️ Learning (学习系统)
- ⚠️ Workflows (工作流引擎)
- ⚠️ Closed-Loop (闭环系统)

**P2 (计划覆盖)**:
- 📝 Calling (智能呼叫)
- 📝 Marketing (营销自动化)

---

## 6. 测试最佳实践

### 6.1 测试独立性

```typescript
// ✅ 每个测试独立运行
it('应该创建客户', async () => {
  const customer = await service.create({ name: '客户1' });
  expect(customer).toBeDefined();
});

it('应该更新客户', async () => {
  // 不依赖前面的测试
  const customer = await service.create({ name: '客户2' });
  const updated = await service.update(customer.id, { name: '已更新' });
  expect(updated.name).toBe('已更新');
});

// ❌ 避免测试间依赖
let customerId: string;

it('创建客户', async () => {
  const customer = await service.create({ name: '客户' });
  customerId = customer.id; // ❌ 状态污染
});
```

### 6.2 Mock和Stub

```typescript
// ✅ Mock外部依赖
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

// ✅ Stub数据库调用
const mockDb = {
  findMany: vi.fn().mockResolvedValue([
    { id: '1', name: '客户1' },
    { id: '2', name: '客户2' },
  ]),
};
```

### 6.3 异步测试

```typescript
// ✅ 正确处理异步
it('应该异步获取数据', async () => {
  const data = await service.fetchData();
  expect(data).toBeDefined();
});

// ✅ 使用 waitFor
it('应该等待DOM更新', async () => {
  render(<Component />);
  await waitFor(() => {
    expect(screen.getByText('加载完成')).toBeInTheDocument();
  });
});
```

### 6.4 测试数据管理

```typescript
// 使用测试数据工厂
export const mockCustomer = {
  id: 'customer_123',
  name: '张三',
  email: 'zhangsan@example.com',
  phone: '+86138****1234',
  company: '示例公司',
};

// 或使用测试数据生成器
export const createMockCustomer = (overrides = {}) => ({
  id: `customer_${Math.random()}`,
  name: '测试客户',
  email: 'test@example.com',
  ...overrides,
});
```

---

## 7. 测试命令和脚本

### 7.1 常用命令

```bash
# 运行所有测试
bun test

# 监听模式
bun test:watch

# 生成覆盖率报告
bun test:coverage

# 运行特定测试文件
bun test PredictiveAnalytics.test.ts

# 运行匹配模式的测试
bun test --grep "客户管理"

# 查看测试UI
bun test:ui
```

### 7.2 CI/CD集成

**GitHub Actions 配置**:

```yaml
name: Test CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: 安装依赖
        run: bun install
      
      - name: 运行测试
        run: bun test:coverage
      
      - name: 上传覆盖率
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## 8. 质量门禁

### 8.1 提交前检查

```bash
# 必须通过所有检查
✅ bun test                    # 所有测试通过
✅ bun test:coverage           # 覆盖率达标
✅ bun type-check              # 类型检查通过
✅ bun lint                    # 代码规范检查通过
```

### 8.2 PR合并要求

```yaml
测试要求:
  - 所有单元测试通过 ✅
  - 覆盖率不低于当前基准 ✅
  - 新功能必须有测试覆盖 ✅
  - Bug修复必须有回归测试 ✅
```

---

## 9. 常见问题和解决方案

### 9.1 测试超时

```typescript
// 增加超时时间
it('应该完成长时间操作', async () => {
  // 测试代码
}, 30000); // 30秒超时
```

### 9.2 Mock问题

```typescript
// 清除所有mock
beforeEach(() => {
  vi.clearAllMocks();
});

// 恢复所有mock
afterEach(() => {
  vi.restoreAllMocks();
});
```

### 9.3 异步测试失败

```typescript
// 确保正确处理Promise
it('异步测试', async () => {
  await expect(asyncOperation()).resolves.toBe(expectedValue);
  await expect(asyncOperation()).rejects.toThrow();
});
```

---

## 10. 持续改进

### 10.1 测试审查

- 每周进行测试代码审查
- 识别重复代码并提取工具函数
- 更新测试规范以反映最佳实践

### 10.2 测试指标

```typescript
// 测试质量指标
const metrics = {
  // 速度
  testDuration: '< 10分钟',
  
  // 稳定性
  flakyTests: '0%',
  
  // 覆盖率
  codeCoverage: '80%+',
  
  // 维护性
  testComplexity: '低',
};
```

---

## 附录

### A. 相关文档

- [测试策略文档](../80-测试-策略-测试策略.md)
- [API接口文档](../10-开发-API-API接口文档.md)
- [TypeScript规范](../10-开发-指南-TypeScript规范.md)

### B. 变更记录

| 版本 | 日期 | 作者 | 变更内容 |
|------|------|------|----------|
| 1.0.0 | 2026-01-03 | YYC³ | 初始版本 |

---

**维护团队**: YYC³ QA Team
**联系方式**: admin@0379.email
**文档版本**: 1.0.0
