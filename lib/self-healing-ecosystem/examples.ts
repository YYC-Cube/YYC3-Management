/**
 * @fileoverview 智能自愈生态系统 - 使用示例 | Self-Healing Ecosystem - Usage Examples
 * @author YYC³ <admin@0379.email>
 * @version 1.0.0
 * @created 2025-12-09
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 * 
 * 本文件展示如何使用智能自愈生态系统的各个组件
 * 包含基础使用、完整集成和渐进式演进三个示例
 */

import {
  IntelligentReliabilityTriangle,
  ReliabilityEvolutionRoadmap,
  type TriangleConfig,
  type PersonalizedRoadmap,
  type EvolutionProgress
} from './index';

// ==================== 示例 1: 基础使用 ====================

async function basicUsageExample() {
  console.log('=== 示例 1: 基础使用 ===\n');

  // 1. 创建智能可靠性三角系统
  const triangle = new IntelligentReliabilityTriangle({
    feedbackConfig: {
      enableEmotionAnalysis: true,
      enableProactiveFeedback: true,
      feedbackFrequency: 'weekly',
      multiModalSupport: true,
      culturalAdaptation: true,
      communityCollaboration: true,
      gamificationEnabled: false,
      responseTimeTarget: 60,
      emotionModelVersion: 'v2.0',
      intentDecodingDepth: 3,
      trustBuildingEnabled: true
    },
    learningConfig: {
      enableCuriosityDriven: true,
      enableMetaLearning: true,
      enableAutoML: true,
      adaptationStrategy: 'reinforcement' as any,
      innovationThreshold: 0.7,
      safetyFirstEnabled: true,
      continuousDeployment: false,
      knowledgeRetentionPolicy: 'perpetual',
      crossDomainLearning: true,
      humanInTheLoop: true,
      ethicsGuardrails: true
    },
    disasterRecoveryConfig: {
      availabilityTier: 'multi_active' as any,
      enableChaosEngineering: true,
      enablePredictiveMaintenance: true,
      automationLevel: 'self_healing' as any,
      dataConsistencyModel: 'eventual' as any,
      multiRegionEnabled: true,
      activeRegions: ['us-east', 'eu-west', 'ap-southeast'],
      rpoTarget: 0,
      rtoTarget: 60,
      backupFrequency: 'realtime',
      disasterRecoveryDrillFrequency: 'quarterly',
      complianceRequirements: ['GDPR', 'SOC2'],
      costOptimizationEnabled: true
    }
  });

  // 2. 监听事件
  triangle.on('workflowStarted', (data) => {
    console.log('🚀 工作流启动');
  });

  triangle.on('workflowComplete', (data) => {
    console.log('✅ 工作流完成');
    console.log(`   三角健康度: ${(data.report.triangularHealth * 100).toFixed(1)}%`);
  });

  triangle.on('feedbackToLearning', (data) => {
    console.log('🔄 反馈 → 学习协同');
  });

  triangle.on('learningToRecovery', (data) => {
    console.log('🔄 学习 → 恢复协同');
  });

  triangle.on('recoveryToFeedback', (data) => {
    console.log('🔄 恢复 → 反馈协同');
  });

  // 3. 执行三角工作流
  const report = await triangle.executeTriangularWorkflow();

  // 4. 查看结果
  console.log('\n📊 工作流报告:');
  console.log(`   三角健康度: ${(report.triangularHealth * 100).toFixed(1)}%`);
  console.log(`   反馈-学习协同: ${(report.synergyAnalysis.feedbackLearning.synergyEffect * 100).toFixed(1)}%`);
  console.log(`   学习-韧性协同: ${(report.synergyAnalysis.learningResilience.resilienceGain * 100).toFixed(1)}%`);
  console.log(`   韧性-体验协同: ${(report.synergyAnalysis.resilienceExperience.experienceReliability * 100).toFixed(1)}%`);

  // 5. 查看系统状态
  const status = triangle.getSystemStatus();
  console.log('\n📈 系统状态:');
  console.log(`   已执行工作流: ${status.workflowsExecuted}`);
  console.log(`   三角健康度: ${(status.triangularHealth * 100).toFixed(1)}%`);
}

// ==================== 示例 2: 演进路线图 ====================

