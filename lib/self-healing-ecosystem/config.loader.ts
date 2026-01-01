/**
 * @fileoverview 智能自愈生态系统 - 配置加载器 | Self-Healing Ecosystem - Configuration Loader
 * @author YYC³ <admin@0379.email>
 * @version 1.0.0
 * @created 2025-12-09
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 * 
 * 从环境变量加载配置并提供类型安全的配置对象
 */

import {
  type BidirectionalFeedbackConfig,
  type AdaptiveLearningConfig,
  type MultiActiveDRConfig,
  type TriangleConfig,
  FeedbackInteractionMode,
  AdaptationStrategy,
  AvailabilityTier,
  RecoveryAutomationLevel,
  DataConsistencyModel
} from './index';

/**
 * 环境变量配置接口
 */
interface EnvironmentConfig {
  // 基础配置
  nodeEnv: string;
  appName: string;
  appVersion: string;
  port: number;
  
  // 反馈循环配置
  feedback: BidirectionalFeedbackConfig;
  
  // 学习系统配置
  learning: AdaptiveLearningConfig;
  
  // 容灾系统配置
  disasterRecovery: MultiActiveDRConfig;
  
  // 数据库配置
  database: {
    type: string;
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    poolSize: number;
    ssl: boolean;
  };
  
  // Redis配置
  redis: {
    host: string;
    port: number;
    password: string;
    db: number;
    timeout: number;
  };
  
  // 监控配置
  monitoring: {
    enablePrometheus: boolean;
    prometheusPort: number;
    enableGrafana: boolean;
    grafanaPort: number;
    metricsPushInterval: number;
  };
  
  // 日志配置
  logging: {
    level: string;
    format: string;
    enableFile: boolean;
    filePath: string;
    fileMaxSize: number;
    fileMaxFiles: number;
    fileCompress: boolean;
  };
  
  // 告警配置
  alert: {
    enabled: boolean;
    channels: string[];
    triangleHealthThreshold: number;
    availabilityThreshold: number;
    email?: {
      from: string;
      to: string;
      smtpHost: string;
      smtpPort: number;
      smtpUser: string;
      smtpPassword: string;
    };
    slack?: {
      webhookUrl: string;
      channel: string;
    };
    webhook?: {
      url: string;
    };
  };
  
  // 安全配置
  security: {
    jwtSecret: string;
    jwtExpiresIn: string;
    enableHttps: boolean;
    sslCertPath?: string;
    sslKeyPath?: string;
    enableCors: boolean;
    corsOrigins: string[];
    enableRateLimit: boolean;
    rateLimitMax: number;
    rateLimitWindow: number;
  };
  
  // 功能开关
  features: {
    enableFeedbackLoop: boolean;
    enableLearningSystem: boolean;
    enableDisasterRecovery: boolean;
    enableRoadmap: boolean;
    enableExperimental: boolean;
  };
}

/**
 * 从环境变量获取字符串值
 */
function getEnvString(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

/**
 * 从环境变量获取数字值
 */
function getEnvNumber(key: string, defaultValue: number = 0): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * 从环境变量获取浮点数值
 */
function getEnvFloat(key: string, defaultValue: number = 0): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * 从环境变量获取布尔值
 */
function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
}

/**
 * 从环境变量获取数组值(逗号分隔)
 */
function getEnvArray(key: string, defaultValue: string[] = []): string[] {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.split(',').map(v => v.trim()).filter(v => v.length > 0);
}

/**
 * 加载反馈循环配置
 */
function loadFeedbackConfig(): BidirectionalFeedbackConfig {
  return {
    enableEmotionAnalysis: getEnvBoolean('FEEDBACK_ENABLE_EMOTION_ANALYSIS', true),
    enableProactiveFeedback: getEnvBoolean('FEEDBACK_ENABLE_PROACTIVE', true),
    feedbackFrequency: getEnvString('FEEDBACK_FREQUENCY', 'daily'),
    multiModalSupport: getEnvBoolean('FEEDBACK_MULTIMODAL_SUPPORT', true),
    culturalAdaptation: getEnvBoolean('FEEDBACK_CULTURAL_ADAPTATION', true),
    communityCollaboration: getEnvBoolean('FEEDBACK_COMMUNITY_COLLABORATION', true),
    gamificationEnabled: getEnvBoolean('FEEDBACK_GAMIFICATION_ENABLED', false),
    responseTimeTarget: getEnvNumber('FEEDBACK_RESPONSE_TIME_TARGET', 60),
    emotionModelVersion: getEnvString('FEEDBACK_EMOTION_MODEL_VERSION', 'v2.0'),
    intentDecodingDepth: getEnvNumber('FEEDBACK_INTENT_DECODING_DEPTH', 5),
    trustBuildingEnabled: getEnvBoolean('FEEDBACK_TRUST_BUILDING_ENABLED', true)
  };
}

