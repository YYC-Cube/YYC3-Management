import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: number
  username: string
  email: string
  real_name: string
  role: 'admin' | 'manager' | 'user'
  department: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

interface UserState {
  users: User[]
  currentUser: User | null
  loading: boolean
  error: string | null
  setUsers: (users: User[]) => void
  setCurrentUser: (user: User | null) => void
  addUser: (user: User) => void
  updateUser: (id: number, user: Partial<User>) => void
  deleteUser: (id: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      users: [],
      currentUser: null,
      loading: false,
      error: null,
      setUsers: (users) => set({ users }),
      setCurrentUser: (user) => set({ currentUser: user }),
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      updateUser: (id, updatedUser) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...updatedUser } : user
          ),
        })),
      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        })),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ currentUser: state.currentUser }),
    }
  )
)
