/**
 * YYC³ 标准组件模板
 * 
 * 所有系统组件应继承自 YYC3Component 抽象类
 * 实现统一的生命周期管理和事件处理机制
 * 
 * @template ComponentTemplate
 * @author YYC³ Architecture Team
 * @version 1.0.0
 */

import { EventEmitter } from 'events';

// ==================== 组件接口 ====================

/**
 * 组件配置
 */
export interface ComponentConfig {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  dependencies?: string[];
  settings?: Record<string, any>;
}

/**
 * 组件状态
 */
export enum ComponentStatus {
  UNINITIALIZED = 'uninitialized',
  INITIALIZING = 'initializing',
  READY = 'ready',
  RUNNING = 'running',
  PAUSED = 'paused',
  ERROR = 'error',
  STOPPED = 'stopped'
}

/**
 * 组件事件
 */
export enum ComponentEvent {
  INITIALIZED = 'initialized',
  STARTED = 'started',
  PAUSED = 'paused',
  RESUMED = 'resumed',
  STOPPED = 'stopped',
  ERROR = 'error',
  STATE_CHANGED = 'state_changed'
}

/**
 * 组件指标
 */
export interface ComponentMetrics {
  uptime: number;
  requestCount: number;
  errorCount: number;
  avgResponseTime: number;
  lastError?: Error;
  customMetrics?: Record<string, number>;
}

// ==================== 抽象基类 ====================

/**
 * YYC³ 组件抽象基类
 * 
 * 所有系统组件必须继承此类，实现标准化的生命周期管理
 * 
 * @abstract
 */
export abstract class YYC3Component extends EventEmitter {
  protected config: ComponentConfig;
  protected status: ComponentStatus = ComponentStatus.UNINITIALIZED;
  protected metrics: ComponentMetrics = {
    uptime: 0,
    requestCount: 0,
    errorCount: 0,
    avgResponseTime: 0
  };
  protected startTime?: Date;

  constructor(config: ComponentConfig) {
    super();
    this.config = config;
  }

  // ==================== 生命周期方法 ====================

