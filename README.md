# 企业管理系统 - 前端应用

一个现代化的企业级管理系统前端应用，基于 Next.js 14、React 18 和 TypeScript 构建，集成多种AI模型支持，提供完整的业务管理解决方案。

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

### UI组件库
- **Tailwind CSS** - 原子化CSS框架
- **shadcn/ui** - 高质量React组件库
- **Lucide React** - 现代化图标库
- **Recharts** - 数据可视化图表库

### 状态管理
- **React Context** - 全局状态管理
- **React Hooks** - 组件状态和副作用管理
- **Local Storage** - 本地数据持久化

### AI集成
- **AI SDK** - Vercel AI SDK，统一AI模型接口
- **多模型支持** - 百度文心、阿里通义、智谱GLM等
- **本地模型** - Ollama、LM Studio本地部署支持

### 开发工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Husky** - Git钩子管理
- **TypeScript** - 静态类型检查

## 🛠️ 安装和运行

### 环境要求
- Node.js 18.0+
- npm 9.0+ 或 yarn 1.22+
- Git

### 快速开始

\`\`\`bash
# 克隆项目
git clone https://github.com/YY-Nexus/yyc3-mana.git


# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
\`\`\`

### 环境变量配置

创建 \`.env.local\` 文件：

\`\`\`env
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
\`\`\`

## 📁 项目结构

\`\`\`
enterprise-management-system/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # 认证相关页面
│   │   └── login/                # 登录页面
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
│   ├── api.ts                    # API服务
│   ├── ai-service.ts             # AI服务
│   ├── ai-models.ts              # AI模型配置
│   ├── design-system.ts          # 设计系统
│   └── utils.ts                  # 工具函数
├── public/                       # 静态资源
│   ├── images/                   # 图片资源
│   ├── icons/                    # 图标资源
│   ├── manifest.json             # PWA配置
│   └── sw.js                     # Service Worker
├── docs/                         # 文档
│   ├── navigation-analysis-report.tsx  # 导航分析报告
│   ├── optimization-report.tsx         # 优化报告
│   └── application-analysis-report.tsx # 应用分析报告
├── middleware.ts                 # Next.js中间件
├── next.config.js                # Next.js配置
├── tailwind.config.js            # Tailwind配置
├── tsconfig.json                 # TypeScript配置
├── package.json                  # 项目依赖
└── README.md                     # 项目文档
\`\`\`

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
\`\`\`typescript
POST /auth/login      # 用户登录
POST /auth/logout     # 用户登出
GET  /auth/me         # 获取当前用户信息
POST /auth/refresh    # 刷新Token
\`\`\`

### 业务API
\`\`\`typescript
GET  /dashboard/stats    # 仪表板统计数据
GET  /customers/list     # 客户列表
GET  /tasks/list         # 任务列表
GET  /finance/summary    # 财务汇总
GET  /analytics/reports  # 分析报告
\`\`\`

### AI API
\`\`\`typescript
POST /ai/chat           # AI对话
POST /ai/analyze        # 数据分析
POST /ai/recommend      # 智能推荐
GET  /ai/models         # 可用模型列表
\`\`\`

## 🚀 部署指南

### Vercel部署（推荐）
\`\`\`bash
# 安装Vercel CLI
npm i -g vercel

# 部署到Vercel
vercel

# 设置环境变量
vercel env add NEXT_PUBLIC_API_BASE_URL
vercel env add BAIDU_API_KEY
# ... 其他环境变量
\`\`\`

### Docker部署
\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

### 传统服务器部署
\`\`\`bash
# 构建项目
npm run build

# 使用PM2管理进程
npm install -g pm2
pm2 start npm --name "enterprise-app" -- start
\`\`\`

## 🧪 测试

### 单元测试
\`\`\`bash
# 运行测试
npm run test

# 测试覆盖率
npm run test:coverage

# 监听模式
npm run test:watch
\`\`\`

### E2E测试
\`\`\`bash
# Playwright E2E测试
npm run test:e2e

# 可视化测试
npm run test:e2e:ui
\`\`\`

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
- **邮箱** - support@company.com
- **微信群** - 扫码加入开发者群
- **QQ群** - 123456789

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

**企业管理系统** - 让企业管理更智能、更高效！ 🚀
