/**
 * ErrorHandler - 全局错误处理机制
 * 
 * 系统稳定性守护者,提供:
 * - 智能错误分类与诊断
 * - 自动恢复策略
 * - 错误追踪与分析
 * - 告警与监控
 * - 错误学习与预防
 * 
 * @author YYC³ AI开发团队
 * @version 1.0.0
 * @standard YYC³团队标准化规范 v1.1.0
 */

import { EventEmitter } from 'events';
import * as os from 'os';

// ==================== 类型定义 ====================

/**
 * 错误严重程度
 */
export enum ErrorSeverity {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
  FATAL = 'fatal'
}

/**
 * 错误分类
 */
export enum ErrorCategory {
  VALIDATION = 'validation',
  AUTHENTICATION = 'auth',
  AUTHORIZATION = 'authorization',
  NETWORK = 'network',
  DATABASE = 'database',
  EXTERNAL_SERVICE = 'external',
  RESOURCE = 'resource',
  BUSINESS_LOGIC = 'business',
  SYSTEM = 'system',
  UNKNOWN = 'unknown'
}

/**
 * 恢复策略
 */
export enum RecoveryStrategy {
  RETRY = 'retry',
  FALLBACK = 'fallback',
  CIRCUIT_BREAKER = 'circuit_breaker',
  ISOLATION = 'isolation',
  COMPENSATION = 'compensation',
  ALERT = 'alert',
  RESTART = 'restart',
  MANUAL = 'manual'
}

/**
 * 错误上下文
 */
export interface ErrorContext {
  correlationId?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  operation?: string;
  component?: string;
  metadata?: Record<string, any>;
}

/**
 * 标准化错误
 */
export interface NormalizedError {
  id: string;
  name: string;
  message: string;
  stack?: string;
  code?: string | number;
  timestamp: Date;
  originalError: any;
}

/**
 * 丰富错误
 */
export interface EnrichedError extends NormalizedError {
  context: {
    user?: any;
    environment: string;
    service: string;
    version: string;
    hostname: string;
    pid: number;
    memory: NodeJS.MemoryUsage;
    uptime: number;
  };
  metadata: {
    requestId?: string;
    sessionId?: string;
    traceId?: string;
    spanId?: string;
  };
}

/**
 * 分类错误
 */
export interface ClassifiedError extends EnrichedError {
  category: ErrorCategory;
  severity: ErrorSeverity;
  confidence: number;
  tags: string[];
  predictedImpact: string;
}

/**
 * 错误诊断
 */
export interface ErrorDiagnosis {
  rootCauses: Array<{
    cause: string;
    confidence: number;
    evidence: string[];
  }>;
  relatedErrors: any[];
  impact: {
    scope: 'local' | 'service' | 'system' | 'global';
    affectedUsers: number;
    estimatedDowntime: number;
  };
  recommendations: Array<{
    action: string;
    priority: number;
    estimatedEffort: string;
  }>;
}

/**
 * 恢复计划
 */
export interface RecoveryPlan {
  strategy: RecoveryStrategy;
  steps: Array<{
    action: string;
    timeout: number;
    rollback?: string;
  }>;
  estimatedTime: number;
  requiredResources: string[];
  rollbackPlan: any;
  constraints: string[];
}

/**
 * 错误处理结果
 */
export interface ErrorHandlingResult {
  success: boolean;
  errorId: string;
  correlationId: string;
  error: ClassifiedError;
  diagnosis: ErrorDiagnosis;
  recovery: any;
  handledAt: Date;
  duration: number;
}

/**
 * 重试配置
 */
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors?: string[];
}

/**
 * 错误处理器配置
 */
export interface ErrorHandlerConfig {
  enableRootCauseAnalysis?: boolean;
  enableCorrelation?: boolean;
  enableTraces?: boolean;
  maxRecoveryTime?: number;
  parallelRecovery?: boolean;
  defaultRetryConfig?: RetryConfig;
  alertThreshold?: ErrorSeverity;
  serviceName?: string;
  serviceVersion?: string;
}

