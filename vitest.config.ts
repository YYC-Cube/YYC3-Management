import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,

    alias: {
      'jest': 'vitest',
    },
    coverage: {
      provider: 'v8',
      enabled: true,
      reporter: ['text', 'json', 'html'],
      include: ['app/**/*.{tsx,ts}', 'components/**/*.{tsx,ts}'],
      exclude: [
        'node_modules/**',
        '.next/**',
        'dist/**',
        '*.config.*',
        'app/**/*.test.{tsx,ts}',
        'components/**/*.test.{tsx,ts}',
      ],
      reportsDirectory: './coverage',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      'jest': 'vitest',
    },
  },
})
