-- OKR关键结果表
CREATE TABLE IF NOT EXISTS okr_key_results (
  id SERIAL PRIMARY KEY,
  objective_id INTEGER REFERENCES okr_objectives(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  target_value DECIMAL(15, 2),
  current_value DECIMAL(15, 2) DEFAULT 0,
  unit VARCHAR(20),
  status VARCHAR(20) DEFAULT '进行中' CHECK (status IN ('进行中', '已完成', '未达成')),
  due_date DATE,
  assignee_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_okr_key_results_objective ON okr_key_results(objective_id);
CREATE INDEX IF NOT EXISTS idx_okr_key_results_assignee ON okr_key_results(assignee_id);
CREATE INDEX IF NOT EXISTS idx_okr_key_results_status ON okr_key_results(status);
