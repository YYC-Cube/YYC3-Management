/**
 * @fileoverview 插件系统公共 API — 统一导出
 */

// Event Bus
export { EventBus, eventBus, Events } from "./event-bus"
export type { EventName } from "./event-bus"

// Storage
export { createSystemStorage, storage, StorageKeys } from "./storage"
export type { SystemStorage } from "./storage"

// Registry
export { pluginRegistry } from "./registry"
export { registerAllSystems } from "./init"

// Types
export type {
  MenuItem,
  HubCommand,
  RouteDescriptor,
  SystemRegistration,
  SystemCard,
  ChatMessage,
  PromptPreset,
  FamilyPersona,
  ModelOption,
} from "./types"

// AI Family
export {
  FAMILY_PERSONAS,
  PERSONAS_MAP,
  moodEmoji,
  getPersonaResponse,
  getPersonaGreeting,
} from "./family-personas"

// AI Data
export {
  PROMPT_PRESETS,
  DEFAULT_MODELS,
  generateMessageId,
  getCurrentTimestamp,
  INITIAL_TIMESTAMP,
} from "./ai-data"
