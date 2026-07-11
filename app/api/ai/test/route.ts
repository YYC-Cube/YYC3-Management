/**
 * @fileoverview api/ai/test/route.ts — 可视化模型测试 (单一/批量/对比)
 * @author YYC³ @version 3.0.0 @license MIT
 */
import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiRequest } from '@/lib/api/auth-guard'
import { AIModelRepository } from '@/lib/db/repositories/ai-model.repository'
import { checkDatabaseConnection } from '@/lib/db/client'
import type { AIModelConfig, ModelTestResult } from '@/lib/db/models/ai-model'

const repo = new AIModelRepository()

export async function POST(request: NextRequest) {
  try {
    const auth = authenticateApiRequest(request)
    if (!auth.authenticated) return auth.response

    const body = await request.json()
    const { prompt, modelIds, compare } = body as {
      prompt: string
      modelIds?: number[]
      compare?: boolean
    }

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { success: false, error: '测试提示词不能为空' },
        { status: 400 }
      )
    }

    // 获取要测试的模型列表
    let models: AIModelConfig[] = []
    const isConnected = await checkDatabaseConnection()

    if (isConnected) {
      if (modelIds && modelIds.length > 0) {
        models = await Promise.all(
          modelIds.map((id) => repo.findById(id))
        ).then((results) => results.filter((m): m is AIModelConfig => m !== null))
      } else if (compare) {
        // 对比模式: 测试所有活跃模型
        models = await repo.findActive()
      } else {
        // 默认: 只测试默认模型
        const defaultModel = await repo.findDefault()
        if (defaultModel) models = [defaultModel]
        else models = await repo.findActive()
      }
    }

    // 如果DB不可用或无DB模型，用环境变量构建临时模型
    if (models.length === 0) {
      models = getEnvModelConfigs()
    }

    if (models.length === 0) {
      return NextResponse.json(
        { success: false, error: '没有可测试的模型，请先添加模型配置' },
        { status: 404 }
      )
    }

    // 逐个测试 (串行避免速率限制)
    const results: ModelTestResult[] = []
    for (const model of models) {
      const result = await repo.testModel(model, prompt)
      results.push(result)
    }

    const summary = {
      total: results.length,
      success: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      avgLatency: results.length > 0
        ? Math.round(results.reduce((sum, r) => sum + r.latency_ms, 0) / results.length)
        : 0,
      fastestModel: results.reduce(
        (min, r) => r.success && (min === null || r.latency_ms < min.latency_ms) ? r : min,
        null as ModelTestResult | null
      ),
    }

    return NextResponse.json({
      success: true,
      data: {
        prompt,
        results,
        summary,
      },
    })
  } catch (error: unknown) {
    console.error('模型测试失败:', error)
    return NextResponse.json({ success: false, error: '模型测试失败' }, { status: 500 })
  }
}

function getEnvModelConfigs(): AIModelConfig[] {
  const models: AIModelConfig[] = []
  const envModels: Array<[string, string, string, string, string]> = [
    ['zhipu', '智谱 GLM-4', 'glm-4-flash', 'zhipu', 'ZHIPU_API_KEY'],
    ['openai', 'OpenAI GPT-4o', 'gpt-4o-mini', 'openai', 'OPENAI_API_KEY'],
    ['deepseek', 'DeepSeek', 'deepseek-chat', 'deepseek', 'DEEPSEEK_API_KEY'],
    ['moonshot', 'Kimi', 'moonshot-v1-8k', 'moonshot', 'MOONSHOT_API_KEY'],
  ]

  for (const [name, displayName, modelId, provider, envKey] of envModels) {
    if (process.env[envKey]) {
      models.push({
        id: 0, name: displayName, provider: provider as AIModelConfig['provider'],
        model_id: modelId, base_url: null, api_key_encrypted: null,
        max_tokens: 4096, temperature: 0.7, system_prompt: null,
        is_active: true, is_default: name === 'zhipu',
        capabilities: ['chat'], metadata: {}, created_by: null,
        created_at: '', updated_at: '',
      })
    }
  }

  // Ollama
  if (process.env.OLLAMA_BASE_URL || true) {
    models.push({
      id: 0, name: '本地 Ollama', provider: 'ollama',
      model_id: 'llama3.2', base_url: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      api_key_encrypted: null, max_tokens: 4096, temperature: 0.7,
      system_prompt: null, is_active: true, is_default: false,
      capabilities: ['chat'], metadata: {}, created_by: null,
      created_at: '', updated_at: '',
    })
  }

  return models
}
