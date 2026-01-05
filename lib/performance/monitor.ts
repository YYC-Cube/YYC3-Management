/**
 * @fileoverview monitor.ts
 * @description 性能监控和测量工具
 * @version 1.0.0
 * @created 2026-01-05
 *
 * 功能：
 * - Web Vitals监控（LCP, FID, CLS, FCP, TTFB）
 * - 自定义性能指标
 * - 错误追踪
 * - 性能数据上报
 */

import { Metric } from 'web-vitals';

// ==========================================
// 类型定义
// ==========================================

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  navigationType?: string;
}

export interface PerformanceReport {
  metrics: PerformanceMetric[];
  deviceInfo: DeviceInfo;
  pageLoadTime: number;
  resourceTiming: ResourceTimingData[];
  recommendations: string[];
}

export interface DeviceInfo {
  userAgent: string;
  deviceMemory: number | undefined;
  hardwareConcurrency: number | undefined;
  connectionType: string | undefined;
  screenResolution: string;
  viewportSize: string;
}

export interface ResourceTimingData {
  name: string;
  duration: number;
  size: number;
  type: string;
}

// ==========================================
// 性能阈值配置
// ==========================================

const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint (ms)
  FID: { good: 100, poor: 300 }, // First Input Delay (ms)
  CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint (ms)
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte (ms)
  LCP_TARGET: 1200, // 优化的目标LCP (ms)
  INTERACTIVE_TARGET: 3000, // 可交互目标 (ms)
};

// ==========================================
// 性能评分计算
// ==========================================

function getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = PERFORMANCE_THRESHOLDS[metricName as keyof typeof PERFORMANCE_THRESHOLDS];

  if (!threshold) {
    return 'good';
  }

  if (typeof threshold === 'object' && 'good' in threshold) {
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  return 'good';
}

// ==========================================
// 设备信息收集
// ==========================================

function collectDeviceInfo(): DeviceInfo {
  const navigator = window.navigator as any;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  return {
    userAgent: navigator.userAgent,
    deviceMemory: navigator.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
    connectionType: connection?.effectiveType,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    viewportSize: `${window.innerWidth}x${window.innerHeight}`,
  };
}

// ==========================================
// 资源时序数据收集
// ==========================================

function collectResourceTiming(): ResourceTimingData[] {
  if (!window.performance || !window.performance.getEntriesByType) {
    return [];
  }

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

  return resources
    .filter((resource) => resource.duration > 0)
    .map((resource) => ({
      name: resource.name,
      duration: resource.duration,
      size: resource.transferSize,
      type: getResourceType(resource.name),
    }))
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 20); // 只返回最慢的20个资源
}

function getResourceType(url: string): string {
  if (url.endsWith('.js')) return 'script';
  if (url.endsWith('.css')) return 'stylesheet';
  if (url.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) return 'image';
  if (url.match(/\.(woff|woff2|ttf|otf)$/i)) return 'font';
  return 'other';
}

// ==========================================
// 性能指标存储
// ==========================================

class PerformanceStore {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private listeners: Set<(report: PerformanceReport) => void> = new Set();

  setMetric(metric: Metric) {
    const performanceMetric: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      rating: getRating(metric.name, metric.value),
      timestamp: Date.now(),
      navigationType: metric.navigationType,
    };

    this.metrics.set(metric.name, performanceMetric);

