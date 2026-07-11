import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

interface SessionPayload {
  userId: string | number
  role: string
  exp?: number
}

const PUBLIC_API_ROUTES = ['/api/health']

function getJwtSecret(): string {
  return process.env.JWT_SECRET || process.env.SESSION_SECRET || ''
}

function base64UrlDecode(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4))
  return Buffer.from(padded + pad, 'base64').toString('utf8')
}

export function verifyToken(token: string): SessionPayload | null {
  if (!token) return null
  const secret = getJwtSecret()
  if (!secret) return null

  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const header = JSON.parse(base64UrlDecode(parts[0]))
    if (header.alg !== 'HS256') return null

    const payload: SessionPayload = JSON.parse(base64UrlDecode(parts[1]))

    if (payload.exp && Date.now() >= payload.exp * 1000) return null

    const expectedSig = createHmacSig(`${parts[0]}.${parts[1]}`, secret)
    if (!timingSafeCompare(parts[2], expectedSig)) return null

    return payload
  } catch {
    return null
  }
}

function createHmacSig(data: string, secret: string): string {
  const sig = createHash('sha256')
    .update(data + secret)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  return sig
}

function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

export function getRequestToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  if (authHeader && authHeader.startsWith('Token ')) {
    return authHeader.substring(6)
  }
  return null
}

export function isPublicApiRoute(pathname: string): boolean {
  return PUBLIC_API_ROUTES.some((route) => pathname === route)
}

export function authenticateApiRequest(
  request: NextRequest
): { authenticated: true; payload: SessionPayload } | { authenticated: false; response: NextResponse } {
  if (isPublicApiRoute(request.nextUrl.pathname)) {
    return {
      authenticated: true,
      payload: { userId: 'system', role: 'system' },
    }
  }

  const token = getRequestToken(request)
  if (!token) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, error: '未提供认证令牌', code: 'NO_TOKEN' },
        { status: 401 }
      ),
    }
  }

  const payload = verifyToken(token)
  if (!payload) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, error: '认证令牌无效或已过期', code: 'INVALID_TOKEN' },
        { status: 401 }
      ),
    }
  }

  return { authenticated: true, payload }
}
