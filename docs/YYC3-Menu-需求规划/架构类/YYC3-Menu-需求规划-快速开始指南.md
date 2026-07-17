---
description: YYC3 YYC3 项目文档 - AI浮窗系统快速开始指南
author: YYC3 团队 <admin@0379.email>
version: v3.0.0
created: 2026-07-18
updated: 2026-07-18
status: stable
tags: documentation
category: general
language: zh-CN
audience: developers
complexity: intermediate
---

# AI浮窗系统快速开始指南

## 🚀 立即体验

### 1. 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
```

### 2. 访问演示页面

在浏览器中打开：

- **增强版演示**: [http://localhost:3200/enhanced-ai-demo](http://localhost:3200/enhanced-ai-demo)
- **原版演示**: [http://localhost:3200/ai-floating-demo](http://localhost:3200/ai-floating-demo)

### 3. 体验功能

在增强版演示页面，您可以：

1. ✨ 查看系统架构展示
2. 📊 查看实时系统统计
3. 🎯 点击"打开AI浮窗"按钮
4. 💬 在浮窗中与AI交互
5. 🔍 观察开发模式下的状态面板（右下角）

## 📦 集成到您的项目

### 基础集成

```typescript
// pages/your-page.tsx
import { EnhancedAIWidget } from '@/components/ai-floating-widget';
import { AgenticCore } from '@/lib/agentic-core';

export default function YourPage() {
  const [agenticCore] = useState(() => new AgenticCore());

  return (
    <div>
      {/* 您的页面内容 */}
      
      <EnhancedAIWidget 
        agenticCore={agenticCore}
        userId="user-123"
        onClose={() => console.log('AI浮窗已关闭')}
      />
    </div>
  );
}
```

### 使用Provider（推荐）

```typescript
// app/layout.tsx
import { AIWidgetProvider } from '@/components/ai-floating-widget';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AIWidgetProvider autoInit={true}>
          {children}
        </AIWidgetProvider>
      </body>
    </html>
  );
}

// 在任何组件中使用
import { useAIWidget } from '@/components/ai-floating-widget';

function MyComponent() {
  const { showWidget, hideWidget, toggleWidget } = useAIWidget();
  
  return (
    <button onClick={toggleWidget}>
      打开AI助手
    </button>
  );
}
```

## 🔧 配置

### 环境变量

创建`.env.local`文件：

```env
# OpenAI配置（如果使用OpenAI模型）
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-api-key
NEXT_PUBLIC_OPENAI_BASE_URL=https://api.openai.com/v1

# 本地模型配置（如果使用本地模型）
NEXT_PUBLIC_LOCAL_MODEL_ENDPOINT=http://localhost:11434
NEXT_PUBLIC_LOCAL_MODEL_AUTH_TOKEN=optional-token

# 引擎配置
NEXT_PUBLIC_ENGINE_DEFAULT_TIMEOUT=30000
NEXT_PUBLIC_ENGINE_MAX_CONCURRENT_TASKS=5
NEXT_PUBLIC_ENGINE_ENABLE_DEBUG=false
```

### 自定义配置

```typescript
import { AutonomousAIEngine, EngineConfig } from '@/lib/autonomous-engine';

const customConfig: EngineConfig = {
  version: '2.0.0',
  defaultTimeout: 60000,        // 60秒超时
  maxConcurrentTasks: 10,       // 最多10个并发任务
  enableDebugMode: true,        // 开启调试模式
  persistenceEnabled: true,     // 启用持久化
  resumeTasksOnRestore: true    // 恢复时继续执行任务
};

const engine = new AutonomousAIEngine(customConfig);
```

## 🎨 自定义外观

### 自定义位置和大小

```typescript
<EnhancedAIWidget 
  agenticCore={agenticCore}
  initialPosition={{ x: 100, y: 100 }}
  initialSize={{ width: 500, height: 700 }}
/>
```

### 自定义主题

AI浮窗自动适配您的Tailwind主题。确保在`tailwind.config.ts`中配置了dark模式：

```typescript
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      // 您的自定义主题
    },
  },
};
```

## 🧪 测试

### 运行测试

```bash
# 运行所有测试
npm run test

# 监视模式
npm run test:watch

# 查看覆盖率
npm run test:coverage
```

### 测试示例

```typescript
import { AutonomousAIEngine } from '@/lib/autonomous-engine';

describe('AutonomousAIEngine', () => {
  it('should initialize successfully', async () => {
    const engine = new AutonomousAIEngine({
      version: '2.0.0',
      defaultTimeout: 30000,
      maxConcurrentTasks: 5,
      enableDebugMode: false,
      persistenceEnabled: false,
      resumeTasksOnRestore: false
    });
    
    await engine.start();
    expect(engine.getStatus()).toBe('running');
    
    await engine.shutdown();
  });
});
```

## 📚 核心API

### AutonomousAIEngine

```typescript
// 初始化和启动
const engine = new AutonomousAIEngine(config);
await engine.start();