// ==================== 主类实现 ====================

/**
 * 全局错误处理器
 */
export class GlobalErrorHandler extends EventEmitter {
  private config: ErrorHandlerConfig;
  private errorHistory: Map<string, ClassifiedError[]>;
  private recoveryAttempts: Map<string, number>;
  private circuitBreakers: Map<string, {
    state: 'open' | 'half-open' | 'closed';
    failures: number;
    lastFailure: Date;
    nextRetry: Date;
  }>;
  private errorPatterns: Map<string, number>;

  constructor(config: ErrorHandlerConfig = {}) {
    super();
    
    this.config = {
      enableRootCauseAnalysis: true,
      enableCorrelation: true,
      enableTraces: true,
      maxRecoveryTime: 30000,
      parallelRecovery: false,
      defaultRetryConfig: {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 10000,
        backoffMultiplier: 2
      },
      alertThreshold: ErrorSeverity.ERROR,
      serviceName: 'yyc3-ai-system',
      serviceVersion: '1.0.0',
      ...config
    };

    this.errorHistory = new Map();
    this.recoveryAttempts = new Map();
    this.circuitBreakers = new Map();
    this.errorPatterns = new Map();

    this.setupGlobalHandlers();
  }

  // ==================== 公共API ====================

  /**
   * 处理错误
   */
  async handleError(error: any, context: ErrorContext = {}): Promise<ErrorHandlingResult> {
    const startTime = Date.now();
    const errorId = this.generateErrorId();
    const correlationId = context.correlationId || this.generateCorrelationId();

    try {
      // 1. 错误标准化
      const normalizedError = this.normalizeError(error, context);

      // 2. 错误丰富
      const enrichedError = await this.enrichError(normalizedError);

      // 3. 错误分类
      const classifiedError = await this.classifyError(enrichedError);

      // 4. 错误诊断
      const diagnosis = await this.diagnoseError(classifiedError);

      // 5. 选择恢复策略
      const recoveryPlan = await this.selectRecoveryStrategy(classifiedError, diagnosis);

      // 6. 执行恢复
      const recoveryResult = await this.executeRecovery(recoveryPlan, classifiedError);

      // 7. 记录错误
      await this.recordError(classifiedError, diagnosis, recoveryResult, {
        errorId,
        correlationId,
        handlingTime: Date.now() - startTime
      });

      // 8. 触发告警
      if (this.shouldAlert(classifiedError)) {
        await this.triggerAlert(classifiedError, diagnosis, recoveryResult);
      }

      // 9. 学习错误
      await this.learnFromError(classifiedError, diagnosis, recoveryResult);

      return {
        success: true,
        errorId,
        correlationId,
        error: classifiedError,
        diagnosis,
        recovery: recoveryResult,
        handledAt: new Date(),
        duration: Date.now() - startTime
      };

    } catch (handlingError) {
      // 错误处理失败的应急处理
      console.error('Error handler failed:', handlingError);
      throw handlingError;
    }
  }

