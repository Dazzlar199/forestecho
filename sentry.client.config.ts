import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 성능 모니터링 샘플링 비율 (0.0 ~ 1.0)
  tracesSampleRate: 0.1, // 10%만 추적 (비용 절감)

  // 프로덕션에서만 활성화
  enabled: process.env.NODE_ENV === 'production',

  // 환경 구분
  environment: process.env.NODE_ENV,

  // 릴리즈 버전 (package.json의 version 사용)
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

  // 에러 필터링: 불필요한 에러 제외
  beforeSend(event, hint) {
    const error = hint.originalException

    // 네트워크 에러는 제외 (사용자 인터넷 문제)
    if (error && typeof error === 'object' && 'message' in error) {
      const message = error.message as string
      if (message.includes('Failed to fetch') || message.includes('Network request failed')) {
        return null
      }
    }

    return event
  },

  // 개인정보 제거
  beforeBreadcrumb(breadcrumb) {
    // URL에서 민감한 정보 제거
    if (breadcrumb.category === 'navigation' && breadcrumb.data?.from) {
      breadcrumb.data.from = breadcrumb.data.from.replace(/[?#].*/, '')
    }
    return breadcrumb
  },

  // 통합 설정
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true, // 모든 텍스트 마스킹 (개인정보 보호)
      blockAllMedia: true, // 모든 미디어 차단
    }),
  ],

  // 세션 리플레이 샘플링
  replaysSessionSampleRate: 0.1, // 10% 세션만 리플레이
  replaysOnErrorSampleRate: 1.0, // 에러 발생 시 100% 리플레이
})
