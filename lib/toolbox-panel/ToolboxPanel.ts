/**
 * YYC³ 工具箱面板组件
 * 
 * 提供直观、智能的工具管理和使用功能：
 * - 工具管理（注册、注销、搜索、列表）
 * - 面板控制（显示/隐藏、视图模式、布局）
 * - 工具执行（单个执行、链式执行、定时执行）
 * - 个性化（固定工具、工具分组、排序）
 * - 智能功能（工具推荐、使用学习、布局优化）
 * 
 * @标准遵循 YYC³团队标准化规范 v1.1.0
 * @设计原则 五标五高五化
 */

import { EventEmitter } from 'events';
import type { LifecycleComponent } from '../ai-components/ComponentLifecycleManager';
import type { ComponentStatus, ComponentConfig } from '../ai-components/types';
import type { 
  Tool, 
  ToolboxConfig, 
  ToolExecutionContext,
  PanelLayout, 
  ToolRegistrationResult,
  ToolExecutionResult,
  ToolChain, 
  ToolChainStep,
  RetryPolicy,
  ToolParameter,
  ToolStats,
  ToolCategory,
  ToolSearchOptions,
  ToolSearchResult,
  ToolChainExecutionResult
} from './types';

// 内部类型定义
interface ToolFilter {
  category?: string;
  enabled?: boolean;
  tags?: string[];
  search?: string;
}

// 使用公共的ToolChainExecutionResult类型

// 缺失的类型定义
interface ToolDefinition {
  id?: string;
  name: string;
  description?: string;
  category?: string;
  tags: string[];
  executor: {
    handler: (parameters: any, context: ToolExecutionContext) => Promise<any>;
    [key: string]: any;
  };
  inputs?: ToolParameter[];
  dependencies?: string[];
  enabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type ViewMode = 'grid' | 'list' | 'compact';

interface ToolGroup {
  id?: string;
  name: string;
  toolIds: string[];
  description?: string;
}

interface ToolOrder {
  toolIds: string[];
  groupIds?: string[];
}

interface SuggestionContext {
  userId?: string;
  recentTools?: string[];
  currentTask?: string;
  [key: string]: any;
}

interface ToolSuggestion {
  tool: Tool;
  reason: string;
  confidence: number;
  preview: string;
}

interface UsagePattern {
  userId: string;
  toolId: string;
  timestamp: Date;
  parameters: any;
  success: boolean;
  executionTime: number;
}

interface UIConfig {
  theme?: string;
  layout?: string;
  [key: string]: any;
}

interface Schedule {
  type: 'once' | 'recurring';
  startTime?: Date;
  interval?: number;
  parameters?: any;
  [key: string]: any;
}

// ================================================
// 内部服务类
// ================================================

class ToolRegistry {
  private tools: Map<string, Tool> = new Map();
  private toolStats: Map<string, ToolStats> = new Map();
  private config: { maxTools: number; cacheEnabled: boolean };
  private cache: Map<string, any> = new Map();

  constructor(config: { maxTools: number; cacheEnabled: boolean }) {
    this.config = config;
  }

