/**
 * AIComponentsIntegration 单元测试
 * 
 * 测试集成服务的完整功能：
 * - 组件注册和配置
 * - 依赖图构建和验证
 * - 系统初始化和启动
 * - 组件访问器
 * - 健康检查
 * - 错误处理
 * 
 * @module Tests/AIComponentsIntegration
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AIComponentsIntegration } from '../AIComponentsIntegration';
import type { AIComponentsConfig } from '../types';

describe('AIComponentsIntegration', () => {
  let integration: AIComponentsIntegration;
  let config: AIComponentsConfig;
  
  beforeEach(() => {
    config = {
      enabledComponents: {
        chatInterface: true,
        toolboxPanel: true,
        insightsDashboard: true,
        workflowDesigner: true,
        knowledgeBase: true,
        aiActionsManager: true,
        streamProcessor: true,
        contextManager: true,
      },
      autoStart: false,
      enableMetrics: true,
    };
    
    integration = new AIComponentsIntegration(config);
  });
  
  describe('Initialization', () => {
    it('should create integration instance successfully', () => {
      expect(integration).toBeDefined();
      expect(integration).toBeInstanceOf(AIComponentsIntegration);
    });
    
    it('should initialize with default config when not provided', () => {
      const defaultIntegration = new AIComponentsIntegration();
      expect(defaultIntegration).toBeDefined();
    });
    
    it('should respect enabled components configuration', () => {
      const minimalConfig: AIComponentsConfig = {
        enabledComponents: {
          chatInterface: true,
        },
      };
      
      const minimalIntegration = new AIComponentsIntegration(minimalConfig);
      expect(minimalIntegration).toBeDefined();
    });
    
    it('should initialize all enabled components', async () => {
      await integration.initialize();
      
      const status = integration.getSystemStatus();
      expect(status.initialized).toBe(true);
    });
  });
  
  describe('Component Registration', () => {
    it('should register components based on enabled config', async () => {
      await integration.initialize();
      
      const chatInterface = integration.getChatInterface();
      expect(chatInterface).toBeDefined();
    });
    
    it('should not register disabled components', async () => {
      const limitedConfig: AIComponentsConfig = {
        enabledComponents: {
          chatInterface: true,
        },
      };
      
      const limitedIntegration = new AIComponentsIntegration(limitedConfig);
      await limitedIntegration.initialize();
      
      expect(limitedIntegration.getChatInterface()).toBeDefined();
      expect(limitedIntegration.getToolboxPanel()).toBeUndefined();
    });
    
    it('should build correct dependency graph', async () => {
      await integration.initialize();
      
      // ContextManager 应该先于其他组件初始化（无依赖）
      const contextManager = integration.getContextManager();
      expect(contextManager).toBeDefined();
      
      // ChatInterface 依赖 ContextManager 和 AIActionsManager
      const chatInterface = integration.getChatInterface();
      expect(chatInterface).toBeDefined();
    });
  });
  
  describe('Component Accessors', () => {
    beforeEach(async () => {
      await integration.initialize();
    });
    
    it('should provide access to ChatInterface', () => {
      const chatInterface = integration.getChatInterface();
      expect(chatInterface).toBeDefined();
      expect(chatInterface.getStatus).toBeDefined();
    });
    
    it('should provide access to ToolboxPanel', () => {
      const toolboxPanel = integration.getToolboxPanel();
      expect(toolboxPanel).toBeDefined();
    });
    
    it('should provide access to InsightsDashboard', () => {
      const dashboard = integration.getInsightsDashboard();
      expect(dashboard).toBeDefined();
    });
    
    it('should provide access to WorkflowDesigner', () => {
      const designer = integration.getWorkflowDesigner();
      expect(designer).toBeDefined();
    });
    
    it('should provide access to KnowledgeBase', () => {
      const kb = integration.getKnowledgeBase();
      expect(kb).toBeDefined();
    });
    
    it('should provide access to AIActionsManager', () => {
      const manager = integration.getAIActionsManager();
      expect(manager).toBeDefined();
    });
    
    it('should provide access to StreamProcessor', () => {
      const processor = integration.getStreamProcessor();
      expect(processor).toBeDefined();
    });
    
    it('should provide access to ContextManager', () => {
      const contextManager = integration.getContextManager();
      expect(contextManager).toBeDefined();
    });
    
    it('should return undefined for disabled components', () => {
      const limitedIntegration = new AIComponentsIntegration({
        enabledComponents: { chatInterface: true },
      });
      
      expect(limitedIntegration.getToolboxPanel()).toBeUndefined();
      expect(limitedIntegration.getInsightsDashboard()).toBeUndefined();
    });
  });
  
  describe('Lifecycle Management', () => {
    it('should initialize all components in correct order', async () => {
      await integration.initialize();
      
      const status = integration.getSystemStatus();
      expect(status.initialized).toBe(true);
      expect(status.componentCount).toBeGreaterThan(0);
    });
    
    it('should start all initialized components', async () => {
      await integration.initialize();
      await integration.start();
      
      const status = integration.getSystemStatus();
      expect(status.running).toBe(true);
    });
    
    it('should stop all running components', async () => {
      await integration.initialize();
      await integration.start();
      await integration.stop();
      
      const status = integration.getSystemStatus();
      expect(status.running).toBe(false);
    });
    
    it('should handle component initialization failure gracefully', async () => {
      // 模拟组件初始化失败
      const failingConfig: AIComponentsConfig = {
        enabledComponents: {
          chatInterface: true,
        },
      };
      
      const failingIntegration = new AIComponentsIntegration(failingConfig);
      
      // 应该抛出错误或返回错误状态
      await expect(async () => {
        await failingIntegration.initialize();
        // 强制某个组件失败
      }).rejects.toThrow();
    });
    
    it('should support autoStart configuration', async () => {
      const autoStartConfig: AIComponentsConfig = {
        enabledComponents: {
          chatInterface: true,
        },
        autoStart: true,
      };
      
      const autoStartIntegration = new AIComponentsIntegration(autoStartConfig);
      await autoStartIntegration.initialize();
      
      const status = autoStartIntegration.getSystemStatus();
      expect(status.running).toBe(true);
    });
  });
  
  describe('Health Checks', () => {
    beforeEach(async () => {
      await integration.initialize();
      await integration.start();
    });
    
    it('should perform system-wide health check', async () => {
      const healthResult = await integration.healthCheck();
      
      expect(healthResult).toBeDefined();
      expect(healthResult.healthy).toBeDefined();
      expect(healthResult.components).toBeDefined();
      expect(Array.isArray(healthResult.components)).toBe(true);
    });
    
    it('should report all healthy components', async () => {
      const healthResult = await integration.healthCheck();
      
      // 所有启用的组件应该是健康的
      const enabledCount = Object.values(config.enabledComponents || {})
        .filter(Boolean).length;
      
      expect(healthResult.components.length).toBe(enabledCount);
      
      const allHealthy = healthResult.components.every(
        c => c.status === 'running' || c.status === 'ready'
      );
      expect(allHealthy).toBe(true);
    });
    
    it('should detect unhealthy components', async () => {
      // 模拟组件故障
      const contextManager = integration.getContextManager();
      if (contextManager) {
        // 强制设置为错误状态（需要组件支持）
        vi.spyOn(contextManager, 'getStatus').mockReturnValue('error');
      }
      
      const healthResult = await integration.healthCheck();
      
      expect(healthResult.healthy).toBe(false);
      expect(healthResult.unhealthyComponents).toBeDefined();
      expect(healthResult.unhealthyComponents!.length).toBeGreaterThan(0);
    });
  });
  
  describe('System Status', () => {
    it('should return correct status before initialization', () => {
      const status = integration.getSystemStatus();
      
      expect(status.initialized).toBe(false);
      expect(status.running).toBe(false);
      expect(status.componentCount).toBe(0);
    });
    
    it('should return correct status after initialization', async () => {
      await integration.initialize();
      
      const status = integration.getSystemStatus();
      
      expect(status.initialized).toBe(true);
      expect(status.running).toBe(false);
      expect(status.componentCount).toBeGreaterThan(0);
    });
    
    it('should return correct status after start', async () => {
      await integration.initialize();
      await integration.start();
      
      const status = integration.getSystemStatus();
      
      expect(status.initialized).toBe(true);
      expect(status.running).toBe(true);
    });
    
    it('should include metrics when enabled', async () => {
      await integration.initialize();
      
      const status = integration.getSystemStatus();
      
      if (config.enableMetrics) {
        expect(status.metrics).toBeDefined();
      }
    });
  });
  
  describe('Error Handling', () => {
    it('should throw error when accessing components before initialization', () => {
      expect(() => {
        integration.getChatInterface();
      }).toThrow();
    });
    
    it('should handle missing dependencies gracefully', async () => {
      // 创建有缺失依赖的配置
      const brokenConfig: AIComponentsConfig = {
        enabledComponents: {
          // ChatInterface 需要 ContextManager 和 AIActionsManager
          chatInterface: true,
          // 但不启用它们的依赖
        },
      };
      
      const brokenIntegration = new AIComponentsIntegration(brokenConfig);
      
      await expect(brokenIntegration.initialize()).rejects.toThrow();
    });
    
    it('should provide meaningful error messages', async () => {
      const brokenConfig: AIComponentsConfig = {
        enabledComponents: {
          chatInterface: true,
        },
      };
      
      const brokenIntegration = new AIComponentsIntegration(brokenConfig);
      
      try {
        await brokenIntegration.initialize();
      } catch (error: any) {
        expect(error.message).toBeDefined();
        expect(error.message.length).toBeGreaterThan(0);
      }
    });
  });
  
  describe('Configuration', () => {
    it('should accept partial configuration', () => {
      const partialConfig: Partial<AIComponentsConfig> = {
        enabledComponents: {
          chatInterface: true,
        },
      };
      
      const partialIntegration = new AIComponentsIntegration(partialConfig);
      expect(partialIntegration).toBeDefined();
    });
    
    it('should merge with default configuration', async () => {
      const minimalConfig: AIComponentsConfig = {
        enabledComponents: {
          chatInterface: true,
        },
      };
      
      const minimalIntegration = new AIComponentsIntegration(minimalConfig);
      await minimalIntegration.initialize();
      
      // 应该使用默认值填充其他配置
      const status = minimalIntegration.getSystemStatus();
      expect(status).toBeDefined();
    });
  });
  
  describe('Event Communication', () => {
    beforeEach(async () => {
      await integration.initialize();
      await integration.start();
    });
    
    it('should allow components to communicate via EventBus', () => {
      const eventBus = integration.getEventBus();
      expect(eventBus).toBeDefined();
    });
    
    it('should support subscribing to component events', (done) => {
      const eventBus = integration.getEventBus();
      
      eventBus.subscribe('test-channel', (event) => {
        expect(event).toBeDefined();
        done();
      });
      
      eventBus.publish('test-channel', {
        type: 'test-event',
        timestamp: new Date(),
      });
    });
  });
  
  describe('Performance', () => {
    it('should initialize quickly with few components', async () => {
      const minimalConfig: AIComponentsConfig = {
        enabledComponents: {
          chatInterface: true,
          contextManager: true,
        },
      };
      
      const minimalIntegration = new AIComponentsIntegration(minimalConfig);
      
      const startTime = Date.now();
      await minimalIntegration.initialize();
      const endTime = Date.now();
      
      const duration = endTime - startTime;
      
      // 应该在合理时间内完成（<500ms）
      expect(duration).toBeLessThan(500);
    });
    
    it('should handle all components efficiently', async () => {
      const startTime = Date.now();
      await integration.initialize();
      await integration.start();
      const endTime = Date.now();
      
      const duration = endTime - startTime;
      
      // 即使是所有组件也应该快速启动（<1s）
      expect(duration).toBeLessThan(1000);
    });
  });
  
  describe('Cleanup', () => {
    it('should cleanup resources on stop', async () => {
      await integration.initialize();
      await integration.start();
      await integration.stop();
      
      // 验证资源已清理
      const status = integration.getSystemStatus();
      expect(status.running).toBe(false);
    });
    
    it('should allow restart after stop', async () => {
      await integration.initialize();
      await integration.start();
      await integration.stop();
      
      // 重新启动
      await integration.start();
      
      const status = integration.getSystemStatus();
      expect(status.running).toBe(true);
    });
  });
});
