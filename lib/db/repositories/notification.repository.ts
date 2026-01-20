import { query } from '../client'
import type {
  Notification,
  CreateNotificationData,
  NotificationSearchParams,
  NotificationListResponse,
} from '../models/notification'

export class NotificationRepository {
  async findAll(params: NotificationSearchParams = {}): Promise<NotificationListResponse> {
    const {
      page = 1,
      limit = 10,
      user_id,
      is_read,
      type,
      priority,
    } = params

    const offset = (page - 1) * limit

    let whereClauses: string[] = []
    let queryParams: any[] = []
    let paramIndex = 1

    if (user_id) {
      whereClauses.push(`user_id = $${paramIndex}`)
      queryParams.push(user_id)
      paramIndex++
    }

    if (is_read !== undefined) {
      whereClauses.push(`is_read = $${paramIndex}`)
      queryParams.push(is_read)
      paramIndex++
    }

    if (type) {
      whereClauses.push(`type = $${paramIndex}`)
      queryParams.push(type)
      paramIndex++
    }

    if (priority) {
      whereClauses.push(`priority = $${paramIndex}`)
      queryParams.push(priority)
      paramIndex++
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

    const countQuery = `
      SELECT COUNT(*) as total
      FROM notifications
      ${whereClause}
    `

    const dataQuery = `
      SELECT * FROM notifications
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    queryParams.push(limit, offset)

    const [countResult, dataResult] = await Promise.all([
      query(countQuery, queryParams.slice(0, paramIndex - 1)),
      query(dataQuery, queryParams),
    ])

    const total = parseInt(countResult[0].total)
    const totalPages = Math.ceil(total / limit)

    return {
      data: dataResult as Notification[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }
  }

  async findById(id: number): Promise<Notification | null> {
    const result = await query(
      'SELECT * FROM notifications WHERE id = $1',
      [id]
    )
    return result[0] as Notification || null
  }

  async create(data: CreateNotificationData): Promise<Notification> {
    const result = await query(
      `INSERT INTO notifications (
        title, message, type, priority, user_id, from_user
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        data.title,
        data.message,
        data.type,
        data.priority || '普通',
        data.user_id,
        data.from_user,
      ]
    )
    return result[0] as Notification
  }

  async markAsRead(id: number): Promise<Notification | null> {
    const result = await query(
      `UPDATE notifications 
       SET is_read = true, read_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [id]
    )
    return result[0] as Notification || null
  }

  async markAllAsRead(userId: number): Promise<void> {
    await query(
      `UPDATE notifications 
       SET is_read = true, read_at = CURRENT_TIMESTAMP 
       WHERE user_id = $1 AND is_read = false`,
      [userId]
    )
  }

  async delete(id: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM notifications WHERE id = $1 RETURNING id',
      [id]
    )
    return result.length > 0
  }

  async deleteAllRead(userId: number): Promise<number> {
    const result = await query(
      'DELETE FROM notifications WHERE user_id = $1 AND is_read = true RETURNING id',
      [userId]
    )
    return result.length
  }

  async getUnreadCount(userId: number): Promise<number> {
    const result = await query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false',
      [userId]
    )
    return parseInt(result[0].count)
  }
}
