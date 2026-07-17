import { query } from '../client'
import type { Repository } from './base'

export interface AIRecord {
  id: number
  record_type: string
  request_content: string
  response_content: string
  model_used: string
  tokens_used: number
  cost: number
  user_id: number
  duration_ms: number
  status: string
  create_time: Date
}

export const aiRepository: Repository<AIRecord> = {
  async findById(id) {
    const rows = await query<AIRecord>('SELECT * FROM ai_assistant_log WHERE id = $1', [id])
    return rows[0] || null
  },

  async findAll(params) {
    let sql = 'SELECT * FROM ai_assistant_log'
    const values: unknown[] = []
    if (params?.record_type) {
      sql += ' WHERE record_type = $1'
      values.push(params.record_type)
    }
    sql += ' ORDER BY create_time DESC LIMIT 100'
    return query<AIRecord>(sql, values)
  },

  async create(data) {
    const rows = await query<AIRecord>(
      `INSERT INTO ai_assistant_log (record_type, request_content, response_content, model_used, tokens_used, cost, user_id, duration_ms, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [data.record_type, data.request_content, data.response_content, data.model_used, data.tokens_used, data.cost, data.user_id, data.duration_ms, data.status]
    )
    return rows[0]
  },

  async update(id, data) {
    const sets: string[] = []
    const values: unknown[] = []
    let idx = 1
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        sets.push(`${key} = $${idx++}`)
        values.push(value)
      }
    }
    if (sets.length === 0) return null
    values.push(id)
    const rows = await query<AIRecord>(
      `UPDATE ai_assistant_log SET ${sets.join(', ')}, update_time = NOW() WHERE id = $${idx} RETURNING *`,
      values
    )
    return rows[0] || null
  },

  async delete(id) {
    const rows = await query('DELETE FROM ai_assistant_log WHERE id = $1 RETURNING id', [id])
    return rows.length > 0
  }
}

export const analysisRepository: Repository<any> = {
  async findById(id) {
    const rows = await query('SELECT * FROM analysis_report_config WHERE id = $1', [id])
    return rows[0] || null
  },
  async findAll() {
    return query('SELECT * FROM analysis_report_config ORDER BY create_time DESC')
  },
  async create(data) {
    const rows = await query(
      `INSERT INTO analysis_report_config (report_name, report_type, config_json, creator) VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.report_name, data.report_type, data.config_json, data.creator]
    )
    return rows[0]
  },
  async update(id, data) {
    const sets: string[] = []
    const values: unknown[] = []
    let idx = 1
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        sets.push(`${key} = $${idx++}`)
        values.push(value)
      }
    }
    if (sets.length === 0) return null
    values.push(id)
    const rows = await query(
      `UPDATE analysis_report_config SET ${sets.join(', ')}, update_time = NOW() WHERE id = $${idx} RETURNING *`,
      values
    )
    return rows[0] || null
  },
  async delete(id) {
    const rows = await query('DELETE FROM analysis_report_config WHERE id = $1 RETURNING id', [id])
    return rows.length > 0
  }
}

export const approvalRepository: Repository<any> = {
  async findById(id) {
    const rows = await query('SELECT * FROM approval_record WHERE id = $1', [id])
    return rows[0] || null
  },
  async findAll(params) {
    let sql = 'SELECT * FROM approval_record'
    const values: unknown[] = []
    if (params?.applicant) {
      sql += ' WHERE applicant = $1'
      values.push(params.applicant)
    }
    sql += ' ORDER BY create_time DESC LIMIT 50'
    return query(sql, values)
  },
  async create(data) {
    const rows = await query(
      `INSERT INTO approval_record (approval_type, title, content, applicant, approver, status, urgency)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [data.approval_type, data.title, data.content, data.applicant, data.approver, data.status, data.urgency]
    )
    return rows[0]
  },
  async update(id, data) {
    const sets: string[] = []
    const values: unknown[] = []
    let idx = 1
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        sets.push(`${key} = $${idx++}`)
        values.push(value)
      }
    }
    if (sets.length === 0) return null
    values.push(id)
    const rows = await query(
      `UPDATE approval_record SET ${sets.join(', ')}, update_time = NOW() WHERE id = $${idx} RETURNING *`,
      values
    )
    return rows[0] || null
  },
  async delete(id) {
    const rows = await query('DELETE FROM approval_record WHERE id = $1 RETURNING id', [id])
    return rows.length > 0
  }
}
