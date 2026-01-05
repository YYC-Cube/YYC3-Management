/**
 * Task Store Tests
 * 任务状态管理测试
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useTaskStore } from './useTaskStore';

describe('useTaskStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useTaskStore.getState().setTasks([]);
  });

  describe('初始状态', () => {
    it('应该有正确的初始状态', () => {
      const state = useTaskStore.getState();

      expect(state.tasks).toEqual([]);
      expect(state.filter).toBe('all');
    });
  });

  describe('setTasks', () => {
    it('应该设置任务列表', () => {
      const { setTasks } = useTaskStore.getState();

      const testTasks = [
        {
          id: 'task1',
          title: 'Task 1',
          status: 'todo' as const,
          priority: 'high' as const,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'task2',
          title: 'Task 2',
          status: 'done' as const,
          priority: 'low' as const,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      setTasks(testTasks);

      const state = useTaskStore.getState();
      expect(state.tasks).toEqual(testTasks);
    });

    it('应该替换现有任务', () => {
      const { setTasks } = useTaskStore.getState();

      const firstTasks = [
        {
          id: 'task1',
          title: 'Task 1',
          status: 'todo' as const,
          priority: 'medium' as const,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      setTasks(firstTasks);
      expect(useTaskStore.getState().tasks).toHaveLength(1);

      const secondTasks = [
        {
          id: 'task2',
          title: 'Task 2',
          status: 'done' as const,
          priority: 'high' as const,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'task3',
          title: 'Task 3',
          status: 'todo' as const,
          priority: 'low' as const,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      setTasks(secondTasks);
      expect(useTaskStore.getState().tasks).toHaveLength(2);
      expect(useTaskStore.getState().tasks[0].id).toBe('task2');
    });
  });

  describe('addTask', () => {
    it('应该添加新任务', () => {
      const { addTask } = useTaskStore.getState();

      const newTask = {
        title: 'New Task',
        status: 'todo' as const,
        priority: 'high' as const,
      };

      addTask(newTask);

      const state = useTaskStore.getState();
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].title).toBe('New Task');
      expect(state.tasks[0].status).toBe('todo');
      expect(state.tasks[0].priority).toBe('high');
      expect(state.tasks[0].id).toBeDefined();
      expect(state.tasks[0].createdAt).toBeDefined();
      expect(state.tasks[0].updatedAt).toBeDefined();
    });

    it('应该生成唯一ID', () => {
      const { addTask } = useTaskStore.getState();

      addTask({ title: 'Task 1', status: 'todo', priority: 'medium' });
      addTask({ title: 'Task 2', status: 'todo', priority: 'medium' });

      const state = useTaskStore.getState();
      expect(state.tasks[0].id).not.toBe(state.tasks[1].id);
    });

    it('应该支持可选字段', () => {
      const { addTask } = useTaskStore.getState();

      const taskWithOptional = {
        title: 'Task with optional fields',
        status: 'in_progress' as const,
        priority: 'high' as const,
        description: 'Test description',
        assigneeId: 'user123',
        dueDate: Date.now() + 86400000,
        tags: ['urgent', 'important'],
      };

      addTask(taskWithOptional);

      const state = useTaskStore.getState();
      const task = state.tasks[0];

      expect(task.description).toBe('Test description');
      expect(task.assigneeId).toBe('user123');
      expect(task.dueDate).toBeDefined();
      expect(task.tags).toEqual(['urgent', 'important']);
    });
  });

  describe('updateTask', () => {
    it('应该更新任务', () => {
      const { addTask, updateTask } = useTaskStore.getState();

      addTask({ title: 'Original Title', status: 'todo', priority: 'medium' });
      const taskId = useTaskStore.getState().tasks[0].id;

      updateTask(taskId, {
        title: 'Updated Title',
        status: 'done',
      });

      const state = useTaskStore.getState();
      const task = state.tasks[0];

      expect(task.title).toBe('Updated Title');
      expect(task.status).toBe('done');
      expect(task.priority).toBe('medium'); // 未更新的字段保持不变
      expect(task.updatedAt).toBeGreaterThan(task.createdAt);
    });

    it('应该处理不存在的任务ID', () => {
      const { updateTask } = useTaskStore.getState();

      // 不应该抛出错误
      expect(() => {
        updateTask('non-existent-id', { title: 'Updated' });
      }).not.toThrow();
    });

    it('应该支持部分更新', () => {
      const { addTask, updateTask } = useTaskStore.getState();

      addTask({
        title: 'Full Task',
        status: 'todo',
        priority: 'high',
        description: 'Original description',
        assigneeId: 'user1',
      } as any);

      const taskId = useTaskStore.getState().tasks[0].id;

      updateTask(taskId, { title: 'Just update title' });

      const task = useTaskStore.getState().tasks[0];
      expect(task.title).toBe('Just update title');
      expect(task.description).toBe('Original description');
      expect(task.assigneeId).toBe('user1');
    });
  });

  describe('deleteTask', () => {
    it('应该删除任务', () => {
      const { addTask, deleteTask } = useTaskStore.getState();

      addTask({ title: 'Task 1', status: 'todo', priority: 'medium' });
      addTask({ title: 'Task 2', status: 'todo', priority: 'medium' });

      const firstTaskId = useTaskStore.getState().tasks[0].id;

      deleteTask(firstTaskId);

      const state = useTaskStore.getState();
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks.find(t => t.id === firstTaskId)).toBeUndefined();
    });

    it('应该处理不存在的任务ID', () => {
      const { addTask, deleteTask } = useTaskStore.getState();

      addTask({ title: 'Test', status: 'todo', priority: 'low' });
      const initialLength = useTaskStore.getState().tasks.length;

      // 不应该抛出错误
      expect(() => {
        deleteTask('non-existent-id');
      }).not.toThrow();

      expect(useTaskStore.getState().tasks.length).toBe(initialLength);
    });
  });

  describe('setFilter', () => {
    it('应该设置过滤条件', () => {
      const { setFilter } = useTaskStore.getState();

      setFilter('todo');
      expect(useTaskStore.getState().filter).toBe('todo');

      setFilter('done');
      expect(useTaskStore.getState().filter).toBe('done');

      setFilter('all');
      expect(useTaskStore.getState().filter).toBe('all');
    });

    it('应该支持所有有效的过滤值', () => {
      const { setFilter } = useTaskStore.getState();

      const filters = ['all', 'todo', 'in_progress', 'done'] as const;

      filters.forEach(filter => {
        setFilter(filter);
        expect(useTaskStore.getState().filter).toBe(filter);
      });
    });
  });

  describe('getFilteredTasks', () => {
    beforeEach(() => {
      const { setTasks } = useTaskStore.getState();

      setTasks([
        {
          id: 'task1',
          title: 'Todo Task',
          status: 'todo',
          priority: 'high' as const,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'task2',
          title: 'In Progress Task',
          status: 'in_progress',
          priority: 'medium' as const,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'task3',
          title: 'Done Task',
          status: 'done',
          priority: 'low' as const,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'task4',
          title: 'Another Todo Task',
          status: 'todo',
          priority: 'high' as const,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ]);
    });

    it('应该返回所有任务当filter为all', () => {
      const { setFilter, getFilteredTasks } = useTaskStore.getState();

      setFilter('all');
      const filtered = getFilteredTasks();

      expect(filtered).toHaveLength(4);
    });

    it('应该只返回todo任务', () => {
      const { setFilter, getFilteredTasks } = useTaskStore.getState();

      setFilter('todo');
      const filtered = getFilteredTasks();

      expect(filtered).toHaveLength(2);
      expect(filtered.every(t => t.status === 'todo')).toBe(true);
    });

    it('应该只返回in_progress任务', () => {
      const { setFilter, getFilteredTasks } = useTaskStore.getState();

      setFilter('in_progress');
      const filtered = getFilteredTasks();

      expect(filtered).toHaveLength(1);
      expect(filtered[0].status).toBe('in_progress');
    });

    it('应该只返回done任务', () => {
      const { setFilter, getFilteredTasks } = useTaskStore.getState();

      setFilter('done');
      const filtered = getFilteredTasks();

      expect(filtered).toHaveLength(1);
      expect(filtered[0].status).toBe('done');
    });
  });

  describe('持久化', () => {
    it('应该持久化任务到localStorage', () => {
      const { addTask } = useTaskStore.getState();

      addTask({ title: 'Persisted Task', status: 'todo', priority: 'high' });

      const storedData = localStorage.getItem('task-storage');
      expect(storedData).toBeDefined();

      if (storedData) {
        const parsed = JSON.parse(storedData);
        expect(parsed.state.tasks).toHaveLength(1);
        expect(parsed.state.tasks[0].title).toBe('Persisted Task');
      }
    });

    it('应该持久化过滤条件', () => {
      const { setFilter } = useTaskStore.getState();

      setFilter('done');

      const storedData = localStorage.getItem('task-storage');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        expect(parsed.state.filter).toBe('done');
      }
    });

    it('应该从localStorage恢复任务', () => {
      const testTasks = [
        {
          id: 'task_restored1',
          title: 'Restored Task 1',
          status: 'todo' as const,
          priority: 'high' as const,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'task_restored2',
          title: 'Restored Task 2',
          status: 'done' as const,
          priority: 'low' as const,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      localStorage.setItem('task-storage', JSON.stringify({
        state: {
          tasks: testTasks,
          filter: 'all',
        },
      }));

      // 创建新的store实例应该恢复状态
      const state = useTaskStore.getState();
      expect(state.tasks).toHaveLength(2);
      expect(state.tasks[0].title).toBe('Restored Task 1');
      expect(state.filter).toBe('all');
    });
  });

  describe('任务排序', () => {
    it('应该保持添加顺序', () => {
      const { addTask } = useTaskStore.getState();

      addTask({ title: 'Task 1', status: 'todo', priority: 'low' });
      addTask({ title: 'Task 2', status: 'todo', priority: 'medium' });
      addTask({ title: 'Task 3', status: 'todo', priority: 'high' });

      const state = useTaskStore.getState();
      expect(state.tasks[0].title).toBe('Task 1');
      expect(state.tasks[1].title).toBe('Task 2');
      expect(state.tasks[2].title).toBe('Task 3');
    });
  });

  describe('边界情况', () => {
    it('应该处理空任务列表', () => {
      const { getFilteredTasks } = useTaskStore.getState();

      const filtered = getFilteredTasks();
      expect(filtered).toEqual([]);
    });

    it('应该处理没有匹配的过滤', () => {
      const { addTask, setFilter, getFilteredTasks } = useTaskStore.getState();

      addTask({ title: 'Test', status: 'todo', priority: 'low' });

      setFilter('done');
      const filtered = getFilteredTasks();

      expect(filtered).toHaveLength(0);
    });

    it('应该处理更新updatedAt字段', async () => {
      const { addTask, updateTask } = useTaskStore.getState();

      addTask({ title: 'Test', status: 'todo', priority: 'low' });
      const createdAt = useTaskStore.getState().tasks[0].updatedAt;

      // 短暂延迟确保时间戳不同
      await new Promise(resolve => setTimeout(resolve, 10));

      updateTask(useTaskStore.getState().tasks[0].id, { status: 'done' });

      const updatedAt = useTaskStore.getState().tasks[0].updatedAt;

      expect(updatedAt).toBeGreaterThan(createdAt);
    });
  });

  describe('批量操作', () => {
    it('应该支持批量添加任务', () => {
      const { addTask } = useTaskStore.getState();

      for (let i = 0; i < 10; i++) {
        addTask({
          title: `Task ${i}`,
          status: 'todo',
          priority: 'medium',
        });
      }

      const state = useTaskStore.getState();
      expect(state.tasks).toHaveLength(10);
    });

    it('应该支持批量更新任务', () => {
      const { addTask, updateTask } = useTaskStore.getState();

      // 添加多个任务
      const taskIds = [];
      for (let i = 0; i < 5; i++) {
        addTask({
          title: `Task ${i}`,
          status: 'todo',
          priority: 'low',
        });
        taskIds.push(useTaskStore.getState().tasks[i].id);
      }

      // 批量更新状态
      taskIds.forEach(id => {
        updateTask(id, { status: 'done' });
      });

      const state = useTaskStore.getState();
      expect(state.tasks.filter(t => t.status === 'done')).toHaveLength(5);
    });
  });
});
