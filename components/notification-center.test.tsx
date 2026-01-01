import { render, screen } from '@testing-library/react'
import { NotificationCenter } from '@/components/notification-center'

describe('NotificationCenter', () => {
  test('renders heading and actions', () => {
    render(<NotificationCenter />)
    expect(screen.getByRole('heading', { name: '通知中心' })).toBeInTheDocument()
    expect(screen.getByText('全部已读')).toBeInTheDocument()
    // 存在同名 Tab 与操作按钮，限定为按钮角色以避免歧义
    expect(screen.getByRole('button', { name: '通知设置' })).toBeInTheDocument()
  })
})
