/**
 * StreamProcessor - 流式数据处理组件
 * 
 * 负责实时流数据处理，包括：
 * - 流处理管道：数据摄取、转换、输出
 * - 复杂事件处理：模式检测、事件关联
 * - 窗口聚合：时间窗口、滑动窗口
 * - 状态管理：流状态维护和恢复
 * 
 * @author YYC³ AI开发团队
 * @version 1.0.0
 * @standard YYC³团队标准化规范 v1.1.0
 */

import { EventEmitter } from 'events';
import { LifecycleComponent } from '../ai-components/ComponentLifecycleManager';
import type { ComponentConfig, ComponentStatus } from '../ai-components/types';

// ==================== 类型定义 ====================

/**
 * 流处理器配置
 */
export interface StreamProcessorConfig {
  /** 摄取配置 */
  ingestion: {
    /** 批次大小 */
    batchSize: number;
    /** 批次超时（毫秒） */
    batchTimeout: number;
    /** 最大队列长度 */
    maxQueueLength: number;
  };
  
  /** 处理配置 */
  processing: {
    /** 并行度 */
    parallelism: number;
    /** 处理超时（毫秒） */
    timeout: number;
    /** 重试次数 */
    maxRetries: number;
  };
  
  /** 窗口配置 */
  windowing: {
    /** 默认窗口类型 */
    defaultType: 'tumbling' | 'sliding' | 'session';
    /** 默认窗口大小（毫秒） */
    defaultSize: number;
    /** 滑动步长（毫秒） */
    slideInterval?: number;
    /** 会话超时（毫秒） */
    sessionTimeout?: number;
  };
  
  /** 状态管理配置 */
  stateManagement: {
    /** 启用持久化 */
    enablePersistence: boolean;
    /** 检查点间隔（毫秒） */
    checkpointInterval: number;
    /** 最大状态大小（字节） */
    maxStateSize: number;
  };
  
  /** 性能配置 */
  performance: {
    /** 背压阈值 */
    backpressureThreshold: number;
    /** 缓冲区大小 */
    bufferSize: number;
  };
}

/**
 * 流事件
 */
export interface StreamEvent<T = any> {
  /** 事件ID */
  id: string;
  /** 事件类型 */
  type: string;
  /** 数据负载 */
  payload: T;
  /** 时间戳 */
  timestamp: Date;
  /** 元数据 */
  metadata?: Record<string, any>;
  /** 来源 */
  source?: string;
}

/**
 * 流管道
 */
export interface StreamPipeline {
  /** 管道ID */
  id: string;
  /** 管道名称 */
  name: string;
  /** 数据源 */
  sources: StreamSource[];
  /** 转换器 */
  transformers: StreamTransformer[];
  /** 输出 */
  sinks: StreamSink[];
  /** 配置 */
  config?: Partial<StreamProcessorConfig>;
}

/**
 * 流数据源
 */
export interface StreamSource {
  /** 源ID */
  id: string;
  /** 源类型 */
  type: 'kafka' | 'rabbitmq' | 'websocket' | 'http' | 'file' | 'custom';
  /** 配置 */
  config: Record<string, any>;
  /** 读取器 */
  reader: () => AsyncIterableIterator<StreamEvent>;
}

/**
 * 流转换器
 */
export interface StreamTransformer {
  /** 转换器ID */
  id: string;
  /** 转换器名称 */
  name: string;
  /** 转换函数 */
  transform: (event: StreamEvent) => Promise<StreamEvent | StreamEvent[] | null>;
  /** 过滤条件 */
  filter?: (event: StreamEvent) => boolean;
}

/**
 * 流输出
 */
export interface StreamSink {
  /** 输出ID */
  id: string;
  /** 输出类型 */
  type: 'database' | 'file' | 'api' | 'websocket' | 'custom';
  /** 配置 */
  config: Record<string, any>;
  /** 写入器 */
  writer: (events: StreamEvent[]) => Promise<void>;
}

/**
 * 窗口定义
 */
export interface WindowDefinition {
  /** 窗口ID */
  id: string;
  /** 窗口类型 */
  type: 'tumbling' | 'sliding' | 'session';
  /** 窗口大小（毫秒） */
  size: number;
  /** 滑动步长（毫秒，仅sliding） */
  slide?: number;
  /** 会话超时（毫秒，仅session） */
  sessionTimeout?: number;
  /** 聚合函数 */
  aggregator: (events: StreamEvent[]) => any;
  /** 触发条件 */
  trigger?: 'count' | 'time' | 'custom';
}

