/**
 * @fileoverview 模型适配器模块导出
 * @description 统一导出所有模型适配器相关的类型和类
 * @author YYC³
 * @version 2.0.0
 * @created 2025-12-09
 * @modified 2025-12-28
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

// 类型导出 - 从新架构中导出所有类型
export * from './ModelAdapter';

// 旧架构类型导出（仅导出ModelProvider和ModelAdapterError）
export { ModelProvider, ModelAdapterError } from './types';
export type { LegacyModelAdapter } from './types';

// 适配器导出
export { ZhipuAdapter } from './ZhipuAdapter';

// 新架构适配器导出
export * from './OpenAIAdapter';
export * from './LocalModelAdapter';

// 工厂导出
export { ModelAdapterFactory } from './ModelAdapterFactory';

// 路由器导出
export { ModelRouter } from './ModelRouter';
export type { RouterConfig, RoutingRequest, RoutingResult, RoutingMetrics, ScoringWeights } from './ModelRouter';

// 默认导出工厂
export { ModelAdapterFactory as default } from './ModelAdapterFactory';

// 自动注册功能将在架构统一后重新实现
