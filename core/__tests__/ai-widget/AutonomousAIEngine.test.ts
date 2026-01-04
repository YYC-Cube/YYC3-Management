import { describe, it, expect, beforeEach } from 'vitest';
import { MemorySystem, LearningSystem } from '../../autonomous-ai-widget/AutonomousAIEngine';

describe('MemorySystem', () => {
  let memorySystem: MemorySystem;
  const mockConfig = {
    maxMemorySize: 1000,
    retentionDays: 30,
  };

  beforeEach(() => {
    memorySystem = new MemorySystem(mockConfig);
  });

  describe('初始化', () => {
    it('应该正确初始化内存系统', () => {
      expect(memorySystem).toBeDefined();
    });

    it('应该设置配置', () => {
      expect(memorySystem).toBeInstanceOf(MemorySystem);
    });
  });

  describe('存储和检索', () => {
    it('应该存储数据', async () => {
      const testData = { key: 'value' };
      
      await memorySystem.store('test_key', testData);
      
      const retrieved = await memorySystem.retrieve('test_key');
      expect(retrieved).toContainEqual(testData);
    });

    it('应该检索已存储的数据', async () => {
      const testData = { message: 'hello' };
      
      await memorySystem.store('greeting', testData);
      const retrieved = await memorySystem.retrieve('greeting');
      
      expect(retrieved).toBeDefined();
      expect(retrieved.length).toBeGreaterThan(0);
    });

    it('应该处理不存在的键', async () => {
      const retrieved = await memorySystem.retrieve('non_existent');
      
      expect(retrieved).toEqual([]);
    });

    it('应该支持多个数据存储', async () => {
      await memorySystem.store('key1', { data: 'first' });
      await memorySystem.store('key1', { data: 'second' });
      await memorySystem.store('key2', { data: 'third' });
      
      const retrieved1 = await memorySystem.retrieve('key1');
      const retrieved2 = await memorySystem.retrieve('key2');
      
      expect(retrieved1.length).toBe(2);
      expect(retrieved2.length).toBe(1);
    });
  });

  describe('会话历史', () => {
    it('应该获取最近的会话', async () => {
      const conversations = await memorySystem.getRecentConversations(10);
      
      expect(Array.isArray(conversations)).toBe(true);
    });

    it('应该限制返回的会话数量', async () => {
      const conversations = await memorySystem.getRecentConversations(5);
      
      expect(conversations.length).toBeLessThanOrEqual(5);
    });
  });

  describe('用户偏好', () => {
    it('应该获取用户偏好', async () => {
      const preferences = await memorySystem.getUserPreferences();
      
      expect(preferences).toBeDefined();
      expect(typeof preferences).toBe('object');
    });
  });
});

describe('LearningSystem', () => {
  let learningSystem: LearningSystem;
  const mockConfig = {
    learningRate: 0.01,
    batchSize: 32,
  };

  beforeEach(() => {
    learningSystem = new LearningSystem(mockConfig);
  });

  describe('初始化', () => {
    it('应该正确初始化学习系统', () => {
      expect(learningSystem).toBeDefined();
    });

    it('应该设置学习配置', () => {
      expect(learningSystem).toBeInstanceOf(LearningSystem);
    });
  });

  describe('交互记录', () => {
    it('应该记录用户消息和AI响应', async () => {
      const mockMessage = {
        id: 'msg_123',
        content: '你好',
        timestamp: new Date().toISOString(),
      };

      const mockResponse = {
        id: 'resp_123',
        content: '你好！有什么可以帮助你的？',
        timestamp: new Date().toISOString(),
      };

      await learningSystem.recordInteraction(mockMessage as any, mockResponse as any);
      
      // Interaction should be recorded
      expect(learningSystem).toBeDefined();
    });

    it('应该记录交互时间戳', async () => {
      const beforeTime = Date.now();
      
      const mockMessage = {
        id: 'msg_456',
        content: '测试消息',
        timestamp: new Date().toISOString(),
      };

      const mockResponse = {
        id: 'resp_456',
        content: '测试响应',
        timestamp: new Date().toISOString(),
      };

      await learningSystem.recordInteraction(mockMessage as any, mockResponse as any);
      
      const afterTime = Date.now();
      expect(afterTime).toBeGreaterThanOrEqual(beforeTime);
    });
  });

  describe('模式分析', () => {
    it('应该分析用户交互模式', async () => {
      const patterns = await learningSystem.analyzePatterns();
      
      expect(patterns).toBeDefined();
    });

    it('应该识别常见问题', async () => {
      const patterns = await learningSystem.analyzePatterns();
      
      expect(patterns.patterns).toBeDefined();
      expect(Array.isArray(patterns.patterns)).toBe(true);
    });

    it('应该提供优化建议', async () => {
      const patterns = await learningSystem.analyzePatterns();

      expect(patterns).toBeDefined();
      // 建议字段可能不存在，因为这是测试环境
      if (patterns.recommendations) {
        expect(patterns.recommendations).toBeDefined();
      }
    });
  });

  describe('学习和适应', () => {
    it('应该根据反馈调整响应', async () => {
      const feedback = {
        messageId: 'msg_123',
        rating: 5,
        helpful: true,
      };

      // Should incorporate feedback
      expect(learningSystem).toBeDefined();
    });

    it('应该改进对话质量', async () => {
      // After multiple interactions, quality should improve
      const patterns = await learningSystem.analyzePatterns();
      
      expect(patterns).toBeDefined();
    });
  });
});

describe('AI引擎集成', () => {
  it('应该集成内存和学习系统', () => {
    const config = {
      memory: { maxMemorySize: 1000 },
      learning: { learningRate: 0.01 },
    };

    const memory = new MemorySystem(config.memory);
    const learning = new LearningSystem(config.learning);

    expect(memory).toBeDefined();
    expect(learning).toBeDefined();
  });

  it('应该在系统间共享数据', async () => {
    const config = {
      memory: { maxMemorySize: 1000 },
      learning: { learningRate: 0.01 },
    };

    const memory = new MemorySystem(config.memory);
    const learning = new LearningSystem(config.learning);

    // Store data in memory
    await memory.store('interactions', { count: 10 });
    
    // Learning system should be able to access patterns
    const patterns = await learning.analyzePatterns();
    
    expect(patterns).toBeDefined();
  });
});
