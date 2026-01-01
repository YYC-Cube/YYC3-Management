/**
 * PositionOptimizer - 智能位置优化系统
 * 
 * 基于机器学习的智能定位系统,支持:
 * - 用户行为学习
 * - 热力图分析
 * - 上下文感知
 * - 多屏适配
 * - 位置推荐
 * 
 * @author YYC³ AI开发团队
 * @version 1.0.0
 * @standard YYC³团队标准化规范 v1.1.0
 */

import { EventEmitter } from 'events';

// ==================== 类型定义 ====================

/**
 * 位置
 */
export interface Position {
  x: number;
  y: number;
  screen?: number;
}

/**
 * 区域
 */
export interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 热力图数据
 */
export interface HeatmapData {
  /** 热力图矩阵 */
  matrix: number[][];
  /** 分辨率(像素) */
  resolution: number;
  /** 总交互次数 */
  totalInteractions: number;
  /** 最后更新时间 */
  lastUpdated: Date;
}

/**
 * 用户注意力状态
 */
export enum AttentionState {
  FOCUSED = 'focused',
  DISTRACTED = 'distracted',
  IDLE = 'idle'
}

/**
 * 组件优先级
 */
export enum ComponentPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

/**
 * 上下文信息
 */
export interface ContextInfo {
  /** 屏幕信息 */
  screen: {
    width: number;
    height: number;
    availWidth: number;
    availHeight: number;
    scale: number;
    count: number;
  };
  
  /** 用户状态 */
  user: {
    attention: AttentionState;
    currentTask?: string;
    preferences: Record<string, any>;
  };
  
  /** UI状态 */
  ui: {
    visibleElements: Region[];
    focusedElement?: Region;
    interactionZones: Region[];
    hotZones: Region[];
  };
  
  /** 组件信息 */
  component: {
    type: string;
    priority: ComponentPriority;
    size: { width: number; height: number };
    frequency: number;
  };
  
  /** 时间上下文 */
  time: {
    hour: number;
    dayOfWeek: number;
    interactionHistory: InteractionRecord[];
  };
  
  /** 环境因素 */
  environment: {
    distractionLevel: number;
    workload: number;
  };
}

/**
 * 交互记录
 */
export interface InteractionRecord {
  componentType: string;
  position: Position;
  timestamp: Date;
  duration: number;
  successful: boolean;
}

/**
 * 位置候选
 */
export interface PositionCandidate {
  position: Position;
  score: number;
  reasons: string[];
}

/**
 * 优化选项
 */
export interface OptimizationOptions {
  /** 避免区域 */
  avoidRegions?: Region[];
  /** 首选区域 */
  preferredRegions?: Region[];
  /** 是否启用学习 */
  enableLearning?: boolean;
  /** 候选数量 */
  candidateCount?: number;
}

/**
 * 优化器配置
 */
export interface PositionOptimizerConfig {
  /** 热力图分辨率 */
  heatmapResolution: number;
  /** 学习率 */
  learningRate: number;
  /** 历史记录容量 */
  historyCapacity: number;
  /** 是否启用多屏适配 */
  enableMultiScreen: boolean;
  /** 候选数量 */
  defaultCandidateCount: number;
  /** 边距 */
  margin: number;
}

// ==================== 主类实现 ====================

/**
 * 位置优化器
 */
export class PositionOptimizer extends EventEmitter {
  private config: PositionOptimizerConfig;
  private heatmap: HeatmapData;
  private interactionHistory: InteractionRecord[];
  private userPreferences: Map<string, any>;
  private contextCache: ContextInfo | null;
  
  constructor(config: Partial<PositionOptimizerConfig> = {}) {
    super();
    
    this.config = {
      heatmapResolution: 20,
      learningRate: 0.1,
      historyCapacity: 1000,
      enableMultiScreen: true,
      defaultCandidateCount: 5,
      margin: 20,
      ...config
    };
    
    this.heatmap = this.initializeHeatmap();
    this.interactionHistory = [];
    this.userPreferences = new Map();
    this.contextCache = null;
  }

