import { vi } from 'vitest'

export interface MockFetchConfig {
  url?: string
  method?: string
  status?: number
  ok?: boolean
  body?: unknown
  delay?: number
}

export function createMockResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(typeof body === 'string' ? body : JSON.stringify(body)),
    headers: new Headers(),
    clone: () => createMockResponse(body, status),
  } as Response
}

export function createMockFetch(responses: MockFetchConfig[] = []): ReturnType<typeof vi.fn> {
  const mockFn = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
    const method = init?.method || 'GET'

    const match = responses.find(
      (r) =>
        (!r.url || url.includes(r.url)) &&
        (!r.method || r.method.toUpperCase() === method.toUpperCase())
    )

    if (match?.delay) {
      await new Promise((resolve) => setTimeout(resolve, match.delay))
    }

    if (match) {
      return createMockResponse(match.body ?? { success: true }, match.status ?? 200)
    }

    return createMockResponse({ success: true, data: [] })
  })

  globalThis.fetch = mockFn as unknown as typeof fetch
  return mockFn
}

export function mockFetchSuccess(body: unknown = { success: true, data: [] }): ReturnType<typeof vi.fn> {
  return createMockFetch([{ body }])
}

export function mockFetchError(status = 500, message = '服务器错误'): ReturnType<typeof vi.fn> {
  return createMockFetch([{ status, body: { success: false, error: message } }])
}

export function mockFetchSequence(responses: MockFetchConfig[]): ReturnType<typeof vi.fn> {
  let callIndex = 0
  const mockFn = vi.fn(async () => {
    const response = responses[callIndex] ?? responses[responses.length - 1]
    callIndex++
    return createMockResponse(response.body ?? { success: true }, response.status ?? 200)
  })

  globalThis.fetch = mockFn as unknown as typeof fetch
  return mockFn
}
