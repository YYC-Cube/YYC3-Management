/**
 * AnalyticsTracker - 用户行为分析追踪器
 * 
 * 数据驱动决策系统,提供:
 * - 用户行为追踪
 * - 事件分析
 * - 漏斗分析
 * - 用户画像
 * - 实时数据分析
 * 
 * @author YYC³ AI开发团队
 * @version 1.0.0
 * @standard YYC³团队标准化规范 v1.1.0
 */

import { EventEmitter } from 'events';

// ==================== 类型定义 ====================

/**
 * 事件类型
 */
export enum EventType {
  PAGE_VIEW = 'page_view',
  CLICK = 'click',
  FORM_SUBMIT = 'form_submit',
  ERROR = 'error',
  PERFORMANCE = 'performance',
  CUSTOM = 'custom'
}

/**
 * 用户属性
 */
export interface UserProperties {
  userId?: string;
  sessionId: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  location?: {
    country?: string;
    city?: string;
  };
  language: string;
  screenResolution: string;
}

/**
 * 事件数据
 */
export interface EventData {
  type: EventType;
  name: string;
  timestamp: Date;
  properties: Record<string, any>;
  userProperties: UserProperties;
  context: {
    page: string;
    referrer: string;
    campaignSource?: string;
    campaignMedium?: string;
  };
}

/**
 * 分析配置
 */
export interface AnalyticsConfig {
  projectId: string;
  trackPageViews?: boolean;
  trackClicks?: boolean;
  trackErrors?: boolean;
  trackPerformance?: boolean;
  samplingRate?: number;
  batchSize?: number;
  flushInterval?: number;
}

/**
 * 漏斗步骤
 */
export interface FunnelStep {
  name: string;
  eventName: string;
  required: boolean;
}

/**
 * 漏斗报告
 */
export interface FunnelReport {
  steps: Array<{
    name: string;
    count: number;
    conversionRate: number;
    dropoffRate: number;
  }>;
  totalStarted: number;
  totalCompleted: number;
  overallConversionRate: number;
}

// ==================== 主类实现 ====================

/**
 * 分析追踪器
 */
export class AnalyticsTracker extends EventEmitter {
  private config: AnalyticsConfig;
  private eventQueue: EventData[];
  private sessionId: string;
  private userId?: string;
  private flushTimer: NodeJS.Timeout | null;
  private eventHistory: Map<string, EventData[]>;

  constructor(config: AnalyticsConfig) {
    super();
    
    this.config = {
      trackPageViews: true,
      trackClicks: true,
      trackErrors: true,
      trackPerformance: true,
      samplingRate: 1.0,
      batchSize: 10,
      flushInterval: 5000,
      ...config
    };

    this.eventQueue = [];
    this.sessionId = this.generateSessionId();
    this.flushTimer = null;
    this.eventHistory = new Map();

    this.startFlushTimer();
    this.setupAutoTracking();
  }

  // ==================== 公共API ====================

  /**
   * 追踪事件
   */
  track(eventName: string, properties: Record<string, any> = {}): void {
    // 采样
    if (Math.random() > this.config.samplingRate!) {
      return;
    }

    const eventData: EventData = {
      type: EventType.CUSTOM,
      name: eventName,
      timestamp: new Date(),
      properties,
      userProperties: this.getUserProperties(),
      context: this.getContext()
    };

    this.addEvent(eventData);
  }

  /**
   * 追踪页面浏览
   */
  trackPageView(pageName: string, properties: Record<string, any> = {}): void {
    if (!this.config.trackPageViews) return;

    this.track('page_view', {
      page: pageName,
      ...properties
    });
  }

  /**
   * 追踪点击
   */
  trackClick(elementName: string, properties: Record<string, any> = {}): void {
    if (!this.config.trackClicks) return;

    this.track('click', {
      element: elementName,
      ...properties
    });
  }

  /**
   * 追踪错误
   */
  trackError(error: Error, properties: Record<string, any> = {}): void {
    if (!this.config.trackErrors) return;

    this.track('error', {
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack,
      ...properties
    });
  }

  /**
   * 追踪性能
   */
  trackPerformance(metricName: string, value: number, properties: Record<string, any> = {}): void {
    if (!this.config.trackPerformance) return;

    this.track('performance', {
      metric: metricName,
      value,
      ...properties
    });
  }

  /**
   * 设置用户ID
   */
  identify(userId: string, properties: Record<string, any> = {}): void {
    this.userId = userId;
    
    this.track('identify', {
      userId,
      ...properties
    });
  }

  /**
   * 漏斗分析
   */
  analyzeFunnel(steps: FunnelStep[]): FunnelReport {
    const report: FunnelReport = {
      steps: [],
      totalStarted: 0,
      totalCompleted: 0,
      overallConversionRate: 0
    };

    // 获取第一步的事件数
    const firstStepEvents = this.getEventsByName(steps[0].eventName);
    report.totalStarted = firstStepEvents.length;

    let previousCount = report.totalStarted;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepEvents = this.getEventsByName(step.eventName);
      const count = stepEvents.length;

      const conversionRate = previousCount > 0 ? count / previousCount : 0;
      const dropoffRate = 1 - conversionRate;

      report.steps.push({
        name: step.name,
        count,
        conversionRate,
        dropoffRate
      });

      previousCount = count;

      if (i === steps.length - 1) {
        report.totalCompleted = count;
      }
    }