/**
 * 加载学习系统配置
 */
function loadLearningConfig(): AdaptiveLearningConfig {
  const strategyMap: Record<string, AdaptationStrategy> = {
    'gradient_based': AdaptationStrategy.GRADIENT_BASED,
    'evolutionary': AdaptationStrategy.EVOLUTIONARY,
    'bayesian': AdaptationStrategy.BAYESIAN,
    'reinforcement': AdaptationStrategy.REINFORCEMENT,
    'transfer': AdaptationStrategy.TRANSFER,
    'meta': AdaptationStrategy.META,
    'neuroevolution': AdaptationStrategy.NEUROEVOLUTION
  };
  
  const strategyName = getEnvString('LEARNING_ADAPTATION_STRATEGY', 'reinforcement');
  const adaptationStrategy = strategyMap[strategyName] || AdaptationStrategy.REINFORCEMENT;
  
  return {
    enableCuriosityDriven: getEnvBoolean('LEARNING_ENABLE_CURIOSITY_DRIVEN', true),
    enableMetaLearning: getEnvBoolean('LEARNING_ENABLE_META_LEARNING', true),
    enableAutoML: getEnvBoolean('LEARNING_ENABLE_AUTOML', true),
    adaptationStrategy,
    innovationThreshold: getEnvFloat('LEARNING_INNOVATION_THRESHOLD', 0.7),
    safetyFirstEnabled: getEnvBoolean('LEARNING_SAFETY_FIRST_ENABLED', true),
    continuousDeployment: getEnvBoolean('LEARNING_CONTINUOUS_DEPLOYMENT', false),
    knowledgeRetentionPolicy: getEnvString('LEARNING_KNOWLEDGE_RETENTION_POLICY', 'selective'),
    crossDomainLearning: getEnvBoolean('LEARNING_CROSS_DOMAIN_LEARNING', true),
    humanInTheLoop: getEnvBoolean('LEARNING_HUMAN_IN_THE_LOOP', true),
    ethicsGuardrails: getEnvBoolean('LEARNING_ETHICS_GUARDRAILS', true)
  };
}

/**
 * 加载容灾系统配置
 */
