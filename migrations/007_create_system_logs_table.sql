-- 系统日志表
CREATE TABLE IF NOT EXISTS system_logs (
  id SERIAL PRIMARY KEY,
  level VARCHAR(20) NOT NULL CHECK (level IN ('info', 'warning', 'error', 'debug')),
  action VARCHAR(100) NOT NULL,
  module VARCHAR(50),
  user_id INTEGER REFERENCES users(id),
  ip_address VARCHAR(45),
  user_agent TEXT,
  request_data JSONB,
  response_data JSONB,
  error_message TEXT,
  stack_trace TEXT,
  duration INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_action ON system_logs(action);
CREATE INDEX IF NOT EXISTS idx_system_logs_module ON system_logs(module);
CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON system_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);

-- 创建分区表（按月分区）
-- CREATE TABLE system_logs_2024_01 PARTITION OF system_logs
--   FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