  register(tool: Tool): Tool {
    const toolId = tool.id || `tool_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const registeredTool: Tool = {
      ...tool,
      id: toolId,
    };

    this.tools.set(toolId, registeredTool);
    return registeredTool;
  }

  unregister(toolId: string): void {
    this.tools.delete(toolId);
    this.cache.delete(toolId);
  }

  get(toolId: string): Tool | undefined {
    return this.tools.get(toolId);
  }

  list(filter?: ToolFilter): Tool[] {
    let tools = Array.from(this.tools.values());

    if (filter?.category) {
      tools = tools.filter(t => t.category === filter.category);
    }
    if (filter?.tags && filter.tags.length > 0) {
      tools = tools.filter(t => filter.tags!.some(tag => t.tags.includes(tag)));
    }
    if (filter?.enabled !== undefined) {
      tools = tools.filter(t => t.enabled === filter.enabled);
    }
    if (filter?.search) {
      const searchLower = filter.search.toLowerCase();
      tools = tools.filter(t => 
        t.name.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower)
      );
    }

    return tools;
  }

  updateUsage(toolId: string): void {
    const tool = this.tools.get(toolId);
    if (tool) {
      // 使用toolStats来跟踪使用情况，而不是直接修改tool对象
      const stats = this.toolStats.get(toolId) || {
        totalExecutions: 0,
        successfulExecutions: 0,
        failedExecutions: 0,
        averageExecutionTime: 0,
        lastExecuted: 0,
        usageCount: 0
      };
      
      // 更新使用统计
      stats.usageCount++;
      stats.lastExecuted = Date.now();
      this.toolStats.set(toolId, stats);
    }
  }
}

class LayoutManager {
  private currentLayout: PanelLayout;
  private config: { defaultLayout: PanelLayout; responsive: boolean };

  constructor(config: { defaultLayout: PanelLayout; responsive: boolean }) {
    this.config = config;
    this.currentLayout = config.defaultLayout;
  }

  getCurrentLayout(): PanelLayout {
    return this.currentLayout;
  }

  setLayout(layout: PanelLayout): void {
    this.currentLayout = layout;
  }
}

class ExecutionEngine {
  private config: { timeout: number; retryPolicy: RetryPolicy };

  constructor(config: { timeout: number; retryPolicy: RetryPolicy }) {
    this.config = config;
  }

  async execute(tool: Tool, parameters: any): Promise<ToolExecutionResult> {
    const startTime = Date.now();
    
    try {
      const result = await this.executeWithTimeout(tool, parameters);
      return {
        success: true,
        data: result,
        metadata: {
          duration: Date.now() - startTime
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'EXECUTION_ERROR',
          message: error.message || '执行失败',
          details: error
        },
        metadata: {
          duration: Date.now() - startTime
        }
      };
    }
  }

  private async executeWithTimeout(tool: Tool, parameters: any): Promise<any> {
    const context: ToolExecutionContext = {
      userId: 'test-user',
      sessionId: 'test-session',
      executionId: `exec-${Date.now()}`,
      timestamp: new Date(),
      environment: 'development'
    };

    return Promise.race([
      tool.executor.handler(parameters, context),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('执行超时')), this.config.timeout)
      )
    ]);
  }

  async executeChain(chain: ToolChain, tools: Map<string, Tool>): Promise<ToolChainExecutionResult> {
    const results: ToolExecutionResult[] = [];
    const startTime = Date.now();
    let previousResult: any = null;

    for (const step of chain.steps) {
      // 检查条件（ToolChainCondition不是函数，而是接口）
      if (step.condition) {
        // 这里简化处理，实际应该根据condition的type进行不同的处理
        if (step.condition.type === 'always') {
          // 总是执行
        } else {
          // 其他条件类型暂时跳过
          continue;
        }
      }

      const tool = tools.get(step.toolId);
      if (!tool) {
        results.push({
          success: false,
          error: {
            code: 'TOOL_NOT_FOUND',
            message: `工具 ${step.toolId} 不存在`,
            details: null
          },
          metadata: {
            duration: 0
          }
        });
        
        // ToolChain接口没有errorHandling属性，默认继续执行
        continue;
      }

      const result = await this.execute(tool, step.inputs);
      results.push(result);

      // ToolChain接口没有errorHandling属性，默认继续执行

      previousResult = result.data;
    }

    const totalDuration = Date.now() - startTime;
    const success = results.every(r => r.success);
    
    return {
      chainId: chain.id,
      success,
      steps: results.map((result, index) => ({
        stepIndex: index,
        toolId: chain.steps[index]?.toolId || '',
        success: result.success,
        result,
        duration: result.metadata?.duration || 0
      })),
      totalDuration,
      error: !success ? results.find(r => !r.success)?.error : undefined
    };
  }
}

class RecommendationEngine {
  private config: { algorithm: string; updateInterval: number };
  private usageHistory: UsagePattern[] = [];
  private toolStats: Map<string, ToolStats>;

  constructor(config: { algorithm: string; updateInterval: number }, toolStats: Map<string, ToolStats>) {
    this.config = config;
    this.toolStats = toolStats;
  }

  addTool(tool: Tool): void {
    // 添加到推荐系统
  }

  async recommend(context: SuggestionContext, tools: Tool[]): Promise<ToolSuggestion[]> {
    // 基于使用历史的推荐
    const suggestions: ToolSuggestion[] = [];

    for (const tool of tools) {
      const score = this.calculateRelevanceScore(tool, context);
      if (score > 0) {
        suggestions.push({
          tool,
          reason: this.generateReason(tool, context),
          confidence: score,
          preview: `${tool.name}: ${tool.description}`
        });
      }
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  }

  recordUsage(pattern: UsagePattern): void {
    this.usageHistory.push(pattern);
  }

  getRecentTools(limit: number = 10): string[] {
    const recent = this.usageHistory
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
    return recent.map(p => p.toolId);
  }

  private calculateRelevanceScore(tool: Tool, context: SuggestionContext): number {
    let score = 0;

    // 基于最近使用
    if (context.recentTools?.includes(tool.id)) {
      score += 0.3;
    }

    // 基于使用频率
    const stats = this.toolStats.get(tool.id);
    score += stats ? Math.min(stats.totalExecutions / 10, 0.5) : 0;

    // 基于任务相关性
    if (context.currentTask && tool.tags.some(tag => 
      context.currentTask!.toLowerCase().includes(tag.toLowerCase())
    )) {
      score += 0.4;
    }

    return Math.min(score, 1.0);
  }

  private generateReason(tool: Tool, context: SuggestionContext): string {
    if (context.recentTools?.includes(tool.id)) {
      return '最近使用过';
    }
    // 使用toolStats来获取使用次数，而不是直接访问tool.usageCount
    const stats = this.toolStats.get(tool.id);
    if (stats && stats.totalExecutions > 5) {
      return '热门工具';
    }
    return '推荐使用';
  }
}

class UIRenderer {
  private config: UIConfig;

  constructor(config: UIConfig) {
    this.config = config;
  }

  render(components: any[]): void {
    console.log('渲染UI组件:', components.length);
  }

  addTool(tool: Tool): void {
    console.log('添加工具到UI:', tool.name);
  }
}

// ================================================
// 主要接口
// ================================================

export interface IToolboxPanel {
  // 工具管理
  registerTool(tool: ToolDefinition): ToolRegistrationResult;
  unregisterTool(toolId: string): Promise<{ success: boolean; error?: string }>;
  getTool(toolId: string): Tool | undefined;
  listTools(filter?: ToolFilter): Tool[];
  searchTools(options?: ToolSearchOptions): ToolSearchResult[];
  
  // 面板控制
  show(): void;
  hide(): void;
  toggle(): void;
  setViewMode(mode: ViewMode): void;
  setLayout(layout: PanelLayout): void;
  
  // 工具执行
  executeTool(toolId: string, parameters?: any, executionContext?: any): Promise<ToolExecutionResult>;
  executeToolChain(chain: ToolChain): Promise<ToolChainExecutionResult>;
  scheduleTool(toolId: string, schedule: Schedule): Promise<string>;
  
  // 个性化
  pinTool(toolId: string): void;
  unpinTool(toolId: string): void;
  createToolGroup(group: ToolGroup): string;
  reorderTools(order: ToolOrder): void;
  
  // 智能功能
  suggestTools(context: SuggestionContext): Promise<ToolSuggestion[]>;
  getRecommendations(context: SuggestionContext & { includeReasons?: boolean }): ToolSuggestion[];
  learnToolUsage(pattern: UsagePattern): Promise<void>;
  optimizeToolLayout(userId: string): Promise<void>;
  
  // 统计功能
  getToolStats(toolId: string): ToolStats | undefined;
  getAllStats(): Array<{ toolId: string; totalExecutions: number; successfulExecutions: number; failedExecutions: number; averageExecutionTime: number }>;
  
  // 状态报告

  
  // 生命周期
  start(): Promise<void>;
  stop(): Promise<void>;
  destroy(): Promise<void>;
}

// ================================================
// 主类实现
// ================================================

export class ToolboxPanel extends EventEmitter implements IToolboxPanel, LifecycleComponent {
  readonly id = 'toolbox-panel';
  readonly name = 'ToolboxPanel';
  private readonly toolboxConfig: ToolboxConfig;
  private _componentConfig: ComponentConfig = {
    id: `toolbox-panel-${Date.now()}`,
    name: 'Toolbox Panel',
    enabled: true,
    autoStart: false,
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
      interval: 60000,
      retention: 86400
    }
  };
  private status: ComponentStatus = 'idle';
  
  // LifecycleComponent接口的config属性
  get config(): ComponentConfig {
    return this._componentConfig;
  }
  
  private toolRegistry!: ToolRegistry;
  private layoutManager!: LayoutManager;
  private executionEngine!: ExecutionEngine;
  private recommendationEngine!: RecommendationEngine;
  private uiRenderer!: UIRenderer;
  private visible = false;
  private viewMode: ViewMode = 'grid';
  private pinnedTools: Set<string> = new Set();
  private toolGroups: Map<string, ToolGroup> = new Map();
  private scheduledTasks: Map<string, NodeJS.Timeout> = new Map();

  constructor(config: ToolboxConfig) {
    super();
    this.toolboxConfig = config;
    
    // 初始化ComponentConfig
    this._componentConfig = {
      id: config.id || `toolbox_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: 'ToolboxPanel',
      enabled: config.enabled || true,
      autoStart: config.autoStart || false,
      dependencies: config.dependencies || [],
      priority: config.priority || 1,
      timeout: config.timeout || 30000,
      retryPolicy: config.retryPolicy || {
        maxAttempts: 3,
        backoffMultiplier: 2,
        initialDelay: 1000,
        maxDelay: 10000
      },
      metrics: config.metrics || {
        enabled: true,
        interval: 60000,
        retention: 24
      }
    };
  }