/**
 * 窗口结果
 */
export interface WindowResult {
  /** 窗口ID */
  windowId: string;
  /** 开始时间 */
  startTime: Date;
  /** 结束时间 */
  endTime: Date;
  /** 事件数量 */
  eventCount: number;
  /** 聚合结果 */
  aggregatedValue: any;
  /** 元数据 */
  metadata?: Record<string, any>;
}

/**
 * 事件模式
 */
export interface EventPattern {
  /** 模式ID */
  id: string;
  /** 模式名称 */
  name: string;
  /** 模式类型 */
  type: 'sequence' | 'conjunction' | 'disjunction' | 'negation';
  /** 事件条件 */
  conditions: PatternCondition[];
  /** 时间约束（毫秒） */
  timeConstraint?: number;
  /** 匹配处理器 */
  handler: (matchedEvents: StreamEvent[]) => void;
}

/**
 * 模式条件
 */
export interface PatternCondition {
  /** 事件类型 */
  eventType: string;
  /** 条件函数 */
  predicate: (event: StreamEvent) => boolean;
  /** 可选 */
  optional?: boolean;
}

/**
 * 流状态
 */
export interface StreamState {
  /** 状态键 */
  key: string;
  /** 状态值 */
  value: any;
  /** 更新时间 */
  updatedAt: Date;
  /** 版本 */
  version: number;
}

/**
 * 检查点
 */
export interface Checkpoint {
  /** 检查点ID */
  id: string;
  /** 管道ID */
  pipelineId: string;
  /** 状态快照 */
  stateSnapshot: Map<string, StreamState>;
  /** 偏移量 */
  offsets: Map<string, number>;
  /** 时间戳 */
  timestamp: Date;
}

/**
 * 流统计
 */
export interface StreamStats {
  /** 总事件数 */
  totalEvents: number;
  /** 处理事件数 */
  processedEvents: number;
  /** 失败事件数 */
  failedEvents: number;
  /** 平均延迟（毫秒） */
  averageLatency: number;
  /** 吞吐量（事件/秒） */
  throughput: number;
  /** 背压状态 */
  backpressure: boolean;
}

// ==================== 主类实现 ====================

/**
 * 流处理器
 * 负责实时流数据的摄取、处理和输出
 */
export class StreamProcessor extends EventEmitter implements LifecycleComponent {
  public id: string = 'stream-processor';
  public name: string = 'StreamProcessor';
  public status: ComponentStatus = 'idle';
  public config: ComponentConfig;
  private streamProcessorConfig: StreamProcessorConfig;
  private pipelines: Map<string, StreamPipeline>;
  private windows: Map<string, WindowManager>;
  private patterns: Map<string, EventPattern>;
  private stateStore: StateStore;
  private ingestionEngine: IngestionEngine;
  private transformationEngine: TransformationEngine;
  private windowEngine: WindowEngine;
  private patternMatcher: PatternMatcher;
  private outputEngine: OutputEngine;
  private stats: StreamStats;
  private running: boolean;

  constructor(config: StreamProcessorConfig, componentConfig?: Partial<ComponentConfig>) {
    super();
    this.streamProcessorConfig = config;
    this.pipelines = new Map();
    this.windows = new Map();
    this.patterns = new Map();
    this.running = false;
    
    // 初始化组件配置
    this.config = {
      id: this.id,
      name: this.name,
      enabled: true,
      autoStart: true,
      dependencies: [],
      priority: 0,
      timeout: 30000,
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
      },
      ...componentConfig
    };
    
    // 初始化统计
    this.stats = {
      totalEvents: 0,
      processedEvents: 0,
      failedEvents: 0,
      averageLatency: 0,
      throughput: 0,
      backpressure: false
    };
    