  /**
   * 初始化组件
   * 加载配置、建立连接、初始化资源等
   */
  async initialize(): Promise<void> {
    try {
      this.setStatus(ComponentStatus.INITIALIZING);
      
      await this.onInitialize();
      
      this.setStatus(ComponentStatus.READY);
      this.emit(ComponentEvent.INITIALIZED, { component: this.config.id });
      
      console.log(`[${this.config.name}] 初始化完成`);
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  /**
   * 启动组件
   * 开始执行核心功能
   */
  async start(): Promise<void> {
    try {
      if (this.status !== ComponentStatus.READY && this.status !== ComponentStatus.PAUSED) {
        throw new Error(`无法启动组件，当前状态: ${this.status}`);
      }

      this.setStatus(ComponentStatus.RUNNING);
      this.startTime = new Date();
      
      await this.onStart();
      
      this.emit(ComponentEvent.STARTED, { component: this.config.id });
      
      console.log(`[${this.config.name}] 已启动`);
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  /**
   * 暂停组件
   * 暂停执行但保持状态
   */
  async pause(): Promise<void> {
    try {
      if (this.status !== ComponentStatus.RUNNING) {
        throw new Error(`无法暂停组件，当前状态: ${this.status}`);
      }

      this.setStatus(ComponentStatus.PAUSED);
      
      await this.onPause();
      
      this.emit(ComponentEvent.PAUSED, { component: this.config.id });
      
      console.log(`[${this.config.name}] 已暂停`);
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  /**
   * 恢复组件
   * 从暂停状态恢复执行
   */
  async resume(): Promise<void> {
    try {
      if (this.status !== ComponentStatus.PAUSED) {
        throw new Error(`无法恢复组件，当前状态: ${this.status}`);
      }

      this.setStatus(ComponentStatus.RUNNING);
      
      await this.onResume();
      
      this.emit(ComponentEvent.RESUMED, { component: this.config.id });
      
      console.log(`[${this.config.name}] 已恢复`);
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  /**
   * 停止组件
   * 停止执行并清理资源
   */
  async stop(): Promise<void> {
    try {
      this.setStatus(ComponentStatus.STOPPED);
      
      await this.onStop();
      
      this.emit(ComponentEvent.STOPPED, { component: this.config.id });
      
      console.log(`[${this.config.name}] 已停止`);
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  // ==================== 抽象方法（子类必须实现） ====================

  /**
   * 初始化钩子
   * 子类实现具体的初始化逻辑
   */
  protected abstract onInitialize(): Promise<void>;

  /**
   * 启动钩子
   * 子类实现具体的启动逻辑
   */
  protected abstract onStart(): Promise<void>;

  /**
   * 暂停钩子
   * 子类实现具体的暂停逻辑
   */
  protected abstract onPause(): Promise<void>;

  /**
   * 恢复钩子
   * 子类实现具体的恢复逻辑
   */
  protected abstract onResume(): Promise<void>;

  /**
   * 停止钩子
   * 子类实现具体的停止逻辑
   */
  protected abstract onStop(): Promise<void>;

  // ==================== 工具方法 ====================

  /**
   * 设置组件状态
   */
  protected setStatus(status: ComponentStatus): void {
    const oldStatus = this.status;
    this.status = status;
    
    this.emit(ComponentEvent.STATE_CHANGED, {
      component: this.config.id,
      oldStatus,
      newStatus: status
    });
  }

  /**
   * 处理错误
   */
  protected handleError(error: Error): void {
    this.setStatus(ComponentStatus.ERROR);
    this.metrics.errorCount++;
    this.metrics.lastError = error;
    
    this.emit(ComponentEvent.ERROR, {
      component: this.config.id,
      error
    });
    
    console.error(`[${this.config.name}] 错误:`, error);
  }

  /**
   * 更新指标
   */
  protected updateMetrics(metrics: Partial<ComponentMetrics>): void {
    this.metrics = { ...this.metrics, ...metrics };
  }

  /**
   * 记录请求
   */
  protected recordRequest(responseTime: number): void {
    this.metrics.requestCount++;
    
    // 更新平均响应时间
    this.metrics.avgResponseTime = 
      (this.metrics.avgResponseTime * (this.metrics.requestCount - 1) + responseTime) / 
      this.metrics.requestCount;
  }

  // ==================== 公共方法 ====================

  /**
   * 获取组件状态
   */
  getStatus(): ComponentStatus {
    return this.status;
  }

  /**
   * 获取组件配置
   */
  getConfig(): ComponentConfig {
    return { ...this.config };
  }

  /**
   * 获取组件指标
   */
  getMetrics(): ComponentMetrics {
    if (this.startTime) {
      this.metrics.uptime = Date.now() - this.startTime.getTime();
    }
    return { ...this.metrics };
  }

  /**
   * 检查组件是否就绪
   */
  isReady(): boolean {
    return this.status === ComponentStatus.READY || this.status === ComponentStatus.RUNNING;
  }

  /**
   * 检查组件是否运行中
   */
  isRunning(): boolean {
    return this.status === ComponentStatus.RUNNING;
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<boolean> {
    return this.isReady() && this.metrics.errorCount < 10;
  }
}

// ==================== 使用示例 ====================

/**
 * 示例：数据处理组件
 */
export class DataProcessorComponent extends YYC3Component {
  private processor: any;

  protected async onInitialize(): Promise<void> {
    // 初始化数据处理器
    this.processor = await this.createProcessor();
    console.log('数据处理器初始化完成');
  }

  protected async onStart(): Promise<void> {
    // 启动数据处理
    await this.processor.start();
    console.log('数据处理器已启动');
  }

  protected async onPause(): Promise<void> {
    // 暂停数据处理
    await this.processor.pause();
    console.log('数据处理器已暂停');
  }

  protected async onResume(): Promise<void> {
    // 恢复数据处理
    await this.processor.resume();
    console.log('数据处理器已恢复');
  }

  protected async onStop(): Promise<void> {
    // 停止并清理资源
    await this.processor.stop();
    this.processor = null;
    console.log('数据处理器已停止');
  }

  private async createProcessor(): Promise<any> {
    // 模拟创建处理器
    return {
      start: async () => {},
      pause: async () => {},
      resume: async () => {},
      stop: async () => {}
    };
  }

  /**
   * 业务方法：处理数据
   */
  async processData(data: any): Promise<any> {
    const startTime = Date.now();
    
    try {
      if (!this.isRunning()) {
        throw new Error('组件未运行');
      }

      // 处理逻辑
      const result = await this.processor.process(data);
      
      // 记录指标
      this.recordRequest(Date.now() - startTime);
      
      return result;
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }
}

// ==================== 导出 ====================

export default YYC3Component;