async function roadmapExample() {
  console.log('\n\n=== 示例 2: 演进路线图 ===\n');

  // 1. 创建演进路线图
  const roadmap = new ReliabilityEvolutionRoadmap();

  // 2. 监听事件
  roadmap.on('stagesInitialized', (data) => {
    console.log(`📋 初始化 ${data.stages.length} 个演进阶段`);
  });

  roadmap.on('roadmapCreated', (data) => {
    console.log('🗺️ 个性化路线图创建完成');
  });

  roadmap.on('progressUpdated', (data) => {
    console.log(`📊 进度更新: ${(data.progress.overallProgress * 100).toFixed(1)}%`);
  });

  roadmap.on('stageAdvanced', (data) => {
    console.log(`⏭️ 阶段推进: ${data.previousStage} → ${data.currentStage}`);
  });

  // 3. 创建个性化路线图
  const personalizedRoadmap: PersonalizedRoadmap = await roadmap.createPersonalizedRoadmap({
    industry: 'e-commerce',
    scale: 'medium',
    complianceRequirements: ['GDPR', 'PCI-DSS'],
    currentMaturity: 'basic',
    targetMaturity: 'advanced',
    timeframe: '12-18 months',
    budget: 500000
  });

  console.log('\n🗺️ 个性化路线图:');
  console.log(`   行业: ${personalizedRoadmap.businessAnalysis.industry}`);
  console.log(`   规模: ${personalizedRoadmap.businessAnalysis.scale}`);
  console.log(`   置信度: ${(personalizedRoadmap.roadmapConfidence * 100).toFixed(1)}%`);
  console.log(`   总预算: $${personalizedRoadmap.resourceAllocation.totalBudget.toLocaleString()}`);
  console.log(`   预计时长: ${personalizedRoadmap.resourceAllocation.estimatedDuration}`);

  console.log('\n📋 演进阶段:');
  personalizedRoadmap.stagePlanning.forEach((stage, index) => {
    console.log(`   ${index + 1}. ${stage.name} (${stage.duration})`);
    console.log(`      焦点: ${stage.focus.join(', ')}`);
  });

  // 4. 监控进度
  console.log('\n📊 监控演进进度:');
  for (let i = 0; i < 3; i++) {
    const progress: EvolutionProgress = await roadmap.monitorEvolutionProgress();
    console.log(`\n   进度检查 #${i + 1}:`);
    console.log(`   当前阶段: ${progress.currentStage.name}`);
    console.log(`   阶段完成度: ${(progress.progressMetrics.stageCompletion * 100).toFixed(1)}%`);
    console.log(`   目标达成度: ${(progress.progressMetrics.goalAchievement * 100).toFixed(1)}%`);
    console.log(`   业务影响: ${(progress.progressMetrics.businessImpact * 100).toFixed(1)}%`);
    console.log(`   ROI: ${progress.progressMetrics.roi.toFixed(2)}x`);
    console.log(`   状态: ${progress.progressAnalysis.status}`);
    
    if (progress.adjustmentRecommendations.length > 0) {
      console.log(`   建议调整: ${progress.adjustmentRecommendations.join(', ')}`);
    }
  }

  // 5. 查看当前状态
  const status = roadmap.getSystemStatus();
  console.log('\n📈 路线图状态:');
  console.log(`   总阶段数: ${status.totalStages}`);
  console.log(`   当前阶段: ${status.currentStage.name}`);
  console.log(`   已完成阶段: ${status.completedStages}`);
  console.log(`   总体进度: ${(status.overallProgress * 100).toFixed(1)}%`);
  console.log(`   达成里程碑: ${status.milestonesAchieved}`);
}

// ==================== 示例 3: 完整集成 ====================

