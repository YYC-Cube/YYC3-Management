/**
 * @fileoverview 智能自愈生态系统 - 完整配置示例 | Self-Healing Ecosystem - Complete Configuration Examples
 * @author YYC³ <admin@0379.email>
 * @version 1.0.0
 * @created 2025-12-09
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 * 
 * 本文件提供所有系统的完整配置示例,包括:
 * 1. 双向反馈循环配置
 * 2. 自适应持续学习配置
 * 3. 多活容灾恢复配置
 * 4. 智能可靠性三角配置
 * 5. 不同环境的配置方案
 */

import {
  type BidirectionalFeedbackConfig,
  type AdaptiveLearningConfig,
  type MultiActiveDRConfig,
  type TriangleConfig,
  FeedbackInteractionMode,
  FeedbackActionType,
  AdaptationStrategy,
  InnovationLevel,
  AvailabilityTier,
  RecoveryAutomationLevel,
  DataConsistencyModel
} from './index';

// ==================== 1. 双向反馈循环配置 ====================

/**
 * 基础反馈配置 - 适合开发环境和小型项目
 */
export const basicFeedbackConfig: BidirectionalFeedbackConfig = {
  // 启用情感分析 - 识别用户情感状态
  enableEmotionAnalysis: true,
  
  // 禁用主动反馈 - 仅响应用户主动反馈
  enableProactiveFeedback: false,
  
  // 反馈频率 - 每周一次
  feedbackFrequency: 'weekly',
  
  // 禁用多模态支持 - 仅支持文本
  multiModalSupport: false,
  
  // 禁用文化适应 - 使用默认模型
  culturalAdaptation: false,
  
  // 禁用社区协作 - 单用户模式
  communityCollaboration: false,
  
  // 禁用游戏化 - 简单反馈模式
  gamificationEnabled: false,
  
  // 响应时间目标 - 2分钟内响应
  responseTimeTarget: 120,
  
  // 情感模型版本 - 使用v1.0基础版本
  emotionModelVersion: 'v1.0',
  
  // 意图解码深度 - 基础解码(3层)
  intentDecodingDepth: 3,
  
  // 启用信任建设
  trustBuildingEnabled: true
};

/**
 * 标准反馈配置 - 适合生产环境和中型项目
 */
export const standardFeedbackConfig: BidirectionalFeedbackConfig = {
  enableEmotionAnalysis: true,
  enableProactiveFeedback: true,
  feedbackFrequency: 'daily',
  multiModalSupport: true,
  culturalAdaptation: true,
  communityCollaboration: true,
  gamificationEnabled: false,
  responseTimeTarget: 60,
  emotionModelVersion: 'v2.0',
  intentDecodingDepth: 5,
  trustBuildingEnabled: true
};

/**
 * 高级反馈配置 - 适合大型企业和关键业务
 */
export const advancedFeedbackConfig: BidirectionalFeedbackConfig = {
  enableEmotionAnalysis: true,
  enableProactiveFeedback: true,
  feedbackFrequency: 'realtime',
  multiModalSupport: true,
  culturalAdaptation: true,
  communityCollaboration: true,
  gamificationEnabled: true,
  responseTimeTarget: 30,
  emotionModelVersion: 'v3.0',
  intentDecodingDepth: 7,
  trustBuildingEnabled: true
};

/**
 * 自定义反馈配置 - 完整参数说明
 */