function loadDisasterRecoveryConfig(): MultiActiveDRConfig {
  const tierMap: Record<string, AvailabilityTier> = {
    'single_active': AvailabilityTier.SINGLE_ACTIVE,
    'active_passive': AvailabilityTier.ACTIVE_PASSIVE,
    'active_active': AvailabilityTier.ACTIVE_ACTIVE,
    'multi_active': AvailabilityTier.MULTI_ACTIVE,
    'geo_distributed': AvailabilityTier.GEO_DISTRIBUTED
  };
  
  const automationMap: Record<string, RecoveryAutomationLevel> = {
    'manual': RecoveryAutomationLevel.MANUAL,
    'semi_auto': RecoveryAutomationLevel.SEMI_AUTO,
    'fully_auto': RecoveryAutomationLevel.FULLY_AUTO,
    'self_healing': RecoveryAutomationLevel.SELF_HEALING
  };
  
  const consistencyMap: Record<string, DataConsistencyModel> = {
    'strong': DataConsistencyModel.STRONG,
    'eventual': DataConsistencyModel.EVENTUAL,
    'causal': DataConsistencyModel.CAUSAL,
    'session': DataConsistencyModel.SESSION,
    'monotonic': DataConsistencyModel.MONOTONIC
  };
  
  const tierName = getEnvString('DR_AVAILABILITY_TIER', 'multi_active');
  const automationName = getEnvString('DR_AUTOMATION_LEVEL', 'self_healing');
  const consistencyName = getEnvString('DR_DATA_CONSISTENCY_MODEL', 'eventual');
  
  return {
    availabilityTier: tierMap[tierName] || AvailabilityTier.MULTI_ACTIVE,
    enableChaosEngineering: getEnvBoolean('DR_ENABLE_CHAOS_ENGINEERING', false),
    enablePredictiveMaintenance: getEnvBoolean('DR_ENABLE_PREDICTIVE_MAINTENANCE', true),
    automationLevel: automationMap[automationName] || RecoveryAutomationLevel.SELF_HEALING,
    dataConsistencyModel: consistencyMap[consistencyName] || DataConsistencyModel.EVENTUAL,
    multiRegionEnabled: getEnvBoolean('DR_MULTI_REGION_ENABLED', true),
    activeRegions: getEnvArray('DR_ACTIVE_REGIONS', ['us-east', 'us-west', 'eu-west', 'ap-southeast']),
    rpoTarget: getEnvNumber('DR_RPO_TARGET', 0),
    rtoTarget: getEnvNumber('DR_RTO_TARGET', 60),
    backupFrequency: getEnvString('DR_BACKUP_FREQUENCY', 'realtime'),
    disasterRecoveryDrillFrequency: getEnvString('DR_DRILL_FREQUENCY', 'monthly'),
    complianceRequirements: getEnvArray('DR_COMPLIANCE_REQUIREMENTS', ['GDPR', 'SOC2']),
    costOptimizationEnabled: getEnvBoolean('DR_COST_OPTIMIZATION_ENABLED', true)
  };
}

/**
 * 加载完整环境配置
 */
