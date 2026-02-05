import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 성능 모니터링 샘플링 비율
  tracesSampleRate: 0.1, // 10%만 추적

  // 프로덕션에서만 활성화
  enabled: process.env.NODE_ENV === 'production',

  // 환경 구분
  environment: process.env.NODE_ENV,

  // 릴리즈 버전
  release: process.env.VERCEL_GIT_COMMIT_SHA,

  // 서버 사이드 에러 필터링
  beforeSend(event, hint) {
    const error = hint.originalException

    // API 호출 실패는 제외 (외부 API 문제)
    if (error && typeof error === 'object' && 'message' in error) {
      const message = error.message as string
      if (
        message.includes('ECONNREFUSED') ||
        message.includes('ETIMEDOUT') ||
        message.includes('DNS lookup failed')
      ) {
        return null
      }
    }

    return event
  },
})
