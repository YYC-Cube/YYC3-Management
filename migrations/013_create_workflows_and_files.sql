-- 工作流实例表
CREATE TABLE IF NOT EXISTS workflow_instances (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  current_step VARCHAR(50) NOT NULL DEFAULT 'submit',
  title VARCHAR(200) NOT NULL,
  description TEXT,
  submitted_by INTEGER NOT NULL,
  submitted_by_name VARCHAR(100),
  data JSONB DEFAULT '{}',
  assigned_to INTEGER,
  assigned_to_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_workflow_status ON workflow_instances(status);
CREATE INDEX IF NOT EXISTS idx_workflow_type ON workflow_instances(type);
CREATE INDEX IF NOT EXISTS idx_workflow_submitted_by ON workflow_instances(submitted_by);

-- 工作流操作日志表
CREATE TABLE IF NOT EXISTS workflow_logs (
  id SERIAL PRIMARY KEY,
  instance_id INTEGER NOT NULL REFERENCES workflow_instances(id) ON DELETE CASCADE,
  action VARCHAR(20) NOT NULL,
  user_id INTEGER NOT NULL,
  user_name VARCHAR(100),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_workflow_logs_instance ON workflow_logs(instance_id);

-- 文件管理表
CREATE TABLE IF NOT EXISTS files (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100),
  size BIGINT NOT NULL,
  path TEXT NOT NULL,
  uploaded_by INTEGER,
  module VARCHAR(50),
  reference_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_files_module ON files(module, reference_id);
CREATE INDEX IF NOT EXISTS idx_files_uploaded_by ON files(uploaded_by);
