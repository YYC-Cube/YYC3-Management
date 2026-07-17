# 贡献指南

感谢您考虑为 **YYC³ 企业智能管理系统** 做出贡献！本文档旨在让贡献过程尽可能简单透明。

## 🧭 目录

- [行为准则](#-行为准则)
- [如何贡献](#-如何贡献)
- [开发流程](#-开发流程)
- [代码规范](#-代码规范)
- [提交规范](#-提交规范)
- [PR 流程](#-pr-流程)
- [问题报告](#-问题报告)
- [文档贡献](#-文档贡献)

---

## 📜 行为准则

本项目采用 [Contributor Covenant](CODE_OF_CONDUCT.md) 行为准则。参与本项目即表示您同意遵守该准则。不可接受的行为可以向 [admin@0379.email](mailto:admin@0379.email) 举报。

---

## 🎯 如何贡献

### 你可以贡献的方式

| 贡献类型 | 说明 |
|----------|------|
| 🐛 **报告 Bug** | 通过 [Issues](https://github.com/YYC-Cube/YYC3-Management/issues) 提交 |
| 💡 **功能建议** | 通过 [Discussions](https://github.com/YYC-Cube/YYC3-Management/discussions) 讨论 |
| 📝 **改进文档** | 直接在 `docs/` 目录提交 PR |
| 🔧 **提交代码** | 修复 Bug 或实现新功能 |
| ✅ **代码审查** | 参与他人的 PR 评审 |
| 🌐 **本地化** | 帮助翻译界面或文档 |

### 寻找任务

- [Good First Issues](https://github.com/YYC-Cube/YYC3-Management/labels/good%20first%20issue) — 适合新贡献者
- [Help Wanted](https://github.com/YYC-Cube/YYC3-Management/labels/help%20wanted) — 需要帮助

---

## 🔧 开发流程

### 环境准备

请参考 [开发环境配置指南](docs/YYC3-Menu-部署发布/技巧类/YYC3-Menu-技巧类-开发环境配置.md) 完成环境搭建。

### 工作流程

```bash
# 1. Fork 并克隆仓库
git clone https://github.com/你的用户名/YYC3-Management.git
cd YYC3-Management

# 2. 添加上游仓库
git remote add upstream https://github.com/YYC-Cube/YYC3-Management.git

# 3. 同步最新代码
git fetch upstream
git checkout main
git merge upstream/main

# 4. 创建特性分支
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix

# 5. 开发...
# 确保通过所有检查
bun run type-check   # TypeScript 类型检查
bun run lint          # ESLint
bun run test          # 测试

# 6. 提交变更（遵循提交规范）
git add .
git commit -m "feat: add amazing feature"

# 7. 推送到你的 Fork
git push origin feature/your-feature-name

# 8. 创建 Pull Request
```

---

## 📐 代码规范

### TypeScript / React

- **语言**: TypeScript 7.0 (strict mode)
- **框架**: Next.js 16.2 (App Router)
- **UI**: shadcn/ui + Radix UI + Tailwind CSS v4
- **组件**: 函数组件 + Hooks，避免 class 组件

### 命名规范

| 实体 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `UserCard.tsx` |
| 工具文件 | camelCase | `formatDate.ts` |
| 接口类型 | PascalCase | `UserProfile` |
| 函数/变量 | camelCase | `getUserById()` |
| 常量 | UPPER_SNAKE | `MAX_RETRY_COUNT` |
| CSS 类 | kebab-case | `user-card-wrapper` |

### 目录结构

```
app/              # Next.js App Router 页面
├── (route)/      # 路由目录
│   ├── page.tsx  # 页面组件
│   └── layout.tsx# 布局组件
components/       # 共享组件
├── ui/           # shadcn/ui 基础组件
└── feature/      # 业务组件
lib/              # 核心逻辑
├── db/           # 数据库访问
├── security/     # 安全模块
└── utils/        # 工具函数
```

---

## 📝 提交规范

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### 类型

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档变更 |
| `style` | 代码格式（不影响功能） |
| `refactor` | 重构 |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `build` | 构建系统/依赖变更 |
| `ci` | CI 配置变更 |
| `chore` | 其他杂项 |

### 示例

```
feat(auth): add JWT refresh token support

Implement refresh token rotation with 7-day expiry.
Store refresh tokens in database with device fingerprint.

Closes #123
```

```
fix(ui): resolve shadow-sm shadow-md redundancy in cards

Remove duplicate shadow classes in creative-collaboration page.
Tailwind v4 treats them as identical, causing IDE warnings.

Fixes #456
```

---

## 🔄 PR 流程

### 创建 Pull Request

1. 确保 PR 描述清晰地说明变更内容和原因
2. 关联相关 Issue（如 `Closes #123`）
3. 确保 CI 通过（所有 GitHub Actions workflow 绿色）
4. 请求至少一位维护者 review

### PR 审查标准

| 检查项 | 说明 |
|--------|------|
| ✅ 代码规范 | 符合 TypeScript strict 模式 |
| ✅ 类型安全 | 无 `any` 类型（特殊情况需注释说明） |
| ✅ 测试覆盖 | 新功能/修复应包含测试 |
| ✅ 性能考量 | 无明显性能问题 |
| ✅ 安全性 | 无 SQL 注入/XSS/CSRF 风险 |
| ✅ 向后兼容 | 无破坏性变更（或明确标注 breaking change） |

### PR 合并后

- 你的 commit 会被 squash 合并到 main
- CI/CD Pipeline 会自动构建和部署
- 你的名字会出现在 CHANGELOG 中 🎉

---

## 🐛 问题报告

### 报告 Bug

使用 [Issue 模板](https://github.com/YYC-Cube/YYC3-Management/issues/new?template=bug_report.md) 提交，包含：

- **描述**: 清晰简洁的描述
- **复现步骤**: 具体的步骤
- **期望行为**: 应该发生什么
- **实际行为**: 实际发生了什么
- **环境信息**: 浏览器/OS/Node 版本等
- **截图**: 如适用

### 安全漏洞

**请勿** 在 Issue 中报告安全漏洞。请发送邮件至 [admin@0379.email](mailto:admin@0379.email) 或参考 [SECURITY.md](SECURITY.md)。

---

## 📖 文档贡献

文档位于 `docs/` 目录，按类别组织：

```
docs/
├── README.md              # 文档库入口
├── YYC3-Menu-需求规划/    # 需求文档
├── YYC3-Menu-架构设计/    # 架构文档
├── YYC3-Menu-开发实施/    # 开发文档
├── YYC3-Menu-测试验证/    # 测试文档
├── YYC3-Menu-部署发布/    # 部署文档
├── YYC3-Menu-团队规范/    # 团队规范
└── YYC3-Menu-文档规范/    # 文档规范
```

文档使用 Markdown 编写，遵循前文所述的 frontmatter 规范。

---

## 🙋 获取帮助

- [讨论区](https://github.com/YYC-Cube/YYC3-Management/discussions)
- [问题追踪](https://github.com/YYC-Cube/YYC3-Management/issues)
- 邮件: [admin@0379.email](mailto:admin@0379.email)

---

<p align="center">
  <sub>© 2025-2026 YYC³ (YanYuCloudCube) · 言语云立方</sub>
</p>
