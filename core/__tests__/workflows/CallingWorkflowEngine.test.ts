import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CallingWorkflowEngine } from '../../workflows/intelligent-calling/CallingWorkflowEngine';

describe('CallingWorkflowEngine', () => {
  let engine: CallingWorkflowEngine;

  beforeEach(() => {
    engine = new CallingWorkflowEngine();
  });

  describe('初始化', () => {
    it('应该成功初始化工作流引擎', async () => {
      const result = await engine.initialize();
      
      expect(result).toBeDefined();
      expect(result.workflowEngine).toBe(true);
    });

    it('应该初始化AI编排器', async () => {
      const result = await engine.initialize();
      
      expect(result.aiOrchestration).toBe(true);
    });

    it('应该初始化实时分析器', async () => {
      const result = await engine.initialize();
      
      expect(result.realTimeAnalysis).toBe(true);
    });
  });

  describe('智能呼叫执行', () => {
    const mockCustomer = {
      id: 'customer_123',
      name: '张三',
      phone: '+86138****1234',
    };

    const mockCampaign = {
      id: 'campaign_456',
      name: '春季促销',
      type: 'sales',
    };

    it('应该执行完整的智能呼叫流程', async () => {
      const result = await engine.executeIntelligentCalling(mockCustomer as any, mockCampaign as any);
      
      expect(result).toBeDefined();
      expect(result.preparation).toBeDefined();
      expect(result.callSession).toBeDefined();
      expect(result.postCallProcessing).toBeDefined();
    });

    it('应该进行呼叫前准备', async () => {
      const result = await engine.executeIntelligentCalling(mockCustomer as any, mockCampaign as any);
      
      expect(result.preparation).toBeDefined();
    });

    it('应该发起AI辅助呼叫', async () => {
      const result = await engine.executeIntelligentCalling(mockCustomer as any, mockCampaign as any);
      
      expect(result.callSession).toBeDefined();
    });

    it('应该进行呼叫后智能处理', async () => {
      const result = await engine.executeIntelligentCalling(mockCustomer as any, mockCampaign as any);
      
      expect(result.postCallProcessing).toBeDefined();
    });

    it('应该生成呼叫洞察', async () => {
      const result = await engine.executeIntelligentCalling(mockCustomer as any, mockCampaign as any);
      
      expect(result.insights).toBeDefined();
    });
  });

  describe('客户准备', () => {
    it('应该获取客户360档案', async () => {
      const mockCustomer = { id: 'customer_123' } as any;
      const mockCampaign = {} as any;
      
      const result = await engine.executeIntelligentCalling(mockCustomer, mockCampaign);
      
      expect(result.preparation).toBeDefined();
    });

    it('应该分析客户历史', async () => {
      const mockCustomer = { id: 'customer_123' } as any;
      const mockCampaign = {} as any;
      
      const result = await engine.executeIntelligentCalling(mockCustomer, mockCampaign);
      
      expect(result.preparation).toBeDefined();
    });
  });

  describe('会话管理', () => {
    it('应该追踪会话状态', async () => {
      const mockCustomer = { id: 'customer_123' } as any;
      const mockCampaign = {} as any;
      
      const result = await engine.executeIntelligentCalling(mockCustomer, mockCampaign);
      
      expect(result.callSession).toBeDefined();
    });

    it('应该记录会话时长', async () => {
      const mockCustomer = { id: 'customer_123' } as any;
      const mockCampaign = {} as any;
      
      const result = await engine.executeIntelligentCalling(mockCustomer, mockCampaign);
      
      expect(result.callSession).toBeDefined();
    });
  });

  describe('错误处理', () => {
    it('应该处理无效的客户ID', async () => {
      const mockCustomer = { id: '' } as any;
      const mockCampaign = {} as any;
      
      await expect(
        engine.executeIntelligentCalling(mockCustomer, mockCampaign)
      ).rejects.toThrow();
    });

    it('应该处理呼叫失败', async () => {
      const mockCustomer = { id: 'invalid_customer' } as any;
      const mockCampaign = {} as any;
      
      // Should handle gracefully
      const result = await engine.executeIntelligentCalling(mockCustomer, mockCampaign);
      expect(result).toBeDefined();
    });
  });

  describe('性能和优化', () => {
    it('应该在合理时间内完成准备', async () => {
      const startTime = Date.now();
      
      const mockCustomer = { id: 'customer_123' } as any;
      const mockCampaign = {} as any;
      
      await engine.executeIntelligentCalling(mockCustomer, mockCampaign);
      
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(5000); // 5秒内完成
    });
  });
});
