-- 创建迁移记录表
CREATE TABLE IF NOT EXISTS migrations (
  id SERIAL PRIMARY KEY,
  version VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  execution_time INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_migrations_version ON migrations(version);
CREATE INDEX IF NOT EXISTS idx_migrations_applied_at ON migrations(applied_at);

-- 插入已执行的迁移记录
INSERT INTO migrations (version, name) VALUES
  ('001', 'create_users_table'),
  ('002', 'create_customers_table'),
  ('003', 'create_tasks_table'),
  ('004', 'create_projects_table'),
  ('005', 'create_notifications_table'),
  ('006', 'create_system_settings_table'),
  ('007', 'create_system_logs_table'),
  ('008', 'create_finance_records_table'),
  ('009', 'create_okr_objectives_table'),
  ('010', 'create_okr_key_results_table'),
  ('011', 'create_updated_at_triggers')
ON CONFLICT (version) DO NOTHING;
