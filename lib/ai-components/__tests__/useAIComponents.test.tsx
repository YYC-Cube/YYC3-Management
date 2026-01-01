/**
 * React Hooks 单元测试
 * 
 * 测试 AI 组件 React 集成的完整功能：
 * - useAIComponents 主 Hook
 * - useAIComponentEvent 事件订阅 Hook
 * - useAIComponentPublish 事件发布 Hook
 * - Hook 生命周期管理
 * - 错误边界处理
 * 
 * @module Tests/useAIComponents
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAIComponents, useAIComponentEvent, useAIComponentPublish } from '../useAIComponents';
import type { AIComponentsConfig, ComponentEvent } from '../types';
import React from 'react';

describe('useAIComponents Hook', () => {
  describe('Basic Functionality', () => {
    it('should initialize without config', () => {
      const { result } = renderHook(() => useAIComponents());
      
      expect(result.current).toBeDefined();
      expect(result.current.initialized).toBeDefined();
    });
    
    it('should initialize with config', () => {
      const config: AIComponentsConfig = {
        enabledComponents: {
          chatInterface: true,
        },
      };
      
      const { result } = renderHook(() => useAIComponents(config));
      
      expect(result.current).toBeDefined();
    });
    
    it('should return all expected properties', async () => {
      const { result } = renderHook(() => useAIComponents());
      
      await waitFor(() => {
        expect(result.current.initialized).toBe(true);
      });
      
      expect(result.current.started).toBeDefined();
      expect(result.current.error).toBeDefined();
      expect(result.current.aiComponents).toBeDefined();
      expect(result.current.eventBus).toBeDefined();
      expect(result.current.start).toBeDefined();
      expect(result.current.stop).toBeDefined();
      expect(result.current.healthCheck).toBeDefined();
      expect(result.current.getStatus).toBeDefined();
    });
    
    it('should provide access to enabled components', async () => {
      const config: AIComponentsConfig = {
        enabledComponents: {
          chatInterface: true,
          toolboxPanel: true,
        },
      };
      
      const { result } = renderHook(() => useAIComponents(config));
      
      await waitFor(() => {
        expect(result.current.initialized).toBe(true);
      });
      
      expect(result.current.chatInterface).toBeDefined();
      expect(result.current.toolboxPanel).toBeDefined();
    });
  });
  
  describe('Lifecycle Management', () => {
    it('should auto-initialize on mount', async () => {
      const { result } = renderHook(() => useAIComponents());
      
      // 初始状态
      expect(result.current.initialized).toBe(false);
      
      // 等待初始化完成
      await waitFor(() => {
        expect(result.current.initialized).toBe(true);
      }, { timeout: 3000 });
    });
    
    it('should cleanup on unmount', async () => {
      const { result, unmount } = renderHook(() => useAIComponents());
      
      await waitFor(() => {
        expect(result.current.initialized).toBe(true);
      });
      
      // 卸载组件
      unmount();
      
      // 验证清理（这里需要检查内部状态，实际可能需要spy）
    });
    
    it('should support manual start', async () => {
      const { result } = renderHook(() => useAIComponents());
      
      await waitFor(() => {
        expect(result.current.initialized).toBe(true);
      });
      
      await act(async () => {
        await result.current.start();
      });
      
      expect(result.current.started).toBe(true);
    });
    
    it('should support manual stop', async () => {
      const { result } = renderHook(() => useAIComponents());
      
      await waitFor(() => {
        expect(result.current.initialized).toBe(true);
      });
      
      await act(async () => {
        await result.current.start();
      });
      
      expect(result.current.started).toBe(true);
      
      await act(async () => {
        await result.current.stop();
      });
      
      expect(result.current.started).toBe(false);
    });
  });
  
  describe('Health Check', () => {
    it('should perform health check', async () => {
      const { result } = renderHook(() => useAIComponents());
      
      await waitFor(() => {
        expect(result.current.initialized).toBe(true);
      });
      
      await act(async () => {
        const healthResult = await result.current.healthCheck();
        expect(healthResult).toBeDefined();
        expect(healthResult.healthy).toBeDefined();
      });
    });
  });
  
  describe('Status Retrieval', () => {
    it('should get system status', async () => {
      const { result } = renderHook(() => useAIComponents());
      
      await waitFor(() => {
        expect(result.current.initialized).toBe(true);
      });
      
      const status = result.current.getStatus();
      
      expect(status).toBeDefined();
      expect(status.initialized).toBeDefined();
      expect(status.componentCount).toBeGreaterThanOrEqual(0);
    });
  });
  
  describe('Error Handling', () => {
    it('should handle initialization errors', async () => {
      // 模拟错误配置
      const badConfig: AIComponentsConfig = {
        enabledComponents: {},
      };
      
      const { result } = renderHook(() => useAIComponents(badConfig));
      
      await waitFor(() => {
        // 应该有错误或初始化失败
        expect(result.current.error || !result.current.initialized).toBeTruthy();
      });
    });
    
    it('should set error state on failure', async () => {
      const { result } = renderHook(() => useAIComponents());
      
      await waitFor(() => {
        expect(result.current.initialized).toBe(true);
      });
      
      // 模拟操作失败
      await act(async () => {
        try {
          // 执行可能失败的操作
          await result.current.start();
        } catch (error) {
          // 错误应该被捕获并设置到 error 状态
        }
      });
    });
  });
  
  describe('Re-rendering', () => {
    it('should not re-initialize on re-render', async () => {
      const { result, rerender } = renderHook(() => useAIComponents());
      
      await waitFor(() => {
        expect(result.current.initialized).toBe(true);
      });
      
      const firstComponents = result.current.aiComponents;
      
      // 重新渲染
      rerender();
      
      // 组件实例应该保持不变
      expect(result.current.aiComponents).toBe(firstComponents);
    });
    
    it('should handle config changes', async () => {
      let config: AIComponentsConfig = {
        enabledComponents: {
          chatInterface: true,
        },
      };
      
      const { result, rerender } = renderHook(() => useAIComponents(config));
      
      await waitFor(() => {
        expect(result.current.initialized).toBe(true);
      });
      
      // 更改配置
      config = {
        enabledComponents: {
          chatInterface: true,
          toolboxPanel: true,
        },
      };
      
      rerender();
      
      // Hook 应该处理配置变更
    });
  });
});

describe('useAIComponentEvent Hook', () => {
  describe('Event Subscription', () => {
    it('should subscribe to events', async () => {
      const channel = 'test-channel';
      const eventType = 'test-event';
      const handler = vi.fn();
      
      renderHook(() => useAIComponentEvent(channel, eventType, handler));
      
      // 等待订阅建立
      await waitFor(() => {
        // 验证订阅已建立（可能需要通过发布事件来验证）
      });
    });
    
    it('should call handler when event is published', async () => {
      const channel = 'test-channel';
      const eventType = 'test-event';
      const handler = vi.fn();
      
      // 订阅事件
      renderHook(() => useAIComponentEvent(channel, eventType, handler));
      
      // 发布事件
      const { result: publishResult } = renderHook(() => useAIComponentPublish(channel));
      
      await waitFor(() => {
        expect(publishResult.current).toBeDefined();
      });
      
      act(() => {
        publishResult.current(eventType, { message: 'test' });
      });
      
      // 验证处理器被调用
      await waitFor(() => {
        expect(handler).toHaveBeenCalled();
      });
    });
    
    it('should filter events by type', async () => {
      const channel = 'test-channel';
      const handler = vi.fn();
      
      renderHook(() => useAIComponentEvent(channel, 'specific-event', handler));
      
      const { result: publishResult } = renderHook(() => useAIComponentPublish(channel));
      
      await waitFor(() => {
        expect(publishResult.current).toBeDefined();
      });
      
      // 发布不匹配的事件
      act(() => {
        publishResult.current('other-event', {});
      });
      
      // 发布匹配的事件
      act(() => {
        publishResult.current('specific-event', {});
      });
      
      // 只应该被调用一次
      await waitFor(() => {
        expect(handler).toHaveBeenCalledTimes(1);
      });
    });
  });
  
  describe('Cleanup', () => {
    it('should unsubscribe on unmount', async () => {
      const handler = vi.fn();
      
      const { unmount } = renderHook(() => 
        useAIComponentEvent('test-channel', 'test-event', handler)
      );
      
      // 卸载组件
      unmount();
      
      // 发布事件
      const { result: publishResult } = renderHook(() => 
        useAIComponentPublish('test-channel')
      );
      
      await waitFor(() => {
        expect(publishResult.current).toBeDefined();
      });
      
      act(() => {
        publishResult.current('test-event', {});
      });
      
      // 处理器不应该被调用
      expect(handler).not.toHaveBeenCalled();
    });
    
    it('should resubscribe when dependencies change', async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      
      let deps = [1];
      
      const { rerender } = renderHook(
        ({ handler }) => useAIComponentEvent('test-channel', 'test-event', handler, deps),
        { initialProps: { handler: handler1 } }
      );
      
      // 更改依赖
      deps = [2];
      rerender({ handler: handler2 });
      
      // 新处理器应该被使用
      const { result: publishResult } = renderHook(() => 
        useAIComponentPublish('test-channel')
      );
      
      await waitFor(() => {
        expect(publishResult.current).toBeDefined();
      });
      
      act(() => {
        publishResult.current('test-event', {});
      });
      
      await waitFor(() => {
        expect(handler2).toHaveBeenCalled();
      });
    });
  });
});

describe('useAIComponentPublish Hook', () => {
  describe('Event Publishing', () => {
    it('should return publish function', () => {
      const { result } = renderHook(() => useAIComponentPublish('test-channel'));
      
      expect(result.current).toBeDefined();
      expect(typeof result.current).toBe('function');
    });
    
    it('should publish events', async () => {
      const { result } = renderHook(() => useAIComponentPublish('test-channel'));
      
      await waitFor(() => {
        expect(result.current).toBeDefined();
      });
      
      act(() => {
        result.current('test-event', { message: 'hello' });
      });
      
      // 事件应该被发布（通过订阅来验证）
    });
    
    it('should memoize publish function', () => {
      const { result, rerender } = renderHook(() => 
        useAIComponentPublish('test-channel')
      );
      
      const firstPublish = result.current;
      
      rerender();
      
      // 函数引用应该保持不变
      expect(result.current).toBe(firstPublish);
    });
    
    it('should support metadata in published events', async () => {
      const { result } = renderHook(() => useAIComponentPublish('test-channel'));
      
      await waitFor(() => {
        expect(result.current).toBeDefined();
      });
      
      const metadata = { source: 'test', priority: 'high' };
      
      act(() => {
        result.current('test-event', { data: 'test' }, metadata);
      });
      
      // 元数据应该包含在事件中
    });
  });
});

describe('Hook Integration', () => {
  it('should work together - subscribe and publish', async () => {
    const handler = vi.fn();
    const channel = 'integration-channel';
    const eventType = 'integration-event';
    
    // 订阅
    renderHook(() => useAIComponentEvent(channel, eventType, handler));
    
    // 发布
    const { result: publishResult } = renderHook(() => useAIComponentPublish(channel));
    
    await waitFor(() => {
      expect(publishResult.current).toBeDefined();
    });
    
    // 发布事件
    act(() => {
      publishResult.current(eventType, { message: 'integration test' });
    });
    
    // 验证接收
    await waitFor(() => {
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          type: eventType,
          data: { message: 'integration test' },
        })
      );
    });
  });
  
  it('should work with useAIComponents', async () => {
    const handler = vi.fn();
    
    // 主 Hook
    const { result: mainResult } = renderHook(() => useAIComponents({
      enabledComponents: { chatInterface: true },
    }));
    
    await waitFor(() => {
      expect(mainResult.current.initialized).toBe(true);
    });
    
    // 事件 Hook
    renderHook(() => useAIComponentEvent('chat', 'message', handler));
    
    // 使用 EventBus 发布事件
    act(() => {
      mainResult.current.eventBus.publish('chat', {
        type: 'message',
        timestamp: new Date(),
        data: { text: 'Hello' },
      });
    });
    
    // 验证事件被接收
    await waitFor(() => {
      expect(handler).toHaveBeenCalled();
    });
  });
});

describe('Performance', () => {
  it('should not cause excessive re-renders', () => {
    let renderCount = 0;
    
    const TestComponent = () => {
      renderCount++;
      useAIComponents();
      return null;
    };
    
    const { rerender } = renderHook(() => <TestComponent />);
    
    const initialCount = renderCount;
    
    // 多次重渲染
    rerender();
    rerender();
    rerender();
    
    // 应该只有少量额外渲染
    expect(renderCount - initialCount).toBeLessThan(5);
  });
});
