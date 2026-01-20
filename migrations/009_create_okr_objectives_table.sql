-- OKR目标表
CREATE TABLE IF NOT EXISTS okr_objectives (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  owner_id INTEGER REFERENCES users(id),
  department VARCHAR(100),
  period VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT '进行中' CHECK (status IN ('计划中', '进行中', '已完成', '已延期')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date DATE,
  end_date DATE,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_okr_objectives_owner ON okr_objectives(owner_id);
CREATE INDEX IF NOT EXISTS idx_okr_objectives_department ON okr_objectives(department);
CREATE INDEX IF NOT EXISTS idx_okr_objectives_period ON okr_objectives(period);
CREATE INDEX IF NOT EXISTS idx_okr_objectives_status ON okr_objectives(status);
