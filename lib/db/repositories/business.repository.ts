import { query } from '../client'
import type { Repository } from './base'

export const hrRepository: Repository<any> = {
  async findById(id) {
    const rows = await query('SELECT * FROM manage_employee WHERE id = $1', [id])
    return rows[0] || null
  },
  async findAll(params) {
    let sql = 'SELECT * FROM manage_employee'
    const values: unknown[] = []
    if (params?.department_id) {
      sql += ' WHERE department_id = $1'
      values.push(params.department_id)
    }
    sql += ' ORDER BY create_time DESC LIMIT 100'
    return query(sql, values)
  },
  async create(data) {
    const rows = await query(
      `INSERT INTO manage_employee (user_code, real_name, email, phone, department_id, position, entry_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [data.user_code, data.real_name, data.email, data.phone, data.department_id, data.position, data.entry_date, data.status]
    )
    return rows[0]
  },
  async update(id, data) {
    const sets: string[] = []; const values: unknown[] = []; let idx = 1
    for (const [k, v] of Object.entries(data)) { if (v !== undefined) { sets.push(`${k} = $${idx++}`); values.push(v) } }
    if (!sets.length) return null
    values.push(id)
    const rows = await query(`UPDATE manage_employee SET ${sets.join(', ')}, update_time = NOW() WHERE id = $${idx} RETURNING *`, values)
    return rows[0] || null
  },
  async delete(id) {
    const rows = await query('DELETE FROM manage_employee WHERE id = $1 RETURNING id', [id])
    return rows.length > 0
  }
}

export const purchaseRepository: Repository<any> = {
  async findById(id) {
    const rows = await query('SELECT * FROM purchase_order WHERE id = $1', [id])
    return rows[0] || null
  },
  async findAll(params) {
    let sql = 'SELECT po.*, s.name as supplier_name FROM purchase_order po LEFT JOIN purchase_supplier s ON po.supplier_id = s.id'
    const values: unknown[] = []
    if (params?.status) { sql += ' WHERE po.status = $1'; values.push(params.status) }
    sql += ' ORDER BY po.create_time DESC LIMIT 50'
    return query(sql, values)
  },
  async create(data) {
    const rows = await query(
      `INSERT INTO purchase_order (order_no, supplier_id, total_amount, status, creator, remark) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [data.order_no, data.supplier_id, data.total_amount, data.status, data.creator, data.remark]
    )
    return rows[0]
  },
  async update(id, data) {
    const sets: string[] = []; const values: unknown[] = []; let idx = 1
    for (const [k, v] of Object.entries(data)) { if (v !== undefined) { sets.push(`${k} = $${idx++}`); values.push(v) } }
    if (!sets.length) return null
    values.push(id)
    const rows = await query(`UPDATE purchase_order SET ${sets.join(', ')}, update_time = NOW() WHERE id = $${idx} RETURNING *`, values)
    return rows[0] || null
  },
  async delete(id) {
    const rows = await query('DELETE FROM purchase_order WHERE id = $1 RETURNING id', [id])
    return rows.length > 0
  }
}

