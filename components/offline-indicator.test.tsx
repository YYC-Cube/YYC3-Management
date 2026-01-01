import { render, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { OfflineIndicator } from '@/components/offline-indicator'
import { vi } from 'vitest'

describe('OfflineIndicator', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('shows offline message when network goes offline, then online', () => {
    // Ensure navigator.onLine starts as true
    Object.defineProperty(window.navigator, 'onLine', { value: true, configurable: true })
    const { rerender } = render(<OfflineIndicator />)

    // Initially not visible
    expect(screen.queryByText('网络连接断开')).toBeNull()

    // Simulate offline
    act(() => {
      Object.defineProperty(window.navigator, 'onLine', { value: false })
      window.dispatchEvent(new Event('offline'))
    })
    // Now shows offline state
    expect(screen.getByText('网络连接断开')).toBeInTheDocument()
    expect(screen.getByText('离线')).toBeInTheDocument()

    // Simulate back online
    act(() => {
      Object.defineProperty(window.navigator, 'onLine', { value: true })
      window.dispatchEvent(new Event('online'))
    })
    // Online message appears
    expect(screen.getByText('网络连接已恢复')).toBeInTheDocument()

    // After timeout, indicator hides
    act(() => {
      vi.runAllTimers()
    })
    rerender(<OfflineIndicator />)
    expect(screen.queryByText('网络连接已恢复')).toBeNull()
  })
})
