/**
 * @fileoverview AI组件集成服务
 * @description 将8大核心组件整合为统一服务，提供便捷的访问接口
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-28
 */

import { ComponentEventBus } from './ComponentEventBus';
import { ComponentLifecycleManager } from './ComponentLifecycleManager';
import type { LifecycleComponent } from './ComponentLifecycleManager';
import type { ComponentStatus, ComponentConfig } from './types';

// 导入8大核心组件
import { ChatInterface } from '../chat-interface';
import { ToolboxPanel } from '../toolbox-panel';
import { InsightsDashboard } from '../insights-dashboard';
import { WorkflowDesigner } from '../workflow-designer';
import { KnowledgeBase } from '../knowledge-base';
import { AIActionsManager } from '../ai-actions-manager';
import { StreamProcessor } from '../stream-processor';
import { ContextManager } from '../context-manager';

/**
 * AI组件集成配置
 */
export interface AIComponentsConfig {
  // 组件启用配置
  enabledComponents?: {
    chatInterface?: boolean;
    toolboxPanel?: boolean;
    insightsDashboard?: boolean;
    workflowDesigner?: boolean;
    knowledgeBase?: boolean;
    aiActionsManager?: boolean;
    streamProcessor?: boolean;
    contextManager?: boolean;
  };

  // 各组件的配置
  components?: {
    chatInterface?: any;
    toolboxPanel?: any;
    insightsDashboard?: any;
    workflowDesigner?: any;
    knowledgeBase?: any;
    aiActionsManager?: any;
    streamProcessor?: any;
    contextManager?: any;
  };

  // 全局配置
  autoStart?: boolean;
  enableMetrics?: boolean;
  enableLogging?: boolean;
}

/**
 * AI组件集成服务
 * 
 * @description
 * 整合8大核心AI组件，提供统一的：
 * - 初始化和启动
 * - 生命周期管理
 * - 组件间通信
 * - 健康检查和监控
 * - 便捷访问接口
 * 
 * @example
 * ```typescript
 * const aiComponents = new AIComponentsIntegration({
 *   enabledComponents: {
 *     chatInterface: true,
 *     toolboxPanel: true,
 *     insightsDashboard: true
 *   }
 * });
 * 
 * // 初始化并启动
 * await aiComponents.initialize();
 * await aiComponents.start();
 * 
 * // 访问组件
 * const chat = aiComponents.getChatInterface();
 * await chat.sendMessage({ content: 'Hello' });
 * 
 * // 健康检查
 * const health = await aiComponents.healthCheck();
 * console.log('系统健康:', health);
 * ```
 */
export class AIComponentsIntegration {
  private eventBus: ComponentEventBus;
  private lifecycleManager: ComponentLifecycleManager;
  private config: AIComponentsConfig;
  
  // 8大核心组件实例
  private chatInterface?: ChatInterface;
  private toolboxPanel?: ToolboxPanel;
  private insightsDashboard?: InsightsDashboard;
  private workflowDesigner?: WorkflowDesigner;
  private knowledgeBase?: KnowledgeBase;
  private aiActionsManager?: AIActionsManager;
  private streamProcessor?: StreamProcessor;
  private contextManager?: ContextManager;

  private initialized = false;
  private started = false;

  constructor(config: AIComponentsConfig = {}) {
    this.config = {
      enabledComponents: {
        chatInterface: true,
        toolboxPanel: true,
        insightsDashboard: true,
        workflowDesigner: true,
        knowledgeBase: true,
        aiActionsManager: true,
        streamProcessor: true,
        contextManager: true,
        ...config.enabledComponents
      },
      autoStart: false,
      enableMetrics: true,
      enableLogging: true,
      ...config
    };

    this.eventBus = ComponentEventBus.getInstance();
    this.lifecycleManager = new ComponentLifecycleManager();

    console.log('[AIComponentsIntegration] 已创建集成服务实例');
  }

  /**
   * 初始化所有组件
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('[AIComponentsIntegration] 已经初始化，跳过');
      return;
    }

    console.log('[AIComponentsIntegration] 开始初始化AI组件系统...');

    try {
      // 创建并注册启用的组件
      await this.createComponents();

      // 初始化所有组件
      await this.lifecycleManager.initializeAll();

      this.initialized = true;
      console.log('[AIComponentsIntegration] 初始化完成');

      // 发布初始化完成事件
      this.eventBus.publish('system', {
        type: 'system_initialized',
        source: 'AIComponentsIntegration',
        data: {
          timestamp: Date.now(),
          enabledComponents: this.getEnabledComponentNames()
        }
      });

      // 自动启动
      if (this.config.autoStart) {
        await this.start();
      }

    } catch (error) {
      console.error('[AIComponentsIntegration] 初始化失败:', error);
      throw error;
    }
  }

  /**
   * 启动所有组件
   */
  async start(): Promise<void> {
    if (!this.initialized) {
      throw new Error('请先初始化系统');
    }

    if (this.started) {
      console.warn('[AIComponentsIntegration] 已经启动，跳过');
      return;
    }

    console.log('[AIComponentsIntegration] 启动AI组件系统...');

    try {
      await this.lifecycleManager.startAll();
      this.started = true;
      console.log('[AIComponentsIntegration] 系统启动完成');

      // 发布启动完成事件
      this.eventBus.publish('system', {
        type: 'system_started',
        source: 'AIComponentsIntegration',
        data: { timestamp: Date.now() }
      });

    } catch (error) {
      console.error('[AIComponentsIntegration] 启动失败:', error);
      throw error;
    }
  }

