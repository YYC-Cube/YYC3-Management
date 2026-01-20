# 🔖 YYC³ 企业智能管理系统

> 「YanYuCloudCube」  
> 「<admin@0379.email>」  
> 「万象归元于云枢 丨深栈智启新纪元」  
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

---

![YYC³ Enterprise Management System](public/git_1800_450-6.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.2+-black.svg)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18.2+-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38bdf8.svg)](https://tailwindcss.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/YY-Nexus/yyc3-mana/pulls)
[![Code Style: Prettier](https://img.shields.io/badge/Code_Style-Prettier-f5a623.svg)](https://prettier.io)
[![Build Status](https://img.shields.io/badge/Build-Passing-success.svg)](https://github.com/YY-Nexus/yyc3-mana/actions)
[![Maintainability](https://img.shields.io/badge/Maintainability-Excellent-brightgreen.svg)](https://github.com/YY-Nexus/yyc3-mana)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Mobile-lightgrey.svg)](https://github.com/YY-Nexus/yyc3-mana)
[![Node Version](https://img.shields.io/badge/Node-18.0+-green.svg)](https://nodejs.org)
[![NPM Version](https://img.shields.io/badge/NPM-9.0+-red.svg)](https://npmjs.com)

**一个现代化的企业级管理系统，基于 Next.js 14、React 18 和 TypeScript 构建**  
**集成智能自愈生态系统，提供完整的业务管理和AI赋能解决方案**

[快速开始](#快速开始) • [功能特色](#-项目特性) • [技术栈](#-技术栈) • [许可证](#-许可证)

---

## 📋 目录

- [🎯 项目概述](#-项目概述)
- [⚡ 快速开始](#快速开始)
- [🚀 项目特性](#-项目特性)
- [📋 技术栈](#-技术栈)
- [📁 项目结构](#-项目结构)
- [🐳 部署指南](#-部署指南)
- [📄 许可证](#-许可证)
- [🤝 贡献指南](#-贡献指南)

---

## 🎯 项目概述

### 项目背景

YYC³企业智能管理系统是一个全面的企业数字化转型解决方案，旨在通过AI技术赋能，帮助企业提升管理效率、优化业务流程、增强数据分析能力。

### 核心价值

- 🚀 **高效开发**：基于Next.js 14和React 18，提供极致的开发体验
- 🤖 **AI赋能**：集成10+种AI模型，支持本地和云端部署
- 🔄 **敏捷灵活**：模块化架构，易于扩展和定制
- 📱 **多端支持**：完美适配桌面、平板、移动设备

## 🚀 项目特性

### 核心功能

- 🔐 **完整认证系统** - JWT Token认证、路由保护、会话管理
- 📊 **智能仪表板** - 实时数据展示、图表分析、KPI监控
- 🤖 **AI智能助手** - 支持本地和云端多种大模型
- 👥 **客户管理** - 客户生命周期、满意度跟踪、关系维护
- 📋 **任务管理** - 项目协作、进度跟踪、依赖管理
- 💰 **财务模块** - 收支管理、报表生成、预算控制
- 📈 **数据分析** - BI报表、趋势分析、业务洞察
- 🎯 **OKR管理** - 目标设定、关键结果跟踪、绩效评估

### 技术特性

- ⚡ **高性能** - Next.js 14 App Router、服务端渲染、静态生成
- 📱 **响应式设计** - 完美适配桌面端、平板、移动设备
- 🎨 **现代UI** - Tailwind CSS、shadcn/ui、流畅动画
- 🔄 **离线优先** - PWA支持、离线数据缓存、网络状态检测
- 🛡️ **类型安全** - 完整TypeScript支持、严格类型检查
- 🔧 **可扩展** - 模块化架构、组件复用、插件系统

## 📋 技术栈

### 前端框架

- **Next.js 14** - React全栈框架，App Router
- **React 18** - 用户界面库，支持并发特性
- **TypeScript** - 静态类型检查，提升开发体验

### 后端框架

- **Next.js API Routes** - 服务端API路由
- **PostgreSQL** - 关系型数据库
- **Redis** - 缓存和会话存储
- **Repository Pattern** - 数据访问层抽象

### UI组件库

- **Tailwind CSS** - 原子化CSS框架
- **shadcn/ui** - 高质量React组件库
- **Lucide React** - 现代化图标库
- **Recharts** - 数据可视化图表库

### 状态管理

- **React Context** - 全局状态管理
- **React Hooks** - 组件状态和副作用管理
- **Local Storage** - 本地数据持久化

### 数据库

- **PostgreSQL** - 主数据库，存储业务数据
- **Redis** - 缓存层，提升查询性能
- **Database Migrations** - 数据库版本管理和迁移

### AI集成

- **AI SDK** - Vercel AI SDK，统一AI模型接口
- **多模型支持** - 百度文心、阿里通义、智谱GLM等
- **本地模型** - Ollama、LM Studio本地部署支持

### 开发工具

- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Husky** - Git钩子管理
- **TypeScript** - 静态类型检查
- **Vitest** - 单元测试框架

## 🛠️ 安装和运行

### 环境要求

- Node.js 18.0+
- npm 9.0+ 或 yarn 1.22+
- Git

### 快速开始

```bash
git clone https://github.com/YY-Nexus/yyc3-mana.git
npm install
npm run dev
npm run build
npm start
```

### 环境变量配置

创建 `.env.local` 文件：

```env
# API配置
NEXT_PUBLIC_API_BASE_URL=https://api.zy.baby
NEXT_PUBLIC_APP_NAME=企业管理系统

# AI模型配置
BAIDU_API_KEY=your_baidu_api_key
BAIDU_SECRET_KEY=your_baidu_secret_key
ALIBABA_API_KEY=your_alibaba_api_key
ZHIPU_API_KEY=your_zhipu_api_key

# 本地模型配置
OLLAMA_BASE_URL=http://localhost:11434
LM_STUDIO_BASE_URL=http://localhost:1234

# 数据库配置（可选）
DATABASE_URL=postgresql://user:password@localhost:5432/enterprise_db

# 认证配置
JWT_SECRET=your_jwt_secret_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## 📁 项目结构

```text
enterprise-management-system/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # 认证相关页面
│   │   └── login/                # 登录页面
│   ├── api/                      # API路由
│   │   ├── health/               # 健康检查
│   │   ├── users/                # 用户管理API
│   │   ├── customers/            # 客户管理API
│   │   ├── tasks/                # 任务管理API
│   │   ├── projects/             # 项目管理API
│   │   ├── notifications/         # 通知管理API
│   │   └── system/              # 系统设置API
│   ├── dashboard/                # 仪表板
│   ├── customers/                # 客户管理
│   ├── tasks/                    # 任务管理
│   ├── finance/                  # 财务管理
│   ├── analytics/                # 数据分析
│   ├── ai-assistant/             # AI助手
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 首页
│   └── globals.css               # 全局样式
├── components/                   # React组件
│   ├── ui/                       # 基础UI组件
│   ├── charts/                   # 图表组件
│   ├── dialogs/                  # 对话框组件
│   ├── layout/                   # 布局组件
│   ├── header.tsx                # 头部组件
│   ├── sidebar.tsx               # 侧边栏组件
│   └── ...                       # 业务组件
├── contexts/                     # React Context
│   └── AuthContext.tsx           # 认证上下文
├── hooks/                        # 自定义Hooks
│   └── use-toast.ts              # Toast通知Hook
├── lib/                          # 工具库
│   ├── api/                      # API工具
│   │   ├── response-handler.ts    # 响应处理
│   │   ├── validation.ts         # 数据验证
│   │   ├── logger.ts            # 日志记录
│   │   └── middleware.ts       # 中间件
│   ├── db/                       # 数据库
│   │   ├── client.ts            # 数据库客户端
│   │   ├── redis.ts             # Redis客户端
│   │   ├── models/              # 数据模型
│   │   │   ├── user.ts
│   │   │   ├── customer.ts
│   │   │   ├── task.ts
│   │   │   ├── project.ts
│   │   │   ├── notification.ts
│   │   │   └── system.ts
│   │   └── repositories/        # 数据仓库
│   │       ├── user.repository.ts
│   │       ├── customer.repository.ts
│   │       ├── task.repository.ts
│   │       ├── project.repository.ts
│   │       ├── notification.repository.ts
│   │       └── system.repository.ts
│   ├── ai-service.ts             # AI服务
│   ├── ai-models.ts              # AI模型配置
│   ├── design-system.ts          # 设计系统
│   └── utils.ts                  # 工具函数
├── migrations/                   # 数据库迁移
│   ├── 001_create_users_table.sql
│   ├── 002_create_customers_table.sql
│   ├── 003_create_tasks_table.sql
│   ├── 004_create_projects_table.sql
│   ├── 005_create_notifications_table.sql
│   ├── 006_create_system_settings_table.sql
│   ├── 007_create_system_logs_table.sql
│   ├── 008_create_finance_records_table.sql
│   ├── 009_create_okr_objectives_table.sql
│   ├── 010_create_okr_key_results_table.sql
│   ├── 011_create_updated_at_triggers.sql
│   └── 012_create_migrations_table.sql
├── scripts/                      # 脚本工具
│   ├── run-migrations.ts        # 运行迁移
│   └── seed.ts                  # 数据种子
├── tests/                        # 测试文件
│   ├── api/                     # API测试
│   │   ├── repositories.test.ts
│   │   ├── validation.test.ts
│   │   └── integration.test.ts
│   └── ...
├── public/                       # 静态资源
│   ├── images/                   # 图片资源
│   ├── icons/                    # 图标资源
│   ├── manifest.json             # PWA配置
│   └── sw.js                     # Service Worker
├── docs/                         # 文档
│   ├── API-Documentation.md    # API文档
│   ├── navigation-analysis-report.tsx  # 导航分析报告
│   ├── optimization-report.tsx         # 优化报告
│   └── application-analysis-report.tsx # 应用分析报告
├── middleware.ts                 # Next.js中间件
├── next.config.js                # Next.js配置
├── tailwind.config.js            # Tailwind配置
├── tsconfig.json                 # TypeScript配置
├── package.json                  # 项目依赖
└── README.md                     # 项目文档
```

## 🔧 核心模块

### 1. 认证系统

- **JWT Token认证** - 安全的用户身份验证
- **路由保护** - 中间件和组件级别的访问控制
- **会话管理** - 自动token刷新和过期处理
- **演示账户** - admin/admin123 快速体验

### 2. 仪表板

- **实时数据** - 销售、客户、项目、任务指标
- **可视化图表** - 趋势分析、对比图表
- **快速操作** - 常用功能快速入口
- **活动时间线** - 系统活动实时更新

### 3. AI智能助手

- **多模型支持** - 百度文心、阿里通义、智谱GLM
- **本地部署** - Ollama、LM Studio本地模型
- **智能对话** - 自然语言交互
- **业务分析** - 数据洞察和决策建议

### 4. 客户管理

- **客户档案** - 完整的客户信息管理
- **生命周期** - 客户状态跟踪和转化
- **满意度** - 客户反馈和评价管理
- **关系维护** - 沟通记录和跟进提醒

### 5. 任务管理

- **项目协作** - 团队任务分配和协作
- **进度跟踪** - 任务状态和完成度监控
- **依赖管理** - 任务依赖关系和关键路径
- **时间管理** - 工时记录和效率分析

## 🎨 设计系统

### 颜色规范

- **主色调** - Sky Blue (#0ea5e9)
- **辅助色** - Purple (#8b5cf6), Green (#10b981), Amber (#f59e0b)
- **中性色** - Gray Scale (#f8fafc - #0f172a)
- **状态色** - Success, Warning, Error, Info

### 组件规范

- **卡片** - 统一的边框、阴影、圆角设计
- **按钮** - 渐变背景、悬停效果、加载状态
- **表单** - 一致的输入框、验证提示、错误处理
- **图标** - Lucide React图标库，统一风格

### 响应式设计

- **断点** - sm(640px), md(768px), lg(1024px), xl(1280px)
- **网格** - 12列网格系统，灵活布局
- **间距** - 统一的spacing scale (0.5rem - 4rem)
- **字体** - 响应式字体大小和行高

## 🔌 API集成

### 认证API

```typescript
POST /auth/login      # 用户登录
POST /auth/logout     # 用户登出
GET  /auth/me         # 获取当前用户信息
POST /auth/refresh    # 刷新Token
```

### 业务API

```typescript
GET  /dashboard/stats    # 仪表板统计数据
GET  /customers/list     # 客户列表
GET  /tasks/list         # 任务列表
GET  /finance/summary    # 财务汇总
GET  /analytics/reports  # 分析报告
```

### AI API

```typescript
POST /ai/chat           # AI对话
POST /ai/analyze        # 数据分析
POST /ai/recommend      # 智能推荐
GET  /ai/models         # 可用模型列表
```

## 🚀 部署指南

### Vercel部署（推荐）

```bash
npm i -g vercel
vercel
vercel env add NEXT_PUBLIC_API_BASE_URL
vercel env add BAIDU_API_KEY
# ... 其他环境变量
```

### Docker部署

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### 传统服务器部署

```bash
npm run build
npm install -g pm2
pm2 start npm --name "enterprise-app" -- start
```

## 🧪 测试

### 单元测试

```bash
npm run test
npm run test:coverage
npm run test:watch
```

### E2E测试

```bash
npm run test:e2e
npm run test:e2e:ui
```

## 📊 性能优化

### 代码分割

- **动态导入** - React.lazy()和动态import()
- **路由分割** - Next.js自动代码分割
- **组件分割** - 按需加载大型组件

### 缓存策略

- **静态资源** - CDN缓存和版本控制
- **API缓存** - SWR数据获取和缓存
- **本地缓存** - localStorage和sessionStorage

### 图片优化

- **Next.js Image** - 自动图片优化和懒加载
- **WebP格式** - 现代图片格式支持
- **响应式图片** - 不同设备尺寸适配

## 🔒 安全措施

### 认证安全

- **JWT Token** - 安全的用户认证
- **HTTPS** - 强制HTTPS连接
- **CSRF保护** - 跨站请求伪造防护

### 数据安全

- **输入验证** - 前端和后端双重验证
- **XSS防护** - 跨站脚本攻击防护
- **SQL注入** - 参数化查询防护

## 🤝 贡献指南

### 开发流程

1. Fork项目到个人仓库
2. 创建功能分支 \`git checkout -b feature/new-feature\`
3. 提交更改 \`git commit -m 'Add new feature'\`
4. 推送分支 \`git push origin feature/new-feature\`
5. 创建Pull Request

### 代码规范

- **ESLint** - 遵循项目ESLint配置
- **Prettier** - 统一代码格式化
- **TypeScript** - 严格类型检查
- **Commit规范** - 使用Conventional Commits

### 测试要求

- **单元测试** - 新功能必须包含单元测试
- **集成测试** - 关键业务流程集成测试
- **E2E测试** - 用户关键路径端到端测试

## 📞 支持和反馈

### 技术支持

- **GitHub Issues** - 提交Bug和功能请求
- **讨论区** - 技术讨论和经验分享
- **文档** - 详细的开发文档和API文档

### 联系方式

- **技术支持**: <admin@0379.email>
- **GitHub仓库**: <https://github.com/YY-Nexus/yyc3-mana>
- **问题反馈**: GitHub Issues

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目和贡献者：

- [Next.js](https://nextjs.org/) - React全栈框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [shadcn/ui](https://ui.shadcn.com/) - UI组件库
- [Vercel](https://vercel.com/) - 部署平台
- [TypeScript](https://www.typescriptlang.org/) - 类型系统

---

## 📄 文档标尾

> 「YanYuCloudCube」  
> 「<admin@0379.email>」  
> 「言启象限，语枢未来」  
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」  
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」