// 处理消息
const response = await engine.processMessage({
  type: MessageType.USER_INPUT,
  content: '你好',
  source: 'chat'
});

// 任务管理
const plan = await engine.planTask(goal);
await engine.executeTask(taskId);

// 状态管理
const snapshot = await engine.saveState();
await engine.restoreState(snapshot);

// 关闭
await engine.shutdown();
```

### ModelAdapter

```typescript
import { ModelAdapterFactory } from '@/lib/model-adapter';

// 创建适配器
const adapter = await ModelAdapterFactory.create('openai', {
  modelName: 'gpt-4',
  provider: 'OpenAI',
  apiKey: process.env.OPENAI_API_KEY,
  maxInputLength: 8000,
  maxOutputLength: 4000,
  timeout: 30000,
  cacheEnabled: true
});

// 生成文本
const response = await adapter.generateCompletion({
  prompt: '你好，世界！',
  parameters: { temperature: 0.7 }
});

// 流式生成
for await (const chunk of adapter.streamCompletion(request)) {
  console.log(chunk.text);
}

// 健康检查
const health = await adapter.healthCheck();
console.log(health.healthy ? '✅' : '❌');
```

### UnifiedLearningSystem

```typescript
import { UnifiedLearningSystem } from '@/lib/learning-system';

const learningSystem = new UnifiedLearningSystem();

// 记录用户行为
learningSystem.getBehavioralLayer().recordBehavior({
  id: 'behavior-001',
  userId: 'user-123',
  action: 'click_button',
  context: { buttonId: 'submit' },
  timestamp: new Date(),
  sessionId: 'session-456'
});

// 获取用户配置
const profile = learningSystem.getBehavioralLayer().getUserProfile('user-123');

// 预测下一步操作
const nextAction = learningSystem.getBehavioralLayer().predictNextAction(
  'user-123',
  { currentPage: 'dashboard' }
);

// 记录决策结果
learningSystem.getStrategicLayer().recordOutcome({
  id: 'outcome-001',
  decision: 'route_to_model',
  parameters: { modelId: 'gpt-4' },
  context: {},
  result: 'success',
  metrics: {
    executionTime: 1500,
    resourceUsage: 0.3
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

// 查询知识
const results = learningSystem.getKnowledgeLayer().queryKnowledge(
  '用户习惯',
  { tags: ['user-behavior'] }
);
```

## 🔍 调试

### 开启调试模式

```typescript
const engine = new AutonomousAIEngine({
  ...config,
  enableDebugMode: true
});

// 监听事件
engine.on('message_received', (data) => {
  console.log('收到消息:', data);
});

engine.on('task:completed', (data) => {
  console.log('任务完成:', data);
});
```

### 查看系统状态

在开发模式下，增强版AI浮窗会在右下角显示实时状态面板，包括：

- 引擎状态
- 活跃模型
- 学习样本数量
- 系统精度

## 📖 更多资源

- [完整架构文档](./AI_WIDGET_ENHANCED_ARCHITECTURE.md)
- [完成报告](./AI_WIDGET_ENHANCEMENT_REPORT.md)
- [原始设计文档](../01-可插拔式拖拽移动AI系统.md)

## ❓ 常见问题

### Q: 为什么本地模型无法连接？

A: 确保：
1. Ollama或其他本地模型服务正在运行
2. 端点配置正确（默认是`http://localhost:11434`）
3. 防火墙未阻止连接

### Q: 如何切换不同的AI模型？

A: 在`EnhancedAIWidget`中，系统会自动使用配置的模型适配器。您可以通过创建多个适配器并使用工厂模式来切换：

```typescript
const openaiAdapter = await ModelAdapterFactory.create('openai', openaiConfig);
const localAdapter = await ModelAdapterFactory.create('local', localConfig);
```

### Q: 学习系统的数据存储在哪里？

A: 当前版本使用内存存储。生产环境建议使用Redis或数据库进行持久化。

### Q: 如何贡献代码？

A: 请参考[贡献指南](../CONTRIBUTING.md)并遵循代码规范。

## 🎯 下一步

1. 浏览[演示页面](http://localhost:3200/enhanced-ai-demo)
2. 阅读[架构文档](./AI_WIDGET_ENHANCED_ARCHITECTURE.md)
3. 参考API文档集成到您的项目
4. 加入开发讨论

---

祝您使用愉快！如有问题，请提交Issue。
