/**
 * AI组件集成层
 * 
 * 提供统一的事件总线和生命周期管理，确保所有AI组件能够协同工作
 * 
 * @author YYC³ AI开发团队
 * @version 1.0.0
 * @standard YYC³团队标准化规范 v1.1.0
 */

import { EventEmitter } from 'events';
import { ChatInterface } from '../chat-interface';
import { ToolboxPanel } from '../toolbox-panel';
import { InsightsDashboard } from '../insights-dashboard';
import { WorkflowDesigner } from '../workflow-designer';
import { KnowledgeBase } from '../knowledge-base';
import { AIActionsManager } from '../ai-actions-manager';
import { StreamProcessor } from '../stream-processor';
import { ContextManager } from '../context-manager';

// ==================== 类型定义 ====================

/**
 * 组件类型
 */
export type ComponentType =
  | 'chat-interface'
  | 'toolbox-panel'
  | 'insights-dashboard'
  | 'workflow-designer'
  | 'knowledge-base'
  | 'ai-actions-manager'
  | 'stream-processor'
  | 'context-manager';

/**
 * 组件实例
 */
export type ComponentInstance =
  | ChatInterface
  | ToolboxPanel
  | InsightsDashboard
  | WorkflowDesigner
  | KnowledgeBase
  | AIActionsManager
  | StreamProcessor
  | ContextManager;

/**
 * 组件状态
 */
export type ComponentStatus = 'uninitialized' | 'initializing' | 'ready' | 'running' | 'error' | 'stopped';

/**
 * 组件注册表项
 */
export interface ComponentRegistration {
  /** 组件ID */
  id: string;
  /** 组件类型 */
  type: ComponentType;
  /** 组件实例 */
  instance: ComponentInstance;
  /** 状态 */
  status: ComponentStatus;
  /** 依赖项 */
  dependencies: ComponentType[];
  /** 配置 */
  config: any;
  /** 注册时间 */
  registeredAt: Date;
}

/**
 * 事件消息
 */
export interface EventMessage {
  /** 消息ID */
  id: string;
  /** 事件类型 */
  type: string;
  /** 来源组件 */
  source: ComponentType;
  /** 目标组件（可选） */
  target?: ComponentType;
  /** 数据负载 */
  payload: any;
  /** 时间戳 */
  timestamp: Date;
  /** 优先级 */
  priority?: 'low' | 'normal' | 'high';
}

/**
 * 事件订阅
 */
export interface EventSubscription {
  /** 订阅ID */
  id: string;
  /** 组件ID */
  componentId: string;
  /** 事件类型 */
  eventType: string;
  /** 处理器 */
  handler: (message: EventMessage) => void | Promise<void>;
  /** 过滤器 */
  filter?: (message: EventMessage) => boolean;
}

/**
 * 集成配置
 */
export interface IntegrationConfig {
  /** 事件总线配置 */
  eventBus: {
    /** 最大队列长度 */
    maxQueueLength: number;
    /** 事件超时（毫秒） */
    eventTimeout: number;
    /** 启用事件日志 */
    enableLogging: boolean;
  };
  
  /** 生命周期配置 */
  lifecycle: {
    /** 启动超时（毫秒） */
    startupTimeout: number;
    /** 停止超时（毫秒） */
    shutdownTimeout: number;
    /** 健康检查间隔（毫秒） */
    healthCheckInterval: number;
  };
}

// ==================== 组件事件总线 ====================

/**
 * 组件事件总线
 * 提供组件间的解耦通信
 */
export class ComponentEventBus extends EventEmitter {
  private config: IntegrationConfig['eventBus'];
  private eventQueue: EventMessage[];
  private subscriptions: Map<string, EventSubscription[]>;
  private eventLog: EventMessage[];

  constructor(config: IntegrationConfig['eventBus']) {
    super();
    this.config = config;
    this.eventQueue = [];
    this.subscriptions = new Map();
    this.eventLog = [];
  }

  /**
   * 发布事件
   */
  public publish(
    type: string,
    source: ComponentType,
    payload: any,
    options?: {
      target?: ComponentType;
      priority?: EventMessage['priority'];
    }
  ): void {
    const message: EventMessage = {
      id: this.generateId(),
      type,
      source,
      target: options?.target,
      payload,
      timestamp: new Date(),
      priority: options?.priority || 'normal'
    };

    // 添加到队列
    if (this.eventQueue.length >= this.config.maxQueueLength) {
      throw new Error('事件队列已满');
    }

    this.eventQueue.push(message);

    // 记录日志
    if (this.config.enableLogging) {
      this.eventLog.push(message);
      if (this.eventLog.length > 1000) {
        this.eventLog.shift();
      }
    }

    // 分发事件
    this.dispatch(message);

    this.emit('event:published', message);
  }