    // 初始化内部组件
    this.stateStore = new StateStore(config.stateManagement);
    this.ingestionEngine = new IngestionEngine(config.ingestion);
    this.transformationEngine = new TransformationEngine(config.processing);
    this.windowEngine = new WindowEngine(config.windowing);
    this.patternMatcher = new PatternMatcher();
    this.outputEngine = new OutputEngine(config.processing);
  }

  /**
   * 初始化
   */
  public async initialize(config?: Partial<ComponentConfig>): Promise<void> {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    
    this.status = 'ready';
    
    // 设置检查点定时器
    if (this.streamProcessorConfig.stateManagement.enablePersistence) {
      setInterval(() => {
        this.createCheckpoint();
      }, this.streamProcessorConfig.stateManagement.checkpointInterval);
    }
    
    // 设置统计更新定时器
    setInterval(() => {
      this.updateStats();
    }, 1000);
    
    this.emit('processor:initialized');
    this.emit('initialized');
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
    this.emit('processor:destroyed');
    this.emit('destroyed');
    this.removeAllListeners();
    
    // 清理资源
    await this.shutdown();
  }

  // ==================== 管道管理 ====================

  /**
   * 创建管道
   */
  public createPipeline(pipeline: StreamPipeline): void {
    this.validatePipeline(pipeline);
    this.pipelines.set(pipeline.id, pipeline);
    this.emit('pipeline:created', { pipelineId: pipeline.id });
  }

  /**
   * 删除管道
   */
  public deletePipeline(pipelineId: string): void {
    if (!this.pipelines.has(pipelineId)) {
      throw new Error(`管道不存在: ${pipelineId}`);
    }
    
    this.pipelines.delete(pipelineId);
    this.emit('pipeline:deleted', { pipelineId });
  }

  /**
   * 获取管道
   */
  public getPipeline(pipelineId: string): StreamPipeline | undefined {
    return this.pipelines.get(pipelineId);
  }

  /**
   * 列出所有管道
   */
  public listPipelines(): StreamPipeline[] {
    return Array.from(this.pipelines.values());
  }

  /**
   * 验证管道
   */
  private validatePipeline(pipeline: StreamPipeline): void {
    if (!pipeline.id || !pipeline.name) {
      throw new Error('管道必须有ID和名称');
    }
    if (!pipeline.sources || pipeline.sources.length === 0) {
      throw new Error('管道必须至少有一个数据源');
    }
  }

  // ==================== 流处理 ====================

  /**
   * 启动处理
   */
  public async start(pipelineId?: string): Promise<void> {
    if (this.running) {
      throw new Error('处理器已在运行');
    }
    
    this.status = 'running';
    this.running = true;
    this.emit('processor:started');
    this.emit('started');
    
    const targetPipelines = pipelineId
      ? [this.pipelines.get(pipelineId)!]
      : Array.from(this.pipelines.values());
    
    for (const pipeline of targetPipelines) {
      this.processPipeline(pipeline);
    }
  }

  /**
   * 停止处理
   */
  public async stop(): Promise<void> {
    if (!this.running) {
      throw new Error('处理器未运行');
    }
    
    this.status = 'idle';
    this.running = false;
    
    // 创建最终检查点
    await this.createCheckpoint();
    
    this.emit('processor:stopped');
    this.emit('stopped');
  }

  /**
   * 处理管道
   */
  private async processPipeline(pipeline: StreamPipeline): Promise<void> {
    for (const source of pipeline.sources) {
      this.processSource(pipeline, source);
    }
  }

  /**
   * 处理数据源
   */
  private async processSource(pipeline: StreamPipeline, source: StreamSource): Promise<void> {
    try {
      const eventIterator = source.reader();
      
      for await (const event of eventIterator) {
        if (!this.running) break;
        
        await this.processEvent(pipeline, event);
      }
    } catch (error) {
      this.emit('source:error', { sourceId: source.id, error });
    }
  }

  /**
   * 处理单个事件
   */
  private async processEvent(pipeline: StreamPipeline, event: StreamEvent): Promise<void> {
    const startTime = Date.now();
    this.stats.totalEvents++;
    
    try {
      // 检查背压
      if (this.checkBackpressure()) {
        await this.handleBackpressure();
      }
      
      // 摄取
      const ingestedEvents = await this.ingestionEngine.ingest([event]);
      
      // 转换
      let transformedEvents: StreamEvent[] = [];
      for (const evt of ingestedEvents) {
        const results = await this.transformationEngine.transform(
          evt,
          pipeline.transformers
        );
        transformedEvents.push(...results);
      }
      
      // 窗口处理
      for (const evt of transformedEvents) {
        await this.processWindows(evt);
      }
      
      // 模式匹配
      for (const evt of transformedEvents) {
        await this.matchPatterns(evt);
      }
      
      // 输出
      if (transformedEvents.length > 0 && pipeline.sinks.length > 0) {
        await this.outputEngine.write(transformedEvents, pipeline.sinks);
      }
      
      this.stats.processedEvents++;
      
      // 更新延迟
      const latency = Date.now() - startTime;
      this.updateLatency(latency);
      
      this.emit('event:processed', { eventId: event.id, latency });
    } catch (error) {
      this.stats.failedEvents++;
      this.emit('event:failed', { eventId: event.id, error });
    }
  }

  /**
   * 提交事件
   */
  public async submitEvent(event: StreamEvent, pipelineId?: string): Promise<void> {
    const targetPipelines = pipelineId
      ? [this.pipelines.get(pipelineId)!]
      : Array.from(this.pipelines.values());
    
    for (const pipeline of targetPipelines) {
      await this.processEvent(pipeline, event);
    }
  }

  /**
   * 批量提交事件
   */
  public async submitBatch(events: StreamEvent[], pipelineId?: string): Promise<void> {
    for (const event of events) {
      await this.submitEvent(event, pipelineId);
    }
  }

  // ==================== 窗口处理 ====================

  /**
   * 定义窗口
   */
  public defineWindow(definition: WindowDefinition): void {
    const manager = new WindowManager(definition);
    this.windows.set(definition.id, manager);
    this.emit('window:defined', { windowId: definition.id });
  }

  /**
   * 删除窗口
   */
  public deleteWindow(windowId: string): void {
    if (!this.windows.has(windowId)) {
      throw new Error(`窗口不存在: ${windowId}`);
    }
    
    this.windows.delete(windowId);
    this.emit('window:deleted', { windowId });
  }

  /**
   * 处理窗口
   */
  private async processWindows(event: StreamEvent): Promise<void> {
    for (const [windowId, manager] of this.windows) {
      const result = manager.addEvent(event);
      if (result) {
        this.emit('window:triggered', { windowId, result });
      }
    }
  }

  // ==================== 模式匹配 ====================

  /**
   * 注册模式
   */
  public registerPattern(pattern: EventPattern): void {
    this.patterns.set(pattern.id, pattern);
    this.patternMatcher.addPattern(pattern);
    this.emit('pattern:registered', { patternId: pattern.id });
  }

  /**
   * 注销模式
   */
  public unregisterPattern(patternId: string): void {
    if (!this.patterns.has(patternId)) {
      throw new Error(`模式不存在: ${patternId}`);
    }
    
    this.patterns.delete(patternId);
    this.patternMatcher.removePattern(patternId);
    this.emit('pattern:unregistered', { patternId });
  }

  /**
   * 匹配模式
   */
  private async matchPatterns(event: StreamEvent): Promise<void> {
    const matches = this.patternMatcher.match(event);
    
    for (const match of matches) {
      this.emit('pattern:matched', { 
        patternId: match.pattern.id,
        events: match.events 
      });
      
      // 执行处理器
      try {
        await match.pattern.handler(match.events);
      } catch (error) {
        this.emit('pattern:handler:error', { patternId: match.pattern.id, error });
      }
    }
  }

  // ==================== 状态管理 ====================

  /**
   * 获取状态
   */
  public getState(key: string): StreamState | undefined {
    return this.stateStore.get(key);
  }

  /**
   * 设置状态
   */
  public setState(key: string, value: any): void {
    this.stateStore.set(key, value);
    this.emit('state:updated', { key });
  }

  /**
   * 删除状态
   */
  public deleteState(key: string): void {
    this.stateStore.delete(key);
    this.emit('state:deleted', { key });
  }

  /**
   * 创建检查点
   */
  private async createCheckpoint(): Promise<Checkpoint> {
    const checkpoint: Checkpoint = {
      id: this.generateId(),
      pipelineId: 'all',
      stateSnapshot: this.stateStore.snapshot(),
      offsets: new Map(),
      timestamp: new Date()
    };
    
    if (this.streamProcessorConfig.stateManagement.enablePersistence) {
      await this.persistCheckpoint(checkpoint);
    }
    
    this.emit('checkpoint:created', { checkpointId: checkpoint.id });
    return checkpoint;
  }

  /**
   * 持久化检查点
   */
  private async persistCheckpoint(checkpoint: Checkpoint): Promise<void> {
    // 简化实现：实际应保存到持久化存储
    this.emit('checkpoint:persisted', { checkpointId: checkpoint.id });
  }

  /**
   * 恢复检查点
   */
  public async restoreCheckpoint(checkpointId: string): Promise<void> {
    // 简化实现：实际应从持久化存储加载
    this.emit('checkpoint:restored', { checkpointId });
  }

  // ==================== 性能管理 ====================

  /**
   * 检查背压
   */
  private checkBackpressure(): boolean {
    const queueLength = this.ingestionEngine.getQueueLength();
    const threshold = this.streamProcessorConfig.performance.backpressureThreshold;
    
    this.stats.backpressure = queueLength > threshold;
    return this.stats.backpressure;
  }

  /**
   * 处理背压
   */
  private async handleBackpressure(): Promise<void> {
    this.emit('backpressure:detected');
    
    // 等待队列减少
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * 更新延迟
   */
  private updateLatency(latency: number): void {
    // 指数移动平均
    const alpha = 0.1;
    this.stats.averageLatency = 
      alpha * latency + (1 - alpha) * this.stats.averageLatency;
  }

  /**
   * 更新统计
   */
  private updateStats(): void {
    // 计算吞吐量（事件/秒）
    this.stats.throughput = this.stats.processedEvents; // 简化
    
    this.emit('stats:updated', { stats: this.stats });
  }

  /**
   * 获取统计信息
   */
  public getStats(): StreamStats {
    return { ...this.stats };
  }

  // ==================== 工具方法 ====================

  /**
   * 生成ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 关闭
   */
  public async shutdown(): Promise<void> {
    if (this.running) {
      await this.stop();
    }
    
    this.emit('processor:shutdown');
    this.removeAllListeners();
  }
}

