/**
 * @fileoverview 智能自愈生态系统 - 主入口文件 | Self-Healing Ecosystem - Main Entry Point
 * @author YYC³ <admin@0379.email>
 * @version 1.0.0
 * @created 2025-12-09
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 * 
 * 本文件导出所有核心系统和类型定义
 */

// 用户反馈循环系统
export { BidirectionalFeedbackLoop } from './BidirectionalFeedbackLoop';
export { FeedbackInteractionMode, FeedbackActionType } from './BidirectionalFeedbackLoop';
export type {
  BidirectionalFeedbackConfig,
  BidirectionalLoopResult,
  DeepUnderstanding,
  EmpatheticResponse,
  CollaborativePlan,
  TransparentExecution
} from './BidirectionalFeedbackLoop';

// 自适应持续学习系统
export { AdaptiveContinuousLearning } from './AdaptiveContinuousLearning';
export { AdaptationStrategy, InnovationLevel } from './AdaptiveContinuousLearning';
export type {
  AdaptiveLearningConfig,
  AdaptiveCycleReport,
  LearningTask,
  ExplorationResult,
  ArchitectureSearchResult
} from './AdaptiveContinuousLearning';

// 多活容灾系统
export { MultiActiveDisasterRecovery } from './MultiActiveDisasterRecovery';
export { AvailabilityTier, RecoveryAutomationLevel, DataConsistencyModel } from './MultiActiveDisasterRecovery';
export type {
  MultiActiveDRConfig,
  MultiActiveCycleReport,
  GeoDistribution,
  GlobalTraffic,
  MultiMasterSync
} from './MultiActiveDisasterRecovery';

// 智能可靠性三角协同系统
export { IntelligentReliabilityTriangle } from './IntelligentReliabilityTriangle';
export type {
  TriangleConfig,
  TriangularWorkflowReport,
  FeedbackLearningSynergy,
  LearningResilienceSynergy
} from './IntelligentReliabilityTriangle';

// 演进路线图
export { ReliabilityEvolutionRoadmap } from './ReliabilityEvolutionRoadmap';
export type {
  EvolutionStage,
  PersonalizedRoadmap,
  EvolutionProgress
} from './ReliabilityEvolutionRoadmap';
