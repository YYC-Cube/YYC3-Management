-- 财务记录表
CREATE TABLE IF NOT EXISTS finance_records (
  id SERIAL PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
  category VARCHAR(50) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  description TEXT,
  reference_id VARCHAR(100),
  reference_type VARCHAR(50),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_finance_records_type ON finance_records(type);
CREATE INDEX IF NOT EXISTS idx_finance_records_category ON finance_records(category);
CREATE INDEX IF NOT EXISTS idx_finance_records_created_at ON finance_records(created_at);
CREATE INDEX IF NOT EXISTS idx_finance_records_created_by ON finance_records(created_by);