  // 获取组件配置
  getConfig(): ToolboxConfig {
    return this.toolboxConfig;
  }

  // LifecycleComponent接口实现
  getStatus(): ComponentStatus {
    return this.status;
  }

  async initialize(config: ComponentConfig): Promise<void> {
    if (this.status !== 'idle') {
      throw new Error('Component already initialized');
    }
    
    try {
      this.status = 'initializing';
      
      // 保存组件配置
      this._componentConfig = config;
      
      // 合并配置
      const mergedConfig = { ...this.toolboxConfig, ...(config as unknown as Partial<ToolboxConfig>) };
      
      this.toolRegistry = new ToolRegistry({
        maxTools: mergedConfig.maxTools || 50,
        cacheEnabled: mergedConfig.cacheEnabled !== false
      });

      this.layoutManager = new LayoutManager({
        defaultLayout: mergedConfig.defaultLayout || { type: 'default' },
        responsive: mergedConfig.responsive !== false
      });
      
      this.executionEngine = new ExecutionEngine({
        timeout: mergedConfig.executionTimeout || 30000,
        retryPolicy: mergedConfig.retryPolicy || { maxAttempts: 3, backoffMultiplier: 2, initialDelay: 1000, maxDelay: 10000 }
      });
      
      this.recommendationEngine = new RecommendationEngine({
        algorithm: mergedConfig.recommendationAlgorithm || 'hybrid',
        updateInterval: mergedConfig.recommendationUpdateInterval || 300000
      }, this.toolStats);
      
      this.uiRenderer = new UIRenderer(mergedConfig.ui || {});
      
      this.loadDefaultTools();
      this.status = 'ready';
      this.emit('lifecycle:initialized');
    } catch (error) {
      this.status = 'error';
      this.emit('lifecycle:error', error);
      throw error;
    }
  }

