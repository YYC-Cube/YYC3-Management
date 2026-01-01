/**
 * OfflineSupport - 离线功能支持系统
 * 
 * 离线优先架构,提供:
 * - 离线数据存储
 * - 数据同步策略
 * - 冲突解决
 * - 网络状态监测
 * - Service Worker集成
 * 
 * @author YYC³ AI开发团队
 * @version 1.0.0
 * @standard YYC³团队标准化规范 v1.1.0
 */

import { EventEmitter } from 'events';

// ==================== 类型定义 ====================

/**
 * 同步状态
 */
export enum SyncState {
  IDLE = 'idle',
  SYNCING = 'syncing',
  ERROR = 'error',
  CONFLICT = 'conflict'
}

/**
 * 同步策略
 */
export enum SyncStrategy {
  OPTIMISTIC = 'optimistic',
  PESSIMISTIC = 'pessimistic',
  EVENTUAL_CONSISTENCY = 'eventual_consistency'
}

/**
 * 冲突解决策略
 */
export enum ConflictResolution {
  CLIENT_WINS = 'client_wins',
  SERVER_WINS = 'server_wins',
  LAST_WRITE_WINS = 'last_write_wins',
  MANUAL = 'manual'
}

/**
 * 数据操作类型
 */
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
}

/**
 * 离线数据项
 */
export interface OfflineDataItem<T = any> {
  id: string;
  data: T;
  timestamp: Date;
  version: number;
  synced: boolean;
  operation: OperationType;
  metadata?: Record<string, any>;
}

/**
 * 同步队列项
 */
export interface SyncQueueItem {
  id: string;
  operation: OperationType;
  resource: string;
  data: any;
  timestamp: Date;
  retryCount: number;
}

/**
 * 冲突数据
 */
export interface ConflictData {
  id: string;
  clientVersion: OfflineDataItem;
  serverVersion: OfflineDataItem;
  timestamp: Date;
  resolved: boolean;
}

/**
 * 离线配置
 */
export interface OfflineConfig {
  storageKey?: string;
  syncInterval?: number;
  maxRetries?: number;
  syncStrategy?: SyncStrategy;
  conflictResolution?: ConflictResolution;
  enableServiceWorker?: boolean;
}

// ==================== 主类实现 ====================

/**
 * 离线支持管理器
 */
export class OfflineSupportManager extends EventEmitter {
  private config: OfflineConfig;
  private storage: Map<string, OfflineDataItem>;
  private syncQueue: SyncQueueItem[];
  private conflicts: ConflictData[];
  private isOnline: boolean;
  private syncState: SyncState;
  private syncTimer: NodeJS.Timeout | null;

  constructor(config: OfflineConfig = {}) {
    super();
    
    this.config = {
      storageKey: 'offline_storage',
      syncInterval: 30000,
      maxRetries: 3,
      syncStrategy: SyncStrategy.EVENTUAL_CONSISTENCY,
      conflictResolution: ConflictResolution.LAST_WRITE_WINS,
      enableServiceWorker: true,
      ...config
    };

    this.storage = new Map();
    this.syncQueue = [];
    this.conflicts = [];
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.syncState = SyncState.IDLE;
    this.syncTimer = null;

    this.initialize();
  }

  // ==================== 公共API ====================

  /**
   * 存储数据
   */
  async store<T>(id: string, data: T, operation: OperationType = OperationType.UPDATE): Promise<void> {
    const item: OfflineDataItem<T> = {
      id,
      data,
      timestamp: new Date(),
      version: this.getNextVersion(id),
      synced: false,
      operation
    };

    this.storage.set(id, item);
    this.saveToLocalStorage();

    // 添加到同步队列
    this.addToSyncQueue({
      id,
      operation,
      resource: id,
      data,
      timestamp: new Date(),
      retryCount: 0
    });

    this.emit('stored', item);

    // 如果在线且策略是乐观的,立即同步
    if (this.isOnline && this.config.syncStrategy === SyncStrategy.OPTIMISTIC) {
      await this.sync();
    }
  }

  /**
   * 获取数据
   */
  get<T>(id: string): OfflineDataItem<T> | undefined {
    return this.storage.get(id) as OfflineDataItem<T> | undefined;
  }

  /**
   * 删除数据
   */
  async delete(id: string): Promise<void> {
    const item = this.storage.get(id);
    
    if (item) {
      // 标记为删除
      item.operation = OperationType.DELETE;
      item.synced = false;
      item.timestamp = new Date();

      this.storage.set(id, item);
      this.saveToLocalStorage();

      // 添加到同步队列
      this.addToSyncQueue({
        id,
        operation: OperationType.DELETE,
        resource: id,
        data: null,
        timestamp: new Date(),
        retryCount: 0
      });

      this.emit('deleted', { id });

      if (this.isOnline) {
        await this.sync();
      }
    }
  }

