import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Project {
  id: number
  name: string
  description: string
  manager_id: number
  manager_name: string
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled'
  progress: number
  budget: number
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
}

interface ProjectState {
  projects: Project[]
  loading: boolean
  error: string | null
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (id: number, project: Partial<Project>) => void
  deleteProject: (id: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [],
      loading: false,
      error: null,
      setProjects: (projects) => set({ projects }),
      addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (id, updatedProject) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, ...updatedProject } : project
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        })),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'project-storage',
    }
  )
)