export const customFeedbackConfig: BidirectionalFeedbackConfig = {
  // 情感分析开关
  // true: 启用9种情感类型识别(喜悦、信任、恐惧、惊讶、悲伤、厌恶、愤怒、期待、中性)
  // false: 禁用情感分析,使用基础反馈处理
  enableEmotionAnalysis: true,
  
  // 主动反馈开关
  // true: 系统主动请求用户反馈
  // false: 仅响应用户主动提交的反馈
  enableProactiveFeedback: true,
  
  // 反馈频率
  // 'realtime': 实时反馈(高频率)
  // 'daily': 每日一次
  // 'weekly': 每周一次
  // 'monthly': 每月一次
  // 'on-demand': 按需触发
  feedbackFrequency: 'daily',
  
  // 多模态支持
  // true: 支持文本、语音、图像等多种输入
  // false: 仅支持文本输入
  multiModalSupport: true,
  
  // 文化适应
  // true: 根据用户文化背景调整情感模型
  // false: 使用统一的情感模型
  culturalAdaptation: true,
  
  // 社区协作
  // true: 启用社区反馈共享和协作
  // false: 独立处理每个用户反馈
  communityCollaboration: true,
  
  // 游戏化
  // true: 启用积分、徽章、排行榜等游戏化元素
  // false: 使用简单反馈界面
  gamificationEnabled: true,
  
  // 响应时间目标(秒)
  // 系统承诺在此时间内响应用户反馈
  // 建议值: 30-120秒
  responseTimeTarget: 60,
  
  // 情感模型版本
  // 'v1.0': 基础版本,支持基本情感识别
  // 'v2.0': 标准版本,提升准确率
  // 'v3.0': 高级版本,支持细粒度情感识别
  emotionModelVersion: 'v2.0',
  
  // 意图解码深度
  // 3: 基础解码(bug报告、功能请求、支持请求、积极反馈)
  // 5: 中级解码(增加子分类)
  // 7: 深度解码(细粒度意图识别)
  intentDecodingDepth: 5,
  
  // 信任建设
  // true: 跟踪和提升用户信任度、忠诚度
  // false: 不跟踪用户关系指标
  trustBuildingEnabled: true
};

// ==================== 2. 自适应持续学习配置 ====================

/**
 * 基础学习配置 - 适合开发环境
 */
export const basicLearningConfig: AdaptiveLearningConfig = {
  enableCuriosityDriven: true,
  enableMetaLearning: false,
  enableAutoML: false,
  adaptationStrategy: AdaptationStrategy.GRADIENT_BASED,
  innovationThreshold: 0.5,
  safetyFirstEnabled: true,
  continuousDeployment: false,
  knowledgeRetentionPolicy: 'perpetual',
  crossDomainLearning: false,
  humanInTheLoop: true,
  ethicsGuardrails: true
};

/**
 * 标准学习配置 - 适合生产环境
 */
export const standardLearningConfig: AdaptiveLearningConfig = {
  enableCuriosityDriven: true,
  enableMetaLearning: true,
  enableAutoML: true,
  adaptationStrategy: AdaptationStrategy.REINFORCEMENT,
  innovationThreshold: 0.7,
  safetyFirstEnabled: true,
  continuousDeployment: false,
  knowledgeRetentionPolicy: 'selective',
  crossDomainLearning: true,
  humanInTheLoop: true,
  ethicsGuardrails: true
};

/**
 * 高级学习配置 - 适合研究和创新场景
 */
export const advancedLearningConfig: AdaptiveLearningConfig = {
  enableCuriosityDriven: true,
  enableMetaLearning: true,
  enableAutoML: true,
  adaptationStrategy: AdaptationStrategy.META,
  innovationThreshold: 0.8,
  safetyFirstEnabled: true,
  continuousDeployment: true,
  knowledgeRetentionPolicy: 'selective',
  crossDomainLearning: true,
  humanInTheLoop: false,
  ethicsGuardrails: true
};

/**
 * 自定义学习配置 - 完整参数说明
 */
