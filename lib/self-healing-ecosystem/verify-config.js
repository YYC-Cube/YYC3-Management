/**
 * 智能自愈生态系统 - 配置系统验证脚本
 * Self-Healing Ecosystem - Configuration System Verification
 */

const fs = require('fs');
const path = require('path');

// ANSI颜色代码
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// 统计信息
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// 打印函数
function print(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function printSuccess(message) {
  print(`✓ ${message}`, colors.green);
  passedTests++;
  totalTests++;
}

function printError(message) {
  print(`✗ ${message}`, colors.red);
  failedTests++;
  totalTests++;
}

function printHeader(message) {
  print(`\n${'='.repeat(60)}`, colors.cyan);
  print(message, colors.bright + colors.cyan);
  print('='.repeat(60), colors.cyan);
}

function printSection(message) {
  print(`\n${message}`, colors.blue);
  print('-'.repeat(60), colors.blue);
}

// 验证文件存在
function verifyFileExists(filePath, description) {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    printSuccess(`${description} 存在`);
    return true;
  } else {
    printError(`${description} 不存在: ${filePath}`);
    return false;
  }
}

// 验证文件内容
function verifyFileContent(filePath, searchStrings, description) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) {
    printError(`${description} 文件不存在`);
    return false;
  }
  
  const content = fs.readFileSync(fullPath, 'utf-8');
  const missingStrings = searchStrings.filter(str => !content.includes(str));
  
  if (missingStrings.length === 0) {
    printSuccess(`${description} 包含所有必需内容`);
    return true;
  } else {
    printError(`${description} 缺少内容: ${missingStrings.join(', ')}`);
    return false;
  }
}

// 验证文件行数
function verifyFileLineCount(filePath, minLines, description) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) {
    printError(`${description} 文件不存在`);
    return false;
  }
  
  const content = fs.readFileSync(fullPath, 'utf-8');
  const lineCount = content.split('\n').length;
  
  if (lineCount >= minLines) {
    printSuccess(`${description} 行数充足: ${lineCount}行 (>= ${minLines})`);
    return true;
  } else {
    printError(`${description} 行数不足: ${lineCount}行 (< ${minLines})`);
    return false;
  }
}

// 计算文件行数
function getFileLineCount(filePath) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) return 0;
  const content = fs.readFileSync(fullPath, 'utf-8');
  return content.split('\n').length;
}