  /**
   * 订阅事件
   */
  public subscribe(
    componentId: string,
    eventType: string,
    handler: EventSubscription['handler'],
    filter?: EventSubscription['filter']
  ): string {
    const subscription: EventSubscription = {
      id: this.generateId(),
      componentId,
      eventType,
      handler,
      filter
    };

    if (!this.subscriptions.has(eventType)) {
      this.subscriptions.set(eventType, []);
    }

    this.subscriptions.get(eventType)!.push(subscription);

    this.emit('subscription:created', { subscriptionId: subscription.id });
    return subscription.id;
  }

  /**
   * 取消订阅
   */
  public unsubscribe(subscriptionId: string): void {
    for (const [eventType, subs] of this.subscriptions) {
      const index = subs.findIndex(s => s.id === subscriptionId);
      if (index !== -1) {
        subs.splice(index, 1);
        this.emit('subscription:removed', { subscriptionId });
        return;
      }
    }
  }

  /**
   * 分发事件
   */
  private async dispatch(message: EventMessage): Promise<void> {
    const subscriptions = this.subscriptions.get(message.type) || [];

    for (const sub of subscriptions) {
      // 应用过滤器
      if (sub.filter && !sub.filter(message)) {
        continue;
      }

      // 如果指定了目标，只分发给目标组件
      if (message.target && sub.componentId !== message.target) {
        continue;
      }

      try {
        await Promise.race([
          sub.handler(message),
          this.timeout(this.config.eventTimeout)
        ]);
      } catch (error) {
        this.emit('dispatch:error', { subscriptionId: sub.id, error });
      }
    }

    // 从队列中移除
    const index = this.eventQueue.indexOf(message);
    if (index !== -1) {
      this.eventQueue.splice(index, 1);
    }
  }

  /**
   * 获取事件日志
   */
  public getEventLog(filter?: {
    type?: string;
    source?: ComponentType;
    startTime?: Date;
    endTime?: Date;
  }): EventMessage[] {
    let log = this.eventLog;

    if (filter) {
      log = log.filter(msg => {
        if (filter.type && msg.type !== filter.type) return false;
        if (filter.source && msg.source !== filter.source) return false;
        if (filter.startTime && msg.timestamp < filter.startTime) return false;
        if (filter.endTime && msg.timestamp > filter.endTime) return false;
        return true;
      });
    }

    return log;
  }

  /**
   * 超时Promise
   */
  private timeout(ms: number): Promise<never> {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error('事件处理超时')), ms)
    );
  }

  /**
   * 生成ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 清理
   */
  public clear(): void {
    this.eventQueue = [];
    this.subscriptions.clear();
    this.eventLog = [];
  }
}

// ==================== 组件生命周期管理器 ====================

/**
 * 组件生命周期管理器
 * 管理所有组件的初始化、启动、停止和健康检查
 */
export class ComponentLifecycleManager extends EventEmitter {
  private config: IntegrationConfig['lifecycle'];
  private registry: Map<string, ComponentRegistration>;
  private eventBus: ComponentEventBus;
  private healthCheckTimer?: any;

  constructor(
    config: IntegrationConfig['lifecycle'],
    eventBus: ComponentEventBus
  ) {
    super();
    this.config = config;
    this.registry = new Map();
    this.eventBus = eventBus;
  }

  /**
   * 注册组件
   */
  public register(
    type: ComponentType,
    instance: ComponentInstance,
    config: any,
    dependencies: ComponentType[] = []
  ): string {
    const id = this.generateId();

    const registration: ComponentRegistration = {
      id,
      type,
      instance,
      status: 'uninitialized',
      dependencies,
      config,
      registeredAt: new Date()
    };

    this.registry.set(id, registration);

    // 订阅组件事件
    this.subscribeToComponent(registration);

    this.emit('component:registered', { componentId: id, type });
    return id;
  }

  /**
   * 注销组件
   */
  public async unregister(componentId: string): Promise<void> {
    const registration = this.registry.get(componentId);
    if (!registration) {
      throw new Error(`组件不存在: ${componentId}`);
    }

    // 停止组件
    if (registration.status === 'running') {
      await this.stopComponent(componentId);
    }

    this.registry.delete(componentId);
    this.emit('component:unregistered', { componentId });
  }

  /**
   * 获取组件
   */
  public getComponent(componentId: string): ComponentRegistration | undefined {
    return this.registry.get(componentId);
  }

