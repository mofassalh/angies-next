import { NextRequest, NextResponse } from 'next/server'

const rateLimit = new Map<string, { count: number; resetTime: number }>()

const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 60 // 60 requests per minute

export function middleware(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  const now = Date.now()
  const key = `${ip}:${req.nextUrl.pathname}`

  // Only rate limit API routes
  if (!req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  const record = rateLimit.get(key)

  if (!record || now > record.resetTime) {
    rateLimit.set(key, { count: 1, resetTime: now + WINDOW_MS })
    return NextResponse.next()
  }

  if (record.count >= MAX_REQUESTS) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  record.count++
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
