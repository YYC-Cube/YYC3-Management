/**
 * ComponentLifecycleManager 单元测试
 * 
 * 测试生命周期管理器的完整功能：
 * - 组件注册和依赖管理
 * - 拓扑排序和初始化顺序
 * - 循环依赖检测
 * - 并行初始化优化
 * - 健康检查系统
 * 
 * @module Tests/ComponentLifecycleManager
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentLifecycleManager } from '../ComponentLifecycleManager';
import type { LifecycleComponent } from '../types';

// Mock组件工厂
function createMockComponent(id: string, dependencies: string[] = []): LifecycleComponent {
  return {
    id,
    dependencies,
    priority: 0,
    status: 'idle',
    config: {
      dependencies,
      priority: 0,
      healthCheckInterval: 5000,
      maxRetries: 3,
      retryDelay: 1000,
      timeout: 30000,
      autoStart: true,
      autoDestroy: false,
      lazyLoad: false,
      cacheEnabled: true,
      cacheTTL: 60000,
      version: '1.0.0',
      metadata: {}
    },
    initialize: vi.fn().mockResolvedValue(undefined),
    start: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn().mockResolvedValue(undefined),
    destroy: vi.fn().mockResolvedValue(undefined),
    getStatus: vi.fn().mockReturnValue('idle'),
  };
}

describe('ComponentLifecycleManager', () => {
  let manager: ComponentLifecycleManager;
  
  beforeEach(() => {
    manager = new ComponentLifecycleManager();
  });
  
  describe('Component Registration', () => {
    it('should register a component successfully', () => {
      const component = createMockComponent('comp-1');
      
      expect(() => {
        manager.register(component);
      }).not.toThrow();
    });
    
    it('should throw error when registering duplicate component', () => {
      const component1 = createMockComponent('comp-1');
      const component2 = createMockComponent('comp-1');
      
      manager.register(component1);
      
      expect(() => {
        manager.register(component2);
      }).toThrow('Component comp-1 already registered');
    });
    
    it('should register multiple components', () => {
      const comp1 = createMockComponent('comp-1');
      const comp2 = createMockComponent('comp-2');
      const comp3 = createMockComponent('comp-3');
      
      manager.register(comp1);
      manager.register(comp2);
      manager.register(comp3);
      
      const components = manager.listComponents();
      expect(components).toHaveLength(3);
    });
  });
  
  describe('Dependency Resolution', () => {
    it('should initialize components in dependency order', async () => {
      // comp-1 (no deps) → comp-2 (dep: comp-1) → comp-3 (dep: comp-2)
      const comp1 = createMockComponent('comp-1', []);
      const comp2 = createMockComponent('comp-2', ['comp-1']);
      const comp3 = createMockComponent('comp-3', ['comp-2']);
      
      manager.register(comp3); // 注册顺序无关
      manager.register(comp1);
      manager.register(comp2);
      
      await manager.initializeAll();
      
      // 验证初始化顺序
      const initOrder: string[] = [];
      [comp1, comp2, comp3].forEach(comp => {
        const mock = comp.initialize as vi.Mock;
        if (mock.mock.invocationCallOrder[0]) {
          initOrder.push({
            id: comp.id,
            order: mock.mock.invocationCallOrder[0],
          } as any);
        }
      });
      
      initOrder.sort((a: any, b: any) => a.order - b.order);
      
      expect(initOrder.map((x: any) => x.id)).toEqual(['comp-1', 'comp-2', 'comp-3']);
    });
    
    it('should handle complex dependency graphs', async () => {
      /*
        Dependency graph:
        comp-1 (root)
        ├── comp-2
        │   └── comp-4
        └── comp-3
            └── comp-4
      */
      const comp1 = createMockComponent('comp-1', []);
      const comp2 = createMockComponent('comp-2', ['comp-1']);
      const comp3 = createMockComponent('comp-3', ['comp-1']);
      const comp4 = createMockComponent('comp-4', ['comp-2', 'comp-3']);
      
      [comp4, comp3, comp2, comp1].forEach(c => manager.register(c));
      
      await manager.initializeAll();
      
      // comp-1 应该先被初始化
      expect(comp1.initialize).toHaveBeenCalled();
      
      // comp-4 应该最后被初始化（依赖 comp-2 和 comp-3）
      expect(comp4.initialize).toHaveBeenCalled();
    });
    
    it('should detect circular dependencies', () => {
      const comp1 = createMockComponent('comp-1', ['comp-2']);
      const comp2 = createMockComponent('comp-2', ['comp-3']);
      const comp3 = createMockComponent('comp-3', ['comp-1']); // 循环！
      
      manager.register(comp1);
      manager.register(comp2);
      manager.register(comp3);
      
      expect(async () => {
        await manager.initializeAll();
      }).rejects.toThrow(/circular dependency/i);
    });
    
    it('should throw error for missing dependencies', async () => {
      const comp = createMockComponent('comp-1', ['non-existent-dep']);
      
      manager.register(comp);
      
      await expect(manager.initializeAll()).rejects.toThrow(
        /dependency.*not found/i
      );
    });
  });
  
  describe('Priority-Based Initialization', () => {
    it('should initialize components by priority', async () => {
      const highPriority = { ...createMockComponent('high'), priority: 10 };
      const medPriority = { ...createMockComponent('med'), priority: 5 };
      const lowPriority = { ...createMockComponent('low'), priority: 1 };
      
      // 注册顺序无关
      manager.register(lowPriority);
      manager.register(highPriority);
      manager.register(medPriority);
      
      await manager.initializeAll();
      
      // 验证高优先级先执行
      const highOrder = (highPriority.initialize as vi.Mock).mock.invocationCallOrder[0];
      const medOrder = (medPriority.initialize as vi.Mock).mock.invocationCallOrder[0];
      const lowOrder = (lowPriority.initialize as vi.Mock).mock.invocationCallOrder[0];
      
      expect(highOrder).toBeLessThan(medOrder);
      expect(medOrder).toBeLessThan(lowOrder);
    });
    
    it('should parallelize components with same priority', async () => {
      const components = Array.from({ length: 5 }, (_, i) => 
        createMockComponent(`comp-${i}`, [])
      );
      
      // 所有组件相同优先级
      components.forEach(c => {
        c.priority = 5;
        manager.register(c);
      });
      
      const startTime = Date.now();
      await manager.initializeAll();
      const endTime = Date.now();
      
      // 并行执行应该很快完成
      expect(endTime - startTime).toBeLessThan(100);
      
      // 所有组件都应该被初始化
      components.forEach(c => {
        expect(c.initialize).toHaveBeenCalled();
      });
    });
  });
  
  describe('Lifecycle Methods', () => {
    it('should call start after initialize', async () => {
      const component = createMockComponent('comp-1');
      manager.register(component);
      
      await manager.initializeAll();
      await manager.startAll();
      
      expect(component.initialize).toHaveBeenCalled();
      expect(component.start).toHaveBeenCalled();
      
      // initialize 应该在 start 之前调用
      const initOrder = (component.initialize as vi.Mock).mock.invocationCallOrder[0];
      const startOrder = (component.start as vi.Mock).mock.invocationCallOrder[0];
      expect(initOrder).toBeLessThan(startOrder);
    });
    
    it('should stop components in reverse order', async () => {
      const comp1 = createMockComponent('comp-1', []);
      const comp2 = createMockComponent('comp-2', ['comp-1']);
      const comp3 = createMockComponent('comp-3', ['comp-2']);
      
      [comp1, comp2, comp3].forEach(c => manager.register(c));
      
      await manager.initializeAll();
      await manager.startAll();
      await manager.stopAll();
      
      // 验证停止顺序（反向）
      const stop1Order = (comp1.stop as vi.Mock).mock.invocationCallOrder[0];
      const stop2Order = (comp2.stop as vi.Mock).mock.invocationCallOrder[0];
      const stop3Order = (comp3.stop as vi.Mock).mock.invocationCallOrder[0];
      
      expect(stop3Order).toBeLessThan(stop2Order);
      expect(stop2Order).toBeLessThan(stop1Order);
    });
    
    it('should handle component initialization failure', async () => {
      const goodComp = createMockComponent('good');
      const badComp = createMockComponent('bad');
      
      (badComp.initialize as vi.Mock).mockRejectedValue(new Error('Init failed'));
      
      manager.register(goodComp);
      manager.register(badComp);
      
      await expect(manager.initializeAll()).rejects.toThrow('Init failed');
    });
  });
  
  describe('Health Checks', () => {
    it('should perform health check on all components', async () => {
      const comp1 = createMockComponent('comp-1');
      const comp2 = createMockComponent('comp-2');
      
      (comp1.getStatus as vi.Mock).mockReturnValue('running');
      (comp2.getStatus as vi.Mock).mockReturnValue('running');
      
      manager.register(comp1);
      manager.register(comp2);
      
      await manager.initializeAll();
      await manager.startAll();
      
      const healthResult = await manager.healthCheck();
      
      expect(healthResult.healthy).toBe(true);
      expect(healthResult.components).toHaveLength(2);
    });
    
    it('should detect unhealthy components', async () => {
      const healthyComp = createMockComponent('healthy');
      const unhealthyComp = createMockComponent('unhealthy');
      
      (healthyComp.getStatus as vi.Mock).mockReturnValue('running');
      (unhealthyComp.getStatus as vi.Mock).mockReturnValue('error');
      
      manager.register(healthyComp);
      manager.register(unhealthyComp);
      
      await manager.initializeAll();
      
      const healthResult = await manager.healthCheck();
      
      expect(healthResult.healthy).toBe(false);
      expect(healthResult.unhealthyComponents).toContain('unhealthy');
    });
  });
  
  describe('Component Restart', () => {
    it('should restart a single component', async () => {
      const component = createMockComponent('comp-1');
      
      manager.register(component);
      await manager.initializeAll();
      await manager.startAll();
      
      vi.clearAllMocks();
      
      await manager.restartComponent('comp-1');
      
      expect(component.stop).toHaveBeenCalled();
      expect(component.start).toHaveBeenCalled();
    });
    
    it('should restart component with dependents', async () => {
      const comp1 = createMockComponent('comp-1', []);
      const comp2 = createMockComponent('comp-2', ['comp-1']);
      
      manager.register(comp1);
      manager.register(comp2);
      
      await manager.initializeAll();
      await manager.startAll();
      
      vi.clearAllMocks();
      
      // 重启 comp-1 应该也重启 comp-2
      await manager.restartComponent('comp-1', { restartDependents: true });
      
      expect(comp1.stop).toHaveBeenCalled();
      expect(comp1.start).toHaveBeenCalled();
      expect(comp2.stop).toHaveBeenCalled();
      expect(comp2.start).toHaveBeenCalled();
    });
  });
  
  describe('Performance', () => {
    it('should handle many components efficiently', async () => {
      const componentCount = 100;
      const components: LifecycleComponent[] = [];
      
      // 创建复杂的依赖图
      for (let i = 0; i < componentCount; i++) {
        const deps = i > 0 ? [`comp-${i - 1}`] : [];
        components.push(createMockComponent(`comp-${i}`, deps));
      }
      
      components.forEach(c => manager.register(c));
      
      const startTime = Date.now();
      await manager.initializeAll();
      const endTime = Date.now();
      
      // 100个组件应该在合理时间内完成
      expect(endTime - startTime).toBeLessThan(1000);
      
      // 验证所有组件都被初始化
      components.forEach(c => {
        expect(c.initialize).toHaveBeenCalled();
      });
    });
  });
});
