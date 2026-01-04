import '@testing-library/jest-dom';
import { vi } from 'vitest';

// 全局测试设置
beforeEach(() => {
  // 每个测试前清空所有 mocks
  vi.clearAllMocks();
});

// Mock Next.js 路由
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '/',
}));

// Mock Next.js 图片优化
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => ({
    src,
    alt,
    ...props,
    // 返回一个简单的对象表示
  }),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

global.localStorage = localStorageMock as any;

// Mock WebSocket
class MockWebSocket {
  url: string;
  readyState: number = 0;

  constructor(url: string) {
    this.url = url;
  }

  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  send = vi.fn();
  close = vi.fn();
  open = vi.fn();
}

global.WebSocket = MockWebSocket as any;

// Mock 环境变量
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3200';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
