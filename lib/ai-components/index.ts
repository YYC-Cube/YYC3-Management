/**
 * @fileoverview AI Components 主导出文件
 * @description YYC³ AI浮窗系统8大核心组件统一导出
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-28
 */

// ============================================
// 导出类型定义
// ============================================
export type * from './types';

// ============================================
// 导出基础设施
// ============================================
export { ComponentEventBus, eventBus } from './ComponentEventBus';
export { ComponentLifecycleManager } from './ComponentLifecycleManager';
export type { LifecycleComponent } from './ComponentLifecycleManager';

// ============================================
// 导出集成服务
// ============================================
export { 
  AIComponentsIntegration,
  type AIComponentsConfig 
} from './AIComponentsIntegration';

// ============================================
// 导出React Hooks
// ============================================
export {
  useAIComponents,
  useAIComponentEvent,
  useAIComponentPublish
} from './useAIComponents';

// ============================================
// 8大核心组件将从各自模块导入
// ============================================

// 1. ChatInterface - 已有实现，从 lib/chat-interface 引用
export { ChatInterface } from '../chat-interface';

// 2. ToolboxPanel - 已有实现，从 lib/toolbox-panel 引用
export { ToolboxPanel } from '../toolbox-panel';

// 3. InsightsDashboard - 已有实现，从 lib/insights-dashboard 引用
export { InsightsDashboard } from '../insights-dashboard';

// 4. WorkflowDesigner - 已有实现，从 lib/workflow-designer 引用
export { WorkflowDesigner } from '../workflow-designer';

// 5. KnowledgeBase - 已有实现，从 lib/knowledge-base 引用
export { KnowledgeBase } from '../knowledge-base';

// 6. AIActionsManager - 已有实现，从 lib/ai-actions-manager 引用
export { AIActionsManager } from '../ai-actions-manager';

// 7. StreamProcessor - 已有实现，从 lib/stream-processor 引用
export { StreamProcessor } from '../stream-processor';

// 8. ContextManager - 已有实现，从 lib/context-manager 引用
export { ContextManager } from '../context-manager';

// ============================================
// 默认导出集成服务
// ============================================
export { AIComponentsIntegration as default } from './AIComponentsIntegration';
