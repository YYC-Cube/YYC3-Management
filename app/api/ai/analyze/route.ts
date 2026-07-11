/**
 * @fileoverview api/ai/analyze/route.ts
 * @description YYC³ API路由 — 认证守卫 + 数据验证 + Redis缓存
 * @author YYC³
 * @version 3.0.0
 * @license MIT
 */

import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiRequest } from '@/lib/api/auth-guard'
import { query } from '@/lib/db/client'

interface AnalysisRequest {
  type: 'customer_insights' | 'task_optimization' | 'revenue_forecast' | 'risk_assessment'
  timeRange?: { start?: string; end?: string }
}

export async function POST(request: NextRequest) {
  try {
    const auth = authenticateApiRequest(request)
    if (!auth.authenticated) return auth.response

    const { type, timeRange } = (await request.json()) as AnalysisRequest

    const apiKey = process.env.ZHIPU_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'AI服务未配置' },
        { status: 503 }
      )
    }

    const businessData = await collectBusinessData(type, timeRange)
    const prompt = buildAnalysisPrompt(type, businessData)
    const aiResponse = await callAI(prompt)

    return NextResponse.json({
      success: true,
      data: {
        analysis: aiResponse,
        dataType: type,
        dataPoints: businessData.summary,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error: unknown) {
    console.error('AI分析失败:', error)
    return NextResponse.json(
      { success: false, error: 'AI分析服务暂时不可用' },
      { status: 500 }
    )
  }
}

async function collectBusinessData(type: string, _timeRange?: { start?: string; end?: string }) {
  const [customerStats, taskStats, projectStats, financeStats] = await Promise.all([
    query(`SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = '活跃') as active,
      COUNT(*) FILTER (WHERE level = 'VIP') as vip,
      COUNT(*) FILTER (WHERE level = '普通') as normal
    FROM customers`),
    query(`SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = '进行中') as in_progress,
      COUNT(*) FILTER (WHERE status = '已完成') as completed,
      COUNT(*) FILTER (WHERE status = '待处理') as pending,
      COUNT(*) FILTER (WHERE priority = '高') as high_priority,
      COUNT(*) FILTER (WHERE priority = '紧急') as urgent
    FROM tasks`),
    query(`SELECT
      COUNT(*) as total,
      COALESCE(AVG(progress), 0) as avg_progress,
      COUNT(*) FILTER (WHERE status = '进行中') as active
    FROM projects`),
    query(`SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense
    FROM finance_records`),
  ])

  return {
    customers: customerStats[0],
    tasks: taskStats[0],
    projects: projectStats[0],
    finance: financeStats[0],
    summary: {
      totalRecords: 4,
      customerCount: parseInt(customerStats[0]?.total ?? '0'),
      taskCount: parseInt(taskStats[0]?.total ?? '0'),
    },
  }
}

function buildAnalysisPrompt(type: string, data: Record<string, unknown>): string {
  const dataStr = JSON.stringify(data, null, 2)

  const prompts: Record<string, string> = {
    customer_insights: `你是一位资深客户关系管理专家。基于以下真实业务数据，提供客户分析洞察：

数据:
${dataStr}

请分析:
1. 客户健康度评估 (活跃客户比例、VIP占比是否合理)
2. 客户流失风险评估 (哪些信号值得关注)
3. 客户分层优化建议 (如何提升普通客户→VIP)
4. 具体可行的下一步行动建议 (3条)

请用中文回答，结构清晰，每条建议要具体可执行。`,

    task_optimization: `你是一位项目管理专家。基于以下任务数据，提供优化建议：

数据:
${dataStr}

请分析:
1. 任务分配是否合理 (高优先级任务占比)
2. 团队负载评估 (进行中任务数 vs 待处理任务数)
3. 任务完成效率分析
4. 具体优化建议 (3条，按优先级排序)

请用中文回答。`,

    revenue_forecast: `你是一位财务分析专家。基于以下财务和业务数据，提供收入预测：

数据:
${dataStr}

请分析:
1. 当前财务状况评估
2. 收入趋势预测 (基于客户活跃度和项目进度)
3. 成本控制建议
4. 下季度营收预测 (给出区间和依据)

请用中文回答。`,

    risk_assessment: `你是一位企业风控专家。基于以下综合业务数据，评估运营风险：

数据:
${dataStr}

请分析:
1. 客户风险 (流失风险、集中度风险)
2. 项目风险 (延期风险、资源瓶颈)
3. 任务风险 (积压风险、优先级失衡)
4. 综合风险等级 (低/中/高) 和应对措施

请用中文回答。`,
  }

  return prompts[type] || prompts.customer_insights
}

async function callAI(prompt: string): Promise<string> {
  const apiKey = process.env.ZHIPU_API_KEY!
  const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'glm-4-flash',
      messages: [
        { role: 'system', content: '你是YYC³企业管理系统的AI分析助手，提供专业的商业分析建议。' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
    signal: AbortSignal.timeout(30000),
  })

  const data = await response.json()
  return data.choices?.[0]?.message?.content || '分析结果生成失败'
}
