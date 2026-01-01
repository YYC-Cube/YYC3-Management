/**
 * DragManager - 拖拽管理系统
 * 
 * 提供流畅、自然、跨平台的拖拽体验，支持：
 * - 多指触控
 * - 惯性拖拽
 * - 拖拽约束
 * - 拖拽手柄
 * - 拖拽预览
 * 
 * @author YYC³ AI开发团队
 * @version 1.0.0
 * @standard YYC³团队标准化规范 v1.1.0
 */

import { EventEmitter } from 'events';

// ==================== 类型定义 ====================

/**
 * 拖拽状态
 */
export enum DragState {
  IDLE = 'idle',
  PREPARING = 'preparing',
  DRAGGING = 'dragging',
  DROPPING = 'dropping',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

/**
 * 位置坐标
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * 速度向量
 */
export interface Velocity {
  x: number;
  y: number;
}

/**
 * 拖拽约束
 */
export interface DragConstraints {
  /** 约束函数名称 */
  function?: string;
  /** 边界约束 */
  boundary?: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  /** 网格约束 */
  grid?: {
    size: number;
    origin?: Position;
  };
  /** 自定义约束函数 */
  custom?: (position: Position, session: DragSession) => Position;
}

/**
 * 拖拽会话
 */
export interface DragSession {
  id: string;
  state: DragState;
  source: DragSource;
  data: any;
  position: Position;
  startPosition: Position;
  startTime: Date;
  lastUpdated: Date;
  velocity: Velocity;
  constraints?: DragConstraints;
  dropTarget?: DropTarget | null;
  element?: HTMLElement;
}

/**
 * 拖拽源接口
 */
export interface DragSource {
  /** 获取拖拽数据 */
  getData(): any;
  /** 获取初始位置 */
  getInitialPosition(): Position;
  /** 获取元素 */
  getElement(): HTMLElement;
  /** 拖拽开始回调 */
  onDragStart?(session: DragSession): void;
  /** 拖拽结束回调 */
  onDragEnd?(session: DragSession): void;
  /** 拖拽取消回调 */
  onDragCancel?(session: DragSession): void;
}

/**
 * 放置目标接口
 */
export interface DropTarget {
  /** 判断点是否在目标内 */
  contains(point: Position): boolean;
  /** 放置数据 */
  onDrop(data: any, position: Position): Promise<boolean>;
  /** 拖拽进入回调 */
  onDragEnter?(session: DragSession): void;
  /** 拖拽离开回调 */
  onDragLeave?(session: DragSession): void;
  /** 拖拽悬停回调 */
  onDragOver?(session: DragSession): void;
}

/**
 * 拖拽选项
 */
export interface DragOptions {
  /** 触发方式 */
  trigger?: 'immediate' | 'longPress' | 'drag';
  /** 约束条件 */
  constraints?: DragConstraints;
  /** 是否启用惯性 */
  enableInertia?: boolean;
  /** 拖拽手柄 */
  handle?: HTMLElement;
}

/**
 * 拖拽管理器配置
 */
export interface DragManagerConfig {
  /** 拖拽阈值（像素） */
  dragThreshold: number;
  /** 长按时长（毫秒） */
  longPressDuration: number;
  /** 惯性减速度 */
  inertiaDeceleration: number;
  /** 默认约束 */
  defaultConstraint: string;
  /** 启用惯性 */
  enableInertia: boolean;
  /** 启用拖拽预览 */
  enablePreview: boolean;
}

/**
 * 约束函数类型
 */
export type ConstraintFunction = (position: Position, session: DragSession) => Position;

// ==================== 主类实现 ====================

/**
 * 拖拽管理器
 */
export class DragManager extends EventEmitter {
  private config: DragManagerConfig;
  private sessions: Map<string, DragSession>;
  private activeSessionId: string | null;
  private constraintFunctions: Map<string, ConstraintFunction>;
  private dropTargets: Set<DropTarget>;
  private longPressTimers: Map<string, NodeJS.Timeout>;
  private inertiaAnimations: Map<string, number>;
  
  constructor(config: Partial<DragManagerConfig> = {}) {
    super();
    
    this.config = {
      dragThreshold: 5,
      longPressDuration: 500,
      inertiaDeceleration: 0.95,
      defaultConstraint: 'none',
      enableInertia: true,
      enablePreview: true,
      ...config
    };
    
    this.sessions = new Map();
    this.activeSessionId = null;
    this.constraintFunctions = new Map();
    this.dropTargets = new Set();
    this.longPressTimers = new Map();
    this.inertiaAnimations = new Map();
    
    this.registerBuiltinConstraints();
    this.setupEventListeners();
  }

  // ==================== 公共API ====================

