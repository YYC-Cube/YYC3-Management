/**
 * @fileoverview Playwright 端到端测试配置
 * @author YYC³ @version 3.1.0 @license MIT
 */
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'tests/e2e-report' }], ['json', { outputFile: 'tests/e2e-report/results.json' }]],

  use: {
    baseURL: 'http://localhost:3223',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3223',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
})