  private loadDefaultTools(): void {
    // 加载默认工具
  }

  async start(): Promise<void> {
    if (this.status !== 'ready') {
      throw new Error('Component not ready to start');
    }
    
    this.status = 'running';
    this.emit('lifecycle:started');
  }

  async stop(): Promise<void> {
    if (this.status !== 'running') {
      return;
    }
    
    this.status = 'destroyed';
    this.emit('lifecycle:stopped');
  }

  async destroy(): Promise<void> {
    await this.stop();
    this.removeAllListeners();
    
    // 使用Array.from()将Map转换为数组进行迭代，避免downlevelIteration问题
    for (const [_, timeout] of Array.from(this.scheduledTasks)) {
      clearTimeout(timeout as any);
      clearInterval(timeout as any);
    }
    this.scheduledTasks.clear();
    
    this.toolStats.clear();
    this.pinnedTools.clear();
    this.toolGroups.clear();
    
    this.status = 'idle';
    this.emit('lifecycle:destroyed');
  }

  // ============ 工具管理 ============

  registerTool(tool: ToolDefinition): ToolRegistrationResult {
    console.log('[工具注册] 开始注册工具:', tool.id || '(无ID)');
    
    try {
      if (tool.id && this.toolRegistry.get(tool.id)) {
        console.log('[工具注册] 工具已存在:', tool.id);
        return {
          success: false,
          error: `工具 ${tool.id} 已注册`
        };
      }

      const validation = this.validateToolDefinition(tool);
      if (!validation.valid) {
        console.log('[工具注册] 验证失败:', validation.errors);
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      const dependencies = this.checkDependencies(tool);
      if (dependencies.missing.length > 0) {
        console.log('[工具注册] 缺少依赖:', dependencies.missing);
        return {
          success: false,
          error: `缺少依赖: ${dependencies.missing.join(', ')}`
        };
      }

      // 将 ToolDefinition 转换为完整的 Tool 对象
      const toolToRegister: Tool = {
        id: tool.id || `tool_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: tool.name,
        description: tool.description || '',
        category: (tool.category || 'utility') as ToolCategory,
        version: '1.0.0', // 默认版本
        tags: tool.tags || [],
        inputs: tool.inputs || [],
        outputs: [], // 默认空输出
        executor: {
          type: 'function',
          handler: tool.executor.handler
        },
        enabled: tool.enabled !== false,
        createdAt: tool.createdAt || new Date(),
        updatedAt: tool.updatedAt || new Date()
      };

      const registeredTool = this.toolRegistry.register(toolToRegister);
      console.log('[工具注册] 工具已注册到注册表:', registeredTool.id);

      this.uiRenderer.addTool(registeredTool);

      this.recommendationEngine.addTool(registeredTool);

      this.emit('tool:registered', { toolId: registeredTool.id, tool: registeredTool });

      return {
        success: true,
        toolId: registeredTool.id,
        warnings: validation.warnings
      };

    } catch (error: any) {
      console.error('[工具注册] 注册失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async unregisterTool(toolId: string): Promise<{ success: boolean; error?: string }> {
    const tool = this.toolRegistry.get(toolId);
    if (!tool) {
      return {
        success: false,
        error: `工具 ${toolId} 不存在`
      };
    }

    this.toolRegistry.unregister(toolId);
    this.pinnedTools.delete(toolId);
    this.emit('tool:unregistered', toolId);

    return {
      success: true
    };
  }

  getTool(toolId: string): Tool | undefined {
    return this.toolRegistry.get(toolId);
  }

  listTools(filter?: ToolFilter): Tool[] {
    return this.toolRegistry.list(filter);
  }

  searchTools(options?: ToolSearchOptions): ToolSearchResult[] {
    const tools = this.toolRegistry.list();
    const results: ToolSearchResult[] = [];

    const hasSearchCriteria = 
      (options?.categories && options.categories.length > 0) ||
      (options?.tags && options.tags.length > 0) ||
      (options?.query && options.query.trim().length > 0);

    for (const tool of tools) {
      let score = 0;
      const matches: string[] = [];

      if (options?.categories && options.categories.length > 0) {
        if (!options.categories.includes(tool.category)) {
          continue;
        }
        score += 1;
      }

      if (options?.tags && options.tags.length > 0) {
        const hasMatchingTag = options.tags.some(tag => tool.tags.includes(tag));
        if (!hasMatchingTag) {
          continue;
        }
        score += 1;
      }

      if (options?.query) {
        const queryLower = options.query.toLowerCase();
        if (tool.name.toLowerCase().includes(queryLower)) {
          score += 0.5;
          matches.push('name');
        }

        if (tool.description.toLowerCase().includes(queryLower)) {
          score += 0.3;
          matches.push('description');
        }

        if (tool.tags.some(tag => tag.toLowerCase().includes(queryLower))) {
          score += 0.2;
          matches.push('tags');
        }

        if (score === 0) {
          continue;
        }
      }

      if (score > 0 || !hasSearchCriteria) {
        results.push({
          tool,
          score,
          matchedFields: matches
        });
      }
    }

    const sortBy = options?.sortBy || 'relevance';
    results.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.tool.name.localeCompare(b.tool.name);
        case 'popularity':
          // 使用toolStats中的totalExecutions替代usageCount
          const statsA = this.toolStats.get(a.tool.id);
          const statsB = this.toolStats.get(b.tool.id);
          const executionsA = statsA?.totalExecutions || 0;
          const executionsB = statsB?.totalExecutions || 0;
          return executionsB - executionsA;
        case 'recent':
          // 使用updatedAt替代registeredAt
          const dateA = a.tool.updatedAt || new Date(0);
          const dateB = b.tool.updatedAt || new Date(0);
          return dateB.getTime() - dateA.getTime();
        default:
          return b.score - a.score;
      }
    });

    const limit = options?.limit || 10;
    const offset = options?.offset || 0;
    return results.slice(offset, offset + limit);
  }

  // ============ 面板控制 ============

  show(): void {
    this.visible = true;
    this.emit('panel:show');
  }

  hide(): void {
    this.visible = false;
    this.emit('panel:hide');
  }

  toggle(): void {
    this.visible = !this.visible;
    this.emit('panel:toggle', this.visible);
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
    this.emit('view:changed', mode);
  }

  setLayout(layout: PanelLayout): void {
    this.layoutManager.setLayout(layout);
    this.emit('layout:changed', layout);
  }

  // ============ 工具执行 ============

  async executeTool(toolId: string, parameters?: any, executionContext?: any): Promise<ToolExecutionResult> {
    const tool = this.toolRegistry.get(toolId);
    if (!tool) {
      return {
        success: false,
        error: {
          code: 'TOOL_NOT_FOUND',
          message: `工具 ${toolId} 不存在`
        },
        metadata: {
          duration: 0
        }
      };
    }

    const validation = this.validateParameters(tool, parameters || {});
    if (!validation.valid) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.errors[0]
        },
        metadata: {
          duration: 0
        }
      };
    }

    const result = await this.executionEngine.execute(tool, parameters);

    const executionTime = result.metadata?.duration || 0;
    console.log('[工具执行] 工具ID:', toolId, '执行时间:', executionTime, '成功:', result.success);

    this.updateToolStats(toolId, result.success, executionTime);

    this.toolRegistry.updateUsage(toolId);

    await this.learnToolUsage({
      userId: 'current-user',
      toolId,
      timestamp: new Date(),
      parameters,
      success: result.success,
      executionTime
    });

    this.emit('tool:executed', { toolId, success: result.success, result });

    return result;
  }

  async executeToolChain(chain: ToolChain): Promise<ToolChainExecutionResult> {
    const tools = new Map<string, Tool>();
    
    // 收集所有工具
    for (const step of chain.steps) {
      const tool = this.toolRegistry.get(step.toolId);
      if (tool) {
        tools.set(step.toolId, tool);
      }
    }

    const result = await this.executionEngine.executeChain(chain, tools);
    
    this.emit('chain:executed', { chain, result });
    
    return result;
  }

  async scheduleTool(toolId: string, schedule: Schedule): Promise<string> {
    const scheduleId = `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const executeScheduled = async () => {
      await this.executeTool(toolId, schedule.parameters);
    };

    if (schedule.type === 'once' && schedule.startTime) {
      const delay = schedule.startTime.getTime() - Date.now();
      const timeout = setTimeout(executeScheduled, Math.max(0, delay));
      this.scheduledTasks.set(scheduleId, timeout);
    } else if (schedule.type === 'recurring' && schedule.interval) {
      const interval = setInterval(executeScheduled, schedule.interval);
      this.scheduledTasks.set(scheduleId, interval);
    }

    this.emit('tool:scheduled', { toolId, scheduleId, schedule });
    
    return scheduleId;
  }

  // ============ 个性化 ============

  pinTool(toolId: string): void {
    this.pinnedTools.add(toolId);
    this.emit('tool:pinned', toolId);
  }

  unpinTool(toolId: string): void {
    this.pinnedTools.delete(toolId);
    this.emit('tool:unpinned', toolId);
  }

  createToolGroup(group: ToolGroup): string {
    const groupId = group.id || `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.toolGroups.set(groupId, { ...group, id: groupId });
    this.emit('group:created', groupId);
    return groupId;
  }

  reorderTools(order: ToolOrder): void {
    this.emit('tools:reordered', order);
  }

  // ============ 智能功能 ============

  async suggestTools(context: SuggestionContext): Promise<ToolSuggestion[]> {
    const tools = this.toolRegistry.list({ enabled: true });
    return await this.recommendationEngine.recommend(context, tools);
  }

  getRecommendations(context: SuggestionContext & { includeReasons?: boolean }): ToolSuggestion[] {
    console.log('[推荐系统] 开始生成推荐，上下文:', context);
    
    const tools = this.toolRegistry.list({ enabled: true });
    console.log('[推荐系统] 可用工具数量:', tools.length);
    
    const suggestions: ToolSuggestion[] = [];
    
    const recentTools = this.recommendationEngine.getRecentTools();
    console.log('[推荐系统] 最近使用的工具:', recentTools);
    
    const enhancedContext = {
      ...context,
      recentTools: context.recentTools || recentTools
    };
    
    for (const tool of tools) {
      const score = this.calculateRelevanceScore(tool, enhancedContext);
      console.log(`[推荐系统] 工具 "${tool.name}" 相关性得分:`, score);
      
      if (score > 0) {
        const suggestion: ToolSuggestion = {
          tool,
          reason: this.generateReason(tool, enhancedContext),
          confidence: score,
          preview: `${tool.name}: ${tool.description}`
        };
        
        if (context.includeReasons) {
          (suggestion as any).reasons = [suggestion.reason];
        }
        
        suggestions.push(suggestion);
      }
    }

    console.log('[推荐系统] 生成推荐数量:', suggestions.length);
    this.emit('recommendation:generated', { userId: context.userId, recommendations: suggestions });
    
    const finalRecommendations = suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
    console.log('[推荐系统] 最终推荐结果:', finalRecommendations.map(r => ({ name: r.tool.name, confidence: r.confidence, reason: r.reason })));
    
    return finalRecommendations;
  }

  private calculateRelevanceScore(tool: Tool, context: SuggestionContext): number {
    let score = 0;

    if (context.recentTools?.includes(tool.id)) {
      score += 0.3;
    }

    score += Math.min((this.toolStats.get(tool.id)?.totalExecutions || 0) / 10, 0.5);

    if (context.currentTask && tool.tags.some(tag => 
      context.currentTask!.toLowerCase().includes(tag.toLowerCase())
    )) {
      score += 0.4;
    }

    return Math.min(score, 1.0);
  }

  private generateReason(tool: Tool, context: SuggestionContext): string {
    if (context.recentTools?.includes(tool.id)) {
      return '最近使用过';
    }
    const stats = this.toolStats.get(tool.id);
    if (stats && stats.totalExecutions > 5) {
      return '热门工具';
    }
    return '推荐使用';
  }

  async learnToolUsage(pattern: UsagePattern): Promise<void> {
    this.recommendationEngine.recordUsage(pattern);
  }

  async optimizeToolLayout(userId: string): Promise<void> {
    this.emit('layout:optimized', userId);
  }

  // ============ 统计功能 ============

  private toolStats: Map<string, ToolStats> = new Map();

  getToolStats(toolId: string): ToolStats | undefined {
    return this.toolStats.get(toolId);
  }

  getAllStats(): Array<{ toolId: string; totalExecutions: number; successfulExecutions: number; failedExecutions: number; averageExecutionTime: number }> {
    return Array.from(this.toolStats.entries()).map(([toolId, stats]) => ({ toolId, ...stats }));
  }

  private updateToolStats(toolId: string, success: boolean, executionTime: number): void {
    const currentStats = this.toolStats.get(toolId);
    const stats: ToolStats = {
      totalExecutions: currentStats?.totalExecutions || 0,
      successfulExecutions: currentStats?.successfulExecutions || 0,
      failedExecutions: currentStats?.failedExecutions || 0,
      averageExecutionTime: 0,
      lastExecuted: Date.now(),
      usageCount: currentStats?.usageCount || 0
    };

    stats.totalExecutions++;
    if (success) {
      stats.successfulExecutions++;
    } else {
      stats.failedExecutions++;
    }

    // 更新平均执行时间（简化计算，实际应该使用所有执行时间的平均值）
    if (stats.totalExecutions > 1) {
      // 基于现有平均值和新的执行时间计算新的平均值
      stats.averageExecutionTime = Math.round(
        ((stats.averageExecutionTime * (stats.totalExecutions - 1)) + executionTime) / stats.totalExecutions
      );
    } else {
      stats.averageExecutionTime = executionTime;
    }

    this.toolStats.set(toolId, stats);
  }

  // ============ 状态报告 ============

  getDetailedStatus(): { componentId: string; status: string; healthy: boolean; metrics: { toolCount: number; totalExecutions: number } } {
    const allStats = this.getAllStats();
    const totalExecutions = allStats.reduce((sum, stat) => sum + stat.totalExecutions, 0);

    return {
      componentId: 'toolbox-panel',
      status: 'running',
      healthy: true,
      metrics: {
        toolCount: this.toolRegistry.list().length,
        totalExecutions
      }
    };
  }

  // ============ 工具方法 ============

  private validateToolDefinition(tool: ToolDefinition): { valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!tool.name || tool.name.trim().length === 0) {
      errors.push('工具名称不能为空');
    }

    if (!tool.executor || typeof tool.executor !== 'object') {
      errors.push('必须提供执行器配置');
    } else if (!tool.executor.handler || typeof tool.executor.handler !== 'function') {
      errors.push('必须提供执行函数');
    }

    if (!tool.category) {
      warnings.push('未指定工具类别');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  private checkDependencies(tool: ToolDefinition): { missing: string[] } {
    const missing: string[] = [];
    
    if (tool.dependencies) {
      for (const dep of tool.dependencies) {
        if (!this.toolRegistry.get(dep)) {
          missing.push(dep);
        }
      }
    }

    return { missing };
  }

  private checkPermission(tool: Tool, parameters: any): boolean {
    return true;
  }

  private validateParameters(tool: Tool, parameters: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const input of tool.inputs) {
      if (input.required && parameters[input.name] === undefined) {
        errors.push(`缺少必需参数: ${input.name}`);
        continue;
      }

      if (parameters[input.name] !== undefined) {
        const value = parameters[input.name];
        const validation = input.validation;

        if (validation) {
          if (validation.min !== undefined && value < validation.min) {
            errors.push(`参数 ${input.name} 的值太小`);
          }
          if (validation.max !== undefined && value > validation.max) {
            errors.push(`参数 ${input.name} 的值太大`);
          }
          if (validation.pattern) {
            let isValid = true;
            const pattern = validation.pattern;
            if (typeof pattern === 'string') {
              const regex = new RegExp(pattern);
              isValid = regex.test(value);
            } else {
              // 使用类型断言处理RegExp情况
              isValid = (pattern as RegExp).test(value);
            }
            if (!isValid) {
              errors.push(`参数 ${input.name} 格式不正确`);
            }
          }
          // 确保custom属性存在且是函数
          if ('custom' in validation && typeof validation.custom === 'function') {
            const customResult = validation.custom(value);
            if (customResult !== true) {
              errors.push(typeof customResult === 'string' ? customResult : `参数 ${input.name} 验证失败`);
            }
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private calculateSearchScore(tool: Tool, query: string): number {
    const queryLower = query.toLowerCase();
    let score = 0;

    if (tool.name.toLowerCase().includes(queryLower)) {
      score += 0.5;
    }

    if (tool.description.toLowerCase().includes(queryLower)) {
      score += 0.3;
    }

    if (tool.tags.some(tag => tag.toLowerCase().includes(queryLower))) {
      score += 0.2;
    }

    return score;
  }

  private findMatches(tool: Tool, query: string): string[] {
    const matches: string[] = [];
    const queryLower = query.toLowerCase();

    if (tool.name.toLowerCase().includes(queryLower)) {
      matches.push('name');
    }
    if (tool.description.toLowerCase().includes(queryLower)) {
      matches.push('description');
    }

    return matches;
  }

  // ============ 生命周期管理 ============

  // ============ 工具管理扩展 ============

  getAllTools(): Tool[] {
    return this.toolRegistry.list();
  }
}

export default ToolboxPanel;
