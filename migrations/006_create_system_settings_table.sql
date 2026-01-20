-- 系统设置表
CREATE TABLE IF NOT EXISTS system_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  category VARCHAR(50),
  description TEXT,
  updated_by INTEGER REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);

-- 插入默认系统设置
INSERT INTO system_settings (key, value, category, description) VALUES
  ('site_name', 'YYC³企业管理系统', 'basic', '站点名称'),
  ('site_url', 'https://yyc3.0379.love', 'basic', '站点URL'),
  ('admin_email', 'admin@0379.email', 'basic', '管理员邮箱'),
  ('timezone', 'Asia/Shanghai', 'basic', '时区'),
  ('language', 'zh-CN', 'basic', '默认语言'),
  ('date_format', 'YYYY-MM-DD', 'basic', '日期格式'),
  ('currency', 'CNY', 'basic', '货币单位')
ON CONFLICT (key) DO NOTHING;
