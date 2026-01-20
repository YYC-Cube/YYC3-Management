import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { ApiErrorHandler, successResponse, createdResponse, paginatedResponse, messageResponse } from '@/lib/api/response-handler'
import { ValidationError, validateRequest, validateId, validatePagination, validateEmail, validatePhone } from '@/lib/api/validation'

describe('API Response Handler', () => {
  it('should create success response', () => {
    const response = successResponse({ id: 1, name: 'test' })
    expect(response.status).toBe(200)
  })

  it('should create created response', () => {
    const response = createdResponse({ id: 1, name: 'test' })
    expect(response.status).toBe(201)
  })

  it('should create paginated response', () => {
    const response = paginatedResponse(
      [{ id: 1 }],
      { page: 1, limit: 10, total: 1, totalPages: 1 }
    )
    expect(response.status).toBe(200)
  })

  it('should create message response', () => {
    const response = messageResponse('操作成功')
    expect(response.status).toBe(200)
  })

  it('should handle validation error', () => {
    const error = new ValidationError('验证失败')
    const response = ApiErrorHandler.handle(error)
    expect(response.status).toBe(400)
  })

  it('should handle not found error', () => {
    const error = new Error('Not Found')
    error.name = 'NotFoundError'
    const response = ApiErrorHandler.handle(error)
    expect(response.status).toBe(404)
  })

  it('should handle conflict error', () => {
    const error = new Error('Conflict')
    error.name = 'ConflictError'
    const response = ApiErrorHandler.handle(error)
    expect(response.status).toBe(409)
  })
})

describe('Validation Utilities', () => {
  it('should validate ID', () => {
    const id = validateId('123')
    expect(id).toBe(123)
  })

  it('should throw error for invalid ID', () => {
    expect(() => validateId('abc')).toThrow(ValidationError)
  })

  it('should validate pagination', () => {
    const pagination = validatePagination('1', '10')
    expect(pagination.page).toBe(1)
    expect(pagination.limit).toBe(10)
    expect(pagination.offset).toBe(0)
  })

  it('should throw error for invalid pagination', () => {
    expect(() => validatePagination('0', '10')).toThrow(ValidationError)
    expect(() => validatePagination('1', '101')).toThrow(ValidationError)
  })

  it('should validate email', () => {
    expect(validateEmail('test@example.com')).toBe(true)
    expect(validateEmail('invalid-email')).toBe(false)
  })

  it('should validate phone', () => {
    expect(validatePhone('13800138000')).toBe(true)
    expect(validatePhone('12345')).toBe(false)
  })
})