  // ==================== 公共API ====================

  /**
   * 优化位置
   */
  public async optimizePosition(
    componentType: string,
    size: { width: number; height: number },
    options: OptimizationOptions = {}
  ): Promise<Position> {
    // 收集上下文
    const context = this.collectContext(componentType, size);
    
    // 生成候选位置
    const candidates = this.generateCandidates(context, options);
    
    // 评分
    const scored = this.scoreCandidates(candidates, context, options);
    
    // 选择最佳位置
    const best = scored[0];
    
    // 记录决策
    this.emit('positionOptimized', {
      componentType,
      position: best.position,
      score: best.score,
      reasons: best.reasons,
      candidates: scored
    });
    
    return best.position;
  }

  /**
   * 记录交互
   */
  public recordInteraction(record: InteractionRecord): void {
    // 添加到历史
    this.interactionHistory.push(record);
    
    // 限制容量
    if (this.interactionHistory.length > this.config.historyCapacity) {
      this.interactionHistory.shift();
    }
    
    // 更新热力图
    this.updateHeatmap(record.position);
    
    // 学习用户偏好
    this.learnUserPreference(record);
    
    this.emit('interactionRecorded', { record });
  }

  /**
   * 获取热力图
   */
  public getHeatmap(): HeatmapData {
    return { ...this.heatmap };
  }

  /**
   * 清除热力图
   */
  public clearHeatmap(): void {
    this.heatmap = this.initializeHeatmap();
    this.emit('heatmapCleared');
  }

  /**
   * 获取用户偏好
   */
  public getUserPreference(key: string): any {
    return this.userPreferences.get(key);
  }

  /**
   * 设置用户偏好
   */
  public setUserPreference(key: string, value: any): void {
    this.userPreferences.set(key, value);
    this.emit('preferenceChanged', { key, value });
  }

  /**
   * 获取交互历史
   */
  public getInteractionHistory(componentType?: string): InteractionRecord[] {
    if (componentType) {
      return this.interactionHistory.filter(r => r.componentType === componentType);
    }
    return [...this.interactionHistory];
  }

  /**
   * 预测最佳位置
   */
  public predictBestPosition(
    componentType: string,
    size: { width: number; height: number }
  ): Position {
    // 查找历史成功位置
    const successfulRecords = this.interactionHistory.filter(
      r => r.componentType === componentType && r.successful
    );
    
    if (successfulRecords.length === 0) {
      // 没有历史,返回中心位置
      return this.getCenterPosition(size);
    }
    
    // 计算平均位置
    const avgX = successfulRecords.reduce((sum, r) => sum + r.position.x, 0) / successfulRecords.length;
    const avgY = successfulRecords.reduce((sum, r) => sum + r.position.y, 0) / successfulRecords.length;
    
    return { x: avgX, y: avgY };
  }

  // ==================== 私有方法 ====================

  /**
   * 收集上下文
   */
  private collectContext(componentType: string, size: { width: number; height: number }): ContextInfo {
    const screen = this.getScreenInfo();
    const user = this.getUserState();
    const ui = this.getUIState();
    const time = this.getTimeContext();
    const environment = this.getEnvironment();
    
    const context: ContextInfo = {
      screen,
      user,
      ui,
      component: {
        type: componentType,
        priority: this.getComponentPriority(componentType),
        size,
        frequency: this.getComponentFrequency(componentType)
      },
      time,
      environment
    };
    
    this.contextCache = context;
    return context;
  }