export const customLearningConfig: AdaptiveLearningConfig = {
  // 好奇心驱动探索
  // true: 系统主动探索未知领域
  // false: 仅在明确任务上学习
  enableCuriosityDriven: true,
  
  // 元学习(学会如何学习)
  // true: 启用元学习,提升学习效率
  // false: 使用传统学习方法
  enableMetaLearning: true,
  
  // 自动机器学习(AutoML)
  // true: 自动选择和优化模型
  // false: 使用预定义模型
  enableAutoML: true,
  
  // 适应策略
  // gradient_based: 基于梯度的优化
  // evolutionary: 进化算法
  // bayesian: 贝叶斯优化
  // reinforcement: 强化学习
  // transfer: 迁移学习
  // meta: 元学习
  // neuroevolution: 神经进化
  adaptationStrategy: AdaptationStrategy.REINFORCEMENT,
  
  // 创新阈值(0-1)
  // 系统认为达到创新的最低改进幅度
  // 0.5: 低阈值,容易触发创新
  // 0.7: 标准阈值
  // 0.9: 高阈值,仅重大突破算创新
  innovationThreshold: 0.7,
  
  // 安全优先
  // true: 先验证安全性再部署
  // false: 快速迭代,后验证安全性
  safetyFirstEnabled: true,
  
  // 持续部署
  // true: 学习后自动部署新模型
  // false: 需要人工审核后部署
  continuousDeployment: false,
  
  // 知识保留策略
  // 'perpetual': 永久保留所有知识
  // 'selective': 选择性保留重要知识
  // 'time-limited': 有时间限制的保留
  knowledgeRetentionPolicy: 'selective',
  
  // 跨域学习
  // true: 从不同领域迁移学习
  // false: 仅在当前领域学习
  crossDomainLearning: true,
  
  // 人在回路
  // true: 关键决策需要人工确认
  // false: 完全自动化决策
  humanInTheLoop: true,
  
  // 伦理护栏
  // true: 启用伦理检查,拒绝不道德决策
  // false: 不进行伦理检查
  ethicsGuardrails: true
};

// ==================== 3. 多活容灾恢复配置 ====================

/**
 * 单站点配置 - 适合开发环境
 */
export const singleSiteDRConfig: MultiActiveDRConfig = {
  availabilityTier: AvailabilityTier.SINGLE_ACTIVE,
  enableChaosEngineering: false,
  enablePredictiveMaintenance: false,
  automationLevel: RecoveryAutomationLevel.SEMI_AUTO,
  dataConsistencyModel: DataConsistencyModel.STRONG,
  multiRegionEnabled: false,
  activeRegions: ['local'],
  rpoTarget: 60,
  rtoTarget: 300,
  backupFrequency: 'hourly',
  disasterRecoveryDrillFrequency: 'never',
  complianceRequirements: [],
  costOptimizationEnabled: true
};

/**
 * 主备配置 - 适合中小型生产环境
 */
export const activePassiveDRConfig: MultiActiveDRConfig = {
  availabilityTier: AvailabilityTier.ACTIVE_PASSIVE,
  enableChaosEngineering: false,
  enablePredictiveMaintenance: true,
  automationLevel: RecoveryAutomationLevel.FULLY_AUTO,
  dataConsistencyModel: DataConsistencyModel.STRONG,
  multiRegionEnabled: true,
  activeRegions: ['us-east', 'us-west'],
  rpoTarget: 5,
  rtoTarget: 120,
  backupFrequency: 'realtime',
  disasterRecoveryDrillFrequency: 'quarterly',
  complianceRequirements: ['GDPR'],
  costOptimizationEnabled: true
};

/**
 * 双活配置 - 适合大型生产环境
 */
export const activeActiveDRConfig: MultiActiveDRConfig = {
  availabilityTier: AvailabilityTier.ACTIVE_ACTIVE,
  enableChaosEngineering: true,
  enablePredictiveMaintenance: true,
  automationLevel: RecoveryAutomationLevel.SELF_HEALING,
  dataConsistencyModel: DataConsistencyModel.EVENTUAL,
  multiRegionEnabled: true,
  activeRegions: ['us-east', 'eu-west'],
  rpoTarget: 0,
  rtoTarget: 60,
  backupFrequency: 'realtime',
  disasterRecoveryDrillFrequency: 'monthly',
  complianceRequirements: ['GDPR', 'SOC2'],
  costOptimizationEnabled: true
};

