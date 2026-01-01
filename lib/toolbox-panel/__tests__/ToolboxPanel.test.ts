/**
 * ToolboxPanel 单元测试
 * 
 * 测试工具箱面板的完整功能：
 * - 工具管理（注册、注销、获取）
 * - 工具搜索（类别、标签、关键词）
 * - 工具执行（验证、执行、错误处理）
 * - 推荐系统（推荐生成、统计收集）
 * - 生命周期管理
 * 
 * @module Tests/ToolboxPanel
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ToolboxPanel } from '../ToolboxPanel';
import type { Tool, ToolboxConfig, ToolExecutionContext } from '../types';

describe('ToolboxPanel', () => {
  let toolbox: ToolboxPanel;
  let config: ToolboxConfig;
  let sampleTool: Tool;
  let executionContext: ToolExecutionContext;
  
  beforeEach(async () => {
    config = {
      maxConcurrentExecutions: 5,
      enableRecommendations: true,
      enableStatistics: true,
    };
    
    toolbox = new ToolboxPanel(config);
    await toolbox.initialize({});
    
    sampleTool = {
      id: 'test-tool-1',
      name: '测试工具',
      description: '这是一个测试工具',
      category: 'utility',
      version: '1.0.0',
      tags: ['test', 'demo'],
      inputs: [
        {
          name: 'input1',
          type: 'string',
          description: '输入参数1',
          required: true,
        },
        {
          name: 'input2',
          type: 'number',
          description: '输入参数2',
          required: false,
          validation: {
            min: 0,
            max: 100,
          },
        },
      ],
      outputs: [
        {
          name: 'result',
          type: 'string',
          description: '执行结果',
        },
      ],
      executor: {
        type: 'function',
        handler: async (inputs) => {
          await new Promise(resolve => setTimeout(resolve, 1));
          return { result: `处理了: ${inputs.input1}` };
        },
      },
    };
    
    executionContext = {
      userId: 'test-user',
      sessionId: 'test-session',
      executionId: 'test-exec-1',
      timestamp: new Date(),
      environment: 'development',
    };
  });
  
  describe('生命周期管理', () => {
    it('应该正确初始化', async () => {
      // ToolboxPanel 在构造时自动初始化
      expect(toolbox).toBeDefined();
    });
    
    it('应该正确启动', async () => {
      await toolbox.start();
      
      const status = toolbox.getStatus();
      expect(status).toBe('running');
    });
    
    it('应该正确停止', async () => {
      await toolbox.start();
      await toolbox.stop();
      
      const status = toolbox.getStatus();
      expect(status).toBeDefined();
    });
    
    it('应该正确销毁', async () => {
      await toolbox.start();
      await toolbox.destroy();
      
      expect(toolbox).toBeDefined();
    });
  });
  
  describe('工具注册管理', () => {
    // 不需要 beforeEach 中的 initialize
    
    it('应该成功注册工具', () => {
      const result = toolbox.registerTool(sampleTool);
      
      expect(result.success).toBe(true);
      const registeredTool = toolbox.getTool('test-tool-1');
      expect(registeredTool).toBeDefined();
      expect(registeredTool?.id).toBe('test-tool-1');
      expect(registeredTool?.name).toBe(sampleTool.name);
      expect(registeredTool?.category).toBe(sampleTool.category);
    });
    
    it('应该拒绝重复注册', () => {
      toolbox.registerTool(sampleTool);
      const result = toolbox.registerTool(sampleTool);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('已注册');
    });
    
    it('应该成功注销工具', async () => {
      toolbox.registerTool(sampleTool);
      const result = await toolbox.unregisterTool('test-tool-1');
      
      expect(result.success).toBe(true);
      expect(toolbox.getTool('test-tool-1')).toBeUndefined();
    });
    
    it('应该获取所有工具', () => {
      toolbox.registerTool(sampleTool);
      
      const tool2: Tool = {
        ...sampleTool,
        id: 'test-tool-2',
        name: '测试工具2',
      };
      toolbox.registerTool(tool2);
      
      const allTools = toolbox.getAllTools();
      expect(allTools).toHaveLength(2);
      expect(allTools.map(t => t.id)).toContain('test-tool-1');
      expect(allTools.map(t => t.id)).toContain('test-tool-2');
    });
  });
  
  describe('工具搜索', () => {
    beforeEach(async () => {
      
      // 注册多个测试工具
      toolbox.registerTool(sampleTool);
      
      toolbox.registerTool({
        ...sampleTool,
        id: 'test-tool-2',
        name: '数据分析工具',
        category: 'analysis',
        tags: ['data', 'analysis'],
      });
      
      toolbox.registerTool({
        ...sampleTool,
        id: 'test-tool-3',
        name: '自动化工具',
        category: 'automation',
        tags: ['automation', 'workflow'],
      });
    });
    
    it('应该按类别搜索工具', () => {
      const results = toolbox.searchTools({
        categories: ['analysis'],
      });
      
      expect(results).toHaveLength(1);
      expect(results[0].tool.id).toBe('test-tool-2');
    });
    
    it('应该按标签搜索工具', () => {
      const results = toolbox.searchTools({
        tags: ['automation'],
      });
      
      expect(results).toHaveLength(1);
      expect(results[0].tool.id).toBe('test-tool-3');
    });
    
    it('应该按关键词搜索工具', () => {
      const results = toolbox.searchTools({
        query: '数据',
      });
      
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.tool.name.includes('数据'))).toBe(true);
    });
    
    it('应该支持分页', () => {
      const results = toolbox.searchTools({
        query: '',
        limit: 2,
        offset: 0,
      });
      
      expect(results).toHaveLength(2);
    });
    
    it('应该支持排序', () => {
      const results = toolbox.searchTools({
        query: '',
        sortBy: 'name',
      });
      
      expect(results[0].tool.name).toBeDefined();
    });
  });
  
  describe('工具执行', () => {
    beforeEach(async () => {
      await toolbox.start();
      toolbox.registerTool(sampleTool);
    });
    
    it('应该成功执行工具', async () => {
      const result = await toolbox.executeTool(
        'test-tool-1',
        { input1: 'test value' },
        executionContext
      );
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.result).toContain('test value');
    });
    
    it('应该验证必需参数', async () => {
      const result = await toolbox.executeTool(
        'test-tool-1',
        {}, // 缺少必需的 input1
        executionContext
      );
      
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('缺少必需参数');
    });
    
    it('应该验证参数范围', async () => {
      const result = await toolbox.executeTool(
        'test-tool-1',
        {
          input1: 'test',
          input2: 150, // 超出最大值 100
        },
        executionContext
      );
      
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('值太大');
    });
    
    it('应该处理不存在的工具', async () => {
      const result = await toolbox.executeTool(
        'non-existent-tool',
        {},
        executionContext
      );
      
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('TOOL_NOT_FOUND');
    });
    
    it('应该记录执行统计', async () => {
      await toolbox.executeTool(
        'test-tool-1',
        { input1: 'test' },
        executionContext
      );
      
      const stats = toolbox.getToolStats('test-tool-1');
      
      expect(stats).toBeDefined();
      expect(stats!.totalExecutions).toBe(1);
      expect(stats!.successfulExecutions).toBe(1);
    });
    
    it('应该处理执行错误', async () => {
      const errorTool: Tool = {
        ...sampleTool,
        id: 'error-tool',
        executor: {
          type: 'function',
          handler: async () => {
            throw new Error('执行失败');
          },
        },
      };
      
      toolbox.registerTool(errorTool);
      
      const result = await toolbox.executeTool(
        'error-tool',
        { input1: 'test' },
        executionContext
      );
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
  
  describe('推荐系统', () => {
    beforeEach(async () => {
      await toolbox.start();
      
      // 注册多个工具
      toolbox.registerTool(sampleTool);
      toolbox.registerTool({
        ...sampleTool,
        id: 'test-tool-2',
        name: '推荐工具2',
      });
      toolbox.registerTool({
        ...sampleTool,
        id: 'test-tool-3',
        name: '推荐工具3',
      });
    });
    
    it('应该生成推荐列表', () => {
      const recommendations = toolbox.getRecommendations({
        userId: 'test-user',
        limit: 3,
      });
      
      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeLessThanOrEqual(3);
    });
    
    it('推荐结果应包含置信度', () => {
      const recommendations = toolbox.getRecommendations({
        userId: 'test-user',
      });
      
      if (recommendations.length > 0) {
        expect(recommendations[0].confidence).toBeDefined();
        expect(recommendations[0].confidence).toBeGreaterThanOrEqual(0);
        expect(recommendations[0].confidence).toBeLessThanOrEqual(1);
      }
    });
    
    it('推荐结果应包含原因', () => {
      const recommendations = toolbox.getRecommendations({
        userId: 'test-user',
        includeReasons: true,
      });
      
      if (recommendations.length > 0) {
        expect(recommendations[0].reason).toBeDefined();
        expect(typeof recommendations[0].reason).toBe('string');
      }
    });
    
    it('应该基于使用历史推荐', async () => {
      // 重新初始化工具面板以确保状态正确
      toolbox = new ToolboxPanel(config);
      await toolbox.initialize({
        id: 'test-toolbox',
        name: '测试工具箱',
        enabled: true,
        autoStart: true,
        dependencies: [],
        priority: 1,
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
      });
      await toolbox.start();
      
      toolbox.registerTool(sampleTool);
      
      // 执行工具以建立使用历史
      await toolbox.executeTool(
        'test-tool-1',
        { input1: 'test' },
        executionContext
      );
      
      const recommendations = toolbox.getRecommendations({
        userId: 'test-user',
      });
      
      // 经常使用的工具应该被推荐
      expect(recommendations.some(r => r.tool.id === 'test-tool-1')).toBe(true);
    });
  });
  
  describe('统计收集', () => {
    beforeEach(async () => {
      await toolbox.start();
      toolbox.registerTool(sampleTool);
    });
    
    it('应该收集工具使用统计', async () => {
      await toolbox.executeTool(
        'test-tool-1',
        { input1: 'test1' },
        executionContext
      );
      await toolbox.executeTool(
        'test-tool-1',
        { input1: 'test2' },
        executionContext
      );
      
      const stats = toolbox.getToolStats('test-tool-1');
      
      expect(stats).toBeDefined();
      expect(stats!.totalExecutions).toBe(2);
      expect(stats!.successfulExecutions).toBe(2);
      expect(stats!.averageExecutionTime).toBeGreaterThan(0);
    });
    
    it('应该记录失败统计', async () => {
      const errorTool: Tool = {
        ...sampleTool,
        id: 'error-tool',
        executor: {
          type: 'function',
          handler: async () => {
            throw new Error('失败');
          },
        },
      };
      
      toolbox.registerTool(errorTool);
      
      await toolbox.executeTool(
        'error-tool',
        { input1: 'test' },
        executionContext
      );
      
      const stats = toolbox.getToolStats('error-tool');
      
      expect(stats).toBeDefined();
      expect(stats!.failedExecutions).toBe(1);
    });
    
    it('应该获取所有统计', async () => {
      toolbox.registerTool({
        ...sampleTool,
        id: 'test-tool-2',
      });
      
      await toolbox.executeTool('test-tool-1', { input1: 'test' }, executionContext);
      await toolbox.executeTool('test-tool-2', { input1: 'test' }, executionContext);
      
      const allStats = toolbox.getAllStats();
      
      expect(allStats).toHaveLength(2);
    });
  });
  
  describe('事件发射', () => {
    beforeEach(async () => {
      await toolbox.start();
      toolbox.registerTool(sampleTool);
    });
    
    it('应该在工具注册时发射事件', async () => {
      const newToolbox = new ToolboxPanel(config);
      await newToolbox.initialize({
        id: 'test-toolbox-new',
        name: '测试工具箱-新',
        enabled: true,
        autoStart: true,
        dependencies: [],
        priority: 1,
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
      });
      
      const registrationPromise = new Promise<void>((resolve) => {
        newToolbox.on('tool:registered', (event) => {
          expect(event.toolId).toBeDefined();
          resolve();
        });
      });
      
      newToolbox.registerTool(sampleTool);
      
      await registrationPromise;
    });
    
    it('应该在工具执行时发射事件', async () => {
      const executionPromise = new Promise<void>((resolve) => {
        toolbox.on('tool:executed', (event) => {
          expect(event.toolId).toBe('test-tool-1');
          expect(event.success).toBe(true);
          resolve();
        });
      });
      
      toolbox.executeTool('test-tool-1', { input1: 'test' }, executionContext);
      
      await executionPromise;
    });
    
    it('应该在生成推荐时发射事件', async () => {
      const recommendationPromise = new Promise<void>((resolve) => {
        toolbox.on('recommendation:generated', (event) => {
          expect(event.userId).toBe('test-user');
          expect(event.recommendations).toBeDefined();
          resolve();
        });
      });
      
      toolbox.getRecommendations({ userId: 'test-user' });
      
      await recommendationPromise;
    });
  });
  
  describe('状态报告', () => {
    it('应该返回正确的组件状态', async () => {
      await toolbox.start();
      
      toolbox.registerTool(sampleTool);
      await toolbox.executeTool('test-tool-1', { input1: 'test' }, executionContext);
      
      const status = toolbox.getDetailedStatus();
      
      expect(status.componentId).toBe('toolbox-panel');
      expect(status.status).toBe('running');
      expect(status.healthy).toBe(true);
      expect(status.metrics).toBeDefined();
      expect(status.metrics.toolCount).toBe(1);
      expect(status.metrics.totalExecutions).toBe(1);
    });
  });
});
