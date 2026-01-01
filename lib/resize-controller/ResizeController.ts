/**
 * ResizeController - 窗口大小调整控制器
 * 
 * 提供流畅的窗口大小调整功能,支持:
 * - 8个调整手柄(4个角+4条边)
 * - 捏合缩放手势
 * - 宽高比保持
 * - 尺寸约束
 * - 惯性调整
 * 
 * @author YYC³ AI开发团队
 * @version 1.0.0
 * @standard YYC³团队标准化规范 v1.1.0
 */

import { EventEmitter } from 'events';

// ==================== 类型定义 ====================

/**
 * 调整状态
 */
export enum ResizeState {
  IDLE = 'idle',
  PREPARING = 'preparing',
  RESIZING = 'resizing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

/**
 * 调整手柄位置
 */
export enum HandlePosition {
  TOP_LEFT = 'top-left',
  TOP = 'top',
  TOP_RIGHT = 'top-right',
  RIGHT = 'right',
  BOTTOM_RIGHT = 'bottom-right',
  BOTTOM = 'bottom',
  BOTTOM_LEFT = 'bottom-left',
  LEFT = 'left'
}

/**
 * 尺寸
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * 位置
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * 边界矩形
 */
export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 调整约束
 */
export interface ResizeConstraints {
  /** 最小尺寸 */
  minSize?: Size;
  /** 最大尺寸 */
  maxSize?: Size;
  /** 宽高比 */
  aspectRatio?: number;
  /** 网格尺寸 */
  gridSize?: number;
  /** 自定义约束函数 */
  custom?: (size: Size, session: ResizeSession) => Size;
}

/**
 * 调整会话
 */
export interface ResizeSession {
  id: string;
  state: ResizeState;
  element: HTMLElement;
  handle: HandlePosition;
  startBounds: Bounds;
  currentBounds: Bounds;
  startPosition: Position;
  startTime: Date;
  lastUpdated: Date;
  velocity: Size;
  constraints?: ResizeConstraints;
}

/**
 * 调整选项
 */
export interface ResizeOptions {
  /** 启用的手柄 */
  handles?: HandlePosition[];
  /** 约束条件 */
  constraints?: ResizeConstraints;
  /** 是否启用惯性 */
  enableInertia?: boolean;
  /** 是否启用预览 */
  enablePreview?: boolean;
}

/**
 * 控制器配置
 */
export interface ResizeControllerConfig {
  /** 手柄尺寸(像素) */
  handleSize: number;
  /** 调整阈值(像素) */
  resizeThreshold: number;
  /** 惯性减速度 */
  inertiaDeceleration: number;
  /** 默认启用的手柄 */
  defaultHandles: HandlePosition[];
  /** 默认约束 */
  defaultConstraints: ResizeConstraints;
  /** 启用惯性 */
  enableInertia: boolean;
  /** 启用预览 */
  enablePreview: boolean;
}

/**
 * 触摸点
 */
interface TouchPoint {
  x: number;
  y: number;
}

// ==================== 主类实现 ====================

/**
 * 调整控制器
 */
export class ResizeController extends EventEmitter {
  private config: ResizeControllerConfig;
  private sessions: Map<string, ResizeSession>;
  private activeSessionId: string | null;
  private handleElements: Map<HTMLElement, Map<HandlePosition, HTMLElement>>;
  private inertiaAnimations: Map<string, number>;
  
  // 手势相关
  private touchStartPoints: TouchPoint[] | null;
  private lastPinchDistance: number | null;
  
  constructor(config: Partial<ResizeControllerConfig> = {}) {
    super();
    
    this.config = {
      handleSize: 10,
      resizeThreshold: 5,
      inertiaDeceleration: 0.95,
      defaultHandles: Object.values(HandlePosition),
      defaultConstraints: {
        minSize: { width: 100, height: 100 }
      },
      enableInertia: true,
      enablePreview: true,
      ...config
    };
    
    this.sessions = new Map();
    this.activeSessionId = null;
    this.handleElements = new Map();
    this.inertiaAnimations = new Map();
    
    this.touchStartPoints = null;
    this.lastPinchDistance = null;
    
    this.setupEventListeners();
  }

  // ==================== 公共API ====================