  /**
   * 开始拖拽
   */
  public startDrag(source: DragSource, data: any, options: DragOptions = {}): string {
    const sessionId = this.generateId();
    
    const session: DragSession = {
      id: sessionId,
      state: DragState.PREPARING,
      source,
      data,
      position: source.getInitialPosition(),
      startPosition: source.getInitialPosition(),
      startTime: new Date(),
      lastUpdated: new Date(),
      velocity: { x: 0, y: 0 },
      constraints: options.constraints,
      dropTarget: null,
      element: source.getElement()
    };
    
    this.sessions.set(sessionId, session);
    this.activeSessionId = sessionId;
    
    // 触发开始事件
    this.emit('dragStart', { session });
    
    // 调用源的回调
    if (source.onDragStart) {
      source.onDragStart(session);
    }
    
    // 根据触发方式处理
    if (options.trigger === 'immediate') {
      this.transitionToState(sessionId, DragState.DRAGGING);
    } else if (options.trigger === 'longPress') {
      this.startLongPressTimer(sessionId);
    }
    
    return sessionId;
  }

  /**
   * 更新拖拽位置
   */
  public updateDrag(sessionId: string, newPosition: Position): void {
    const session = this.sessions.get(sessionId);
    if (!session || session.state !== DragState.DRAGGING) return;
    
    // 计算速度
    const now = new Date();
    const deltaTime = now.getTime() - session.lastUpdated.getTime();
    if (deltaTime > 0) {
      const deltaX = newPosition.x - session.position.x;
      const deltaY = newPosition.y - session.position.y;
      session.velocity = {
        x: deltaX / deltaTime * 1000, // 转换为像素/秒
        y: deltaY / deltaTime * 1000
      };
    }
    
    // 应用约束
    const constrainedPosition = this.applyConstraints(session, newPosition);
    
    // 更新会话
    const oldPosition = session.position;
    session.position = constrainedPosition;
    session.lastUpdated = now;
    
    // 检测放置目标
    this.updateDropTarget(session);
    
    // 发出更新事件
    this.emit('dragMove', { 
      session, 
      position: constrainedPosition,
      delta: {
        x: constrainedPosition.x - oldPosition.x,
        y: constrainedPosition.y - oldPosition.y
      }
    });
    
    // 更新元素位置
    if (session.element) {
      this.updateElementPosition(session.element, constrainedPosition);
    }
  }

  /**
   * 结束拖拽
   */
  public endDrag(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    
    if (session.state === DragState.DRAGGING) {
      this.drop(sessionId);
    } else {
      this.cancelDrag(sessionId);
    }
  }

  /**
   * 取消拖拽
   */
  public cancelDrag(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    
    this.transitionToState(sessionId, DragState.CANCELLED);
    
    // 调用源的回调
    if (session.source.onDragCancel) {
      session.source.onDragCancel(session);
    }
    
    this.emit('dragCancel', { session });
    this.cleanupSession(sessionId);
  }

  /**
   * 注册放置目标
   */
  public registerDropTarget(target: DropTarget): void {
    this.dropTargets.add(target);
  }

  /**
   * 注销放置目标
   */
  public unregisterDropTarget(target: DropTarget): void {
    this.dropTargets.delete(target);
  }

  /**
   * 注册约束函数
   */
  public registerConstraint(name: string, fn: ConstraintFunction): void {
    this.constraintFunctions.set(name, fn);
  }

  /**
   * 获取活动会话
   */
  public getActiveSession(): DragSession | null {
    return this.activeSessionId ? this.sessions.get(this.activeSessionId) || null : null;
  }

  // ==================== 私有方法 ====================

  /**
   * 放置操作
   */
  private async drop(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    
    this.transitionToState(sessionId, DragState.DROPPING);
    
    try {
      if (session.dropTarget) {
        const success = await session.dropTarget.onDrop(session.data, session.position);
        
        if (success) {
          this.transitionToState(sessionId, DragState.COMPLETED);
          this.emit('dropSuccess', { session, dropTarget: session.dropTarget });
        } else {
          throw new Error('Drop rejected by target');
        }
      } else {
        // 没有放置目标，应用惯性
        if (this.config.enableInertia) {
          this.startInertia(session);
        }
        this.transitionToState(sessionId, DragState.COMPLETED);
      }
      
      // 调用源的回调
      if (session.source.onDragEnd) {
        session.source.onDragEnd(session);
      }
    } catch (error) {
      this.cancelDrag(sessionId);
    } finally {
      this.cleanupSession(sessionId);
    }
  }

  /**
   * 状态转换
   */
  private transitionToState(sessionId: string, newState: DragState): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    
    const oldState = session.state;
    session.state = newState;
    
    this.emit('stateChange', { session, oldState, newState });
  }

  /**
   * 应用约束
   */
  private applyConstraints(session: DragSession, position: Position): Position {
    let result = { ...position };
    
    if (!session.constraints) {
      return result;
    }
    
    // 应用约束函数
    if (session.constraints.function) {
      const fn = this.constraintFunctions.get(session.constraints.function);
      if (fn) {
        result = fn(result, session);
      }
    }
    
    // 应用自定义约束
    if (session.constraints.custom) {
      result = session.constraints.custom(result, session);
    }
    
    // 应用边界约束
    if (session.constraints.boundary) {
      const b = session.constraints.boundary;
      result.x = Math.max(b.left, Math.min(result.x, b.right));
      result.y = Math.max(b.top, Math.min(result.y, b.bottom));
    }
    
    // 应用网格约束
    if (session.constraints.grid) {
      const grid = session.constraints.grid;
      const origin = grid.origin || { x: 0, y: 0 };
      result.x = Math.round((result.x - origin.x) / grid.size) * grid.size + origin.x;
      result.y = Math.round((result.y - origin.y) / grid.size) * grid.size + origin.y;
    }
    
    return result;
  }

