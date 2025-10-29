// Simple in-memory rate limiting
// For production, use Upstash Redis or similar

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetAt < now) {
      rateLimitMap.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitConfig {
  limit: number // Maximum number of requests
  window: number // Time window in seconds
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 10, window: 60 }
): RateLimitResult {
  const now = Date.now()
  const windowMs = config.window * 1000
  const resetAt = now + windowMs

  const entry = rateLimitMap.get(identifier)

  if (!entry || entry.resetAt < now) {
    // First request or window expired
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt,
    })

    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      reset: resetAt,
    }
  }

  if (entry.count >= config.limit) {
    // Rate limit exceeded
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      reset: entry.resetAt,
    }
  }

  // Increment count
  entry.count++

  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - entry.count,
    reset: entry.resetAt,
  }
}
