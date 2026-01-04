/**
 * User Store
 * 用户状态管理
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
  avatar?: string;
  permissions: string[];
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  checkAuth: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => {
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (updates) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          // 模拟认证检查
          const token = localStorage.getItem('token');
          if (token) {
            // 验证token并获取用户信息
            const mockUser: User = {
              id: 'user_123',
              email: 'admin@yyc3.com',
              name: '管理员',
              role: 'admin',
              permissions: ['read', 'write', 'delete'],
            };
            set({ user: mockUser, isAuthenticated: true });
          }
        } catch (error) {
          console.error('认证检查失败:', error);
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