/**
 * 多活配置 - 适合全球化关键业务
 */
export const multiActiveDRConfig: MultiActiveDRConfig = {
  availabilityTier: AvailabilityTier.MULTI_ACTIVE,
  enableChaosEngineering: true,
  enablePredictiveMaintenance: true,
  automationLevel: RecoveryAutomationLevel.SELF_HEALING,
  dataConsistencyModel: DataConsistencyModel.EVENTUAL,
  multiRegionEnabled: true,
  activeRegions: ['us-east', 'us-west', 'eu-west', 'ap-southeast'],
  rpoTarget: 0,
  rtoTarget: 30,
  backupFrequency: 'realtime',
  disasterRecoveryDrillFrequency: 'monthly',
  complianceRequirements: ['GDPR', 'SOC2', 'PCI-DSS'],
  costOptimizationEnabled: true
};

/**
 * 地理分布配置 - 适合极高可用性要求
 */
export const geoDistributedDRConfig: MultiActiveDRConfig = {
  availabilityTier: AvailabilityTier.GEO_DISTRIBUTED,
  enableChaosEngineering: true,
  enablePredictiveMaintenance: true,
  automationLevel: RecoveryAutomationLevel.SELF_HEALING,
  dataConsistencyModel: DataConsistencyModel.CAUSAL,
  multiRegionEnabled: true,
  activeRegions: ['us-east', 'us-west', 'eu-west', 'eu-central', 'ap-southeast', 'ap-northeast'],
  rpoTarget: 0,
  rtoTarget: 30,
  backupFrequency: 'realtime',
  disasterRecoveryDrillFrequency: 'weekly',
  complianceRequirements: ['GDPR', 'SOC2', 'PCI-DSS', 'ISO27001', 'HIPAA'],
  costOptimizationEnabled: false
};

/**
 * 自定义容灾配置 - 完整参数说明
 */
export const customDRConfig: MultiActiveDRConfig = {
  // 可用性层级
  // single_active: 单活站点,无自动故障转移
  // active_passive: 主备模式,自动故障转移到备用站点
  // active_active: 双活模式,两个站点同时服务
  // multi_active: 多活模式,3+站点同时服务
  // geo_distributed: 地理分布,全球多站点
  availabilityTier: AvailabilityTier.MULTI_ACTIVE,
  
  // 混沌工程
  // true: 定期执行混沌测试(网络分区、服务故障等)
  // false: 不执行混沌测试
  // 警告: 生产环境谨慎启用
  enableChaosEngineering: true,
  
  // 预测性维护
  // true: 基于学习系统预测故障并提前维护
  // false: 响应式维护
  enablePredictiveMaintenance: true,
  
  // 自动化级别
  // manual: 手动故障转移
  // semi_auto: 半自动,需要人工确认
  // fully_auto: 全自动故障转移
  // self_healing: 自愈,自动检测和恢复
  automationLevel: RecoveryAutomationLevel.SELF_HEALING,
  
  // 数据一致性模型
  // strong: 强一致性(同步复制)
  // eventual: 最终一致性(异步复制)
  // causal: 因果一致性
  // session: 会话一致性
  // monotonic: 单调一致性
  dataConsistencyModel: DataConsistencyModel.EVENTUAL,
  
  // 多区域支持
  // true: 启用多区域部署
  // false: 单区域部署
  multiRegionEnabled: true,
  
  // 活跃区域列表
  // 定义所有活跃站点的区域标识
  activeRegions: ['us-east', 'us-west', 'eu-west', 'ap-southeast'],
  
  // RPO目标(分钟)
  // Recovery Point Objective - 可接受的最大数据丢失时间
  // 0: 零数据丢失
  // 5: 最多丢失5分钟数据
  // 60: 最多丢失1小时数据
  rpoTarget: 0,
  
  // RTO目标(分钟)
  // Recovery Time Objective - 可接受的最大恢复时间
  // 30: 30分钟内恢复服务
  // 60: 1小时内恢复服务
  // 240: 4小时内恢复服务
  rtoTarget: 60,
  
  // 备份频率
  // 'realtime': 实时备份(同步)
  // 'continuous': 持续备份(5-15分钟)
  // 'hourly': 每小时
  // 'daily': 每天
  // 'weekly': 每周
  backupFrequency: 'realtime',
  
  // 容灾演练频率
  // 'weekly': 每周一次
  // 'monthly': 每月一次
  // 'quarterly': 每季度一次
  // 'annually': 每年一次
  // 'never': 不进行演练(不推荐)
  disasterRecoveryDrillFrequency: 'monthly',
  
  // 合规要求
  // 根据业务需求选择适用的合规标准
  complianceRequirements: ['GDPR', 'SOC2', 'PCI-DSS', 'ISO27001'],
  
  // 成本优化
  // true: 启用成本优化(可能影响性能)
  // false: 性能优先,不考虑成本
  costOptimizationEnabled: true
};