// ==================== 内部服务类 ====================

/**
 * 摄取引擎
 */
class IngestionEngine {
  private queue: StreamEvent[];
  
  constructor(private config: StreamProcessorConfig['ingestion']) {
    this.queue = [];
  }

  async ingest(events: StreamEvent[]): Promise<StreamEvent[]> {
    // 添加到队列
    this.queue.push(...events);
    
    // 检查队列长度
    if (this.queue.length > this.config.maxQueueLength) {
      throw new Error('队列已满');
    }
    
    // 返回事件
    const result = [...events];
    this.queue = this.queue.filter(e => !events.includes(e));
    
    return result;
  }

  getQueueLength(): number {
    return this.queue.length;
  }
}

/**
 * 转换引擎
 */
class TransformationEngine {
  constructor(private config: StreamProcessorConfig['processing']) {}

  async transform(
    event: StreamEvent,
    transformers: StreamTransformer[]
  ): Promise<StreamEvent[]> {
    let results: StreamEvent[] = [event];
    
    for (const transformer of transformers) {
      // 应用过滤器
      if (transformer.filter && !transformer.filter(event)) {
        continue;
      }
      
      // 应用转换
      const newResults: StreamEvent[] = [];
      for (const evt of results) {
        const transformed = await transformer.transform(evt);
        if (transformed) {
          if (Array.isArray(transformed)) {
            newResults.push(...transformed);
          } else {
            newResults.push(transformed);
          }
        }
      }
      
      results = newResults;
    }
    
    return results;
  }
}

