import type { Metadata } from 'next'

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'YYC³ 企业智能管理系统'

interface PageMetaInput {
  title: string
  description?: string
  keywords?: string[]
}

export function createPageMetadata({ title, description, keywords }: PageMetaInput): Metadata {
  const fullTitle = title === '首页' ? APP_NAME : `${title} - ${APP_NAME}`
  return {
    title: fullTitle,
    description: description || `${title}功能页面`,
    keywords: keywords ? [...keywords, '企业管理', 'YYC³'] : ['企业管理', 'YYC³'],
  }
}

export const PAGE_METADATA: Record<string, PageMetaInput> = {
  'dashboard': { title: '数据中心', description: '企业运营数据总览、实时KPI监控与分析' },
  'customers': { title: '客户管理', description: '客户信息管理、生命周期跟踪、关系维护', keywords: ['CRM', '客户'] },
  'tasks': { title: '任务管理', description: '任务分配、进度跟踪、团队协作', keywords: ['任务', '待办'] },
  'projects': { title: '项目管理', description: '项目进度、团队管理、预算控制', keywords: ['项目'] },
  'analytics': { title: '数据分析', description: '业务数据可视化、趋势分析、BI报表', keywords: ['BI', '分析'] },
  'finance': { title: '财务管理', description: '收支管理、财务报表、预算控制', keywords: ['财务'] },
  'okr': { title: 'OKR管理', description: '目标设定、关键结果跟踪、绩效评估', keywords: ['OKR', '目标'] },
  'notifications': { title: '通知中心', description: '系统通知、消息管理', keywords: ['通知'] },
  'collaboration': { title: '团队协作', description: '团队沟通、协作工具、效率提升', keywords: ['协作'] },
  'communication': { title: '沟通协作', description: '内部沟通、消息传递', keywords: ['沟通'] },
  'ai-assistant': { title: 'AI助手', description: '智能对话、数据分析、决策建议', keywords: ['AI'] },
  'ai-content-creator': { title: 'AI内容创作', description: '智能内容生成、多平台发布', keywords: ['AI', '内容'] },
  'user-management': { title: '用户管理', description: '系统用户、角色分配、权限控制', keywords: ['用户'] },
  'permission-management': { title: '权限管理', description: '角色权限、访问控制', keywords: ['权限'] },
  'tenant-management': { title: '租户管理', description: '多租户配置、租户信息管理', keywords: ['租户'] },
  'store-management': { title: '门店管理', description: '门店信息、运营状态、业绩跟踪', keywords: ['门店'] },
  'system-settings': { title: '系统设置', description: '系统配置、参数管理、外观定制', keywords: ['设置'] },
  'system-monitor': { title: '系统监控', description: '系统运行状态、性能指标、告警管理', keywords: ['监控'] },
  'log-management': { title: '日志管理', description: '操作日志、系统日志、审计追踪', keywords: ['日志'] },
  'backup-recovery': { title: '备份恢复', description: '数据备份、灾难恢复、数据安全', keywords: ['备份'] },
  'security-center': { title: '安全中心', description: '安全监控、威胁检测、合规管理', keywords: ['安全'] },
  'help-center': { title: '帮助中心', description: '使用指南、常见问题、技术支持', keywords: ['帮助'] },
  'mobile-app': { title: '移动应用', description: '移动端功能、APP管理', keywords: ['移动'] },
  'performance-optimization': { title: '性能优化', description: '系统性能调优、缓存管理、资源优化', keywords: ['性能'] },
  'training': { title: '用户培训', description: '培训资源、学习路径、知识库', keywords: ['培训'] },
  'system-testing': { title: '系统测试', description: '功能测试、性能测试、质量保证', keywords: ['测试'] },
  'advanced-bi': { title: '高级BI', description: '高级商业智能、数据挖掘、预测分析', keywords: ['BI'] },
  'wechat-config': { title: '微信配置', description: '微信公众号配置、菜单管理、消息接口', keywords: ['微信'] },
  'channel-center': { title: '渠道中心', description: '多渠道管理、平台对接、数据同步', keywords: ['渠道'] },
  'data-integration': { title: '数据集成', description: '数据源管理、ETL流程、数据同步', keywords: ['集成'] },
  'parameter-settings': { title: '参数设置', description: '系统参数、业务规则配置', keywords: ['参数'] },
  'approval': { title: '审批管理', description: 'OA审批流程、工单管理', keywords: ['审批'] },
  'schedule': { title: '日程管理', description: '日程安排、会议管理、时间规划', keywords: ['日程'] },
  'ai-smart-forms': { title: 'AI智能表单', description: '智能表单生成、数据收集', keywords: ['AI', '表单'] },
  'ai-customer-data': { title: 'AI客户分析', description: 'AI驱动的客户数据洞察', keywords: ['AI', '客户'] },
  'platform-settings': { title: '平台设置', description: '第三方平台集成配置', keywords: ['平台'] },
  'creative-collaboration': { title: '创意协作', description: '创意项目管理、设计协作', keywords: ['创意'] },
  'offline': { title: '离线模式', description: '离线功能、数据缓存', keywords: ['离线'] },
  'profile': { title: '个人中心', description: '个人信息管理', keywords: ['个人'] },
}
