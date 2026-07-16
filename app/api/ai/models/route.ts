/**
 * @fileoverview api/ai/models/route.ts — AI模型管理 CRUD + Ollama扫描
 * @author YYC³ @version 3.1.0 @license MIT
 */
import { authenticateApiRequest } from '@/lib/api/auth-guard'
import { writeAuditLog } from '@/lib/audit/logger'
import { checkDatabaseConnection } from '@/lib/db/client'
import { AIModelRepository } from '@/lib/db/repositories/ai-model.repository'
import { NextRequest, NextResponse } from 'next/server'

const repo = new AIModelRepository()

export async function GET(request: NextRequest) {
  try {
    const auth = authenticateApiRequest(request)
    if (!auth.authenticated) return auth.response

    const scanOllama = request.nextUrl.searchParams.get('scan') === 'ollama'

    if (scanOllama) {
      const baseUrl = request.nextUrl.searchParams.get('base_url') || undefined
      try {
        const ollamaModels = await repo.scanOllama(baseUrl)
        return NextResponse.json({ success: true, data: ollamaModels })
      } catch {
        return NextResponse.json({
          success: true,
          data: [],
          message: '无法连接到Ollama服务，请确认已安装并运行',
        })
      }
    }

    const isConnected = await checkDatabaseConnection()
    if (!isConnected) {
      return NextResponse.json({ success: true, data: getEnvModels(), source: 'env' })
    }

    const models = await repo.findAll()
    return NextResponse.json({ success: true, data: models, source: 'db' })
  } catch (error: unknown) {
    console.error('获取模型列表失败:', error)
    return NextResponse.json({ success: false, error: '获取模型列表失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = authenticateApiRequest(request)
    if (!auth.authenticated) return auth.response

    const isConnected = await checkDatabaseConnection()
    if (!isConnected) {
      return NextResponse.json({ success: false, error: '数据库不可用' }, { status: 503 })
    }

    const body = await request.json()
    if (!body.name || !body.model_id || !body.provider) {
      return NextResponse.json(
        { success: false, error: '名称、模型ID、提供商为必填' },
        { status: 400 }
      )
    }

    const model = await repo.create(body, Number(auth.payload.userId))

    await writeAuditLog({
      userId: auth.payload.userId,
      action: 'create',
      module: 'system',
      description: `添加AI模型: ${model.name} (${model.provider}/${model.model_id})`,
      targetId: model.id,
    })

    return NextResponse.json({ success: true, data: model }, { status: 201 })
  } catch (error: unknown) {
    console.error('创建模型失败:', error)
    return NextResponse.json({ success: false, error: '创建模型失败' }, { status: 400 })
  }
}

function getEnvModels() {
  const models: Array<Record<string, unknown>> = []
  if (process.env.ZHIPU_API_KEY)
    models.push({ id: 'zhipu', name: '智谱 GLM-4', provider: 'zhipu', model_id: 'glm-4-flash', is_active: true })
  if (process.env.OPENAI_API_KEY)
    models.push({ id: 'openai', name: 'OpenAI GPT', provider: 'openai', model_id: 'gpt-4o-mini', is_active: true })
  if (process.env.DEEPSEEK_API_KEY)
    models.push({ id: 'deepseek', name: 'DeepSeek', provider: 'deepseek', model_id: 'deepseek-chat', is_active: true })
  if (process.env.MOONSHOT_API_KEY)
    models.push({ id: 'moonshot', name: 'Kimi', provider: 'moonshot', model_id: 'moonshot-v1-8k', is_active: true })
  if (process.env.OLLAMA_BASE_URL)
    models.push({ id: 'ollama', name: 'Ollama', provider: 'ollama', model_id: 'llama3', base_url: process.env.OLLAMA_BASE_URL, is_active: true })
  if (models.length === 0)
    models.push({ id: 'none', name: '无可用模型', provider: 'custom', model_id: 'none', is_active: false })
  return models
}
