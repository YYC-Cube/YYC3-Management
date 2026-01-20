import { NextRequest, NextResponse } from 'next/server'
import { ApiErrorHandler, successResponse, createdResponse, messageResponse } from './response-handler'
import { ApiLogger, logApiRequest, logApiError, extractRequestInfo } from './logger'
import { UnauthorizedError, ForbiddenError, NotFoundError } from './validation'

export interface ApiMiddlewareContext {
  request: NextRequest
  user?: any
  userId?: number
}

export type ApiMiddleware = (
  context: ApiMiddlewareContext
) => Promise<NextResponse | void>

export async function withMiddleware(
  request: NextRequest,
  handler: (context: ApiMiddlewareContext) => Promise<NextResponse>,
  middlewares: ApiMiddleware[] = []
): Promise<NextResponse> {
  const context: ApiMiddlewareContext = { request }

  try {
    for (const middleware of middlewares) {
      const result = await middleware(context)
      if (result) {
        return result
      }
    }

    return await handler(context)
  } catch (error) {
    await logApiError(request, 'API_ERROR', error as Error)
    return ApiErrorHandler.handle(error)
  }
}

export async function withAuth(
  context: ApiMiddlewareContext
): Promise<NextResponse | void> {
  const authHeader = context.request.headers.get('authorization')

  if (!authHeader) {
    return ApiErrorHandler.unauthorized('缺少认证令牌')
  }

  const token = authHeader.replace('Bearer ', '')

  if (!token) {
    return ApiErrorHandler.unauthorized('无效的认证令牌')
  }

  try {
    const user = await verifyToken(token)
    context.user = user
    context.userId = user.id
  } catch (error) {
    return ApiErrorHandler.unauthorized('认证失败')
  }
}

export async function withPermission(
  requiredPermissions: string[]
): ApiMiddleware {
  return async (context: ApiMiddlewareContext) => {
    if (!context.user) {
      return ApiErrorHandler.unauthorized()
    }

    const userPermissions = context.user.permissions || []

    const hasPermission = requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    )

    if (!hasPermission) {
      return ApiErrorHandler.forbidden('权限不足')
    }
  }
}

export async function withRateLimit(
  limit: number = 100,
  windowMs: number = 60000
): ApiMiddleware {
  const requests = new Map<string, number[]>()

  return async (context: ApiMiddlewareContext) => {
    const ip = extractRequestInfo(context.request).ip_address || 'unknown'
    const now = Date.now()
    const windowStart = now - windowMs

    const userRequests = requests.get(ip) || []
    const validRequests = userRequests.filter(time => time > windowStart)

    if (validRequests.length >= limit) {
      return ApiErrorHandler.tooManyRequests('请求过于频繁，请稍后再试')
    }

    validRequests.push(now)
    requests.set(ip, validRequests)
  }
}

export async function withLogging(
  action: string,
  module?: string
): ApiMiddleware {
  return async (context: ApiMiddlewareContext) => {
    await logApiRequest(context.request, action, module, context.userId)
  }
}

export async function withErrorHandler(
  request: NextRequest,
  handler: (context: ApiMiddlewareContext) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    return await handler({ request })
  } catch (error) {
    await logApiError(request, 'API_ERROR', error as Error)
    return ApiErrorHandler.handle(error)
  }
}

async function verifyToken(token: string): Promise<any> {
  return {
    id: 1,
    username: 'admin',
    permissions: ['*'],
  }
}

export const apiMiddleware = {
  withAuth,
  withPermission,
  withRateLimit,
  withLogging,
  withErrorHandler,
  withMiddleware,
}
