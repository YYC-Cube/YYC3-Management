# TypeScript 编码规范

> **文档类型**: 规范
> **所属模块**: 开发指南
> **版本**: 1.0.0
> **创建日期**: 2026-01-03
> **最后更新**: 2026-01-03
> **维护人**: YYC³ 技术团队

## 1. 概述

本文档规定 YYC³-MANA 项目的 TypeScript 编码规范，确保代码质量和一致性。

### 1.1 核心原则

- ✅ **类型安全优先** - 最大化类型覆盖率，最小化 `any` 使用
- ✅ **可读性优先** - 代码自解释，命名清晰
- ✅ **模块化设计** - 小模块，单一职责
- ✅ **性能意识** - 避免不必要的计算和内存占用

### 1.2 项目类型安全统计

```
总类型定义:     150+ 接口
类型覆盖率:     95%
any 类型使用:    <1%
严格模式:        启用
```

## 2. 命名规范

### 2.1 文件命名

```typescript
// kebab-case for components
user-profile.tsx
ai-assistant.tsx

// PascalCase for utilities and services
userService.ts
AnalyticsEngine.ts

// camelCase for hooks and stores
useUserData.ts
authSlice.ts

// kebab-case for types
user-profile.types.ts
api-response.types.ts
```

### 2.2 变量命名

```typescript
// camelCase for variables and functions
const userName = 'John';
const isActive = true;
const userCount = 100;

function getUserData() {}
async function fetchUserList() {}

// PascalCase for classes, interfaces, types
class UserService {}
interface UserProfile {}
type UserRole = 'admin' | 'user';

// UPPER_CASE for constants
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;

// Prefix for private/protected
class UserService {
  private _cache: Map<string, any>;
  protected _logger: Logger;
}
```

### 2.3 接口和类型命名

```typescript
// Interface: PascalCase, no 'I' prefix
interface UserProfile {}
interface ApiResponse {}

// Type Alias: PascalCase, descriptive nouns
type UserId = string;
type UserRole = 'admin' | 'user' | 'guest';

// Enum: PascalCase
enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending'
}

// Generic types: T prefix
type ApiResponse<T> = {
  data: T;
  status: 'success' | 'error';
};

// Function types: verb + noun
type TransformFunction<T, R> = (input: T) => R;
```

## 3. 类型定义

### 3.1 接口定义

```typescript
// ✅ 好的实践
interface UserProfile {
  // 必需属性在前，可选在后
  id: UserId;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt?: Date;  // 可选属性

  // 方法签名
  getFullName(): string;
  updateProfile(data: Partial<UserProfile>): Promise<void>;
}

// ❌ 避免
interface IUserProfile {}  // 不要用I前缀
interface UserProfile {
  name: string; email: string;  // 一行一个属性
}
```

### 3.2 类型组织

```typescript
// types/user.types.ts
export namespace User {
  export type Id = string;
  export type Role = 'admin' | 'user' | 'guest';
  export type Status = 'active' | 'inactive' | 'pending';
}

export interface UserProfile {
  id: User.Id;
  role: User.Role;
  status: User.Status;
}

// 使用
import type { User, UserProfile } from './types/user.types';
```

### 3.3 泛型使用

```typescript
// ✅ 好的泛型命名
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, 'id'>): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

// 使用示例
interface UserRepository extends Repository<User> {
  findByEmail(email: string): Promise<User | null>;
}
```

### 3.4 联合类型

```typescript
// 联合类型用于多态数据
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: Error };

// 交叉类型用于组合
type Timestamped = { timestamp: Date };
type Identifiable = { id: string };
type Entity = Timestamped & Identifiable;

// 类型守卫
function isSuccess<T>(result: Result<T>): result is { success: true; data: T } {
  return result.success;
}
```

## 4. 函数和方法

### 4.1 函数声明

```typescript
// ✅ 标准函数
async function fetchUser(id: string): Promise<User | null> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) return null;
  return response.json();
}

// ✅ 箭头函数
const fetchUsers = async (page = 1): Promise<User[]> => {
  const response = await fetch(`/api/users?page=${page}`);
  return response.json();
};

// ❌ 避免
function getUser(i: string, n?: string) { }  // 参数名不清晰
const getUser = (i: string) => { }  // 箭头函数最好用async
```

### 4.2 参数和返回值

```typescript
// ✅ 清晰的参数和返回值
interface CreateUserParams {
  name: string;
  email: string;
  role: UserRole;
}

async function createUser(params: CreateUserParams): Promise<User> {
  const user = await User.create(params);
  return user;
}

// ✅ 对象参数用于多参数
function formatDate(
  date: Date,
  options?: {
    locale?: string;
    format?: string;
  }
): string {
  // 实现
}
```

### 4.3 异步处理

```typescript
// ✅ 正确的异步处理
async function processData(data: RawData): Promise<ProcessedData> {
  try {
    const cleaned = await cleanData(data);
    const enriched = await enrichData(cleaned);
    return enriched;
  } catch (error) {
    logger.error('Processing failed', error);
    throw error;
  }
}

// ✅ 并行处理
async function processBatch(items: Item[]): Promise<Result[]> {
  return Promise.all(
    items.map(item => processItem(item))
  );
}
```

## 5. 类和对象

### 5.1 类定义

