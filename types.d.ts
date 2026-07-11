/**
 * @fileoverview 全局类型声明（已清理）
 * @description 此文件原有的 declare module 声明会覆盖实际组件和 hooks 的类型定义，
 *              导致 CVA variant 属性、组件 props 等丢失。在修复 tsconfig.json 的
 *              moduleSuffixes 配置后，这些声明不再需要。
 * @author YYC³
 * @version 3.0.0
 * @created 2025-01-20
 * @updated 2026-07-12
 * @license MIT
 */

// pg 模块类型声明（ESM 版本缺少类型声明文件）
declare module 'pg' {
  export interface PoolConfig {
    host?: string
    port?: number
    database?: string
    user?: string
    password?: string
    max?: number
    idleTimeoutMillis?: number
    connectionTimeoutMillis?: number
    ssl?: unknown
  }

  export class Pool {
    constructor(config: PoolConfig)
    query(text: string, params?: unknown[]): Promise<{ rows: unknown[]; rowCount: number }>
    on(event: string, listener: (...args: unknown[]) => void): void
    connect(): Promise<PoolClient>
    end(): Promise<void>
  }

  export interface PoolClient {
    query(text: string, params?: unknown[]): Promise<{ rows: unknown[]; rowCount: number }>
    release(): void
  }
}

export { }
