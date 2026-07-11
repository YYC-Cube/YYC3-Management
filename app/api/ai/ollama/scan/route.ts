/**
 * @fileoverview api/ai/ollama/scan/route.ts — Ollama 自动扫描本地模型
 * @author YYC³ @version 3.0.0 @license MIT
 */
import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiRequest } from '@/lib/api/auth-guard'
import { AIModelRepository } from '@/lib/db/repositories/ai-model.repository'

const repo = new AIModelRepository()

const SCAN_PORTS = [
  'http://localhost:11434',
  'http://127.0.0.1:11434',
  'http://localhost:11435',
  'http://host.docker.internal:11434',
]

export async function GET(request: NextRequest) {
  try {
    const auth = authenticateApiRequest(request)
    if (!auth.authenticated) return auth.response

    const customUrl = request.nextUrl.searchParams.get('base_url')
    const urlsToScan = customUrl ? [customUrl] : SCAN_PORTS

    // 并行扫描所有候选地址
    const scanResults = await Promise.allSettled(
      urlsToScan.map(async (url) => {
        const isAlive = await repo.testOllamaConnection(url)
        if (!isAlive) return { url, alive: false, models: [] }
        const models = await repo.scanOllama(url)
        return { url, alive: true, models }
      })
    )

    const results = scanResults.map((r, i) => {
      if (r.status === 'fulfilled') return r.value
      return { url: urlsToScan[i], alive: false, models: [], error: String(r.reason) }
    })

    const aliveInstances = results.filter((r) => r.alive)
    const allModels = aliveInstances.flatMap((r) =>
      r.models.map((m) => ({ ...m, source_url: r.url }))
    )

    return NextResponse.json({
      success: true,
      data: {
        scanned: urlsToScan.length,
        found: aliveInstances.length,
        instances: results.map((r) => ({
          url: r.url,
          alive: r.alive,
          modelCount: r.models.length,
        })),
        models: allModels,
      },
    })
  } catch (error: unknown) {
    console.error('Ollama扫描失败:', error)
    return NextResponse.json(
      { success: false, error: 'Ollama扫描失败' },
      { status: 500 }
    )
  }
}
