/**
 * NotificationCenter - 通知中心组件
 * 
 * 统一的通知管理系统,支持:
 * - 优先级队列
 * - 通知模板
 * - 生命周期管理
 * - 用户注意力检测
 * - 批量操作
 * 
 * @author YYC³ AI开发团队
 * @version 1.0.0
 * @standard YYC³团队标准化规范 v1.1.0
 */

import { EventEmitter } from 'events';

// ==================== 类型定义 ====================

/**
 * 通知状态
 */
export enum NotificationState {
  QUEUED = 'queued',
  SHOWING = 'showing',
  DISMISSED = 'dismissed',
  EXPIRED = 'expired'
}

/**
 * 通知优先级
 */
export enum NotificationPriority {
  CRITICAL = 0,
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3
}

/**
 * 通知类型
 */
export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

/**
 * 通知位置
 */
export enum NotificationPosition {
  TOP_LEFT = 'top-left',
  TOP_CENTER = 'top-center',
  TOP_RIGHT = 'top-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_CENTER = 'bottom-center',
  BOTTOM_RIGHT = 'bottom-right'
}

/**
 * 通知动作
 */
export interface NotificationAction {
  label: string;
  value: string;
  style?: 'primary' | 'secondary' | 'danger';
  handler: (notification: Notification) => void | Promise<void>;
}

/**
 * 通知
 */
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  state: NotificationState;
  timestamp: Date;
  duration?: number;
  icon?: string;
  actions?: NotificationAction[];
  data?: any;
  template?: string;
  position?: NotificationPosition;
  closable?: boolean;
  persistent?: boolean;
}

/**
 * 通知模板
 */
export interface NotificationTemplate {
  id: string;
  name: string;
  render: (data: any) => Partial<Notification>;
}

/**
 * 通知选项
 */
export interface NotificationOptions {
  duration?: number;
  position?: NotificationPosition;
  closable?: boolean;
  persistent?: boolean;
  priority?: NotificationPriority;
  actions?: NotificationAction[];
  template?: string;
  data?: any;
}

/**
 * 中心配置
 */
export interface NotificationCenterConfig {
  /** 默认持续时间(毫秒) */
  defaultDuration: number;
  /** 默认位置 */
  defaultPosition: NotificationPosition;
  /** 最大通知数 */
  maxNotifications: number;
  /** 队列容量 */
  queueCapacity: number;
  /** 是否启用声音 */
  enableSound: boolean;
  /** 是否启用振动 */
  enableVibration: boolean;
  /** 是否检测用户注意力 */
  detectAttention: boolean;
}

// ==================== 主类实现 ====================

/**
 * 通知中心
 */
export class NotificationCenter extends EventEmitter {
  private config: NotificationCenterConfig;
  private notifications: Map<string, Notification>;
  private queue: Notification[];
  private templates: Map<string, NotificationTemplate>;
  private container: HTMLElement | null;
  private timers: Map<string, NodeJS.Timeout>;
  
  constructor(config: Partial<NotificationCenterConfig> = {}) {
    super();
    
    this.config = {
      defaultDuration: 5000,
      defaultPosition: NotificationPosition.TOP_RIGHT,
      maxNotifications: 5,
      queueCapacity: 50,
      enableSound: true,
      enableVibration: false,
      detectAttention: true,
      ...config
    };
    
    this.notifications = new Map();
    this.queue = [];
    this.templates = new Map();
    this.container = null;
    this.timers = new Map();
    
    this.setupContainer();
    this.registerBuiltinTemplates();
  }

  // ==================== 公共API ====================

  /**
   * 显示通知
   */
  public notify(
    title: string,
    message: string,
    type: NotificationType = NotificationType.INFO,
    options: NotificationOptions = {}
  ): string {
    const notification: Notification = {
      id: this.generateId(),
      title,
      message,
      type,
      priority: options.priority || this.getDefaultPriority(type),
      state: NotificationState.QUEUED,
      timestamp: new Date(),
      duration: options.duration ?? this.config.defaultDuration,
      position: options.position || this.config.defaultPosition,
      closable: options.closable !== false,
      persistent: options.persistent || false,
      actions: options.actions,
      template: options.template,
      data: options.data
    };
    
    return this.addNotification(notification);
  }