  /**
   * 使元素可调整大小
   */
  public makeResizable(element: HTMLElement, options: ResizeOptions = {}): void {
    const handles = options.handles || this.config.defaultHandles;
    const handleMap = new Map<HandlePosition, HTMLElement>();
    
    // 创建手柄元素
    for (const position of handles) {
      const handle = this.createHandle(element, position);
      handleMap.set(position, handle);
      element.appendChild(handle);
    }
    
    this.handleElements.set(element, handleMap);
    
    // 设置元素样式
    element.style.position = 'relative';
    
    // 绑定事件
    this.bindHandleEvents(element, handleMap, options);
  }

  /**
   * 移除调整功能
   */
  public removeResizable(element: HTMLElement): void {
    const handleMap = this.handleElements.get(element);
    if (!handleMap) return;
    
    // 移除手柄元素
    for (const handle of handleMap.values()) {
      handle.remove();
    }
    
    this.handleElements.delete(element);
  }

  /**
   * 开始调整
   */
  public startResize(
    element: HTMLElement,
    handle: HandlePosition,
    startPosition: Position,
    options: ResizeOptions = {}
  ): string {
    const sessionId = this.generateId();
    
    const bounds = element.getBoundingClientRect();
    const session: ResizeSession = {
      id: sessionId,
      state: ResizeState.PREPARING,
      element,
      handle,
      startBounds: {
        x: bounds.left,
        y: bounds.top,
        width: bounds.width,
        height: bounds.height
      },
      currentBounds: {
        x: bounds.left,
        y: bounds.top,
        width: bounds.width,
        height: bounds.height
      },
      startPosition,
      startTime: new Date(),
      lastUpdated: new Date(),
      velocity: { width: 0, height: 0 },
      constraints: options.constraints || this.config.defaultConstraints
    };
    
    this.sessions.set(sessionId, session);
    this.activeSessionId = sessionId;
    
    // 转换状态
    this.transitionToState(sessionId, ResizeState.RESIZING);
    
    // 触发事件
    this.emit('resizeStart', { session });
    
    return sessionId;
  }

  /**
   * 更新调整
   */
  public updateResize(sessionId: string, currentPosition: Position): void {
    const session = this.sessions.get(sessionId);
    if (!session || session.state !== ResizeState.RESIZING) return;
    
    // 计算位移
    const delta = {
      x: currentPosition.x - session.startPosition.x,
      y: currentPosition.y - session.startPosition.y
    };
    
    // 根据手柄计算新尺寸和位置
    const newBounds = this.calculateNewBounds(session, delta);
    
    // 应用约束
    const constrainedBounds = this.applyConstraints(session, newBounds);
    
    // 计算速度
    const now = new Date();
    const deltaTime = now.getTime() - session.lastUpdated.getTime();
    if (deltaTime > 0) {
      session.velocity = {
        width: (constrainedBounds.width - session.currentBounds.width) / deltaTime * 1000,
        height: (constrainedBounds.height - session.currentBounds.height) / deltaTime * 1000
      };
    }
    
    // 更新会话
    session.currentBounds = constrainedBounds;
    session.lastUpdated = now;
    
    // 应用到元素
    this.applyBounds(session.element, constrainedBounds);
    
    // 触发事件
    this.emit('resizeUpdate', { session, bounds: constrainedBounds });
  }

  /**
   * 结束调整
   */
  public endResize(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    
    this.transitionToState(sessionId, ResizeState.COMPLETED);
    
    // 应用惯性
    if (this.config.enableInertia) {
      this.startInertia(session);
    }
    
    this.emit('resizeEnd', { session });
    this.cleanupSession(sessionId);
  }

  /**
   * 取消调整
   */
  public cancelResize(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    
    // 恢复原始尺寸
    this.applyBounds(session.element, session.startBounds);
    
    this.transitionToState(sessionId, ResizeState.CANCELLED);
    this.emit('resizeCancel', { session });
    this.cleanupSession(sessionId);
  }

  /**
   * 处理捏合缩放
   */
  public handlePinchZoom(element: HTMLElement, touch1: TouchPoint, touch2: TouchPoint): void {
    // 计算两点间距离
    const distance = Math.sqrt(
      Math.pow(touch2.x - touch1.x, 2) + Math.pow(touch2.y - touch1.y, 2)
    );
    
    if (this.lastPinchDistance !== null) {
      // 计算缩放比例
      const scale = distance / this.lastPinchDistance;
      
      // 应用缩放
      this.applyPinchZoom(element, scale, {
        x: (touch1.x + touch2.x) / 2,
        y: (touch1.y + touch2.y) / 2
      });
    }
    
    this.lastPinchDistance = distance;
  }

