# 🔖 YYC³ 智能自愈生态系统 - 配置指南

> 「YanYuCloudCube」  
> 「万象归元于云枢 丨深栈智启新纪元」  
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

---

# 智能自愈生态系统 - 配置指南

## 📋 目录

1. [配置系统概述](#配置系统概述)
2. [配置文件说明](#配置文件说明)
3. [快速开始](#快速开始)
4. [配置详解](#配置详解)
5. [预设配置](#预设配置)
6. [配置加载器](#配置加载器)
7. [最佳实践](#最佳实践)
8. [故障排查](#故障排查)

---

## 配置系统概述

智能自愈生态系统提供了灵活的配置系统，支持多种配置方式：

- **TypeScript配置** (`config.example.ts`) - 20+预设配置，类型安全
- **环境变量配置** (`.env.example`) - 100+环境变量，生产部署
- **配置加载器** (`config.loader.ts`) - 自动加载、验证、管理

### 配置架构

```
Configuration System
├── TypeScript Configs (config.example.ts)
│   ├── 基础配置 (basic, standard, advanced)
│   ├── 行业配置 (finance, healthcare, ecommerce)
│   ├── 场景配置 (HA, innovation, cost, compliance)
│   ├── 阶段配置 (stage1-4, 渐进式演进)
│   └── 工具函数 (select, merge, validate)
│
├── Environment Variables (.env.example)
│   ├── 系统配置 (feedback, learning, DR)
│   ├── 基础设施 (DB, Redis, MQ)
│   ├── 可观测性 (monitoring, logging, alerts)
│   ├── 安全 (JWT, SSL, CORS, rate limit)
│   ├── 集成 (AI models, 3rd party)
│   └── 运维 (debug, test, deploy)
│
└── Config Loader (config.loader.ts)
    ├── 环境变量加载
    ├── 类型安全转换
    ├── 配置验证
    └── 配置摘要
```

---

## 配置文件说明

### 1. config.example.ts

**用途**: 提供TypeScript配置示例，适合程序化使用

**特点**:
- ✅ 100% TypeScript类型安全
- ✅ 20+预设配置，开箱即用
- ✅ 完整参数文档
- ✅ 工具函数支持
- ✅ 灵活组合和覆盖

**包含配置**:
- 反馈循环配置 (4种: basic, standard, advanced, custom)
- 学习系统配置 (4种: basic, standard, advanced, custom)
- 容灾系统配置 (6种: single-site, active-passive, active-active, multi-active, geo-distributed, custom)
- 三角配置 (4种: dev, test, prod, prod-advanced)
- 行业配置 (3种: finance, healthcare, ecommerce)
- 场景配置 (4种: high-availability, fast-innovation, cost-optimized, compliance-first)
- 阶段配置 (4种: stage1-4, 渐进式演进)

**文件大小**: ~700行

### 2. .env.example

**用途**: 环境变量模板，适合部署配置

**特点**:
- ✅ 100+环境变量
- ✅ 15个主要配置分类
- ✅ 完整参数文档
- ✅ 默认值提供
- ✅ 安全最佳实践

**主要分类**:
1. 基础配置 (4 variables)
2. 反馈循环配置 (12 variables)
3. 学习系统配置 (11 variables)
4. 容灾系统配置 (13 variables)
5. 数据库配置 (8 variables)
6. Redis配置 (5 variables)
7. 消息队列配置 (4 variables)
8. 监控配置 (5 variables)
9. 日志配置 (7 variables)
10. 告警配置 (12 variables)
11. 安全配置 (11 variables)
12. AI模型配置 (7 variables)
13. 缓存配置 (3 variables)
14. 性能配置 (4 variables)
15. 功能开关 (5 variables)

**文件大小**: ~400行

### 3. config.loader.ts

**用途**: 配置加载器，自动从环境变量加载配置

**特点**:
- ✅ 类型安全的环境变量加载
- ✅ 自动类型转换 (string/number/boolean/array)
- ✅ 配置验证
- ✅ 默认值支持
- ✅ 单例模式
- ✅ 配置摘要打印

**核心函数**:
- `loadConfig()` - 加载完整配置
- `getTriangleConfig()` - 获取三角配置
- `getConfig()` - 获取配置单例
- `reloadConfig()` - 重新加载配置
- `validateConfig()` - 验证配置
- `printConfigSummary()` - 打印配置摘要

**文件大小**: ~550行

---

## 快速开始

### 方式1: 使用TypeScript预设配置

```typescript
// 1. 导入配置
import { standardTriangleConfig, getConfigByEnvironment } from './config.example';

// 2. 直接使用预设配置
const config = standardTriangleConfig;

// 3. 或根据环境选择配置
const envConfig = getConfigByEnvironment('production');

// 4. 创建智能三角系统
const triangle = new IntelligentReliabilityTriangle(config);
```

### 方式2: 使用环境变量配置

```bash
# 1. 复制环境变量模板
cp lib/self-healing-ecosystem/.env.example .env

# 2. 编辑.env文件，设置你的配置
vim .env

# 3. 在应用中使用配置加载器
```

```typescript
import { getConfig, getTriangleConfig } from './config.loader';

// 加载配置
const config = getConfig();

// 获取三角配置
const triangleConfig = getTriangleConfig();

// 创建系统
const triangle = new IntelligentReliabilityTriangle(triangleConfig);
```

### 方式3: 混合使用

```typescript
import { standardTriangleConfig, mergeConfig } from './config.example';
import { getConfig } from './config.loader';

// 从环境变量加载基础配置
const envConfig = getConfig();

// 使用预设配置作为基础
const baseConfig = standardTriangleConfig;

// 合并配置
const finalConfig = mergeConfig(baseConfig, {
  feedbackConfig: envConfig.feedback,
  learningConfig: envConfig.learning,
  disasterRecoveryConfig: envConfig.disasterRecovery
});

// 使用最终配置
const triangle = new IntelligentReliabilityTriangle(finalConfig);
```

---

## 配置详解

### 反馈循环配置 (BidirectionalFeedbackConfig)

```typescript
interface BidirectionalFeedbackConfig {
  // 是否启用情感分析
  enableEmotionAnalysis: boolean;
  
  // 是否启用主动反馈
  enableProactiveFeedback: boolean;
  
  // 反馈频率: 'realtime' | 'hourly' | 'daily' | 'weekly'
  feedbackFrequency: string;
  
  // 多模态支持(文本/语音/图像)
  multiModalSupport: boolean;
  
  // 文化适应性
  culturalAdaptation: boolean;
  
  // 社区协作
  communityCollaboration: boolean;
  
  // 游戏化启用
  gamificationEnabled: boolean;
  
  // 响应时间目标(秒)
  responseTimeTarget: number;
  
  // 情感模型版本
  emotionModelVersion: string;
  
  // 意图解码深度
  intentDecodingDepth: number;
  
  // 信任建立启用
  trustBuildingEnabled: boolean;
}
```

**推荐配置**:

| 环境 | enableEmotionAnalysis | enableProactiveFeedback | responseTimeTarget | emotionModelVersion |
|------|----------------------|------------------------|-------------------|---------------------|
| 开发 | true | false | 120s | v1.0 |
| 测试 | true | true | 90s | v2.0 |
| 生产 | true | true | 60s | v2.0 |
| 企业 | true | true | 30s | v3.0 |

### 学习系统配置 (AdaptiveLearningConfig)

```typescript
interface AdaptiveLearningConfig {
  // 启用好奇心驱动学习
  enableCuriosityDriven: boolean;
  
  // 启用元学习
  enableMetaLearning: boolean;
  
  // 启用AutoML
  enableAutoML: boolean;
  
  // 适应策略
  adaptationStrategy: AdaptationStrategy;
  
  // 创新阈值(0-1)
  innovationThreshold: number;
  
  // 安全优先
  safetyFirstEnabled: boolean;
  
  // 持续部署
  continuousDeployment: boolean;
  
  // 知识保留策略
  knowledgeRetentionPolicy: string;
  
  // 跨域学习
  crossDomainLearning: boolean;
  
  // 人在回路
  humanInTheLoop: boolean;
  
  // 伦理防护栏
  ethicsGuardrails: boolean;
}
```

**适应策略选择**:

| 策略 | 适用场景 | 复杂度 | 效果 |
|------|---------|--------|------|
| gradient_based | 快速迭代 | 低 | 中 |
| evolutionary | 探索性优化 | 中 | 中高 |
| bayesian | 小样本优化 | 中 | 高 |
| reinforcement | 序列决策 | 高 | 高 |
| transfer | 跨域应用 | 中高 | 高 |
| meta | 快速适应 | 高 | 很高 |
| neuroevolution | 结构搜索 | 很高 | 很高 |

**推荐配置**:

| 环境 | adaptationStrategy | innovationThreshold | continuousDeployment |
|------|-------------------|---------------------|---------------------|
| 开发 | gradient_based | 0.5 | false |
| 测试 | reinforcement | 0.6 | false |
| 生产 | reinforcement | 0.7 | false |
| 研究 | meta | 0.8 | true |

### 容灾系统配置 (MultiActiveDRConfig)

```typescript
interface MultiActiveDRConfig {
  // 可用性层级
  availabilityTier: AvailabilityTier;
  
  // 启用混沌工程
  enableChaosEngineering: boolean;
  
  // 启用预测性维护
  enablePredictiveMaintenance: boolean;
  
  // 自动化级别
  automationLevel: RecoveryAutomationLevel;
  
  // 数据一致性模型
  dataConsistencyModel: DataConsistencyModel;
  
  // 多区域启用
  multiRegionEnabled: boolean;
  
  // 活跃区域列表
  activeRegions: string[];
  
  // RPO目标(分钟)
  rpoTarget: number;
  
  // RTO目标(分钟)
  rtoTarget: number;
  
  // 备份频率
  backupFrequency: string;
  
  // 容灾演练频率
  disasterRecoveryDrillFrequency: string;
  
  // 合规要求
  complianceRequirements: string[];
  
  // 成本优化启用
  costOptimizationEnabled: boolean;
}
```

**可用性层级选择**:

| 层级 | 可用性 | 区域数 | RPO | RTO | 成本 | 适用场景 |
|------|--------|--------|-----|-----|------|---------|
| single_active | 99.9% | 1 | 15min | 60min | $ | 开发/测试 |
| active_passive | 99.95% | 2 | 5min | 30min | $$ | 小型生产 |
| active_active | 99.99% | 2 | 1min | 10min | $$$ | 中型生产 |
| multi_active | 99.995% | 3-4 | 0min | 5min | $$$$ | 大型生产 |
| geo_distributed | 99.999% | 5+ | 0min | 1min | $$$$$ | 关键业务 |

**推荐配置**:

| 场景 | availabilityTier | automationLevel | rpoTarget | rtoTarget | activeRegions |
|------|------------------|----------------|-----------|-----------|---------------|
| 开发 | single_active | manual | 60 | 120 | 1 |
| 测试 | active_passive | semi_auto | 15 | 60 | 2 |
| 生产(标准) | active_active | fully_auto | 5 | 30 | 2 |
| 生产(高级) | multi_active | self_healing | 0 | 5 | 4 |
| 金融/医疗 | geo_distributed | self_healing | 0 | 1 | 6+ |

---

## 预设配置

### 基础配置集

#### 1. Basic (开发环境)

```typescript
const basicTriangleConfig = {
  feedbackConfig: {
    enableEmotionAnalysis: true,
    enableProactiveFeedback: false,
    responseTimeTarget: 120,
    emotionModelVersion: 'v1.0'
  },
  learningConfig: {
    enableCuriosityDriven: true,
    enableMetaLearning: false,
    adaptationStrategy: AdaptationStrategy.gradient_based,
    innovationThreshold: 0.5
  },
  disasterRecoveryConfig: {
    availabilityTier: AvailabilityTier.single_active,
    automationLevel: RecoveryAutomationLevel.manual,
    rpoTarget: 60,
    rtoTarget: 120
  }
};
```

**适用场景**: 开发环境、小型项目、快速原型

#### 2. Standard (生产基线)

```typescript
const standardTriangleConfig = {
  feedbackConfig: {
    enableEmotionAnalysis: true,
    enableProactiveFeedback: true,
    responseTimeTarget: 60,
    emotionModelVersion: 'v2.0'
  },
  learningConfig: {
    enableCuriosityDriven: true,
    enableMetaLearning: true,
    adaptationStrategy: AdaptationStrategy.reinforcement,
    innovationThreshold: 0.7
  },
  disasterRecoveryConfig: {
    availabilityTier: AvailabilityTier.active_active,
    automationLevel: RecoveryAutomationLevel.fully_auto,
    rpoTarget: 5,
    rtoTarget: 30
  }
};
```

**适用场景**: 标准生产环境、中型项目

#### 3. Advanced (企业级)

```typescript
const advancedTriangleConfig = {
  feedbackConfig: {
    enableEmotionAnalysis: true,
    enableProactiveFeedback: true,
    responseTimeTarget: 30,
    emotionModelVersion: 'v3.0',
    gamificationEnabled: true
  },
  learningConfig: {
    enableCuriosityDriven: true,
    enableMetaLearning: true,
    enableAutoML: true,
    adaptationStrategy: AdaptationStrategy.meta,
    innovationThreshold: 0.8,
    continuousDeployment: true
  },
  disasterRecoveryConfig: {
    availabilityTier: AvailabilityTier.multi_active,
    automationLevel: RecoveryAutomationLevel.self_healing,
    rpoTarget: 0,
    rtoTarget: 5,
    enableChaosEngineering: true
  }
};
```

**适用场景**: 企业级应用、关键业务、高可用要求

### 行业配置集

#### 1. 金融行业

```typescript
const enterpriseFinanceTriangleConfig = {
  feedbackConfig: {
    enableEmotionAnalysis: true,
    culturalAdaptation: true,
    trustBuildingEnabled: true,
    responseTimeTarget: 30
  },
  learningConfig: {
    enableMetaLearning: true,
    adaptationStrategy: AdaptationStrategy.bayesian,
    humanInTheLoop: true,
    ethicsGuardrails: true,
    safetyFirstEnabled: true
  },
  disasterRecoveryConfig: {
    availabilityTier: AvailabilityTier.geo_distributed,
    automationLevel: RecoveryAutomationLevel.self_healing,
    dataConsistencyModel: DataConsistencyModel.strong,
    rpoTarget: 0,
    rtoTarget: 30,
    complianceRequirements: ['PCI-DSS', 'SOC2', 'ISO27001', 'GDPR']
  }
};
```

**特点**: 强一致性、严格合规、人在回路

#### 2. 医疗行业

```typescript
const enterpriseHealthcareTriangleConfig = {
  feedbackConfig: {
    enableEmotionAnalysis: true,
    culturalAdaptation: true,
    multiModalSupport: true,
    responseTimeTarget: 45
  },
  learningConfig: {
    enableMetaLearning: true,
    adaptationStrategy: AdaptationStrategy.transfer,
    humanInTheLoop: true,
    ethicsGuardrails: true,
    safetyFirstEnabled: true
  },
  disasterRecoveryConfig: {
    availabilityTier: AvailabilityTier.multi_active,
    automationLevel: RecoveryAutomationLevel.self_healing,
    dataConsistencyModel: DataConsistencyModel.strong,
    rpoTarget: 0,
    rtoTarget: 60,
    complianceRequirements: ['HIPAA', 'GDPR', 'ISO27001', 'SOC2']
  }
};
```

**特点**: 伦理防护、隐私保护、多模态支持

#### 3. 电商行业

```typescript
const enterpriseEcommerceTriangleConfig = {
  feedbackConfig: {
    enableEmotionAnalysis: true,
    enableProactiveFeedback: true,
    gamificationEnabled: true,
    communityCollaboration: true,
    responseTimeTarget: 30
  },
  learningConfig: {
    enableCuriosityDriven: true,
    enableMetaLearning: true,
    adaptationStrategy: AdaptationStrategy.reinforcement,
    innovationThreshold: 0.75
  },
  disasterRecoveryConfig: {
    availabilityTier: AvailabilityTier.multi_active,
    automationLevel: RecoveryAutomationLevel.self_healing,
    dataConsistencyModel: DataConsistencyModel.eventual,
    rpoTarget: 5,
    rtoTarget: 60,
    costOptimizationEnabled: true
  }
};
```

**特点**: 游戏化、最终一致性、成本优化

### 场景配置集

#### 1. 高可用场景

```typescript
const highAvailabilityConfig = {
  disasterRecoveryConfig: {
    availabilityTier: AvailabilityTier.geo_distributed,
    automationLevel: RecoveryAutomationLevel.self_healing,
    multiRegionEnabled: true,
    activeRegions: ['us-east', 'us-west', 'eu-west', 'eu-central', 'ap-southeast', 'ap-northeast'],
    rpoTarget: 0,
    rtoTarget: 1,
    enablePredictiveMaintenance: true,
    enableChaosEngineering: true
  }
};
```

**目标**: 99.999%可用性

#### 2. 快速创新场景

```typescript
const fastInnovationConfig = {
  learningConfig: {
    enableCuriosityDriven: true,
    enableMetaLearning: true,
    enableAutoML: true,
    adaptationStrategy: AdaptationStrategy.meta,
    innovationThreshold: 0.8,
    continuousDeployment: true,
    safetyFirstEnabled: false
  }
};
```

**目标**: 快速迭代、持续创新

#### 3. 成本优化场景

```typescript
const costOptimizedConfig = {
  disasterRecoveryConfig: {
    availabilityTier: AvailabilityTier.active_passive,
    automationLevel: RecoveryAutomationLevel.semi_auto,
    activeRegions: ['us-east', 'us-west'],
    costOptimizationEnabled: true,
    dataConsistencyModel: DataConsistencyModel.eventual
  }
};
```

**目标**: 成本效率最大化

#### 4. 合规优先场景

```typescript
const complianceFirstConfig = {
  learningConfig: {
    humanInTheLoop: true,
    ethicsGuardrails: true,
    safetyFirstEnabled: true,
    continuousDeployment: false
  },
  disasterRecoveryConfig: {
    dataConsistencyModel: DataConsistencyModel.strong,
    complianceRequirements: ['GDPR', 'SOC2', 'ISO27001', 'HIPAA', 'PCI-DSS'],
    disasterRecoveryDrillFrequency: 'monthly'
  }
};
```

**目标**: 满足严格合规要求

### 演进阶段配置

#### Stage 1: 基础可靠性 (1-3个月)

```typescript
const stage1Config = {
  feedbackConfig: {
    enableEmotionAnalysis: false,
    enableProactiveFeedback: false,
    responseTimeTarget: 300
  },
  learningConfig: {
    enableCuriosityDriven: false,
    enableMetaLearning: false,
    adaptationStrategy: AdaptationStrategy.gradient_based,
    innovationThreshold: 0.3
  },
  disasterRecoveryConfig: {
    availabilityTier: AvailabilityTier.single_active,
    automationLevel: RecoveryAutomationLevel.manual,
    rpoTarget: 60,
    rtoTarget: 120
  }
};
```

**重点**: 基础监控、手动恢复

#### Stage 2: 智能可靠性 (3-6个月)

```typescript
const stage2Config = {
  feedbackConfig: {
    enableEmotionAnalysis: true,
    enableProactiveFeedback: false,
    responseTimeTarget: 120
  },
  learningConfig: {
    enableCuriosityDriven: true,
    enableMetaLearning: false,
    adaptationStrategy: AdaptationStrategy.reinforcement,
    innovationThreshold: 0.5
  },
  disasterRecoveryConfig: {
    availabilityTier: AvailabilityTier.active_passive,
    automationLevel: RecoveryAutomationLevel.semi_auto,
    rpoTarget: 15,
    rtoTarget: 60
  }
};
```

**重点**: 情感分析、半自动恢复

#### Stage 3: 弹性可靠性 (6-12个月)

```typescript
const stage3Config = {
  feedbackConfig: {
    enableEmotionAnalysis: true,
    enableProactiveFeedback: true,
    responseTimeTarget: 60
  },
  learningConfig: {
    enableCuriosityDriven: true,
    enableMetaLearning: true,
    adaptationStrategy: AdaptationStrategy.meta,
    innovationThreshold: 0.7
  },
  disasterRecoveryConfig: {
    availabilityTier: AvailabilityTier.multi_active,
    automationLevel: RecoveryAutomationLevel.fully_auto,
    rpoTarget: 5,
    rtoTarget: 30
  }
};
```

**重点**: 主动反馈、全自动恢复

#### Stage 4: 卓越可靠性 (12个月+)

```typescript
const stage4Config = {
  feedbackConfig: {
    enableEmotionAnalysis: true,
    enableProactiveFeedback: true,
    gamificationEnabled: true,
    responseTimeTarget: 30
  },
  learningConfig: {
    enableCuriosityDriven: true,
    enableMetaLearning: true,
    enableAutoML: true,
    adaptationStrategy: AdaptationStrategy.neuroevolution,
    innovationThreshold: 0.8,
    continuousDeployment: true
  },
  disasterRecoveryConfig: {
    availabilityTier: AvailabilityTier.geo_distributed,
    automationLevel: RecoveryAutomationLevel.self_healing,
    rpoTarget: 0,
    rtoTarget: 5,
    enableChaosEngineering: true,
    enablePredictiveMaintenance: true
  }
};
```

**重点**: 自愈系统、持续创新

---

## 配置加载器

### 基本使用

```typescript
import { getConfig, getTriangleConfig, printConfigSummary } from './config.loader';

// 1. 加载完整配置
const config = getConfig();

// 2. 获取三角配置
const triangleConfig = getTriangleConfig();

// 3. 打印配置摘要
printConfigSummary(config);

// 4. 使用配置
const triangle = new IntelligentReliabilityTriangle(triangleConfig);
```

### 配置验证

```typescript
import { validateConfig, getConfig } from './config.loader';

const config = getConfig();
const validation = validateConfig(config);

if (!validation.valid) {
  console.error('配置验证失败:');
  validation.errors.forEach(error => console.error(`  - ${error}`));
  process.exit(1);
}
```

### 重新加载配置

```typescript
import { reloadConfig } from './config.loader';

// 在运行时重新加载配置(例如在配置文件更改后)
const newConfig = reloadConfig();
```

### 命令行工具

```bash
# 打印配置摘要
npx ts-node lib/self-healing-ecosystem/config.loader.ts

# 输出示例:
# ============================================================
# 智能自愈生态系统 - 配置摘要
# ============================================================
# 环境: production
# 应用: yyc3-mana v1.0.0
# 端口: 3000
#
# 反馈循环配置:
#   情感分析: ✓
#   主动反馈: ✓
#   响应时间: 60秒
#
# 学习系统配置:
#   好奇心驱动: ✓
#   元学习: ✓
#   创新阈值: 0.7
#
# 容灾系统配置:
#   可用性层级: multi_active
#   自动化级别: self_healing
#   活跃区域: us-east, us-west, eu-west, ap-southeast
#   RPO目标: 0分钟
#   RTO目标: 60分钟
# ============================================================
```

---

## 最佳实践

### 1. 环境分离

为不同环境使用不同的配置:

```bash
# 开发环境
.env.development

# 测试环境
.env.test

# 生产环境
.env.production
```

```typescript
// 根据NODE_ENV加载对应配置
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
require('dotenv').config({ path: envFile });
```

### 2. 敏感信息管理

**不要**将敏感信息提交到代码库:

```bash
# .gitignore
.env
.env.local
.env.*.local
```

**使用环境变量或密钥管理服务**:

```bash
# 使用环境变量
export JWT_SECRET="your-secret-key"
export DATABASE_PASSWORD="your-db-password"

# 或使用密钥管理服务
# AWS Secrets Manager
# Azure Key Vault
# HashiCorp Vault
```

### 3. 配置验证

在应用启动时验证配置:

```typescript
import { getConfig, validateConfig } from './config.loader';

const config = getConfig();
const validation = validateConfig(config);

if (!validation.valid) {
  console.error('❌ 配置验证失败:');
  validation.errors.forEach(error => console.error(`   ${error}`));
  process.exit(1);
}

console.log('✅ 配置验证通过');
```

### 4. 配置文档化

为自定义配置添加详细注释:

```typescript
const customConfig: TriangleConfig = {
  feedbackConfig: {
    // 启用情感分析,用于理解用户情绪
    // 需要: emotion-model-v2.0
    enableEmotionAnalysis: true,
    
    // 响应时间目标: 60秒
    // 超过此时间将触发告警
    responseTimeTarget: 60,
    
    // ... 其他配置
  }
};
```

### 5. 渐进式演进

按照阶段配置逐步演进:

```typescript
// 第1个月: Stage 1
const config = stage1Config;

// 第3个月: Stage 2
const config = stage2Config;

// 第6个月: Stage 3
const config = stage3Config;

// 第12个月: Stage 4
const config = stage4Config;
```

### 6. 配置监控

监控配置变更和生效情况:

```typescript
triangle.on('configUpdated', (event) => {
  console.log('配置已更新:', event.config);
  // 记录到日志系统
  logger.info('Configuration updated', { config: event.config });
});
```

### 7. 热更新支持

实现配置热更新:

```typescript
import { watch } from 'fs';
import { reloadConfig } from './config.loader';

// 监听配置文件变更
watch('.env', (eventType, filename) => {
  if (eventType === 'change') {
    console.log('配置文件已变更,重新加载...');
    const newConfig = reloadConfig();
    
    // 更新系统配置
    triangle.updateConfig(newConfig);
  }
});
```

---

## 故障排查

### 问题1: 配置加载失败

**症状**: `Error: 配置无效,请检查环境变量`

**原因**: 环境变量缺失或格式错误

**解决**:
```bash
# 1. 检查.env文件是否存在
ls -la .env

# 2. 检查环境变量是否加载
node -e "console.log(process.env.NODE_ENV)"

# 3. 验证配置
npx ts-node lib/self-healing-ecosystem/config.loader.ts
```

### 问题2: 类型转换错误

**症状**: `NaN` or `undefined` 值

**原因**: 环境变量格式不正确

**解决**:
```bash
# 错误示例
LEARNING_INNOVATION_THRESHOLD="0.7%" # ❌ 包含百分号

# 正确示例
LEARNING_INNOVATION_THRESHOLD=0.7    # ✓ 纯数字
```

### 问题3: 配置验证失败

**症状**: 验证错误列表

**原因**: 配置参数超出有效范围

**解决**:
```typescript
// 查看具体错误
const validation = validateConfig(config);
console.log(validation.errors);

// 根据错误调整配置
// 例如: FEEDBACK_RESPONSE_TIME_TARGET必须在10-600秒之间
```

### 问题4: 预设配置不生效

**症状**: 使用预设配置但行为不符合预期

**原因**: 配置被环境变量覆盖

**解决**:
```typescript
// 1. 检查环境变量优先级
// 环境变量 > TypeScript配置

// 2. 清除环境变量
unset FEEDBACK_ENABLE_EMOTION_ANALYSIS

// 3. 或显式使用TypeScript配置
const config = standardTriangleConfig; // 不使用config.loader
```

### 问题5: 性能问题

**症状**: 配置加载缓慢

**原因**: 配置文件过大或验证逻辑复杂

**解决**:
```typescript
// 1. 使用配置缓存
const config = getConfig(); // 单例模式,只加载一次

// 2. 跳过验证(不推荐)
process.env.SKIP_CONFIG_VALIDATION = 'true';

// 3. 简化配置
// 只加载必要的配置项
```

---

## 配置检查清单

部署前请确认以下项目:

- [ ] ✅ 已复制.env.example到.env
- [ ] ✅ 已设置所有必需的环境变量
- [ ] ✅ 已更新JWT_SECRET为安全值
- [ ] ✅ 已配置数据库连接信息
- [ ] ✅ 已配置Redis连接信息
- [ ] ✅ 已设置告警通知渠道
- [ ] ✅ 已配置监控端点
- [ ] ✅ 已设置日志路径
- [ ] ✅ 已配置SSL证书(生产环境)
- [ ] ✅ 已设置CORS白名单
- [ ] ✅ 已配置活跃区域
- [ ] ✅ 已设置RPO/RTO目标
- [ ] ✅ 已配置合规要求
- [ ] ✅ 已运行配置验证
- [ ] ✅ 已测试配置加载

---

## 快速参考

### 常用命令

```bash
# 复制配置模板
cp lib/self-healing-ecosystem/.env.example .env

# 编辑配置
vim .env

# 验证配置
npx ts-node lib/self-healing-ecosystem/config.loader.ts

# 运行示例
npx ts-node lib/self-healing-ecosystem/examples.ts

# 运行验证
node lib/self-healing-ecosystem/verify.js
```

### 常用导入

```typescript
// 预设配置
import {
  basicTriangleConfig,
  standardTriangleConfig,
  advancedTriangleConfig,
  enterpriseFinanceTriangleConfig,
  enterpriseHealthcareTriangleConfig,
  enterpriseEcommerceTriangleConfig
} from './config.example';

// 工具函数
import {
  getConfigByEnvironment,
  getConfigByIndustry,
  getConfigByScenario,
  getConfigByStage,
  mergeConfig,
  validateConfig as validateConfigExample
} from './config.example';

// 配置加载器
import {
  getConfig,
  getTriangleConfig,
  loadConfig,
  reloadConfig,
  validateConfig,
  printConfigSummary
} from './config.loader';
```

### 环境变量快速设置

```bash
# 开发环境
export NODE_ENV=development
export FEATURE_ENABLE_EXPERIMENTAL=true
export LOG_LEVEL=debug

# 测试环境
export NODE_ENV=test
export DR_AVAILABILITY_TIER=active_passive
export LOG_LEVEL=info

# 生产环境
export NODE_ENV=production
export DR_AVAILABILITY_TIER=multi_active
export LOG_LEVEL=warn
export SECURITY_ENABLE_HTTPS=true
```

---

## 总结

智能自愈生态系统提供了灵活、类型安全、生产就绪的配置系统:

✅ **20+预设配置** - 覆盖所有常见场景  
✅ **100+环境变量** - 完整的运维控制  
✅ **类型安全** - 100% TypeScript支持  
✅ **配置验证** - 自动错误检测  
✅ **工具函数** - 简化配置管理  
✅ **文档完善** - 详细的使用指南  

立即开始使用配置系统,快速部署智能自愈生态!

---

**相关文档**:
- [README.md](./README.md) - 系统概述
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - 集成指南
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - 实现总结

**配置文件**:
- [config.example.ts](./config.example.ts) - TypeScript配置示例
- [.env.example](./.env.example) - 环境变量模板
- [config.loader.ts](./config.loader.ts) - 配置加载器

---

## 📄 文档标尾

> 「YanYuCloudCube」  
> 「<admin@0379.email>」  
> 「言启象限,语枢未来」  
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」  
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」
