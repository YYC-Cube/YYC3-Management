-- AI模型配置表 — 用户可自主添加/编辑/删除模型
CREATE TABLE IF NOT EXISTS ai_models (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  provider VARCHAR(50) NOT NULL DEFAULT 'custom',
  model_id VARCHAR(200) NOT NULL,
  base_url VARCHAR(500),
  api_key_encrypted TEXT,
  max_tokens INTEGER DEFAULT 4096,
  temperature DECIMAL(3,2) DEFAULT 0.70,
  system_prompt TEXT,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  capabilities JSONB DEFAULT '["chat"]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_models_provider ON ai_models(provider);
CREATE INDEX IF NOT EXISTS idx_ai_models_active ON ai_models(is_active);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_models_default ON ai_models(is_default) WHERE is_default = true;
