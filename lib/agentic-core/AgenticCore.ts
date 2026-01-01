/**
 * @fileoverview 智能自治核心引擎
 * @description 采用事件驱动+目标驱动的混合架构，提供AI Agent核心能力
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-09
 * @modified 2025-12-09
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { EventEmitter } from 'events';
import { MessageBus } from './MessageBus';
import { TaskScheduler } from './TaskScheduler';
import { StateManager } from './StateManager';

// ====================================
// 类型定义
// ====================================

export enum AgentState {
  IDLE = 'idle',
  PLANNING = 'planning',
  EXECUTING = 'executing',
  REFLECTING = 'reflecting',
  LEARNING = 'learning',
  ERROR = 'error'
}

export interface AgentTask {
  id: string;
  goal: string;
  constraints: Record<string, unknown>;
  context: AgentContext;
  subtasks: Subtask[];
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: unknown;
  metrics: TaskMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subtask {
  id: string;
  parentId: string;
  action: string;
  parameters: Record<string, unknown>;
  dependencies: string[];
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: unknown;
}

export interface AgentContext {
  sessionId: string;
  userId: string;
  workspaceId?: string;
  environment: 'web' | 'mobile' | 'desktop';
  permissions: string[];
  conversationHistory: Message[];
  workingMemory: Record<string, unknown>;
  userPreferences: UserPreferences;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  aiModel?: string;
}

export interface TaskMetrics {
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  tokensUsed?: number;
  toolsInvoked?: number;
  successRate?: number;
}

export interface UserInput {
  content: string;
  type: 'text' | 'voice' | 'image';
  context: Partial<AgentContext>;
  metadata?: Record<string, unknown>;
}

export interface AgentResponse {
  id: string;
  content: string;
  type: 'text' | 'action' | 'tool_call' | 'error';
  data?: unknown;
  suggestions?: string[];
  confidence: number;
  metadata?: Record<string, unknown>;
}

export interface AgentConfig {
  agentId: string;
  name: string;
  goalConfig: GoalConfig;
  planningConfig: PlanningConfig;
  toolConfig: ToolConfig;
  reflectionConfig: ReflectionConfig;
  knowledgeConfig: KnowledgeConfig;
  contextConfig: ContextConfig;
  learningConfig: LearningConfig;
}

export interface GoalConfig {
  maxGoalDepth: number;
  goalTimeout: number;
  priorityWeights: Record<string, number>;
}

export interface PlanningConfig {
  maxPlanSteps: number;
  planningStrategy: 'bfs' | 'dfs' | 'astar';
  replanningThreshold: number;
}

export interface ToolConfig {
  enabledTools: string[];
  toolTimeout: number;
  maxConcurrentTools: number;
}

export interface ReflectionConfig {
  enableReflection: boolean;
  reflectionInterval: number;
  learningRate: number;
}

export interface KnowledgeConfig {
  enableKnowledgeBase: boolean;
  vectorDbUrl?: string;
  embeddingModel?: string;
}

export interface ContextConfig {
  maxHistoryLength: number;
  contextWindow: number;
  persistContext: boolean;
}

export interface LearningConfig {
  enableLearning: boolean;
  learningStrategy: 'online' | 'offline' | 'hybrid';
  feedbackThreshold: number;
}

// ====================================
// 核心自治引擎实现
// ====================================

export class AgenticCore extends EventEmitter {
  private state: AgentState = AgentState.IDLE;
  private config: AgentConfig;
  private activeTasks: Map<string, AgentTask> = new Map();
  private taskQueue: AgentTask[] = [];
  private sessionData: Map<string, unknown> = new Map();
  
  // 核心子系统
  private messageBus: MessageBus;
  private taskScheduler: TaskScheduler;
  private stateManager: StateManager;
  
  private metrics: {
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    averageDuration: number;
  } = {
    totalTasks: 0,
    completedTasks: 0,
    failedTasks: 0,
    averageDuration: 0
  };

  constructor(config: AgentConfig) {
    super();
    this.config = config;
    
    // 初始化核心子系统
    this.messageBus = new MessageBus({
      maxQueueSize: 1000,
      retryPolicy: {
        maxRetries: 3,
        backoffFactor: 2,
        initialDelay: 1000
      },
      deadLetterQueue: true
    });
    
    this.taskScheduler = new TaskScheduler({
      maxConcurrentTasks: 10,
      timeoutMs: 30000,
      priorityLevels: 5
    });
    
    this.stateManager = new StateManager({
      autoPersist: true,
      persistInterval: 60000,
      maxHistory: 100
    });
    
    this.setupEventListeners();
    this.setupSubsystemListeners();
    this.emit('agent:initialized', { agentId: config.agentId });
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    this.on('task:created', (task: AgentTask) => {
      console.log(`[AgenticCore] Task created: ${task.id}`);
    });

    this.on('task:completed', (task: AgentTask) => {
      console.log(`[AgenticCore] Task completed: ${task.id}`);
      this.metrics.completedTasks++;
    });

    this.on('task:failed', (task: AgentTask, error: Error) => {
      console.error(`[AgenticCore] Task failed: ${task.id}`, error);
      this.metrics.failedTasks++;
    });

    this.on('state:changed', (oldState: AgentState, newState: AgentState) => {
      console.log(`[AgenticCore] State changed: ${oldState} -> ${newState}`);
    });
  }

  /**
   * 处理用户输入，启动智能流程
   */
  async processInput(input: UserInput): Promise<AgentResponse> {
    try {
      // 1. 意图识别
      const intent = await this.analyzeIntent(input);
      
      // 2. 创建任务
      const task = await this.createTask(intent, input.context);
      
      // 3. 执行任务
      const result = await this.executeTask(task);
      
      // 4. 生成响应
      const response = this.generateResponse(result);
      
      return response;
    } catch (error) {
      return this.handleError(error as Error);
    }
  }

  /**
   * 分析用户意图
   */
  private async analyzeIntent(input: UserInput): Promise<{
    type: string;
    confidence: number;
    entities: Record<string, unknown>;
    context: Partial<AgentContext>;
  }> {
    // 简化的意图识别逻辑
    // 实际应该调用NLU服务或使用更复杂的算法
    return {
      type: 'query',
      confidence: 0.85,
      entities: {},
      context: input.context
    };
  }

  /**
   * 创建任务
   */
  private async createTask(
    intent: { type: string; confidence: number; entities: Record<string, unknown> },
    context: Partial<AgentContext>
  ): Promise<AgentTask> {
    const task: AgentTask = {
      id: this.generateTaskId(),
      goal: intent.type,
      constraints: {},
      context: this.buildContext(context),
      subtasks: [],
      status: 'pending',
      metrics: {
        startTime: new Date()
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.activeTasks.set(task.id, task);
    this.metrics.totalTasks++;
    this.emit('task:created', task);

    return task;
  }

  /**
   * 执行任务
   */
  private async executeTask(task: AgentTask): Promise<unknown> {
    this.setState(AgentState.EXECUTING);
    task.status = 'executing';
    task.updatedAt = new Date();

    try {
      // 1. 规划阶段
      const plan = await this.planTask(task);
      
      // 2. 执行阶段
      const result = await this.executePlan(plan, task);
      
      // 3. 反思阶段
      if (this.config.reflectionConfig.enableReflection) {
        await this.reflect(task, result);
      }
      
      // 4. 学习阶段
      if (this.config.learningConfig.enableLearning) {
        await this.learn(task, result);
      }

      task.status = 'completed';
      task.result = result;
      task.metrics.endTime = new Date();
      task.metrics.duration = task.metrics.endTime.getTime() - (task.metrics.startTime?.getTime() || 0);

      this.emit('task:completed', task);
      this.setState(AgentState.IDLE);

      return result;
    } catch (error) {
      task.status = 'failed';
      this.emit('task:failed', task, error);
      this.setState(AgentState.ERROR);
      throw error;
    }
  }

  /**
   * 规划任务
   */
  private async planTask(task: AgentTask): Promise<Subtask[]> {
    this.setState(AgentState.PLANNING);
    
    // 简化的规划逻辑
    // 实际应该使用更复杂的规划算法（如STRIPS, HTN等）
    const subtasks: Subtask[] = [
      {
        id: `${task.id}-1`,
        parentId: task.id,
        action: 'analyze',
        parameters: {},
        dependencies: [],
        status: 'pending'
      },
      {
        id: `${task.id}-2`,
        parentId: task.id,
        action: 'execute',
        parameters: {},
        dependencies: [`${task.id}-1`],
        status: 'pending'
      }
    ];

    task.subtasks = subtasks;
    return subtasks;
  }

  /**
   * 执行计划
   */
  private async executePlan(plan: Subtask[], task: AgentTask): Promise<unknown> {
    const results: unknown[] = [];

    for (const subtask of plan) {
      // 检查依赖
      const dependenciesMet = subtask.dependencies.every(depId => {
        const dep = plan.find(s => s.id === depId);
        return dep?.status === 'completed';
      });

      if (!dependenciesMet) {
        throw new Error(`Dependencies not met for subtask ${subtask.id}`);
      }

      // 执行子任务
      subtask.status = 'executing';
      const result = await this.executeSubtask(subtask, task);
      subtask.result = result;
      subtask.status = 'completed';
      results.push(result);
    }

    return results;
  }

  /**
   * 执行子任务
   */
  private async executeSubtask(subtask: Subtask, task: AgentTask): Promise<unknown> {
    // 根据action类型执行不同的操作
    switch (subtask.action) {
      case 'analyze':
        return this.analyzeData(task);
      case 'execute':
        return this.executeAction(task);
      default:
        return { success: true };
    }
  }

  /**
   * 分析数据
   */
  private async analyzeData(task: AgentTask): Promise<unknown> {
    const userMessage = task.context.conversationHistory[task.context.conversationHistory.length - 1];
    const message = userMessage?.content || '未知消息';
    
    return {
      analyzed: true,
      message: `我理解了您的消息："${message}"。让我来帮您分析一下。`,
      insights: [
        '消息已接收',
        '正在处理中',
        '准备生成回复'
      ]
    };
  }

  /**
   * 执行动作
   */
  private async executeAction(task: AgentTask): Promise<unknown> {
    const userMessage = task.context.conversationHistory[task.context.conversationHistory.length - 1];
    const message = userMessage?.content || '未知消息';
    
    return {
      executed: true,
      message: `根据您的消息："${message}"，我已完成相关操作。`,
      result: '操作已成功完成'
    };
  }

  /**
   * 反思阶段
   */
  private async reflect(task: AgentTask, result: unknown): Promise<void> {
    this.setState(AgentState.REFLECTING);
    
    // 分析任务执行情况
    const performance = {
      success: task.status === 'completed',
      duration: task.metrics.duration,
      quality: this.evaluateQuality(result)
    };

    // 记录反思结果
    this.emit('reflection:completed', { task, performance });
  }

  /**
   * 学习阶段
   */
  private async learn(task: AgentTask, result: unknown): Promise<void> {
    this.setState(AgentState.LEARNING);
    
    // 从任务执行中学习
    const learningData = {
      task: task.goal,
      strategy: task.subtasks.map(s => s.action),
      outcome: result,
      success: task.status === 'completed'
    };

    // 更新知识库
    this.emit('learning:completed', learningData);
  }

  /**
   * 评估结果质量
   */
  private evaluateQuality(result: unknown): number {
    // 简化的质量评估
    return 0.8;
  }

  /**
   * 生成响应
   */
  private generateResponse(result: unknown): AgentResponse {
    let content = '';
    
    if (typeof result === 'string') {
      content = result;
    } else if (result && typeof result === 'object') {
      const resultObj = result as Record<string, unknown>;
      
      if (resultObj.executed && resultObj.result) {
        content = resultObj.result as string;
      } else if (resultObj.analyzed && resultObj.insights) {
        content = `分析完成，发现以下洞察：\n${(resultObj.insights as string[]).join('\n- ')}`;
      } else if (resultObj.message) {
        content = resultObj.message as string;
      } else {
        content = JSON.stringify(result, null, 2);
      }
    } else {
      content = '操作已完成';
    }
    
    return {
      id: this.generateTaskId(),
      content,
      type: 'text',
      data: result,
      confidence: 0.9,
      metadata: {
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * 错误处理
   */
  private handleError(error: Error): AgentResponse {
    this.setState(AgentState.ERROR);
    
    return {
      id: this.generateTaskId(),
      content: `Error: ${error.message}`,
      type: 'error',
      confidence: 1.0,
      metadata: {
        error: error.message,
        stack: error.stack
      }
    };
  }

  /**
   * 设置状态
   */
  private setState(newState: AgentState): void {
    const oldState = this.state;
    this.state = newState;
    this.emit('state:changed', oldState, newState);
  }

  /**
   * 构建上下文
   */
  private buildContext(partial: Partial<AgentContext>): AgentContext {
    return {
      sessionId: partial.sessionId || this.generateSessionId(),
      userId: partial.userId || 'anonymous',
      environment: partial.environment || 'web',
      permissions: partial.permissions || [],
      conversationHistory: partial.conversationHistory || [],
      workingMemory: partial.workingMemory || {},
      userPreferences: partial.userPreferences || {
        language: 'zh-CN',
        theme: 'auto',
        notifications: true
      }
    };
  }

  /**
   * 生成任务ID
   */
  private generateTaskId(): string {
    return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 生成会话ID
   */
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取当前状态
   */
  getState(): AgentState {
    return this.state;
  }

  /**
   * 获取活动任务
   */
  getActiveTasks(): AgentTask[] {
    return Array.from(this.activeTasks.values());
  }

  /**
   * 获取指标
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * 设置子系统监听器
   */
  private setupSubsystemListeners(): void {
    // 消息总线事件
    this.messageBus.on('message:published', (message) => {
      this.emit('system:message_published', message);
    });
    
    this.messageBus.on('message:processed', (message) => {
      this.emit('system:message_processed', message);
    });
    
    this.messageBus.on('message:failed', ({ message, error }) => {
      this.emit('system:message_failed', { message, error });
    });
    
    // 任务调度器事件
    this.taskScheduler.on('task:started', (task) => {
      this.emit('system:task_started', task);
    });
    
    this.taskScheduler.on('task:completed', (task, result) => {
      this.metrics.completedTasks++;
      this.emit('system:task_completed', { task, result });
    });
    
    this.taskScheduler.on('task:failed', (task, result) => {
      this.metrics.failedTasks++;
      this.emit('system:task_failed', { task, result });
    });
    
    // 状态管理器事件
    this.stateManager.on('state:changed', (change) => {
      this.emit('system:state_changed', change);
    });
    
    this.stateManager.on('snapshot:created', (snapshot) => {
      this.emit('system:snapshot_created', snapshot);
    });
  }
  
  /**
   * 获取子系统实例
   */
  getMessageBus(): MessageBus {
    return this.messageBus;
  }
  
  getTaskScheduler(): TaskScheduler {
    return this.taskScheduler;
  }
  
  getStateManager(): StateManager {
    return this.stateManager;
  }
  
  /**
   * 清理资源
   */
  async destroy(): Promise<void> {
    // 停止任务调度器
    await this.taskScheduler.waitAll();
    
    // 清理消息总线
    this.messageBus.clear();
    
    // 停止状态管理器
    this.stateManager.stopAutoPersist();
    
    // 清理本地资源
    this.activeTasks.clear();
    this.taskQueue = [];
    this.sessionData.clear();
    this.removeAllListeners();
    
    this.emit('agent:destroyed');
  }
}

export default AgenticCore;
