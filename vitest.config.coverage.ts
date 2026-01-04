import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vitest配置 - 覆盖率专用
 *
 * 此配置专门用于生成测试覆盖率报告
 * 排除大型目录以避免内存问题
 */
export default defineConfig({
  plugins: [react()],

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    isolate: false,

    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'vitest.setup.ts',
        '**/*.config.{js,ts}',
        '**/types/',
        '**/__tests__/',
        '**/dist/',
        '**/build/',
        '**/.next/',
        '**/coverage/',
        '**/*.d.ts',
        'core/**/*', // 排除 core 目录
        'scripts/**/*',
        '**/*.test.{ts,tsx}',
      ],
      lines: 60,
      functions: 60,
      branches: 60,
      statements: 60,
      maxConcurrency: 2,
    },

    include: [
      'lib/**/*.{test,spec}.{ts,tsx}',
      'components/**/*.{test,spec}.{ts,tsx}',
    ],
    exclude: [
      'node_modules/',
      'dist/',
      'build/',
      '.next/',
      'core/**',
      'scripts/**',
    ],

    testTimeout: 10000,
    hookTimeout: 10000,
    threads: false,
    maxThreads: 1,
    minThreads: 1,
    reporters: ['default'],
    watch: false,

    includeSource: ['lib/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './components'),
      '@/app': path.resolve(__dirname, './app'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/core': path.resolve(__dirname, './core'),
      '@/types': path.resolve(__dirname, './types'),
      '@/store': path.resolve(__dirname, './store'),
    },
  },

  esbuild: {
    target: 'esnext',
    jsx: 'automatic',
    minify: false,
    sourcemap: true,
  },

  optimizeDeps: {
    disabled: true,
  },
});