  /**
   * 更新放置目标
   */
  private updateDropTarget(session: DragSession): void {
    const oldTarget = session.dropTarget;
    let newTarget: DropTarget | null = null;
    
    // 查找包含当前位置的放置目标
    for (const target of this.dropTargets) {
      if (target.contains(session.position)) {
        newTarget = target;
        break;
      }
    }
    
    // 如果目标改变
    if (oldTarget !== newTarget) {
      if (oldTarget && oldTarget.onDragLeave) {
        oldTarget.onDragLeave(session);
      }
      
      if (newTarget && newTarget.onDragEnter) {
        newTarget.onDragEnter(session);
      }
      
      session.dropTarget = newTarget;
      this.emit('dropTargetChange', { session, oldTarget, newTarget });
    } else if (newTarget && newTarget.onDragOver) {
      newTarget.onDragOver(session);
    }
  }

  /**
   * 启动惯性动画
   */
  private startInertia(session: DragSession): void {
    if (Math.abs(session.velocity.x) < 0.1 && Math.abs(session.velocity.y) < 0.1) {
      return;
    }
    
    const animate = () => {
      if (!this.sessions.has(session.id)) return;
      
      // 应用减速
      session.velocity.x *= this.config.inertiaDeceleration;
      session.velocity.y *= this.config.inertiaDeceleration;
      
      // 更新位置
      const newPosition = {
        x: session.position.x + session.velocity.x / 60, // 60fps
        y: session.position.y + session.velocity.y / 60
      };
      
      // 应用约束
      const constrainedPosition = this.applyConstraints(session, newPosition);
      session.position = constrainedPosition;
      
      // 更新元素
      if (session.element) {
        this.updateElementPosition(session.element, constrainedPosition);
      }
      
      // 继续动画或停止
      if (Math.abs(session.velocity.x) > 0.1 || Math.abs(session.velocity.y) > 0.1) {
        const animationId = requestAnimationFrame(animate);
        this.inertiaAnimations.set(session.id, animationId);
      } else {
        this.inertiaAnimations.delete(session.id);
      }
    };
    
    animate();
  }

  /**
   * 启动长按计时器
   */
  private startLongPressTimer(sessionId: string): void {
    const timer = setTimeout(() => {
      this.transitionToState(sessionId, DragState.DRAGGING);
      this.longPressTimers.delete(sessionId);
    }, this.config.longPressDuration);
    
    this.longPressTimers.set(sessionId, timer);
  }

  /**
   * 清理会话
   */
  private cleanupSession(sessionId: string): void {
    // 清理长按计时器
    const timer = this.longPressTimers.get(sessionId);
    if (timer) {
      clearTimeout(timer);
      this.longPressTimers.delete(sessionId);
    }
    
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
   * 更新元素位置
   */
  private updateElementPosition(element: HTMLElement, position: Position): void {
    element.style.transform = `translate(${position.x}px, ${position.y}px)`;
  }

  /**
   * 注册内置约束
   */
  private registerBuiltinConstraints(): void {
    // 无约束
    this.registerConstraint('none', (pos) => pos);
    
    // 水平约束
    this.registerConstraint('horizontal', (pos, session) => ({
      x: pos.x,
      y: session.startPosition.y
    }));
    
    // 垂直约束
    this.registerConstraint('vertical', (pos, session) => ({
      x: session.startPosition.x,
      y: pos.y
    }));
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
      this.updateDrag(this.activeSessionId, {
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
      this.endDrag(this.activeSessionId);
    }
  }

  /**
   * 触摸移动处理
   */
  private handleTouchMove(event: TouchEvent): void {
    if (this.activeSessionId && event.touches.length > 0) {
      event.preventDefault();
      const touch = event.touches[0];
      this.updateDrag(this.activeSessionId, {
        x: touch.clientX,
        y: touch.clientY
      });
    }
  }

  /**
   * 触摸结束处理
   */
  private handleTouchEnd(event: TouchEvent): void {
    if (this.activeSessionId) {
      event.preventDefault();
      this.endDrag(this.activeSessionId);
    }
  }

  /**
   * 键盘按下处理
   */
  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.activeSessionId) {
      this.cancelDrag(this.activeSessionId);
    }
  }

  /**
   * 生成ID
   */
  private generateId(): string {
    return `drag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 清理
   */
  public destroy(): void {
    // 取消所有活动会话
    for (const sessionId of this.sessions.keys()) {
      this.cancelDrag(sessionId);
    }
    
    // 移除所有监听器
    this.removeAllListeners();
  }
}