  /**
   * 获取活动会话
   */
  public getActiveSession(): ResizeSession | null {
    return this.activeSessionId ? this.sessions.get(this.activeSessionId) || null : null;
  }

  // ==================== 私有方法 ====================

  /**
   * 创建手柄元素
   */
  private createHandle(element: HTMLElement, position: HandlePosition): HTMLElement {
    const handle = document.createElement('div');
    handle.className = `resize-handle resize-handle-${position}`;
    handle.style.position = 'absolute';
    handle.style.width = `${this.config.handleSize}px`;
    handle.style.height = `${this.config.handleSize}px`;
    handle.style.zIndex = '1000';
    
    // 设置位置和光标
    this.setHandleStyle(handle, position);
    
    return handle;
  }

  /**
   * 设置手柄样式
   */
  private setHandleStyle(handle: HTMLElement, position: HandlePosition): void {
    const halfSize = this.config.handleSize / 2;
    
    switch (position) {
      case HandlePosition.TOP_LEFT:
        handle.style.top = `-${halfSize}px`;
        handle.style.left = `-${halfSize}px`;
        handle.style.cursor = 'nwse-resize';
        break;
      case HandlePosition.TOP:
        handle.style.top = `-${halfSize}px`;
        handle.style.left = '50%';
        handle.style.transform = 'translateX(-50%)';
        handle.style.cursor = 'ns-resize';
        break;
      case HandlePosition.TOP_RIGHT:
        handle.style.top = `-${halfSize}px`;
        handle.style.right = `-${halfSize}px`;
        handle.style.cursor = 'nesw-resize';
        break;
      case HandlePosition.RIGHT:
        handle.style.top = '50%';
        handle.style.right = `-${halfSize}px`;
        handle.style.transform = 'translateY(-50%)';
        handle.style.cursor = 'ew-resize';
        break;
      case HandlePosition.BOTTOM_RIGHT:
        handle.style.bottom = `-${halfSize}px`;
        handle.style.right = `-${halfSize}px`;
        handle.style.cursor = 'nwse-resize';
        break;
      case HandlePosition.BOTTOM:
        handle.style.bottom = `-${halfSize}px`;
        handle.style.left = '50%';
        handle.style.transform = 'translateX(-50%)';
        handle.style.cursor = 'ns-resize';
        break;
      case HandlePosition.BOTTOM_LEFT:
        handle.style.bottom = `-${halfSize}px`;
        handle.style.left = `-${halfSize}px`;
        handle.style.cursor = 'nesw-resize';
        break;
      case HandlePosition.LEFT:
        handle.style.top = '50%';
        handle.style.left = `-${halfSize}px`;
        handle.style.transform = 'translateY(-50%)';
        handle.style.cursor = 'ew-resize';
        break;
    }
  }

  /**
   * 绑定手柄事件
   */
  private bindHandleEvents(
    element: HTMLElement,
    handleMap: Map<HandlePosition, HTMLElement>,
    options: ResizeOptions
  ): void {
    for (const [position, handle] of handleMap.entries()) {
      // 鼠标事件
      handle.addEventListener('mousedown', (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        this.startResize(element, position, { x: e.clientX, y: e.clientY }, options);
      });
      
      // 触摸事件
      handle.addEventListener('touchstart', (e: TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const touch = e.touches[0];
        this.startResize(element, position, { x: touch.clientX, y: touch.clientY }, options);
      });
    }
    
    // 捏合缩放事件
    element.addEventListener('touchstart', this.handleTouchStart.bind(this));
  }

