import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Edge Runtime은 샘플링 비율 낮게
  tracesSampleRate: 0.05, // 5%만 추적

  // 프로덕션에서만 활성화
  enabled: process.env.NODE_ENV === 'production',

  // 환경 구분
  environment: process.env.NODE_ENV,
})
