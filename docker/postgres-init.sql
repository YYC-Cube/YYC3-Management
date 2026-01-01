-- ==================== PostgreSQL初始化脚本 ====================

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- 创建schema
CREATE SCHEMA IF NOT EXISTS learning;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS audit;

-- ==================== 学习系统表 ====================

-- 学习模型表
CREATE TABLE learning.models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    parameters JSONB,
    metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, version)
);

-- 训练记录表
CREATE TABLE learning.training_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID REFERENCES learning.models(id),
    dataset_id VARCHAR(100),
    hyperparameters JSONB,
    status VARCHAR(20) DEFAULT 'running',
    metrics JSONB,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    error_message TEXT
);

-- 特征表
CREATE TABLE learning.features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    importance DECIMAL(5,4),
    statistics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 预测记录表
CREATE TABLE learning.predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID REFERENCES learning.models(id),
    input_data JSONB NOT NULL,
    prediction JSONB NOT NULL,
    confidence DECIMAL(5,4),
    execution_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 反馈表
CREATE TABLE learning.feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prediction_id UUID REFERENCES learning.predictions(id),
    actual_outcome JSONB,
    feedback_score INTEGER CHECK (feedback_score BETWEEN 1 AND 5),
    feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==================== 分析表 ====================

-- 用户行为分析
CREATE TABLE analytics.user_behaviors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    context JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(100),
    device_info JSONB
);

-- 性能指标
CREATE TABLE analytics.performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service VARCHAR(100) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4) NOT NULL,
    tags JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 业务指标
CREATE TABLE analytics.business_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4) NOT NULL,
    dimension VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- ==================== 审计表 ====================

-- 审计日志
CREATE TABLE audit.logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(100),
    old_value JSONB,
    new_value JSONB,
    ip_address INET,
    user_agent TEXT,
    status VARCHAR(20),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 系统事件
CREATE TABLE audit.system_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    source VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    details JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==================== 创建索引 ====================

-- 学习系统索引
CREATE INDEX idx_models_name ON learning.models(name);
CREATE INDEX idx_models_status ON learning.models(status);
CREATE INDEX idx_training_runs_model_id ON learning.training_runs(model_id);
CREATE INDEX idx_training_runs_status ON learning.training_runs(status);
CREATE INDEX idx_training_runs_start_time ON learning.training_runs(start_time DESC);
CREATE INDEX idx_features_importance ON learning.features(importance DESC);
CREATE INDEX idx_predictions_model_id ON learning.predictions(model_id);
CREATE INDEX idx_predictions_created_at ON learning.predictions(created_at DESC);
CREATE INDEX idx_feedback_prediction_id ON learning.feedback(prediction_id);

-- 分析索引
CREATE INDEX idx_user_behaviors_user_id ON analytics.user_behaviors(user_id);
CREATE INDEX idx_user_behaviors_action ON analytics.user_behaviors(action);
CREATE INDEX idx_user_behaviors_timestamp ON analytics.user_behaviors(timestamp DESC);
CREATE INDEX idx_user_behaviors_session_id ON analytics.user_behaviors(session_id);
CREATE INDEX idx_performance_metrics_service ON analytics.performance_metrics(service);
CREATE INDEX idx_performance_metrics_timestamp ON analytics.performance_metrics(timestamp DESC);
CREATE INDEX idx_business_metrics_name ON analytics.business_metrics(metric_name);
CREATE INDEX idx_business_metrics_timestamp ON analytics.business_metrics(timestamp DESC);

-- 审计索引
CREATE INDEX idx_audit_logs_user_id ON audit.logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit.logs(action);
CREATE INDEX idx_audit_logs_timestamp ON audit.logs(timestamp DESC);
CREATE INDEX idx_system_events_type ON audit.system_events(event_type);
CREATE INDEX idx_system_events_severity ON audit.system_events(severity);
CREATE INDEX idx_system_events_timestamp ON audit.system_events(timestamp DESC);

-- JSONB索引（用于快速查询）
CREATE INDEX idx_models_parameters_gin ON learning.models USING gin(parameters);
CREATE INDEX idx_predictions_input_gin ON learning.predictions USING gin(input_data);
CREATE INDEX idx_user_behaviors_context_gin ON analytics.user_behaviors USING gin(context);

-- ==================== 创建视图 ====================

-- 模型性能视图
CREATE VIEW learning.model_performance AS
SELECT 
    m.id,
    m.name,
    m.version,
    m.type,
    COUNT(p.id) as total_predictions,
    AVG(p.confidence) as avg_confidence,
    AVG(f.feedback_score) as avg_feedback_score,
    AVG(p.execution_time_ms) as avg_execution_time
