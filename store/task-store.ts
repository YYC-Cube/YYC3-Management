import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Task {
  id: number
  title: string
  description: string
  assignee_id: number
  assignee_name: string
  project_id: number | null
  project_name: string | null
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  progress: number
  due_date: string
  created_at: string
  updated_at: string
}

interface TaskState {
  tasks: Task[]
  loading: boolean
  error: string | null
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: number, task: Partial<Task>) => void
  deleteTask: (id: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      loading: false,
      error: null,
      setTasks: (tasks) => set({ tasks }),
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updatedTask } : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'task-storage',
    }
  )
)