  /**
   * 生成候选位置
   */
  private generateCandidates(context: ContextInfo, options: OptimizationOptions): PositionCandidate[] {
    const candidates: PositionCandidate[] = [];
    const count = options.candidateCount || this.config.defaultCandidateCount;
    
    // 热力图引导的候选
    const hotZones = this.getHotZones(5);
    for (const zone of hotZones.slice(0, Math.ceil(count / 2))) {
      candidates.push({
        position: { x: zone.x, y: zone.y },
        score: 0,
        reasons: ['热区位置']
      });
    }
    
    // 预测位置
    const predicted = this.predictBestPosition(context.component.type, context.component.size);
    candidates.push({
      position: predicted,
      score: 0,
      reasons: ['历史偏好']
    });
    
    // 智能位置(避开遮挡)
    const smart = this.findSmartPosition(context);
    candidates.push({
      position: smart,
      score: 0,
      reasons: ['避开遮挡']
    });
    
    // 边缘位置
    const edges = this.getEdgePositions(context);
    candidates.push(...edges.slice(0, count - candidates.length).map(pos => ({
      position: pos,
      score: 0,
      reasons: ['边缘位置']
    })));
    
    // 确保有足够的候选
    while (candidates.length < count) {
      candidates.push({
        position: this.getRandomPosition(context),
        score: 0,
        reasons: ['随机位置']
      });
    }
    
    return candidates.slice(0, count);
  }

  /**
   * 评分候选位置
   */
  private scoreCandidates(
    candidates: PositionCandidate[],
    context: ContextInfo,
    options: OptimizationOptions
  ): PositionCandidate[] {
    for (const candidate of candidates) {
      let score = 0;
      const reasons: string[] = [...candidate.reasons];
      
      // 热力图得分
      const heatScore = this.getHeatmapScore(candidate.position);
      score += heatScore * 0.3;
      if (heatScore > 0.7) reasons.push('高频区域');
      
      // 避开遮挡
      const occlusionScore = this.getOcclusionScore(candidate.position, context);
      score += occlusionScore * 0.4;
      if (occlusionScore > 0.8) reasons.push('无遮挡');
      
      // 用户注意力
      const attentionScore = this.getAttentionScore(candidate.position, context);
      score += attentionScore * 0.2;
      if (attentionScore > 0.8) reasons.push('注意力区域');
      
      // 优先级调整
      const priorityScore = this.getPriorityScore(context.component.priority);
      score += priorityScore * 0.1;
      
      // 避开指定区域
      if (options.avoidRegions) {
        const avoidScore = this.getAvoidScore(candidate.position, options.avoidRegions, context.component.size);
        score *= avoidScore;
        if (avoidScore < 0.5) reasons.push('靠近避开区域');
      }
      
      // 首选区域
      if (options.preferredRegions) {
        const preferScore = this.getPreferScore(candidate.position, options.preferredRegions);
        score *= (1 + preferScore * 0.5);
        if (preferScore > 0.7) reasons.push('首选区域');
      }
      
      candidate.score = score;
      candidate.reasons = reasons;
    }
    
    // 排序
    return candidates.sort((a, b) => b.score - a.score);
  }

  /**
   * 初始化热力图
   */
  private initializeHeatmap(): HeatmapData {
    const resolution = this.config.heatmapResolution;
    const matrix: number[][] = [];
    
    for (let i = 0; i < resolution; i++) {
      matrix[i] = new Array(resolution).fill(0);
    }
    
    return {
      matrix,
      resolution,
      totalInteractions: 0,
      lastUpdated: new Date()
    };
  }

  /**
   * 更新热力图
   */
  private updateHeatmap(position: Position): void {
    const { width, height } = this.getScreenInfo();
    const res = this.config.heatmapResolution;
    
    const cellX = Math.floor((position.x / width) * res);
    const cellY = Math.floor((position.y / height) * res);
    
    if (cellX >= 0 && cellX < res && cellY >= 0 && cellY < res) {
      this.heatmap.matrix[cellY][cellX]++;
      this.heatmap.totalInteractions++;
      this.heatmap.lastUpdated = new Date();
      
      this.emit('heatmapUpdated', { position, cell: { x: cellX, y: cellY } });
    }
  }

  /**
   * 获取热区
   */
  private getHotZones(count: number): Position[] {
    const zones: Array<{ x: number; y: number; value: number }> = [];
    const res = this.heatmap.resolution;
    const { width, height } = this.getScreenInfo();
    
    for (let y = 0; y < res; y++) {
      for (let x = 0; x < res; x++) {
        const value = this.heatmap.matrix[y][x];
        if (value > 0) {
          zones.push({
            x: (x / res) * width,
            y: (y / res) * height,
            value
          });
        }
      }
    }
    
    zones.sort((a, b) => b.value - a.value);
    return zones.slice(0, count).map(z => ({ x: z.x, y: z.y }));
  }