FROM learning.models m
LEFT JOIN learning.predictions p ON m.id = p.model_id
LEFT JOIN learning.feedback f ON p.id = f.prediction_id
WHERE m.status = 'active'
GROUP BY m.id, m.name, m.version, m.type;

-- 用户活跃度视图
CREATE VIEW analytics.user_activity AS
SELECT 
    user_id,
    DATE_TRUNC('day', timestamp) as activity_date,
    COUNT(*) as action_count,
    COUNT(DISTINCT action) as unique_actions,
    COUNT(DISTINCT session_id) as session_count
FROM analytics.user_behaviors
GROUP BY user_id, DATE_TRUNC('day', timestamp);

-- 系统健康视图
CREATE VIEW analytics.system_health AS
SELECT 
    service,
    DATE_TRUNC('hour', timestamp) as time_bucket,
    AVG(CASE WHEN metric_name = 'response_time' THEN metric_value END) as avg_response_time,
    AVG(CASE WHEN metric_name = 'cpu_usage' THEN metric_value END) as avg_cpu_usage,
    AVG(CASE WHEN metric_name = 'memory_usage' THEN metric_value END) as avg_memory_usage,
    COUNT(CASE WHEN metric_name = 'error_count' THEN 1 END) as error_count
FROM analytics.performance_metrics
GROUP BY service, DATE_TRUNC('hour', timestamp);

-- ==================== 创建函数 ====================

-- 更新时间戳函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为相关表创建触发器
CREATE TRIGGER update_models_updated_at BEFORE UPDATE ON learning.models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_features_updated_at BEFORE UPDATE ON learning.features
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 计算训练时长函数
CREATE OR REPLACE FUNCTION calculate_training_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.end_time IS NOT NULL AND NEW.start_time IS NOT NULL THEN
        NEW.duration_seconds = EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time));
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calc_training_duration BEFORE UPDATE ON learning.training_runs
    FOR EACH ROW EXECUTE FUNCTION calculate_training_duration();

-- ==================== 插入初始数据 ====================

-- 插入示例模型
INSERT INTO learning.models (name, version, type, parameters, metrics) VALUES
('behavioral_predictor', '1.0.0', 'classification', 
 '{"algorithm": "random_forest", "n_estimators": 100, "max_depth": 10}'::jsonb,
 '{"accuracy": 0.92, "precision": 0.89, "recall": 0.91}'::jsonb),
('pattern_recognizer', '1.0.0', 'clustering',
 '{"algorithm": "kmeans", "n_clusters": 5, "max_iter": 300}'::jsonb,
 '{"silhouette_score": 0.73, "inertia": 1234.56}'::jsonb),
('value_estimator', '1.0.0', 'regression',
 '{"algorithm": "gradient_boosting", "learning_rate": 0.1, "n_estimators": 100}'::jsonb,
 '{"rmse": 0.15, "r2_score": 0.87, "mae": 0.12}'::jsonb);

-- 插入特征
INSERT INTO learning.features (name, type, description, importance) VALUES
('user_action_frequency', 'numeric', '用户操作频率', 0.85),
('session_duration', 'numeric', '会话持续时间', 0.72),
('task_completion_rate', 'numeric', '任务完成率', 0.91),
('model_preference', 'categorical', '模型偏好', 0.68),
('interaction_patterns', 'text', '交互模式', 0.79);

-- ==================== 授权 ====================

-- 创建只读用户（用于分析和报表）
-- CREATE USER readonly_user WITH PASSWORD 'your_password';
-- GRANT USAGE ON SCHEMA learning, analytics, audit TO readonly_user;
-- GRANT SELECT ON ALL TABLES IN SCHEMA learning, analytics, audit TO readonly_user;

-- 创建应用用户（用于应用程序）
-- CREATE USER app_user WITH PASSWORD 'your_password';
-- GRANT USAGE ON SCHEMA learning, analytics, audit TO app_user;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA learning, analytics, audit TO app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA learning, analytics, audit TO app_user;

COMMENT ON DATABASE yyc3 IS 'YYC³智能AI浮窗系统数据库';
COMMENT ON SCHEMA learning IS '学习系统相关表';
COMMENT ON SCHEMA analytics IS '分析和指标表';
COMMENT ON SCHEMA audit IS '审计和日志表';

-- 完成
SELECT 'PostgreSQL数据库初始化完成！' as message;
