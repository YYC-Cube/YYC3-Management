/**
 * Task Store
 * 任务状态管理
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigneeId?: string;
  dueDate?: number;
  createdAt: number;
  updatedAt: number;
}

interface TaskState {
  tasks: Task[];
  filter: 'all' | 'todo' | 'in_progress' | 'done';

  // Actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setFilter: (filter: TaskState['filter']) => void;
  getFilteredTasks: () => Task[];
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      filter: 'all',

      setTasks: (tasks) => set({ tasks }),

      addTask: (task) => {
        const id = 'task_' + Date.now() + '_' + Math.random();
        const newTask: Task = {
          ...task,
          id,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      setFilter: (filter) => set({ filter }),

      getFilteredTasks: () => {
        const { tasks, filter } = get();
        if (filter === 'all') return tasks;
        return tasks.filter((t) => t.status === filter);
      },
    }),
    {
      name: 'task-storage',
    }
  )
);
