/**
 * @fileoverview 任务调度器 - 高级任务管理与执行
 * @description 提供优先级调度、并发控制、超时管理等能力
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

export interface TaskSchedulerConfig {
  maxConcurrentTasks: number;
  timeoutMs: number;
  priorityLevels: number;
}

export interface Task {
  id: string;
  name: string;
  priority: number;
  execute: () => Promise<unknown>;
  timeout?: number;
  dependencies?: string[];
  status: 'pending' | 'running' | 'completed' | 'failed' | 'timeout';
  result?: unknown;
  error?: Error;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface TaskResult {
  taskId: string;
  status: 'completed' | 'failed' | 'timeout';
  result?: unknown;
  error?: Error;
  duration: number;
}

// ====================================
// 任务调度器实现
// ====================================

export class TaskScheduler extends EventEmitter {
  private config: TaskSchedulerConfig;
  private pendingTasks: Task[] = [];
  private runningTasks: Map<string, Task> = new Map();
  private completedTasks: Map<string, Task> = new Map();
  private taskResults: Map<string, TaskResult> = new Map();

  constructor(config: TaskSchedulerConfig) {
    super();
    this.config = config;
  }

  /**
   * 调度任务
   */
  async schedule(task: Omit<Task, 'id' | 'status' | 'createdAt'>): Promise<string> {
    const fullTask: Task = {
      ...task,
      id: this.generateTaskId(),
      status: 'pending',
      createdAt: new Date()
    };

    // 验证优先级
    if (task.priority < 0 || task.priority >= this.config.priorityLevels) {
      throw new Error(`Invalid priority: ${task.priority}. Must be 0-${this.config.priorityLevels - 1}`);
    }

    // 检查依赖
    if (task.dependencies) {
      for (const depId of task.dependencies) {
        const depTask = this.completedTasks.get(depId);
        if (!depTask || depTask.status !== 'completed') {
          throw new Error(`Dependency not satisfied: ${depId}`);
        }
      }
    }

    // 添加到待处理队列
    this.pendingTasks.push(fullTask);
    this.sortPendingTasks();

    this.emit('task:scheduled', fullTask);

    // 尝试执行
    this.executePending();

    return fullTask.id;
  }

  /**
   * 执行待处理任务
   */
  private async executePending(): Promise<void> {
    while (
      this.pendingTasks.length > 0 && 
      this.runningTasks.size < this.config.maxConcurrentTasks
    ) {
      const task = this.pendingTasks.shift();
      if (task) {
        await this.executeTask(task);
      }
    }
  }

  /**
   * 执行单个任务
   */
  private async executeTask(task: Task): Promise<void> {
    task.status = 'running';
    task.startedAt = new Date();
    this.runningTasks.set(task.id, task);

    this.emit('task:started', task);

    const timeout = task.timeout || this.config.timeoutMs;
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Task timeout')), timeout)
    );

    try {
      // 执行任务（带超时控制）
      const result = await Promise.race([
        task.execute(),
        timeoutPromise
      ]);

      task.status = 'completed';
      task.result = result;
      task.completedAt = new Date();

      this.runningTasks.delete(task.id);
      this.completedTasks.set(task.id, task);

      const taskResult: TaskResult = {
        taskId: task.id,
        status: 'completed',
        result,
        duration: task.completedAt.getTime() - task.startedAt!.getTime()
      };

      this.taskResults.set(task.id, taskResult);
      this.emit('task:completed', task, taskResult);

    } catch (error) {
      const isTimeout = error instanceof Error && error.message === 'Task timeout';
      
      task.status = isTimeout ? 'timeout' : 'failed';
      task.error = error as Error;
      task.completedAt = new Date();

      this.runningTasks.delete(task.id);
      this.completedTasks.set(task.id, task);

      const taskResult: TaskResult = {
        taskId: task.id,
        status: task.status as 'failed' | 'timeout',
        error: error as Error,
        duration: task.completedAt.getTime() - task.startedAt!.getTime()
      };

      this.taskResults.set(task.id, taskResult);
      this.emit('task:failed', task, taskResult);
    }

    // 继续执行待处理任务
    this.executePending();
  }

  /**
   * 取消任务
   */
  async cancelTask(taskId: string): Promise<boolean> {
    // 从待处理队列移除
    const pendingIndex = this.pendingTasks.findIndex(t => t.id === taskId);
    if (pendingIndex !== -1) {
      const task = this.pendingTasks.splice(pendingIndex, 1)[0];
      this.emit('task:cancelled', task);
      return true;
    }

    // 运行中的任务无法取消（已经在执行）
    if (this.runningTasks.has(taskId)) {
      this.emit('task:cancel_failed', { taskId, reason: 'Task is running' });
      return false;
    }

    return false;
  }

  /**
   * 获取任务结果
   */
  getTaskResult(taskId: string): TaskResult | undefined {
    return this.taskResults.get(taskId);
  }

  /**
   * 获取任务状态
   */
  getTaskStatus(taskId: string): Task['status'] | undefined {
    const running = this.runningTasks.get(taskId);
    if (running) return running.status;

    const completed = this.completedTasks.get(taskId);
    if (completed) return completed.status;

    const pending = this.pendingTasks.find(t => t.id === taskId);
    if (pending) return pending.status;

    return undefined;
  }

  /**
   * 按优先级排序待处理任务
   */
  private sortPendingTasks(): void {
    this.pendingTasks.sort((a, b) => {
      // 优先级高的排前面
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      // 优先级相同，创建时间早的排前面
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }

  /**
   * 生成任务ID
   */
  private generateTaskId(): string {
    return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      pending: this.pendingTasks.length,
      running: this.runningTasks.size,
      completed: this.completedTasks.size,
      maxConcurrent: this.config.maxConcurrentTasks,
      utilizationRate: this.runningTasks.size / this.config.maxConcurrentTasks
    };
  }

  /**
   * 等待所有任务完成
   */
  async waitAll(): Promise<void> {
    while (this.pendingTasks.length > 0 || this.runningTasks.size > 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * 清理已完成的任务
   */
  clearCompleted(): void {
    this.completedTasks.clear();
    this.taskResults.clear();
    this.emit('tasks:cleared');
  }
}

export default TaskScheduler;
