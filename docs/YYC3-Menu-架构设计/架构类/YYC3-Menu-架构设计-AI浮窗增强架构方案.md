# AI浮窗系统增强架构实现说明

## 系统架构概览

### 核心组件

1. **AutonomousAIEngine** (自治AI引擎)
   - 位置：`lib/autonomous-engine/AutonomousAIEngine.ts`
   - 功能：系统核心大脑，实现"感知-思考-行动"闭环
   - 特性：
     - 消息总线（MessageBus）
     - 任务调度器（TaskScheduler）
     - 状态管理器（StateManager）
     - 子系统注册表
     - 生命周期管理

2. **ModelAdapter** (模型适配器)
   - 位置：`lib/model-adapter/`
   - 功能：统一AI模型接口，实现一次编码多模型运行
   - 包含：
     - `ModelAdapter.ts` - 基础适配器接口
     - `OpenAIAdapter.ts` - OpenAI模型适配器
     - `LocalModelAdapter.ts` - 本地模型适配器（支持Ollama, Qwen等）
   - 特性：
     - 统一接口（IModelAdapter）
     - 流式处理支持
     - 自动缓存
     - 健康检查
     - 性能指标

3. **UnifiedLearningSystem** (三层学习系统)
   - 位置：`lib/learning-system/UnifiedLearningSystem.ts`
   - 功能：实现行为、策略、知识三层递进式学习
   - 包含：
     - `BehavioralLearningLayer` - 用户行为学习
     - `StrategicLearningLayer` - 决策策略优化
     - `KnowledgeLearningLayer` - 知识图谱构建
   - 特性：
     - 行为模式识别
     - 个性化配置生成
     - 策略自动优化
     - 知识图谱管理

## 使用指南

### 1. 初始化自治AI引擎

```typescript
import { AutonomousAIEngine, EngineConfig } from '@/lib/autonomous-engine';

const engineConfig: EngineConfig = {
  version: '2.0.0',
  defaultTimeout: 30000,
  maxConcurrentTasks: 5,
  enableDebugMode: false,
  persistenceEnabled: true,
  resumeTasksOnRestore: true
};

const engine = new AutonomousAIEngine(engineConfig);
await engine.start();
```

### 2. 注册模型适配器

```typescript
import { ModelAdapterFactory, OpenAIAdapter, LocalModelAdapter } from '@/lib/model-adapter';

// 创建OpenAI适配器
const openaiAdapter = await ModelAdapterFactory.create('openai', {
  modelName: 'gpt-4',
  provider: 'OpenAI',
  apiKey: process.env.OPENAI_API_KEY,
  maxInputLength: 8000,
  maxOutputLength: 4000,
  timeout: 30000,
  cacheEnabled: true,
  warmupOnCreate: true
});

// 创建本地模型适配器
const localAdapter = await ModelAdapterFactory.create('local', {
  modelName: 'qwen-max',
  provider: 'Local',
  endpoint: 'http://localhost:11434',
  maxInputLength: 8000,
  maxOutputLength: 4000,
  timeout: 30000,
  cacheEnabled: false
});
```

### 3. 使用学习系统

```typescript
import { UnifiedLearningSystem } from '@/lib/learning-system';

const learningSystem = new UnifiedLearningSystem();

// 记录用户行为
learningSystem.getBehavioralLayer().recordBehavior({
  id: 'behavior-001',
  userId: 'user-123',
  action: 'open_chat',
  context: { source: 'dashboard' },
  timestamp: new Date(),
  sessionId: 'session-456'
});

// 获取用户配置
const profile = learningSystem.getBehavioralLayer().getUserProfile('user-123');

// 记录决策结果
learningSystem.getStrategicLayer().recordOutcome({
  id: 'outcome-001',
  decision: 'route_to_model',
  parameters: { modelId: 'gpt-4' },
  context: { complexity: 'high' },
  result: 'success',
  metrics: {
    executionTime: 1500,
    resourceUsage: 0.3,
    userSatisfaction: 0.9
  },
  timestamp: new Date()
});

// 添加知识
learningSystem.getKnowledgeLayer().addKnowledge({
  type: 'fact',
  content: '用户经常在下午3点使用AI助手',
  tags: ['user-behavior', 'timing'],
  confidence: 0.85,
  source: 'behavioral-analysis',
  relations: []
});
```

