/**
 * @fileoverview 工具编排引擎 - 动态工具管理与编排
 * @description 提供工具注册、发现、编排、执行等能力
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

export interface Tool {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  parameters: ToolParameter[];
  execute: (params: Record<string, unknown>) => Promise<unknown>;
  metadata?: ToolMetadata;
}

export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  default?: unknown;
  enum?: unknown[];
}

export interface ToolMetadata {
  author?: string;
  tags?: string[];
  dependencies?: string[];
  estimatedTime?: number;
  cost?: number;
}

export interface ToolExecutionContext {
  toolId: string;
  parameters: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
  timeout?: number;
}

export interface ToolExecutionResult {
  toolId: string;
  success: boolean;
  result?: unknown;
  error?: Error;
  duration: number;
  metadata?: Record<string, unknown>;
}

export interface OrchestrationPlan {
  id: string;
  steps: OrchestrationStep[];
  dependencies: Map<string, string[]>;
  estimatedDuration: number;
}

export interface OrchestrationStep {
  id: string;
  toolId: string;
  parameters: Record<string, unknown>;
  dependencies: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
}

// ====================================
// 工具编排引擎实现
// ====================================

export class ToolOrchestrator extends EventEmitter {
  private tools: Map<string, Tool> = new Map();
  private toolExecutionHistory: Map<string, ToolExecutionResult[]> = new Map();
  private activeExecutions: Map<string, ToolExecutionContext> = new Map();

  constructor() {
    super();
  }

  /**
   * 注册工具
   */
  registerTool(tool: Tool): void {
    // 验证工具定义
    this.validateTool(tool);

    // 检查冲突
    if (this.tools.has(tool.id)) {
      throw new Error(`Tool already registered: ${tool.id}`);
    }

    // 注册工具
    this.tools.set(tool.id, tool);
    this.toolExecutionHistory.set(tool.id, []);

    this.emit('tool:registered', tool);
  }

  /**
   * 注销工具
   */
  unregisterTool(toolId: string): boolean {
    const existed = this.tools.delete(toolId);
    if (existed) {
      this.toolExecutionHistory.delete(toolId);
      this.emit('tool:unregistered', { toolId });
    }
    return existed;
  }

  /**
   * 获取工具
   */
  getTool(toolId: string): Tool | undefined {
    return this.tools.get(toolId);
  }

  /**
   * 搜索工具
   */
  searchTools(query: {
    name?: string;
    category?: string;
    tags?: string[];
  }): Tool[] {
    return Array.from(this.tools.values()).filter(tool => {
      if (query.name && !tool.name.toLowerCase().includes(query.name.toLowerCase())) {
        return false;
      }
      if (query.category && tool.category !== query.category) {
        return false;
      }
      if (query.tags && query.tags.length > 0) {
        const toolTags = tool.metadata?.tags || [];
        if (!query.tags.some(tag => toolTags.includes(tag))) {
          return false;
        }
      }
      return true;
    });
  }

  /**
   * 执行工具
   */
  async executeTool(context: ToolExecutionContext): Promise<ToolExecutionResult> {
    const tool = this.tools.get(context.toolId);
    if (!tool) {
      throw new Error(`Tool not found: ${context.toolId}`);
    }

    // 验证参数
    this.validateParameters(tool, context.parameters);

    // 记录执行开始
    const executionId = this.generateExecutionId();
    this.activeExecutions.set(executionId, context);

    const startTime = Date.now();

    this.emit('tool:execution_started', { executionId, context });

    try {
      // 执行工具（带超时）
      const timeout = context.timeout || 30000;
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Tool execution timeout')), timeout)
      );

      const result = await Promise.race([
        tool.execute(context.parameters),
        timeoutPromise
      ]);

      const duration = Date.now() - startTime;

      const executionResult: ToolExecutionResult = {
        toolId: context.toolId,
        success: true,
        result,
        duration
      };

      // 记录历史
      this.recordExecution(context.toolId, executionResult);

      this.emit('tool:execution_completed', { executionId, result: executionResult });

      return executionResult;

    } catch (error) {
      const duration = Date.now() - startTime;

      const executionResult: ToolExecutionResult = {
        toolId: context.toolId,
        success: false,
        error: error as Error,
        duration
      };

      // 记录历史
      this.recordExecution(context.toolId, executionResult);

      this.emit('tool:execution_failed', { executionId, error });

      return executionResult;

    } finally {
      this.activeExecutions.delete(executionId);
    }
  }

  /**
   * 编排多个工具执行
   */
  async orchestrate(tools: {
    toolId: string;
    parameters: Record<string, unknown>;
    dependencies?: string[];
  }[]): Promise<Map<string, ToolExecutionResult>> {
    // 创建编排计划
    const plan = this.createOrchestrationPlan(tools);

    this.emit('orchestration:started', { plan });

    // 执行计划
    const results = await this.executePlan(plan);

    this.emit('orchestration:completed', { plan, results });

    return results;
  }

  /**
   * 创建编排计划
   */
  private createOrchestrationPlan(tools: {
    toolId: string;
    parameters: Record<string, unknown>;
    dependencies?: string[];
  }[]): OrchestrationPlan {
    const steps: OrchestrationStep[] = tools.map((tool, index) => ({
      id: `step-${index}`,
      toolId: tool.toolId,
      parameters: tool.parameters,
      dependencies: tool.dependencies || [],
      status: 'pending' as const
    }));

    // 分析依赖关系
    const dependencies = new Map<string, string[]>();
    steps.forEach(step => {
      dependencies.set(step.id, step.dependencies);
    });

    // 估算执行时间
    const estimatedDuration = steps.reduce((total, step) => {
      const tool = this.tools.get(step.toolId);
      return total + (tool?.metadata?.estimatedTime || 1000);
    }, 0);

    return {
      id: this.generatePlanId(),
      steps,
      dependencies,
      estimatedDuration
    };
  }

  /**
   * 执行编排计划
   */
  private async executePlan(plan: OrchestrationPlan): Promise<Map<string, ToolExecutionResult>> {
    const results = new Map<string, ToolExecutionResult>();
    const completed = new Set<string>();

    while (completed.size < plan.steps.length) {
      // 找到可以执行的步骤
      const executableSteps = plan.steps.filter(step => {
        if (step.status !== 'pending') return false;
        
        // 检查依赖是否都完成
        const deps = plan.dependencies.get(step.id) || [];
        return deps.every(depId => completed.has(depId));
      });

      if (executableSteps.length === 0) {
        throw new Error('Circular dependency detected or all steps failed');
      }

      // 并发执行可执行的步骤
      const executionPromises = executableSteps.map(async step => {
        step.status = 'running';
        
        const result = await this.executeTool({
          toolId: step.toolId,
          parameters: step.parameters
        });

        if (result.success) {
          step.status = 'completed';
          completed.add(step.id);
        } else {
          step.status = 'failed';
        }

        results.set(step.id, result);
        return { step, result };
      });

      await Promise.all(executionPromises);
    }

    return results;
  }

  /**
   * 验证工具定义
   */
  private validateTool(tool: Tool): void {
    if (!tool.id || !tool.name || !tool.execute) {
      throw new Error('Invalid tool definition: missing required fields');
    }

    if (typeof tool.execute !== 'function') {
      throw new Error('Tool execute must be a function');
    }
  }

  /**
   * 验证参数
   */
  private validateParameters(tool: Tool, parameters: Record<string, unknown>): void {
    for (const param of tool.parameters) {
      if (param.required && !(param.name in parameters)) {
        throw new Error(`Missing required parameter: ${param.name}`);
      }

      if (param.name in parameters) {
        const value = parameters[param.name];
        const actualType = Array.isArray(value) ? 'array' : typeof value;

        if (actualType !== param.type && value !== null && value !== undefined) {
          throw new Error(
            `Parameter ${param.name} expects type ${param.type}, got ${actualType}`
          );
        }
      }
    }
  }

  /**
   * 记录执行历史
   */
  private recordExecution(toolId: string, result: ToolExecutionResult): void {
    const history = this.toolExecutionHistory.get(toolId) || [];
    history.push(result);

    // 限制历史记录数量
    if (history.length > 100) {
      history.shift();
    }

    this.toolExecutionHistory.set(toolId, history);
  }

  /**
   * 获取工具执行统计
   */
  getToolStats(toolId: string) {
    const history = this.toolExecutionHistory.get(toolId) || [];
    
    if (history.length === 0) {
      return null;
    }

    const successCount = history.filter(h => h.success).length;
    const failureCount = history.length - successCount;
    const avgDuration = history.reduce((sum, h) => sum + h.duration, 0) / history.length;

    return {
      totalExecutions: history.length,
      successCount,
      failureCount,
      successRate: successCount / history.length,
      avgDuration,
      lastExecution: history[history.length - 1]
    };
  }

  /**
   * 获取所有工具列表
   */
  listTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  /**
   * 生成执行ID
   */
  private generateExecutionId(): string {
    return `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 生成计划ID
   */
  private generatePlanId(): string {
    return `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      registeredTools: this.tools.size,
      activeExecutions: this.activeExecutions.size,
      categories: this.getCategories()
    };
  }

  /**
   * 获取所有分类
   */
  private getCategories(): string[] {
    const categories = new Set<string>();
    this.tools.forEach(tool => categories.add(tool.category));
    return Array.from(categories);
  }
}

export default ToolOrchestrator;
