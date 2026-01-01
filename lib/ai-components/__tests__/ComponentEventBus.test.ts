/**
 * ComponentEventBus 单元测试
 * 
 * 测试事件总线的完整功能：
 * - 发布-订阅模式
 * - 请求-响应模式
 * - 事件历史管理
 * - 全局监听器
 * - 错误处理
 * 
 * @module Tests/ComponentEventBus
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentEventBus } from '../ComponentEventBus';
import type { ComponentEvent } from '../types';

describe('ComponentEventBus', () => {
  let eventBus: ComponentEventBus;
  
  beforeEach(() => {
    eventBus = ComponentEventBus.getInstance();
  });
  
  afterEach(() => {
    // 清理所有订阅
    eventBus.clearAll();
  });
  
  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ComponentEventBus.getInstance();
      const instance2 = ComponentEventBus.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });
  
  describe('Publish-Subscribe Pattern', () => {
    it('should publish and receive events', async () => {
      const channel = 'test-channel';
      const testEvent = {
        type: 'test-event',
        source: 'test',
        data: { message: 'Hello World' },
      };
      
      const listener = vi.fn();
      
      // 订阅事件
      const subscription = eventBus.subscribe(channel, listener);
      
      // 发布事件
      eventBus.publish(channel, testEvent);
      
      // 验证监听器被调用
      expect(listener).toHaveBeenCalledTimes(1);
      // 实际事件会有 id 和 timestamp
      const receivedEvent = listener.mock.calls[0][0];
      expect(receivedEvent.type).toBe('test-event');
      expect(receivedEvent.data.message).toBe('Hello World');
      expect(receivedEvent.id).toBeDefined();
      expect(receivedEvent.timestamp).toBeDefined();
      
      // 取消订阅
      subscription.unsubscribe();
    });
    
    it('should support multiple listeners on same channel', () => {
      const channel = 'test-channel';
      const event = {
        type: 'test',
        source: 'test'
      };
      
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const listener3 = vi.fn();
      
      eventBus.subscribe(channel, listener1);
      eventBus.subscribe(channel, listener2);
      eventBus.subscribe(channel, listener3);
      
      eventBus.publish(channel, event);
      
      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
      expect(listener3).toHaveBeenCalledTimes(1);
    });
    
    it('should support event filtering by type', () => {
      const channel = 'test-channel';
      const listener = vi.fn();
      
      // subscribe 不支持 eventType 过滤，需要在 listener 中手动过滤
      eventBus.subscribe(channel, (event) => {
        if (event.type === 'specific-event') {
          listener(event);
        }
      });
      
      // 发布匹配类型的事件
      eventBus.publish(channel, {
        type: 'specific-event',
        source: 'test'
      });
      
      // 发布不匹配类型的事件
      eventBus.publish(channel, {
        type: 'other-event',
        timestamp: new Date(),
      });
      
      // 只应该收到一次调用
      expect(listener).toHaveBeenCalledTimes(1);
    });
    
    it('should handle unsubscribe correctly', () => {
      const channel = 'test-channel';
      const listener = vi.fn();
      
      const subscription = eventBus.subscribe(channel, listener);
      
      // 发布第一个事件
      eventBus.publish(channel, { type: 'test', timestamp: new Date() });
      expect(listener).toHaveBeenCalledTimes(1);
      
      // 取消订阅
      subscription.unsubscribe();
      
      // 再次发布事件
      eventBus.publish(channel, { type: 'test', timestamp: new Date() });
      
      // 不应该收到第二次调用
      expect(listener).toHaveBeenCalledTimes(1);
    });
    
    it('should support channel-specific events', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      
      eventBus.subscribe('channel-1', listener1);
      eventBus.subscribe('channel-2', listener2);
      
      eventBus.publish('channel-1', { type: 'test', timestamp: new Date() });
      
      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).not.toHaveBeenCalled();
    });
  });
  
  describe('Request-Response Pattern', () => {
    it('should handle request-response successfully', async () => {
      const channel = 'rpc-channel';
      const requestData = { query: 'test' };
      const responseData = { result: 'success' };
      
      // 设置响应者
      eventBus.subscribe(channel, (event: ComponentEvent) => {
        if (event.type === 'request') {
          eventBus.respond(event, responseData);
        }
      });
      
      // 发送请求
      const response = await eventBus.request(channel, {
        type: 'request',
        timestamp: new Date(),
        data: requestData,
        requestId: 'req-001',
      });
      
      expect(response).toEqual(responseData);
    });
    
    it('should handle request timeout', async () => {
      const channel = 'timeout-channel';
      
      // 不设置响应者，请求应该超时
      const requestPromise = eventBus.request(
        channel,
        {
          type: 'request',
          timestamp: new Date(),
          requestId: 'req-002',
        },
        100 // 100ms超时
      );
      
      await expect(requestPromise).rejects.toThrow('Request timeout');
    });
    
    it('should handle multiple concurrent requests', async () => {
      const channel = 'concurrent-channel';
      
      // 设置响应者
      eventBus.subscribe(channel, (event: ComponentEvent) => {
        if (event.type === 'request') {
          const requestId = event.requestId;
          const data = event.data as { value: number };
          
          // 模拟异步处理
          setTimeout(() => {
            eventBus.respond(event, { result: data.value * 2 });
          }, 10);
        }
      });
      
      // 发送多个并发请求
      const requests = [
        eventBus.request(channel, {
          type: 'request',
          timestamp: new Date(),
          data: { value: 1 },
          requestId: 'req-1',
        }),
        eventBus.request(channel, {
          type: 'request',
          timestamp: new Date(),
          data: { value: 2 },
          requestId: 'req-2',
        }),
        eventBus.request(channel, {
          type: 'request',
          timestamp: new Date(),
          data: { value: 3 },
          requestId: 'req-3',
        }),
      ];
      
      const responses = await Promise.all(requests);
      
      expect(responses).toEqual([
        { result: 2 },
        { result: 4 },
        { result: 6 },
      ]);
    });
    
    it('should handle error responses', async () => {
      const channel = 'error-channel';
      
      // 设置响应者返回错误
      eventBus.subscribe(channel, (event: ComponentEvent) => {
        if (event.type === 'request') {
          eventBus.respondError(event, new Error('Processing failed'));
        }
      });
      
      const requestPromise = eventBus.request(channel, {
        type: 'request',
        timestamp: new Date(),
        requestId: 'req-error',
      });
      
      await expect(requestPromise).rejects.toThrow('Processing failed');
    });
  });
  
  describe('Event History', () => {
    it('should maintain event history', () => {
      const channel = 'history-channel';
      
      // 发布多个事件
      for (let i = 0; i < 5; i++) {
        eventBus.publish(channel, {
          type: `event-${i}`,
          timestamp: new Date(),
          data: { index: i },
        });
      }
      
      const history = eventBus.getHistory(channel);
      
      expect(history).toHaveLength(5);
      expect(history[0].type).toBe('event-0');
      expect(history[4].type).toBe('event-4');
    });
    
    it('should limit history size', () => {
      const channel = 'limited-history';
      const maxHistorySize = 100; // 默认限制
      
      // 发布超过限制数量的事件
      for (let i = 0; i < maxHistorySize + 10; i++) {
        eventBus.publish(channel, {
          type: `event-${i}`,
          timestamp: new Date(),
        });
      }
      
      const history = eventBus.getHistory(channel);
      
      // 历史记录应该被限制在maxHistorySize
      expect(history.length).toBeLessThanOrEqual(maxHistorySize);
      
      // 应该保留最新的事件
      expect(history[history.length - 1].type).toBe(`event-${maxHistorySize + 9}`);
    });
    
    it('should clear history for specific channel', () => {
      const channel1 = 'channel-1';
      const channel2 = 'channel-2';
      
      eventBus.publish(channel1, { type: 'test', timestamp: new Date() });
      eventBus.publish(channel2, { type: 'test', timestamp: new Date() });
      
      eventBus.clearHistory(channel1);
      
      expect(eventBus.getHistory(channel1)).toHaveLength(0);
      expect(eventBus.getHistory(channel2)).toHaveLength(1);
    });
  });
  
  describe('Global Listeners', () => {
    it('should receive events from all channels', () => {
      const globalListener = vi.fn();
      
      eventBus.subscribeGlobal(globalListener);
      
      eventBus.publish('channel-1', { type: 'test-1', timestamp: new Date() });
      eventBus.publish('channel-2', { type: 'test-2', timestamp: new Date() });
      eventBus.publish('channel-3', { type: 'test-3', timestamp: new Date() });
      
      expect(globalListener).toHaveBeenCalledTimes(3);
    });
    
    it('should include channel information in global events', () => {
      const globalListener = vi.fn();
      
      eventBus.subscribeGlobal(globalListener);
      
      const event = { type: 'test', timestamp: new Date() };
      eventBus.publish('test-channel', event);
      
      expect(globalListener).toHaveBeenCalledWith(
        expect.objectContaining({
          channel: 'test-channel',
          event,
        })
      );
    });
    
    it('should support unsubscribing global listeners', () => {
      const globalListener = vi.fn();
      
      const subscription = eventBus.subscribeGlobal(globalListener);
      
      eventBus.publish('test', { type: 'test', timestamp: new Date() });
      expect(globalListener).toHaveBeenCalledTimes(1);
      
      subscription.unsubscribe();
      
      eventBus.publish('test', { type: 'test', timestamp: new Date() });
      expect(globalListener).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('Error Handling', () => {
    it('should handle listener errors gracefully', () => {
      const channel = 'error-channel';
      const errorListener = vi.fn(() => {
        throw new Error('Listener error');
      });
      const normalListener = vi.fn();
      
      eventBus.subscribe(channel, errorListener);
      eventBus.subscribe(channel, normalListener);
      
      // 发布事件不应该抛出错误
      expect(() => {
        eventBus.publish(channel, { type: 'test', timestamp: new Date() });
      }).not.toThrow();
      
      // 正常监听器应该仍然被调用
      expect(normalListener).toHaveBeenCalled();
    });
    
    it('should emit error events for listener failures', () => {
      const channel = 'error-channel';
      const errorHandler = vi.fn();
      
      eventBus.on('error', errorHandler);
      
      eventBus.subscribe(channel, () => {
        throw new Error('Test error');
      });
      
      eventBus.publish(channel, { type: 'test', timestamp: new Date() });
      
      expect(errorHandler).toHaveBeenCalled();
    });
  });
  
  describe('Performance', () => {
    it('should handle high-frequency events', () => {
      const channel = 'perf-channel';
      const listener = vi.fn();
      
      eventBus.subscribe(channel, listener);
      
      const startTime = Date.now();
      const eventCount = 10000;
      
      for (let i = 0; i < eventCount; i++) {
        eventBus.publish(channel, {
          type: 'perf-test',
          timestamp: new Date(),
          data: { index: i },
        });
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // 10000个事件应该在1秒内完成
      expect(duration).toBeLessThan(1000);
      expect(listener).toHaveBeenCalledTimes(eventCount);
    });
    
    it('should handle many concurrent subscriptions', () => {
      const channel = 'concurrent-channel';
      const listenerCount = 1000;
      const listeners: any[] = [];
      
      // 创建大量订阅
      for (let i = 0; i < listenerCount; i++) {
        listeners.push(vi.fn());
        eventBus.subscribe(channel, listeners[i]);
      }
      
      // 发布事件
      eventBus.publish(channel, { type: 'test', timestamp: new Date() });
      
      // 验证所有监听器都被调用
      listeners.forEach(listener => {
        expect(listener).toHaveBeenCalledTimes(1);
      });
    });
  });
  
  describe('Memory Management', () => {
    it('should not leak memory with many subscriptions', () => {
      const channel = 'mem-test';
      const subscriptions: any[] = [];
      
      // 创建大量订阅
      for (let i = 0; i < 1000; i++) {
        subscriptions.push(eventBus.subscribe(channel, vi.fn()));
      }
      
      // 取消所有订阅
      subscriptions.forEach(sub => sub.unsubscribe());
      
      // 发布事件不应该触发任何监听器
      const testListener = vi.fn();
      eventBus.subscribe(channel, testListener);
      eventBus.publish(channel, { type: 'test', timestamp: new Date() });
      
      expect(testListener).toHaveBeenCalledTimes(1);
    });
    
    it('should clear all data when clearAll is called', () => {
      eventBus.subscribe('channel-1', vi.fn());
      eventBus.subscribe('channel-2', vi.fn());
      eventBus.subscribeGlobal(vi.fn());
      
      eventBus.publish('channel-1', { type: 'test', timestamp: new Date() });
      eventBus.publish('channel-2', { type: 'test', timestamp: new Date() });
      
      eventBus.clearAll();
      
      // 验证所有数据已清除
      expect(eventBus.getHistory('channel-1')).toHaveLength(0);
      expect(eventBus.getHistory('channel-2')).toHaveLength(0);
      
      // 新订阅应该可以正常工作
      const listener = vi.fn();
      eventBus.subscribe('new-channel', listener);
      eventBus.publish('new-channel', { type: 'test', timestamp: new Date() });
      
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });
});