export function loadConfig(): EnvironmentConfig {
  return {
    // 基础配置
    nodeEnv: getEnvString('NODE_ENV', 'development'),
    appName: getEnvString('APP_NAME', 'yyc3-mana'),
    appVersion: getEnvString('APP_VERSION', '1.0.0'),
    port: getEnvNumber('PORT', 3000),
    
    // 反馈循环配置
    feedback: loadFeedbackConfig(),
    
    // 学习系统配置
    learning: loadLearningConfig(),
    
    // 容灾系统配置
    disasterRecovery: loadDisasterRecoveryConfig(),
    
    // 数据库配置
    database: {
      type: getEnvString('DATABASE_TYPE', 'postgresql'),
      host: getEnvString('DATABASE_HOST', 'localhost'),
      port: getEnvNumber('DATABASE_PORT', 5432),
      name: getEnvString('DATABASE_NAME', 'yyc3_mana'),
      user: getEnvString('DATABASE_USER', 'postgres'),
      password: getEnvString('DATABASE_PASSWORD', ''),
      poolSize: getEnvNumber('DATABASE_POOL_SIZE', 20),
      ssl: getEnvBoolean('DATABASE_SSL', false)
    },
    
    // Redis配置
    redis: {
      host: getEnvString('REDIS_HOST', 'localhost'),
      port: getEnvNumber('REDIS_PORT', 6379),
      password: getEnvString('REDIS_PASSWORD', ''),
      db: getEnvNumber('REDIS_DB', 0),
      timeout: getEnvNumber('REDIS_TIMEOUT', 5000)
    },
    
    // 监控配置
    monitoring: {
      enablePrometheus: getEnvBoolean('MONITORING_ENABLE_PROMETHEUS', true),
      prometheusPort: getEnvNumber('MONITORING_PROMETHEUS_PORT', 9090),
      enableGrafana: getEnvBoolean('MONITORING_ENABLE_GRAFANA', true),
      grafanaPort: getEnvNumber('MONITORING_GRAFANA_PORT', 3001),
      metricsPushInterval: getEnvNumber('MONITORING_METRICS_PUSH_INTERVAL', 30)
    },
    
    // 日志配置
    logging: {
      level: getEnvString('LOG_LEVEL', 'info'),
      format: getEnvString('LOG_FORMAT', 'json'),
      enableFile: getEnvBoolean('LOG_ENABLE_FILE', true),
      filePath: getEnvString('LOG_FILE_PATH', './logs/app.log'),
      fileMaxSize: getEnvNumber('LOG_FILE_MAX_SIZE', 100),
      fileMaxFiles: getEnvNumber('LOG_FILE_MAX_FILES', 10),
      fileCompress: getEnvBoolean('LOG_FILE_COMPRESS', true)
    },
    
    // 告警配置
    alert: {
      enabled: getEnvBoolean('ALERT_ENABLED', true),
      channels: getEnvArray('ALERT_CHANNELS', ['email', 'slack']),
      triangleHealthThreshold: getEnvFloat('ALERT_TRIANGLE_HEALTH_THRESHOLD', 0.7),
      availabilityThreshold: getEnvFloat('ALERT_AVAILABILITY_THRESHOLD', 0.999),
      email: process.env.ALERT_EMAIL_FROM ? {
        from: getEnvString('ALERT_EMAIL_FROM'),
        to: getEnvString('ALERT_EMAIL_TO'),
        smtpHost: getEnvString('ALERT_EMAIL_SMTP_HOST'),
        smtpPort: getEnvNumber('ALERT_EMAIL_SMTP_PORT', 587),
        smtpUser: getEnvString('ALERT_EMAIL_SMTP_USER'),
        smtpPassword: getEnvString('ALERT_EMAIL_SMTP_PASSWORD')
      } : undefined,
      slack: process.env.ALERT_SLACK_WEBHOOK_URL ? {
        webhookUrl: getEnvString('ALERT_SLACK_WEBHOOK_URL'),
        channel: getEnvString('ALERT_SLACK_CHANNEL', '#alerts')
      } : undefined,
      webhook: process.env.ALERT_WEBHOOK_URL ? {
        url: getEnvString('ALERT_WEBHOOK_URL')
      } : undefined
    },
    
    // 安全配置
    security: {
      jwtSecret: getEnvString('JWT_SECRET', 'change_this_in_production'),
      jwtExpiresIn: getEnvString('JWT_EXPIRES_IN', '7d'),
      enableHttps: getEnvBoolean('SECURITY_ENABLE_HTTPS', false),
      sslCertPath: process.env.SECURITY_SSL_CERT_PATH,
      sslKeyPath: process.env.SECURITY_SSL_KEY_PATH,
      enableCors: getEnvBoolean('SECURITY_ENABLE_CORS', true),
      corsOrigins: getEnvArray('SECURITY_CORS_ORIGINS', ['http://localhost:3000']),
      enableRateLimit: getEnvBoolean('SECURITY_ENABLE_RATE_LIMIT', true),
      rateLimitMax: getEnvNumber('SECURITY_RATE_LIMIT_MAX', 100),
      rateLimitWindow: getEnvNumber('SECURITY_RATE_LIMIT_WINDOW', 15)
    },
    
    // 功能开关
    features: {
      enableFeedbackLoop: getEnvBoolean('FEATURE_ENABLE_FEEDBACK_LOOP', true),
      enableLearningSystem: getEnvBoolean('FEATURE_ENABLE_LEARNING_SYSTEM', true),
      enableDisasterRecovery: getEnvBoolean('FEATURE_ENABLE_DISASTER_RECOVERY', true),
      enableRoadmap: getEnvBoolean('FEATURE_ENABLE_ROADMAP', true),
      enableExperimental: getEnvBoolean('FEATURE_ENABLE_EXPERIMENTAL', false)
    }
  };
}

/**
 * 获取三角配置
 */
export function getTriangleConfig(): TriangleConfig {
  const config = loadConfig();
  
  return {
    feedbackConfig: config.feedback,
    learningConfig: config.learning,
    disasterRecoveryConfig: config.disasterRecovery
  };
}

/**
 * 验证配置
 */
