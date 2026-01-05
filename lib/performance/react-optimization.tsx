/**
 * @fileoverview react-optimization.tsx
 * @description React组件性能优化工具
 * @version 1.0.0
 * @created 2026-01-05
 *
 * 功能：
 * - 虚拟列表组件
 * - Memo优化组件
 * - 防抖输入组件
 * - 虚拟化列表Hook
 * - 性能追踪组件
 */

'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
  forwardRef,
} from 'react';
import { calculateVisibleRange } from './optimization';

// ==========================================
// 1. 虚拟列表组件
// ==========================================

export interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

export function VirtualList<T>({
  items,
  itemHeight,
  height,
  renderItem,
  overscan = 3,
  className = '',
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { start, end } = useMemo(() => {
    return calculateVisibleRange(scrollTop, height, itemHeight, items.length, overscan);
  }, [scrollTop, height, itemHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(start, end);
  }, [items, start, end]);

  const totalHeight = useMemo(() => {
    return items.length * itemHeight;
  }, [items.length, itemHeight]);

  const offsetY = useMemo(() => {
    return start * itemHeight;
  }, [start, itemHeight]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={start + index} style={{ height: itemHeight }}>
              {renderItem(item, start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. Memo化组件包装器
// ==========================================

export interface OptimizedComponentProps<P> extends P {
  __performance_key?: string;
}

/**
 * 高性能Memo组件
 */
export function createOptimizedComponent<P extends object>(
  Component: React.ComponentType<P>,
  arePropsEqual?: (prevProps: P, nextProps: P) => boolean
) {
  const MemoizedComponent = memo(Component, arePropsEqual);

  return forwardRef<any, OptimizedComponentProps<P>>((props, ref) => {
    return <MemoizedComponent {...props} ref={ref} />;
  }) as React.ComponentType<OptimizedizedComponentProps<P>>;
}

// ==========================================
// 3. 防抖输入组件
// ==========================================

export interface DebouncedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string | number;
  onChange: (value: string) => void;
  debounceMs?: number;
}

export const DebouncedInput = memo<DebouncedInputProps>(
  ({ value, onChange, debounceMs = 300, ...inputProps }) => {
    const [localValue, setLocalValue] = useState(value.toString());
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
      setLocalValue(value.toString());
    }, [value]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          onChange(newValue);
        }, debounceMs);
      },
      [onChange, debounceMs]
    );

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return <input {...inputProps} value={localValue} onChange={handleChange} />;
  }
);

DebouncedInput.displayName = 'DebouncedInput';

// ==========================================
// 4. 虚拟化Grid组件
// ==========================================

