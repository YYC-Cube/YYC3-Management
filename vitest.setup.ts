import '@testing-library/jest-dom';
import { vi } from 'vitest';

beforeEach(() => {
  vi.clearAllMocks();
});

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
  redirect: vi.fn(),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: Record<string, unknown>) => {
    const React = require('react')
    return React.createElement('img', { src, alt, ...props })
  },
}));

const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => localStorageMock.store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => { localStorageMock.store[key] = value; }),
  removeItem: vi.fn((key: string) => { delete localStorageMock.store[key]; }),
  clear: vi.fn(() => { localStorageMock.store = {}; }),
  get length() { return Object.keys(localStorageMock.store).length; },
  key: vi.fn((index: number) => Object.keys(localStorageMock.store)[index] ?? null),
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

class MockWebSocket {
  url: string;
  readyState: number = 0;
  constructor(url: string) { this.url = url; }
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  send = vi.fn();
  close = vi.fn();
  open = vi.fn();
}
globalThis.WebSocket = MockWebSocket as unknown as typeof WebSocket;

globalThis.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ success: true, data: [] }),
    text: () => Promise.resolve('{}'),
    headers: new Headers(),
    clone: function() { return this; },
  })
) as unknown as typeof fetch;

class MockIntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}
globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3223';
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:3223';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only-32chars';
process.env.NODE_ENV = 'test';

// Radix UI Tabs 在 jsdom 中无法可靠渲染非激活面板内容
// 使用轻量 mock 替代，使所有 TabsContent 始终渲染并保持 role="tabpanel"
vi.mock('@/components/ui/tabs', () => {
  const React = require('react')

  const TabsContext = React.createContext<{ value: string; setValue: (v: string) => void }>({
    value: '',
    setValue: () => {},
  })

  const Tabs = ({ children, defaultValue, value, onValueChange, ...props }: Record<string, unknown>) => {
    const [internalValue, setInternalValue] = React.useState(value ?? defaultValue ?? '')
    const currentValue = value ?? internalValue
    const setValue = React.useCallback((newValue: string) => {
      if (value === undefined) setInternalValue(newValue)
      onValueChange?.(newValue)
    }, [value, onValueChange])

    return React.createElement(
      TabsContext.Provider,
      { value: { value: currentValue, setValue } },
      React.createElement('div', props, children)
    )
  }

  const TabsList = React.forwardRef(({ children, ...props }: any, ref: any) =>
    React.createElement('div', { ref, role: 'tablist', ...props }, children)
  )
  TabsList.displayName = 'TabsList'

  const TabsTrigger = React.forwardRef(({ children, value, ...props }: any, ref: any) => {
    const ctx = React.useContext(TabsContext)
    const isActive = ctx.value === value
    return React.createElement(
      'button',
      {
        ref,
        role: 'tab',
        type: 'button',
        'data-state': isActive ? 'active' : 'inactive',
        'data-value': value,
        'aria-selected': isActive,
        onClick: (e: any) => { e.preventDefault(); ctx.setValue(value) },
        ...props,
      },
      children
    )
  })
  TabsTrigger.displayName = 'TabsTrigger'

  const TabsContent = React.forwardRef(({ children, value, ...props }: any, ref: any) => {
    const ctx = React.useContext(TabsContext)
    const isActive = ctx.value === value
    return React.createElement(
      'div',
      {
        ref,
        role: 'tabpanel',
        'data-state': isActive ? 'active' : 'inactive',
        'data-value': value,
        hidden: false,
        ...props,
      },
      children
    )
  })
  TabsContent.displayName = 'TabsContent'

  return { Tabs, TabsList, TabsTrigger, TabsContent }
})
