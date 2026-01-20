import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  test: {
    // 测试环境配置
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    isolate: false, // 禁用隔离以提高性能

    // 并行执行配置
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        minThreads: 2,
        maxThreads: 4, // 增加线程数以支持并行执行
        useAtomics: true,
      },
    },

    // 测试文件并行执行
    fileParallelism: true,
    maxConcurrency: 4, // 增加并发数

    // 覆盖率配置 - 使用 istanbul 替代 v8 (更稳定)
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html', 'lcov'],
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
        'core/**/*',
      ],
      // 覆盖率目标
      lines: 60,
      functions: 60,
      branches: 60,
      statements: 60,
      // 并行覆盖率收集
      cleanOnRerun: true,
      all: false, // 只测试覆盖到的文件
      // 降低内存使用
      maxConcurrency: 2,
    },

    // 测试文件匹配模式
    include: [
      '**/__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}',
      '**/*.{test,spec}.{js,jsx,ts,tsx}',
    ],
    exclude: [
      'node_modules/',
      'dist/',
      'build/',
      '.next/',
      'core/**', // 暂时排除 core 目录
    ],

    // 超时配置 - 优化超时时间
    testTimeout: 5000, // 减少超时时间
    hookTimeout: 5000,

    // 并行配置 - 启用多线程以提高性能
    threads: true,
    maxThreads: 4,
    minThreads: 2,

    // 报告器 - 添加性能报告
    reporters: ['default', 'json'],

    // 监听模式配置
    watch: false, // 禁用监听以避免内存问题

    // 优化选项
    benchmark: {
      include: ['**/*.{bench,benchmark}.{js,jsx,ts,tsx}'],
    },

    // 限制文件扫描
    includeSource: ['lib/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
  },

  // 路径别名配置
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

  // esbuild 优化
  esbuild: {
    target: 'esnext',
    // 降低内存使用
    jsx: 'automatic',
    // 优化选项
    minify: false,
    sourcemap: true,
  },

  // 优化依赖预构建
  optimizeDeps: {
    disabled: true, // 禁用依赖预构建以减少初始加载时间
  },
});
