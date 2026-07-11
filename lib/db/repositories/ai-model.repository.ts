import { query } from '../client'
import { createHash } from 'crypto'
import type {
  AIModelConfig, CreateModelConfig, UpdateModelConfig,
  OllamaModel, ModelTestResult,
} from '../models/ai-model'

function encryptApiKey(key: string): string {
  const secret = process.env.JWT_SECRET || 'fallback-secret'
  return createHash('sha256').update(key + secret).digest('hex').slice(0, 32) + ':' + Buffer.from(key).toString('base64')
}

function decryptApiKey(encrypted: string | null): string {
  if (!encrypted) return ''
  const parts = encrypted.split(':')
  if (parts.length !== 2) return ''
  try {
    return Buffer.from(parts[1], 'base64').toString('utf-8')
  } catch {
    return ''
  }
}

const ALLOWED_COLUMNS = [
  'name', 'provider', 'model_id', 'base_url', 'max_tokens',
  'temperature', 'system_prompt', 'is_active', 'is_default', 'capabilities', 'metadata',
] as const

export class AIModelRepository {
  async findAll(): Promise<AIModelConfig[]> {
    const result = await query('SELECT * FROM ai_models ORDER BY is_default DESC, created_at DESC')
    return result as AIModelConfig[]
  }

  async findActive(): Promise<AIModelConfig[]> {
    const result = await query('SELECT * FROM ai_models WHERE is_active = true ORDER BY is_default DESC')
    return result as AIModelConfig[]
  }

  async findDefault(): Promise<AIModelConfig | null> {
    const result = await query('SELECT * FROM ai_models WHERE is_default = true LIMIT 1')
    return (result[0] as AIModelConfig) || null
  }

  async findById(id: number): Promise<AIModelConfig | null> {
    const result = await query('SELECT * FROM ai_models WHERE id = $1', [id])
    return (result[0] as AIModelConfig) || null
  }

