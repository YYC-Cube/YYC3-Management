/**
 * @fileoverview 高级拖拽模块导出
 * @description 统一导出高级拖拽相关类型和类
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-09
 * @modified 2025-12-09
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

// 导出高级拖拽系统
export { AdvancedDragSystem } from './AdvancedDragSystem';

// 导出所有类型
export type {
  DragConfig,
  DragState,
  SnapPoint,
  Bounds,
  DragConstraints
} from './AdvancedDragSystem';

// 默认导出
export { AdvancedDragSystem as default } from './AdvancedDragSystem';
