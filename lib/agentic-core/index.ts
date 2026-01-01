/**
 * @fileoverview AgenticCore模块导出
 * @description 统一导出AgenticCore相关的类型和类
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-09
 * @modified 2025-12-09
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

// 导出核心引擎
export { AgenticCore } from './AgenticCore';

// 导出子系统
export { MessageBus } from './MessageBus';
export { TaskScheduler } from './TaskScheduler';
export { StateManager } from './StateManager';

// 导出AgentState枚举（既是类型又是值）
export { AgentState } from './AgenticCore';

// 导出所有其他类型
export type {
  AgentTask,
  Subtask,
  AgentContext,
  Message,
  UserPreferences,
  TaskMetrics,
  UserInput,
  AgentResponse,
  AgentConfig,
  GoalConfig,
  PlanningConfig,
  ToolConfig,
  ReflectionConfig,
  KnowledgeConfig,
  ContextConfig,
  LearningConfig
} from './AgenticCore';

// 默认导出
export { AgenticCore as default } from './AgenticCore';
