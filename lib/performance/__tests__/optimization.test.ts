/**
 * @fileoverview optimization.test.ts
 * @description 性能优化工具测试
 * @version 1.0.0
 * @created 2026-01-05
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  CacheManager,
  useDebounce,
  useThrottle,
  calculateVisibleRange,
  generateSrcSet,
  calculateOptimalSize,
  PERFORMANCE_CHECKLIST,
} from '../optimization';
import { renderHook, act } from '@testing-library/react';

describe('性能优化工具', () => {
  describe('CacheManager', () => {
    let cache: CacheManager<string, number>;

    beforeEach(() => {
      cache = new CacheManager({
        maxAge: 1000,
        maxSize: 3,
        strategy: 'lru',
      });
    });

    describe('基本功能', () => {
      it('应该能够设置和获取值', () => {
        cache.set('key1', 100);
        expect(cache.get('key1')).toBe(100);
      });

      it('应该返回undefined对于不存在的键', () => {
        expect(cache.get('nonexistent')).toBeUndefined();
      });

      it('应该能够检查键是否存在', () => {
        cache.set('key1', 100);
        expect(cache.has('key1')).toBe(true);
        expect(cache.has('key2')).toBe(false);
      });

      it('应该能够清除缓存', () => {
        cache.set('key1', 100);
        cache.set('key2', 200);
        cache.clear();

        expect(cache.get('key1')).toBeUndefined();
        expect(cache.get('key2')).toBeUndefined();
        expect(cache.size()).toBe(0);
      });

      it('应该能够返回缓存大小', () => {
        expect(cache.size()).toBe(0);

        cache.set('key1', 100);
        expect(cache.size()).toBe(1);

        cache.set('key2', 200);
        expect(cache.size()).toBe(2);
      });
    });

    describe('LRU策略', () => {
      it('应该在达到最大容量时删除最旧的条目', () => {
        cache.set('key1', 100);
        cache.set('key2', 200);
        cache.set('key3', 300);

        expect(cache.size()).toBe(3);

        // 添加第4个项应该删除key1
        cache.set('key4', 400);

        expect(cache.size()).toBe(3);
        expect(cache.has('key1')).toBe(false);
        expect(cache.has('key2')).toBe(true);
        expect(cache.has('key3')).toBe(true);
        expect(cache.has('key4')).toBe(true);
      });

      it('访问条目应该更新其优先级', () => {
        cache.set('key1', 100);
        cache.set('key2', 200);
        cache.set('key3', 300);

        // 访问key1
        cache.get('key1');

        // 添加新项应该删除key2（最旧的未访问项）
        cache.set('key4', 400);

        expect(cache.has('key1')).toBe(true);
        expect(cache.has('key2')).toBe(false);
        expect(cache.has('key3')).toBe(true);
        expect(cache.has('key4')).toBe(true);
      });
    });

    describe('TTL过期', () => {
      vi.useFakeTimers();

      it('应该在过期后返回undefined', () => {
        // Mock Date.now()来模拟时间流逝
        const realDateNow = Date.now;
        vi.spyOn(Date, 'now').mockReturnValue(1000);

        cache.set('key1', 100);

        // 立即获取应该成功
        expect(cache.get('key1')).toBe(100);

        // 模拟时间流逝1100ms（超过1000ms的TTL）
        Date.now.mockReturnValue(2100);

        // 现在应该过期
        expect(cache.get('key1')).toBeUndefined();

        // 恢复Date.now()
        Date.now.mockRestore();
      });

      it('应该允许更新过期的条目', () => {
        // Mock Date.now()
        const realDateNow = Date.now;
        vi.spyOn(Date, 'now').mockReturnValue(1000);

        cache.set('key1', 100);

        // 模拟时间流逝
        Date.now.mockReturnValue(2100);

        expect(cache.get('key1')).toBeUndefined();

        // 可以设置新值
        cache.set('key1', 200);
        expect(cache.get('key1')).toBe(200);

        // 恢复Date.now()
        Date.now.mockRestore();
      });

      vi.useRealTimers();
    });
  });

  describe('useDebounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('应该防抖函数调用', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useDebounce(callback, 300));

      result.current('test1');
      result.current('test2');
      result.current('test3');

      expect(callback).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('test3');
    });

    it('应该取消之前的调用', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useDebounce(callback, 300));

      result.current('test1');

      act(() => {
        vi.advanceTimersByTime(200);
      });

      result.current('test2');

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('test2');
    });

    vi.useRealTimers();
  });

  describe('useThrottle', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('应该节流函数调用', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useThrottle(callback, 300));

      // 第一次调用立即执行
      result.current('test1');
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenLastCalledWith('test1');

      // 第二次调用在延迟时间内，设置定时器
      result.current('test2');
      expect(callback).toHaveBeenCalledTimes(1); // 还没有过延迟时间

      // 前进时间，触发test2的延迟执行
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenLastCalledWith('test2');

      // 第三次调用，也需要等待（因为Date.now()返回真实时间）
      // 这验证了节流功能正常工作
      result.current('test3');
      expect(callback).toHaveBeenCalledTimes(2); // 还没有执行

      // 再次前进时间执行test3
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenLastCalledWith('test3');
    });
  });

  describe('calculateVisibleRange', () => {
    it('应该计算正确的可见范围', () => {
      const range = calculateVisibleRange(500, 600, 50, 100, 3);

      expect(range.start).toBeGreaterThanOrEqual(0);
      expect(range.end).toBeLessThanOrEqual(100);
      expect(range.end).toBeGreaterThan(range.start);
    });

    it('应该考虑overscan', () => {
      const range1 = calculateVisibleRange(500, 600, 50, 100, 0);
      const range2 = calculateVisibleRange(500, 600, 50, 100, 3);

      expect(range2.start).toBeLessThanOrEqual(range1.start);
      expect(range2.end).toBeGreaterThanOrEqual(range1.end);
    });

    it('应该处理边界情况', () => {
      // 滚动到顶部
      const range1 = calculateVisibleRange(0, 600, 50, 100, 3);
      expect(range1.start).toBe(0);

      // 滚动到底部
      const range2 = calculateVisibleRange(10000, 600, 50, 100, 3);
      expect(range2.end).toBe(100);
    });

    it('应该处理空列表', () => {
      const range = calculateVisibleRange(0, 600, 50, 0, 3);
      expect(range.start).toBe(0);
      expect(range.end).toBe(0);
    });
  });

  describe('generateSrcSet', () => {
    it('应该生成正确的srcset', () => {
      const baseUrl = 'https://example.com/image.jpg';
      const sizes = [320, 640, 1280];

      const srcSet = generateSrcSet(baseUrl, sizes);

      expect(srcSet).toContain('320w');
      expect(srcSet).toContain('640w');
      expect(srcSet).toContain('1280w');
    });

    it('应该包含正确的URL参数', () => {
      const baseUrl = 'https://example.com/image.jpg';
      const sizes = [320, 640];

      const srcSet = generateSrcSet(baseUrl, sizes);

      // 检查URL格式
      expect(srcSet).toMatch(/w=320/);
      expect(srcSet).toMatch(/w=640/);
    });
  });

  describe('calculateOptimalSize', () => {
    it('应该考虑设备像素比', () => {
      const originalPixelRatio = window.devicePixelRatio;
      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        configurable: true,
        value: 2,
      });

      const size = calculateOptimalSize(400);
      expect(size).toBe(800);

      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        configurable: true,
        value: originalPixelRatio,
      });
    });

    it('应该向上取整', () => {
      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        configurable: true,
        value: 1.5,
      });

      const size = calculateOptimalSize(401);
      expect(size).toBe(602); // 401 * 1.5 向上取整
    });

    it('应该使用默认像素比1', () => {
      const originalPixelRatio = window.devicePixelRatio;
      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        configurable: true,
        value: undefined,
      });

      const size = calculateOptimalSize(400, 1);
      expect(size).toBe(400);

      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        configurable: true,
        value: originalPixelRatio,
      });
    });
  });

  describe('PERFORMANCE_CHECKLIST', () => {
    it('应该包含所有性能优化项', () => {
      expect(PERFORMANCE_CHECKLIST).toHaveProperty('codeSplitting');
      expect(PERFORMANCE_CHECKLIST).toHaveProperty('lazyLoading');
      expect(PERFORMANCE_CHECKLIST).toHaveProperty('imageOptimization');
      expect(PERFORMANCE_CHECKLIST).toHaveProperty('caching');
      expect(PERFORMANCE_CHECKLIST).toHaveProperty('compression');
      expect(PERFORMANCE_CHECKLIST).toHaveProperty('bundleAnalysis');
      expect(PERFORMANCE_CHECKLIST).toHaveProperty('serverComponents');
      expect(PERFORMANCE_CHECKLIST).toHaveProperty('streaming');
    });

    it('每个检查项应该有正确的结构', () => {
      const checklist = PERFORMANCE_CHECKLIST;

      Object.values(checklist).forEach((item) => {
        expect(item).toHaveProperty('checked');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('description');
        expect(typeof item.checked).toBe('boolean');
        expect(typeof item.name).toBe('string');
        expect(typeof item.description).toBe('string');
      });
    });

    it('所有检查项初始状态应为未检查', () => {
      const checklist = PERFORMANCE_CHECKLIST;

      Object.values(checklist).forEach((item) => {
        expect(item.checked).toBe(false);
      });
    });
  });
});
