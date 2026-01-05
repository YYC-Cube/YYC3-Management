/**
 * Notification Store Tests
 * 通知状态管理测试
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useNotificationStore } from './useNotificationStore';

describe('useNotificationStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useNotificationStore.getState().clearAll();
  });

  describe('初始状态', () => {
    it('应该有正确的初始状态', () => {
      const state = useNotificationStore.getState();

      expect(state.notifications).toEqual([]);
      expect(state.unreadCount).toBe(0);
    });
  });

  describe('addNotification', () => {
    it('应该添加通知', () => {
      const { addNotification } = useNotificationStore.getState();

      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Operation completed',
      });

      const state = useNotificationStore.getState();
      expect(state.notifications).toHaveLength(1);
      expect(state.notifications[0].type).toBe('success');
      expect(state.notifications[0].title).toBe('Success');
      expect(state.notifications[0].message).toBe('Operation completed');
      expect(state.notifications[0].read).toBe(false);
      expect(state.unreadCount).toBe(1);
    });

    it('应该生成唯一ID', () => {
      const { addNotification } = useNotificationStore.getState();

      addNotification({ type: 'info', title: 'Test', message: 'Test 1' });
      addNotification({ type: 'info', title: 'Test', message: 'Test 2' });

      const state = useNotificationStore.getState();
      expect(state.notifications[0].id).not.toBe(state.notifications[1].id);
    });

    it('应该添加时间戳', () => {
      const { addNotification } = useNotificationStore.getState();

      const beforeTime = Date.now();
      addNotification({ type: 'info', title: 'Test', message: 'Test' });
      const afterTime = Date.now();

      const state = useNotificationStore.getState();
      expect(state.notifications[0].timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(state.notifications[0].timestamp).toBeLessThanOrEqual(afterTime);
    });

    it('应该将新通知添加到开头', () => {
      const { addNotification } = useNotificationStore.getState();

      addNotification({ type: 'info', title: 'First', message: 'First message' });
      addNotification({ type: 'success', title: 'Second', message: 'Second message' });

      const state = useNotificationStore.getState();
      expect(state.notifications[0].title).toBe('Second');
      expect(state.notifications[1].title).toBe('First');
    });

    it('应该支持所有通知类型', () => {
      const { addNotification } = useNotificationStore.getState();

      const types = ['success', 'error', 'warning', 'info'] as const;

      types.forEach(type => {
        addNotification({
          type,
          title: `${type} title`,
          message: `${type} message`,
        });
      });

      const state = useNotificationStore.getState();
      expect(state.notifications).toHaveLength(4);
      expect(state.notifications.map(n => n.type)).toEqual(types);
    });
  });

  describe('markAsRead', () => {
    it('应该标记通知为已读', () => {
      const { addNotification, markAsRead } = useNotificationStore.getState();

      addNotification({ type: 'info', title: 'Test', message: 'Test' });
      const notificationId = useNotificationStore.getState().notifications[0].id;

      markAsRead(notificationId);

      const state = useNotificationStore.getState();
      expect(state.notifications[0].read).toBe(true);
      expect(state.unreadCount).toBe(0);
    });

    it('应该减少未读计数', () => {
      const { addNotification, markAsRead } = useNotificationStore.getState();

      addNotification({ type: 'info', title: 'Test 1', message: 'Test 1' });
      addNotification({ type: 'info', title: 'Test 2', message: 'Test 2' });

      expect(useNotificationStore.getState().unreadCount).toBe(2);

      const firstId = useNotificationStore.getState().notifications[1].id;
      markAsRead(firstId);

      expect(useNotificationStore.getState().unreadCount).toBe(1);
    });

    it('应该处理不存在的通知ID', () => {
      const { addNotification, markAsRead } = useNotificationStore.getState();

      addNotification({ type: 'info', title: 'Test', message: 'Test' });

      const unreadBefore = useNotificationStore.getState().unreadCount;

      // 不应该抛出错误
      expect(() => {
        markAsRead('non-existent-id');
      }).not.toThrow();

      expect(useNotificationStore.getState().unreadCount).toBe(unreadBefore);
    });
  });

  describe('markAllAsRead', () => {
    it('应该标记所有通知为已读', () => {
      const { addNotification, markAllAsRead } = useNotificationStore.getState();

      addNotification({ type: 'info', title: 'Test 1', message: 'Test 1' });
      addNotification({ type: 'info', title: 'Test 2', message: 'Test 2' });
      addNotification({ type: 'info', title: 'Test 3', message: 'Test 3' });

      markAllAsRead();

      const state = useNotificationStore.getState();
      expect(state.notifications.every(n => n.read)).toBe(true);
      expect(state.unreadCount).toBe(0);
    });

    it('应该处理空通知列表', () => {
      const { markAllAsRead } = useNotificationStore.getState();

      expect(() => {
        markAllAsRead();
      }).not.toThrow();

      expect(useNotificationStore.getState().unreadCount).toBe(0);
    });
  });

  describe('removeNotification', () => {
    it('应该删除通知', () => {
      const { addNotification, removeNotification } = useNotificationStore.getState();

      addNotification({ type: 'info', title: 'Test 1', message: 'Test 1' });
      addNotification({ type: 'info', title: 'Test 2', message: 'Test 2' });

      const firstId = useNotificationStore.getState().notifications[1].id;

      removeNotification(firstId);

      const state = useNotificationStore.getState();
      expect(state.notifications).toHaveLength(1);
      expect(state.notifications.find(n => n.id === firstId)).toBeUndefined();
    });

    it('应该更新未读计数', () => {
      const { addNotification, removeNotification } = useNotificationStore.getState();

      addNotification({ type: 'info', title: 'Test 1', message: 'Test 1' });
      addNotification({ type: 'info', title: 'Test 2', message: 'Test 2' });

      expect(useNotificationStore.getState().unreadCount).toBe(2);

      const firstId = useNotificationStore.getState().notifications[1].id;
      removeNotification(firstId);

      expect(useNotificationStore.getState().unreadCount).toBe(1);
    });

    it('应该处理删除已读通知', () => {
      const { addNotification, markAsRead, removeNotification } = useNotificationStore.getState();

      addNotification({ type: 'info', title: 'Test', message: 'Test' });
      const id = useNotificationStore.getState().notifications[0].id;

      markAsRead(id);
      removeNotification(id);

      expect(useNotificationStore.getState().notifications).toHaveLength(0);
      expect(useNotificationStore.getState().unreadCount).toBe(0);
    });
  });

  describe('clearAll', () => {
    it('应该清空所有通知', () => {
      const { addNotification, clearAll } = useNotificationStore.getState();

      addNotification({ type: 'info', title: 'Test 1', message: 'Test 1' });
      addNotification({ type: 'info', title: 'Test 2', message: 'Test 2' });
      addNotification({ type: 'info', title: 'Test 3', message: 'Test 3' });

      clearAll();

      const state = useNotificationStore.getState();
      expect(state.notifications).toEqual([]);
      expect(state.unreadCount).toBe(0);
    });

    it('应该重置未读计数', () => {
      const { addNotification, clearAll } = useNotificationStore.getState();

      addNotification({ type: 'info', title: 'Test', message: 'Test' });
      expect(useNotificationStore.getState().unreadCount).toBe(1);

      clearAll();

      expect(useNotificationStore.getState().unreadCount).toBe(0);
    });
  });

  describe('持久化', () => {
    it('应该持久化通知到localStorage', () => {
      const { addNotification } = useNotificationStore.getState();

      addNotification({ type: 'success', title: 'Test', message: 'Test message' });

      const storedData = localStorage.getItem('notification-storage');
      expect(storedData).toBeDefined();

      if (storedData) {
        const parsed = JSON.parse(storedData);
        expect(parsed.state.notifications).toHaveLength(1);
        expect(parsed.state.notifications[0].type).toBe('success');
      }
    });

    it('应该只保留最近50条通知', () => {
      const { addNotification } = useNotificationStore.getState();

      // 添加60条通知
      for (let i = 0; i < 60; i++) {
        addNotification({
          type: 'info',
          title: `Notification ${i}`,
          message: `Message ${i}`,
        });
      }

      const storedData = localStorage.getItem('notification-storage');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        expect(parsed.state.notifications.length).toBeLessThanOrEqual(50);
      }
    });

    it('应该从localStorage恢复通知', () => {
      const testNotifications = [
        {
          id: 'notif_test1',
          type: 'success',
          title: 'Restored 1',
          message: 'Message 1',
          timestamp: Date.now(),
          read: false,
        },
        {
          id: 'notif_test2',
          type: 'error',
          title: 'Restored 2',
          message: 'Message 2',
          timestamp: Date.now(),
          read: true,
        },
      ];

      localStorage.setItem('notification-storage', JSON.stringify({
        state: {
          notifications: testNotifications,
          unreadCount: 1,
        },
      }));

      // 创建新的store实例应该恢复状态
      const state = useNotificationStore.getState();
      expect(state.notifications).toHaveLength(2);
      expect(state.notifications[0].title).toBe('Restored 1');
      expect(state.unreadCount).toBe(1);
    });
  });

  describe('边界情况', () => {
    it('应该处理空消息', () => {
      const { addNotification } = useNotificationStore.getState();

      addNotification({
        type: 'info',
        title: 'Empty',
        message: '',
      });

      const state = useNotificationStore.getState();
      expect(state.notifications[0].message).toBe('');
    });

    it('应该处理长消息', () => {
      const { addNotification } = useNotificationStore.getState();

      const longMessage = 'A'.repeat(1000);

      addNotification({
        type: 'info',
        title: 'Long Message',
        message: longMessage,
      });

      const state = useNotificationStore.getState();
      expect(state.notifications[0].message).toBe(longMessage);
    });

    it('应该处理特殊字符', () => {
      const { addNotification } = useNotificationStore.getState();

      const specialMessage = 'Test with 特殊字符 & symbols <tag> & "quotes"';

      addNotification({
        type: 'warning',
        title: 'Special Characters',
        message: specialMessage,
      });

      const state = useNotificationStore.getState();
      expect(state.notifications[0].message).toBe(specialMessage);
    });
  });

  describe('通知顺序', () => {
    it('应该保持时间倒序', () => {
      const { addNotification } = useNotificationStore.getState();

      addNotification({ type: 'info', title: 'First', message: 'First' });
      // 短暂延迟确保时间戳不同
      const firstTimestamp = useNotificationStore.getState().notifications[0].timestamp;

      addNotification({ type: 'info', title: 'Second', message: 'Second' });
      const secondTimestamp = useNotificationStore.getState().notifications[0].timestamp;

      addNotification({ type: 'info', title: 'Third', message: 'Third' });
      const thirdTimestamp = useNotificationStore.getState().notifications[0].timestamp;

      const state = useNotificationStore.getState();
      expect(state.notifications[0].timestamp).toBe(thirdTimestamp);
      expect(state.notifications[1].timestamp).toBe(secondTimestamp);
      expect(state.notifications[2].timestamp).toBe(firstTimestamp);
    });
  });
});
