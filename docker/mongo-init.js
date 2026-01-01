// ==================== MongoDB初始化脚本 ====================

// 切换到yyc3数据库
db = db.getSiblingDB('yyc3');

// 创建集合
print('创建集合...');

db.createCollection('users');
db.createCollection('goals');
db.createCollection('tasks');
db.createCollection('messages');
db.createCollection('learning_records');
db.createCollection('ai_conversations');
db.createCollection('system_logs');

// 创建索引
print('创建索引...');

// 用户索引
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });

// 目标索引
db.goals.createIndex({ userId: 1, status: 1 });
db.goals.createIndex({ createdAt: -1 });
db.goals.createIndex({ dueDate: 1 });
db.goals.createIndex({ priority: -1 });
db.goals.createIndex({ 'title': 'text', 'description': 'text' });

// 任务索引
db.tasks.createIndex({ goalId: 1, status: 1 });
db.tasks.createIndex({ assignedTo: 1, status: 1 });
db.tasks.createIndex({ dueDate: 1 });
db.tasks.createIndex({ createdAt: -1 });

// 消息索引
db.messages.createIndex({ userId: 1, createdAt: -1 });
db.messages.createIndex({ conversationId: 1, createdAt: 1 });
db.messages.createIndex({ type: 1, status: 1 });

// 学习记录索引
db.learning_records.createIndex({ userId: 1, timestamp: -1 });
db.learning_records.createIndex({ type: 1, category: 1 });
db.learning_records.createIndex({ patternId: 1 });

// AI对话索引
db.ai_conversations.createIndex({ userId: 1, timestamp: -1 });
db.ai_conversations.createIndex({ sessionId: 1 });
db.ai_conversations.createIndex({ modelName: 1 });

// 系统日志索引
db.system_logs.createIndex({ timestamp: -1 });
db.system_logs.createIndex({ level: 1, timestamp: -1 });
db.system_logs.createIndex({ service: 1, level: 1 });
db.system_logs.createIndex({ userId: 1, timestamp: -1 });

// 插入初始数据
print('插入初始数据...');

// 创建系统管理员用户
db.users.insertOne({
  _id: ObjectId(),
  username: 'admin',
  email: 'admin@yyc3.com',
  role: 'admin',
  status: 'active',
  profile: {
    displayName: '系统管理员',
    avatar: '/avatars/admin.png'
  },
  preferences: {
    language: 'zh-CN',
    theme: 'auto',
    notifications: {
      email: true,
      push: true,
      inApp: true
    }
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

// 插入示例目标
db.goals.insertOne({
  _id: ObjectId(),
  userId: db.users.findOne({ username: 'admin' })._id,
  title: '完善AI浮窗系统',
  description: '实现自治AI引擎、模型适配器和学习系统的完整集成',
  type: 'project',
  status: 'in_progress',
  priority: 'high',
  objectives: [
    {
      key: 'O1',
      title: '实现自治AI引擎',
      keyResults: [
        { kr: 'KR1.1', title: '完成核心架构设计', progress: 100 },
        { kr: 'KR1.2', title: '实现消息总线和任务调度', progress: 100 },
        { kr: 'KR1.3', title: '集成状态管理', progress: 100 }
      ]
    },
    {
      key: 'O2',
      title: '构建模型适配器',
      keyResults: [
        { kr: 'KR2.1', title: '支持OpenAI模型', progress: 100 },
        { kr: 'KR2.2', title: '支持本地模型', progress: 100 },
        { kr: 'KR2.3', title: '实现流式响应和缓存', progress: 100 }
      ]
    }
  ],
  milestones: [
    {
      id: 'M1',
      title: '核心架构完成',
      dueDate: new Date('2024-01-15'),
      status: 'completed'
    },
    {
      id: 'M2',
      title: '集成测试通过',
      dueDate: new Date('2024-01-30'),
      status: 'in_progress'
    }
  ],
  startDate: new Date('2024-01-01'),
  dueDate: new Date('2024-02-28'),
  createdAt: new Date(),
  updatedAt: new Date()
});

// 插入系统配置
db.createCollection('system_config');
db.system_config.insertOne({
  _id: 'default',
  aiEngine: {
    enabled: true,
    maxConcurrentTasks: 10,
    taskTimeout: 300000,
    retryAttempts: 3
  },
  modelAdapter: {
    defaultModel: 'gpt-4-turbo-preview',
    maxRetries: 3,
    timeout: 120000,
    caching: {
      enabled: true,
      ttl: 3600
    }
  },
  learningSystem: {
    enabled: true,
    minPatternsForLearning: 5,
    learningInterval: 86400000, // 24小时
    retentionDays: 90
  },
  monitoring: {
    metricsInterval: 15000,
    alertThresholds: {
      cpuUsage: 80,
      memoryUsage: 85,
      errorRate: 0.05,
      responseTime: 5000
    }
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

// 创建TTL索引（自动清理旧数据）
db.system_logs.createIndex(
  { timestamp: 1 },
  { expireAfterSeconds: 2592000 } // 30天后自动删除
);

db.ai_conversations.createIndex(
  { timestamp: 1 },
  { expireAfterSeconds: 7776000 } // 90天后自动删除
);

print('MongoDB初始化完成！');
print('数据库: yyc3');
print('集合数量:', db.getCollectionNames().length);
print('索引已创建');
print('初始数据已插入');