### 4. 在IntelligentAIWidget中集成

当前的`IntelligentAIWidget`组件已经具备以下功能：
- 拖拽和调整大小
- 多模型选择（GLM-4, Qwen, ERNIE, Ollama）
- 基础的学习状态管理
- 多模态输入（语音、图片）

#### 增强方案

创建一个wrapper组件来集成新架构：

```typescript
// components/ai-floating-widget/EnhancedAIWidget.tsx
import React, { useEffect, useState } from 'react';
import { IntelligentAIWidget } from './IntelligentAIWidget';
import { AutonomousAIEngine } from '@/lib/autonomous-engine';
import { UnifiedLearningSystem } from '@/lib/learning-system';
import { ModelAdapterFactory, IModelAdapter } from '@/lib/model-adapter';
import { AgenticCore } from '@/lib/agentic-core';

interface EnhancedAIWidgetProps {
  agenticCore: AgenticCore;
  onClose?: () => void;
}

export const EnhancedAIWidget: React.FC<EnhancedAIWidgetProps> = ({ 
  agenticCore, 
  onClose 
}) => {
  const [engine, setEngine] = useState<AutonomousAIEngine | null>(null);
  const [learningSystem, setLearningSystem] = useState<UnifiedLearningSystem | null>(null);
  const [modelAdapters, setModelAdapters] = useState<Map<string, IModelAdapter>>(new Map());

  useEffect(() => {
    const initializeSystem = async () => {
      // 1. 初始化引擎
      const newEngine = new AutonomousAIEngine({
        version: '2.0.0',
        defaultTimeout: 30000,
        maxConcurrentTasks: 5,
        enableDebugMode: false,
        persistenceEnabled: true,
        resumeTasksOnRestore: true
      });
      await newEngine.start();
      setEngine(newEngine);

      // 2. 初始化学习系统
      const newLearningSystem = new UnifiedLearningSystem();
      setLearningSystem(newLearningSystem);

      // 3. 注册模型适配器
      const adapters = new Map<string, IModelAdapter>();
      
      // 本地模型
      const localAdapter = await ModelAdapterFactory.create('local', {
        modelName: 'qwen-max',
        provider: 'Local',
        endpoint: 'http://localhost:11434',
        maxInputLength: 8000,
        maxOutputLength: 4000,
        timeout: 30000,
        cacheEnabled: false
      });
      adapters.set('local', localAdapter);
      
      setModelAdapters(adapters);
    };

    initializeSystem();

    return () => {
      if (engine) {
        engine.shutdown();
      }
    };
  }, []);

  if (!engine || !learningSystem) {
    return <div>Loading AI System...</div>;
  }

  return (
    <IntelligentAIWidget 
      agenticCore={agenticCore}
      onClose={onClose}
    />
  );
};
```

## 架构优势

### 1. 可插拔式设计
- 所有核心模块都是独立的
- 通过工厂模式创建实例
- 易于替换和扩展

### 2. 统一接口
- ModelAdapter提供统一的模型访问接口
- 不需要为每个模型写不同的代码
- 支持自动降级和重试

### 3. 三层学习
- 行为层：学习用户习惯，提供个性化服务
- 策略层：优化决策流程，提高效率
- 知识层：构建知识图谱，提供智能推荐

### 4. 自治能力
- AutonomousAIEngine实现了完整的"感知-思考-行动"闭环
- 支持任务规划、调度、执行、监控
- 具备状态持久化和恢复能力

## 下一步工作

### 1. 完善IntelligentAIWidget集成
- [ ] 将AutonomousAIEngine集成到组件中
- [ ] 使用ModelAdapter替换硬编码的模型调用
- [ ] 添加学习系统的UI可视化