async function fullIntegrationExample() {
  console.log('\n\n=== 示例 3: 完整集成示例 ===\n');

  // 1. 创建演进路线图,规划长期发展
  const roadmap = new ReliabilityEvolutionRoadmap();
  const personalizedRoadmap = await roadmap.createPersonalizedRoadmap({
    industry: 'finance',
    scale: 'large',
    complianceRequirements: ['GDPR', 'PCI-DSS', 'SOC2', 'ISO27001'],
    currentMaturity: 'intermediate',
    targetMaturity: 'expert',
    timeframe: '18-24 months',
    budget: 2000000
  });

  console.log('🗺️ 路线图创建完成');
  console.log(`   目标: ${personalizedRoadmap.businessAnalysis.industry}行业, ${personalizedRoadmap.businessAnalysis.scale}规模`);
  console.log(`   置信度: ${(personalizedRoadmap.roadmapConfidence * 100).toFixed(1)}%`);

  // 2. 创建智能可靠性三角,执行当前阶段任务
  const triangle = new IntelligentReliabilityTriangle({
    feedbackConfig: {
      enableEmotionAnalysis: true,
      enableProactiveFeedback: true,
      feedbackFrequency: 'daily',
      multiModalSupport: true,
      culturalAdaptation: true,
      communityCollaboration: true,
      gamificationEnabled: true,
      responseTimeTarget: 30,
      emotionModelVersion: 'v3.0',
      intentDecodingDepth: 5,
      trustBuildingEnabled: true
    },
    learningConfig: {
      enableCuriosityDriven: true,
      enableMetaLearning: true,
      enableAutoML: true,
      adaptationStrategy: 'meta' as any,
      innovationThreshold: 0.8,
      safetyFirstEnabled: true,
      continuousDeployment: true,
      knowledgeRetentionPolicy: 'selective',
      crossDomainLearning: true,
      humanInTheLoop: true,
      ethicsGuardrails: true
    },
    disasterRecoveryConfig: {
      availabilityTier: 'geo_distributed' as any,
      enableChaosEngineering: true,
      enablePredictiveMaintenance: true,
      automationLevel: 'self_healing' as any,
      dataConsistencyModel: 'strong' as any,
      multiRegionEnabled: true,
      activeRegions: ['us-east', 'us-west', 'eu-west', 'ap-southeast', 'ap-northeast'],
      rpoTarget: 0,
      rtoTarget: 30,
      backupFrequency: 'realtime',
      disasterRecoveryDrillFrequency: 'monthly',
      complianceRequirements: ['GDPR', 'PCI-DSS', 'SOC2', 'ISO27001'],
      costOptimizationEnabled: true
    }
  });

  console.log('\n🔺 智能可靠性三角创建完成');

  // 3. 模拟运营周期
  console.log('\n🔄 开始运营周期...\n');

  for (let cycle = 1; cycle <= 3; cycle++) {
    console.log(`\n📅 周期 #${cycle}`);

    // 执行三角工作流
    const triangleReport = await triangle.executeTriangularWorkflow();
    console.log(`   三角健康度: ${(triangleReport.triangularHealth * 100).toFixed(1)}%`);

    // 监控路线图进度
    const progress = await roadmap.monitorEvolutionProgress();
    console.log(`   路线图进度: ${(progress.overallProgress * 100).toFixed(1)}%`);
    console.log(`   当前阶段: ${progress.currentStage.name}`);
    console.log(`   状态: ${progress.progressAnalysis.status}`);

    // 根据进度决定是否推进阶段
    if (progress.progressMetrics.stageCompletion > 0.8) {
      const advancement = roadmap.advanceToNextStage();
      if (advancement.success) {
        console.log(`   ✅ ${advancement.message}`);
      }
    }
  }

  // 4. 生成最终报告
  console.log('\n\n📊 最终报告:\n');

  const triangleStatus = triangle.getSystemStatus();
  console.log('🔺 智能可靠性三角:');
  console.log(`   工作流执行次数: ${triangleStatus.workflowsExecuted}`);
  console.log(`   三角健康度: ${(triangleStatus.triangularHealth * 100).toFixed(1)}%`);
  console.log(`   协同得分:`);
  console.log(`     - 反馈-学习: ${(triangleStatus.synergyScores.feedback_learning * 100).toFixed(1)}%`);
  console.log(`     - 学习-韧性: ${(triangleStatus.synergyScores.learning_resilience * 100).toFixed(1)}%`);
  console.log(`     - 韧性-体验: ${(triangleStatus.synergyScores.resilience_experience * 100).toFixed(1)}%`);

  const roadmapStatus = roadmap.getSystemStatus();
  console.log('\n🗺️ 演进路线图:');
  console.log(`   总阶段数: ${roadmapStatus.totalStages}`);
  console.log(`   当前阶段: ${roadmapStatus.currentStage.name}`);
  console.log(`   已完成: ${roadmapStatus.completedStages}/${roadmapStatus.totalStages}`);
  console.log(`   总体进度: ${(roadmapStatus.overallProgress * 100).toFixed(1)}%`);
  console.log(`   达成里程碑: ${roadmapStatus.milestonesAchieved}`);
}

// ==================== 主函数 ====================

async function main() {
  try {
    // 运行所有示例
    await basicUsageExample();
    await roadmapExample();
    await fullIntegrationExample();

    console.log('\n\n✅ 所有示例执行完成!\n');
  } catch (error) {
    console.error('❌ 错误:', error);
    throw error;
  }
}

// 如果直接运行此文件
if (require.main === module) {
  main().catch(console.error);
}

// 导出示例函数供外部使用
export {
  basicUsageExample,
  roadmapExample,
  fullIntegrationExample
};
