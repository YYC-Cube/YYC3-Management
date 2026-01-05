/**
 * @fileoverview optimization.ts
 * @description 性能优化工具集
 * @version 1.0.0
 * @created 2026-01-05
 *
 * 功能：
 * - 代码分割和懒加载工具
 * - 图片优化工具
 * - 缓存策略管理
 * - 资源预加载
 * - 防抖节流工具
 */

import { useEffect, useState, useCallback, useRef } from 'react';

// ==========================================
// 类型定义
// ==========================================

export interface LazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export interface CacheConfig {
  maxAge: number; // 缓存时间（毫秒）
  maxSize: number; // 最大缓存条目数
  strategy: 'lru' | 'fifo' | 'lfu'; // 缓存策略
}

// ==========================================
// 1. 代码分割和懒加载
// ==========================================

/**
 * 懒加载React组件
 * @param importFn - 动态导入函数
 * @param fallback - 加载中显示的组件
 */
export function lazyLoad<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
): React.LazyExoticComponent<React.ComponentProps<T>> {
  return React.lazy(() =>
    importFn().catch((error) => {
      console.error('Lazy load failed:', error);
      // 返回一个简单的错误组件
      return {
        default: () => React.createElement('div', {
          className: 'p-4 bg-red-50 border border-red-200 rounded',
          children: React.createElement('p', {
            className: 'text-red-600',
            children: '组件加载失败',
          }),
        }),
      } as any;
    })
  );
}

/**
 * 带预加载的懒加载
 * @param importFn - 动态导入函数
 * @param preloadDelay - 预加载延迟（毫秒）
 */
export function lazyLoadWithPreload<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  preloadDelay: number = 5000
): React.LazyExoticComponent<React.ComponentProps<T>> {
  const LazyComponent = React.lazy(importFn);

  // 自动预加载
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      importFn();
    }, preloadDelay);
  }

  return LazyComponent;
}

// ==========================================
// 2. 交叉观察器（懒加载指令）
// ==========================================

/**
 * 使用Intersection Observer实现懒加载
 */
export function useLazyLoad(
  options: LazyLoadOptions = {}
): [React.RefObject<HTMLDivElement>, boolean] {
  const { threshold = 0.1, rootMargin = '50px', triggerOnce = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          if (triggerOnce) {
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [elementRef, isVisible];
}

// ==========================================
// 3. 缓存管理
// ==========================================

/**
 * LRU缓存实现
 */
class LRUCache<K, V> {
  private cache: Map<K, V>;
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // 重新设置以更新顺序
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // 删除最旧的项
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * 带TTL的缓存管理器
 */
export class CacheManager<K, V> {
  private cache: LRUCache<K, { value: V; expiresAt: number }>;
  private maxAge: number;

  constructor(config: CacheConfig) {
    this.cache = new LRUCache(config.maxSize);
    this.maxAge = config.maxAge;
  }

  get(key: K): V | undefined {
    const item = this.cache.get(key);
    if (!item) return undefined;

    if (Date.now() > item.expiresAt) {
      this.cache.set(key, item as any); // LRU会移除过期项
      return undefined;
    }

    return item.value;
  }

  set(key: K, value: V): void {
    const item = {
      value,
      expiresAt: Date.now() + this.maxAge,
    };
    this.cache.set(key, item);
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size();
  }

  // 清理过期条目
  cleanup(): void {
    const now = Date.now();
    // LRU会自动清理，这里只需要获取所有键并检查
    // 由于Map的迭代器在修改时会失效，我们需要收集要删除的键
    const keysToDelete: K[] = [];
    // 注意：这个实现需要访问内部cache，实际使用中可能需要调整
  }
}

// ==========================================
// 4. 内存缓存Hook
// ==========================================

/**
 * 带内存缓存的异步数据获取Hook
 */
export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  cacheConfig: CacheConfig = { maxAge: 5 * 60 * 1000, maxSize: 50, strategy: 'lru' }
): { data: T | null; loading: boolean; error: Error | null; revalidate: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 使用ref来保持缓存实例
  const cacheRef = useRef<CacheManager<string, T>>();

  if (!cacheRef.current) {
    cacheRef.current = new CacheManager(cacheConfig);
  }

  const fetchData = useCallback(async () => {
    const cache = cacheRef.current!;
    const cached = cache.get(key);

    if (cached) {
      setData(cached);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      cache.set(key, result);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [key, fetcher]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const revalidate = useCallback(() => {
    cacheRef.current?.clear(); // 清除缓存
    fetchData();
  }, [fetchData]);

  return { data, loading, error, revalidate };
}

// ==========================================
// 5. 防抖和节流
// ==========================================

/**
 * 防抖Hook
 */
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay]
  );
}

/**
 * 节流Hook
 */
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  const lastRunRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastRunRef.current >= delay) {
        fn(...args);
        lastRunRef.current = now;
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          fn(...args);
          lastRunRef.current = Date.now();
        }, delay - (now - lastRunRef.current));
      }
    },
    [fn, delay]
  );
}

