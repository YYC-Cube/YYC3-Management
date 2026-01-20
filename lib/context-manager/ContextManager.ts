/**
 * ContextManager - 上下文管理组件
 * 
 * 负责管理AI系统的上下文信息，包括：
 * - 多级记忆：短期、长期、工作、情景记忆
 * - 上下文检索：智能查找相关上下文
 * - 上下文压缩：减少存储和传输成本
 * - 相关性评估：评估上下文的重要性
 * 
 * @author YYC³ AI开发团队
 * @version 1.0.0
 * @standard YYC³团队标准化规范 v1.1.0
 */

import { EventEmitter } from 'events';
import type { LifecycleComponent, ComponentConfig } from '../ai-components/ComponentLifecycleManager';
import type { ComponentStatus } from '../ai-components/types';

// ==================== 类型定义 ====================

/**
 * 上下文管理器配置
 */
export interface ContextManagerConfig {
  /** 短期记忆配置 */
  shortTermMemory: {
    /** 最大条目数 */
    maxEntries: number;
    /** 过期时间（毫秒） */
    ttl: number;
  };
  
  /** 长期记忆配置 */
  longTermMemory: {
    /** 启用持久化 */
    enablePersistence: boolean;
    /** 最大大小（字节） */
    maxSize: number;
    /** 索引类型 */
    indexType: 'hash' | 'btree' | 'vector';
  };
  
  /** 工作记忆配置 */
  workingMemory: {
    /** 缓冲区大小 */
    bufferSize: number;
    /** 刷新间隔（毫秒） */
    flushInterval: number;
  };
  
  /** 压缩配置 */
  compression: {
    /** 启用压缩 */
    enabled: boolean;
    /** 压缩算法 */
    algorithm: 'summarize' | 'deduplicate' | 'truncate';
    /** 压缩比 */
    ratio: number;
  };
  
  /** 检索配置 */
  retrieval: {
    /** 最大结果数 */
    maxResults: number;
    /** 相似度阈值 */
    similarityThreshold: number;
    /** 检索策略 */
    strategy: 'recency' | 'relevance' | 'hybrid';
  };
}

/**
 * 上下文条目
 */
export interface ContextEntry {
  /** 条目ID */
  id: string;
  /** 类型 */
  type: 'message' | 'action' | 'state' | 'metadata';
  /** 内容 */
  content: any;
  /** 向量表示 */
  embedding?: number[];
  /** 元数据 */
  metadata: {
    /** 用户ID */
    userId?: string;
    /** 会话ID */
    sessionId?: string;
    /** 来源 */
    source?: string;
    /** 标签 */
    tags?: string[];
    /** 重要性分数 */
    importance?: number;
  };
  /** 创建时间 */
  createdAt: Date;
  /** 访问时间 */
  accessedAt: Date;
  /** 访问次数 */
  accessCount: number;
}

/**
 * 上下文查询
 */
export interface ContextQuery {
  /** 查询文本 */
  query: string;
  /** 向量表示 */
  embedding?: number[];
  /** 过滤器 */
  filter?: {
    type?: ContextEntry['type'];
    userId?: string;
    sessionId?: string;
    tags?: string[];
    dateRange?: {
      start: Date;
      end: Date;
    };
  };
  /** 最大结果数 */
  maxResults?: number;
  /** 包含上下文 */
  includeContext?: boolean;
}

/**
 * 上下文检索结果
 */
export interface ContextRetrievalResult {
  /** 条目 */
  entry: ContextEntry;
  /** 相似度分数 */
  score: number;
  /** 排名 */
  rank: number;
  /** 相关性解释 */
  explanation?: string;
}

/**
 * 上下文窗口
 */
export interface ContextWindow {
  /** 窗口ID */
  id: string;
  /** 条目列表 */
  entries: ContextEntry[];
  /** 总token数 */
  totalTokens: number;
  /** 时间范围 */
  timeRange: {
    start: Date;
    end: Date;
  };
  /** 元数据 */
  metadata?: Record<string, any>;
}

