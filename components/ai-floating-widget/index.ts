/**
 * @fileoverview AI浮窗组件导出
 * @description 统一导出AI智能浮窗相关组件
 * @author YYC³
 * @version 2.0.0
 * @created 2025-12-09
 * @modified 2025-12-28
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

// 核心组件
export { IntelligentAIWidget } from './IntelligentAIWidget';

// 增强组件
export { EnhancedAIWidget } from './EnhancedAIWidget';

// Provider和Hook
export { 
  AIWidgetProvider,
  useAIWidget,
  AIWidgetTrigger
} from './AIWidgetProvider';

// 默认导出Provider
export { AIWidgetProvider as default } from './AIWidgetProvider';
