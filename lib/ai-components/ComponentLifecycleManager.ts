/**
 * @fileoverview 组件生命周期管理器
 * @description 管理AI组件的初始化、启动、停止和依赖关系
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-28
 */

import type { ComponentStatus, ComponentConfig } from './types';
import { ComponentEventBus } from './ComponentEventBus';

export type { ComponentStatus, ComponentConfig };

/**
 * 生命周期组件接口
 */
export interface LifecycleComponent {
  readonly id: string;
  readonly name: string;
  readonly config: ComponentConfig;
  
  getStatus(): ComponentStatus;
  initialize(config: ComponentConfig): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  destroy(): Promise<void>;
}

/**
 * 组件依赖图节点
 */
interface DependencyNode {
  id: string;
  component: LifecycleComponent;
  dependencies: string[];
  dependents: Set<string>;
  status: ComponentStatus;
}

/**
 * 组件生命周期管理器
 * 
 * @description
 * 负责管理所有AI组件的生命周期，包括：
 * - 依赖关系解析
 * - 初始化顺序控制
 * - 并行启动优化
 * - 优雅关闭
 * - 健康检查
 * 
 * @example
 * ```typescript
 * const manager = new ComponentLifecycleManager();
 * 
 * // 注册组件
 * manager.register(chatInterface);
 * manager.register(toolboxPanel);
 * 
 * // 初始化所有组件
 * await manager.initializeAll();
 * 
 * // 启动所有组件
 * await manager.startAll();
 * 
 * // 停止所有组件
 * await manager.stopAll();
 * ```
 */
export class ComponentLifecycleManager {
  private components: Map<string, DependencyNode> = new Map();
  private eventBus: ComponentEventBus;
  private initializationOrder: string[] = [];
  private isShuttingDown = false;

  constructor() {
    this.eventBus = ComponentEventBus.getInstance();
    this.setupGlobalErrorHandling();
  }

  /**
   * 注册组件
   */
  register(component: LifecycleComponent): void {
    if (this.components.has(component.id)) {
      throw new Error(`组件 ${component.id} 已经注册`);
    }

    const node: DependencyNode = {
      id: component.id,
      component,
      dependencies: component.config.dependencies || [],
      dependents: new Set(),
      status: component.getStatus()
    };

    this.components.set(component.id, node);

    // 更新依赖关系
    node.dependencies.forEach(depId => {
      const depNode = this.components.get(depId);
      if (depNode) {
        depNode.dependents.add(component.id);
      }
    });

    console.log(`[LifecycleManager] 注册组件: ${component.name} (${component.id})`);
  }

  /**
   * 取消注册组件
   */
  async unregister(componentId: string): Promise<void> {
    const node = this.components.get(componentId);
    if (!node) return;

    // 停止组件
    if (node.status === 'running') {
      await this.stopComponent(componentId);
    }

    // 销毁组件
    await node.component.destroy();

    // 移除依赖关系
    node.dependencies.forEach(depId => {
      const depNode = this.components.get(depId);
      if (depNode) {
        depNode.dependents.delete(componentId);
      }
    });

    this.components.delete(componentId);
    console.log(`[LifecycleManager] 取消注册组件: ${componentId}`);
  }

  /**
   * 初始化所有组件
   */
  async initializeAll(): Promise<void> {
    console.log('[LifecycleManager] 开始初始化所有组件...');

    // 拓扑排序确定初始化顺序
    this.initializationOrder = this.topologicalSort();

    if (this.initializationOrder.length === 0) {
      throw new Error('检测到循环依赖或没有可初始化的组件');
    }

    console.log('[LifecycleManager] 初始化顺序:', this.initializationOrder.map(id => {
      const node = this.components.get(id);
      return node ? node.component.name : id;
    }).join(' → '));

    // 按顺序初始化
    for (const componentId of this.initializationOrder) {
      const node = this.components.get(componentId);
      if (!node) continue;

      try {
        console.log(`[LifecycleManager] 初始化: ${node.component.name}`);
        
        node.status = 'initializing';
        await node.component.initialize(node.component.config);
        node.status = 'ready';

        this.eventBus.publish('lifecycle', {
          type: 'component_initialized',
          source: componentId,
          data: { componentId, name: node.component.name }
        });

      } catch (error) {
        node.status = 'error';
        console.error(`[LifecycleManager] 初始化失败: ${node.component.name}`, error);
        throw new Error(`组件 ${node.component.name} 初始化失败: ${error}`);
      }
    }

    console.log('[LifecycleManager] 所有组件初始化完成');
  }

  /**
   * 启动所有组件
   */
  async startAll(): Promise<void> {
    console.log('[LifecycleManager] 开始启动所有组件...');

    if (this.initializationOrder.length === 0) {
      throw new Error('请先初始化组件');
    }

    // 按优先级分组
    const priorityGroups = this.groupByPriority();

    // 按优先级顺序启动，同优先级并行启动
    for (const group of priorityGroups) {
      await Promise.all(group.map(async (componentId) => {
        const node = this.components.get(componentId);
        if (!node || node.status !== 'ready') return;

        try {
          console.log(`[LifecycleManager] 启动: ${node.component.name}`);
          
          node.status = 'running';
          await node.component.start();

          this.eventBus.publish('lifecycle', {
            type: 'component_started',
            source: componentId,
            data: { componentId, name: node.component.name }
          });

        } catch (error) {
          node.status = 'error';
          console.error(`[LifecycleManager] 启动失败: ${node.component.name}`, error);
          throw new Error(`组件 ${node.component.name} 启动失败: ${error}`);
        }
      }));
    }

    console.log('[LifecycleManager] 所有组件启动完成');
  }

