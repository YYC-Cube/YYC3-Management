/**
 * @fileoverview next.config.optimized.mjs
 * @description YYC³ 性能优化配置
 * @version 2.0.0
 * @created 2026-01-05
 *
 * 优化策略：
 * 1. 代码分割和动态导入
 * 2. 图片优化和现代格式
 * 3. 压缩和缓存策略
 * 4. 构建优化
 * 5. 生产环境性能监控
 */

import createNextConfig from 'next/dist/server/config-shared';

const nextConfig = {
  // ==========================================
  // TypeScript 配置
  // ==========================================
  typescript: {
    ignoreBuildErrors: false, // 保持类型检查，确保代码质量
  },

  // ==========================================
  // ESLint 配置
  // ==========================================
  eslint: {
    ignoreDuringBuilds: false, // 保持代码质量检查
  },

  // ==========================================
  // 图片优化配置
  // ==========================================
  images: {
    // 启用图片优化
    unoptimized: false,

    // 支持的现代图片格式
    formats: ['image/avif', 'image/webp'],

    // 图片域名配置（如果使用外部图片）
    domains: [],

    // 远程图片模式（更灵活）
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com', // 替换为实际域名
      },
    ],

    // 设备尺寸（生成响应式图片）
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // 图片尺寸（按需生成）
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // 最小化缓存时间（开发环境）
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30天
  },

  // ==========================================
  // 压缩配置
  // ==========================================
  compress: true, // 启用 gzip 压缩

  // ==========================================
  // 生产环境源码映射（错误追踪）
  // ==========================================
  productionBrowserSourceMaps: false, // 生产环境不生成源码映射（提升性能）

  // ==========================================
  // 实验性功能
  // ==========================================
  experimental: {
    // 启用优化包导入
    optimizePackageImports: [
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
      'lucide-react',
      'framer-motion',
      'recharts',
      'date-fns',
    ],

    // 启用CSS优化
    optimizeCss: true,

    // 启用App Router优化
    appDir: true,

    // 启用服务器组件
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
  },

  // ==========================================
  // Webpack 配置（构建优化）
  // ==========================================
  webpack: (config, { isServer }) => {
    // 生产环境优化
    if (!isServer) {
      // 客户端包优化
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // React核心库
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              priority: 10,
            },

            // UI组件库
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui)[\\/]/,
              name: 'ui',
              priority: 9,
            },

            // 图标库
            icons: {
              test: /[\\/]node_modules[\\/](lucide-react)[\\/]/,
              name: 'icons',
              priority: 8,
            },

            // 图表库
            charts: {
              test: /[\\/]node_modules[\\/](recharts)[\\/]/,
              name: 'charts',
              priority: 7,
            },

            // 动画库
            animation: {
              test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
              name: 'animation',
              priority: 6,
            },

            // 工具库
            utils: {
              test: /[\\/]node_modules[\\/](date-fns|clsx|class-variance-authority|tailwind-merge)[\\/]/,
              name: 'utils',
              priority: 5,
            },

            // AI SDK
            ai: {
              test: /[\\/]node_modules[\\/](ai|@ai-sdk)[\\/]/,
              name: 'ai',
              priority: 4,
            },

            // 状态管理
            state: {
              test: /[\\/]node_modules[\\/](zustand|swr)[\\/]/,
              name: 'state',
              priority: 3,
            },

            // 其他node_modules
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              priority: 1,
              minChunks: 2,
            },
          },
        },
      };
    }

    // 模块解析优化
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        // 项目别名（在tsconfig.json中也定义）
        '@': '/Users/yanyu/Documents/yyc3-mana',
      },
    };

    return config;
  },

  // ==========================================
  // Headers配置（安全性和缓存）
  // ==========================================
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // 安全头部
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },

          // 缓存策略
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // 静态资源缓存
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // 图片缓存
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // ==========================================
  // 重定向配置
  // ==========================================
  async redirects() {
    return [];
  },

  // ==========================================
  // 日志配置
  // ==========================================
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // ==========================================
  // 性能监控
  // ==========================================
  onDemandEntries: {
    // 开发环境页面刷新优化
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 2,
  },

  // ==========================================
  // 输出配置
  // ==========================================
  output: 'standalone', // 独立输出（Docker友好）

  // ==========================================
  // Power By 信息隐藏（安全）
  // ==========================================
  poweredByHeader: false,
};

export default nextConfig;
