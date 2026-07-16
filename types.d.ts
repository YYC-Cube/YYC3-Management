/**
 * @fileoverview 全局类型声明（已清理）
 * @description 此文件原有的 declare module 声明会覆盖实际组件和 hooks 的类型定义，
 *              导致 CVA variant 属性、组件 props 等丢失。在修复 tsconfig.json 的
 *              moduleSuffixes 配置后，这些声明不再需要。
 * @author YYC³
 * @version 3.0.0
 * @created 2025-01-20
 * @updated 2026-07-17
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

// ============================================
// Next.js 16 内部模块类型声明
// Next.js 16 + React 19 重构后部分内部模块缺少类型声明
// ============================================

// react-server-dom-webpack — React 19 中已合并到 react-dom 但 Next.js .d.ts 仍引用
declare module 'react-server-dom-webpack/server' {
  export interface ReactServerDomServer {
    renderToPipeableStream(element: unknown): { pipe: (writable: unknown) => void }
    renderToReadableStream(element: unknown): Promise<ReadableStream>
  }
  const _default: ReactServerDomServer
  export default _default
}

declare module 'react-server-dom-webpack/static' {
  export function renderToStaticMarkup(element: unknown): string
  export function renderToString(element: unknown): string
  const _default: { renderToStaticMarkup: typeof renderToStaticMarkup; renderToString: typeof renderToString }
  export default _default
}

// next/dist/compiled/jest-worker — Next.js 内部 jest-worker 打包
declare module 'next/dist/compiled/jest-worker' {
  export class Worker {
    constructor(path: string, options?: unknown)
    end(): Promise<void>
    getStderr(): NodeJS.ReadableStream
    getStdout(): NodeJS.ReadableStream
  }
}

// next/dist/compiled/superstruct — Next.js 内部 superstruct 打包
declare module 'next/dist/compiled/superstruct' {
  export type Struct<T = unknown> = {
    schema: unknown
    coercer: (value: unknown) => T
    validator: (value: unknown) => boolean
  }
  export function object<T extends Record<string, unknown>>(shape: T): Struct<T>
  export function string(): Struct<string>
  export function number(): Struct<number>
  export function boolean(): Struct<boolean>
  export function optional<T>(struct: Struct<T>): Struct<T | undefined>
  export function nullable<T>(struct: Struct<T>): Struct<T | null>
  export function assert<T>(value: unknown, struct: Struct<T>): asserts value is T
  export function create<T>(value: unknown, struct: Struct<T>): T
}

// next/dist/compiled/webpack/webpack — 扩展缺失的 webpack 类型成员
declare module 'next/dist/compiled/webpack/webpack' {
  export interface LoaderDefinitionFunction {
    (this: unknown, content: string, sourceMap?: unknown, additionalData?: unknown): void
  }
  export type RuleSetUseItem = string | LoaderDefinitionFunction | { loader: string; options?: unknown }
}

export { }
