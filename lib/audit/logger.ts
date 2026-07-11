import { query } from '@/lib/db/client'

export type AuditAction =
  | 'create' | 'update' | 'delete'
  | 'login' | 'logout'
  | 'export' | 'import'
  | 'config_change'

export type AuditModule =
  | 'users' | 'customers' | 'tasks' | 'projects'
  | 'finance' | 'notifications' | 'system' | 'auth'

interface AuditLogParams {
  userId: string | number
  username?: string
  action: AuditAction
  module: AuditModule
  targetId?: string | number
  description?: string
  ipAddress?: string
  userAgent?: string
}

export async function writeAuditLog(params: AuditLogParams): Promise<void> {
  try {
    await query(
      `INSERT INTO system_logs (user_id, username, action, module, target_id, description, ip_address, user_agent, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)`,
      [
        String(params.userId),
        params.username ?? null,
        params.action,
        params.module,
        params.targetId != null ? String(params.targetId) : null,
        params.description ?? null,
        params.ipAddress ?? null,
        params.userAgent ?? null,
      ]
    )
  } catch {
    // Audit logging should never break the main operation
  }
}