  /**
   * 学习用户偏好
   */
  private learnUserPreference(record: InteractionRecord): void {
    const key = `${record.componentType}_position`;
    const existing = this.userPreferences.get(key) || { x: 0, y: 0, count: 0 };
    
    // 使用指数移动平均
    const alpha = this.config.learningRate;
    existing.x = existing.x * (1 - alpha) + record.position.x * alpha;
    existing.y = existing.y * (1 - alpha) + record.position.y * alpha;
    existing.count++;
    
    this.userPreferences.set(key, existing);
  }

  /**
   * 获取屏幕信息
   */
  private getScreenInfo(): ContextInfo['screen'] {
    return {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      scale: window.devicePixelRatio || 1,
      count: (window.screen as any).isExtended ? 2 : 1
    };
  }

  /**
   * 获取用户状态
   */
  private getUserState(): ContextInfo['user'] {
    return {
      attention: this.detectAttentionState(),
      currentTask: undefined,
      preferences: Object.fromEntries(this.userPreferences)
    };
  }

  /**
   * 获取UI状态
   */
  private getUIState(): ContextInfo['ui'] {
    const hotZones = this.getHotZones(10).map(pos => ({
      x: pos.x,
      y: pos.y,
      width: 100,
      height: 100
    }));
    
    return {
      visibleElements: [],
      interactionZones: [],
      hotZones
    };
  }

  /**
   * 获取时间上下文
   */
  private getTimeContext(): ContextInfo['time'] {
    const now = new Date();
    return {
      hour: now.getHours(),
      dayOfWeek: now.getDay(),
      interactionHistory: this.interactionHistory.slice(-50)
    };
  }

  /**
   * 获取环境信息
   */
  private getEnvironment(): ContextInfo['environment'] {
    return {
      distractionLevel: 0.5,
      workload: 0.5
    };
  }

  /**
   * 检测注意力状态
   */
  private detectAttentionState(): AttentionState {
    // 简化实现
    return AttentionState.FOCUSED;
  }

  /**
   * 获取组件优先级
   */
  private getComponentPriority(componentType: string): ComponentPriority {
    // 根据组件类型返回优先级
    const priorityMap: Record<string, ComponentPriority> = {
      'notification': ComponentPriority.HIGH,
      'alert': ComponentPriority.CRITICAL,
      'tooltip': ComponentPriority.MEDIUM,
      'menu': ComponentPriority.LOW
    };
    
    return priorityMap[componentType] || ComponentPriority.MEDIUM;
  }

  /**
   * 获取组件频率
   */
  private getComponentFrequency(componentType: string): number {
    const records = this.interactionHistory.filter(r => r.componentType === componentType);
    return records.length;
  }

  /**
   * 查找智能位置
   */
  private findSmartPosition(context: ContextInfo): Position {
    const { width, height } = context.screen;
    const { width: compWidth, height: compHeight } = context.component.size;
    const margin = this.config.margin;
    
    // 尝试右上角
    return {
      x: width - compWidth - margin,
      y: margin
    };
  }

  /**
   * 获取边缘位置
   */
  private getEdgePositions(context: ContextInfo): Position[] {
    const { width, height } = context.screen;
    const { width: compWidth, height: compHeight } = context.component.size;
    const margin = this.config.margin;
    
    return [
      { x: margin, y: margin }, // 左上
      { x: width - compWidth - margin, y: margin }, // 右上
      { x: margin, y: height - compHeight - margin }, // 左下
      { x: width - compWidth - margin, y: height - compHeight - margin } // 右下
    ];
  }

  /**
   * 获取中心位置
   */
  private getCenterPosition(size: { width: number; height: number }): Position {
    const { width, height } = this.getScreenInfo();
    return {
      x: (width - size.width) / 2,
      y: (height - size.height) / 2
    };
  }