export function validateConfig(config: EnvironmentConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // 验证基础配置
  if (!config.appName) {
    errors.push('APP_NAME不能为空');
  }
  
  // 验证反馈配置
  if (config.feedback.responseTimeTarget !== undefined && (config.feedback.responseTimeTarget < 10 || config.feedback.responseTimeTarget > 600)) {
    errors.push('FEEDBACK_RESPONSE_TIME_TARGET必须在10-600秒之间');
  }
  
  // 验证学习配置
  if (config.learning.innovationThreshold !== undefined && (config.learning.innovationThreshold < 0 || config.learning.innovationThreshold > 1)) {
    errors.push('LEARNING_INNOVATION_THRESHOLD必须在0-1之间');
  }
  
  // 验证容灾配置
  if (config.disasterRecovery.rpoTarget !== undefined && config.disasterRecovery.rpoTarget < 0) {
    errors.push('DR_RPO_TARGET不能为负数');
  }
  if (config.disasterRecovery.rtoTarget !== undefined && config.disasterRecovery.rtoTarget < 0) {
    errors.push('DR_RTO_TARGET不能为负数');
  }
  if (config.disasterRecovery.activeRegions && config.disasterRecovery.activeRegions.length === 0) {
    errors.push('DR_ACTIVE_REGIONS不能为空');
  }
  
  // 验证数据库配置
  if (!config.database.host) {
    errors.push('DATABASE_HOST不能为空');
  }
  if (!config.database.name) {
    errors.push('DATABASE_NAME不能为空');
  }
  
  // 验证安全配置
  if (config.security.jwtSecret === 'change_this_in_production' && config.nodeEnv === 'production') {
    errors.push('生产环境必须设置JWT_SECRET');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 打印配置摘要(隐藏敏感信息)
 */
export function printConfigSummary(config: EnvironmentConfig): void {
  console.log('='.repeat(60));
  console.log('智能自愈生态系统 - 配置摘要');
  console.log('='.repeat(60));
  console.log(`环境: ${config.nodeEnv}`);
  console.log(`应用: ${config.appName} v${config.appVersion}`);
  console.log(`端口: ${config.port}`);
  console.log('');
  console.log('反馈循环配置:');
  console.log(`  情感分析: ${config.feedback.enableEmotionAnalysis ?? false ? '✓' : '✗'}`);
  console.log(`  主动反馈: ${config.feedback.enableProactiveFeedback ?? false ? '✓' : '✗'}`);
  console.log(`  响应时间: ${config.feedback.responseTimeTarget ?? '默认'}秒`);
  console.log('');
  console.log('学习系统配置:');
  console.log(`  好奇心驱动: ${config.learning.enableCuriosityDriven ?? false ? '✓' : '✗'}`);
  console.log(`  元学习: ${config.learning.enableMetaLearning ?? false ? '✓' : '✗'}`);
  console.log(`  创新阈值: ${config.learning.innovationThreshold ?? '默认'}`);
  console.log('');
  console.log('容灾系统配置:');
  console.log(`  可用性层级: ${config.disasterRecovery.availabilityTier ?? '默认'}`);
  console.log(`  自动化级别: ${config.disasterRecovery.automationLevel ?? '默认'}`);
  console.log(`  活跃区域: ${config.disasterRecovery.activeRegions ? config.disasterRecovery.activeRegions.join(', ') : '默认'}`);
  console.log(`  RPO目标: ${config.disasterRecovery.rpoTarget ?? '默认'}分钟`);
  console.log(`  RTO目标: ${config.disasterRecovery.rtoTarget ?? '默认'}分钟`);
  console.log('');
  console.log('功能开关:');
  console.log(`  反馈循环: ${config.features.enableFeedbackLoop ? '✓' : '✗'}`);
  console.log(`  学习系统: ${config.features.enableLearningSystem ? '✓' : '✗'}`);
  console.log(`  容灾系统: ${config.features.enableDisasterRecovery ? '✓' : '✗'}`);
  console.log(`  演进路线图: ${config.features.enableRoadmap ? '✓' : '✗'}`);
  console.log('='.repeat(60));
}

// 导出单例配置
let configInstance: EnvironmentConfig | null = null;

/**
 * 获取配置单例
 */
export function getConfig(): EnvironmentConfig {
  if (!configInstance) {
    configInstance = loadConfig();
    
    // 验证配置
    const validation = validateConfig(configInstance);
    if (!validation.valid) {
      console.error('配置验证失败:');
      validation.errors.forEach(error => console.error(`  - ${error}`));
      throw new Error('配置无效,请检查环境变量');
    }
  }
  
  return configInstance;
}

/**
 * 重新加载配置
 */
export function reloadConfig(): EnvironmentConfig {
  configInstance = null;
  return getConfig();
}

// 如果直接运行此文件,打印配置摘要
if (require.main === module) {
  const config = getConfig();
  printConfigSummary(config);
}