  /**
   * 获取组件实例
   */
  public getInstance<T extends ComponentInstance>(
    componentId: string
  ): T | undefined {
    const registration = this.registry.get(componentId);
    return registration?.instance as T | undefined;
  }

  /**
   * 列出所有组件
   */
  public listComponents(filter?: {
    type?: ComponentType;
    status?: ComponentStatus;
  }): ComponentRegistration[] {
    let components = Array.from(this.registry.values());

    if (filter) {
      if (filter.type) {
        components = components.filter(c => c.type === filter.type);
      }
      if (filter.status) {
        components = components.filter(c => c.status === filter.status);
      }
    }

    return components;
  }

  /**
   * 启动所有组件
   */
  public async startAll(): Promise<void> {
    this.emit('lifecycle:starting');

    // 按依赖顺序启动
    const sortedComponents = this.topologicalSort();

    for (const registration of sortedComponents) {
      await this.startComponent(registration.id);
    }

    // 启动健康检查
    this.startHealthCheck();

    this.emit('lifecycle:started');
  }

  /**
   * 停止所有组件
   */
  public async stopAll(): Promise<void> {
    this.emit('lifecycle:stopping');

    // 停止健康检查
    this.stopHealthCheck();

    // 按反向依赖顺序停止
    const sortedComponents = this.topologicalSort().reverse();

    for (const registration of sortedComponents) {
      await this.stopComponent(registration.id);
    }

    this.emit('lifecycle:stopped');
  }

  /**
   * 启动组件
   */
  private async startComponent(componentId: string): Promise<void> {
    const registration = this.registry.get(componentId);
    if (!registration) {
      throw new Error(`组件不存在: ${componentId}`);
    }

    if (registration.status === 'running') {
      return;
    }

    registration.status = 'initializing';
    this.emit('component:starting', { componentId });

    try {
      // 检查依赖
      await this.checkDependencies(registration);

      // 启动组件（如果有start方法）
      const instance = registration.instance as any;
      if (typeof instance.start === 'function') {
        await Promise.race([
          instance.start(),
          this.timeout(this.config.startupTimeout)
        ]);
      }

      registration.status = 'running';
      this.emit('component:started', { componentId });
    } catch (error) {
      registration.status = 'error';
      this.emit('component:error', { componentId, error });
      throw error;
    }
  }

  /**
   * 停止组件
   */
  private async stopComponent(componentId: string): Promise<void> {
    const registration = this.registry.get(componentId);
    if (!registration) {
      throw new Error(`组件不存在: ${componentId}`);
    }

    if (registration.status === 'stopped') {
      return;
    }

    this.emit('component:stopping', { componentId });

    try {
      // 停止组件（如果有shutdown方法）
      const instance = registration.instance as any;
      if (typeof instance.shutdown === 'function') {
        await Promise.race([
          instance.shutdown(),
          this.timeout(this.config.shutdownTimeout)
        ]);
      }

      registration.status = 'stopped';
      this.emit('component:stopped', { componentId });
    } catch (error) {
      this.emit('component:error', { componentId, error });
      throw error;
    }
  }

  /**
   * 检查依赖
   */
  private async checkDependencies(registration: ComponentRegistration): Promise<void> {
    for (const depType of registration.dependencies) {
      const dep = Array.from(this.registry.values()).find(r => r.type === depType);
      
      if (!dep) {
        throw new Error(`依赖组件不存在: ${depType}`);
      }

      if (dep.status !== 'running') {
        throw new Error(`依赖组件未就绪: ${depType}`);
      }
    }
  }

  /**
   * 拓扑排序（处理依赖顺序）
   */
  private topologicalSort(): ComponentRegistration[] {
    const sorted: ComponentRegistration[] = [];
    const visited = new Set<string>();
    const components = Array.from(this.registry.values());

    const visit = (reg: ComponentRegistration) => {
      if (visited.has(reg.id)) return;
      visited.add(reg.id);

      // 先访问依赖
      for (const depType of reg.dependencies) {
        const dep = components.find(r => r.type === depType);
        if (dep) {
          visit(dep);
        }
      }

      sorted.push(reg);
    };

    components.forEach(visit);
    return sorted;
  }

  /**
   * 订阅组件事件
   */
  private subscribeToComponent(registration: ComponentRegistration): void {
    const instance = registration.instance as any;

    // 监听常见事件
    const events = [
      'error',
      'warning',
      'info',
      'state:changed',
      'data:updated'
    ];

    for (const event of events) {
      if (typeof instance.on === 'function') {
        instance.on(event, (data: any) => {
          this.eventBus.publish(
            `${registration.type}:${event}`,
            registration.type,
            data
          );
        });
      }
    }
  }

