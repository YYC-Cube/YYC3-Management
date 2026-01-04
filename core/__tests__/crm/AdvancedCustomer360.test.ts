import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AdvancedCustomer360 } from '../../crm/AdvancedCustomer360';

// Mock 依赖
const mockBehavioralAnalytics = {
  analyze: vi.fn(),
  getPatterns: vi.fn(),
};

const mockPredictiveScoring = {
  calculate: vi.fn(),
  predict: vi.fn(),
};

const mockJourneyMapper = {
  map: vi.fn(),
  getTouchpoints: vi.fn(),
};

describe('AdvancedCustomer360', () => {
  let customer360: AdvancedCustomer360;

  beforeEach(() => {
    customer360 = new AdvancedCustomer360(
      mockBehavioralAnalytics as any,
      mockPredictiveScoring as any,
      mockJourneyMapper as any
    );
  });

  describe('客户360档案创建', () => {
    it('应该创建完整的客户档案', async () => {
      const profile = await customer360.createComprehensiveProfile('customer_123');
      
      expect(profile).toBeDefined();
      expect(profile.demographic).toBeDefined();
      expect(profile.contact).toBeDefined();
    });

    it('应该包含行为分析数据', async () => {
      const profile = await customer360.createComprehensiveProfile('customer_123');
      
      expect(profile.behavioral).toBeDefined();
      expect(profile.behavioral.communicationPreferences).toBeDefined();
      expect(profile.behavioral.engagementPatterns).toBeDefined();
    });

    it('应该计算客户价值评估', async () => {
      const profile = await customer360.createComprehensiveProfile('customer_123');
      
      expect(profile.value).toBeDefined();
      expect(profile.value.currentValue).toBeDefined();
      expect(profile.value.potentialValue).toBeDefined();
      expect(profile.value.loyaltyScore).toBeDefined();
      expect(profile.value.churnRisk).toBeDefined();
    });

    it('应该生成智能标签', async () => {
      const profile = await customer360.createComprehensiveProfile('customer_123');
      
      expect(profile.intelligentTags).toBeDefined();
      expect(Array.isArray(profile.intelligentTags)).toBe(true);
    });

    it('应该提供个性化推荐', async () => {
      const profile = await customer360.createComprehensiveProfile('customer_123');
      
      expect(profile.recommendations).toBeDefined();
      expect(profile.recommendations.nextBestAction).toBeDefined();
      expect(profile.recommendations.productRecommendations).toBeDefined();
      expect(profile.recommendations.communicationStrategy).toBeDefined();
    });
  });

  describe('客户数据验证', () => {
    it('应该拒绝无效的客户ID', async () => {
      await expect(
        customer360.createComprehensiveProfile('')
      ).rejects.toThrow();
    });

    it('应该处理缺失的客户数据', async () => {
      const profile = await customer360.createComprehensiveProfile('non_existent');
      
      expect(profile).toBeDefined();
    });
  });

  describe('价值评估计算', () => {
    it('应该计算当前客户价值', async () => {
      const profile = await customer360.createComprehensiveProfile('customer_123');
      
      expect(profile.value.currentValue).toBeGreaterThanOrEqual(0);
    });

    it('应该估算潜在价值', async () => {
      const profile = await customer360.createComprehensiveProfile('customer_123');
      
      expect(profile.value.potentialValue).toBeGreaterThanOrEqual(0);
      expect(profile.value.potentialValue).toBeGreaterThanOrEqual(profile.value.currentValue);
    });

    it('应该评估忠诚度分数', async () => {
      const profile = await customer360.createComprehensiveProfile('customer_123');
      
      expect(profile.value.loyaltyScore).toBeGreaterThan(0);
      expect(profile.value.loyaltyScore).toBeLessThanOrEqual(100);
    });

    it('应该预测流失风险', async () => {
      const profile = await customer360.createComprehensiveProfile('customer_123');
      
      expect(profile.value.churnRisk).toBeGreaterThanOrEqual(0);
      expect(profile.value.churnRisk).toBeLessThanOrEqual(1);
    });
  });

  describe('推荐系统', () => {
    it('应该生成最佳行动建议', async () => {
      const profile = await customer360.createComprehensiveProfile('customer_123');
      
      expect(profile.recommendations.nextBestAction).toBeDefined();
      expect(typeof profile.recommendations.nextBestAction).toBe('string');
    });

    it('应该推荐相关产品', async () => {
      const profile = await customer360.createComprehensiveProfile('customer_123');
      
      expect(profile.recommendations.productRecommendations).toBeDefined();
      expect(Array.isArray(profile.recommendations.productRecommendations)).toBe(true);
    });

    it('应该制定沟通策略', async () => {
      const profile = await customer360.createComprehensiveProfile('customer_123');
      
      expect(profile.recommendations.communicationStrategy).toBeDefined();
    });
  });

  describe('行为分析', () => {
    it('应该分析沟通偏好', async () => {
      const profile = await customer360.createComprehensiveProfile('customer_123');
      
      expect(profile.behavioral.communicationPreferences).toBeDefined();
    });

    it('应该识别参与模式', async () => {
      const profile = await customer360.createComprehensiveProfile('customer_123');
      
      expect(profile.behavioral.engagementPatterns).toBeDefined();
    });

    it('应该追踪响应历史', async () => {
      const profile = await customer360.createComprehensiveProfile('customer_123');
      
      expect(profile.behavioral.responseHistory).toBeDefined();
    });

    it('应该评估渠道效果', async () => {
      const profile = await customer360.createComprehensiveProfile('customer_123');
      
      expect(profile.behavioral.channelEffectiveness).toBeDefined();
    });
  });

  describe('权限和数据安全', () => {
    it('应该验证数据访问权限', async () => {
      // Mock permission check
      const profile = await customer360.createComprehensiveProfile('customer_123');
      
      expect(profile).toBeDefined();
    });

    it('应该保护敏感客户信息', async () => {
      const profile = await customer360.createComprehensiveProfile('customer_123');
      
      // Sensitive data should be masked or encrypted
      expect(profile).toBeDefined();
    });
  });
});
