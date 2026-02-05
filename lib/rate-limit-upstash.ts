/**
 * Upstash Redis Rate Limiting
 * 서버리스 환경(Vercel)에서 정상 작동하는 Rate Limiting
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { logger } from '@/lib/utils/logger'

// Upstash Redis 클라이언트
let redis: Redis | null = null
let ratelimiters: Map<string, Ratelimit> = new Map()

/**
 * Redis 인스턴스 초기화 (lazy loading)
 */
function getRedisClient(): Redis {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN

    if (!url || !token) {
      throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set')
    }

    redis = new Redis({
      url,
      token,
    })
  }

  return redis
}

export interface RateLimitConfig {
  limit: number // 최대 요청 수
  window: number // 시간 윈도우 (초)
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Rate Limiter 가져오기 또는 생성
 */
function getRateLimiter(config: RateLimitConfig): Ratelimit {
  const key = `${config.limit}-${config.window}`

  if (!ratelimiters.has(key)) {
    const redisClient = getRedisClient()

    const limiter = new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(config.limit, `${config.window} s`),
      analytics: true,
      prefix: 'mentaltouch:ratelimit',
    })

    ratelimiters.set(key, limiter)
  }

  return ratelimiters.get(key)!
}

/**
 * Rate Limiting 체크
 *
 * @param identifier - 식별자 (IP, 사용자 ID 등)
 * @param config - Rate Limit 설정
 * @returns Rate Limit 결과
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 10, window: 60 }
): Promise<RateLimitResult> {
  try {
    const limiter = getRateLimiter(config)
    const { success, limit, remaining, reset } = await limiter.limit(identifier)

    return {
      success,
      limit,
      remaining,
      reset,
    }
  } catch (error) {
    logger.error('Rate limit check failed:', error)

    // Redis 오류 시 fallback: 허용 (서비스 중단 방지)
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      reset: Date.now() + config.window * 1000,
    }
  }
}

/**
 * Rate Limit 리셋 (테스트/관리 목적)
 */
export async function resetRateLimit(identifier: string): Promise<void> {
  try {
    const redisClient = getRedisClient()
    const keys = await redisClient.keys(`mentaltouch:ratelimit:${identifier}:*`)

    if (keys.length > 0) {
      await redisClient.del(...keys)
    }
  } catch (error) {
    logger.error('Failed to reset rate limit:', error)
  }
}