  /**
   * 停止所有组件
   */
  async stop(): Promise<void> {
    if (!this.started) {
      return;
    }

    console.log('[AIComponentsIntegration] 停止AI组件系统...');

    try {
      await this.lifecycleManager.stopAll();
      this.started = false;
      console.log('[AIComponentsIntegration] 系统已停止');

      // 发布停止事件
      this.eventBus.publish('system', {
        type: 'system_stopped',
        source: 'AIComponentsIntegration',
        data: { timestamp: Date.now() }
      });

    } catch (error) {
      console.error('[AIComponentsIntegration] 停止失败:', error);
      throw error;
    }
  }

  /**
   * 创建组件实例
   */
  private async createComponents(): Promise<void> {
    const enabled = this.config.enabledComponents!;
    const componentsConfig = this.config.components || {};

    // 定义组件定义类型
    interface ComponentDefinition {
      create: () => LifecycleComponent;
      dependencies: string[];
    }

    // 定义所有组件及其依赖关系
    const componentDefinitions: Record<string, ComponentDefinition> = {
      'context-manager': {
        create: () => new ContextManager(componentsConfig.contextManager || this.getDefaultContextManagerConfig()),
        dependencies: []
      },
      'stream-processor': {
        create: () => new StreamProcessor(componentsConfig.streamProcessor || {}),
        dependencies: ['context-manager']
      },
      'knowledge-base': {
        create: () => new KnowledgeBase('knowledge-base', componentsConfig.knowledgeBase || {}, {
          dependencies: ['context-manager']
        }),
        dependencies: ['context-manager']
      },
      'ai-actions-manager': {
        create: () => new AIActionsManager(componentsConfig.aiActionsManager || {}),
        dependencies: ['context-manager', 'knowledge-base']
      },
      'chat-interface': {
        create: () => new ChatInterface(componentsConfig.chatInterface || {}),
        dependencies: ['context-manager', 'ai-actions-manager']
      },
      'toolbox-panel': {
        create: () => new ToolboxPanel(componentsConfig.toolboxPanel || {}),
        dependencies: ['ai-actions-manager']
      },
      'insights-dashboard': {
        create: () => new InsightsDashboard(componentsConfig.insightsDashboard || {}),
        dependencies: ['stream-processor']
      },
      'workflow-designer': {
        create: () => new WorkflowDesigner(componentsConfig.workflowDesigner || {}),
        dependencies: ['toolbox-panel', 'ai-actions-manager']
      }
    };

    // 递归解析依赖关系
    const resolveDependencies = (componentId: string, visited = new Set<string>()): string[] => {
      if (visited.has(componentId)) {
        return [];
      }
      visited.add(componentId);

      const def = componentDefinitions[componentId];
      if (!def) {
        return [];
      }

      const deps = def.dependencies.flatMap(dep => {
        return [dep, ...resolveDependencies(dep, visited)];
      });

      return [...new Set(deps)];
    };

    // 收集所有需要创建的组件（启用的组件及其依赖）
    const componentsToCreate = new Set<string>();
    Object.entries(enabled).forEach(([id, isEnabled]) => {
      if (isEnabled) {
        const componentId = this.mapConfigIdToComponentId(id);
        componentsToCreate.add(componentId);
        resolveDependencies(componentId).forEach(dep => componentsToCreate.add(dep));
      }
    });

    // 按依赖顺序创建组件
    const createOrder = this.topologicalSort(Array.from(componentsToCreate), componentDefinitions);
    createOrder.forEach(componentId => {
      const def = componentDefinitions[componentId];
      if (def) {
        const component = def.create();
        this.registerComponent(component as any, def.dependencies);
        this.setComponentInstance(componentId, component);
      }
    });

    console.log(`[AIComponentsIntegration] 已创建 ${componentsToCreate.size} 个组件`);
  }

  /**
   * 获取默认的ContextManager配置
   */
  private getDefaultContextManagerConfig() {
    return {
      shortTermMemory: {
        maxEntries: 100,
        ttl: 300000
      },
      longTermMemory: {
        enablePersistence: false,
        maxSize: 10485760,
        indexType: 'hash' as const
      },
      workingMemory: {
        bufferSize: 50,
        flushInterval: 60000
      },
      compression: {
        enabled: true,
        algorithm: 'summarize' as const,
        ratio: 0.5
      },
      retrieval: {
        maxResults: 10,
        similarityThreshold: 0.7,
        strategy: 'hybrid' as const
      }
    };
  }

