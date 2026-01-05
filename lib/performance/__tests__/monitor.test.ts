/**
 * @fileoverview monitor.test.ts
 * @description 性能监控工具测试
 * @version 1.0.0
 * @created 2026-01-05
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  performanceStore,
  reportWebVitals,
  measureCustomMetric,
  exportPerformanceData,
  calculatePerformanceScore,
  initPerformanceMonitoring,
} from '../monitor';

// Mock web-vitals
vi.mock('web-vitals', () => ({
  getCLS: vi.fn((callback) => {
    callback({ name: 'CLS', value: 0.1, delta: 0.1 });
  }),
  getFID: vi.fn((callback) => {
    callback({ name: 'FID', value: 50, delta: 50 });
  }),
  getFCP: vi.fn((callback) => {
    callback({ name: 'FCP', value: 1500, delta: 1500 });
  }),
  getLCP: vi.fn((callback) => {
    callback({ name: 'LCP', value: 2000, delta: 2000 });
  }),
  getTTFB: vi.fn((callback) => {
    callback({ name: 'TTFB', value: 500, delta: 500 });
  }),
}));

describe('性能监控', () => {
  beforeEach(() => {
    // 清除现有指标
    (performanceStore as any).metrics.clear();
  });

  describe('reportWebVitals', () => {
    it('应该正确存储性能指标', () => {
      const metric = {
        name: 'LCP',
        value: 2000,
        delta: 2000,
        id: '1',
        navigationType: 'navigate',
      };

      reportWebVitals(metric);

      const stored = performanceStore.getMetric('LCP');
      expect(stored).toBeDefined();
      expect(stored?.value).toBe(2000);
      expect(stored?.rating).toBe('good');
    });

    it('应该正确评估性能评级', () => {
      // LCP良好
      reportWebVitals({
        name: 'LCP',
        value: 2000,
        delta: 2000,
        id: '1',
      } as any);
      expect(performanceStore.getMetric('LCP')?.rating).toBe('good');

      // LCP需要改进
      reportWebVitals({
        name: 'LCP',
        value: 3000,
        delta: 3000,
        id: '2',
      } as any);
      expect(performanceStore.getMetric('LCP')?.rating).toBe('needs-improvement');

      // LCP差
      reportWebVitals({
        name: 'LCP',
        value: 5000,
        delta: 5000,
        id: '3',
      } as any);
      expect(performanceStore.getMetric('LCP')?.rating).toBe('poor');
    });

    it('应该检测所有核心指标是否已收集', () => {
      expect(performanceStore.hasAllCoreMetrics()).toBe(false);

      const coreMetrics = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'];
      coreMetrics.forEach((name) => {
        reportWebVitals({
          name,
          value: 1000,
          delta: 1000,
          id: name,
        } as any);
      });

      expect(performanceStore.hasAllCoreMetrics()).toBe(true);
    });
  });

  describe('measureCustomMetric', () => {
    it('应该测量自定义指标', () => {
      const mockFn = vi.fn();

      measureCustomMetric('test-operation', mockFn);

      expect(mockFn).toHaveBeenCalled();
      const metric = performanceStore.getMetric('test-operation');
      expect(metric).toBeDefined();
      expect(metric?.value).toBeGreaterThanOrEqual(0);
    });

    it('应该评估自定义指标的性能', () => {
      const fastFn = () => {};
      measureCustomMetric('fast-operation', fastFn);

      const metric = performanceStore.getMetric('fast-operation');
      expect(metric?.rating).toBe('good');
    });
  });

  describe('exportPerformanceData', () => {
    it('应该在所有核心指标收集后导出报告', () => {
      const coreMetrics = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'];
      coreMetrics.forEach((name) => {
        reportWebVitals({
          name,
          value: 1000,
          delta: 1000,
          id: name,
        } as any);
      });

      const report = exportPerformanceData();

      expect(report).toBeDefined();
      expect(report?.metrics).toHaveLength(5);
      expect(report?.deviceInfo).toBeDefined();
      expect(report?.pageLoadTime).toBeGreaterThanOrEqual(0);
      expect(report?.recommendations).toBeInstanceOf(Array);
    });

    it('应该在核心指标未收集完成时返回null', () => {
      const report = exportPerformanceData();
      expect(report).toBeNull();
    });

    it('应该生成优化建议', () => {
      // 模拟较差的性能指标
      reportWebVitals({
        name: 'LCP',
        value: 5000,
        delta: 5000,
        id: '1',
      } as any);

      reportWebVitals({
        name: 'CLS',
        value: 0.3,
        delta: 0.3,
        id: '2',
      } as any);

      // 添加其他核心指标
      ['FID', 'FCP', 'TTFB'].forEach((name) => {
        reportWebVitals({
          name,
          value: 1000,
          delta: 1000,
          id: name,
        } as any);
      });

      const report = exportPerformanceData();
      expect(report?.recommendations.length).toBeGreaterThan(0);
      expect(report?.recommendations.some((r) => r.includes('LCP'))).toBe(true);
      expect(report?.recommendations.some((r) => r.includes('CLS'))).toBe(true);
    });
  });

  describe('calculatePerformanceScore', () => {
    it('应该正确计算性能分数', () => {
      const coreMetrics = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'];
      coreMetrics.forEach((name) => {
        reportWebVitals({
          name,
          value: 1000,
          delta: 1000,
          id: name,
        } as any);
      });

      const report = exportPerformanceData();
      expect(report).toBeDefined();

      const score = calculatePerformanceScore(report!);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('应该给予良好指标更高的分数', () => {
      // 所有指标良好
      const coreMetrics = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'];
      coreMetrics.forEach((name) => {
        reportWebVitals({
          name,
          value: 1000,
          delta: 1000,
          id: name,
        } as any);
      });

      const goodReport = exportPerformanceData();
      const goodScore = calculatePerformanceScore(goodReport!);

      // 清除并设置差指标
      (performanceStore as any).metrics.clear();

      coreMetrics.forEach((name) => {
        reportWebVitals({
          name,
          value: 10000,
          delta: 10000,
          id: name,
        } as any);
      });

      const poorReport = exportPerformanceData();
      const poorScore = calculatePerformanceScore(poorReport!);

      expect(goodScore).toBeGreaterThan(poorScore);
    });
  });

  describe('initPerformanceMonitoring', () => {
    it('应该初始化性能监控', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await initPerformanceMonitoring();

      expect(consoleSpy).toHaveBeenCalledWith('[Performance] Monitoring initialized');

      consoleSpy.mockRestore();
    });
  });

  describe('性能订阅', () => {
    it('应该正确通知订阅者', () => {
      const listener = vi.fn();
      performanceStore.subscribe(listener);

      // 添加所有核心指标
      const coreMetrics = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'];
      coreMetrics.forEach((name) => {
        reportWebVitals({
          name,
          value: 1000,
          delta: 1000,
          id: name,
        } as any);
      });

      expect(listener).toHaveBeenCalled();
      const report = listener.mock.calls[0][0];
      expect(report.metrics).toHaveLength(5);
    });

    it('应该允许取消订阅', () => {
      const listener = vi.fn();
      const unsubscribe = performanceStore.subscribe(listener);

      unsubscribe();

      // 添加所有核心指标
      const coreMetrics = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'];
      coreMetrics.forEach((name) => {
        reportWebVitals({
          name,
          value: 1000,
          delta: 1000,
          id: name,
        } as any);
      });

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('性能评级阈值', () => {
    it('应该正确应用LCP评级', () => {
      const testCases = [
        { value: 2000, expected: 'good' },
        { value: 3000, expected: 'needs-improvement' },
        { value: 5000, expected: 'poor' },
      ];

      testCases.forEach(({ value, expected }) => {
        reportWebVitals({
          name: 'LCP',
          value,
          delta: value,
          id: `lcp-${value}`,
        } as any);

        const metric = performanceStore.getMetric('LCP');
        expect(metric?.rating).toBe(expected);
      });
    });

    it('应该正确应用CLS评级', () => {
      const testCases = [
        { value: 0.05, expected: 'good' },
        { value: 0.15, expected: 'needs-improvement' },
        { value: 0.3, expected: 'poor' },
      ];

      testCases.forEach(({ value, expected }) => {
        reportWebVitals({
          name: 'CLS',
          value,
          delta: value,
          id: `cls-${value}`,
        } as any);

        const metric = performanceStore.getMetric('CLS');
        expect(metric?.rating).toBe(expected);
      });
    });
  });
});