### 2. 增强功能
- [ ] 实现高级拖拽系统（磁吸、碰撞检测）
- [ ] 添加主题系统和动画系统
- [ ] 实现工具生命周期管理

### 3. 测试和优化
- [ ] 编写单元测试
- [ ] 性能优化
- [ ] 内存管理优化

## 文件结构

```
lib/
├── autonomous-engine/
│   ├── AutonomousAIEngine.ts    # 自治AI引擎核心
│   └── index.ts                  # 导出文件
├── model-adapter/
│   ├── ModelAdapter.ts           # 基础适配器和接口
│   ├── OpenAIAdapter.ts          # OpenAI适配器
│   ├── LocalModelAdapter.ts      # 本地模型适配器
│   └── index.ts                  # 导出和注册
└── learning-system/
    ├── UnifiedLearningSystem.ts  # 三层学习系统
    └── index.ts                  # 导出文件
```

## API参考

### AutonomousAIEngine

```typescript
// 初始化
await engine.initialize();
await engine.start();

// 消息处理
const response = await engine.processMessage({
  type: MessageType.USER_INPUT,
  content: '你好',
  source: 'chat'
});

// 任务管理
const plan = await engine.planTask(goal);
await engine.executeTask(taskId);
await engine.cancelTask(taskId);

// 状态管理
const snapshot = await engine.saveState();
await engine.restoreState(snapshot);

// 指标
const metrics = engine.getMetrics();
```

### ModelAdapter

```typescript
// 文本生成
const response = await adapter.generateCompletion({
  prompt: '你好，世界！',
  parameters: {
    temperature: 0.7,
    maxTokens: 1000
  }
});

// 流式生成
for await (const chunk of adapter.streamCompletion(request)) {
  console.log(chunk.text);
}

// 聊天
const chatResponse = await adapter.generateChatCompletion({
  messages: [
    { role: 'user', content: '你好' }
  ]
});

// 健康检查
const health = await adapter.healthCheck();
```

### UnifiedLearningSystem

```typescript
// 行为学习
learningSystem.getBehavioralLayer().recordBehavior(behavior);
const profile = learningSystem.getBehavioralLayer().getUserProfile(userId);
const nextAction = learningSystem.getBehavioralLayer().predictNextAction(userId, context);

// 策略学习
learningSystem.getStrategicLayer().recordOutcome(outcome);
const strategy = learningSystem.getStrategicLayer().getBestStrategy(decisionType, context);

// 知识学习
const knowledgeId = learningSystem.getKnowledgeLayer().addKnowledge(entry);
const results = learningSystem.getKnowledgeLayer().queryKnowledge('query');
const related = learningSystem.getKnowledgeLayer().getRelatedKnowledge(entryId);

// 综合指标
const metrics = learningSystem.getOverallMetrics();
```

## 配置说明

### 环境变量

```env
# OpenAI配置
OPENAI_API_KEY=your-api-key
OPENAI_BASE_URL=https://api.openai.com/v1

# 本地模型配置
LOCAL_MODEL_ENDPOINT=http://localhost:11434
LOCAL_MODEL_AUTH_TOKEN=optional-token

# 引擎配置
ENGINE_DEFAULT_TIMEOUT=30000
ENGINE_MAX_CONCURRENT_TASKS=5
ENGINE_ENABLE_DEBUG=false
```

## 性能考虑

1. **缓存策略**：ModelAdapter默认启用缓存，减少重复请求
2. **并发控制**：TaskScheduler限制并发任务数
3. **内存管理**：定期清理过期数据和缓存
4. **流式处理**：大响应使用流式传输，避免内存溢出

## 安全性

1. **API密钥管理**：使用环境变量存储敏感信息
2. **输入验证**：所有用户输入都进行验证
3. **错误处理**：完善的错误恢复机制
4. **权限控制**：基于角色的访问控制（待实现）
