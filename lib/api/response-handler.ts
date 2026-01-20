import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export interface ApiError {
  success: false
  error: string
  details?: any
  code?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export class ApiErrorHandler {
  static handle(error: unknown): NextResponse<ApiError> {
    console.error('API Error:', error)

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: '数据验证失败',
          details: error.errors,
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      const statusCode = this.getHttpStatusCode(error)
      
      return NextResponse.json(
        {
          success: false,
          error: error.message || '服务器内部错误',
          code: error.name,
        },
        { status: statusCode }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: '服务器内部错误',
        code: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    )
  }

  private static getHttpStatusCode(error: Error): number {
    const errorMessages: Record<string, number> = {
      'ValidationError': 400,
      'UnauthorizedError': 401,
      'ForbiddenError': 403,
      'NotFoundError': 404,
      'ConflictError': 409,
      'UnprocessableEntityError': 422,
    }

    return errorMessages[error.name] || 500
  }

  static validation(message: string, details?: any): NextResponse<ApiError> {
    return NextResponse.json(
      {
        success: false,
        error: message,
        details,
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    )
  }

  static unauthorized(message: string = '未授权访问'): NextResponse<ApiError> {
    return NextResponse.json(
      {
        success: false,
        error: message,
        code: 'UNAUTHORIZED',
      },
      { status: 401 }
    )
  }

  static forbidden(message: string = '无权访问'): NextResponse<ApiError> {
    return NextResponse.json(
      {
        success: false,
        error: message,
        code: 'FORBIDDEN',
      },
      { status: 403 }
    )
  }

  static notFound(message: string = '资源不存在'): NextResponse<ApiError> {
    return NextResponse.json(
      {
        success: false,
        error: message,
        code: 'NOT_FOUND',
      },
      { status: 404 }
    )
  }

  static conflict(message: string): NextResponse<ApiError> {
    return NextResponse.json(
      {
        success: false,
        error: message,
        code: 'CONFLICT',
      },
      { status: 409 }
    )
  }

  static serverError(message: string = '服务器内部错误'): NextResponse<ApiError> {
    return NextResponse.json(
      {
        success: false,
        error: message,
        code: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    )
  }

  static serviceUnavailable(message: string = '服务暂时不可用'): NextResponse<ApiError> {
    return NextResponse.json(
      {
        success: false,
        error: message,
        code: 'SERVICE_UNAVAILABLE',
      },
      { status: 503 }
    )
  }
}

export function successResponse<T>(data: T, status: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  )
}

export function createdResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status: 201 }
  )
}

export function paginatedResponse<T>(
  data: T[],
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
): NextResponse<ApiResponse<T[]>> {
  return NextResponse.json({
    success: true,
    data,
    pagination,
  })
}

export function messageResponse(message: string, status: number = 200): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: true,
      message,
    },
    { status }
  )
}