/**
 * 窗口引擎
 */
class WindowEngine {
  constructor(private config: StreamProcessorConfig['windowing']) {}
}

/**
 * 窗口管理器
 */
class WindowManager {
  private events: StreamEvent[];
  private lastTriggerTime: Date;
  
  constructor(private definition: WindowDefinition) {
    this.events = [];
    this.lastTriggerTime = new Date();
  }

  addEvent(event: StreamEvent): WindowResult | null {
    this.events.push(event);
    
    // 检查触发条件
    if (this.shouldTrigger()) {
      return this.trigger();
    }
    
    return null;
  }

  private shouldTrigger(): boolean {
    const now = new Date();
    const elapsed = now.getTime() - this.lastTriggerTime.getTime();
    
    if (this.definition.type === 'tumbling') {
      return elapsed >= this.definition.size;
    } else if (this.definition.type === 'sliding') {
      return elapsed >= (this.definition.slide || this.definition.size);
    } else if (this.definition.type === 'session') {
      return elapsed >= (this.definition.sessionTimeout || 60000);
    }
    
    return false;
  }

  private trigger(): WindowResult {
    const startTime = this.lastTriggerTime;
    const endTime = new Date();
    const aggregatedValue = this.definition.aggregator(this.events);
    
    const result: WindowResult = {
      windowId: this.definition.id,
      startTime,
      endTime,
      eventCount: this.events.length,
      aggregatedValue
    };
    
    // 清空事件（tumbling）或保留部分（sliding）
    if (this.definition.type === 'tumbling') {
      this.events = [];
    }
    
    this.lastTriggerTime = endTime;
    return result;
  }
}