// ==================== 4. 智能可靠性三角配置 ====================

/**
 * 基础三角配置 - 适合开发环境和小型项目
 */
export const basicTriangleConfig: TriangleConfig = {
  feedbackConfig: basicFeedbackConfig,
  learningConfig: basicLearningConfig,
  disasterRecoveryConfig: singleSiteDRConfig
};

/**
 * 标准三角配置 - 适合生产环境和中型项目
 */
export const standardTriangleConfig: TriangleConfig = {
  feedbackConfig: standardFeedbackConfig,
  learningConfig: standardLearningConfig,
  disasterRecoveryConfig: activeActiveDRConfig
};

/**
 * 高级三角配置 - 适合大型企业和关键业务
 */
export const advancedTriangleConfig: TriangleConfig = {
  feedbackConfig: advancedFeedbackConfig,
  learningConfig: advancedLearningConfig,
  disasterRecoveryConfig: multiActiveDRConfig
};

/**
 * 开发环境三角配置
 */
export const devTriangleConfig: TriangleConfig = {
  feedbackConfig: basicFeedbackConfig,
  learningConfig: basicLearningConfig,
  disasterRecoveryConfig: singleSiteDRConfig
};

/**
 * 测试环境三角配置
 */
export const testTriangleConfig: TriangleConfig = {
  feedbackConfig: standardFeedbackConfig,
  learningConfig: standardLearningConfig,
  disasterRecoveryConfig: activePassiveDRConfig
};

/**
 * 生产环境三角配置 - 标准
 */
export const prodTriangleConfig: TriangleConfig = {
  feedbackConfig: standardFeedbackConfig,
  learningConfig: standardLearningConfig,
  disasterRecoveryConfig: activeActiveDRConfig
};

/**
 * 生产环境三角配置 - 高级
 */
export const prodAdvancedTriangleConfig: TriangleConfig = {
  feedbackConfig: advancedFeedbackConfig,
  learningConfig: advancedLearningConfig,
  disasterRecoveryConfig: multiActiveDRConfig
};

/**
 * 企业级三角配置 - 金融行业
 */
export const enterpriseFinanceTriangleConfig: TriangleConfig = {
  feedbackConfig: {
    ...advancedFeedbackConfig,
    responseTimeTarget: 30,
    trustBuildingEnabled: true
  },
  learningConfig: {
    ...advancedLearningConfig,
    safetyFirstEnabled: true,
    continuousDeployment: false,
    humanInTheLoop: true
  },
  disasterRecoveryConfig: {
    ...geoDistributedDRConfig,
    dataConsistencyModel: DataConsistencyModel.STRONG,
    rpoTarget: 0,
    rtoTarget: 30,
    complianceRequirements: ['PCI-DSS', 'SOC2', 'ISO27001', 'GDPR']
  }
};

