/**
 * Validation Middleware
 * 验证中间件
 *
 * 使用Zod进行请求体验证
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { ZodType, ZodError } from 'zod';

/**
 * 验证错误响应格式
 */
interface ValidationError {
  success: false;
  error: {
    code: 'VALIDATION_ERROR';
    message: string;
    details: Array<{
      path: (string | number)[];
      message: string;
      code: string;
    }>;
  };
}

/**
 * 创建验证错误响应
 */
function createValidationError(error: ZodError): ValidationError {
  return {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: '请求数据验证失败',
      details: error.errors.map((err) => ({
        path: err.path,
        message: err.message,
        code: err.code,
      })),
    },
  };
}

/**
 * 验证请求体
 */
export function validateRequestBody<T extends ZodType>(schema: T) {
  return async (req: NextRequest): Promise<{ success: true; data: z.infer<T> } | ValidationError> => {
    try {
      // 检查Content-Type
      const contentType = req.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Content-Type必须是application/json',
            details: [],
          },
        };
      }

      // 解析请求体
      const body = await req.json();

      // 验证数据
      const validated = schema.parse(body);

      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return createValidationError(error);
      }
      throw error;
    }
  };
}

/**
 * 验证查询参数
 */
export function validateQuery<T extends ZodType>(schema: T) {
  return (req: NextRequest): { success: true; data: z.infer<T> } | ValidationError => {
    try {
      const { searchParams } = new URL(req.url);
      const query: Record<string, string> = {};

      // 将URLSearchParams转换为对象
      searchParams.forEach((value, key) => {
        query[key] = value;
      });

      // 验证数据
      const validated = schema.parse(query);

      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return createValidationError(error);
      }
      throw error;
    }
  };
}

/**
 * 验证路径参数
 */
export function validatePathParams<T extends ZodType>(schema: T) {
  return (
    params: Record<string, string>
  ): { success: true; data: z.infer<T> } | ValidationError => {
    try {
      const validated = schema.parse(params);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return createValidationError(error);
      }
      throw error;
    }
  };
}

/**
 * 验证请求头
 */
export function validateHeaders<T extends ZodType>(schema: T) {
  return (req: NextRequest): { success: true; data: z.infer<T> } | ValidationError => {
    try {
      const headers: Record<string, string> = {};

      req.headers.forEach((value, key) => {
        headers[key] = value;
      });

      const validated = schema.parse(headers);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return createValidationError(error);
      }
      throw error;
    }
  };
}

/**
 * 组合验证器
 */
export function validateRequest<TBody extends ZodType, TQuery extends ZodType>(
  config: {
    body?: TBody;
    query?: TQuery;
  }
) {
  return async (
    req: NextRequest
  ): Promise<
    | { success: true; data: { body?: z.infer<TBody>; query?: z.infer<TQuery> } }
    | ValidationError
  > => {
    const result: { body?: any; query?: any } = {};

    // 验证请求体
    if (config.body) {
      const bodyResult = await validateRequestBody(config.body)(req);
      if (!bodyResult.success) {
        return bodyResult;
      }
      result.body = bodyResult.data;
    }

    // 验证查询参数
    if (config.query) {
      const queryResult = validateQuery(config.query)(req);
      if (!queryResult.success) {
        return queryResult;
      }
      result.query = queryResult.data;
    }

    return { success: true, data: result };
  };
}

/**
 * 创建验证中间件
 */
export function withValidation<T extends ZodType>(
  schema: T,
  target: 'body' | 'query' | 'params' = 'body'
) {
  return (
    handler: (req: NextRequest, context?: any) => Promise<Response>
  ) => {
    return async (req: NextRequest, context?: any): Promise<Response> => {
      let validationResult: { success: true; data: any } | ValidationError;

      switch (target) {
        case 'body':
          validationResult = await validateRequestBody(schema)(req);
          break;
        case 'query':
          validationResult = validateQuery(schema)(req);
          break;
        case 'params':
          if (context?.params) {
            validationResult = validatePathParams(schema)(context.params);
          } else {
            return NextResponse.json(
              {
                success: false,
                error: {
                  code: 'VALIDATION_ERROR',
                  message: '缺少路径参数',
                  details: [],
                },
              },
              { status: 400 }
            );
          }
          break;
        default:
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'VALIDATION_ERROR',
                message: '无效的验证目标',
                details: [],
              },
            },
            { status: 400 }
          );
      }

      if (!validationResult.success) {
        return NextResponse.json(validationResult, { status: 422 });
      }

      // 将验证后的数据附加到请求
      (req as any).validatedData = validationResult.data;

      return handler(req, context);
    };
  };
}

/**
 * 常用的验证器
 */

// 验证分页参数
export const validatePagination = validateQuery(
  z.object({
    page: z.string().optional().default('1').transform((val) => Math.max(1, parseInt(val, 10) || 1)),
    limit: z.string().optional().default('10').transform((val) => Math.min(100, Math.max(1, parseInt(val, 10) || 10))),
    sort: z.enum(['name', 'date', 'status', 'createdAt', 'updatedAt']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
  })
);

// 验证日期范围
export const validateDateRange = validateQuery(
  z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }).refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: '开始日期不能晚于结束日期',
    }
  )
);

/**
 * 辅助函数：格式化验证错误
 */
export function formatValidationError(error: ValidationError): string {
  if (error.error.details.length === 0) {
    return error.error.message;
  }

  const firstError = error.error.details[0];
  const path = firstError.path.join('.');
  return `${path}: ${firstError.message}`;
}

/**
 * 辅助函数：从验证错误中提取字段错误
 */
export function getFieldErrors(error: ValidationError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  error.error.details.forEach((detail) => {
    const field = detail.path.join('.');
    fieldErrors[field] = detail.message;
  });

  return fieldErrors;
}
