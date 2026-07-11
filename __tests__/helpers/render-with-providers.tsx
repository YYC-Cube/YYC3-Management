import { render, type RenderOptions } from '@testing-library/react'
import { type ReactElement, type ReactNode } from 'react'
import { vi } from 'vitest'

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
    get: vi.fn(() => null),
  }),
  usePathname: () => '/',
  redirect: vi.fn(),
}))

interface WrapperOptions {
  withTheme?: boolean
  withI18n?: boolean
}

function AllProviders({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function renderWithProviders(
  ui: ReactElement,
  options?: WrapperOptions & Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options })
}

export function renderWithRouter(
  ui: ReactElement,
  { route = '/', ...options }: { route?: string } & RenderOptions = {}
) {
  return renderWithProviders(ui, options)
}
