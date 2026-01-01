/**
 * YYC³ WorkflowDesigner 模块导出
 */

export {
  WorkflowDesigner,
  type IWorkflowDesigner,
  type DesignerConfig,
  type WorkflowTemplate,
  type NodeDefinition,
  type NodeType,
  type PortDefinition,
  type Connection,
  type SaveResult,
  type ExportFormat,
  type ExportedWorkflow,
  type ValidationResult,
  type ExecutionOptions,
  type ExecutionResult,
  type ExecutionMetrics,
  type Breakpoint,
  type DebugResult,
  type TestCase,
  type TestResult,
  type Comment,
  type ChangeLog,
  type PersistenceConfig,
  type GridConfig,
  type ValidationRule
} from './WorkflowDesigner';

import { WorkflowDesigner as DefaultWorkflowDesigner } from './WorkflowDesigner';
export default DefaultWorkflowDesigner;
