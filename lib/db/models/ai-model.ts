export type ModelProvider = 'openai' | 'zhipu' | 'ollama' | 'deepseek' | 'moonshot' | 'custom'

export interface AIModelConfig {
  id: number
  name: string
  provider: ModelProvider
  model_id: string
  base_url: string | null
  api_key_encrypted: string | null
  max_tokens: number
  temperature: number
  system_prompt: string | null
  is_active: boolean
  is_default: boolean
  capabilities: string[]
  metadata: Record<string, unknown>
  created_by: number | null
  created_at: string
  updated_at: string
}

export interface CreateModelConfig {
  name: string
  provider: ModelProvider
  model_id: string
  base_url?: string
  api_key?: string
  max_tokens?: number
  temperature?: number
  system_prompt?: string
  is_active?: boolean
  is_default?: boolean
  capabilities?: string[]
}

export interface UpdateModelConfig {
  name?: string
  provider?: ModelProvider
  model_id?: string
  base_url?: string
  api_key?: string
  max_tokens?: number
  temperature?: number
  system_prompt?: string
  is_active?: boolean
  is_default?: boolean
  capabilities?: string[]
}

export interface OllamaModel {
  name: string
  size: string
  parameter_size: string
  quantization: string
  modified_at: string
}

export interface ModelTestResult {
  success: boolean
  model: string
  provider: string
  response: string
  latency_ms: number
  tokens_used: number
  error: string | null
}
