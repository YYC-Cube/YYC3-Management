import '@testing-library/jest-dom'
import { vi } from 'vitest'

// 添加Jest兼容的全局变量定义
const jestMock = {
  fn: vi.fn,
  mockImplementation: (fn: any) => vi.fn(fn),
  mockRejectedValue: (value: any) => vi.fn().mockRejectedValue(value),
  mockResolvedValue: (value: any) => vi.fn().mockResolvedValue(value),
  mockClear: vi.clearAllMocks,
  resetAllMocks: vi.resetAllMocks,
  spyOn: vi.spyOn,
  advanceTimersByTime: vi.advanceTimersByTime,
  advanceTimersToNextTimer: vi.advanceTimersToNextTimer,
  clearAllTimers: vi.clearAllTimers,
  useFakeTimers: vi.useFakeTimers,
  useRealTimers: vi.useRealTimers,
};

if (typeof window !== 'undefined') {
  (window as any).jest = jestMock;
} else {
  (global as any).jest = jestMock;
}

// 兼容Jest的done()回调
const done = (error?: any) => {
  if (error) {
    throw error;
  }
};

if (typeof window !== 'undefined') {
  (window as any).done = done;
} else {
  (global as any).done = done;
};

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/ai-content-creator',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock next-themes to avoid provider requirements in unit tests
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}))

// Mock fetch API
vi.mock('node-fetch', () => ({
  default: vi.fn(() => Promise.resolve({
    json: () => Promise.resolve({}),
  })),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})