  /**
   * 停止所有组件
   */
  async stopAll(): Promise<void> {
    console.log('[LifecycleManager] 开始停止所有组件...');
    this.isShuttingDown = true;

    // 逆序停止（依赖者先停止）
    const shutdownOrder = [...this.initializationOrder].reverse();

    for (const componentId of shutdownOrder) {
      await this.stopComponent(componentId);
    }

    console.log('[LifecycleManager] 所有组件已停止');
    this.isShuttingDown = false;
  }

  /**
   * 停止单个组件
   */
  async stopComponent(componentId: string): Promise<void> {
    const node = this.components.get(componentId);
    if (!node || node.status !== 'running') return;

    try {
      console.log(`[LifecycleManager] 停止: ${node.component.name}`);
      
      node.status = 'paused';
      await node.component.stop();

      this.eventBus.publish('lifecycle', {
        type: 'component_stopped',
        source: componentId,
        data: { componentId, name: node.component.name }
      });

    } catch (error) {
      console.error(`[LifecycleManager] 停止失败: ${node.component.name}`, error);
      throw error;
    }
  }

  /**
   * 重启组件
   */
  async restartComponent(componentId: string): Promise<void> {
    const node = this.components.get(componentId);
    if (!node) {
      throw new Error(`组件 ${componentId} 不存在`);
    }

    console.log(`[LifecycleManager] 重启: ${node.component.name}`);

    // 停止依赖此组件的所有组件
    const dependents = Array.from(node.dependents);
    for (const depId of dependents) {
      await this.stopComponent(depId);
    }

    // 停止并重启当前组件
    await this.stopComponent(componentId);
    await node.component.initialize(node.component.config);
    node.status = 'ready';
    await node.component.start();
    node.status = 'running';

    // 重启依赖组件
    for (const depId of dependents) {
      const depNode = this.components.get(depId);
      if (depNode) {
        await depNode.component.start();
        depNode.status = 'running';
      }
    }

    console.log(`[LifecycleManager] 重启完成: ${node.component.name}`);
  }

  /**
   * 获取组件状态
   */
  getComponentStatus(componentId: string): ComponentStatus | null {
    const node = this.components.get(componentId);
    return node ? node.status : null;
  }

  /**
   * 获取所有组件状态
   */
  getAllStatus(): Map<string, ComponentStatus> {
    const statusMap = new Map<string, ComponentStatus>();
    this.components.forEach((node, id) => {
      statusMap.set(id, node.status);
    });
    return statusMap;
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<{
    healthy: boolean;
    components: Array<{
      id: string;
      name: string;
      status: ComponentStatus;
      healthy: boolean;
    }>;
  }> {
    const results: Array<{
      id: string;
      name: string;
      status: ComponentStatus;
      healthy: boolean;
    }> = [];
    let allHealthy = true;

    this.components.forEach((node, id) => {
      const healthy = node.status === 'running' || node.status === 'ready';
      if (!healthy) allHealthy = false;

      results.push({
        id,
        name: node.component.name,
        status: node.status,
        healthy
      });
    });

    return {
      healthy: allHealthy,
      components: results
    };
  }

  /**
   * 拓扑排序（Kahn算法）
   */
  private topologicalSort(): string[] {
    const result: string[] = [];
    const inDegree = new Map<string, number>();
    const queue: string[] = [];

    // 计算入度
    this.components.forEach((node, id) => {
      inDegree.set(id, node.dependencies.length);
      if (node.dependencies.length === 0) {
        queue.push(id);
      }
    });

    // 拓扑排序
    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      const node = this.components.get(current);
      if (node) {
        node.dependents.forEach(depId => {
          const degree = inDegree.get(depId)! - 1;
          inDegree.set(depId, degree);
          if (degree === 0) {
            queue.push(depId);
          }
        });
      }
    }

    // 检测循环依赖
    if (result.length !== this.components.size) {
      const remaining = Array.from(this.components.keys()).filter(
        id => !result.includes(id)
      );
      console.error('[LifecycleManager] 检测到循环依赖:', remaining);
      return [];
    }

    return result;
  }

  /**
   * 按优先级分组
   */
  private groupByPriority(): string[][] {
    const groups = new Map<number, string[]>();

    this.initializationOrder.forEach(id => {
      const node = this.components.get(id);
      if (!node) return;

      const priority = node.component.config.priority || 0;
      if (!groups.has(priority)) {
        groups.set(priority, []);
      }
      groups.get(priority)!.push(id);
    });

    // 按优先级降序排序（高优先级先启动）
    return Array.from(groups.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([_, ids]) => ids);
  }

  /**
   * 设置全局错误处理
   */
  private setupGlobalErrorHandling(): void {
    this.eventBus.subscribe('lifecycle', (event) => {
      if (event.type === 'component_error' && !this.isShuttingDown) {
        const componentId = event.data?.componentId;
        console.error(`[LifecycleManager] 组件错误:`, event.data);
        
        // 可以在这里实现自动重启逻辑
        // this.restartComponent(componentId).catch(console.error);
      }
    });
  }

  /**
   * 清理所有资源
   */
  async cleanup(): Promise<void> {
    await this.stopAll();
    
    for (const [id, node] of Array.from(this.components.entries())) {
      await node.component.destroy();
    }
    
    this.components.clear();
    this.initializationOrder = [];
  }
}

// 默认导出
export default ComponentLifecycleManager;
