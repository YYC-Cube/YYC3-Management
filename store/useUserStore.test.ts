/**
 * User Store Tests
 * 用户状态管理测试
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from './useUserStore';

describe('useUserStore', () => {
  // 每个测试前重置store
  beforeEach(() => {
    // 清除localStorage
    localStorage.clear();
    // 重置store状态
    useUserStore.getState().logout();
  });

  describe('初始状态', () => {
    it('应该有正确的初始状态', () => {
      const state = useUserStore.getState();

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('setUser', () => {
    it('应该设置用户信息', () => {
      const { setUser } = useUserStore.getState();

      const testUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
      };

      setUser(testUser as any);

      const state = useUserStore.getState();
      expect(state.user).toEqual(testUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('应该更新用户信息', () => {
      const { setUser, updateUser } = useUserStore.getState();

      const initialUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      };

      setUser(initialUser as any);

      updateUser({ name: 'Updated Name' });

      const state = useUserStore.getState();
      expect(state.user?.name).toBe('Updated Name');
      expect(state.user?.email).toBe('test@example.com'); // 其他字段不变
    });
  });

  describe('updateUser', () => {
    it('应该更新用户字段', () => {
      const { setUser, updateUser } = useUserStore.getState();

      setUser({
        id: 'user123',
        email: 'old@example.com',
        name: 'Old Name',
        role: 'user',
      } as any);

      updateUser({
        email: 'new@example.com',
        name: 'New Name',
      });

      const state = useUserStore.getState();
      expect(state.user?.email).toBe('new@example.com');
      expect(state.user?.name).toBe('New Name');
    });

    it('应该处理没有用户的情况', () => {
      const { updateUser } = useUserStore.getState();

      // 不应该抛出错误
      expect(() => {
        updateUser({ name: 'Test' });
      }).not.toThrow();
    });
  });

  describe('logout', () => {
    it('应该清除用户信息', () => {
      const { setUser, logout } = useUserStore.getState();

      setUser({
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      } as any);

      logout();

      const state = useUserStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('应该在没有用户时安全处理', () => {
      const { logout } = useUserStore.getState();

      // 不应该抛出错误
      expect(() => {
        logout();
      }).not.toThrow();

      const state = useUserStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('checkAuth', () => {
    it('应该验证认证状态', async () => {
      const { setUser, checkAuth } = useUserStore.getState();

      // 未认证状态
      expect(useUserStore.getState().isAuthenticated).toBe(false);

      // 设置用户后应该认证
      setUser({
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      } as any);

      await checkAuth();

      expect(useUserStore.getState().isAuthenticated).toBe(true);
    });
  });

  describe('持久化', () => {
    it('应该持久化用户状态到localStorage', () => {
      const { setUser } = useUserStore.getState();

      const testUser = {
        id: 'user456',
        email: 'persist@example.com',
        name: 'Persist User',
        role: 'user',
      };

      setUser(testUser as any);

      // 检查localStorage
      const storedData = localStorage.getItem('user-storage');
      expect(storedData).toBeDefined();

      if (storedData) {
        const parsed = JSON.parse(storedData);
        expect(parsed.state.user).toEqual(testUser);
        expect(parsed.state.isAuthenticated).toBe(true);
      }
    });

    it('应该从localStorage恢复状态', () => {
      const testUser = {
        id: 'user789',
        email: 'restore@example.com',
        name: 'Restore User',
        role: 'admin',
      };

      // 直接写入localStorage模拟持久化数据
      localStorage.setItem('user-storage', JSON.stringify({
        state: {
          user: testUser,
          isAuthenticated: true,
          isLoading: false,
        },
      }));

      // 创建新的store实例应该恢复状态
      const store = useUserStore.getState();
      expect(store.user).toEqual(testUser);
      expect(store.isAuthenticated).toBe(true);
    });

    it('应该清除持久化数据当logout', () => {
      const { setUser, logout } = useUserStore.getState();

      setUser({
        id: 'user999',
        email: 'clear@example.com',
        name: 'Clear User',
        role: 'user',
      } as any);

      // 确保数据被持久化
      const storedBefore = localStorage.getItem('user-storage');
      expect(storedBefore).toBeDefined();

      logout();

      // 数据应该被清除或设置为null
      const storedAfter = localStorage.getItem('user-storage');
      if (storedAfter) {
        const parsed = JSON.parse(storedAfter);
        expect(parsed.state.user).toBeNull();
        expect(parsed.state.isAuthenticated).toBe(false);
      } else {
        // zustand persist可能完全移除key
        expect(storedAfter).toBeNull();
      }
    });
  });

  describe('边界情况', () => {
    it('应该处理null用户更新', () => {
      const { updateUser } = useUserStore.getState();

      expect(() => {
        updateUser(null);
      }).not.toThrow();
    });

    it('应该处理空对象更新', () => {
      const { setUser, updateUser } = useUserStore.getState();

      setUser({
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      } as any);

      updateUser({});

      const state = useUserStore.getState();
      expect(state.user).toBeDefined();
    });

    it('应该处理多次logout', () => {
      const { logout } = useUserStore.getState();

      logout();
      logout();
      logout();

      const state = useUserStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
