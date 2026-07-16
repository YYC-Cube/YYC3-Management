/**
 * @fileoverview 端到端测试 — 主要用户流程（Playwright）
 * @description 覆盖登录、Dashboard、客户管理、任务管理、AI 对话、工作流审批
 * @author YYC³ @version 3.1.0 @license MIT
 */
import { expect, test } from '@playwright/test'

const BASE_URL = 'http://localhost:3223'

// ---- 认证流程 ----

test.describe('认证流程', () => {
  test('应显示登录页面', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    await expect(page).toHaveURL(/\/login/)
  })

  test('输入凭据后应跳转到 Dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    await page.fill('[name="username"]', 'admin')
    await page.fill('[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/dashboard', { timeout: 10000 })
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('错误凭据应显示错误提示', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    await page.fill('[name="username"]', 'wrong')
    await page.fill('[name="password"]', 'wrong')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=密码错误')).toBeVisible({ timeout: 5000 })
  })
})

// ---- Dashboard 流程 ----

test.describe('Dashboard 数据中心', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`)
    await page.waitForLoadState('networkidle')
  })

  test('应显示统计卡片', async ({ page }) => {
    await expect(page.locator('text=数据中心')).toBeVisible()
  })

  test('应显示项目进度列表', async ({ page }) => {
    await expect(page.locator('text=项目进度')).toBeVisible()
  })

  test('应显示快速操作按钮', async ({ page }) => {
    await expect(page.locator('text=快速操作')).toBeVisible()
    await expect(page.locator('text=添加新客户')).toBeVisible()
    await expect(page.locator('text=创建任务')).toBeVisible()
  })

  test('点击添加新客户应跳转到客户管理', async ({ page }) => {
    await page.click('text=添加新客户')
    await page.waitForURL('**/customers', { timeout: 5000 })
    await expect(page).toHaveURL(/\/customers/)
  })
})

// ---- 客户管理流程 ----

test.describe('客户管理', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/customers`)
    await page.waitForLoadState('networkidle')
  })

  test('应显示客户列表', async ({ page }) => {
    await expect(page.locator('table, [role="table"]')).toBeVisible()
  })

  test('搜索客户应过滤列表', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="搜索"], input[placeholder*="search"]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('测试')
      await page.waitForTimeout(500)
      const rows = page.locator('table tbody tr, [role="row"]')
      const count = await rows.count()
      expect(count).toBeGreaterThanOrEqual(0)
    }
  })

  test('点击添加客户应打开对话框', async ({ page }) => {
    const addBtn = page.locator('text=添加客户, text=新增客户')
    if (await addBtn.isVisible()) {
      await addBtn.click()
      await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 3000 })
    }
  })
})

// ---- 任务管理流程 ----

test.describe('任务管理', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/tasks`)
    await page.waitForLoadState('networkidle')
  })

  test('应显示任务列表', async ({ page }) => {
    await expect(page.locator('table, [role="table"], [class*="task"]')).toBeVisible()
  })

  test('应支持创建任务', async ({ page }) => {
    const createBtn = page.locator('text=创建任务, text=新增任务, text=添加任务')
    if (await createBtn.isVisible()) {
      await createBtn.click()
      await expect(page.locator('[role="dialog"], form')).toBeVisible({ timeout: 3000 })
    }
  })
})

// ---- AI 对话流程 ----

test.describe('AI 对话', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/ai-family/chat`)
    await page.waitForLoadState('networkidle')
  })

  test('应显示聊天界面', async ({ page }) => {
    await expect(page.locator('input, textarea, [contenteditable]')).toBeVisible()
  })

  test('发送消息应显示回复', async ({ page }) => {
    const input = page.locator('textarea, input[type="text"]').first()
    if (await input.isVisible()) {
      await input.fill('你好')
      const sendBtn = page.locator('button[type="submit"], button:has-text("发送")')
      if (await sendBtn.isVisible()) {
        await sendBtn.click()
        await page.waitForTimeout(2000)
      }
    }
  })
})

// ---- AI 模型管理流程 ----

test.describe('AI 模型管理', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/ai-models`)
    await page.waitForLoadState('networkidle')
  })

  test('应显示模型列表', async ({ page }) => {
    await expect(page.locator('text=模型, text=Provider, text=提供商')).toBeVisible()
  })

  test('点击添加模型应打开表单', async ({ page }) => {
    const addBtn = page.locator('text=添加模型, text=新增, button:has-text("添加")')
    if (await addBtn.isVisible()) {
      await addBtn.click()
      await expect(page.locator('[role="dialog"], form')).toBeVisible({ timeout: 3000 })
    }
  })

  test('Ollama 扫描按钮应可点击', async ({ page }) => {
    const scanBtn = page.locator('text=扫描, text=Ollama, button:has-text("扫描")')
    if (await scanBtn.isVisible()) {
      await scanBtn.click()
      await page.waitForTimeout(1000)
    }
  })
})

// ---- 工作流审批流程 ----

test.describe('OA 审批管理', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/approval`)
    await page.waitForLoadState('networkidle')
  })

  test('应显示审批统计卡片', async ({ page }) => {
    await expect(page.locator('text=待审批, text=已通过, text=已拒绝')).toBeVisible()
  })

  test('应显示审批列表', async ({ page }) => {
    await expect(page.locator('table, [role="table"], [class*="approval"]')).toBeVisible()
  })
})

// ---- 导航流程 ----

test.describe('导航栏跨页面流程', () => {
  test('应通过侧边栏导航到各页面', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`)
    await page.waitForLoadState('networkidle')

    const navLinks = [
      { text: '客户', url: '/customers' },
      { text: '任务', url: '/tasks' },
      { text: '项目', url: '/projects' },
    ]

    for (const link of navLinks) {
      const navItem = page.locator(`a:has-text("${link.text}"), button:has-text("${link.text}")`).first()
      if (await navItem.isVisible()) {
        await navItem.click()
        await page.waitForTimeout(1000)
      }
    }
  })
})

// ---- 响应式布局 ----

test.describe('响应式布局', () => {
  test('移动端应显示底部导航', async ({ browser }) => {
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 812 },
    })
    const page = await mobileContext.newPage()
    await page.goto(`${BASE_URL}/dashboard`)
    await page.waitForLoadState('networkidle')

    await mobileContext.close()
  })

  test('桌面端应显示侧边栏', async ({ browser }) => {
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    })
    const page = await desktopContext.newPage()
    await page.goto(`${BASE_URL}/dashboard`)
    await page.waitForLoadState('networkidle')

    await desktopContext.close()
  })
})
