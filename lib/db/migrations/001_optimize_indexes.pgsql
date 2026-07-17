-- ============================================================
-- YYC³ 企业智能管理系统 — 数据库正向优化迁移 v1.0.0
-- 执行: psql -h localhost -p 5433 -d yyc3_33 -f 001_optimize_indexes.sql
-- IDE 注意: CREATE INDEX IF NOT EXISTS 是 PostgreSQL 原生语法，
-- IDE 的 SQL 解析器可能误报语法错误（实际运行正常）
-- ============================================================

-- ====================================
-- 1. 通用时间索引（每表必需）
-- ====================================
CREATE INDEX IF NOT EXISTS idx_sys_config_create_time ON sys_config(create_time);
CREATE INDEX IF NOT EXISTS idx_sys_user_create_time ON sys_user(create_time);
CREATE INDEX IF NOT EXISTS idx_ai_assistant_log_create_time ON ai_assistant_log(create_time);
CREATE INDEX IF NOT EXISTS idx_ai_chatbot_log_create_time ON ai_chatbot_log(create_time);
CREATE INDEX IF NOT EXISTS idx_process_instance_create_time ON process_instance(create_time);
CREATE INDEX IF NOT EXISTS idx_approval_record_create_time ON approval_record(create_time);
CREATE INDEX IF NOT EXISTS idx_sys_operation_log_create_time ON sys_operation_log(create_time);

-- ====================================
-- 2. 业务查询索引
-- ====================================

-- 客户管理
CREATE INDEX IF NOT EXISTS idx_customer_info_phone ON customer_info(phone);
CREATE INDEX IF NOT EXISTS idx_customer_info_email ON customer_info(email);
CREATE INDEX IF NOT EXISTS idx_customer_info_level ON customer_info(customer_level);
CREATE INDEX IF NOT EXISTS idx_customer_behavior_log_customer_id ON customer_behavior_log(customer_id);

-- 销售/订单
CREATE INDEX IF NOT EXISTS idx_sale_order_order_date ON sale_order(order_date);
CREATE INDEX IF NOT EXISTS idx_sale_order_customer_id ON sale_order(customer_id);
CREATE INDEX IF NOT EXISTS idx_sale_order_status ON sale_order(status);

-- 采购
CREATE INDEX IF NOT EXISTS idx_purchase_order_supplier_id ON purchase_order(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_order_status ON purchase_order(status);

-- 商品
CREATE INDEX IF NOT EXISTS idx_goods_info_category_id ON goods_info(category_id);
CREATE INDEX IF NOT EXISTS idx_goods_info_brand_id ON goods_info(brand_id);

-- 库存
CREATE INDEX IF NOT EXISTS idx_inventory_stock_goods_id ON inventory_stock(goods_id);
CREATE INDEX IF NOT EXISTS idx_inventory_stock_warehouse_id ON inventory_stock(warehouse_id);

-- 审批/工作流
CREATE INDEX IF NOT EXISTS idx_approval_record_applicant ON approval_record(applicant);
CREATE INDEX IF NOT EXISTS idx_approval_record_status ON approval_record(status);
CREATE INDEX IF NOT EXISTS idx_process_instance_initiator ON process_instance(initiator);
CREATE INDEX IF NOT EXISTS idx_process_instance_status ON process_instance(instance_status);

-- 人事
CREATE INDEX IF NOT EXISTS idx_manage_employee_department_id ON manage_employee(department_id);
CREATE INDEX IF NOT EXISTS idx_manage_employee_status ON manage_employee(status);

-- 风险
CREATE INDEX IF NOT EXISTS idx_risk_assessment_level ON risk_assessment(risk_level);
CREATE INDEX IF NOT EXISTS idx_risk_assessment_status ON risk_assessment(status);

-- 战略/KPI
CREATE INDEX IF NOT EXISTS idx_strategy_kpi_goal_id ON strategy_kpi(goal_id);
CREATE INDEX IF NOT EXISTS idx_strategy_plan_goal_id ON strategy_plan(goal_id);

-- ====================================
-- 3. 软删除字段补充
-- ====================================
ALTER TABLE sys_user ADD COLUMN IF NOT EXISTS is_deleted smallint DEFAULT 0;
ALTER TABLE customer_info ADD COLUMN IF NOT EXISTS is_deleted smallint DEFAULT 0;
ALTER TABLE manage_employee ADD COLUMN IF NOT EXISTS is_deleted smallint DEFAULT 0;
ALTER TABLE goods_info ADD COLUMN IF NOT EXISTS is_deleted smallint DEFAULT 0;
ALTER TABLE project_info ADD COLUMN IF NOT EXISTS is_deleted smallint DEFAULT 0;

-- ====================================
-- 4. 时区规范化（timestamp → timestamptz）
-- ====================================
ALTER TABLE sys_config ALTER COLUMN create_time TYPE timestamptz;
ALTER TABLE sys_config ALTER COLUMN update_time TYPE timestamptz;
ALTER TABLE sys_user ALTER COLUMN create_time TYPE timestamptz;
ALTER TABLE sys_user ALTER COLUMN update_time TYPE timestamptz;
ALTER TABLE sys_user ALTER COLUMN last_login_time TYPE timestamptz;

-- ====================================
-- 5. 外键约束补充（引用完整性）
-- ====================================
-- 注: 以下外键在数据清洗后启用
-- ALTER TABLE manage_employee ADD CONSTRAINT fk_employee_department
--   FOREIGN KEY (department_id) REFERENCES manage_department(id);
-- ALTER TABLE sale_order ADD CONSTRAINT fk_sale_customer
--   FOREIGN KEY (customer_id) REFERENCES customer_info(id);
-- ALTER TABLE purchase_order ADD CONSTRAINT fk_purchase_supplier
--   FOREIGN KEY (supplier_id) REFERENCES purchase_supplier(id);

-- ====================================
-- 6. 解析注释说明
-- ====================================
COMMENT ON COLUMN sys_user.password IS 'bcrypt 加密密码，格式: $2b$10$...';
COMMENT ON COLUMN customer_info.customer_level IS '客户等级: 1-普通, 2-银卡, 3-金卡, 4-钻石';
COMMENT ON COLUMN manage_employee.status IS '状态: 1-在职, 2-离职, 3-休假';
COMMENT ON COLUMN process_instance.instance_status IS '状态: 0-草稿, 1-进行中, 2-通过, 3-驳回, 4-已撤销';
COMMENT ON COLUMN sale_order.status IS '状态: 1-待付款, 2-待发货, 3-已发货, 4-已完成, 5-已取消';
COMMENT ON COLUMN risk_assessment.risk_level IS '风险等级: 1-低, 2-中, 3-高, 4-严重';
