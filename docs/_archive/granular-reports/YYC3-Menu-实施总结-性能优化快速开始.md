# 性能优化快速开始指南

> **YYC³ 性能优化 - 快速上手**
> **版本**: 2.0.0

---

## 🚀 快速开始

### 1. 应用优化配置（5分钟）

```bash
# 备份原配置
cp next.config.mjs next.config.mjs.backup

# 应用优化配置
cp next.config.optimized.mjs next.config.mjs
```

### 2. 安装web-vitals依赖

```bash
npm install web-vitals
# 或
bun install web-vitals
```

### 3. 启用性能监控

在 `app/layout.tsx` 顶部添加：

```typescript
'use client';

import { useEffect } from 'react';
import { initPerformanceMonitoring } from '@/lib/performance/monitor';

export function PerformanceMonitor() {
  useEffect(() => {
    initPerformanceMonitoring();
  }, []);

  return null;
}
```

然后在RootLayout中添加：

```typescript
export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <PerformanceMonitor />
        {/* 其他内容 */}
        {children}
      </body>
    </html>
  );
}
```

---

## 📦 常用优化模式

### 模式1: 懒加载组件

```typescript
import { lazyLoad } from '@/lib/performance/optimization';

// 基本用法
const Dashboard = lazyLoad(() => import('./Dashboard'));

// 带加载状态
const Settings = lazyLoad(
  () => import('./Settings'),
  () => <div>Loading Settings...</div>
);

// 使用
function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}
```

### 模式2: 虚拟列表

```typescript
import { VirtualList } from '@/lib/performance/react-optimization';

function CustomerList({ customers }) {
  return (
    <VirtualList
      items={customers}
      itemHeight={60}
      height={600}
      renderItem={(customer) => (
        <div key={customer.id}>
          {customer.name}
        </div>
      )}
      overscan={5}
    />
  );
}
```

### 模式3: 防抖输入

```typescript
import { DebouncedInput } from '@/lib/performance/react-optimization';

function SearchForm() {
  const [query, setQuery] = useState('');

  const handleSearch = useCallback((value) => {
    // 执行搜索
    console.log('Searching:', value);
  }, []);

  return (
    <DebouncedInput
      type="text"
      value={query}
      onChange={setQuery}
      debounceMs={500}
      placeholder="Search..."
    />
  );
}
```

### 模式4: 数据缓存

```typescript
import { useCachedData } from '@/lib/performance/optimization';

function UserProfile({ userId }) {
  const { data, loading, error, revalidate } = useCachedData(
    `user-${userId}`,
    () => fetch(`/api/users/${userId}`).then(r => r.json()),
    {
      maxAge: 5 * 60 * 1000, // 5分钟
      maxSize: 50,
      strategy: 'lru',
    }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <button onClick={revalidate}>Refresh</button>
    </div>
  );
}
```

### 模式5: 懒加载图片

```typescript
import { LazyImage } from '@/lib/performance/react-optimization';

function Gallery({ images }) {
  return (
    <div>
      {images.map((img) => (
        <LazyImage
          key={img.id}
          src={img.url}
          alt={img.alt}
          placeholder="data:image/svg+xml,..."
          threshold={0.1}
          className="w-full h-auto"
        />
      ))}
    </div>
  );
}
```

### 模式6: 无限滚动

```typescript
import { InfiniteScroll } from '@/lib/performance/react-optimization';

function DataTable() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    const newItems = await fetch(`/api/items?page=${page + 1}`)
      .then(r => r.json());

    setItems([...items, ...newItems]);
    setPage(page + 1);

    if (newItems.length === 0) {
      setHasMore(false);
    }
  };

  return (
    <InfiniteScroll
      hasMore={hasMore}
      onLoadMore={loadMore}
      threshold={0.1}
      loading={<div>Loading more...</div>}
    >
      {items.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </InfiniteScroll>
  );
}
```

---