  /**
   * 映射配置ID到组件ID
   */
  private mapConfigIdToComponentId(configId: string): string {
    const mapping: Record<string, string> = {
      'chatInterface': 'chat-interface',
      'toolboxPanel': 'toolbox-panel',
      'insightsDashboard': 'insights-dashboard',
      'workflowDesigner': 'workflow-designer',
      'knowledgeBase': 'knowledge-base',
      'aiActionsManager': 'ai-actions-manager',
      'streamProcessor': 'stream-processor',
      'contextManager': 'context-manager'
    };
    return mapping[configId] || configId;
  }

  /**
   * 拓扑排序
   */
  private topologicalSort(componentIds: string[], componentDefinitions: any): string[] {
    const visited = new Set<string>();
    const result: string[] = [];

    const visit = (componentId: string) => {
      if (visited.has(componentId)) {
        return;
      }
      visited.add(componentId);

      const def = componentDefinitions[componentId];
      if (def) {
        def.dependencies.forEach((dep: string) => visit(dep));
      }

      result.push(componentId);
    };

    componentIds.forEach(id => visit(id));
    return result;
  }

  /**
   * 设置组件实例
   */
  private setComponentInstance(componentId: string, component: any): void {
    switch (componentId) {
      case 'context-manager':
        this.contextManager = component;
        break;
      case 'stream-processor':
        this.streamProcessor = component;
        break;
      case 'knowledge-base':
        this.knowledgeBase = component;
        break;
      case 'ai-actions-manager':
        this.aiActionsManager = component;
        break;
      case 'chat-interface':
        this.chatInterface = component;
        break;
      case 'toolbox-panel':
        this.toolboxPanel = component;
        break;
      case 'insights-dashboard':
        this.insightsDashboard = component;
        break;
      case 'workflow-designer':
        this.workflowDesigner = component;
        break;
    }
  }

  /**
   * 注册组件到生命周期管理器
   */
  private registerComponent(component: LifecycleComponent, dependencies: string[]): void {
    this.lifecycleManager.register(component);
  }

  // ============================================
  // 组件访问器
  // ============================================

  getChatInterface(): ChatInterface | undefined {
    return this.chatInterface;
  }

  getToolboxPanel(): ToolboxPanel | undefined {
    return this.toolboxPanel;
  }

  getInsightsDashboard(): InsightsDashboard | undefined {
    return this.insightsDashboard;
  }

  getWorkflowDesigner(): WorkflowDesigner | undefined {
    return this.workflowDesigner;
  }

  getKnowledgeBase(): KnowledgeBase | undefined {
    return this.knowledgeBase;
  }

  getAIActionsManager(): AIActionsManager | undefined {
    return this.aiActionsManager;
  }

  getStreamProcessor(): StreamProcessor | undefined {
    return this.streamProcessor;
  }

  getContextManager(): ContextManager | undefined {
    return this.contextManager;
  }

  // ============================================
  // 系统信息和监控
  // ============================================

  /**
   * 健康检查
   */
  async healthCheck() {
    return await this.lifecycleManager.healthCheck();
  }

  /**
   * 获取系统状态
   */
  getSystemStatus() {
    return {
      initialized: this.initialized,
      started: this.started,
      components: this.lifecycleManager.getAllStatus()
    };
  }

  /**
   * 获取已启用的组件名称列表
   */
  private getEnabledComponentNames(): string[] {
    const names: string[] = [];
    const enabled = this.config.enabledComponents!;

    if (enabled.chatInterface) names.push('ChatInterface');
    if (enabled.toolboxPanel) names.push('ToolboxPanel');
    if (enabled.insightsDashboard) names.push('InsightsDashboard');
    if (enabled.workflowDesigner) names.push('WorkflowDesigner');
    if (enabled.knowledgeBase) names.push('KnowledgeBase');
    if (enabled.aiActionsManager) names.push('AIActionsManager');
    if (enabled.streamProcessor) names.push('StreamProcessor');
    if (enabled.contextManager) names.push('ContextManager');

    return names;
  }

  /**
   * 获取事件总线实例
   */
  getEventBus(): ComponentEventBus {
    return this.eventBus;
  }

  /**
   * 获取生命周期管理器实例
   */
  getLifecycleManager(): ComponentLifecycleManager {
    return this.lifecycleManager;
  }

  /**
   * 清理所有资源
   */
  async cleanup(): Promise<void> {
    await this.stop();
    await this.lifecycleManager.cleanup();
    this.initialized = false;
    this.started = false;
  }
}

// 默认导出
export default AIComponentsIntegration;
