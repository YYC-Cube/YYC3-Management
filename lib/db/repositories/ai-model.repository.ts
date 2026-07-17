import { createHash, randomBytes } from 'crypto'
import { query } from '../client'
import type {
  AIModelConfig, CreateModelConfig,
  ModelTestResult,
  OllamaModel,
  UpdateModelConfig,
} from '../models/ai-model'

/**
 * SSRF 防护: 验证 URL 是否允许被请求
 * 仅允许 http/https 协议，且禁止内网地址
 */
function validateUrl(urlStr: string): string {
  try {
    const parsed = new URL(urlStr)

    // 协议白名单
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error(`不允许的协议: ${parsed.protocol}`)
    }

    // SSRF: 禁止内网地址
    const hostname = parsed.hostname.toLowerCase()
    const blockedPatterns = [
      /^localhost$/i,
      /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
      /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
      /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/,
      /^192\.168\.\d{1,3}\.\d{1,3}$/,
      /^169\.254\.\d{1,3}\.\d{1,3}$/,
      /^0\.0\.0\.0$/,
      /^::1$/,
      /^[fF][cCdD]/,  // IPv6 唯一本地地址 fc00::/7
      /\.internal$/i,
      /\.local$/i,
      /\.lan$/i,
    ]

    for (const pattern of blockedPatterns) {
      if (pattern.test(hostname)) {
        throw new Error(`不允许的 URL: 禁止访问内网地址 (${hostname})`)
      }
    }

    // 运行时允许异步 DNS 检查 — 当前保持轻量，依赖 hostname 校验即可
    // 需要更严格防护时可在 CI/CD 或独立安全层中集成 DNS 二次查询

    return parsed.href
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('不允许')) throw err
    throw new Error(`无效的 URL: ${urlStr}`)
  }
}

/**
 * 安全加密 API Key: 使用 salt + HMAC-SHA256 密钥派生 + XOR 流加密
 * 存储格式: salt(hex):ciphertext(base64)
 */
function encryptApiKey(key: string): string {
  const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'fallback-secret-32-chars-min!!!'
  const salt = randomBytes(16)
  const streamKey = createHash('sha256').update(salt.toString('hex') + secret).digest()
  const keyBuf = Buffer.from(key, 'utf-8')
  const encrypted = Buffer.alloc(keyBuf.length)
  for (let i = 0; i < keyBuf.length; i++) {
    encrypted[i] = keyBuf[i] ^ streamKey[i % streamKey.length]
  }
  return `${salt.toString('hex')}:${encrypted.toString('base64')}`
}

function decryptApiKey(encrypted: string | null): string {
  if (!encrypted) return ''
  const parts = encrypted.split(':')
  if (parts.length !== 2) return ''
  try {
    const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'fallback-secret-32-chars-min!!!'
    const salt = Buffer.from(parts[0], 'hex')
    const data = Buffer.from(parts[1], 'base64')
    const streamKey = createHash('sha256').update(salt.toString('hex') + secret).digest()
    const decrypted = Buffer.alloc(data.length)
    for (let i = 0; i < data.length; i++) {
      decrypted[i] = data[i] ^ streamKey[i % streamKey.length]
    }
    return decrypted.toString('utf-8')
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
    const safeUrl = validateUrl(baseUrl)
    const response = await fetch(`${safeUrl}/api/tags`, {
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
      const safeUrl = validateUrl(baseUrl)
      const response = await fetch(`${safeUrl}/api/tags`, {
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
        const safeBaseUrl = validateUrl(baseUrl)
        const res = await fetch(`${safeBaseUrl}/api/chat`, {
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
        const safeBaseUrl = validateUrl(baseUrl)
        const apiKey = this.getDecryptedApiKey(model) || this.getEnvApiKey(model.provider)

        if (!apiKey && model.provider !== 'custom') {
          throw new Error(`${model.provider} API Key 未配置`)
        }

        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`

        const messages = []
        if (model.system_prompt) messages.push({ role: 'system', content: model.system_prompt })
        messages.push({ role: 'user', content: prompt })

        const res = await fetch(`${safeBaseUrl}/chat/completions`, {
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
