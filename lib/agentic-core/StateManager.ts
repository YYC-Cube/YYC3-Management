/**
 * @fileoverview 状态管理器 - 应用状态持久化与恢复
 * @description 提供状态快照、历史记录、自动持久化等能力
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-09
 * @modified 2025-12-09
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { EventEmitter } from 'events';

// ====================================
// 类型定义
// ====================================

export interface StateManagerConfig {
  autoPersist: boolean;
  persistInterval: number;
  maxHistory: number;
}

export interface StateSnapshot {
  id: string;
  timestamp: Date;
  state: Record<string, unknown>;
  checksum: string;
}

export interface StateHistory {
  snapshots: StateSnapshot[];
  currentIndex: number;
}

// ====================================
// 状态管理器实现
// ====================================

export class StateManager extends EventEmitter {
  private config: StateManagerConfig;
  private currentState: Map<string, unknown> = new Map();
  private history: StateSnapshot[] = [];
  private currentHistoryIndex: number = -1;
  private persistTimer?: NodeJS.Timeout;
  private counters: Map<string, number> = new Map();

  constructor(config: StateManagerConfig) {
    super();
    this.config = config;

    if (config.autoPersist) {
      this.startAutoPersist();
    }
  }

  /**
   * 设置状态
   */
  setState(key: string, value: unknown): void {
    const oldValue = this.currentState.get(key);
    this.currentState.set(key, value);

    this.emit('state:changed', { key, oldValue, newValue: value });

    // 如果启用自动持久化，触发快照
    if (this.config.autoPersist) {
      this.createSnapshot();
    }
  }

  /**
   * 获取状态
   */
  getState(key: string): unknown {
    return this.currentState.get(key);
  }

  /**
   * 删除状态
   */
  deleteState(key: string): boolean {
    const existed = this.currentState.has(key);
    if (existed) {
      this.currentState.delete(key);
      this.emit('state:deleted', { key });
    }
    return existed;
  }

  /**
   * 批量设置状态
   */
  setStates(states: Record<string, unknown>): void {
    for (const [key, value] of Object.entries(states)) {
      this.currentState.set(key, value);
    }
    this.emit('state:batch_updated', { keys: Object.keys(states) });
  }

  /**
   * 获取所有状态
   */
  getAllStates(): Record<string, unknown> {
    return Object.fromEntries(this.currentState);
  }

  /**
   * 创建快照
   */
  createSnapshot(): StateSnapshot {
    const snapshot: StateSnapshot = {
      id: this.generateSnapshotId(),
      timestamp: new Date(),
      state: this.getAllStates(),
      checksum: this.calculateChecksum(this.getAllStates())
    };

    // 添加到历史
    this.history.push(snapshot);
    this.currentHistoryIndex = this.history.length - 1;

    // 限制历史记录数量
    if (this.history.length > this.config.maxHistory) {
      this.history.shift();
      this.currentHistoryIndex--;
    }

    this.emit('snapshot:created', snapshot);

    return snapshot;
  }

  /**
   * 恢复快照
   */
  restoreSnapshot(snapshotId: string): boolean {
    const snapshot = this.history.find(s => s.id === snapshotId);
    if (!snapshot) {
      return false;
    }

    // 验证校验和
    const currentChecksum = this.calculateChecksum(snapshot.state);
    if (currentChecksum !== snapshot.checksum) {
      this.emit('snapshot:corrupted', { snapshotId });
      return false;
    }

    // 恢复状态
    this.currentState.clear();
    for (const [key, value] of Object.entries(snapshot.state)) {
      this.currentState.set(key, value);
    }

    this.emit('snapshot:restored', snapshot);

    return true;
  }

  /**
   * 撤销到上一个快照
   */
  undo(): boolean {
    if (this.currentHistoryIndex <= 0) {
      return false;
    }

    this.currentHistoryIndex--;
    const snapshot = this.history[this.currentHistoryIndex];
    
    this.currentState.clear();
    for (const [key, value] of Object.entries(snapshot.state)) {
      this.currentState.set(key, value);
    }

    this.emit('state:undo', snapshot);

    return true;
  }

  /**
   * 重做到下一个快照
   */
  redo(): boolean {
    if (this.currentHistoryIndex >= this.history.length - 1) {
      return false;
    }

    this.currentHistoryIndex++;
    const snapshot = this.history[this.currentHistoryIndex];
    
    this.currentState.clear();
    for (const [key, value] of Object.entries(snapshot.state)) {
      this.currentState.set(key, value);
    }

    this.emit('state:redo', snapshot);

    return true;
  }

  /**
   * 获取历史记录
   */
  getHistory(): StateHistory {
    return {
      snapshots: [...this.history],
      currentIndex: this.currentHistoryIndex
    };
  }

  /**
   * 清空历史
   */
  clearHistory(): void {
    this.history = [];
    this.currentHistoryIndex = -1;
    this.emit('history:cleared');
  }

  /**
   * 计数器操作
   */
  incrementCounter(key: string, amount: number = 1): number {
    const current = this.counters.get(key) || 0;
    const newValue = current + amount;
    this.counters.set(key, newValue);
    return newValue;
  }

  decrementCounter(key: string, amount: number = 1): number {
    return this.incrementCounter(key, -amount);
  }

  getCount(key: string): number {
    return this.counters.get(key) || 0;
  }

  resetCounter(key: string): void {
    this.counters.set(key, 0);
  }

  /**
   * 开始自动持久化
   */
  private startAutoPersist(): void {
    this.persistTimer = setInterval(() => {
      this.createSnapshot();
    }, this.config.persistInterval);
  }

  /**
   * 停止自动持久化
   */
  stopAutoPersist(): void {
    if (this.persistTimer) {
      clearInterval(this.persistTimer);
      this.persistTimer = undefined;
    }
  }

  /**
   * 计算校验和
   */
  private calculateChecksum(state: Record<string, unknown>): string {
    const str = JSON.stringify(state, Object.keys(state).sort());
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  }

  /**
   * 生成快照ID
   */
  private generateSnapshotId(): string {
    return `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 清理资源
   */
  destroy(): void {
    this.stopAutoPersist();
    this.currentState.clear();
    this.history = [];
    this.counters.clear();
    this.removeAllListeners();
  }
}

export default StateManager;