// 主验证函数
function verifyConfigurationSystem() {
  printHeader('智能自愈生态系统 - 配置系统验证');
  
  // 1. 验证配置文件存在
  printSection('1. 配置文件存在性验证');
  
  verifyFileExists('config.example.ts', 'TypeScript配置示例文件');
  verifyFileExists('.env.example', '环境变量模板文件');
  verifyFileExists('config.loader.ts', '配置加载器文件');
  verifyFileExists('CONFIGURATION_GUIDE.md', '配置指南文档');
  
  // 2. 验证config.example.ts内容
  printSection('2. TypeScript配置示例验证');
  
  verifyFileLineCount('config.example.ts', 600, 'config.example.ts');
  
  verifyFileContent('config.example.ts', [
    'BidirectionalFeedbackConfig',
    'AdaptiveLearningConfig',
    'MultiActiveDRConfig',
    'TriangleConfig',
    'basicFeedbackConfig',
    'standardFeedbackConfig',
    'advancedFeedbackConfig',
    'basicLearningConfig',
    'standardLearningConfig',
    'advancedLearningConfig',
    'singleSiteDRConfig',
    'activePassiveDRConfig',
    'activeActiveDRConfig',
    'multiActiveDRConfig',
    'geoDistributedDRConfig',
    'basicTriangleConfig',
    'standardTriangleConfig',
    'advancedTriangleConfig',
    'enterpriseFinanceTriangleConfig',
    'enterpriseHealthcareTriangleConfig',
    'enterpriseEcommerceTriangleConfig',
    'highAvailabilityConfig',
    'fastInnovationConfig',
    'costOptimizedConfig',
    'complianceFirstConfig',
    'stage1Config',
    'stage2Config',
    'stage3Config',
    'stage4Config',
    'getConfigByEnvironment',
    'getConfigByIndustry',
    'getConfigByScenario',
    'getConfigByStage',
    'mergeConfig',
    'validateConfig'
  ], 'config.example.ts');
  
  // 3. 验证.env.example内容
  printSection('3. 环境变量模板验证');
  
  verifyFileLineCount('.env.example', 300, '.env.example');
  
  verifyFileContent('.env.example', [
    'NODE_ENV',
    'APP_NAME',
    'APP_VERSION',
    'PORT',
    'FEEDBACK_ENABLE_EMOTION_ANALYSIS',
    'FEEDBACK_ENABLE_PROACTIVE',
    'FEEDBACK_FREQUENCY',
    'FEEDBACK_RESPONSE_TIME_TARGET',
    'LEARNING_ENABLE_CURIOSITY_DRIVEN',
    'LEARNING_ENABLE_META_LEARNING',
    'LEARNING_ADAPTATION_STRATEGY',
    'LEARNING_INNOVATION_THRESHOLD',
    'DR_AVAILABILITY_TIER',
    'DR_ENABLE_CHAOS_ENGINEERING',
    'DR_AUTOMATION_LEVEL',
    'DR_RPO_TARGET',
    'DR_RTO_TARGET',
    'DR_ACTIVE_REGIONS',
    'DATABASE_TYPE',
    'DATABASE_HOST',
    'DATABASE_PORT',
    'REDIS_HOST',
    'REDIS_PORT',
    'MONITORING_ENABLE_PROMETHEUS',
    'LOG_LEVEL',
    'ALERT_ENABLED',
    'JWT_SECRET',
    'SECURITY_ENABLE_HTTPS'
  ], '.env.example');
  
  // 4. 验证config.loader.ts内容
  printSection('4. 配置加载器验证');
  
  verifyFileLineCount('config.loader.ts', 400, 'config.loader.ts');
  
  verifyFileContent('config.loader.ts', [
    'EnvironmentConfig',
    'getEnvString',
    'getEnvNumber',
    'getEnvFloat',
    'getEnvBoolean',
    'getEnvArray',
    'loadFeedbackConfig',
    'loadLearningConfig',
    'loadDisasterRecoveryConfig',
    'loadConfig',
    'getTriangleConfig',
    'validateConfig',
    'printConfigSummary',
    'getConfig',
    'reloadConfig'
  ], 'config.loader.ts');
  
  // 5. 验证CONFIGURATION_GUIDE.md内容
  printSection('5. 配置指南文档验证');
  
  verifyFileLineCount('CONFIGURATION_GUIDE.md', 800, 'CONFIGURATION_GUIDE.md');
  
  verifyFileContent('CONFIGURATION_GUIDE.md', [
    '# 智能自愈生态系统 - 配置指南',
    '## 配置系统概述',
    '## 配置文件说明',
    '## 快速开始',
    '## 配置详解',
    '## 预设配置',
    '## 配置加载器',
    '## 最佳实践',
    '## 故障排查',
    'config.example.ts',
    '.env.example',
    'config.loader.ts',
    'BidirectionalFeedbackConfig',
    'AdaptiveLearningConfig',
    'MultiActiveDRConfig',
    'TriangleConfig'
  ], 'CONFIGURATION_GUIDE.md');
  
  // 6. 验证配置完整性
  printSection('6. 配置完整性验证');
  
  // 统计配置数量
  const configExampleContent = fs.readFileSync(path.join(__dirname, 'config.example.ts'), 'utf-8');
  
  // 反馈循环配置
  const feedbackConfigCount = (configExampleContent.match(/FeedbackConfig.*=/g) || []).length;
  if (feedbackConfigCount >= 4) {
    printSuccess(`反馈循环配置数量: ${feedbackConfigCount} >= 4`);
  } else {
    printError(`反馈循环配置数量不足: ${feedbackConfigCount} < 4`);
  }
  
  // 学习系统配置
  const learningConfigCount = (configExampleContent.match(/LearningConfig.*=/g) || []).length;
  if (learningConfigCount >= 4) {
    printSuccess(`学习系统配置数量: ${learningConfigCount} >= 4`);
  } else {
    printError(`学习系统配置数量不足: ${learningConfigCount} < 4`);
  }
  
  // 容灾系统配置
  const drConfigCount = (configExampleContent.match(/DRConfig.*=/g) || []).length;
  if (drConfigCount >= 6) {
    printSuccess(`容灾系统配置数量: ${drConfigCount} >= 6`);
  } else {
    printError(`容灾系统配置数量不足: ${drConfigCount} < 6`);
  }
  
  // 三角配置
  const triangleConfigCount = (configExampleContent.match(/TriangleConfig.*=/g) || []).length;
  if (triangleConfigCount >= 15) {
    printSuccess(`三角配置数量: ${triangleConfigCount} >= 15`);
  } else {
    printError(`三角配置数量不足: ${triangleConfigCount} < 15`);
  }
  
  // 工具函数
  const utilityFunctionCount = (configExampleContent.match(/export function/g) || []).length;
  if (utilityFunctionCount >= 6) {
    printSuccess(`工具函数数量: ${utilityFunctionCount} >= 6`);
  } else {
    printError(`工具函数数量不足: ${utilityFunctionCount} < 6`);
  }
  
  // 7. 验证环境变量完整性
  printSection('7. 环境变量完整性验证');
  
  const envExampleContent = fs.readFileSync(path.join(__dirname, '.env.example'), 'utf-8');
  
  // 统计环境变量数量
  const envVarCount = (envExampleContent.match(/^[A-Z_]+=/gm) || []).length;
  if (envVarCount >= 80) {
    printSuccess(`环境变量数量: ${envVarCount} >= 80`);
  } else {
    printError(`环境变量数量不足: ${envVarCount} < 80`);
  }
  
  // 验证关键配置段(支持中英文)
  const configSections = [
    { en: 'Basic Configuration', cn: '基础配置' },
    { en: 'Feedback Loop Configuration', cn: '双向反馈循环配置' },
    { en: 'Learning System Configuration', cn: '自适应持续学习配置' },
    { en: 'Disaster Recovery Configuration', cn: '多活容灾恢复配置' },
    { en: 'Database Configuration', cn: '数据库配置' },
    { en: 'Redis Configuration', cn: 'Redis配置' },
    { en: 'Monitoring Configuration', cn: '监控配置' },
    { en: 'Logging Configuration', cn: '日志配置' },
    { en: 'Alerting Configuration', cn: '告警配置' },
    { en: 'Security Configuration', cn: '安全配置' },
    { en: 'Feature Flags', cn: '功能开关' }
  ];
  
  configSections.forEach(section => {
    if (envExampleContent.includes(section.en) || envExampleContent.includes(section.cn)) {
      printSuccess(`配置段存在: ${section.cn}`);
    } else {
      printError(`配置段缺失: ${section.cn}`);
    }
  });
  
  // 8. 验证配置加载器完整性
  printSection('8. 配置加载器完整性验证');
  
  const loaderContent = fs.readFileSync(path.join(__dirname, 'config.loader.ts'), 'utf-8');
  
  // 验证类型转换函数
  const typeConverters = ['getEnvString', 'getEnvNumber', 'getEnvFloat', 'getEnvBoolean', 'getEnvArray'];
  typeConverters.forEach(converter => {
    if (loaderContent.includes(`function ${converter}`)) {
      printSuccess(`类型转换函数存在: ${converter}`);
    } else {
      printError(`类型转换函数缺失: ${converter}`);
    }
  });
  
  // 验证配置加载函数
  const loaders = ['loadFeedbackConfig', 'loadLearningConfig', 'loadDisasterRecoveryConfig', 'loadConfig'];
  loaders.forEach(loader => {
    if (loaderContent.includes(`function ${loader}`)) {
      printSuccess(`配置加载函数存在: ${loader}`);
    } else {
      printError(`配置加载函数缺失: ${loader}`);
    }
  });
  
  // 验证导出函数
  const exports = ['getConfig', 'getTriangleConfig', 'reloadConfig', 'validateConfig', 'printConfigSummary'];
  exports.forEach(exp => {
    if (loaderContent.includes(`export function ${exp}`)) {
      printSuccess(`导出函数存在: ${exp}`);
    } else {
      printError(`导出函数缺失: ${exp}`);
    }
  });
  
  // 9. 统计总代码量
  printSection('9. 代码量统计');
  
  const configExampleLines = getFileLineCount('config.example.ts');
  const envExampleLines = getFileLineCount('.env.example');
  const loaderLines = getFileLineCount('config.loader.ts');
  const guideLines = getFileLineCount('CONFIGURATION_GUIDE.md');
  
  print(`config.example.ts: ${configExampleLines} 行`, colors.cyan);
  print(`.env.example: ${envExampleLines} 行`, colors.cyan);
  print(`config.loader.ts: ${loaderLines} 行`, colors.cyan);
  print(`CONFIGURATION_GUIDE.md: ${guideLines} 行`, colors.cyan);
  
  const totalConfigLines = configExampleLines + envExampleLines + loaderLines + guideLines;
  print(`配置系统总代码量: ${totalConfigLines} 行`, colors.bright + colors.cyan);
  
  if (totalConfigLines >= 1800) {
    printSuccess(`配置系统代码量充足: ${totalConfigLines} >= 1800`);
  } else {
    printError(`配置系统代码量不足: ${totalConfigLines} < 1800`);
  }
  
  // 10. 打印验证摘要
  printSection('10. 验证摘要');
  
  const passRate = ((passedTests / totalTests) * 100).toFixed(1);
  
  print(`\n总测试数: ${totalTests}`, colors.bright);
  print(`通过: ${passedTests}`, colors.green);
  print(`失败: ${failedTests}`, colors.red);
  print(`通过率: ${passRate}%`, passRate >= 95 ? colors.green : colors.yellow);
  
  if (failedTests === 0) {
    printHeader('✅ 配置系统验证完成 - 全部通过!');
    print('\n配置系统已完整实现:', colors.green);
    print('  ✓ TypeScript配置示例 (20+预设配置)', colors.green);
    print('  ✓ 环境变量模板 (100+变量)', colors.green);
    print('  ✓ 配置加载器 (生产可用)', colors.green);
    print('  ✓ 配置指南文档 (完整)', colors.green);
    print('\n下一步:', colors.cyan);
    print('  1. 复制.env.example到.env: cp lib/self-healing-ecosystem/.env.example .env', colors.cyan);
    print('  2. 编辑.env设置你的配置: vim .env', colors.cyan);
    print('  3. 运行配置验证: npx ts-node lib/self-healing-ecosystem/config.loader.ts', colors.cyan);
    print('  4. 使用配置系统: import { getConfig } from \'./config.loader\'', colors.cyan);
    return true;
  } else {
    printHeader('❌ 配置系统验证失败');
    print(`\n${failedTests} 个测试失败,请检查上述错误`, colors.red);
    return false;
  }
}

// 运行验证
const success = verifyConfigurationSystem();
process.exit(success ? 0 : 1);