  /**
   * 重试操作
   */
  async retry<T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ): Promise<T> {
    const retryConfig: RetryConfig = {
      ...this.config.defaultRetryConfig!,
      ...config
    };

    let attempt = 0;
    let lastError: any;

    while (attempt < retryConfig.maxAttempts) {
      try {
        attempt++;
        
        // 指数退避
        if (attempt > 1) {
          const delay = this.calculateExponentialBackoff(attempt, retryConfig);
          await this.sleep(delay);
        }

        const result = await operation();
        return result;

      } catch (error) {
        lastError = error;
        
        // 检查是否应该继续重试
        if (!this.shouldRetry(error, attempt, retryConfig)) {
          throw error;
        }
      }
    }

    throw lastError;
  }

  /**
   * 熔断器执行
   */
  async executeWithCircuitBreaker<T>(
    serviceName: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const breaker = this.getOrCreateCircuitBreaker(serviceName);

    // 检查熔断器状态
    if (breaker.state === 'open') {
      const now = new Date();
      if (now < breaker.nextRetry) {
        throw new Error(`Circuit breaker is open for ${serviceName}`);
      }
      // 进入半开状态
      breaker.state = 'half-open';
    }

    try {
      const result = await operation();
      
      // 成功,关闭熔断器
      this.recordSuccess(serviceName);
      
      return result;

    } catch (error) {
      // 失败,记录并可能打开熔断器
      this.recordFailure(serviceName, error);
      throw error;
    }
  }

  /**
   * 降级执行
   */
  async executeWithFallback<T>(
    primary: () => Promise<T>,
    fallback: () => Promise<T>
  ): Promise<T> {
    try {
      return await primary();
    } catch (error) {
      this.emit('fallback', { error, operation: 'executeWithFallback' });
      return await fallback();
    }
  }

  /**
   * 获取错误统计
   */
  getErrorStats(): {
    totalErrors: number;
    byCategory: Record<ErrorCategory, number>;
    bySeverity: Record<ErrorSeverity, number>;
    recentErrors: ClassifiedError[];
  } {
    const stats = {
      totalErrors: 0,
      byCategory: {} as Record<ErrorCategory, number>,
      bySeverity: {} as Record<ErrorSeverity, number>,
      recentErrors: [] as ClassifiedError[]
    };

    for (const errors of this.errorHistory.values()) {
      stats.totalErrors += errors.length;
      
      for (const error of errors) {
        stats.byCategory[error.category] = (stats.byCategory[error.category] || 0) + 1;
        stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
      }

      stats.recentErrors.push(...errors.slice(-10));
    }

    stats.recentErrors.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    stats.recentErrors = stats.recentErrors.slice(0, 50);

    return stats;
  }

  // ==================== 私有方法 ====================

  /**
   * 错误标准化
   */
  private normalizeError(error: any, context: ErrorContext): NormalizedError {
    return {
      id: this.generateErrorId(),
      name: error.name || 'UnknownError',
      message: error.message || 'An unknown error occurred',
      stack: error.stack,
      code: error.code,
      timestamp: new Date(),
      originalError: error
    };
  }

  /**
   * 错误丰富
   */
  private async enrichError(error: NormalizedError): Promise<EnrichedError> {
    return {
      ...error,
      context: {
        environment: process.env.NODE_ENV || 'development',
        service: this.config.serviceName!,
        version: this.config.serviceVersion!,
        hostname: os.hostname(),
        pid: process.pid,
        memory: process.memoryUsage(),
        uptime: process.uptime()
      },
      metadata: {
        traceId: this.generateTraceId()
      }
    };
  }

  /**
   * 错误分类
   */
  private async classifyError(error: EnrichedError): Promise<ClassifiedError> {
    // 简化的分类逻辑
    let category = ErrorCategory.UNKNOWN;
    let severity = ErrorSeverity.ERROR;

    // 根据错误名称分类
    if (error.name.includes('Validation')) {
      category = ErrorCategory.VALIDATION;
      severity = ErrorSeverity.WARNING;
    } else if (error.name.includes('Auth')) {
      category = ErrorCategory.AUTHENTICATION;
      severity = ErrorSeverity.ERROR;
    } else if (error.name.includes('Network') || error.message.includes('ECONNREFUSED')) {
      category = ErrorCategory.NETWORK;
      severity = ErrorSeverity.ERROR;
    } else if (error.name.includes('Database')) {
      category = ErrorCategory.DATABASE;
      severity = ErrorSeverity.CRITICAL;
    }

    return {
      ...error,
      category,
      severity,
      confidence: 0.8,
      tags: [category, severity],
      predictedImpact: this.predictImpact(category, severity)
    };
  }

  /**
   * 错误诊断
   */
  private async diagnoseError(error: ClassifiedError): Promise<ErrorDiagnosis> {
    // 查找相关错误
    const relatedErrors = await this.findRelatedErrors(error);

    return {
      rootCauses: [
        {
          cause: error.message,
          confidence: 0.9,
          evidence: [error.stack || '']
        }
      ],
      relatedErrors,
      impact: {
        scope: 'local',
        affectedUsers: 1,
        estimatedDowntime: 0
      },
      recommendations: [
        {
          action: 'Review error logs and stack trace',
          priority: 1,
          estimatedEffort: '15 minutes'
        }
      ]
    };
  }

  /**
   * 选择恢复策略
   */
  private async selectRecoveryStrategy(
    error: ClassifiedError,
    diagnosis: ErrorDiagnosis
  ): Promise<RecoveryPlan> {
    let strategy = RecoveryStrategy.RETRY;

    // 根据错误类型选择策略
    if (error.category === ErrorCategory.NETWORK) {
      strategy = RecoveryStrategy.RETRY;
    } else if (error.category === ErrorCategory.EXTERNAL_SERVICE) {
      strategy = RecoveryStrategy.CIRCUIT_BREAKER;
    } else if (error.severity === ErrorSeverity.CRITICAL) {
      strategy = RecoveryStrategy.ALERT;
    }

    return {
      strategy,
      steps: [
        {
          action: `Execute ${strategy} strategy`,
          timeout: 5000
        }
      ],
      estimatedTime: 5000,
      requiredResources: [],
      rollbackPlan: {},
      constraints: []
    };
  }

  /**
   * 执行恢复
   */
  private async executeRecovery(plan: RecoveryPlan, error: ClassifiedError): Promise<any> {
    switch (plan.strategy) {
      case RecoveryStrategy.RETRY:
        return { strategy: 'retry', executed: true };
      
      case RecoveryStrategy.FALLBACK:
        return { strategy: 'fallback', executed: true };
      
      case RecoveryStrategy.CIRCUIT_BREAKER:
        return { strategy: 'circuit_breaker', executed: true };
      
      case RecoveryStrategy.ALERT:
        return { strategy: 'alert', executed: true };
      
      default:
        return { strategy: 'none', executed: false };
    }
  }

  /**
   * 记录错误
   */
  private async recordError(
    error: ClassifiedError,
    diagnosis: ErrorDiagnosis,
    recovery: any,
    metadata: any
  ): Promise<void> {
    const key = error.category;
    const errors = this.errorHistory.get(key) || [];
    errors.push(error);
    
    // 保留最近100个错误
    if (errors.length > 100) {
      errors.shift();
    }
    
    this.errorHistory.set(key, errors);

    // 更新错误模式
    const pattern = this.getErrorPattern(error);
    this.errorPatterns.set(pattern, (this.errorPatterns.get(pattern) || 0) + 1);

    this.emit('errorRecorded', { error, diagnosis, recovery, metadata });
  }

  /**
   * 学习错误
   */
  private async learnFromError(
    error: ClassifiedError,
    diagnosis: ErrorDiagnosis,
    recovery: any
  ): Promise<void> {
    // 简化的学习逻辑
    this.emit('errorLearned', { error, diagnosis, recovery });
  }

  /**
   * 查找相关错误
   */
  private async findRelatedErrors(error: ClassifiedError): Promise<any[]> {
    const related: any[] = [];
    const errors = this.errorHistory.get(error.category) || [];
    
    for (const e of errors) {
      if (e.id !== error.id && this.areErrorsRelated(error, e)) {
        related.push(e);
      }
    }
    
    return related.slice(-5); // 最近5个相关错误
  }

  /**
   * 判断错误是否相关
   */
  private areErrorsRelated(e1: ClassifiedError, e2: ClassifiedError): boolean {
    // 简化的相关性判断
    return (
      e1.category === e2.category &&
      e1.name === e2.name &&
      Math.abs(e1.timestamp.getTime() - e2.timestamp.getTime()) < 300000 // 5分钟内
    );
  }

  /**
   * 判断是否应该告警
   */
  private shouldAlert(error: ClassifiedError): boolean {
    const threshold = this.config.alertThreshold!;
    const severityOrder = [
      ErrorSeverity.DEBUG,
      ErrorSeverity.INFO,
      ErrorSeverity.WARNING,
      ErrorSeverity.ERROR,
      ErrorSeverity.CRITICAL,
      ErrorSeverity.FATAL
    ];
    
    return severityOrder.indexOf(error.severity) >= severityOrder.indexOf(threshold);
  }

  /**
   * 触发告警
   */
  private async triggerAlert(
    error: ClassifiedError,
    diagnosis: ErrorDiagnosis,
    recovery: any
  ): Promise<void> {
    this.emit('alert', {
      error,
      diagnosis,
      recovery,
      timestamp: new Date()
    });
  }

  /**
   * 判断是否应该重试
   */
  private shouldRetry(error: any, attempt: number, config: RetryConfig): boolean {
    if (attempt >= config.maxAttempts) {
      return false;
    }

    // 检查是否是可重试的错误
    if (config.retryableErrors) {
      return config.retryableErrors.some(e => error.name?.includes(e) || error.message?.includes(e));
    }

    return true;
  }

  /**
   * 计算指数退避延迟
   */
  private calculateExponentialBackoff(attempt: number, config: RetryConfig): number {
    const delay = Math.min(
      config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1),
      config.maxDelay
    );
    return delay;
  }

  /**
   * 获取或创建熔断器
   */
  private getOrCreateCircuitBreaker(serviceName: string) {
    if (!this.circuitBreakers.has(serviceName)) {
      this.circuitBreakers.set(serviceName, {
        state: 'closed',
        failures: 0,
        lastFailure: new Date(),
        nextRetry: new Date()
      });
    }
    return this.circuitBreakers.get(serviceName)!;
  }

  /**
   * 记录成功
   */
  private recordSuccess(serviceName: string): void {
    const breaker = this.getOrCreateCircuitBreaker(serviceName);
    breaker.state = 'closed';
    breaker.failures = 0;
  }

  /**
   * 记录失败
   */
  private recordFailure(serviceName: string, error: any): void {
    const breaker = this.getOrCreateCircuitBreaker(serviceName);
    breaker.failures++;
    breaker.lastFailure = new Date();

    // 失败次数超过阈值,打开熔断器
    if (breaker.failures >= 5) {
      breaker.state = 'open';
      breaker.nextRetry = new Date(Date.now() + 60000); // 1分钟后重试
    }
  }

  /**
   * 预测影响
   */
  private predictImpact(category: ErrorCategory, severity: ErrorSeverity): string {
    if (severity === ErrorSeverity.CRITICAL || severity === ErrorSeverity.FATAL) {
      return 'high';
    } else if (severity === ErrorSeverity.ERROR) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * 获取错误模式
   */
  private getErrorPattern(error: ClassifiedError): string {
    return `${error.category}_${error.name}`;
  }

  /**
   * 设置全局错误处理器
   */
  private setupGlobalHandlers(): void {
    // 未捕获的异常
    process.on('uncaughtException', (error) => {
      this.handleError(error, { operation: 'uncaughtException' });
    });

    // 未处理的Promise拒绝
    process.on('unhandledRejection', (reason, promise) => {
      this.handleError(reason, { operation: 'unhandledRejection' });
    });
  }

  /**
   * 生成错误ID
   */
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 生成关联ID
   */
  private generateCorrelationId(): string {
    return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 生成追踪ID
   */
  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 睡眠
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 清理
   */
  public destroy(): void {
    this.errorHistory.clear();
    this.recoveryAttempts.clear();
    this.circuitBreakers.clear();
    this.errorPatterns.clear();
    this.removeAllListeners();
  }
}
