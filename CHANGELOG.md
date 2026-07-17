# 变更日志

本项目所有值得注意的变更均记录于此。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)。

---

## [未发布]

### 计划中

- EnhancedCard → Card 统一迁移
- Playwright E2E 测试配置
- Lighthouse CI 性能监控集成
- 测试覆盖率提升至 80%+
- 自定义 ESLint 规则集

---

## [3.1.0] — 2026-07-18

### 新增

- **数据库正向优化**: 新增 35+ 索引、5 表软删除、时区规范化
- **迁移系统**: 新增 `lib/db/migrations/` 执行器和版本管理
- **仓储层扩展**: base Repository 接口 + AI/分析/审批/HR/采购/销售/库存/风险/战略 9 个新仓储
- **开发者文档**: 全新开源级 README、CONTRIBUTING、CHANGELOG、SECURITY、CODE_OF_CONDUCT
- **开发环境配置指南**: 完全重写，对齐项目实际版本和数据库配置

### 修复

- **CI/CD**: lockfile 重新锁定，5/6 workflows 恢复 ✅
- **数据库配置**: localhost:5433/yyc3_33，用户 yanyu 免密
- **IDE 诊断**: 293 个 SQL 假阳性清零（.sql→.pgsql）
- **类型歧义**: FinanceRecord 重复导出修复
- **装饰色**: creative-collaboration + ai-assistant 装饰色全量 chart-1~5 语义化
- **bg-white**: 26 处 bg-white/→bg-card/ 全局替换
- **shadow 冗余**: 9 处 shadow-sm+shadow-md 重复清除

### 配置

- `.env` 全量审核：60 个代码引用全覆盖，新增 22 个缺失变量
- `.env.docker` 同步更新
- ESLint: `eslint.config.mjs` flat config（零错误）
- vitest setup: `@types/node` + triple-slash references 类型覆盖

---

## [3.0.0] — 2026-07-17

### 新增

- **文档标准化**: 139/139 全量 frontmatter 补齐
- **全局现状审核报告**: 五维全面分析
- **数据库适用性分析报告**: 187 表全量分析
- **底层测试可视化报告**
- **IDE 诊断全量清零**: 15 个 TypeScript/ESLint 诊断修复

### 修复

- **AdvancedSearch 100%**: 36/36 测试通过
- **indexedDB mock**: vitest 全局 setup
- **3 个真实 Bug**: formatCurrency/detectXSS/AdvancedSearch 逻辑缺陷

### 安全

- XSS 检测白名单修复
- CSRF Token 管理器完整测试覆盖

---

## [2.0.0] — 2026-07-15

### 新增

- AI 智能助手 (EnhancedAIWidget)
- AI 浮窗增强架构方案
- 工作流引擎设计

### 修复

- ESLint 配置重构（TypeScript 7 兼容）
- 应用构建修复

---

## [1.0.0] — 2026-07-10

### 新增

- 初始版本发布
- 用户管理 / CRM / HR / 进销存 核心模块
- AI 对话 + 内容生成
- 审批工作流
- 数据看板与分析

---

## 版本对照

| 版本 | 日期 | 主要变更 |
|:----:|:----:|----------|
| 3.1.0 | 2026-07-18 | 数据库优化 + 仓储层 + 开源文档 |
| 3.0.0 | 2026-07-17 | 文档标准化 + 审核报告 + 诊断清零 |
| 2.0.0 | 2026-07-15 | AI 浮窗 + 工作流引擎 |
| 1.0.0 | 2026-07-10 | 初始发布 |

---

<p align="center">
  <sub>© 2025-2026 YYC³ (YanYuCloudCube) · 言语云立方</sub>
</p>
