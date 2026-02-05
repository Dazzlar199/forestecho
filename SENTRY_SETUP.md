# Sentry 에러 모니터링 설정 가이드

Sentry를 사용하여 프로덕션 환경에서 에러를 추적하고 모니터링합니다.

---

## 1. Sentry 계정 생성 및 프로젝트 만들기

### 1.1 회원가입

https://sentry.io/ 에서 무료 계정 생성

- GitHub 또는 Google 계정으로 간편 가입
- **Free Tier**: 5,000 errors/month (충분함)

### 1.2 프로젝트 생성

1. Dashboard → **Create Project**
2. 플랫폼: **Next.js** 선택
3. 프로젝트 이름: `forestecho` 또는 `mentaltouch`
4. Alert 설정: 기본값 사용
5. **Create Project** 클릭

---

## 2. DSN 및 Credentials 확인

프로젝트 생성 후:

### 2.1 DSN 복사

Settings → Projects → [Your Project] → Client Keys (DSN)

```
https://xxxxxxxxxxxxx@o123456.ingest.sentry.io/123456
```

### 2.2 Auth Token 생성

Settings → Account → API → Auth Tokens

1. **Create New Token** 클릭
2. Scopes:
   - `project:read`
   - `project:releases`
3. **Create Token** 클릭
4. 토큰 복사 (다시 볼 수 없음!)

### 2.3 Organization & Project Slug 확인

Settings → General

- **Organization Slug**: `your-org-slug`
- **Project Slug**: `forestecho`

---

## 3. 환경 변수 설정

### 3.1 `.env.local` 파일 업데이트

```bash
# Sentry (Error Monitoring)
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@o123.ingest.sentry.io/123
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=forestecho
SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

### 3.2 Vercel 환경 변수 설정

Vercel Dashboard → Project → Settings → Environment Variables

```
Key: NEXT_PUBLIC_SENTRY_DSN
Value: https://xxxxx@o123.ingest.sentry.io/123
Environment: Production, Preview, Development

Key: SENTRY_ORG
Value: your-org-slug
Environment: Production

Key: SENTRY_PROJECT
Value: forestecho
Environment: Production

Key: SENTRY_AUTH_TOKEN
Value: your-sentry-auth-token
Environment: Production
```

**주의**: `NEXT_PUBLIC_SENTRY_DSN`만 public, 나머지는 서버 전용

---

## 4. 배포 및 테스트

### 4.1 로컬 테스트

```bash
# 개발 환경에서는 Sentry 비활성화됨 (NODE_ENV !== 'production')
npm run dev
```

### 4.2 프로덕션 배포

```bash
# Vercel 배포
vercel --prod
```

### 4.3 에러 테스트

프로덕션 환경에서 테스트 에러 발생:

```typescript
// app/test-error/page.tsx
export default function TestError() {
  throw new Error('Sentry Test Error')
}
```

1. `/test-error` 페이지 접속
2. Sentry Dashboard에서 에러 확인 (1-2분 소요)

---

## 5. Sentry Dashboard 활용

### 5.1 Issues 탭

- 발생한 에러 목록
- 발생 횟수, 영향받은 사용자 수
- 스택 트레이스, 브레드크럼

### 5.2 Performance 탭

- API 응답 시간
- 페이지 로드 속도
- 병목 지점 확인

### 5.3 Releases 탭

- 배포 버전별 에러 추적
- 새 버전에서 발생한 신규 에러 확인

### 5.4 Alerts

- 에러 발생 시 이메일/Slack 알림
- 임계값 설정 (예: 1시간에 10개 이상 에러)

---

## 6. 주요 기능

### 6.1 자동 에러 캡처

- React 에러 (Error Boundary)
- API 라우트 에러
- 네트워크 에러
- 처리되지 않은 Promise Rejection

### 6.2 성능 모니터링

- 페이지 로드 시간
- API 응답 속도
- 트랜잭션 추적

### 6.3 세션 리플레이

- 에러 발생 시 사용자 행동 재생
- 개인정보 자동 마스킹

### 6.4 브레드크럼

- 에러 발생 전 사용자 행동 추적
- 네비게이션, 클릭, API 호출 기록

---

## 7. 비용 및 한도

### Free Tier

- **5,000 errors/month**
- **10,000 performance units/month**
- **50 replays/month**
- **Unlimited team members**

예상 사용량:
- 일일 사용자 1,000명
- 에러율 0.1% = 일일 10 errors
- 월 300 errors ✅ 충분함

### Paid Plans (필요 시)

- **Team**: $26/month (50K errors)
- **Business**: $80/month (100K errors)

---

## 8. 개인정보 보호

### 8.1 자동 마스킹

- `sentry.client.config.ts`에서 설정:
  - 모든 텍스트 마스킹 (`maskAllText: true`)
  - 모든 미디어 차단 (`blockAllMedia: true`)

### 8.2 민감한 데이터 제거

- URL 쿼리 파라미터 제거
- 사용자 이메일 제외
- Firebase UID는 익명 ID로 전송

---

## 9. 문제 해결

### Sentry 초기화 실패

```
Error: Invalid Sentry DSN
```

**해결**:
1. `.env.local` 파일에서 DSN 확인
2. `NEXT_PUBLIC_` 접두사 확인
3. Vercel 환경 변수 확인

### 에러가 Sentry에 표시되지 않음

1. 개발 환경에서는 Sentry 비활성화됨 (정상)
2. 프로덕션 빌드 확인: `NODE_ENV=production`
3. DSN 설정 확인
4. 1-2분 대기 (Sentry 데이터 처리 시간)

### 소스맵이 업로드되지 않음

```bash
# Auth Token 확인
echo $SENTRY_AUTH_TOKEN

# 수동 빌드 시 소스맵 업로드
npm run build
```

---

## 10. 알림 설정

### 10.1 이메일 알림

Settings → Alerts → Create Alert Rule

- **Condition**: Issue is first seen
- **Action**: Send email to team
- **Frequency**: Immediately

### 10.2 Slack 통합

Settings → Integrations → Slack

1. **Add to Slack** 클릭
2. 채널 선택
3. 알림 규칙 설정

---

## 11. 모니터링 권장 사항

### 주간 확인

- Issues 탭에서 신규 에러 확인
- 성능 저하 확인 (Performance 탭)
- 영향받은 사용자 수 확인

### 월간 확인

- 에러 트렌드 분석
- 가장 많이 발생한 에러 수정
- 사용 한도 확인 (Free Tier 초과 여부)

---

## 참고 링크

- [Sentry Docs](https://docs.sentry.io/)
- [Next.js Integration](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Best Practices](https://docs.sentry.io/product/best-practices/)
