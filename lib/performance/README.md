# YYC³ 性能优化模块

> **版本**: 2.0.0
> **创建日期**: 2026-01-05
> **状态**: 生产就绪

---

## 📦 模块概述

YYC³性能优化模块是一个完整的性能优化解决方案，包括监控、工具和组件，帮助提升Next.js应用的加载速度、运行效率和用户体验。

### 核心功能

- 📊 **性能监控** - Web Vitals监控和性能评分
- 🚀 **代码分割** - 智能懒加载和代码分割
- 💾 **缓存管理** - LRU缓存和TTL管理
- 🎨 **虚拟化组件** - 虚拟列表和网格
- ⚡ **性能工具** - 防抖、节流、批处理

---

## 🚀 快速开始

### 1. 导入模块

```typescript
// 导入所有功能
import * as Performance from '@/lib/performance';

// 或使用默认导出
import PerformanceToolkit from '@/lib/performance';

// 或单独导入
import {
  initPerformanceMonitoring,
  lazyLoad,
  VirtualList,
  useCachedData,
} from '@/lib/performance';
```

### 2. 初始化监控

```typescript
'use client';

import { useEffect } from 'react';
import { initPerformanceMonitoring } from '@/lib/performance';

export default function Layout({ children }) {
  useEffect(() => {
    initPerformanceMonitoring();
  }, []);

  return <html>{children}</html>;
}
```

### 3. 使用优化组件

```typescript
import { VirtualList, DebouncedInput, LazyImage } from '@/lib/performance';

// 虚拟列表
<VirtualList
  items={items}
  itemHeight={50}
  height={600}
  renderItem={(item) => <div>{item.name}</div>}
/>

// 防抖输入
<DebouncedInput
  value={query}
  onChange={setQuery}
  debounceMs={500}
  placeholder="Search..."
/>

// 懒加载图片
<LazyImage
  src="/image.jpg"
  alt="Description"
  threshold={0.1}
/>
```

---

## 📚 API文档

### 监控API

#### `initPerformanceMonitoring()`

初始化Web Vitals监控。

```typescript
await initPerformanceMonitoring();
```

#### `exportPerformanceData()`

导出性能报告。

```typescript
const report = exportPerformanceData();
if (report) {
  console.log('Performance Score:', calculatePerformanceScore(report));
}
```

#### `performanceStore`

性能数据存储和订阅。

```typescript
import { performanceStore } from '@/lib/performance';

// 订阅性能报告
const unsubscribe = performanceStore.subscribe((report) => {
  console.log('Metrics:', report.metrics);
  console.log('Recommendations:', report.recommendations);
});

// 取消订阅
unsubscribe();
```

### 优化API

#### `lazyLoad()`

懒加载React组件。

```typescript
import { lazyLoad } from '@/lib/performance';

const Dashboard = lazyLoad(
  () => import('./Dashboard'),
  () => <div>Loading...</div>
);
```

#### `CacheManager`

带TTL的LRU缓存管理器。

```typescript
import { CacheManager } from '@/lib/performance';

const cache = new CacheManager({
  maxAge: 5 * 60 * 1000, // 5分钟
  maxSize: 100,
  strategy: 'lru',
});

cache.set('key', data);
const value = cache.get('key');
```

#### `useCachedData()`

带缓存的异步数据Hook。

```typescript
import { useCachedData } from '@/lib/performance';

const { data, loading, error, revalidate } = useCachedData(
  'api-key',
  () => fetch('/api/data').then(r => r.json()),
  { maxAge: 5000, maxSize: 50, strategy: 'lru' }
);
```

#### `useDebounce()`

防抖Hook。

```typescript
import { useDebounce } from '@/lib/performance';

const debouncedSearch = useDebounce((query) => {
  performSearch(query);
}, 300);
```

#### `useThrottle()`

节流Hook。

```typescript
import { useThrottle } from '@/lib/performance';

const throttledScroll = useThrottle((position) => {
  updateScrollPosition(position);
}, 100);
```

### React组件

#### `VirtualList`

高性能虚拟列表。

```typescript
import { VirtualList } from '@/lib/performance';

<VirtualList
  items={items}
  itemHeight={50}
  height={600}
  renderItem={(item, index) => (
    <div key={index}>{item.name}</div>
  )}
  overscan={5}
/>
```

**Props**:
- `items`: 数据数组
- `itemHeight`: 每项高度
- `height`: 容器高度
- `renderItem`: 渲染函数
- `overscan`: 额外渲染项数

#### `VirtualGrid`

高性能虚拟网格。

```typescript
import { VirtualGrid } from '@/lib/performance';

<VirtualGrid
  items={items}
  itemHeight={100}
  itemWidth={150}
  height={600}
  width={800}
  renderItem={(item) => <div>{item.name}</div>}
/>
```

#### `DebouncedInput`

防抖输入组件。

```typescript
import { DebouncedInput } from '@/lib/performance';

<DebouncedInput
  type="text"
  value={value}
  onChange={setValue}
  debounceMs={500}
  placeholder="Type..."
/>
```