  /**
   * 计算新边界
   */
  private calculateNewBounds(session: ResizeSession, delta: { x: number; y: number }): Bounds {
    const bounds = { ...session.startBounds };
    
    switch (session.handle) {
      case HandlePosition.TOP_LEFT:
        bounds.x += delta.x;
        bounds.y += delta.y;
        bounds.width -= delta.x;
        bounds.height -= delta.y;
        break;
      case HandlePosition.TOP:
        bounds.y += delta.y;
        bounds.height -= delta.y;
        break;
      case HandlePosition.TOP_RIGHT:
        bounds.y += delta.y;
        bounds.width += delta.x;
        bounds.height -= delta.y;
        break;
      case HandlePosition.RIGHT:
        bounds.width += delta.x;
        break;
      case HandlePosition.BOTTOM_RIGHT:
        bounds.width += delta.x;
        bounds.height += delta.y;
        break;
      case HandlePosition.BOTTOM:
        bounds.height += delta.y;
        break;
      case HandlePosition.BOTTOM_LEFT:
        bounds.x += delta.x;
        bounds.width -= delta.x;
        bounds.height += delta.y;
        break;
      case HandlePosition.LEFT:
        bounds.x += delta.x;
        bounds.width -= delta.x;
        break;
    }
    
    return bounds;
  }

  /**
   * 应用约束
   */
  private applyConstraints(session: ResizeSession, bounds: Bounds): Bounds {
    let result = { ...bounds };
    
    if (!session.constraints) {
      return result;
    }
    
    // 最小尺寸约束
    if (session.constraints.minSize) {
      if (result.width < session.constraints.minSize.width) {
        result.width = session.constraints.minSize.width;
      }
      if (result.height < session.constraints.minSize.height) {
        result.height = session.constraints.minSize.height;
      }
    }
    
    // 最大尺寸约束
    if (session.constraints.maxSize) {
      if (result.width > session.constraints.maxSize.width) {
        result.width = session.constraints.maxSize.width;
      }
      if (result.height > session.constraints.maxSize.height) {
        result.height = session.constraints.maxSize.height;
      }
    }
    
    // 宽高比约束
    if (session.constraints.aspectRatio) {
      const ratio = session.constraints.aspectRatio;
      const currentRatio = result.width / result.height;
      
      if (Math.abs(currentRatio - ratio) > 0.01) {
        if (this.isHorizontalHandle(session.handle)) {
          result.height = result.width / ratio;
        } else if (this.isVerticalHandle(session.handle)) {
          result.width = result.height * ratio;
        } else {
          // 角手柄,选择变化较小的维度
          const widthChange = Math.abs(result.width - session.startBounds.width);
          const heightChange = Math.abs(result.height - session.startBounds.height);
          
          if (widthChange > heightChange) {
            result.height = result.width / ratio;
          } else {
            result.width = result.height * ratio;
          }
        }
      }
    }
    
    // 网格约束
    if (session.constraints.gridSize) {
      const grid = session.constraints.gridSize;
      result.width = Math.round(result.width / grid) * grid;
      result.height = Math.round(result.height / grid) * grid;
    }
    
    // 自定义约束
    if (session.constraints.custom) {
      const size = session.constraints.custom(
        { width: result.width, height: result.height },
        session
      );
      result.width = size.width;
      result.height = size.height;
    }
    
    return result;
  }

  /**
   * 应用边界到元素
   */
  private applyBounds(element: HTMLElement, bounds: Bounds): void {
    element.style.width = `${bounds.width}px`;
    element.style.height = `${bounds.height}px`;
    element.style.left = `${bounds.x}px`;
    element.style.top = `${bounds.y}px`;
  }

  /**
   * 应用捏合缩放
   */
  private applyPinchZoom(element: HTMLElement, scale: number, center: Position): void {
    const bounds = element.getBoundingClientRect();
    
    const newWidth = bounds.width * scale;
    const newHeight = bounds.height * scale;
    
    // 保持中心点不变
    const newX = center.x - (center.x - bounds.left) * scale;
    const newY = center.y - (center.y - bounds.top) * scale;
    
    this.applyBounds(element, {
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight
    });
    
    this.emit('pinchZoom', { element, scale, center });
  }

  /**
   * 启动惯性
   */
  private startInertia(session: ResizeSession): void {
    if (Math.abs(session.velocity.width) < 0.1 && Math.abs(session.velocity.height) < 0.1) {
      return;
    }
    
    const animate = () => {
      if (!this.sessions.has(session.id)) return;
      
      // 应用减速
      session.velocity.width *= this.config.inertiaDeceleration;
      session.velocity.height *= this.config.inertiaDeceleration;
      
      // 计算新尺寸
      const newBounds = {
        ...session.currentBounds,
        width: session.currentBounds.width + session.velocity.width / 60,
        height: session.currentBounds.height + session.velocity.height / 60
      };
      
      // 应用约束
      const constrainedBounds = this.applyConstraints(session, newBounds);
      session.currentBounds = constrainedBounds;
      
      // 应用到元素
      this.applyBounds(session.element, constrainedBounds);
      
      // 继续动画或停止
      if (Math.abs(session.velocity.width) > 0.1 || Math.abs(session.velocity.height) > 0.1) {
        const animationId = requestAnimationFrame(animate);
        this.inertiaAnimations.set(session.id, animationId);
      } else {
        this.inertiaAnimations.delete(session.id);
      }
    };
    
    animate();
  }

