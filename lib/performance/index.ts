/**
 * @fileoverview index.ts
 * @description YYC³ 性能优化模块统一导出
 * @version 2.0.0
 * @created 2026-01-05
 *
 * 此文件提供了性能优化模块的统一入口点
 * 可以从此文件导入所有性能相关的功能
 */

// ==========================================
// 性能监控
// ==========================================

export {
  reportWebVitals,
  measureCustomMetric,
  exportPerformanceData,
  calculatePerformanceScore,
  initPerformanceMonitoring,
  performanceStore,
} from './monitor';

export type {
  PerformanceMetric,
  PerformanceReport,
  DeviceInfo,
  ResourceTimingData,
} from './monitor';

// ==========================================
// 性能优化工具
// ==========================================

export {
  lazyLoad,
  lazyLoadWithPreload,
  useLazyLoad,
  CacheManager,
  useCachedData,
  useDebounce,
  useThrottle,
  preloadResource,
  preloadImage,
  preloadScript,
  dnsPrefetch,
  preconnect,
  useBatchUpdate,
  calculateVisibleRange,
  generateSrcSet,
  calculateOptimalSize,
  PERFORMANCE_CHECKLIST,
} from './optimization';

export type {
  LazyLoadOptions,
  CacheConfig,
} from './optimization';

// ==========================================
// React优化组件
// ==========================================

export {
  VirtualList,
  VirtualGrid,
  DebouncedInput,
  LazyImage,
  InfiniteScroll,
  PerformanceTracker,
  useConditionalRender,
  useWindowSize,
  useBatchedUpdates,
} from './react-optimization';

export type {
  VirtualListProps,
  VirtualGridProps,
  DebouncedInputProps,
  LazyImageProps,
  InfiniteScrollProps,
  PerformanceTrackerProps,
} from './react-optimization';

// ==========================================
// 便捷导出 - 常用组合
// ==========================================

/**
 * 性能监控和优化工具套件
 */
export const PerformanceToolkit = {
  // 监控
  init: initPerformanceMonitoring,
  export: exportPerformanceData,
  score: calculatePerformanceScore,

  // 优化
  lazy: lazyLoad,
  cache: CacheManager,
  debounce: useDebounce,
  throttle: useThrottle,

  // React组件
  VirtualList,
  VirtualGrid,
  DebouncedInput,
  LazyImage,
  InfiniteScroll,
};

/**
 * 默认导出 - 性能工具套件
 */
export default PerformanceToolkit;

// ==========================================
// 开发者工具
// ==========================================

if (process.env.NODE_ENV === 'development') {
  console.log(
    '[YYC³ Performance]',
    '性能优化模块已加载',
    '\n- 性能监控: initPerformanceMonitoring()',
    '\n- 懒加载: lazyLoad(() => import(...))',
    '\n- 虚拟列表: <VirtualList />',
    '\n- 缓存Hook: useCachedData()',
    '\n\n文档: /docs/112-性能优化快速开始.md'
  );
}