#### `LazyImage`

懒加载图片组件。

```typescript
import { LazyImage } from '@/lib/performance';

<LazyImage
  src="/image.jpg"
  alt="Description"
  placeholder="data:image/svg+xml,..."
  threshold={0.1}
  className="w-full"
/>
```

#### `InfiniteScroll`

无限滚动组件。

```typescript
import { InfiniteScroll } from '@/lib/performance';

<InfiniteScroll
  hasMore={hasMore}
  onLoadMore={loadMore}
  threshold={0.1}
  loading={<div>Loading...</div>}
>
  {items.map(item => (
    <div key={item.id}>{item.name}</div>
  ))}
</InfiniteScroll>
```

---

## 🧪 测试

运行性能模块测试：

```bash
# 测试所有性能模块
npm run test:performance

# 测试监控系统
npx vitest run lib/performance/__tests__/monitor.test.ts

# 测试优化工具
npx vitest run lib/performance/__tests__/optimization.test.ts

# 查看覆盖率
npx vitest run lib/performance/ --coverage
```

---

## 📖 使用示例

### 示例1: 懒加载路由

```typescript
import { lazyLoad } from '@/lib/performance';
import { Suspense } from 'react';

const Dashboard = lazyLoad(() => import('./pages/Dashboard'));
const Settings = lazyLoad(() => import('./pages/Settings'));

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
      <Settings />
    </Suspense>
  );
}
```

### 示例2: 虚拟列表

```typescript
'use client';

import { useState, useMemo } from 'react';
import { VirtualList } from '@/lib/performance';

export default function CustomerList() {
  const [customers, setCustomers] = useState(() =>
    Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `Customer ${i}`,
      email: `customer${i}@example.com`,
    }))
  );

  return (
    <div className="h-screen">
      <VirtualList
        items={customers}
        itemHeight={60}
        height={window.innerHeight}
        renderItem={(customer) => (
          <div key={customer.id} className="p-4 border-b">
            <h3>{customer.name}</h3>
            <p>{customer.email}</p>
          </div>
        )}
      />
    </div>
  );
}
```

### 示例3: 性能监控

```typescript
'use client';

import { useState, useEffect } from 'react';
import { performanceStore, calculatePerformanceScore } from '@/lib/performance';

export default function PerformanceMonitor() {
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = performanceStore.subscribe((report) => {
      const performanceScore = calculatePerformanceScore(report);
      setScore(performanceScore);

      // 显示优化建议
      if (report.recommendations.length > 0) {
        console.log('优化建议:', report.recommendations);
      }
    });

    return unsubscribe;
  }, []);

  if (score === null) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded shadow">
      <h3>性能评分</h3>
      <p className={`text-2xl font-bold ${
        score >= 80 ? 'text-green-600' :
        score >= 60 ? 'text-yellow-600' :
        'text-red-600'
      }`}>
        {score}/100
      </p>
    </div>
  );
}
```

---

## 🔧 配置

### Next.js配置

将`next.config.optimized.mjs`应用到你的项目：

```bash
# 备份原配置
npm run perf:backup-config

# 应用优化配置
npm run perf:apply-config
```

### TypeScript配置

确保`tsconfig.json`包含路径别名：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## 📊 性能指标

### Web Vitals阈值

| 指标 | 良好 | 需改进 | 差 |
|------|------|--------|-----|
| LCP | < 2.5s | < 4s | ≥ 4s |
| FID | < 100ms | < 300ms | ≥ 300ms |
| CLS | < 0.1 | < 0.25 | ≥ 0.25 |
| FCP | < 1.8s | < 3s | ≥ 3s |
| TTFB | < 800ms | < 1.8s | ≥ 1.8s |

### 性能评分

- **90-100**: 优秀 ⭐⭐⭐⭐⭐
- **75-89**: 良好 ⭐⭐⭐⭐
- **60-74**: 及格 ⭐⭐⭐
- **< 60**: 需要改进 ⭐⭐

---

## 🐛 故障排除

### 问题: 找不到模块

**解决方案**: 确保已配置TypeScript路径别名：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 问题: 性能监控未工作

**解决方案**: 确保在客户端组件中初始化：

```typescript
'use client';

import { initPerformanceMonitoring } from '@/lib/performance';

useEffect(() => {
  initPerformanceMonitoring();
}, []);
```

### 问题: 虚拟列表不滚动

**解决方案**: 确保容器有固定高度：

```typescript
<VirtualList
  items={items}
  itemHeight={50}
  height={600} // 必须是数字
  renderItem={renderItem}
/>
```

---

## 📚 相关文档

- [性能优化实施报告](../../docs/111-性能优化实施报告.md)
- [性能优化快速开始](../../docs/112-性能优化快速开始.md)
- [Next.js性能优化](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)

---

## 🤝 贡献

欢迎贡献！请遵循以下步骤：

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

---

## 📄 许可证

MIT License - 详见项目根目录的LICENSE文件

---

**维护者**: YYC³ 开发团队
**创建日期**: 2026-01-05
**版本**: 2.0.0