    report.overallConversionRate = report.totalStarted > 0 
      ? report.totalCompleted / report.totalStarted 
      : 0;

    return report;
  }

  /**
   * 获取用户行为路径
   */
  getUserJourney(userId?: string): EventData[] {
    const uid = userId || this.userId;
    if (!uid) return [];

    const allEvents: EventData[] = [];
    for (const events of this.eventHistory.values()) {
      allEvents.push(...events.filter(e => e.userProperties.userId === uid));
    }

    return allEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * 获取事件统计
   */
  getEventStats(eventName?: string): {
    totalEvents: number;
    uniqueUsers: number;
    avgEventsPerUser: number;
    topEvents: Array<{ name: string; count: number }>;
  } {
    let totalEvents = 0;
    const userSet = new Set<string>();
    const eventCounts = new Map<string, number>();

    for (const [name, events] of this.eventHistory.entries()) {
      if (!eventName || name === eventName) {
        totalEvents += events.length;
        
        for (const event of events) {
          if (event.userProperties.userId) {
            userSet.add(event.userProperties.userId);
          }
          eventCounts.set(event.name, (eventCounts.get(event.name) || 0) + 1);
        }
      }
    }

    const uniqueUsers = userSet.size;
    const avgEventsPerUser = uniqueUsers > 0 ? totalEvents / uniqueUsers : 0;

    const topEvents = Array.from(eventCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalEvents,
      uniqueUsers,
      avgEventsPerUser,
      topEvents
    };
  }

  /**
   * 刷新事件队列
   */
  async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const batch = this.eventQueue.splice(0, this.config.batchSize);
    
    try {
      await this.sendEvents(batch);
      this.emit('flush', { count: batch.length });
    } catch (error) {
      // 发送失败,重新加入队列
      this.eventQueue.unshift(...batch);
      this.emit('flushError', { error, count: batch.length });
    }
  }

  // ==================== 私有方法 ====================

  /**
   * 添加事件
   */
  private addEvent(eventData: EventData): void {
    this.eventQueue.push(eventData);

    // 存储到历史记录
    const events = this.eventHistory.get(eventData.name) || [];
    events.push(eventData);
    this.eventHistory.set(eventData.name, events);

    this.emit('track', eventData);

    // 达到批量大小,立即刷新
    if (this.eventQueue.length >= this.config.batchSize!) {
      this.flush();
    }
  }

  /**
   * 发送事件
   */
  private async sendEvents(events: EventData[]): Promise<void> {
    // 模拟发送到分析服务
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Sent ${events.length} events to analytics service`);
        resolve();
      }, 100);
    });
  }

  /**
   * 获取用户属性
   */
  private getUserProperties(): UserProperties {
    return {
      userId: this.userId,
      sessionId: this.sessionId,
      deviceType: this.getDeviceType(),
      browser: this.getBrowser(),
      os: this.getOS(),
      language: typeof navigator !== 'undefined' ? navigator.language : 'en-US',
      screenResolution: typeof window !== 'undefined' 
        ? `${window.screen.width}x${window.screen.height}` 
        : 'unknown'
    };
  }

  /**
   * 获取上下文
   */
  private getContext(): EventData['context'] {
    return {
      page: typeof window !== 'undefined' ? window.location.pathname : '/',
      referrer: typeof document !== 'undefined' ? document.referrer : ''
    };
  }

  /**
   * 获取设备类型
   */
  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  /**
   * 获取浏览器
   */
  private getBrowser(): string {
    if (typeof navigator === 'undefined') return 'unknown';
    
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'unknown';
  }

  /**
   * 获取操作系统
   */
  private getOS(): string {
    if (typeof navigator === 'undefined') return 'unknown';
    
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'unknown';
  }

  /**
   * 按名称获取事件
   */
  private getEventsByName(eventName: string): EventData[] {
    return this.eventHistory.get(eventName) || [];
  }

  /**
   * 设置自动追踪
   */
  private setupAutoTracking(): void {
    // 浏览器环境才设置自动追踪
    if (typeof window === 'undefined') return;

    // 自动追踪页面浏览
    if (this.config.trackPageViews) {
      window.addEventListener('popstate', () => {
        this.trackPageView(window.location.pathname);
      });
    }

    // 自动追踪错误
    if (this.config.trackErrors) {
      window.addEventListener('error', (event) => {
        this.trackError(event.error);
      });
    }

    // 自动追踪性能
    if (this.config.trackPerformance && 'performance' in window) {
      window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        this.trackPerformance('page_load_time', loadTime);
      });
    }
  }

  /**
   * 启动刷新定时器
   */
  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  /**
   * 生成会话ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 清理
   */
  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
    this.eventHistory.clear();
    this.removeAllListeners();
  }
}
