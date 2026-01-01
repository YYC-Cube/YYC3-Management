import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import NotificationsPage from './page'

describe('NotificationsPage', () => {
  beforeEach(() => {
    render(<NotificationsPage />)
  })

  test('should render page title and description', () => {
    expect(screen.getByText('通知中心')).toBeInTheDocument()
    expect(screen.getByText('查看和管理您的所有通知消息')).toBeInTheDocument()
  })

  test('should render all statistics cards', () => {
    // 检查全部通知卡片
    expect(screen.getByText('全部通知')).toBeInTheDocument()
    const allNotificationsCard = screen.getByText('全部通知').closest('.border-r-blue-400')
    expect(allNotificationsCard?.querySelector('.text-3xl')).toHaveTextContent('5')

    // 检查未读消息卡片
    expect(screen.getByText('未读消息')).toBeInTheDocument()
    const unreadCard = screen.getByText('未读消息').closest('.border-r-red-400')
    expect(unreadCard?.querySelector('.text-3xl')).toHaveTextContent('2')

    // 检查重要通知卡片
    expect(screen.getByText('重要通知')).toBeInTheDocument()
    const importantCard = screen.getByText('重要通知').closest('.border-r-orange-400')
    expect(importantCard?.querySelector('.text-3xl')).toHaveTextContent('1')

    // 检查处理率卡片
    expect(screen.getByText('处理率')).toBeInTheDocument()
    const rateCard = screen.getByText('处理率').closest('.border-r-green-400')
    expect(rateCard?.querySelector('.text-3xl')).toHaveTextContent('95%')
  })

  test('should render notification management buttons', () => {
    expect(screen.getByText('全部标记已读')).toBeInTheDocument()
    expect(screen.getByText('清空已读')).toBeInTheDocument()
  })

  test('should render all filter tabs with correct counts', () => {
    expect(screen.getByText('全部 (5)')).toBeInTheDocument()
    expect(screen.getByText('未读 (2)')).toBeInTheDocument()
    expect(screen.getByText('重要 (1)')).toBeInTheDocument()
  })

  test('should display all notifications by default', () => {
    // 使用更精确的选择器定位通知项
    const notificationItems = document.querySelectorAll('.space-y-4 > .flex.items-start.gap-4.p-4.border.rounded-lg')
    expect(notificationItems.length).toBe(5)
  })

  test('should filter notifications when clicking on tabs', async () => {
    // 使用data-value属性定位标签页
    const allTab = document.querySelector('[data-value="all"]')
    const unreadTab = document.querySelector('[data-value="unread"]')
    const importantTab = document.querySelector('[data-value="important"]')
    
    // 点击未读标签
    if (unreadTab) {
      fireEvent.click(unreadTab)
      await waitFor(() => {
        let notificationItems = document.querySelectorAll('.space-y-4 > .flex.items-start.gap-4.p-4.border.rounded-lg')
        expect(notificationItems.length).toBe(2)
      })
    }

    // 点击重要标签
    if (importantTab) {
      fireEvent.click(importantTab)
      await waitFor(() => {
        let notificationItems = document.querySelectorAll('.space-y-4 > .flex.items-start.gap-4.p-4.border.rounded-lg')
        expect(notificationItems.length).toBe(1)
      })
    }

    // 点击全部标签回到初始状态
    if (allTab) {
      fireEvent.click(allTab)
      await waitFor(() => {
        let notificationItems = document.querySelectorAll('.space-y-4 > .flex.items-start.gap-4.p-4.border.rounded-lg')
        expect(notificationItems.length).toBe(5)
      })
    }
  })

  test('should render notification items with correct content', () => {
    // 检查第一个通知
    expect(screen.getByText('新任务分配')).toBeInTheDocument()
    expect(screen.getByText('您有一个新的任务需要处理：客户资料整理')).toBeInTheDocument()
    expect(screen.getByText('5分钟前')).toBeInTheDocument()
    expect(screen.getByText('来自: 张三')).toBeInTheDocument()

    // 检查第二个通知
    expect(screen.getByText('会议提醒')).toBeInTheDocument()
    expect(screen.getByText('团队周会将在30分钟后开始，请准时参加')).toBeInTheDocument()
    expect(screen.getByText('25分钟前')).toBeInTheDocument()
    expect(screen.getByText('来自: 系统')).toBeInTheDocument()
  })

  test('should display correct priority badges', () => {
    // 使用更精确的选择器定位优先级标签
    const notificationItems = document.querySelectorAll('.space-y-4 > .flex.items-start.gap-4.p-4.border.rounded-lg')
    expect(notificationItems.length).toBe(5)
    
    // 检查第一个通知的优先级标签
    const firstNotificationBadge = notificationItems[0].querySelector('.text-xs.font-semibold')
    expect(firstNotificationBadge?.textContent).toContain('紧急')
  })

  test('should show unread indicators for unread notifications', () => {
    const unreadIndicators = document.querySelectorAll('.space-y-4 > .flex.items-start.gap-4.p-4.border.rounded-lg .bg-blue-500.rounded-full')
    expect(unreadIndicators.length).toBe(2) // 有两个未读通知
  })

  test('should apply different styles to read and unread notifications', () => {
    // 检查未读通知的样式
    const notificationItems = Array.from(document.querySelectorAll('.space-y-4 > .flex.items-start.gap-4.p-4.border.rounded-lg'))
    const unreadNotifications = notificationItems.filter(item => 
      item.classList.contains('bg-blue-50') && item.classList.contains('border-blue-200')
    )
    expect(unreadNotifications.length).toBe(2)

    // 检查已读通知的样式
    const readNotifications = notificationItems.filter(item => 
      item.classList.contains('bg-white') && item.classList.contains('border-gray-200')
    )
    expect(readNotifications.length).toBe(3)
  })
})