  /**
   * 启动健康检查
   */
  private startHealthCheck(): void {
    this.healthCheckTimer = setInterval(() => {
      this.performHealthCheck();
    }, this.config.healthCheckInterval);
  }

  /**
   * 停止健康检查
   */
  private stopHealthCheck(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = undefined;
    }
  }

  /**
   * 执行健康检查
   */
  private async performHealthCheck(): Promise<void> {
    for (const [id, registration] of this.registry) {
      if (registration.status !== 'running') continue;

      try {
        const instance = registration.instance as any;
        
        // 如果组件有healthCheck方法，调用它
        if (typeof instance.healthCheck === 'function') {
          const healthy = await instance.healthCheck();
          if (!healthy) {
            registration.status = 'error';
            this.emit('health:check:failed', { componentId: id });
          }
        }
      } catch (error) {
        registration.status = 'error';
        this.emit('health:check:error', { componentId: id, error });
      }
    }
  }

  /**
   * 超时Promise
   */
  private timeout(ms: number): Promise<never> {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error('操作超时')), ms)
    );
  }

  /**
   * 生成ID
   */
  private generateId(): string {
    return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取统计信息
   */
  public getStats(): {
    total: number;
    byStatus: Record<ComponentStatus, number>;
    byType: Record<ComponentType, number>;
  } {
    const stats = {
      total: this.registry.size,
      byStatus: {} as Record<ComponentStatus, number>,
      byType: {} as Record<ComponentType, number>
    };

    for (const registration of this.registry.values()) {
      stats.byStatus[registration.status] = (stats.byStatus[registration.status] || 0) + 1;
      stats.byType[registration.type] = (stats.byType[registration.type] || 0) + 1;
    }

    return stats;
  }
}

// ==================== 集成管理器（主入口） ====================

/**
 * AI组件集成管理器
 * 统一管理所有AI组件的协同工作
 */
export class AIComponentIntegration {
  private eventBus: ComponentEventBus;
  private lifecycleManager: ComponentLifecycleManager;
  private config: IntegrationConfig;

  constructor(config?: Partial<IntegrationConfig>) {
    this.config = {
      eventBus: {
        maxQueueLength: 1000,
        eventTimeout: 5000,
        enableLogging: true,
        ...config?.eventBus
      },
      lifecycle: {
        startupTimeout: 30000,
        shutdownTimeout: 10000,
        healthCheckInterval: 60000,
        ...config?.lifecycle
      }
    };

    this.eventBus = new ComponentEventBus(this.config.eventBus);
    this.lifecycleManager = new ComponentLifecycleManager(
      this.config.lifecycle,
      this.eventBus
    );
  }

  /**
   * 获取事件总线
   */
  public getEventBus(): ComponentEventBus {
    return this.eventBus;
  }

  /**
   * 获取生命周期管理器
   */
  public getLifecycleManager(): ComponentLifecycleManager {
    return this.lifecycleManager;
  }

  /**
   * 注册组件
   */
  public registerComponent(
    type: ComponentType,
    instance: ComponentInstance,
    config: any,
    dependencies?: ComponentType[]
  ): string {
    return this.lifecycleManager.register(type, instance, config, dependencies);
  }

  /**
   * 启动系统
   */
  public async start(): Promise<void> {
    await this.lifecycleManager.startAll();
  }

  /**
   * 停止系统
   */
  public async stop(): Promise<void> {
    await this.lifecycleManager.stopAll();
    this.eventBus.clear();
  }

  /**
   * 获取组件实例
   */
  public getComponent<T extends ComponentInstance>(
    componentId: string
  ): T | undefined {
    return this.lifecycleManager.getInstance<T>(componentId);
  }

  /**
   * 发布事件
   */
  public publish(
    type: string,
    source: ComponentType,
    payload: any,
    options?: {
      target?: ComponentType;
      priority?: EventMessage['priority'];
    }
  ): void {
    this.eventBus.publish(type, source, payload, options);
  }

  /**
   * 订阅事件
   */
  public subscribe(
    componentId: string,
    eventType: string,
    handler: EventSubscription['handler'],
    filter?: EventSubscription['filter']
  ): string {
    return this.eventBus.subscribe(componentId, eventType, handler, filter);
  }

  /**
   * 获取系统状态
   */
  public getStatus(): {
    components: ReturnType<ComponentLifecycleManager['getStats']>;
    events: {
      queueLength: number;
      logLength: number;
    };
  } {
    return {
      components: this.lifecycleManager.getStats(),
      events: {
        queueLength: (this.eventBus as any).eventQueue.length,
        logLength: (this.eventBus as any).eventLog.length
      }
    };
  }
}
