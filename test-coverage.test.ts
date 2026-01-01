import { describe, it, expect } from 'vitest'

// Simple function to test coverage collection
export function add(a: number, b: number): number {
  if (a < 0 || b < 0) {
    return 0
  }
  return a + b
}

describe('Test Coverage Collection', () => {
  it('should add positive numbers correctly', () => {
    expect(add(1, 2)).toBe(3)
  })
  
  it('should return 0 for negative numbers', () => {
    expect(add(-1, 2)).toBe(0)
    expect(add(1, -2)).toBe(0)
    expect(add(-1, -2)).toBe(0)
  })
})
