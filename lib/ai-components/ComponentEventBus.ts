/**
 * @fileoverview 组件事件总线
 * @description YYC³ AI组件间的统一通信机制
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-28
 */

import type { ComponentEvent, EventListener, Subscription, ComponentConfig, ComponentStatus } from './types';
import { LifecycleComponent } from './ComponentLifecycleManager';

/**
 * 事件通道
 */
class EventChannel {
  private listeners: Set<EventListener> = new Set();
  private eventHistory: ComponentEvent[] = [];
  private readonly maxHistory: number;

  constructor(maxHistory = 100) {
    this.maxHistory = maxHistory;
  }

  /**
   * 订阅事件
   */
  subscribe(listener: EventListener): Subscription {
    this.listeners.add(listener);
    
    return {
      unsubscribe: () => {
        this.listeners.delete(listener);
      }
    };
  }

  /**
   * 发布事件
   */
  async publish(event: ComponentEvent): Promise<void> {
    // 记录历史
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistory) {
      this.eventHistory.shift();
    }

    // 通知所有监听器
    const promises = Array.from(this.listeners).map(listener => {
      try {
        return Promise.resolve(listener(event));
      } catch (error) {
        console.error('[EventChannel] 监听器执行错误:', error);
        return Promise.resolve();
      }
    });

    await Promise.all(promises);
  }

  /**
   * 清空监听器
   */
  clear(): void {
    this.listeners.clear();
  }

  /**
   * 获取监听器数量
   */
  getListenerCount(): number {
    return this.listeners.size;
  }

  /**
   * 获取事件历史
   */
  getHistory(limit?: number): ComponentEvent[] {
    if (limit) {
      return this.eventHistory.slice(-limit);
    }
    return [...this.eventHistory];
  }
}

/**
 * 请求-响应对象
 */
interface PendingRequest {
  resolve: (value: any) => void;
  reject: (error: Error) => void;
  timeout: NodeJS.Timeout;
}

/**
 * 组件事件总线
 * 
 * @description
 * 实现组件间的发布-订阅和请求-响应通信模式
 * 
 * @example
 * ```typescript
 * const bus = ComponentEventBus.getInstance();
 * 
 * // 订阅事件
 * const subscription = bus.subscribe('chat', (event) => {
 *   console.log('收到消息:', event);
 * });
 * 
 * // 发布事件
 * bus.publish('chat', {
 *   type: 'message',
 *   data: { text: 'Hello' }
 * });
 * 
 * // 请求-响应
 * const response = await bus.request('toolbox', {
 *   type: 'execute',
 *   data: { toolId: 'search' }
 * });
 * ```
 */
export class ComponentEventBus implements LifecycleComponent {
  private static instance: ComponentEventBus;
  public id: string = 'component-event-bus';
  public name: string = 'ComponentEventBus';
  public status: ComponentStatus = 'idle';
  public config: ComponentConfig;
  private channels: Map<string, EventChannel> = new Map();
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private globalListeners: Set<EventListener> = new Set();
  private errorListeners: Set<EventListener> = new Set();
  private readonly defaultTimeout = 30000; // 30秒

  private constructor() {
    // 初始化组件配置
    this.config = {
      id: this.id,
      name: this.name,
      enabled: true,
      autoStart: true,
      dependencies: [],
      priority: 0,
      timeout: this.defaultTimeout,
      retryPolicy: {
        maxAttempts: 3,
        backoffMultiplier: 2,
        initialDelay: 1000,
        maxDelay: 10000
      },
      metrics: {
        enabled: false,
        interval: 60000,
        retention: 86400000
      }
    };

    if (typeof window !== 'undefined') {
      // 浏览器环境下的清理
      window.addEventListener('beforeunload', () => {
        this.cleanup();
      });
    }
  }

  /**
   * 获取单例实例
   */
  static getInstance(): ComponentEventBus {
    if (!ComponentEventBus.instance) {
      ComponentEventBus.instance = new ComponentEventBus();
    }
    return ComponentEventBus.instance;
  }

