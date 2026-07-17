-- ============================================================
-- YYC³ 数据库正向优化迁移 v1.0.1 — 基于实际表结构补齐
-- ============================================================

-- ====================================
-- 1. 业务索引补齐（基于实际列名）
-- ====================================

-- 客户管理: customer_info → 使用 phone_no/email 等实际列名
CREATE INDEX IF NOT EXISTS idx_customer_info_phone ON customer_info(phone_no);
CREATE INDEX IF NOT EXISTS idx_customer_info_email ON customer_info(email);
CREATE INDEX IF NOT EXISTS idx_customer_contact_customer_id ON customer_contact(customer_id);

-- 销售订单: sale_order → 使用 order_status/order_date/customer_id
CREATE INDEX IF NOT EXISTS idx_sale_order_customer_id ON sale_order(customer_id);
CREATE INDEX IF NOT EXISTS idx_sale_order_date ON sale_order(order_date);
CREATE INDEX IF NOT EXISTS idx_sale_order_status ON sale_order(order_status);
CREATE INDEX IF NOT EXISTS idx_sale_order_delivery_date ON sale_order(delivery_date);

-- 采购订单: purchase_order → 使用 order_status/pay_status
CREATE INDEX IF NOT EXISTS idx_purchase_order_status ON purchase_order(order_status);
CREATE INDEX IF NOT EXISTS idx_purchase_order_pay_status ON purchase_order(pay_status);
CREATE INDEX IF NOT EXISTS idx_purchase_order_supplier ON purchase_order(supplier_id);

-- 商品: goods_info
CREATE INDEX IF NOT EXISTS idx_goods_info_category ON goods_info(category_id);
CREATE INDEX IF NOT EXISTS idx_goods_info_brand ON goods_info(brand_id);

-- 库存: inventory_stock
CREATE INDEX IF NOT EXISTS idx_inventory_stock_store ON inventory_stock(store_id);

-- 审批记录: approval_record → 使用 approver/approve_action
CREATE INDEX IF NOT EXISTS idx_approval_record_approver ON approval_record(approver);
CREATE INDEX IF NOT EXISTS idx_approval_record_action ON approval_record(approve_action);
CREATE INDEX IF NOT EXISTS idx_approval_record_instance ON approval_record(instance_id);

-- 流程实例: process_instance
CREATE INDEX IF NOT EXISTS idx_process_instance_initiator ON process_instance(initiator);
CREATE INDEX IF NOT EXISTS idx_process_instance_status ON process_instance(instance_status);
CREATE INDEX IF NOT EXISTS idx_process_instance_business ON process_instance(business_type);

-- 人事: manage_employee
CREATE INDEX IF NOT EXISTS idx_employee_department ON manage_employee(department_id);
CREATE INDEX IF NOT EXISTS idx_employee_status ON manage_employee(employee_status);

-- 人事表补充软删除
ALTER TABLE manage_employee ADD COLUMN IF NOT EXISTS is_deleted smallint DEFAULT 0;

-- ====================================
-- 2. 创建迁移记录表（if not exists）
-- ====================================
CREATE TABLE IF NOT EXISTS sys_migration (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL UNIQUE,
  executed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  checksum VARCHAR(64),
  duration_ms INTEGER
);

-- 记录本次迁移
INSERT INTO sys_migration (filename, checksum, duration_ms)
VALUES ('001_optimize_indexes_v2.sql', 'v2_actual_schema', 0)
ON CONFLICT (filename) DO NOTHING;

-- ====================================
-- 3. COMMENT 注释添加
-- ====================================
COMMENT ON COLUMN sale_order.order_status IS '订单状态: 0-待确认, 1-处理中, 2-已发货, 3-已完成, 4-已取消';
COMMENT ON COLUMN purchase_order.order_status IS '采购状态: 0-待审核, 1-已审核, 2-已收货, 3-已完成';
COMMENT ON COLUMN manage_employee.employee_status IS '员工状态: 1-在职, 2-离职, 3-休假';
COMMENT ON COLUMN process_instance.instance_status IS '实例状态: 0-草稿, 1-运行中, 2-已完成, 3-已终止';
COMMENT ON COLUMN approval_record.approve_action IS '审批动作: 1-通过, 2-驳回, 3-转签, 4-加签';
