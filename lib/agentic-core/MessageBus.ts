/**
 * @fileoverview 消息总线 - 事件驱动架构核心
 * @description 提供发布-订阅模式的消息传递机制
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-09
 * @modified 2025-12-09
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { EventEmitter } from 'events';

// ====================================
// 类型定义
// ====================================

export interface MessageBusConfig {
  maxQueueSize: number;
  retryPolicy: RetryPolicy;
  deadLetterQueue?: boolean;
  persistMessages?: boolean;
}

export interface RetryPolicy {
  maxRetries: number;
  backoffFactor: number;
  initialDelay?: number;
}

export interface Message {
  id: string;
  type: string;
  payload: unknown;
  timestamp: Date;
  priority: number;
  retryCount: number;
  metadata?: Record<string, unknown>;
}

export interface MessageHandler {
  (message: Message): Promise<void> | void;
}

// ====================================
// 消息总线实现
// ====================================

export class MessageBus extends EventEmitter {
  private config: MessageBusConfig;
  private messageQueue: Message[] = [];
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private deadLetterQueue: Message[] = [];
  private processing: boolean = false;

  constructor(config: MessageBusConfig) {
    super();
    this.config = config;
    this.setMaxListeners(100); // 避免内存泄漏警告
  }

  /**
   * 发布消息
   */
  async publish(type: string, payload: unknown, priority: number = 5): Promise<void> {
    const message: Message = {
      id: this.generateMessageId(),
      type,
      payload,
      timestamp: new Date(),
      priority,
      retryCount: 0
    };

    // 检查队列大小
    if (this.messageQueue.length >= this.config.maxQueueSize) {
      throw new Error(`Message queue full (max: ${this.config.maxQueueSize})`);
    }

    // 添加到队列（按优先级排序）
    this.messageQueue.push(message);
    this.messageQueue.sort((a, b) => b.priority - a.priority);

    // 触发处理
    this.processQueue();

    // 发射事件
    this.emit('message:published', message);
  }

  /**
   * 订阅消息
   */
  subscribe(type: string, handler: MessageHandler): void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);
    this.emit('handler:registered', { type, handler });
  }

  /**
   * 取消订阅
   */
  unsubscribe(type: string, handler: MessageHandler): void {
    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(type);
      }
    }
    this.emit('handler:unregistered', { type, handler });
  }

  /**
   * 处理消息队列
   */
  private async processQueue(): Promise<void> {
    if (this.processing || this.messageQueue.length === 0) return;

    this.processing = true;

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()!;
      await this.processMessage(message);
    }

    this.processing = false;
  }

  /**
   * 处理单个消息
   */
  private async processMessage(message: Message): Promise<void> {
    const handlers = this.handlers.get(message.type) || new Set();
    
    if (handlers.size === 0) {
      this.emit('message:no_handler', message);
      return;
    }

    try {
      // 并发执行所有处理器
      await Promise.all(
        Array.from(handlers).map(handler => 
          this.executeHandler(handler, message)
        )
      );

      this.emit('message:processed', message);
    } catch (error) {
      await this.handleMessageError(message, error as Error);
    }
  }

  /**
   * 执行处理器
   */
  private async executeHandler(
    handler: MessageHandler, 
    message: Message
  ): Promise<void> {
    try {
      await handler(message);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 错误处理
   */
  private async handleMessageError(message: Message, error: Error): Promise<void> {
    message.retryCount++;

    if (message.retryCount < this.config.retryPolicy.maxRetries) {
      // 重试
      const delay = this.calculateBackoff(message.retryCount);
      setTimeout(() => {
        this.messageQueue.unshift(message); // 添加到队列头部
        this.processQueue();
      }, delay);

      this.emit('message:retry', { message, attempt: message.retryCount });
    } else {
      // 移入死信队列
      if (this.config.deadLetterQueue) {
        this.deadLetterQueue.push(message);
      }
      this.emit('message:failed', { message, error });
    }
  }

  /**
   * 计算重试延迟
   */
  private calculateBackoff(retryCount: number): number {
    const initial = this.config.retryPolicy.initialDelay || 1000;
    return initial * Math.pow(this.config.retryPolicy.backoffFactor, retryCount - 1);
  }

  /**
   * 生成消息ID
   */
  private generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      queueSize: this.messageQueue.length,
      handlersCount: this.handlers.size,
      deadLetterQueueSize: this.deadLetterQueue.length,
      isProcessing: this.processing
    };
  }

  /**
   * 清空队列
   */
  clear(): void {
    this.messageQueue = [];
    this.deadLetterQueue = [];
    this.emit('queue:cleared');
  }

  /**
   * 获取死信队列
   */
  getDeadLetterQueue(): Message[] {
    return [...this.deadLetterQueue];
  }

  /**
   * 清理死信队列
   */
  clearDeadLetterQueue(): void {
    this.deadLetterQueue = [];
    this.emit('dead_letter_queue:cleared');
  }
}

export default MessageBus;