    // 当所有核心指标都收集完成后，生成报告
    if (this.hasAllCoreMetrics()) {
      this.generateReport();
    }
  }

  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name);
  }

  getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  hasAllCoreMetrics(): boolean {
    const coreMetrics = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'];
    return coreMetrics.every((metric) => this.metrics.has(metric));
  }

  subscribe(listener: (report: PerformanceReport) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  generateReport(): PerformanceReport {
    const metrics = this.getAllMetrics();
    const deviceInfo = collectDeviceInfo();
    const resourceTiming = collectResourceTiming();

    // 计算页面加载时间
    const pageLoadTime = this.calculatePageLoadTime();

    // 生成优化建议
    const recommendations = this.generateRecommendations(metrics, resourceTiming);

    const report: PerformanceReport = {
      metrics,
      deviceInfo,
      pageLoadTime,
      resourceTiming,
      recommendations,
    };

    // 通知所有订阅者
    this.listeners.forEach((listener) => {
      try {
        listener(report);
      } catch (error) {
        console.error('Error notifying performance listener:', error);
      }
    });

    return report;
  }

  private calculatePageLoadTime(): number {
    if (!window.performance || !window.performance.timing) {
      return 0;
    }

    const timing = window.performance.timing;
    return timing.loadEventEnd - timing.navigationStart;
  }

  private generateRecommendations(
    metrics: PerformanceMetric[],
    resourceTiming: ResourceTimingData[]
  ): string[] {
    const recommendations: string[] = [];

    // 分析LCP
    const lcp = metrics.find((m) => m.name === 'LCP');
    if (lcp && lcp.rating !== 'good') {
      recommendations.push('LCP较慢：考虑优化最大内容元素（图片、视频等）的加载');
    }

    // 分析FID
    const fid = metrics.find((m) => m.name === 'FID');
    if (fid && fid.rating !== 'good') {
      recommendations.push('FID较慢：减少JavaScript执行时间，拆分长任务');
    }

    // 分析CLS
    const cls = metrics.find((m) => m.name === 'CLS');
    if (cls && cls.rating !== 'good') {
      recommendations.push('CLS较高：为图片和视频预留空间，避免布局偏移');
    }

    // 分析FCP
    const fcp = metrics.find((m) => m.name === 'FCP');
    if (fcp && fcp.rating !== 'good') {
      recommendations.push('FCP较慢：减少渲染阻塞资源，优化关键CSS');
    }

    // 分析TTFB
    const ttfb = metrics.find((m) => m.name === 'TTFB');
    if (ttfb && ttfb.rating !== 'good') {
      recommendations.push('TTFB较慢：优化服务器响应时间，使用CDN');
    }

    // 分析资源加载
    const slowResources = resourceTiming.filter((r) => r.duration > 1000);
    if (slowResources.length > 0) {
      recommendations.push(`发现${slowResources.length}个慢资源（>1秒），考虑懒加载或优化`);
    }

    // 分析大资源
    const largeResources = resourceTiming.filter((r) => r.size > 500000);
    if (largeResources.length > 0) {
      recommendations.push(`发现${largeResources.length}个大资源（>500KB），考虑压缩或分割`);
    }

    return recommendations;
  }
}

// ==========================================
// 导出单例
// ==========================================

export const performanceStore = new PerformanceStore();

// ==========================================
// Web Vitals 上报函数
// ==========================================

export function reportWebVitals(metric: Metric) {
  performanceStore.setMetric(metric);

  // 开发环境打印到控制台
  if (process.env.NODE_ENV === 'development') {
    console.log('[Performance]', {
      name: metric.name,
      value: metric.value,
      rating: getRating(metric.name, metric.value),
      delta: metric.delta,
      navigationType: metric.navigationType,
    });
  }

  // 生产环境发送到分析服务（示例）
  if (process.env.NODE_ENV === 'production') {
    // sendToAnalytics(metric);
    // TODO: 实现实际的上报逻辑
  }
}

// ==========================================
// 自定义性能指标
// ==========================================

export function measureCustomMetric(name: string, measureFn: () => void) {
  if (!window.performance || !window.performance.mark) {
    measureFn();
    return;
  }

  const startMark = `${name}-start`;
  const endMark = `${name}-end`;

  performance.mark(startMark);
  measureFn();
  performance.mark(endMark);

  performance.measure(name, startMark, endMark);

  const measure = performance.getEntriesByName(name)[0] as PerformanceMeasure;
  const metric: PerformanceMetric = {
    name,
    value: measure.duration,
    rating: measure.duration < 100 ? 'good' : 'needs-improvement',
    timestamp: Date.now(),
  };

  (performanceStore as any).setMetric(metric);

  // 清理marks
  performance.clearMarks(startMark);
  performance.clearMarks(endMark);
}

// ==========================================
// 性能数据导出
// ==========================================

export function exportPerformanceData(): PerformanceReport | null {
  if (!performanceStore.hasAllCoreMetrics()) {
    console.warn('Not all core metrics collected yet');
    return null;
  }

  return performanceStore.generateReport();
}

// ==========================================
// 性能评分计算
// ==========================================

export function calculatePerformanceScore(report: PerformanceReport): number {
  const metricWeights = {
    LCP: 0.25,
    FID: 0.25,
    CLS: 0.15,
    FCP: 0.15,
    TTFB: 0.20,
  };

  let totalScore = 0;

  report.metrics.forEach((metric) => {
    const weight = metricWeights[metric.name as keyof typeof metricWeights] || 0;
    let score = 0;

    if (metric.rating === 'good') {
      score = 100;
    } else if (metric.rating === 'needs-improvement') {
      score = 50;
    } else {
      score = 0;
    }

    totalScore += score * weight;
  });

  return Math.round(totalScore);
}

// ==========================================
// 性能监控初始化
// ==========================================

export async function initPerformanceMonitoring() {
  // 动态导入web-vitals（减小初始包大小）
  try {
    const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');

    // 监控核心Web Vitals
    getCLS(reportWebVitals);
    getFID(reportWebVitals);
    getFCP(reportWebVitals);
    getLCP(reportWebVitals);
    getTTFB(reportWebVitals);

    console.log('[Performance] Monitoring initialized');
  } catch (error) {
    console.error('[Performance] Failed to initialize monitoring:', error);
  }
}