/**
 * 模式匹配器
 */
class PatternMatcher {
  private patterns: EventPattern[];
  private eventBuffer: StreamEvent[];
  
  constructor() {
    this.patterns = [];
    this.eventBuffer = [];
  }

  addPattern(pattern: EventPattern): void {
    this.patterns.push(pattern);
  }

  removePattern(patternId: string): void {
    this.patterns = this.patterns.filter(p => p.id !== patternId);
  }

  match(event: StreamEvent): Array<{ pattern: EventPattern; events: StreamEvent[] }> {
    this.eventBuffer.push(event);
    
    // 限制缓冲区大小
    if (this.eventBuffer.length > 1000) {
      this.eventBuffer.shift();
    }
    
    const matches: Array<{ pattern: EventPattern; events: StreamEvent[] }> = [];
    
    for (const pattern of this.patterns) {
      const matchedEvents = this.matchPattern(pattern);
      if (matchedEvents) {
        matches.push({ pattern, events: matchedEvents });
      }
    }
    
    return matches;
  }

  private matchPattern(pattern: EventPattern): StreamEvent[] | null {
    if (pattern.type === 'sequence') {
      return this.matchSequence(pattern);
    } else if (pattern.type === 'conjunction') {
      return this.matchConjunction(pattern);
    }
    
    return null;
  }

  private matchSequence(pattern: EventPattern): StreamEvent[] | null {
    const matched: StreamEvent[] = [];
    let conditionIndex = 0;
    
    for (const event of this.eventBuffer) {
      const condition = pattern.conditions[conditionIndex];
      
      if (event.type === condition.eventType && condition.predicate(event)) {
        matched.push(event);
        conditionIndex++;
        
        if (conditionIndex === pattern.conditions.length) {
          return matched;
        }
      }
    }
    
    return null;
  }

  private matchConjunction(pattern: EventPattern): StreamEvent[] | null {
    const matched: StreamEvent[] = [];
    
    for (const condition of pattern.conditions) {
      const event = this.eventBuffer.find(
        e => e.type === condition.eventType && condition.predicate(e)
      );
      
      if (!event && !condition.optional) {
        return null;
      }
      
      if (event) {
        matched.push(event);
      }
    }
    
    return matched.length > 0 ? matched : null;
  }
}

/**
 * 输出引擎
 */
class OutputEngine {
  constructor(private config: StreamProcessorConfig['processing']) {}

  async write(events: StreamEvent[], sinks: StreamSink[]): Promise<void> {
    for (const sink of sinks) {
      try {
        await sink.writer(events);
      } catch (error) {
        // 记录错误但继续其他输出
        console.error(`输出失败 (${sink.id}):`, error);
      }
    }
  }
}

/**
 * 状态存储
 */
class StateStore {
  private store: Map<string, StreamState>;
  
  constructor(private config: StreamProcessorConfig['stateManagement']) {
    this.store = new Map();
  }

  get(key: string): StreamState | undefined {
    return this.store.get(key);
  }

  set(key: string, value: any): void {
    const existing = this.store.get(key);
    const version = existing ? existing.version + 1 : 1;
    
    this.store.set(key, {
      key,
      value,
      updatedAt: new Date(),
      version
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  snapshot(): Map<string, StreamState> {
    return new Map(this.store);
  }
}