  /**
   * 判断是否为水平手柄
   */
  private isHorizontalHandle(handle: HandlePosition): boolean {
    return handle === HandlePosition.LEFT || handle === HandlePosition.RIGHT;
  }

  /**
   * 判断是否为垂直手柄
   */
  private isVerticalHandle(handle: HandlePosition): boolean {
    return handle === HandlePosition.TOP || handle === HandlePosition.BOTTOM;
  }

  /**
   * 状态转换
   */
  private transitionToState(sessionId: string, newState: ResizeState): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    
    const oldState = session.state;
    session.state = newState;
    
    this.emit('stateChange', { session, oldState, newState });
  }

  /**
   * 清理会话
   */
  private cleanupSession(sessionId: string): void {
    // 清理惯性动画
    const animationId = this.inertiaAnimations.get(sessionId);
    if (animationId) {
      cancelAnimationFrame(animationId);
      this.inertiaAnimations.delete(sessionId);
    }
    
    // 删除会话
    this.sessions.delete(sessionId);
    
    if (this.activeSessionId === sessionId) {
      this.activeSessionId = null;
    }
  }

  /**
   * 设置事件监听
   */
  private setupEventListeners(): void {
    // 鼠标事件
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    
    // 触摸事件
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd.bind(this));
    
    // 键盘事件
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  /**
   * 鼠标移动处理
   */
  private handleMouseMove(event: MouseEvent): void {
    if (this.activeSessionId) {
      event.preventDefault();
      this.updateResize(this.activeSessionId, {
        x: event.clientX,
        y: event.clientY
      });
    }
  }

  /**
   * 鼠标释放处理
   */
  private handleMouseUp(event: MouseEvent): void {
    if (this.activeSessionId) {
      event.preventDefault();
      this.endResize(this.activeSessionId);
    }
  }

  /**
   * 触摸开始处理
   */
  private handleTouchStart(event: TouchEvent): void {
    if (event.touches.length === 2) {
      event.preventDefault();
      this.touchStartPoints = [
        { x: event.touches[0].clientX, y: event.touches[0].clientY },
        { x: event.touches[1].clientX, y: event.touches[1].clientY }
      ];
      this.lastPinchDistance = null;
    }
  }

  /**
   * 触摸移动处理
   */
  private handleTouchMove(event: TouchEvent): void {
    if (this.activeSessionId && event.touches.length === 1) {
      event.preventDefault();
      const touch = event.touches[0];
      this.updateResize(this.activeSessionId, {
        x: touch.clientX,
        y: touch.clientY
      });
    } else if (event.touches.length === 2 && this.touchStartPoints) {
      event.preventDefault();
      const target = event.target as HTMLElement;
      this.handlePinchZoom(
        target,
        { x: event.touches[0].clientX, y: event.touches[0].clientY },
        { x: event.touches[1].clientX, y: event.touches[1].clientY }
      );
    }
  }

  /**
   * 触摸结束处理
   */
  private handleTouchEnd(event: TouchEvent): void {
    if (this.activeSessionId && event.touches.length === 0) {
      event.preventDefault();
      this.endResize(this.activeSessionId);
    }
    
    if (event.touches.length < 2) {
      this.touchStartPoints = null;
      this.lastPinchDistance = null;
    }
  }

  /**
   * 键盘按下处理
   */
  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.activeSessionId) {
      this.cancelResize(this.activeSessionId);
    }
  }

  /**
   * 生成ID
   */
  private generateId(): string {
    return `resize_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 清理
   */
  public destroy(): void {
    // 取消所有活动会话
    for (const sessionId of this.sessions.keys()) {
      this.cancelResize(sessionId);
    }
    
    // 移除所有手柄
    for (const element of this.handleElements.keys()) {
      this.removeResizable(element);
    }
    
    // 移除所有监听器
    this.removeAllListeners();
  }
}