/**
 * 企业级三角配置 - 医疗行业
 */
export const enterpriseHealthcareTriangleConfig: TriangleConfig = {
  feedbackConfig: {
    ...advancedFeedbackConfig,
    culturalAdaptation: true,
    multiModalSupport: true
  },
  learningConfig: {
    ...advancedLearningConfig,
    ethicsGuardrails: true,
    humanInTheLoop: true,
    safetyFirstEnabled: true
  },
  disasterRecoveryConfig: {
    ...geoDistributedDRConfig,
    dataConsistencyModel: DataConsistencyModel.STRONG,
    complianceRequirements: ['HIPAA', 'GDPR', 'ISO27001', 'SOC2']
  }
};

/**
 * 企业级三角配置 - 电商行业
 */
export const enterpriseEcommerceTriangleConfig: TriangleConfig = {
  feedbackConfig: {
    ...advancedFeedbackConfig,
    gamificationEnabled: true,
    communityCollaboration: true,
    feedbackFrequency: 'realtime'
  },
  learningConfig: {
    ...advancedLearningConfig,
    innovationThreshold: 0.6,
    continuousDeployment: true,
    crossDomainLearning: true
  },
  disasterRecoveryConfig: {
    ...multiActiveDRConfig,
    dataConsistencyModel: DataConsistencyModel.EVENTUAL,
    costOptimizationEnabled: true,
    complianceRequirements: ['PCI-DSS', 'GDPR', 'SOC2']
  }
};

// ==================== 5. 特定场景配置 ====================

/**
 * 高可用场景 - 99.99%+ 可用性
 */
export const highAvailabilityConfig: TriangleConfig = {
  feedbackConfig: {
    ...standardFeedbackConfig,
    responseTimeTarget: 30
  },
  learningConfig: {
    ...standardLearningConfig,
    safetyFirstEnabled: true,
    continuousDeployment: false
  },
  disasterRecoveryConfig: {
    ...multiActiveDRConfig,
    automationLevel: RecoveryAutomationLevel.SELF_HEALING,
    rpoTarget: 0,
    rtoTarget: 30,
    enablePredictiveMaintenance: true
  }
};

/**
 * 快速创新场景 - 优先创新速度
 */
export const fastInnovationConfig: TriangleConfig = {
  feedbackConfig: {
    ...advancedFeedbackConfig,
    feedbackFrequency: 'realtime',
    enableProactiveFeedback: true
  },
  learningConfig: {
    ...advancedLearningConfig,
    innovationThreshold: 0.5,
    continuousDeployment: true,
    enableAutoML: true,
    humanInTheLoop: false
  },
  disasterRecoveryConfig: {
    ...activeActiveDRConfig,
    automationLevel: RecoveryAutomationLevel.FULLY_AUTO
  }
};

/**
 * 成本优化场景 - 优先成本效益
 */
export const costOptimizedConfig: TriangleConfig = {
  feedbackConfig: {
    ...basicFeedbackConfig,
    gamificationEnabled: false,
    multiModalSupport: false
  },
  learningConfig: {
    ...basicLearningConfig,
    enableMetaLearning: false,
    enableAutoML: false
  },
  disasterRecoveryConfig: {
    ...activePassiveDRConfig,
    costOptimizationEnabled: true,
    activeRegions: ['us-east', 'us-west']
  }
};

/**
 * 合规优先场景 - 满足严格合规要求
 */
export const complianceFirstConfig: TriangleConfig = {
  feedbackConfig: {
    ...advancedFeedbackConfig,
    trustBuildingEnabled: true,
    culturalAdaptation: true
  },
  learningConfig: {
    ...standardLearningConfig,
    ethicsGuardrails: true,
    humanInTheLoop: true,
    safetyFirstEnabled: true,
    continuousDeployment: false
  },
  disasterRecoveryConfig: {
    ...geoDistributedDRConfig,
    dataConsistencyModel: DataConsistencyModel.STRONG,
    complianceRequirements: ['GDPR', 'SOC2', 'ISO27001', 'PCI-DSS', 'HIPAA'],
    disasterRecoveryDrillFrequency: 'monthly'
  }
};