  /**
   * 同步数据
   */
  async sync(): Promise<void> {
    if (!this.isOnline || this.syncState === SyncState.SYNCING) {
      return;
    }

    this.syncState = SyncState.SYNCING;
    this.emit('syncStart');

    try {
      // 处理同步队列
      const results = await Promise.allSettled(
        this.syncQueue.map(item => this.syncItem(item))
      );

      // 检查结果
      let successCount = 0;
      let errorCount = 0;
      let conflictCount = 0;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successCount++;
          this.syncQueue.splice(index, 1);
        } else {
          errorCount++;
          const item = this.syncQueue[index];
          item.retryCount++;
          
          if (item.retryCount >= this.config.maxRetries!) {
            this.syncQueue.splice(index, 1);
            this.emit('syncItemFailed', { item, error: result.reason });
          }
        }
      });

      // 更新状态
      if (this.conflicts.length > 0) {
        this.syncState = SyncState.CONFLICT;
        conflictCount = this.conflicts.length;
      } else if (errorCount > 0) {
        this.syncState = SyncState.ERROR;
      } else {
        this.syncState = SyncState.IDLE;
      }

      this.emit('syncComplete', { successCount, errorCount, conflictCount });
    } catch (error) {
      this.syncState = SyncState.ERROR;
      this.emit('syncError', { error });
    }
  }

  /**
   * 解决冲突
   */
  resolveConflict(conflictId: string, resolution?: OfflineDataItem): void {
    const conflict = this.conflicts.find(c => c.id === conflictId);
    
    if (!conflict) {
      return;
    }

    let resolvedData: OfflineDataItem;

    if (resolution) {
      resolvedData = resolution;
    } else {
      // 根据配置的策略自动解决
      switch (this.config.conflictResolution) {
        case ConflictResolution.CLIENT_WINS:
          resolvedData = conflict.clientVersion;
          break;
        case ConflictResolution.SERVER_WINS:
          resolvedData = conflict.serverVersion;
          break;
        case ConflictResolution.LAST_WRITE_WINS:
          resolvedData = conflict.clientVersion.timestamp > conflict.serverVersion.timestamp
            ? conflict.clientVersion
            : conflict.serverVersion;
          break;
        default:
          return; // 需要手动解决
      }
    }

    // 更新存储
    this.storage.set(conflictId, resolvedData);
    this.saveToLocalStorage();

    // 标记冲突为已解决
    conflict.resolved = true;
    
    // 从冲突列表移除
    this.conflicts = this.conflicts.filter(c => c.id !== conflictId);

    this.emit('conflictResolved', { conflictId, resolvedData });
  }

  /**
   * 获取同步状态
   */
  getSyncState(): {
    state: SyncState;
    isOnline: boolean;
    queueLength: number;
    conflictCount: number;
    lastSync?: Date;
  } {
    return {
      state: this.syncState,
      isOnline: this.isOnline,
      queueLength: this.syncQueue.length,
      conflictCount: this.conflicts.length
    };
  }

  /**
   * 获取所有冲突
   */
  getConflicts(): ConflictData[] {
    return this.conflicts;
  }

  /**
   * 清除所有数据
   */
  clear(): void {
    this.storage.clear();
    this.syncQueue = [];
    this.conflicts = [];
    this.saveToLocalStorage();
    this.emit('cleared');
  }

  // ==================== 私有方法 ====================

  /**
   * 初始化
   */
  private initialize(): void {
    // 从本地存储加载数据
    this.loadFromLocalStorage();

    // 监听网络状态
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.emit('online');
        this.sync();
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.emit('offline');
      });
    }

    // 启动定期同步
    this.startSyncTimer();

    // 注册Service Worker
    if (this.config.enableServiceWorker) {
      this.registerServiceWorker();
    }
  }

  /**
   * 同步单个项目
   */
  private async syncItem(item: SyncQueueItem): Promise<void> {
    // 模拟API调用
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟成功
        const storedItem = this.storage.get(item.id);
        if (storedItem) {
          storedItem.synced = true;
          this.storage.set(item.id, storedItem);
          this.saveToLocalStorage();
        }
        resolve();
      }, 100);
    });
  }

  /**
   * 添加到同步队列
   */
  private addToSyncQueue(item: SyncQueueItem): void {
    // 检查是否已存在
    const existingIndex = this.syncQueue.findIndex(q => q.id === item.id);
    
    if (existingIndex >= 0) {
      // 更新现有项
      this.syncQueue[existingIndex] = item;
    } else {
      // 添加新项
      this.syncQueue.push(item);
    }
  }

  /**
   * 获取下一个版本号
   */
  private getNextVersion(id: string): number {
    const item = this.storage.get(id);
    return item ? item.version + 1 : 1;
  }

  /**
   * 保存到本地存储
   */
  private saveToLocalStorage(): void {
    if (typeof localStorage === 'undefined') return;

    const data = {
      storage: Array.from(this.storage.entries()),
      syncQueue: this.syncQueue,
      conflicts: this.conflicts
    };

    localStorage.setItem(this.config.storageKey!, JSON.stringify(data));
  }

  /**
   * 从本地存储加载
   */
  private loadFromLocalStorage(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const stored = localStorage.getItem(this.config.storageKey!);
      
      if (stored) {
        const data = JSON.parse(stored);
        
        this.storage = new Map(data.storage.map(([key, value]: [string, any]) => [
          key,
          {
            ...value,
            timestamp: new Date(value.timestamp)
          }
        ]));

        this.syncQueue = data.syncQueue.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));

        this.conflicts = data.conflicts.map((conflict: any) => ({
          ...conflict,
          timestamp: new Date(conflict.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load from local storage:', error);
    }
  }

  /**
   * 启动同步定时器
   */
  private startSyncTimer(): void {
    this.syncTimer = setInterval(() => {
      if (this.isOnline && this.syncQueue.length > 0) {
        this.sync();
      }
    }, this.config.syncInterval);
  }

  /**
   * 注册Service Worker
   */
  private registerServiceWorker(): void {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        this.emit('serviceWorkerRegistered', { registration });
      })
      .catch(error => {
        this.emit('serviceWorkerError', { error });
      });
  }

  /**
   * 清理
   */
  public destroy(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    this.removeAllListeners();
  }
}