export interface VirtualGridProps<T> {
  items: T[];
  itemHeight: number;
  itemWidth: number;
  height: number;
  width: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

export function VirtualGrid<T>({
  items,
  itemHeight,
  itemWidth,
  height,
  width,
  renderItem,
  overscan = 2,
  className = '',
}: VirtualGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const columnsCount = useMemo(() => {
    return Math.floor(width / itemWidth);
  }, [width, itemWidth]);

  const rowCount = useMemo(() => {
    return Math.ceil(items.length / columnsCount);
  }, [items.length, columnsCount]);

  const { start: startRow, end: endRow } = useMemo(() => {
    return calculateVisibleRange(scrollTop, height, itemHeight, rowCount, overscan);
  }, [scrollTop, height, itemHeight, rowCount, overscan]);

  const visibleItems = useMemo(() => {
    const startIndex = startRow * columnsCount;
    const endIndex = endRow * columnsCount;
    return items.slice(startIndex, endIndex);
  }, [items, startRow, endRow, columnsCount]);

  const totalHeight = useMemo(() => {
    return rowCount * itemHeight;
  }, [rowCount, itemHeight]);

  const offsetY = useMemo(() => {
    return startRow * itemHeight;
  }, [startRow, itemHeight]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height, width }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {Array.from({ length: endRow - startRow }).map((_, rowIndex) => (
            <div key={startRow + rowIndex} className="flex" style={{ height: itemHeight }}>
              {Array.from({ length: columnsCount }).map((_, colIndex) => {
                const itemIndex = (startRow + rowIndex) * columnsCount + colIndex;
                const item = visibleItems[itemIndex - startRow * columnsCount];
                if (!item) return <div key={colIndex} style={{ width: itemWidth }} />;
                return (
                  <div key={colIndex} style={{ width: itemWidth }}>
                    {renderItem(item, itemIndex)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. 性能追踪组件
// ==========================================

export interface PerformanceTrackerProps {
  name: string;
  children: React.ReactNode;
  logRerenders?: boolean;
  logRenderTime?: boolean;
}

export const PerformanceTracker: React.FC<PerformanceTrackerProps> = memo(
  ({ name, children, logRerenders = true, logRenderTime = true }) => {
    const renderCount = useRef(0);
    const renderStartTime = useRef<number>(0);

    if (logRenderTime) {
      renderStartTime.current = performance.now();
    }

    useEffect(() => {
      renderCount.current += 1;

      if (logRerenders) {
        console.log(`[Performance Tracker] ${name} rendered ${renderCount.current} times`);

        if (logRenderTime) {
          const renderTime = performance.now() - renderStartTime.current;
          console.log(`[Performance Tracker] ${name} render time: ${renderTime.toFixed(2)}ms`);
        }
      }
    });

    return <>{children}</>;
  }
);

PerformanceTracker.displayName = 'PerformanceTracker';

// ==========================================
// 6. 懒加载图片组件
// ==========================================

export interface LazyImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  placeholder?: string;
  threshold?: number;
  rootMargin?: string;
}

export const LazyImage = memo<LazyImageProps>(
  ({
    src,
    alt,
    placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3C/svg%3E',
    threshold = 0.1,
    rootMargin = '50px',
    ...imgProps
  }) => {
    const [imageSrc, setImageSrc] = useState(placeholder);
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        },
        { threshold, rootMargin }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => {
        observer.disconnect();
      };
    }, [src, threshold, rootMargin]);

    const handleLoad = useCallback(() => {
      setIsLoaded(true);
    }, []);

    return (
      <img
        ref={imgRef}
        {...imgProps}
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        style={{
          opacity: isLoaded ? 1 : 0.5,
          transition: 'opacity 0.3s ease-in-out',
          ...imgProps.style,
        }}
      />
    );
  }
);

LazyImage.displayName = 'LazyImage';

// ==========================================
// 7. Infinite Scroll组件
// ==========================================

export interface InfiniteScrollProps {
  children: React.ReactNode;
  hasMore: boolean;
  onLoadMore: () => void | Promise<void>;
  threshold?: number;
  rootMargin?: string;
  loading?: React.ReactNode;
  className?: string;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = memo(
  ({
    children,
    hasMore,
    onLoadMore,
    threshold = 0.1,
    rootMargin = '200px',
    loading = <div className="text-center py-4">加载中...</div>,
    className = '',
  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const observerRef = useRef<HTMLDivElement>(null);

    const handleLoadMore = useCallback(async () => {
      if (isLoading || !hasMore) return;

      setIsLoading(true);
      try {
        await onLoadMore();
      } finally {
        setIsLoading(false);
      }
    }, [isLoading, hasMore, onLoadMore]);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && hasMore && !isLoading) {
            handleLoadMore();
          }
        },
        { threshold, rootMargin }
      );

      if (observerRef.current) {
        observer.observe(observerRef.current);
      }

      return () => {
        observer.disconnect();
      };
    }, [hasMore, isLoading, handleLoadMore, threshold, rootMargin]);

    return (
      <div className={className}>
        {children}
        {hasMore && isLoading && loading}
        <div ref={observerRef} style={{ height: '1px' }} />
      </div>
    );
  }
);

InfiniteScroll.displayName = 'InfiniteScroll';

// ==========================================
// 8. 优化条件渲染Hook
// ==========================================

export function useConditionalRender<T>(
  condition: boolean,
  Component: React.ComponentType<T>,
  props: T
): React.ReactNode | null {
  return useMemo(() => {
    if (!condition) return null;
    return <Component {...props} />;
  }, [condition, Component, props]);
}

// ==========================================
// 9. 窗口Resize优化Hook
// ==========================================

export function useWindowSize(debounceMs: number = 200) {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, debounceMs);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [debounceMs]);

  return size;
}

// ==========================================
// 10. 批处理更新Hook
// ==========================================

export function useBatchedUpdates<T>(updater: (updates: T[]) => void, batchSize: number = 10) {
  const [batch, setBatch] = useState<T[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const addToBatch = useCallback((item: T) => {
    setBatch((prev) => {
      const newBatch = [...prev, item];

      if (newBatch.length >= batchSize) {
        timeoutRef.current = setTimeout(() => {
          updater(newBatch);
          setBatch([]);
        }, 50);
      }

      return newBatch;
    });
  }, [updater, batchSize]);

  const flushBatch = useCallback(() => {
    if (batch.length > 0) {
      updater(batch);
      setBatch([]);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [batch, updater]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { addToBatch, flushBatch, batch };
}