  async create(data: CreateModelConfig, createdBy?: number): Promise<AIModelConfig> {
    if (data.is_default) {
      await query('UPDATE ai_models SET is_default = false WHERE is_default = true')
    }
    const result = await query(
      `INSERT INTO ai_models (name, provider, model_id, base_url, api_key_encrypted, max_tokens, temperature, system_prompt, is_active, is_default, capabilities, metadata, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        data.name,
        data.provider,
        data.model_id,
        data.base_url ?? null,
        data.api_key ? encryptApiKey(data.api_key) : null,
        data.max_tokens ?? 4096,
        data.temperature ?? 0.70,
        data.system_prompt ?? null,
        data.is_active ?? true,
        data.is_default ?? false,
        JSON.stringify(data.capabilities ?? ['chat']),
        JSON.stringify({}),
        createdBy ?? null,
      ]
    )
    return result[0] as AIModelConfig
  }

  async update(id: number, data: UpdateModelConfig): Promise<AIModelConfig | null> {
    if (data.is_default) {
      await query('UPDATE ai_models SET is_default = false WHERE is_default = true AND id != $1', [id])
    }

    const updates: string[] = []
    const values: unknown[] = []
    let paramIndex = 1

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && (ALLOWED_COLUMNS as readonly string[]).includes(key)) {
        if (key === 'capabilities' || key === 'metadata') {
          updates.push(`"${key}" = $${paramIndex}`)
          values.push(JSON.stringify(value))
        } else {
          updates.push(`"${key}" = $${paramIndex}`)
          values.push(value)
        }
        paramIndex++
      }
    }

    if (data.api_key !== undefined) {
      updates.push(`api_key_encrypted = $${paramIndex}`)
      values.push(encryptApiKey(data.api_key))
      paramIndex++
    }

    if (updates.length === 0) return this.findById(id)

    values.push(id)
    const result = await query(
      `UPDATE ai_models SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`,
      values
    )
    return (result[0] as AIModelConfig) || null
  }

  async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM ai_models WHERE id = $1 RETURNING id', [id])
    return result.length > 0
  }

  getDecryptedApiKey(model: AIModelConfig): string {
    return decryptApiKey(model.api_key_encrypted)
  }

  // ─── Ollama 扫描 ───────────────────────────────

  async scanOllama(baseUrl: string = 'http://localhost:11434'): Promise<OllamaModel[]> {
    const response = await fetch(`${baseUrl}/api/tags`, {
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) throw new Error(`Ollama扫描失败: HTTP ${response.status}`)
    const data = await response.json()
    return (data.models ?? []).map((m: Record<string, unknown>) => ({
      name: m.name as string,
      size: this.formatSize(m.size as number),
      parameter_size: (m.details as Record<string, unknown>)?.parameter_size as string ?? '—',
      quantization: (m.details as Record<string, unknown>)?.quantization_level as string ?? '—',
      modified_at: m.modified_at as string,
    }))
  }

  async testOllamaConnection(baseUrl: string = 'http://localhost:11434'): Promise<boolean> {
    try {
      const response = await fetch(`${baseUrl}/api/tags`, {
        signal: AbortSignal.timeout(3000),
      })
      return response.ok
    } catch {
      return false
    }
  }

  // ─── 统一模型测试 ──────────────────────────────

  async testModel(
    model: AIModelConfig,
    prompt: string,
    ollamaBaseUrl?: string
  ): Promise<ModelTestResult> {
    const startTime = Date.now()
    try {
      let response: string
      let tokens = 0

      if (model.provider === 'ollama') {
        const baseUrl = model.base_url || ollamaBaseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
        const res = await fetch(`${baseUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: model.model_id,
            messages: [{ role: 'user', content: prompt }],
            stream: false,
          }),
          signal: AbortSignal.timeout(30000),
        })
        const data = await res.json()
        response = data.message?.content ?? data.response ?? ''
        tokens = data.eval_count ?? 0
      } else {
        const baseUrl = model.base_url || this.getDefaultBaseUrl(model.provider)
        const apiKey = this.getDecryptedApiKey(model) || this.getEnvApiKey(model.provider)

        if (!apiKey && model.provider !== 'custom') {
          throw new Error(`${model.provider} API Key 未配置`)
        }

        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`

        const messages = []
        if (model.system_prompt) messages.push({ role: 'system', content: model.system_prompt })
        messages.push({ role: 'user', content: prompt })

        const res = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: model.model_id,
            messages,
            temperature: model.temperature,
            max_tokens: model.max_tokens,
            stream: false,
          }),
          signal: AbortSignal.timeout(30000),
        })

        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.error?.message || `HTTP ${res.status}`)
        }

        const data = await res.json()
        response = data.choices?.[0]?.message?.content ?? ''
        tokens = data.usage?.total_tokens ?? 0
      }

      return {
        success: true,
        model: model.name,
        provider: model.provider,
        response,
        latency_ms: Date.now() - startTime,
        tokens_used: tokens,
        error: null,
      }
    } catch (error) {
      return {
        success: false,
        model: model.name,
        provider: model.provider,
        response: '',
        latency_ms: Date.now() - startTime,
        tokens_used: 0,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  private getDefaultBaseUrl(provider: string): string {
    const urls: Record<string, string> = {
      openai: 'https://api.openai.com/v1',
      zhipu: 'https://open.bigmodel.cn/api/paas/v4',
      deepseek: 'https://api.deepseek.com/v1',
      moonshot: 'https://api.moonshot.cn/v1',
    }
    return urls[provider] || 'https://api.openai.com/v1'
  }

  private getEnvApiKey(provider: string): string {
    const envMap: Record<string, string> = {
      openai: 'OPENAI_API_KEY',
      zhipu: 'ZHIPU_API_KEY',
      deepseek: 'DEEPSEEK_API_KEY',
      moonshot: 'MOONSHOT_API_KEY',
    }
    return process.env[envMap[provider]] || ''
  }

  private formatSize(bytes: number): string {
    if (!bytes) return '—'
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }
}
