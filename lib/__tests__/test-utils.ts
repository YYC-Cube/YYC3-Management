import { render, renderHook, screen } from '@testing-library/react';
import { ReactElement } from 'react';

export function renderWithProviders(
  ui: ReactElement,
  options = {}
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <div>{children}</div>;
  };

  return render(ui, { wrapper: Wrapper, ...options });
}

export { render, renderHook, screen };

export const mockData = {
  user: {
    id: 'user_123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'admin',
  },
  customer: {
    id: 'customer_123',
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '+86138****1234',
    company: '示例公司',
  },
  task: {
    id: 'task_123',
    title: '测试任务',
    description: '这是一个测试任务',
    status: 'pending',
    priority: 'medium',
    assigneeId: 'user_123',
  },
  aiMessage: {
    id: 'msg_123',
    role: 'assistant',
    content: '这是一个AI回复',
    timestamp: new Date().toISOString(),
  },
};

export const mockApiResponse = {
  success: true,
  data: {},
  message: '操作成功',
  timestamp: new Date().toISOString(),
};

export const waitForCondition = async (
  condition: () => boolean,
  timeout = 5000
): Promise<void> => {
  const startTime = Date.now();
  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Condition timeout');
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
};