```typescript
// ✅ 标准类结构
class UserService {
  // 公共属性
  public readonly repository: UserRepository;

  // 私有属性（下划线前缀）
  private _cache: Map<string, User> = new Map();

  // 构造函数
  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  // 公共方法
  async findById(id: string): Promise<User | null> {
    // 先检查缓存
    if (this._cache.has(id)) {
      return this._cache.get(id)!;
    }

    // 从数据库查询
    const user = await this.repository.findById(id);
    if (user) {
      this._cache.set(id, user);
    }
    return user;
  }

  // 私有方法
  private async validateUser(user: User): Promise<boolean> {
    return user.email !== '';
  }
}
```

### 5.2 单例模式

```typescript
// ✅ 单例实现
class SecurityService {
  private static instance: SecurityService;

  private constructor() {
    // 私有构造函数
  }

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }
}
```

## 6. 异步处理

### 6.1 Promise使用

```typescript
// ✅ Promise链
async function processWorkflow(): Promise<void> {
  await step1();
  await step2();
  await step3();
}

// ✅ 并行Promise
async function processInParallel(): Promise<void> {
  await Promise.all([
    processA(),
    processB(),
    processC()
  ]);
}

// ✅ 竞速Promise
async function processWithRace(): Promise<void> {
  const result = await Promise.race([
    fetchFromPrimary(),
    fetchFromSecondary()
  ]);
}
```

### 6.2 错误处理

```typescript
// ✅ 完整的错误处理
async function safeOperation<T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    logger.error('Operation failed', error);
    return fallback;
  }
}

// ✅ 类型安全的错误
class ApplicationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'ApplicationError';
  }
}

// 使用
throw new ApplicationError('User not found', 'USER_NOT_FOUND', 404);
```

## 7. 类型安全最佳实践

### 7.1 避免 any

```typescript
// ❌ 避免使用 any
function processData(data: any): any {
  return data;
}

// ✅ 使用具体类型
interface ProcessedData {
  id: string;
  result: number;
  timestamp: Date;
}

function processData(data: RawData): ProcessedData {
  return {
    id: generateId(),
    result: calculateResult(data),
    timestamp: new Date()
  };
}
```

### 7.2 类型守卫

```typescript
// ✅ 类型守卫函数
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'email' in value
  );
}

function isAdmin(user: User | Admin): user is Admin {
  return user.role === 'admin';
}

// 使用
if (isAdmin(user)) {
  // TypeScript 知道这是 Admin
  console.log(user.adminPermissions);
}
```

### 7.3 类型断言

```typescript
// ❌ 避免过度的类型断言
const user = data as User;

// ✅ 使用类型守卫
if (isUser(data)) {
  // 使用 data
}

// ✅ 必要时使用非空断言
const element = document.getElementById('root')!;
```

## 8. 模块组织

### 8.1 导入导出

```typescript
// ✅ 类型导入
import type { User, UserProfile } from './types/user.types';

// ✅ 命名导入
import { UserService } from './services/user.service';
import { AuthService } as Auth from './services/auth.service';

// ✅ 默认导出（避免使用）
export class AnalyticsEngine {
  // 实现
}

// ✅ 命名导出（推荐）
export { AnalyticsEngine };
export type { AnalyticsConfig };
```

### 8.2 目录结构

```
feature/
├── components/        # UI组件
│   ├── UserProfile.tsx
│   └── UserList.tsx
├── hooks/             # 自定义Hooks
│   ├── useUser.ts
│   └── useAuth.ts
├── services/          # 业务逻辑
│   └── userService.ts
├── types/             # 类型定义
│   └── user.types.ts
├── utils/             # 工具函数
│   └── validation.ts
└── index.ts          # 模块导出
```

## 9. 性能优化

### 9.1 避免不必要的计算

```typescript
// ❌ 每次调用都创建新数组
function getNames(users: User[]): string[] {
  return users.map(u => u.name);
}

// ✅ 使用缓存
function getNames(users: User[]): string[] {
  if (!this._nameCache) {
    this._nameCache = users.map(u => u.name);
  }
  return this._nameCache;
}
```

### 9.2 懒加载

```typescript
// ✅ 懒加载组件
const Chart = dynamic(() => import('./Chart'), {
  loading: () => <Skeleton />
});
```

### 9.3 内存管理

```typescript
// ✅ 及时清理
class DataProcessor {
  private subscriptions: Subscription[] = [];

  processData() {
    const sub = dataSource.subscribe(data => {
      this.handleData(data);
    });
    this.subscriptions.push(sub);
  }

  cleanup() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }
}
```

## 10. 代码审查清单

### 10.1 类型安全

- [ ] 所有函数都有参数和返回值类型
- [ ] 没有 `any` 类型（特殊情况除外）
- [ ] 正确使用 `null` 和 `undefined`
- [ ] 类型守卫函数命名规范

### 10.2 代码质量

- [ ] 函数职责单一
- [ ] 命名清晰有意义
- [ ] 适当的错误处理
- [ ] 代码注释准确完整

### 10.3 性能考虑

- [ ] 避免不必要的计算
- [ ] 合理使用缓存
- [ ] 异步操作正确处理
- [ ] 大数据集分批处理

## 附录

### A. ESLint 配置

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

### B. Prettier 配置

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### C. VSCode 设置

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### D. 变更记录

| 版本 | 日期 | 作者 | 变更内容 |
|------|------|------|----------|
| 1.0.0 | 2026-01-03 | YYC³ | 初始版本 |

---

**规范维护**: YYC³ 技术团队
**联系方式**: admin@0379.email
