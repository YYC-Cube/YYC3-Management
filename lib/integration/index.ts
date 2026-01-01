/**
 * AI组件集成层模块导出
 * @module integration
 */

export {
  AIComponentIntegration,
  ComponentEventBus,
  ComponentLifecycleManager
} from './AIComponentIntegration';

export type {
  ComponentType,
  ComponentInstance,
  ComponentStatus,
  ComponentRegistration,
  EventMessage,
  EventSubscription,
  IntegrationConfig
} from './AIComponentIntegration';
