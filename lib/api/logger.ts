import { NextRequest } from 'next/server'
import { SystemRepository } from '@/lib/db/repositories/system.repository'

const systemRepository = new SystemRepository()

export interface LogContext {
  level: 'info' | 'warning' | 'error' | 'debug'
  action: string
  module?: string
  user_id?: number
  ip_address?: string
  user_agent?: string
  request_data?: any
  response_data?: any
  error_message?: string
  stack_trace?: string
  duration?: number
}

export class ApiLogger {
  static async log(context: LogContext): Promise<void> {
    try {
      await systemRepository.log(context)
    } catch (error) {
      console.error('Failed to log to database:', error)
      console.log('Log context:', context)
    }
  }

  static info(
    action: string,
    module?: string,
    additional?: Partial<LogContext>
  ): void {
    this.log({
      level: 'info',
      action,
      module,
      ...additional,
    })
  }

  static warning(
    action: string,
    module?: string,
    additional?: Partial<LogContext>
  ): void {
    this.log({
      level: 'warning',
      action,
      module,
      ...additional,
    })
  }

  static error(
    action: string,
    error: Error,
    module?: string,
    additional?: Partial<LogContext>
  ): void {
    this.log({
      level: 'error',
      action,
      module,
      error_message: error.message,
      stack_trace: error.stack,
      ...additional,
    })
  }

  static debug(
    action: string,
    module?: string,
    additional?: Partial<LogContext>
  ): void {
    this.log({
      level: 'debug',
      action,
      module,
      ...additional,
    })
  }
}

export function extractRequestInfo(request: NextRequest): {
  ip_address?: string
  user_agent?: string
} {
  const ip_address = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
  
  const user_agent = request.headers.get('user-agent') || 'unknown'

  return { ip_address, user_agent }
}

export function createLogContext(
  request: NextRequest,
  action: string,
  module?: string,
  user_id?: number
): Partial<LogContext> {
  const { ip_address, user_agent } = extractRequestInfo(request)

  return {
    action,
    module,
    user_id,
    ip_address,
    user_agent,
  }
}

export async function logApiRequest(
  request: NextRequest,
  action: string,
  module?: string,
  user_id?: number
): Promise<void> {
  const context = createLogContext(request, action, module, user_id)
  await ApiLogger.info(action, module, context)
}

export async function logApiError(
  request: NextRequest,
  action: string,
  error: Error,
  module?: string,
  user_id?: number
): Promise<void> {
  const context = createLogContext(request, action, module, user_id)
  await ApiLogger.error(action, error, module, context)
}

export function measurePerformance<T>(
  action: string,
  fn: () => Promise<T>,
  module?: string
): Promise<T> {
  const startTime = Date.now()

  return fn().finally(() => {
    const duration = Date.now() - startTime
    ApiLogger.info(action, module, { duration })
  })
}