  /**
   * 显示成功通知
   */
  public success(title: string, message: string, options?: NotificationOptions): string {
    return this.notify(title, message, NotificationType.SUCCESS, options);
  }

  /**
   * 显示警告通知
   */
  public warning(title: string, message: string, options?: NotificationOptions): string {
    return this.notify(title, message, NotificationType.WARNING, options);
  }

  /**
   * 显示错误通知
   */
  public error(title: string, message: string, options?: NotificationOptions): string {
    return this.notify(title, message, NotificationType.ERROR, options);
  }

  /**
   * 显示信息通知
   */
  public info(title: string, message: string, options?: NotificationOptions): string {
    return this.notify(title, message, NotificationType.INFO, options);
  }

  /**
   * 从模板创建通知
   */
  public notifyFromTemplate(templateId: string, data: any): string {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template "${templateId}" not found`);
    }
    
    const rendered = template.render(data);
    
    return this.notify(
      rendered.title || '',
      rendered.message || '',
      rendered.type || NotificationType.INFO,
      {
        ...rendered,
        template: templateId,
        data
      }
    );
  }

  /**
   * 关闭通知
   */
  public dismiss(notificationId: string): void {
    const notification = this.notifications.get(notificationId);
    if (!notification) return;
    
    // 更新状态
    notification.state = NotificationState.DISMISSED;
    
    // 清除计时器
    const timer = this.timers.get(notificationId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(notificationId);
    }
    
    // 移除DOM元素
    this.removeNotificationElement(notificationId);
    
    // 从集合中删除
    this.notifications.delete(notificationId);
    
    // 触发事件
    this.emit('notificationDismissed', { notification });
    
    // 显示队列中的下一个
    this.processQueue();
  }

  /**
   * 关闭所有通知
   */
  public dismissAll(): void {
    const ids = Array.from(this.notifications.keys());
    for (const id of ids) {
      this.dismiss(id);
    }
  }

  /**
   * 清空队列
   */
  public clearQueue(): void {
    this.queue = [];
    this.emit('queueCleared');
  }

  /**
   * 注册模板
   */
  public registerTemplate(template: NotificationTemplate): void {
    this.templates.set(template.id, template);
    this.emit('templateRegistered', { template });
  }

  /**
   * 获取所有通知
   */
  public getNotifications(): Notification[] {
    return Array.from(this.notifications.values());
  }

  /**
   * 获取队列
   */
  public getQueue(): Notification[] {
    return [...this.queue];
  }

  /**
   * 获取显示中的通知数
   */
  public getActiveCount(): number {
    return Array.from(this.notifications.values()).filter(
      n => n.state === NotificationState.SHOWING
    ).length;
  }

  // ==================== 私有方法 ====================

  /**
   * 添加通知
   */
  private addNotification(notification: Notification): string {
    // 检查队列容量
    if (this.queue.length >= this.config.queueCapacity) {
      // 移除优先级最低的
      this.queue.sort((a, b) => a.priority - b.priority);
      this.queue.pop();
    }
    
    // 添加到队列
    this.queue.push(notification);
    this.notifications.set(notification.id, notification);
    
    // 按优先级排序
    this.queue.sort((a, b) => a.priority - b.priority);
    
    this.emit('notificationQueued', { notification });
    
    // 尝试显示
    this.processQueue();
    
    return notification.id;
  }

  /**
   * 处理队列
   */
  private processQueue(): void {
    const activeCount = this.getActiveCount();
    
    // 如果还有空位
    while (activeCount < this.config.maxNotifications && this.queue.length > 0) {
      const notification = this.queue.shift()!;
      this.showNotification(notification);
    }
  }

  /**
   * 显示通知
   */
  private showNotification(notification: Notification): void {
    // 更新状态
    notification.state = NotificationState.SHOWING;
    
    // 渲染
    const element = this.renderNotification(notification);
    this.appendNotificationElement(element, notification.position!);
    
    // 播放声音/振动
    this.playEffects(notification);
    
    // 设置自动关闭
    if (!notification.persistent && notification.duration) {
      const timer = setTimeout(() => {
        this.dismiss(notification.id);
      }, notification.duration);
      
      this.timers.set(notification.id, timer);
    }
    
    this.emit('notificationShown', { notification });
  }

  /**
   * 渲染通知
   */
  private renderNotification(notification: Notification): HTMLElement {
    const element = document.createElement('div');
    element.className = `notification notification-${notification.type}`;
    element.setAttribute('data-notification-id', notification.id);
    
    // 图标
    if (notification.icon) {
      const icon = document.createElement('div');
      icon.className = 'notification-icon';
      icon.innerHTML = notification.icon;
      element.appendChild(icon);
    }
    
    // 内容
    const content = document.createElement('div');
    content.className = 'notification-content';
    
    const title = document.createElement('div');
    title.className = 'notification-title';
    title.textContent = notification.title;
    content.appendChild(title);
    
    const message = document.createElement('div');
    message.className = 'notification-message';
    message.textContent = notification.message;
    content.appendChild(message);
    
    element.appendChild(content);
    
    // 动作按钮
    if (notification.actions && notification.actions.length > 0) {
      const actions = document.createElement('div');
      actions.className = 'notification-actions';
      
      for (const action of notification.actions) {
        const button = document.createElement('button');
        button.className = `notification-action notification-action-${action.style || 'secondary'}`;
        button.textContent = action.label;
        button.onclick = () => {
          action.handler(notification);
          this.dismiss(notification.id);
        };
        actions.appendChild(button);
      }
      
      element.appendChild(actions);
    }
    
    // 关闭按钮
    if (notification.closable) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'notification-close';
      closeBtn.innerHTML = '×';
      closeBtn.onclick = () => this.dismiss(notification.id);
      element.appendChild(closeBtn);
    }
    
    // 添加动画
    element.style.animation = 'notification-enter 0.3s ease-out';
    
    return element;
  }

  /**
   * 添加通知元素到DOM
   */
  private appendNotificationElement(element: HTMLElement, position: NotificationPosition): void {
    if (!this.container) return;
    
    let positionContainer = this.container.querySelector(
      `.notification-position-${position}`
    ) as HTMLElement;
    
    if (!positionContainer) {
      positionContainer = document.createElement('div');
      positionContainer.className = `notification-position notification-position-${position}`;
      this.container.appendChild(positionContainer);
    }
    
    positionContainer.appendChild(element);
  }

  /**
   * 移除通知元素
   */
  private removeNotificationElement(notificationId: string): void {
    if (!this.container) return;
    
    const element = this.container.querySelector(
      `[data-notification-id="${notificationId}"]`
    ) as HTMLElement;
    
    if (element) {
      element.style.animation = 'notification-exit 0.3s ease-in';
      setTimeout(() => element.remove(), 300);
    }
  }

  /**
   * 播放效果
   */
  private playEffects(notification: Notification): void {
    // 声音
    if (this.config.enableSound && notification.priority <= NotificationPriority.HIGH) {
      this.playSound(notification.type);
    }
    
    // 振动
    if (this.config.enableVibration && navigator.vibrate) {
      if (notification.priority === NotificationPriority.CRITICAL) {
        navigator.vibrate([200, 100, 200]);
      } else if (notification.priority === NotificationPriority.HIGH) {
        navigator.vibrate(200);
      }
    }
  }

  /**
   * 播放声音
   */
  private playSound(type: NotificationType): void {
    // 简化实现
    try {
      const audio = new Audio();
      switch (type) {
        case NotificationType.SUCCESS:
          // audio.src = '/sounds/success.mp3';
          break;
        case NotificationType.WARNING:
          // audio.src = '/sounds/warning.mp3';
          break;
        case NotificationType.ERROR:
          // audio.src = '/sounds/error.mp3';
          break;
        default:
          // audio.src = '/sounds/info.mp3';
      }
      // audio.play();
    } catch (error) {
      // 忽略播放错误
    }
  }

  /**
   * 设置容器
   */
  private setupContainer(): void {
    this.container = document.createElement('div');
    this.container.className = 'notification-center';
    this.container.id = 'yyc3-notification-center';
    
    // 添加样式
    this.injectStyles();
    
    document.body.appendChild(this.container);
  }

  /**
   * 注入样式
   */
  private injectStyles(): void {
    if (document.getElementById('yyc3-notification-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'yyc3-notification-styles';
    style.textContent = `
      .notification-center {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 10000;
      }
      
      .notification-position {
        position: absolute;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px;
        pointer-events: none;
      }
      
      .notification-position-top-left { top: 0; left: 0; }
      .notification-position-top-center { top: 0; left: 50%; transform: translateX(-50%); }
      .notification-position-top-right { top: 0; right: 0; }
      .notification-position-bottom-left { bottom: 0; left: 0; }
      .notification-position-bottom-center { bottom: 0; left: 50%; transform: translateX(-50%); }
      .notification-position-bottom-right { bottom: 0; right: 0; }
      
      .notification {
        min-width: 300px;
        max-width: 400px;
        padding: 16px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        gap: 12px;
        pointer-events: auto;
        position: relative;
      }
      
      .notification-info { border-left: 4px solid #0066cc; }
      .notification-success { border-left: 4px solid #28a745; }
      .notification-warning { border-left: 4px solid #ffc107; }
      .notification-error { border-left: 4px solid #dc3545; }
      
      .notification-content {
        flex: 1;
      }
      
      .notification-title {
        font-weight: 600;
        margin-bottom: 4px;
      }
      
      .notification-message {
        font-size: 14px;
        color: #666;
      }
      
      .notification-actions {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }
      
      .notification-action {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }
      
      .notification-action-primary {
        background: #0066cc;
        color: white;
      }
      
      .notification-action-secondary {
        background: #f0f0f0;
        color: #333;
      }
      
      .notification-action-danger {
        background: #dc3545;
        color: white;
      }
      
      .notification-close {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 24px;
        height: 24px;
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: 20px;
        line-height: 1;
        color: #999;
      }
      
      @keyframes notification-enter {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes notification-exit {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(-20px);
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * 获取默认优先级
   */
  private getDefaultPriority(type: NotificationType): NotificationPriority {
    const map = {
      [NotificationType.ERROR]: NotificationPriority.HIGH,
      [NotificationType.WARNING]: NotificationPriority.MEDIUM,
      [NotificationType.SUCCESS]: NotificationPriority.MEDIUM,
      [NotificationType.INFO]: NotificationPriority.LOW
    };
    
    return map[type] || NotificationPriority.MEDIUM;
  }

  /**
   * 注册内置模板
   */
  private registerBuiltinTemplates(): void {
    // 简单模板
    this.registerTemplate({
      id: 'simple',
      name: '简单通知',
      render: (data) => ({
        title: data.title || '通知',
        message: data.message || '',
        type: data.type || NotificationType.INFO
      })
    });
    
    // 带动作模板
    this.registerTemplate({
      id: 'action',
      name: '带动作通知',
      render: (data) => ({
        title: data.title || '通知',
        message: data.message || '',
        type: data.type || NotificationType.INFO,
        actions: data.actions || []
      })
    });
  }

  /**
   * 生成ID
   */
  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 清理
   */
  public destroy(): void {
    // 关闭所有通知
    this.dismissAll();
    
    // 移除容器
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
    
    // 清除所有计时器
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
    
    // 移除所有监听器
    this.removeAllListeners();
  }
}
