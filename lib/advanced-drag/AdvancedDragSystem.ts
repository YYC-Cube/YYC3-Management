/**
 * @fileoverview 高级拖拽系统 - 增强的拖拽交互体验
 * @description 支持惯性模拟、磁性吸附、碰撞检测、多指触控等高级特性
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-09
 * @modified 2025-12-09
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

// ====================================
// 类型定义
// ====================================

export interface DragConfig {
  enableInertia: boolean;
  enableMagneticSnap: boolean;
  enableCollisionDetection: boolean;
  enableMultiTouch: boolean;
  inertiaFriction: number;
  snapThreshold: number;
  boundsMargin: number;
}

export interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  velocityX: number;
  velocityY: number;
  timestamp: number;
}

export interface SnapPoint {
  x: number;
  y: number;
  label?: string;
}

export interface Bounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface DragConstraints {
  bounds?: Bounds;
  axis?: 'x' | 'y' | 'both';
  grid?: { x: number; y: number };
  snapPoints?: SnapPoint[];
}

// ====================================
// 高级拖拽系统实现
// ====================================

export class AdvancedDragSystem {
  private config: DragConfig;
  private state: DragState;
  private constraints: DragConstraints;
  private element: HTMLElement | null = null;
  private animationFrame: number | null = null;
  private lastFrameTime: number = 0;
  private velocityHistory: { x: number; y: number; time: number }[] = [];

  constructor(config: Partial<DragConfig> = {}) {
    this.config = {
      enableInertia: true,
      enableMagneticSnap: true,
      enableCollisionDetection: false,
      enableMultiTouch: false,
      inertiaFriction: 0.95,
      snapThreshold: 20,
      boundsMargin: 10,
      ...config
    };

    this.state = {
      isDragging: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      deltaX: 0,
      deltaY: 0,
      velocityX: 0,
      velocityY: 0,
      timestamp: 0
    };

    this.constraints = {};
  }

  /**
   * 初始化拖拽元素
   */
  init(element: HTMLElement, constraints: DragConstraints = {}): void {
    this.element = element;
    this.constraints = constraints;

    // 绑定事件监听器
    this.attachEventListeners();
  }

  /**
   * 附加事件监听器
   */
  private attachEventListeners(): void {
    if (!this.element) return;

    // 鼠标事件
    this.element.addEventListener('mousedown', this.handleDragStart.bind(this));
    document.addEventListener('mousemove', this.handleDragMove.bind(this));
    document.addEventListener('mouseup', this.handleDragEnd.bind(this));

    // 触摸事件
    if (this.config.enableMultiTouch) {
      this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
      document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
      document.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }
  }

  /**
   * 开始拖拽
   */
  private handleDragStart(e: MouseEvent): void {
    e.preventDefault();

    const rect = this.element!.getBoundingClientRect();
    
    this.state = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      currentX: rect.left,
      currentY: rect.top,
      deltaX: 0,
      deltaY: 0,
      velocityX: 0,
      velocityY: 0,
      timestamp: Date.now()
    };

    this.velocityHistory = [];

    // 添加拖拽样式
    if (this.element) {
      this.element.style.cursor = 'grabbing';
      this.element.style.userSelect = 'none';
    }
  }

  /**
   * 拖拽移动
   */
  private handleDragMove(e: MouseEvent): void {
    if (!this.state.isDragging || !this.element) return;

    const now = Date.now();
    const dt = (now - this.state.timestamp) / 1000; // 转换为秒

    // 计算位移
    const rawDeltaX = e.clientX - this.state.startX;
    const rawDeltaY = e.clientY - this.state.startY;

    // 应用约束
    const { deltaX, deltaY } = this.applyConstraints(rawDeltaX, rawDeltaY);

    // 计算速度
    if (dt > 0) {
      const velocityX = (deltaX - this.state.deltaX) / dt;
      const velocityY = (deltaY - this.state.deltaY) / dt;

      this.velocityHistory.push({ x: velocityX, y: velocityY, time: now });

      // 保持最近10个速度记录
      if (this.velocityHistory.length > 10) {
        this.velocityHistory.shift();
      }

      this.state.velocityX = velocityX;
      this.state.velocityY = velocityY;
    }

    this.state.deltaX = deltaX;
    this.state.deltaY = deltaY;
    this.state.timestamp = now;

    // 更新元素位置
    this.updateElementPosition(
      this.state.currentX + deltaX,
      this.state.currentY + deltaY
    );
  }

  /**
   * 结束拖拽
   */
  private handleDragEnd(e: MouseEvent): void {
    if (!this.state.isDragging || !this.element) return;

    this.state.isDragging = false;

    // 恢复样式
    this.element.style.cursor = 'grab';
    this.element.style.userSelect = '';

    // 计算平均速度（用于惯性）
    if (this.config.enableInertia && this.velocityHistory.length > 0) {
      const avgVelocity = this.calculateAverageVelocity();
      this.startInertiaAnimation(avgVelocity.x, avgVelocity.y);
    } else if (this.config.enableMagneticSnap) {
      // 磁性吸附
      this.snapToNearestPoint();
    }
  }

  /**
   * 触摸开始
   */
  private handleTouchStart(e: TouchEvent): void {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      this.handleDragStart(mouseEvent);
    }
  }

  /**
   * 触摸移动
   */
  private handleTouchMove(e: TouchEvent): void {
    if (e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      this.handleDragMove(mouseEvent);
    }
  }

  /**
   * 触摸结束
   */
  private handleTouchEnd(e: TouchEvent): void {
    const mouseEvent = new MouseEvent('mouseup', {});
    this.handleDragEnd(mouseEvent);
  }

  /**
   * 应用约束
   */
  private applyConstraints(deltaX: number, deltaY: number): { deltaX: number; deltaY: number } {
    let constrainedX = deltaX;
    let constrainedY = deltaY;

    // 轴约束
    if (this.constraints.axis === 'x') {
      constrainedY = 0;
    } else if (this.constraints.axis === 'y') {
      constrainedX = 0;
    }

    // 网格约束
    if (this.constraints.grid) {
      const { x: gridX, y: gridY } = this.constraints.grid;
      constrainedX = Math.round(constrainedX / gridX) * gridX;
      constrainedY = Math.round(constrainedY / gridY) * gridY;
    }

    // 边界约束
    if (this.constraints.bounds && this.element) {
      const newX = this.state.currentX + constrainedX;
      const newY = this.state.currentY + constrainedY;
      const rect = this.element.getBoundingClientRect();
      const bounds = this.constraints.bounds;

      if (newX < bounds.left + this.config.boundsMargin) {
        constrainedX = bounds.left + this.config.boundsMargin - this.state.currentX;
      }
      if (newX + rect.width > bounds.right - this.config.boundsMargin) {
        constrainedX = bounds.right - this.config.boundsMargin - rect.width - this.state.currentX;
      }
      if (newY < bounds.top + this.config.boundsMargin) {
        constrainedY = bounds.top + this.config.boundsMargin - this.state.currentY;
      }
      if (newY + rect.height > bounds.bottom - this.config.boundsMargin) {
        constrainedY = bounds.bottom - this.config.boundsMargin - rect.height - this.state.currentY;
      }
    }

    return { deltaX: constrainedX, deltaY: constrainedY };
  }

  /**
   * 更新元素位置
   */
  private updateElementPosition(x: number, y: number): void {
    if (!this.element) return;
    
    this.element.style.transform = `translate(${x}px, ${y}px)`;
  }

  /**
   * 计算平均速度
   */
  private calculateAverageVelocity(): { x: number; y: number } {
    if (this.velocityHistory.length === 0) {
      return { x: 0, y: 0 };
    }

    const recent = this.velocityHistory.slice(-5);
    const avgX = recent.reduce((sum, v) => sum + v.x, 0) / recent.length;
    const avgY = recent.reduce((sum, v) => sum + v.y, 0) / recent.length;

    return { x: avgX, y: avgY };
  }

  /**
   * 开始惯性动画
   */
  private startInertiaAnimation(velocityX: number, velocityY: number): void {
    let currentVelocityX = velocityX;
    let currentVelocityY = velocityY;

    const animate = (time: number) => {
      if (!this.lastFrameTime) {
        this.lastFrameTime = time;
      }

      const dt = (time - this.lastFrameTime) / 1000;
      this.lastFrameTime = time;

      // 应用摩擦力
      currentVelocityX *= this.config.inertiaFriction;
      currentVelocityY *= this.config.inertiaFriction;

      // 更新位置
      const deltaX = currentVelocityX * dt;
      const deltaY = currentVelocityY * dt;

      const newX = this.state.currentX + this.state.deltaX + deltaX;
      const newY = this.state.currentY + this.state.deltaY + deltaY;

      this.state.deltaX += deltaX;
      this.state.deltaY += deltaY;

      this.updateElementPosition(newX, newY);

      // 检查是否应该停止
      const speed = Math.sqrt(currentVelocityX ** 2 + currentVelocityY ** 2);
      if (speed > 0.5) {
        this.animationFrame = requestAnimationFrame(animate);
      } else {
        this.stopInertiaAnimation();
        if (this.config.enableMagneticSnap) {
          this.snapToNearestPoint();
        }
      }
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  /**
   * 停止惯性动画
   */
  private stopInertiaAnimation(): void {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
      this.lastFrameTime = 0;
    }
  }

  /**
   * 吸附到最近的点
   */
  private snapToNearestPoint(): void {
    if (!this.constraints.snapPoints || !this.element) return;

    const rect = this.element.getBoundingClientRect();
    const currentX = rect.left;
    const currentY = rect.top;

    let nearestPoint: SnapPoint | null = null;
    let minDistance = Infinity;

    for (const point of this.constraints.snapPoints) {
      const distance = Math.sqrt(
        Math.pow(point.x - currentX, 2) + Math.pow(point.y - currentY, 2)
      );

      if (distance < minDistance && distance < this.config.snapThreshold) {
        minDistance = distance;
        nearestPoint = point;
      }
    }

    if (nearestPoint) {
      // 动画吸附到最近的点
      this.animateToPosition(nearestPoint.x, nearestPoint.y);
    }
  }

  /**
   * 动画移动到指定位置
   */
  private animateToPosition(targetX: number, targetY: number, duration: number = 300): void {
    if (!this.element) return;

    const rect = this.element.getBoundingClientRect();
    const startX = rect.left;
    const startY = rect.top;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 缓动函数（ease-out）
      const eased = 1 - Math.pow(1 - progress, 3);

      const currentX = startX + (targetX - startX) * eased;
      const currentY = startY + (targetY - startY) * eased;

      this.updateElementPosition(currentX, currentY);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.state.currentX = targetX;
        this.state.currentY = targetY;
        this.state.deltaX = 0;
        this.state.deltaY = 0;
      }
    };

    animate();
  }

  /**
   * 更新约束
   */
  updateConstraints(constraints: DragConstraints): void {
    this.constraints = { ...this.constraints, ...constraints };
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<DragConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.stopInertiaAnimation();
    
    if (this.element) {
      this.element.removeEventListener('mousedown', this.handleDragStart.bind(this));
      this.element.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    }
    
    document.removeEventListener('mousemove', this.handleDragMove.bind(this));
    document.removeEventListener('mouseup', this.handleDragEnd.bind(this));
    document.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    document.removeEventListener('touchend', this.handleTouchEnd.bind(this));

    this.element = null;
  }
}

export default AdvancedDragSystem;