/**
 * 压缩结果
 */
export interface CompressionResult {
  /** 原始条目数 */
  originalCount: number;
  /** 压缩后条目数 */
  compressedCount: number;
  /** 压缩后的条目 */
  entries: ContextEntry[];
  /** 压缩比 */
  ratio: number;
  /** 信息损失估计 */
  informationLoss: number;
}

/**
 * 记忆统计
 */
export interface MemoryStats {
  /** 短期记忆统计 */
  shortTerm: {
    count: number;
    size: number;
  };
  /** 长期记忆统计 */
  longTerm: {
    count: number;
    size: number;
  };
  /** 工作记忆统计 */
  working: {
    count: number;
    size: number;
  };
  /** 总计 */
  total: {
    count: number;
    size: number;
  };
}

// ==================== 主类实现 ====================

/**
 * 上下文管理器
 * 负责管理AI系统的多级记忆和上下文
 */
export class ContextManager extends EventEmitter implements LifecycleComponent {
  readonly id: string;
  readonly name: string;
  private contextManagerConfig: ContextManagerConfig;
  private shortTermMemory: ShortTermMemory;
  private longTermMemory: LongTermMemory;
  private workingMemory: WorkingMemory;
  private compressionEngine: CompressionEngine;
  private retrievalEngine: RetrievalEngine;
  private relevanceScorer: RelevanceScorer;
  private status: ComponentStatus = 'idle';
  private timers: NodeJS.Timeout[] = [];

  private _config: ComponentConfig;
  
  constructor(config: ContextManagerConfig) {
    super();
    this.id = 'context-manager';
    this.name = 'ContextManager';
    this.contextManagerConfig = config;
    
    // Initialize ComponentConfig with default values
    this._config = {
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
        enabled: true,
        interval: 5000,
        retention: 3600000
      }
    };
    
    // Initialize memory systems (basic initialization)
    this.shortTermMemory = new ShortTermMemory(config.shortTermMemory);
    this.longTermMemory = new LongTermMemory(config.longTermMemory);
    this.workingMemory = new WorkingMemory(config.workingMemory);
    