// ==================== 6. 渐进式配置方案 ====================

/**
 * 第一阶段: 基础可靠 (1-3个月)
 */
export const stage1Config: TriangleConfig = {
  feedbackConfig: basicFeedbackConfig,
  learningConfig: basicLearningConfig,
  disasterRecoveryConfig: singleSiteDRConfig
};

/**
 * 第二阶段: 智能可靠 (3-6个月)
 */
export const stage2Config: TriangleConfig = {
  feedbackConfig: standardFeedbackConfig,
  learningConfig: {
    ...basicLearningConfig,
    enableMetaLearning: true,
    adaptationStrategy: AdaptationStrategy.REINFORCEMENT
  },
  disasterRecoveryConfig: activePassiveDRConfig
};

/**
 * 第三阶段: 弹性可靠 (6-12个月)
 */
export const stage3Config: TriangleConfig = {
  feedbackConfig: advancedFeedbackConfig,
  learningConfig: standardLearningConfig,
  disasterRecoveryConfig: activeActiveDRConfig
};

/**
 * 第四阶段: 卓越可靠 (12个月以上)
 */
export const stage4Config: TriangleConfig = {
  feedbackConfig: advancedFeedbackConfig,
  learningConfig: advancedLearningConfig,
  disasterRecoveryConfig: geoDistributedDRConfig
};

// ==================== 7. 配置工具函数 ====================

/**
 * 根据环境获取配置
 */
export function getConfigByEnvironment(env: 'dev' | 'test' | 'staging' | 'prod'): TriangleConfig {
  switch (env) {
    case 'dev':
      return devTriangleConfig;
    case 'test':
      return testTriangleConfig;
    case 'staging':
      return prodTriangleConfig;
    case 'prod':
      return prodAdvancedTriangleConfig;
    default:
      return devTriangleConfig;
  }
}

/**
 * 根据行业获取配置
 */
export function getConfigByIndustry(industry: 'finance' | 'healthcare' | 'ecommerce' | 'general'): TriangleConfig {
  switch (industry) {
    case 'finance':
      return enterpriseFinanceTriangleConfig;
    case 'healthcare':
      return enterpriseHealthcareTriangleConfig;
    case 'ecommerce':
      return enterpriseEcommerceTriangleConfig;
    case 'general':
    default:
      return prodTriangleConfig;
  }
}

/**
 * 根据场景获取配置
 */
export function getConfigByScenario(
  scenario: 'high-availability' | 'fast-innovation' | 'cost-optimized' | 'compliance-first'
): TriangleConfig {
  switch (scenario) {
    case 'high-availability':
      return highAvailabilityConfig;
    case 'fast-innovation':
      return fastInnovationConfig;
    case 'cost-optimized':
      return costOptimizedConfig;
    case 'compliance-first':
      return complianceFirstConfig;
    default:
      return prodTriangleConfig;
  }
}

/**
 * 根据演进阶段获取配置
 */
export function getConfigByStage(stage: 1 | 2 | 3 | 4): TriangleConfig {
  switch (stage) {
    case 1:
      return stage1Config;
    case 2:
      return stage2Config;
    case 3:
      return stage3Config;
    case 4:
      return stage4Config;
    default:
      return stage1Config;
  }
}

/**
 * 合并配置(深度合并)
 */
export function mergeConfig(
  baseConfig: TriangleConfig,
  overrideConfig: Partial<TriangleConfig>
): TriangleConfig {
  return {
    feedbackConfig: {
      ...baseConfig.feedbackConfig,
      ...(overrideConfig.feedbackConfig || {})
    },
    learningConfig: {
      ...baseConfig.learningConfig,
      ...(overrideConfig.learningConfig || {})
    },
    disasterRecoveryConfig: {
      ...baseConfig.disasterRecoveryConfig,
      ...(overrideConfig.disasterRecoveryConfig || {})
    }
  };
}

