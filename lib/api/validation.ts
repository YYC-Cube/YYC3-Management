import { NextRequest } from 'next/server'
import { z } from 'zod'

export class ValidationError extends Error {
  constructor(message: string, public details?: any) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = '未授权访问') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = '无权访问') {
    super(message)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends Error {
  constructor(message: string = '资源不存在') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConflictError'
  }
}

export class UnprocessableEntityError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnprocessableEntityError'
  }
}

export class ServiceUnavailableError extends Error {
  constructor(message: string = '服务暂时不可用') {
    super(message)
    this.name = 'ServiceUnavailableError'
  }
}

export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('数据验证失败', error.errors)
    }
    throw error
  }
}

export async function validateJsonBody<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json()
    return validateRequest(schema, body)
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ValidationError('请求体格式错误')
    }
    throw error
  }
}

export function validateSearchParams<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): T {
  const params = Object.fromEntries(request.nextUrl.searchParams)
  return validateRequest(schema, params)
}

export function validatePathParams<T>(
  params: Record<string, string | string[]>,
  schema: z.ZodSchema<T>
): T {
  return validateRequest(schema, params)
}

export function validateId(id: string | string[]): number {
  const idValue = Array.isArray(id) ? id[0] : id
  const numId = parseInt(idValue)
  
  if (isNaN(numId)) {
    throw new ValidationError('无效的ID')
  }
  
  if (numId <= 0) {
    throw new ValidationError('ID必须为正数')
  }
  
  return numId
}

export function validatePagination(
  page?: string | null,
  limit?: string | null
): { page: number; limit: number; offset: number } {
  const pageNum = page ? parseInt(page) : 1
  const limitNum = limit ? parseInt(limit) : 10
  
  if (isNaN(pageNum) || pageNum < 1) {
    throw new ValidationError('页码必须为正整数')
  }
  
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    throw new ValidationError('每页数量必须在1-100之间')
  }
  
  return {
    page: pageNum,
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

export function validateRequired(value: any, fieldName: string): void {
  if (value === null || value === undefined || value === '') {
    throw new ValidationError(`${fieldName}不能为空`)
  }
}

export function validateLength(
  value: string,
  fieldName: string,
  min: number,
  max: number
): void {
  if (value.length < min || value.length > max) {
    throw new ValidationError(`${fieldName}长度必须在${min}-${max}之间`)
  }
}

export function validateRange(
  value: number,
  fieldName: string,
  min: number,
  max: number
): void {
  if (value < min || value > max) {
    throw new ValidationError(`${fieldName}必须在${min}-${max}之间`)
  }
}