export const saleRepository: Repository<any> = {
  async findById(id) {
    const rows = await query('SELECT * FROM sale_order WHERE id = $1', [id])
    return rows[0] || null
  },
  async findAll(params) {
    let sql = 'SELECT * FROM sale_order'
    const values: unknown[] = []
    if (params?.customer_id) { sql += ' WHERE customer_id = $1'; values.push(params.customer_id) }
    sql += ' ORDER BY create_time DESC LIMIT 50'
    return query(sql, values)
  },
  async create(data) {
    const rows = await query(
      `INSERT INTO sale_order (order_no, customer_id, total_amount, status, sales_person, remark) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [data.order_no, data.customer_id, data.total_amount, data.status, data.sales_person, data.remark]
    )
    return rows[0]
  },
  async update(id, data) {
    const sets: string[] = []; const values: unknown[] = []; let idx = 1
    for (const [k, v] of Object.entries(data)) { if (v !== undefined) { sets.push(`${k} = $${idx++}`); values.push(v) } }
    if (!sets.length) return null
    values.push(id)
    const rows = await query(`UPDATE sale_order SET ${sets.join(', ')}, update_time = NOW() WHERE id = $${idx} RETURNING *`, values)
    return rows[0] || null
  },
  async delete(id) {
    const rows = await query('DELETE FROM sale_order WHERE id = $1 RETURNING id', [id])
    return rows.length > 0
  }
}

export const inventoryRepository: Repository<any> = {
  async findById(id) {
    const rows = await query('SELECT * FROM inventory_stock WHERE id = $1', [id])
    return rows[0] || null
  },
  async findAll(params) {
    let sql = 'SELECT is.*, gi.name as goods_name FROM inventory_stock is LEFT JOIN goods_info gi ON is.goods_id = gi.id'
    const values: unknown[] = []
    if (params?.warehouse_id) { sql += ' WHERE is.warehouse_id = $1'; values.push(params.warehouse_id) }
    sql += ' ORDER BY is.update_time DESC LIMIT 100'
    return query(sql, values)
  },
  async create(data) {
    const rows = await query(
      `INSERT INTO inventory_stock (goods_id, warehouse_id, quantity, batch_no) VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.goods_id, data.warehouse_id, data.quantity, data.batch_no]
    )
    return rows[0]
  },
  async update(id, data) {
    const sets: string[] = []; const values: unknown[] = []; let idx = 1
    for (const [k, v] of Object.entries(data)) { if (v !== undefined) { sets.push(`${k} = $${idx++}`); values.push(v) } }
    if (!sets.length) return null
    values.push(id)
    const rows = await query(`UPDATE inventory_stock SET ${sets.join(', ')}, update_time = NOW() WHERE id = $${idx} RETURNING *`, values)
    return rows[0] || null
  },
  async delete(id) {
    const rows = await query('DELETE FROM inventory_stock WHERE id = $1 RETURNING id', [id])
    return rows.length > 0
  }
}

export const riskRepository: Repository<any> = {
  async findById(id) {
    const rows = await query('SELECT * FROM risk_assessment WHERE id = $1', [id])
    return rows[0] || null
  },
  async findAll(params) {
    let sql = 'SELECT * FROM risk_assessment'
    const values: unknown[] = []
    if (params?.risk_level) { sql += ' WHERE risk_level = $1'; values.push(params.risk_level) }
    sql += ' ORDER BY create_time DESC LIMIT 50'
    return query(sql, values)
  },
  async create(data) {
    const rows = await query(
      `INSERT INTO risk_assessment (risk_name, risk_type, risk_level, description, owner, status, mitigation_plan) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [data.risk_name, data.risk_type, data.risk_level, data.description, data.owner, data.status, data.mitigation_plan]
    )
    return rows[0]
  },
  async update(id, data) {
    const sets: string[] = []; const values: unknown[] = []; let idx = 1
    for (const [k, v] of Object.entries(data)) { if (v !== undefined) { sets.push(`${k} = $${idx++}`); values.push(v) } }
    if (!sets.length) return null
    values.push(id)
    const rows = await query(`UPDATE risk_assessment SET ${sets.join(', ')}, update_time = NOW() WHERE id = $${idx} RETURNING *`, values)
    return rows[0] || null
  },
  async delete(id) {
    const rows = await query('DELETE FROM risk_assessment WHERE id = $1 RETURNING id', [id])
    return rows.length > 0
  }
}

export const strategyRepository: Repository<any> = {
  async findById(id) {
    const rows = await query('SELECT * FROM strategy_plan WHERE id = $1', [id])
    return rows[0] || null
  },
  async findAll(params) {
    let sql = 'SELECT sp.*, sg.name as goal_name FROM strategy_plan sp LEFT JOIN strategy_goal sg ON sp.goal_id = sg.id'
    const values: unknown[] = []
    if (params?.status) { sql += ' WHERE sp.status = $1'; values.push(params.status) }
    sql += ' ORDER BY sp.create_time DESC LIMIT 50'
    return query(sql, values)
  },
  async create(data) {
    const rows = await query(
      `INSERT INTO strategy_plan (plan_name, goal_id, description, start_date, end_date, status, owner) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [data.plan_name, data.goal_id, data.description, data.start_date, data.end_date, data.status, data.owner]
    )
    return rows[0]
  },
  async update(id, data) {
    const sets: string[] = []; const values: unknown[] = []; let idx = 1
    for (const [k, v] of Object.entries(data)) { if (v !== undefined) { sets.push(`${k} = $${idx++}`); values.push(v) } }
    if (!sets.length) return null
    values.push(id)
    const rows = await query(`UPDATE strategy_plan SET ${sets.join(', ')}, update_time = NOW() WHERE id = $${idx} RETURNING *`, values)
    return rows[0] || null
  },
  async delete(id) {
    const rows = await query('DELETE FROM strategy_plan WHERE id = $1 RETURNING id', [id])
    return rows.length > 0
  }
}