/**
 * 验证配置有效性
 */
export function validateConfig(config: TriangleConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // 验证反馈配置
  if (config.feedbackConfig.responseTimeTarget < 10 || config.feedbackConfig.responseTimeTarget > 600) {
    errors.push('responseTimeTarget必须在10-600秒之间');
  }
  if (config.feedbackConfig.intentDecodingDepth < 1 || config.feedbackConfig.intentDecodingDepth > 10) {
    errors.push('intentDecodingDepth必须在1-10之间');
  }
  
  // 验证学习配置
  if (config.learningConfig.innovationThreshold < 0 || config.learningConfig.innovationThreshold > 1) {
    errors.push('innovationThreshold必须在0-1之间');
  }
  
  // 验证容灾配置
  if (config.disasterRecoveryConfig.rpoTarget < 0) {
    errors.push('rpoTarget不能为负数');
  }
  if (config.disasterRecoveryConfig.rtoTarget < 0) {
    errors.push('rtoTarget不能为负数');
  }
  if (config.disasterRecoveryConfig.activeRegions.length === 0) {
    errors.push('activeRegions不能为空');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// ==================== 8. 导出所有配置 ====================

export const allConfigs = {
  // 基础配置
  basic: {
    feedback: basicFeedbackConfig,
    learning: basicLearningConfig,
    dr: singleSiteDRConfig,
    triangle: devTriangleConfig
  },
  
  // 标准配置
  standard: {
    feedback: standardFeedbackConfig,
    learning: standardLearningConfig,
    dr: activeActiveDRConfig,
    triangle: prodTriangleConfig
  },
  
  // 高级配置
  advanced: {
    feedback: advancedFeedbackConfig,
    learning: advancedLearningConfig,
    dr: multiActiveDRConfig,
    triangle: prodAdvancedTriangleConfig
  },
  
  // 行业配置
  industries: {
    finance: enterpriseFinanceTriangleConfig,
    healthcare: enterpriseHealthcareTriangleConfig,
    ecommerce: enterpriseEcommerceTriangleConfig
  },
  
  // 场景配置
  scenarios: {
    highAvailability: highAvailabilityConfig,
    fastInnovation: fastInnovationConfig,
    costOptimized: costOptimizedConfig,
    complianceFirst: complianceFirstConfig
  },
  
  // 阶段配置
  stages: {
    stage1: stage1Config,
    stage2: stage2Config,
    stage3: stage3Config,
    stage4: stage4Config
  }
};

// ==================== 使用示例 ====================

/*
// 1. 使用预定义配置
import { IntelligentReliabilityTriangle } from './index';
import { prodTriangleConfig } from './config.example';

const triangle = new IntelligentReliabilityTriangle(prodTriangleConfig);

// 2. 根据环境选择配置
import { getConfigByEnvironment } from './config.example';

const config = getConfigByEnvironment(process.env.NODE_ENV as any);
const triangle = new IntelligentReliabilityTriangle(config);

// 3. 根据行业选择配置
import { getConfigByIndustry } from './config.example';

const config = getConfigByIndustry('finance');
const triangle = new IntelligentReliabilityTriangle(config);

// 4. 自定义配置
import { mergeConfig, prodTriangleConfig } from './config.example';

const customConfig = mergeConfig(prodTriangleConfig, {
  feedbackConfig: {
    responseTimeTarget: 30
  },
  disasterRecoveryConfig: {
    rtoTarget: 30
  }
});
const triangle = new IntelligentReliabilityTriangle(customConfig);

// 5. 验证配置
import { validateConfig } from './config.example';

const result = validateConfig(config);
if (!result.valid) {
  console.error('配置无效:', result.errors);
} else {
  const triangle = new IntelligentReliabilityTriangle(config);
}
*/
