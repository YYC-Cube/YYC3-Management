/**
 * @fileoverview 工具函数库单元测试 — 格式化、验证、防抖节流、数据处理
 * @author YYC³ @version 3.1.0 @license MIT
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  cn,
  debounce,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  formatPercent,
  generateId,
  getInitials,
  isValidEmail,
  isValidPhone,
  sleep,
  throttle,
  truncateText,
} from '../utils'

describe('Utils', () => {

  // === cn (className 合并) ===

  describe('cn', () => {
    it('应合并多个 class', () => {
      expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
    })

    it('应处理条件 class', () => {
      expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
    })

    it('应去重冲突的 Tailwind class', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4')
    })

    it('应处理空值', () => {
      expect(cn('', undefined, null, 'valid')).toBe('valid')
    })
  })

  // === 格式化函数 ===

  describe('formatCurrency', () => {
    it('应格式化人民币金额', () => {
      const result = formatCurrency(1234.56)
      expect(result).toContain('1,234.56')
    })

    it('应处理 0 值', () => {
      const result = formatCurrency(0)
      expect(result).toContain('0.00')
    })

    it('应处理负数', () => {
      const result = formatCurrency(-100)
      expect(result).toContain('-')
      expect(result).toContain('¥')
    })
  })

  describe('formatDate', () => {
    it('应格式化日期对象', () => {
      const result = formatDate(new Date('2026-01-15'))
      expect(result).toContain('2026')
      expect(result).toContain('1')
    })

    it('应格式化日期字符串', () => {
      const result = formatDate('2026-07-17T00:00:00Z')
      expect(result).toContain('2026')
    })
  })

  describe('formatDateTime', () => {
    it('应包含日期和时间', () => {
      const result = formatDateTime('2026-07-17T14:30:00Z')
      expect(result).toContain('2026')
      expect(result).toContain('07')
    })
  })

  describe('formatNumber', () => {
    it('应添加千位分隔符', () => {
      expect(formatNumber(1234567)).toContain('1,234,567')
    })

    it('应处理小数', () => {
      expect(formatNumber(1234.56)).toContain('1,234.56')
    })
  })

  describe('formatPercent', () => {
    it('应格式化百分比', () => {
      const result = formatPercent(85.5)
      expect(result).toContain('85.5')
      expect(result).toContain('%')
    })

    it('应处理 0', () => {
      const result = formatPercent(0)
      expect(result).toContain('0.0')
    })
  })

  // === 文本处理 ===

  describe('truncateText', () => {
    it('不应截断短文本', () => {
      expect(truncateText('短文本', 10)).toBe('短文本')
    })

    it('应截断长文本并添加省略号', () => {
      const result = truncateText('这是一个很长的文本内容', 5)
      expect(result.length).toBe(8) // 5 + "..."
      expect(result.endsWith('...')).toBe(true)
    })

    it('边界长度等于 maxLength 时不截断', () => {
      expect(truncateText('12345', 5)).toBe('12345')
    })
  })

  // === ID 生成 ===

  describe('generateId', () => {
    it('应生成9字符 ID', () => {
      const id = generateId()
      expect(id).toHaveLength(9)
    })

    it('应生成唯一 ID', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })
  })

  // === 防抖 ===

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    it('应在等待时间后执行', () => {
      const func = vi.fn()
      const debounced = debounce(func, 300)

      debounced()
      expect(func).not.toHaveBeenCalled()

      vi.advanceTimersByTime(300)
      expect(func).toHaveBeenCalledTimes(1)
    })

    it('多次调用只执行最后一次', () => {
      const func = vi.fn()
      const debounced = debounce(func, 300)

      debounced('a')
      debounced('b')
      debounced('c')

      vi.advanceTimersByTime(300)
      expect(func).toHaveBeenCalledTimes(1)
      expect(func).toHaveBeenCalledWith('c')
    })
  })

  // === 节流 ===

  describe('throttle', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    it('应立即执行第一次调用', () => {
      const func = vi.fn()
      const throttled = throttle(func, 300)

      throttled()
      expect(func).toHaveBeenCalledTimes(1)
    })

    it('限制时间内不执行第二次', () => {
      const func = vi.fn()
      const throttled = throttle(func, 300)

      throttled()
      throttled()
      expect(func).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(300)
      throttled()
      expect(func).toHaveBeenCalledTimes(2)
    })
  })

  // === getInitials ===

  describe('getInitials', () => {
    it('应取单词首字母', () => {
      expect(getInitials('John Doe')).toBe('JD')
    })

    it('应最多返回2个字符', () => {
      expect(getInitials('Alpha Beta Gamma')).toHaveLength(2)
    })

    it('应转大写', () => {
      expect(getInitials('john doe')).toBe('JD')
    })

    it('单词应只返回1个字符', () => {
      expect(getInitials('Admin')).toBe('A')
    })
  })

  // === 验证函数 ===

  describe('isValidEmail', () => {
    it('有效邮箱应返回 true', () => {
      expect(isValidEmail('user@example.com')).toBe(true)
    })

    it('应拒绝缺少 @ 的字符串', () => {
      expect(isValidEmail('userexample.com')).toBe(false)
    })

    it('应拒绝缺少域名的字符串', () => {
      expect(isValidEmail('user@')).toBe(false)
    })

    it('应拒绝包含空格的邮箱', () => {
      expect(isValidEmail('user @example.com')).toBe(false)
    })
  })

  describe('isValidPhone', () => {
    it('有效中国大陆手机号应返回 true', () => {
      expect(isValidPhone('13812345678')).toBe(true)
    })

    it('应拒绝非 1 开头的号码', () => {
      expect(isValidPhone('23812345678')).toBe(false)
    })

    it('应拒绝位数不对的号码', () => {
      expect(isValidPhone('1381234567')).toBe(false)
      expect(isValidPhone('138123456789')).toBe(false)
    })

    it('应拒绝以 12 开头的号码', () => {
      expect(isValidPhone('12012345678')).toBe(false)
    })
  })

  // === sleep ===

  describe('sleep', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    it('应在指定时间后 resolve', async () => {
      const spy = vi.fn()
      sleep(500).then(spy)

      expect(spy).not.toHaveBeenCalled()
      vi.advanceTimersByTime(500)
      await vi.runAllTimersAsync()
      expect(spy).toHaveBeenCalled()
    })
  })
})