    // Initialize engines
    this.compressionEngine = new CompressionEngine(config.compression);
    this.retrievalEngine = new RetrievalEngine(config.retrieval);
    this.relevanceScorer = new RelevanceScorer();
  }

  /**
   * 初始化（内部）
   */
  private initializeInternal(): void {
    // 设置短期记忆清理定时器
    const cleanupTimer = setInterval(() => {
      this.cleanupShortTermMemory();
    }, this.contextManagerConfig.shortTermMemory.ttl);
    this.timers.push(cleanupTimer);
    
    // 设置工作记忆刷新定时器
    const flushTimer = setInterval(() => {
      this.flushWorkingMemory();
    }, this.contextManagerConfig.workingMemory.flushInterval);
    this.timers.push(flushTimer);
  }

  get config(): ComponentConfig {
    return this._config;
  }

  // ==================== 上下文维护 ====================

  /**
   * 添加上下文
   */
  public async addContext(
    content: any,
    type: ContextEntry['type'],
    metadata?: ContextEntry['metadata']
  ): Promise<string> {
    const entry: ContextEntry = {
      id: this.generateId(),
      type,
      content,
      metadata: metadata || {},
      createdAt: new Date(),
      accessedAt: new Date(),
      accessCount: 0
    };
    
    // 生成向量表示
    if (typeof content === 'string') {
      entry.embedding = await this.generateEmbedding(content);
    }
    
    // 计算重要性
    entry.metadata.importance = this.calculateImportance(entry);
    
    // 添加到工作记忆
    this.workingMemory.add(entry);
    
    // 如果重要度高，直接加入短期记忆
    if (entry.metadata.importance && entry.metadata.importance > 0.7) {
      this.shortTermMemory.add(entry);
    }
    
    this.emit('context:added', { entryId: entry.id, type });
    return entry.id;
  }

  /**
   * 更新上下文
   */
  public async updateContext(
    entryId: string,
    updates: Partial<Pick<ContextEntry, 'content' | 'metadata'>>
  ): Promise<void> {
    // 尝试从各个记忆层查找
    const entry = this.shortTermMemory.get(entryId)
      || this.longTermMemory.get(entryId)
      || this.workingMemory.get(entryId);
    
    if (!entry) {
      throw new Error(`上下文不存在: ${entryId}`);
    }
    
    // 更新内容
    if (updates.content !== undefined) {
      entry.content = updates.content;
      if (typeof updates.content === 'string') {
        entry.embedding = await this.generateEmbedding(updates.content);
      }
    }
    
    // 更新元数据
    if (updates.metadata) {
      entry.metadata = { ...entry.metadata, ...updates.metadata };
    }
    
    this.emit('context:updated', { entryId });
  }

  /**
   * 删除上下文
   */
  public deleteContext(entryId: string): void {
    this.shortTermMemory.delete(entryId);
    this.longTermMemory.delete(entryId);
    this.workingMemory.delete(entryId);
    
    this.emit('context:deleted', { entryId });
  }

  /**
   * 获取上下文
   */
  public getContext(entryId: string): ContextEntry | undefined {
    const entry = this.shortTermMemory.get(entryId)
      || this.longTermMemory.get(entryId)
      || this.workingMemory.get(entryId);
    
    if (entry) {
      // 更新访问信息
      entry.accessedAt = new Date();
      entry.accessCount++;
    }
    
    return entry;
  }

  // ==================== 上下文检索 ====================

  /**
   * 检索上下文
   */
  public async retrieveContext(query: ContextQuery): Promise<ContextRetrievalResult[]> {
    this.emit('retrieval:started', { query: query.query });
    
    // 生成查询向量
    let queryEmbedding = query.embedding;
    if (!queryEmbedding && query.query) {
      queryEmbedding = await this.generateEmbedding(query.query);
    }
    
    // 收集所有候选条目
    let candidates: ContextEntry[] = [
      ...this.shortTermMemory.getAll(),
      ...this.longTermMemory.getAll(),
      ...this.workingMemory.getAll()
    ];
    
    // 应用过滤器
    if (query.filter) {
      candidates = this.applyFilter(candidates, query.filter);
    }
    
    // 计算相似度并排序
    const results = this.retrievalEngine.retrieve(
      candidates,
      queryEmbedding || [],
      query.query,
      this.contextManagerConfig.retrieval.strategy
    );
    
    // 限制结果数量
    const maxResults = query.maxResults || this.contextManagerConfig.retrieval.maxResults;
    const topResults = results.slice(0, maxResults);
    
    this.emit('retrieval:completed', { 
      query: query.query,
      resultCount: topResults.length 
    });
    
    return topResults;
  }

  /**
   * 应用过滤器
   */
  private applyFilter(
    entries: ContextEntry[],
    filter: NonNullable<ContextQuery['filter']>
  ): ContextEntry[] {
    return entries.filter(entry => {
      if (filter.type && entry.type !== filter.type) {
        return false;
      }
      
      if (filter.userId && entry.metadata.userId !== filter.userId) {
        return false;
      }
      
      if (filter.sessionId && entry.metadata.sessionId !== filter.sessionId) {
        return false;
      }
      
      if (filter.tags && filter.tags.length > 0) {
        const entryTags = entry.metadata.tags || [];
        if (!filter.tags.some(tag => entryTags.includes(tag))) {
          return false;
        }
      }
      
      if (filter.dateRange) {
        const entryTime = entry.createdAt.getTime();
        const startTime = filter.dateRange.start.getTime();
        const endTime = filter.dateRange.end.getTime();
        if (entryTime < startTime || entryTime > endTime) {
          return false;
        }
      }
      
      return true;
    });
  }

  /**
   * 获取上下文窗口
   */
  public getContextWindow(
    sessionId: string,
    maxTokens?: number
  ): ContextWindow {
    // 获取会话相关的所有上下文
    const entries = [
      ...this.shortTermMemory.getAll(),
      ...this.longTermMemory.getAll(),
      ...this.workingMemory.getAll()
    ].filter(e => e.metadata.sessionId === sessionId);
    
    // 按时间排序
    entries.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    // 计算token数（简化：按字符数估算）
    let totalTokens = 0;
    const selectedEntries: ContextEntry[] = [];
    
    const max = maxTokens || 4000;
    for (const entry of entries.reverse()) { // 从最新的开始
      const tokens = this.estimateTokens(entry.content);
      if (totalTokens + tokens > max) {
        break;
      }
      selectedEntries.unshift(entry);
      totalTokens += tokens;
    }
    
    return {
      id: this.generateId(),
      entries: selectedEntries,
      totalTokens,
      timeRange: {
        start: selectedEntries[0]?.createdAt || new Date(),
        end: selectedEntries[selectedEntries.length - 1]?.createdAt || new Date()
      }
    };
  }

  // ==================== 上下文压缩 ====================

  /**
   * 压缩上下文
   */
  public async compressContext(entries: ContextEntry[]): Promise<CompressionResult> {
    this.emit('compression:started', { entryCount: entries.length });
    
    const result = await this.compressionEngine.compress(entries);
    
    this.emit('compression:completed', { 
      originalCount: result.originalCount,
      compressedCount: result.compressedCount,
      ratio: result.ratio
    });
    
    return result;
  }

  /**
   * 压缩会话上下文
   */
  public async compressSession(sessionId: string): Promise<CompressionResult> {
    const entries = [
      ...this.shortTermMemory.getAll(),
      ...this.workingMemory.getAll()
    ].filter(e => e.metadata.sessionId === sessionId);
    
    const result = await this.compressContext(entries);
    
    // 用压缩后的条目替换原始条目
    entries.forEach(e => {
      this.shortTermMemory.delete(e.id);
      this.workingMemory.delete(e.id);
    });
    
    result.entries.forEach(e => {
      this.shortTermMemory.add(e);
    });
    
    return result;
  }

  // ==================== 记忆管理 ====================

  /**
   * 巩固记忆
   * 将重要的短期记忆移至长期记忆
   */
  public async consolidateMemory(): Promise<void> {
    this.emit('consolidation:started');
    
    const shortTermEntries = this.shortTermMemory.getAll();
    let consolidatedCount = 0;
    
    for (const entry of shortTermEntries) {
      // 检查是否应该巩固
      if (this.shouldConsolidate(entry)) {
        this.longTermMemory.add(entry);
        this.shortTermMemory.delete(entry.id);
        consolidatedCount++;
      }
    }
    
    this.emit('consolidation:completed', { count: consolidatedCount });
  }

  /**
   * 判断是否应该巩固
   */
  private shouldConsolidate(entry: ContextEntry): boolean {
    // 基于重要性、访问频率等
    const importance = entry.metadata.importance || 0;
    const accessFrequency = entry.accessCount / 
      Math.max((Date.now() - entry.createdAt.getTime()) / (1000 * 60 * 60), 1);
    
    return importance > 0.6 || accessFrequency > 5;
  }

  /**
   * 清理短期记忆
   */
  private cleanupShortTermMemory(): void {
    const now = Date.now();
    const ttl = this.contextManagerConfig.shortTermMemory.ttl;
    const entries = this.shortTermMemory.getAll();
    
    let cleanedCount = 0;
    for (const entry of entries) {
      const age = now - entry.createdAt.getTime();
      if (age > ttl) {
        // 尝试巩固到长期记忆
        if (this.shouldConsolidate(entry)) {
          this.longTermMemory.add(entry);
        }
        this.shortTermMemory.delete(entry.id);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      this.emit('cleanup:completed', { count: cleanedCount });
    }
  }

  /**
   * 刷新工作记忆
   */
  private flushWorkingMemory(): void {
    const entries = this.workingMemory.getAll();
    
    for (const entry of entries) {
      // 移至短期记忆
      this.shortTermMemory.add(entry);
    }
    
    this.workingMemory.clear();
    
    if (entries.length > 0) {
      this.emit('flush:completed', { count: entries.length });
    }
  }

  /**
   * 清空所有记忆
   */
  public clearAll(sessionId?: string): void {
    if (sessionId) {
      // 清空特定会话
      const filter = (e: ContextEntry) => e.metadata.sessionId === sessionId;
      this.shortTermMemory.clear(filter);
      this.longTermMemory.clear(filter);
      this.workingMemory.clear(filter);
      this.emit('memory:cleared', { sessionId });
    } else {
      // 清空所有
      this.shortTermMemory.clear();
      this.longTermMemory.clear();
      this.workingMemory.clear();
      this.emit('memory:cleared', { all: true });
    }
  }

  // ==================== 统计与监控 ====================

  /**
   * 获取记忆统计
   */
  public getMemoryStats(): MemoryStats {
    const shortTerm = this.shortTermMemory.getStats();
    const longTerm = this.longTermMemory.getStats();
    const working = this.workingMemory.getStats();
    
    return {
      shortTerm,
      longTerm,
      working,
      total: {
        count: shortTerm.count + longTerm.count + working.count,
        size: shortTerm.size + longTerm.size + working.size
      }
    };
  }

  // ==================== 工具方法 ====================

  /**
   * 生成向量表示
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    // 简化实现：实际应调用嵌入模型
    // 这里使用简单的hash作为模拟
    const hash = this.simpleHash(text);
    return Array.from({ length: 384 }, (_, i) => 
      Math.sin(hash + i) * 0.5 + 0.5
    );
  }

  /**
   * 简单hash函数
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  /**
   * 计算重要性
   */
  private calculateImportance(entry: ContextEntry): number {
    let importance = 0.5;
    
    // 基于类型
    if (entry.type === 'action') importance += 0.2;
    if (entry.type === 'state') importance += 0.1;
    
    // 基于标签
    const tags = entry.metadata.tags || [];
    if (tags.includes('important')) importance += 0.3;
    
    // 基于内容长度
    const contentLength = JSON.stringify(entry.content).length;
    if (contentLength > 500) importance += 0.1;
    
    return Math.min(importance, 1.0);
  }

  /**
   * 估算token数
   */
  private estimateTokens(content: any): number {
    const text = typeof content === 'string' ? content : JSON.stringify(content);
    // 简化：平均每4个字符一个token
    return Math.ceil(text.length / 4);
  }

  /**
   * 生成ID
   */
  private generateId(): string {
    return `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取组件状态
   */
  public getStatus(): ComponentStatus {
    return this.status;
  }

  /**
   * 初始化组件
   */
  public async initialize(_config: ComponentConfig): Promise<void> {
    this.status = 'initializing';
    try {
      this.status = 'ready';
    } catch (error) {
      this.status = 'error';
      throw error;
    }
  }

  /**
   * 启动组件
   */
  public async start(): Promise<void> {
    this.status = 'running';
    this.emit('manager:started');
  }

  /**
   * 停止组件
   */
  public async stop(): Promise<void> {
    this.status = 'paused';
    this.emit('manager:stopped');
  }

  /**
   * 销毁组件
   */
  public async destroy(): Promise<void> {
    // 清除所有定时器
    this.timers.forEach(timer => clearInterval(timer));
    this.timers = [];
    
    // 刷新工作记忆
    this.flushWorkingMemory();
    
    // 巩固记忆
    await this.consolidateMemory();
    
    // 持久化长期记忆
    if (this.contextManagerConfig.longTermMemory.enablePersistence) {
      await this.longTermMemory.persist();
    }
    
    this.status = 'destroyed';
    this.emit('manager:shutdown');
    this.removeAllListeners();
  }

  /**
   * 关闭（已废弃，使用 destroy）
   */
  public async shutdown(): Promise<void> {
    await this.destroy();
  }
}

// ==================== 内部服务类 ====================

/**
 * 短期记忆
 */
class ShortTermMemory {
  private store: Map<string, ContextEntry>;
  
  constructor(private config: ContextManagerConfig['shortTermMemory']) {
    this.store = new Map();
  }

  add(entry: ContextEntry): void {
    // 检查容量
    if (this.store.size >= this.config.maxEntries) {
      // 删除最旧的条目
      const oldest = Array.from(this.store.values())
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];
      this.store.delete(oldest.id);
    }
    
    this.store.set(entry.id, entry);
  }

  get(id: string): ContextEntry | undefined {
    return this.store.get(id);
  }

  delete(id: string): void {
    this.store.delete(id);
  }

  getAll(): ContextEntry[] {
    return Array.from(this.store.values());
  }

  clear(filter?: (entry: ContextEntry) => boolean): void {
    if (filter) {
      for (const [id, entry] of this.store) {
        if (filter(entry)) {
          this.store.delete(id);
        }
      }
    } else {
      this.store.clear();
    }
  }

  getStats(): { count: number; size: number } {
    const entries = Array.from(this.store.values());
    const size = entries.reduce((sum, e) => 
      sum + JSON.stringify(e).length, 0
    );
    return { count: entries.length, size };
  }
}

/**
 * 长期记忆
 */
class LongTermMemory {
  private store: Map<string, ContextEntry>;
  
  constructor(private config: ContextManagerConfig['longTermMemory']) {
    this.store = new Map();
  }

  add(entry: ContextEntry): void {
    this.store.set(entry.id, entry);
  }

  get(id: string): ContextEntry | undefined {
    return this.store.get(id);
  }

  delete(id: string): void {
    this.store.delete(id);
  }

  getAll(): ContextEntry[] {
    return Array.from(this.store.values());
  }

  clear(filter?: (entry: ContextEntry) => boolean): void {
    if (filter) {
      for (const [id, entry] of this.store) {
        if (filter(entry)) {
          this.store.delete(id);
        }
      }
    } else {
      this.store.clear();
    }
  }

  async persist(): Promise<void> {
    // 简化实现：实际应保存到数据库
  }

  getStats(): { count: number; size: number } {
    const entries = Array.from(this.store.values());
    const size = entries.reduce((sum, e) => 
      sum + JSON.stringify(e).length, 0
    );
    return { count: entries.length, size };
  }
}

/**
 * 工作记忆
 */
class WorkingMemory {
  private buffer: ContextEntry[];
  
  constructor(private config: ContextManagerConfig['workingMemory']) {
    this.buffer = [];
  }

  add(entry: ContextEntry): void {
    this.buffer.push(entry);
    
    // 限制缓冲区大小
    if (this.buffer.length > this.config.bufferSize) {
      this.buffer.shift();
    }
  }

  get(id: string): ContextEntry | undefined {
    return this.buffer.find(e => e.id === id);
  }

  delete(id: string): void {
    this.buffer = this.buffer.filter(e => e.id !== id);
  }

  getAll(): ContextEntry[] {
    return [...this.buffer];
  }

  clear(filter?: (entry: ContextEntry) => boolean): void {
    if (filter) {
      this.buffer = this.buffer.filter(e => !filter(e));
    } else {
      this.buffer = [];
    }
  }

  getStats(): { count: number; size: number } {
    const size = this.buffer.reduce((sum, e) => 
      sum + JSON.stringify(e).length, 0
    );
    return { count: this.buffer.length, size };
  }
}

/**
 * 压缩引擎
 */
class CompressionEngine {
  constructor(private config: ContextManagerConfig['compression']) {}

  async compress(entries: ContextEntry[]): Promise<CompressionResult> {
    const originalCount = entries.length;
    let compressed: ContextEntry[];
    
    switch (this.config.algorithm) {
      case 'summarize':
        compressed = this.summarize(entries);
        break;
      case 'deduplicate':
        compressed = this.deduplicate(entries);
        break;
      case 'truncate':
        compressed = this.truncate(entries);
        break;
      default:
        compressed = entries;
    }
    
    const ratio = compressed.length / Math.max(originalCount, 1);
    const informationLoss = 1 - ratio;
    
    return {
      originalCount,
      compressedCount: compressed.length,
      entries: compressed,
      ratio,
      informationLoss
    };
  }

  private summarize(entries: ContextEntry[]): ContextEntry[] {
    // 简化：保留最重要的条目
    return entries
      .sort((a, b) => (b.metadata.importance || 0) - (a.metadata.importance || 0))
      .slice(0, Math.ceil(entries.length * this.config.ratio));
  }

  private deduplicate(entries: ContextEntry[]): ContextEntry[] {
    const seen = new Set<string>();
    return entries.filter(e => {
      const key = JSON.stringify(e.content);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private truncate(entries: ContextEntry[]): ContextEntry[] {
    const targetCount = Math.ceil(entries.length * this.config.ratio);
    return entries.slice(-targetCount);
  }
}

/**
 * 检索引擎
 */
class RetrievalEngine {
  constructor(private config: ContextManagerConfig['retrieval']) {}

  retrieve(
    candidates: ContextEntry[],
    queryEmbedding: number[],
    queryText: string,
    strategy: 'recency' | 'relevance' | 'hybrid'
  ): ContextRetrievalResult[] {
    const results: ContextRetrievalResult[] = [];
    
    for (const entry of candidates) {
      let score = 0;
      
      if (strategy === 'recency' || strategy === 'hybrid') {
        // 时间衰减分数
        const age = Date.now() - entry.createdAt.getTime();
        const recencyScore = Math.exp(-age / (24 * 60 * 60 * 1000)); // 1天衰减
        score += recencyScore * (strategy === 'hybrid' ? 0.3 : 1.0);
      }
      
      if (strategy === 'relevance' || strategy === 'hybrid') {
        // 相似度分数
        const similarity = entry.embedding && queryEmbedding.length > 0
          ? this.cosineSimilarity(entry.embedding, queryEmbedding)
          : 0;
        score += similarity * (strategy === 'hybrid' ? 0.7 : 1.0);
      }
      
      // 加入重要性因子
      score *= (entry.metadata.importance || 0.5);
      
      if (score >= this.config.similarityThreshold) {
        results.push({
          entry,
          score,
          rank: 0,
          explanation: `相似度: ${(score * 100).toFixed(1)}%`
        });
      }
    }
    
    // 排序并分配排名
    results.sort((a, b) => b.score - a.score);
    results.forEach((r, i) => r.rank = i + 1);
    
    return results;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      magnitudeA += a[i] * a[i];
      magnitudeB += b[i] * b[i];
    }
    
    const magnitude = Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB);
    return magnitude === 0 ? 0 : dotProduct / magnitude;
  }
}

/**
 * 相关性评分器
 */
class RelevanceScorer {
  scoreRelevance(entry: ContextEntry, query: string): number {
    // 简化：基于文本匹配
    const content = JSON.stringify(entry.content).toLowerCase();
    const queryLower = query.toLowerCase();
    const words = queryLower.split(' ');
    
    let matches = 0;
    for (const word of words) {
      if (content.includes(word)) {
        matches++;
      }
    }
    
    return matches / Math.max(words.length, 1);
  }
}
