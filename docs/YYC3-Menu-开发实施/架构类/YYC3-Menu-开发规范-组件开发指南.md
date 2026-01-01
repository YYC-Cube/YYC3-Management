# 组件开发指南

## 1. 组件架构概述

### 1.1 组件分类
- **基础组件**: 不依赖业务逻辑的通用组件（Button, Input, Modal 等）
- **业务组件**: 包含特定业务逻辑的组件（UserCard, OrderList 等）
- **容器组件**: 负责数据管理和状态的组件
- **展示组件**: 纯展示型组件，通过 props 接收数据

### 1.2 组件设计原则
- **单一职责**: 一个组件只做一件事
- **可组合性**: 组件可以相互嵌套和组合
- **可复用性**: 通过配置和插槽支持不同场景
- **可测试性**: 易于编写和维护测试用例
- **性能优先**: 避免不必要的渲染和计算

## 2. 组件开发规范

### 2.1 文件结构
```
components/
├── ui/                    # 基础 UI 组件
│   ├── button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.stories.tsx
│   │   └── index.ts
│   └── ...
├── business/              # 业务组件
│   ├── user-card/
│   │   ├── UserCard.tsx
│   │   ├── UserCard.test.tsx
│   │   └── index.ts
│   └── ...
└── layouts/               # 布局组件
    ├── Header.tsx
    ├── Sidebar.tsx
    └── ...
```

### 2.2 命名规范
```typescript
// ✅ 正确: PascalCase 命名组件
export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return <div>...</div>;
};

// ✅ 正确: 使用描述性名称
export const UserProfileCard: React.FC = () => { ... };

// ❌ 错误: camelCase 命名
export const userCard: React.FC = () => { ... };

// ❌ 错误: 不够描述性
export const Card: React.FC = () => { ... };
```

### 2.3 Props 定义
```typescript
// ✅ 正确: 使用 TypeScript 接口定义 Props
interface ButtonProps {
  /** 按钮文字 */
  label: string;
  /** 按钮类型 */
  variant?: 'primary' | 'secondary' | 'danger';
  /** 按钮大小 */
  size?: 'small' | 'medium' | 'large';
  /** 是否禁用 */
  disabled?: boolean;
  /** 点击事件处理器 */
  onClick?: () => void;
  /** 子元素 */
  children?: React.ReactNode;
}

// ✅ 正确: 使用默认值
export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  children,
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children || label}
    </button>
  );
};

// ❌ 错误: 使用 any 类型
interface BadProps {
  data: any;
  onClick: any;
}
```

### 2.4 组件组合
```typescript
// ✅ 正确: 使用组合模式
export const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="card">{children}</div>;
};

Card.Header = ({ children }: { children: React.ReactNode }) => {
  return <div className="card-header">{children}</div>;
};

Card.Body = ({ children }: { children: React.ReactNode }) => {
  return <div className="card-body">{children}</div>;
};

Card.Footer = ({ children }: { children: React.ReactNode }) => {
  return <div className="card-footer">{children}</div>;
};

// 使用
<Card>
  <Card.Header>标题</Card.Header>
  <Card.Body>内容</Card.Body>
  <Card.Footer>底部</Card.Footer>
</Card>
```

## 3. 状态管理

### 3.1 局部状态 (useState)
```typescript
// ✅ 正确: 简单状态使用 useState
const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
    </div>
  );
};
```

### 3.2 复杂状态 (useReducer)
```typescript
// ✅ 正确: 复杂状态使用 useReducer
type State = {
  count: number;
  step: number;
};

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setStep'; payload: number };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'setStep':
      return { ...state, step: action.payload };
    default:
      return state;
  }
};

const Counter: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <input
        type="number"
        value={state.step}
        onChange={(e) =>
          dispatch({ type: 'setStep', payload: Number(e.target.value) })
        }
      />
    </div>
  );
};
```

### 3.3 全局状态 (Context)
```typescript
// ✅ 正确: 使用 Context 共享状态
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

## 4. 副作用处理

### 4.1 useEffect 基本用法
```typescript
// ✅ 正确: 依赖数组明确
useEffect(() => {
  fetchData(userId);
}, [userId]);

// ✅ 正确: 清理副作用
useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick');
  }, 1000);

  return () => clearInterval(timer);
}, []);

// ❌ 错误: 缺少依赖
useEffect(() => {
  fetchData(userId);
}, []); // userId 应该在依赖数组中
```

### 4.2 数据获取
```typescript
// ✅ 正确: 使用自定义 Hook 封装
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await api.getUser(userId);
        if (!cancelled) {
          setUser(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { user, loading, error };
}

// 使用
const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const { user, loading, error } = useUser(userId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>User not found</div>;

  return <div>{user.name}</div>;
};
```

## 5. 性能优化

### 5.1 React.memo
```typescript
// ✅ 正确: 使用 memo 避免不必要的重渲染
export const ExpensiveComponent = React.memo<{ data: Data }>(
  ({ data }) => {
    return <div>{/* 复杂的渲染逻辑 */}</div>;
  },
  (prevProps, nextProps) => {
    // 自定义比较函数
    return prevProps.data.id === nextProps.data.id;
  }
);
```

### 5.2 useMemo 和 useCallback
```typescript
// ✅ 正确: 缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// ✅ 正确: 缓存函数引用
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// ❌ 错误: 过度使用
const simpleValue = useMemo(() => a + b, [a, b]); // 简单计算不需要 memoization
```

### 5.3 代码分割
```typescript
// ✅ 正确: 使用 React.lazy 和 Suspense
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

## 6. 错误处理

### 6.1 错误边界
```typescript
// ✅ 正确: 创建错误边界
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// 使用
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

### 6.2 异步错误处理
```typescript
// ✅ 正确: 妥善处理异步错误
const AsyncComponent: React.FC = () => {
  const [error, setError] = useState<Error | null>(null);

  const handleAction = async () => {
    try {
      await riskyOperation();
    } catch (err) {
      setError(err as Error);
      // 可选: 上报错误到监控系统
      reportError(err);
    }
  };

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => setError(null)} />;
  }

  return <button onClick={handleAction}>执行操作</button>;
};
```

## 7. 测试规范

### 7.1 组件测试
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button label="Click me" disabled />);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

### 7.2 Hook 测试
```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('increments counter', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

## 8. 最佳实践

### 8.1 避免 Prop Drilling
```typescript
// ✅ 正确: 使用 Context 避免多层传递
const UserContext = createContext<User | null>(null);

function App() {
  const [user] = useState<User>(/* ... */);
  return (
    <UserContext.Provider value={user}>
      <Layout />
    </UserContext.Provider>
  );
}

function DeepComponent() {
  const user = useContext(UserContext);
  return <div>{user?.name}</div>;
}
```

### 8.2 保持组件纯净
```typescript
// ✅ 正确: 纯组件
const UserCard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
};

// ❌ 错误: 副作用在渲染中
const UserCard: React.FC<{ user: User }> = ({ user }) => {
  updateAnalytics(user); // 不应在渲染时执行副作用
  return <div>{user.name}</div>;
};
```

### 8.3 使用 TypeScript
```typescript
// ✅ 正确: 完整的类型定义
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  return (
    <div>
      <h3>{user.name}</h3>
      {onEdit && <button onClick={() => onEdit(user)}>编辑</button>}
    </div>
  );
};
```

---

**遵循本指南，开发高质量、可维护的 React 组件。**