## 🔧 性能监控

### 查看性能数据

```typescript
'use client';

import { useState, useEffect } from 'react';
import { performanceStore, calculatePerformanceScore } from '@/lib/performance/monitor';

export function PerformanceDisplay() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const unsubscribe = performanceStore.subscribe((report) => {
      setMetrics(report);
    });

    return unsubscribe;
  }, []);

  if (!metrics) return null;

  const score = calculatePerformanceScore(metrics);

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h2>Performance Score: {score}/100</h2>
      <ul>
        {metrics.metrics.map((metric) => (
          <li key={metric.name}>
            {metric.name}: {metric.value.toFixed(2)} ({metric.rating})
          </li>
        ))}
      </ul>

      {metrics.recommendations.length > 0 && (
        <div className="mt-4">
          <h3>Recommendations:</h3>
          <ul>
            {metrics.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### 自定义性能测量

```typescript
import { measureCustomMetric } from '@/lib/performance/monitor';

function processLargeData() {
  measureCustomMetric('data-processing', () => {
    // 你的代码
    const result = heavyComputation();
    return result;
  });
}
```

---

## 🧪 测试

### 运行性能测试

```bash
# 测试所有性能模块
npm run test:performance

# 或使用vitest直接运行
npx vitest run lib/performance/

# 查看测试覆盖率
npx vitest run lib/performance/ --coverage
```

### 性能基准测试

```bash
# 构建并分析
npm run build

# 查看构建输出
# - 页面数量
# - 静态资源大小
# - JavaScript/CSS大小
```

---

## 📊 性能检查清单

### 使用此清单验证优化效果

```typescript
import { PERFORMANCE_CHECKLIST } from '@/lib/performance/optimization';

// 你的检查清单状态
const myChecklist = {
  ...PERFORMANCE_CHECKLIST,
  codeSplitting: { ...PERFORMANCE_CHECKLIST.codeSplitting, checked: true },
  lazyLoading: { ...PERFORMANCE_CHECKLIST.lazyLoading, checked: true },
  // ...
};

// 显示进度
const progress = Object.values(myChecklist).filter(item => item.checked).length;
const total = Object.values(myChecklist).length;
const percentage = (progress / total) * 100;

console.log(`Performance Optimization: ${percentage}%`);
```

---

## ⚡ 常见问题

### Q: 如何解决"Cannot find module '@/lib/performance/xxx'"错误？

**A**: 确保你的`tsconfig.json`包含路径别名：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Q: 性能监控影响应用性能吗？

**A**: 影响非常小。监控代码：
- 只在客户端运行
- 使用异步API
- 不阻塞主线程
- 生产环境可以禁用详细日志

### Q: 虚拟列表适合什么场景？

**A**: 适合以下场景：
- 渲染100+项的列表
- 每项高度固定
- 需要平滑滚动
- 移动端应用

**不适合**：
- 少量项（<50）
- 动态高度（需要额外配置）
- 需要所有项在DOM中

### Q: 如何调试性能问题？

**A**:
1. 使用React DevTools Profiler
2. 检查Performance Monitor输出
3. 使用Lighthouse审计
4. 查看网络瀑布图
5. 分析bundle大小

---

## 🎯 下一步

1. **应用基本优化**
   - 启用优化配置
   - 集成性能监控
   - 替换最慢的页面

2. **渐进式优化**
   - 从最常用的页面开始
   - 逐步实现虚拟列表
   - 优化图片加载

3. **持续改进**
   - 定期查看性能数据
   - 收集用户反馈
   - A/B测试优化策略

---

## 📚 相关文档

- [完整实施报告](./111-性能优化实施报告.md)
- [性能监控API](../lib/performance/monitor.ts)
- [优化工具API](../lib/performance/optimization.ts)
- [React优化组件](../lib/performance/react-optimization.tsx)

---

**最后更新**: 2026-01-05
**版本**: 2.0.0