  /**
   * 获取随机位置
   */
  private getRandomPosition(context: ContextInfo): Position {
    const { width, height } = context.screen;
    const { width: compWidth, height: compHeight } = context.component.size;
    const margin = this.config.margin;
    
    return {
      x: margin + Math.random() * (width - compWidth - 2 * margin),
      y: margin + Math.random() * (height - compHeight - 2 * margin)
    };
  }

  /**
   * 获取热力图得分
   */
  private getHeatmapScore(position: Position): number {
    const { width, height } = this.getScreenInfo();
    const res = this.heatmap.resolution;
    
    const cellX = Math.floor((position.x / width) * res);
    const cellY = Math.floor((position.y / height) * res);
    
    if (cellX >= 0 && cellX < res && cellY >= 0 && cellY < res) {
      const value = this.heatmap.matrix[cellY][cellX];
      const max = Math.max(...this.heatmap.matrix.flat());
      return max > 0 ? value / max : 0;
    }
    
    return 0;
  }

  /**
   * 获取遮挡得分
   */
  private getOcclusionScore(position: Position, context: ContextInfo): number {
    // 简化实现:检查是否与其他元素重叠
    const rect: Region = {
      x: position.x,
      y: position.y,
      width: context.component.size.width,
      height: context.component.size.height
    };
    
    for (const element of context.ui.visibleElements) {
      if (this.isOverlapping(rect, element)) {
        return 0.3; // 有重叠,低分
      }
    }
    
    return 1.0; // 无重叠,满分
  }

  /**
   * 获取注意力得分
   */
  private getAttentionScore(position: Position, context: ContextInfo): number {
    // 简化实现:距离热区越近得分越高
    const hotZones = context.ui.hotZones;
    if (hotZones.length === 0) return 0.5;
    
    const minDist = Math.min(...hotZones.map(zone => 
      Math.sqrt(Math.pow(position.x - zone.x, 2) + Math.pow(position.y - zone.y, 2))
    ));
    
    const { width, height } = context.screen;
    const maxDist = Math.sqrt(width * width + height * height);
    
    return 1 - (minDist / maxDist);
  }

  /**
   * 获取优先级得分
   */
  private getPriorityScore(priority: ComponentPriority): number {
    const scoreMap = {
      [ComponentPriority.CRITICAL]: 1.0,
      [ComponentPriority.HIGH]: 0.8,
      [ComponentPriority.MEDIUM]: 0.6,
      [ComponentPriority.LOW]: 0.4
    };
    
    return scoreMap[priority] || 0.5;
  }

  /**
   * 获取避开得分
   */
  private getAvoidScore(
    position: Position,
    avoidRegions: Region[],
    size: { width: number; height: number }
  ): number {
    const rect: Region = { x: position.x, y: position.y, ...size };
    
    for (const region of avoidRegions) {
      if (this.isOverlapping(rect, region)) {
        return 0.1;
      }
    }
    
    return 1.0;
  }

  /**
   * 获取首选得分
   */
  private getPreferScore(position: Position, preferredRegions: Region[]): number {
    for (const region of preferredRegions) {
      if (this.isPointInRegion(position, region)) {
        return 1.0;
      }
    }
    
    return 0.0;
  }

  /**
   * 检查重叠
   */
  private isOverlapping(rect1: Region, rect2: Region): boolean {
    return !(
      rect1.x + rect1.width < rect2.x ||
      rect2.x + rect2.width < rect1.x ||
      rect1.y + rect1.height < rect2.y ||
      rect2.y + rect2.height < rect1.y
    );
  }

  /**
   * 检查点是否在区域内
   */
  private isPointInRegion(point: Position, region: Region): boolean {
    return (
      point.x >= region.x &&
      point.x <= region.x + region.width &&
      point.y >= region.y &&
      point.y <= region.y + region.height
    );
  }

  /**
   * 清理
   */
  public destroy(): void {
    this.interactionHistory = [];
    this.userPreferences.clear();
    this.removeAllListeners();
  }
}