  /**
   * 创建通道（如果不存在）
   */
  private ensureChannel(channelName: string): EventChannel {
    let channel = this.channels.get(channelName);
    if (!channel) {
      channel = new EventChannel();
      this.channels.set(channelName, channel);
    }
    return channel;
  }

  /**
   * 发布事件
   * 
   * @param channelName 通道名称
   * @param event 事件数据
   */
  publish(channelName: string, event: Omit<ComponentEvent, 'id' | 'timestamp'>): void {
    const fullEvent: ComponentEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: Date.now()
    };

    // 发布到指定通道
    const channel = this.ensureChannel(channelName);
    channel.publish(fullEvent).catch(error => {
      console.error(`[ComponentEventBus] 发布事件到通道 ${channelName} 失败:`, error);
    });

    // 通知全局监听器（结构调整，传递完整事件对象并加上 channel 字段）
    this.globalListeners.forEach(listener => {
      try {
        listener({
          ...fullEvent,
          channel: channelName
        });
      } catch (error) {
        console.error('[ComponentEventBus] 全局监听器执行错误:', error);
        // error 事件通知
        if (this.errorListeners) {
          this.errorListeners.forEach((handler: EventListener) => {
            try { handler(error as any); } catch { /* ignore */ }
          });
        }
      }
    });
  }

  /**
   * 订阅事件
   * 
   * @param channelName 通道名称
   * @param listener 事件监听器
   * @returns 订阅对象
   */
  subscribe(channelName: string, listener: EventListener): Subscription {
    const channel = this.ensureChannel(channelName);
    return channel.subscribe(listener);
  }

  /**
   * 订阅所有通道的事件
   * 
   * @param listener 全局事件监听器
   * @returns 订阅对象
   */
  subscribeGlobal(listener: EventListener): Subscription {
    this.globalListeners.add(listener);
    
    return {
      unsubscribe: () => {
        this.globalListeners.delete(listener);
      }
    };
  }

  /**
   * 请求-响应模式
   * 
   * @param channelName 通道名称
   * @param request 请求数据
   * @param timeout 超时时间（毫秒）
   * @returns 响应数据
   */
  async request<T = any>(
    channelName: string,
    request: Omit<ComponentEvent, 'id' | 'timestamp'>,
    timeout = this.defaultTimeout
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const requestId = this.generateEventId();
      
      // 设置超时
      const timeoutHandle = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new Error('Request timeout'));
      }, timeout);

      // 保存pending请求
      this.pendingRequests.set(requestId, {
        resolve,
        reject,
        timeout: timeoutHandle
      });

      // 订阅响应
      const responseChannel = `${channelName}:response`;
      const subscription = this.subscribe(responseChannel, (event) => {
        if (event.metadata?.requestId === requestId) {
          const pending = this.pendingRequests.get(requestId);
          if (pending) {
            clearTimeout(pending.timeout);
            this.pendingRequests.delete(requestId);
            subscription.unsubscribe();
            
            if (event.metadata?.error) {
              reject(new Error(event.metadata.error));
            } else {
              resolve(event.data);
            }
          }
        }
      });

      // 发布请求
      this.publish(channelName, {
        ...request,
        metadata: {
          ...request.metadata,
          requestId,
          responseChannel
        }
      });
    });
  }

  /**
   * 响应请求
   * 
   * @param event 原始请求事件
   * @param response 响应数据
   */
  respond(event: ComponentEvent, response: any): void {
    const responseChannel = event.metadata?.responseChannel;
    const requestId = event.metadata?.requestId;

    if (!responseChannel || !requestId) {
      console.warn('[ComponentEventBus] 无法响应：缺少响应通道或请求ID');
      return;
    }

    this.publish(responseChannel, {
      type: 'response',
      source: 'system',
      data: response,
      metadata: { requestId }
    });
  }

  /**
   * 响应错误
   */
  respondError(event: ComponentEvent, error: Error | string): void {
    const responseChannel = event.metadata?.responseChannel;
    const requestId = event.metadata?.requestId;

    if (!responseChannel || !requestId) {
      console.warn('[ComponentEventBus] 无法响应错误：缺少响应通道或请求ID');
      return;
    }

    this.publish(responseChannel, {
      type: 'error',
      source: 'system',
      data: null,
      metadata: {
        requestId,
        error: error instanceof Error ? error.message : error
      }
    });
  }

  /**
   * 获取通道的事件历史
   */
  getChannelHistory(channelName: string, limit?: number): ComponentEvent[] {
    const channel = this.channels.get(channelName);
    return channel ? channel.getHistory(limit) : [];
  }

  /**
   * 清理通道
   */
  clearChannel(channelName: string): void {
    const channel = this.channels.get(channelName);
    if (channel) {
      channel.clear();
      this.channels.delete(channelName);
    }
  }

  /**
   * 获取所有通道名称
   */
  getChannels(): string[] {
    return Array.from(this.channels.keys());
  }

  /**
   * 获取通道统计
   */
  getChannelStats(channelName: string) {
    const channel = this.channels.get(channelName);
    if (!channel) {
      return null;
    }

    return {
      listenerCount: channel.getListenerCount(),
      historySize: channel.getHistory().length
    };
  }

  /**
   * 清理资源
   */
  private cleanup(): void {
    // 清理所有pending请求
    this.pendingRequests.forEach(pending => {
      clearTimeout(pending.timeout);
      pending.reject(new Error('系统关闭'));
    });
    this.pendingRequests.clear();

    // 清理所有通道
    this.channels.forEach(channel => channel.clear());
    this.channels.clear();

    // 清理全局监听器
    this.globalListeners.clear();
  }

  /**
   * 清理所有数据（测试用）
   */
  clearAll(): void {
    this.cleanup();
  }

  /**
   * 生成事件ID
   */
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 重置实例（仅用于测试）
   */
  static resetInstance(): void {
    if (ComponentEventBus.instance) {
      ComponentEventBus.instance.cleanup();
      ComponentEventBus.instance = null as any;
    }
  }

  // ==================== 生命周期方法 ====================

  /**
   * 初始化组件
   */
  public async initialize(config?: Partial<ComponentConfig>): Promise<void> {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    
    this.status = 'ready';
    
    // 通知组件已初始化
    this.publish('component-lifecycle', {
      type: 'initialized',
      source: this.id,
      data: { componentId: this.id, status: this.status }
    });
  }

  /**
   * 启动组件
   */
  public async start(): Promise<void> {
    if (this.status !== 'ready') {
      throw new Error(`Component not ready to start, current status: ${this.status}`);
    }
    
    this.status = 'running';
    
    // 通知组件已启动
    this.publish('component-lifecycle', {
      type: 'started',
      source: this.id,
      data: { componentId: this.id, status: this.status }
    });
  }

  /**
   * 停止组件
   */
  public async stop(): Promise<void> {
    if (this.status !== 'running') {
      throw new Error(`Component not running, current status: ${this.status}`);
    }
    
    this.status = 'idle';
    
    // 通知组件已停止
    this.publish('component-lifecycle', {
      type: 'stopped',
      source: this.id,
      data: { componentId: this.id, status: this.status }
    });
  }

  /**
   * 获取组件状态
   */
  public getStatus(): ComponentStatus {
    return this.status;
  }

  /**
   * 销毁组件
   */
  public async destroy(): Promise<void> {
    this.status = 'destroyed';
    
    // 清理资源
    this.cleanup();
    
    // 通知组件已销毁
    this.publish('component-lifecycle', {
      type: 'destroyed',
      source: this.id,
      data: { componentId: this.id, status: this.status }
    });
  }
}

// 导出单例实例
export const eventBus = ComponentEventBus.getInstance();

// 默认导出
export default ComponentEventBus;