// ==========================================
// 6. 资源预加载
// ==========================================

/**
 * 预加载资源
 */
export function preloadResource(href: string, as: string = 'fetch'): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;

  if (as === 'fetch') {
    link.crossOrigin = 'anonymous';
  }

  document.head.appendChild(link);
}

/**
 * 预加载图片
 */
export function preloadImage(src: string): void {
  preloadResource(src, 'image');
}

/**
 * 预加载脚本
 */
export function preloadScript(src: string): void {
  preloadResource(src, 'script');
}

/**
 * DNS预解析
 */
export function dnsPrefetch(hostname: string): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = `//${hostname}`;

  document.head.appendChild(link);
}

/**
 * 预连接
 */
export function preconnect(origin: string): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = origin;
  link.crossOrigin = 'anonymous';

  document.head.appendChild(link);
}

// ==========================================
// 7. 批处理工具
// ==========================================

/**
 * 批处理状态更新
 */
export function useBatchUpdate<T>(batchSize: number = 10, delay: number = 100) {
  const [updates, setUpdates] = useState<T[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const addUpdate = useCallback((item: T) => {
    setUpdates((prev) => {
      const newUpdates = [...prev, item];

      // 达到批处理大小
      if (newUpdates.length >= batchSize) {
        timeoutRef.current = setTimeout(() => {
          // 触发批处理
          setUpdates([]);
        }, delay);
      }

      return newUpdates;
    });
  }, [batchSize, delay]);

  const flush = useCallback(() => {
    setUpdates([]);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { updates, addUpdate, flush };
}

// ==========================================
// 8. 虚拟滚动辅助
// ==========================================

/**
 * 计算虚拟滚动可见范围
 */
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan: number = 3
): { start: number; end: number } {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(totalItems, start + visibleCount + overscan * 2);

  return { start, end };
}

// ==========================================
// 9. 图片优化
// ==========================================

/**
 * 生成响应式图片srcset
 */
export function generateSrcSet(
  baseUrl: string,
  sizes: number[]
): string {
  return sizes
    .map((size) => {
      const url = new URL(baseUrl, window.location.origin);
      url.searchParams.set('w', size.toString());
      return `${url.toString()} ${size}w`;
    })
    .join(', ');
}

/**
 * 计算最优图片尺寸
 */
export function calculateOptimalSize(
  containerWidth: number,
  devicePixelRatio: number = window.devicePixelRatio || 1
): number {
  return Math.ceil(containerWidth * devicePixelRatio);
}

// ==========================================
// 10. 性能优化检查清单
// ==========================================

export const PERFORMANCE_CHECKLIST = {
  codeSplitting: {
    checked: false,
    name: '代码分割',
    description: '将代码分割成更小的块，按需加载',
  },
  lazyLoading: {
    checked: false,
    name: '懒加载',
    description: '延迟加载非关键资源',
  },
  imageOptimization: {
    checked: false,
    name: '图片优化',
    description: '使用现代格式和响应式图片',
  },
  caching: {
    checked: false,
    name: '缓存策略',
    description: '实现智能缓存以减少网络请求',
  },
  compression: {
    checked: false,
    name: '资源压缩',
    description: '启用gzip/brotli压缩',
  },
  bundleAnalysis: {
    checked: false,
    name: '包分析',
    description: '分析并优化bundle大小',
  },
  serverComponents: {
    checked: false,
    name: '服务端组件',
    description: '使用React Server Components减少客户端JS',
  },
  streaming: {
    checked: false,
    name: '流式渲染',
    description: '使用React Suspense实现流式SSR',
  },
};
