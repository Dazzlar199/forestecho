# 환경 변수 설정 상태

**업데이트 날짜**: 2026-02-02

---

## ✅ 완료된 설정

### 1. Upstash Redis (Rate Limiting)
```bash
UPSTASH_REDIS_REST_URL="https://new-lamprey-36602.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AY76AAIncDFjZGI0NzlkZTFiODU0MTM0OWY4ZDEzNDQyYzUyOWIxZXAxMzY2MDI"
```
✅ `.env.local`에 추가 완료

### 2. 관리자 보안 수정
```bash
# 변경 전 (보안 취약)
NEXT_PUBLIC_ADMIN_EMAIL=rlackswn2000@gmail.com

# 변경 후 (보안 강화)
ADMIN_EMAIL=rlackswn2000@gmail.com
```
✅ 서버 사이드 전용으로 변경 완료

---

## ⏳ 남은 설정

### Sentry (에러 모니터링)

**필요한 환경 변수**:
```bash
NEXT_PUBLIC_SENTRY_DSN=https://xxx@o123.ingest.sentry.io/456
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=forestecho
SENTRY_AUTH_TOKEN=sntrys_xxx...
```

**설정 방법**:
1. https://sentry.io/ 접속
2. 무료 계정 생성
3. Next.js 프로젝트 생성
4. DSN 복사 → `.env.local`에 추가
5. Settings → API → Create Auth Token
6. Auth Token 복사 → `.env.local`에 추가

---

## 🚀 Vercel 배포 전 체크리스트

### .env.local 확인
- [x] Upstash Redis URL & Token
- [x] Admin Email (NEXT_PUBLIC_ 제거됨)
- [ ] Sentry DSN
- [ ] Sentry Org
- [ ] Sentry Project
- [ ] Sentry Auth Token

### Vercel Dashboard 설정
1. Vercel → Settings → Environment Variables
2. 위 모든 환경 변수 추가
3. Environment: **Production, Preview, Development** 체크
4. **중요**: `ADMIN_EMAIL`은 `NEXT_PUBLIC_` 없이 추가

### 배포 명령
```bash
vercel --prod
```

---

## 📊 현재 상태

| 항목 | 로컬 (.env.local) | Vercel | 상태 |
|------|------------------|--------|------|
| Upstash Redis | ✅ 설정 완료 | ⏳ 필요 | 반영 필요 |
| Admin Email | ✅ 수정 완료 | ⏳ 필요 | 반영 필요 |
| Sentry | ❌ 미설정 | ❌ 미설정 | 설정 필요 |

---

## 🎯 다음 단계

1. **Sentry 계정 생성** (5분)
   - https://sentry.io/signup/
   - Next.js 선택
   - DSN 및 Auth Token 발급

2. **Vercel 환경 변수 추가** (5분)
   - 모든 환경 변수 복사
   - Production, Preview, Development 체크

3. **Vercel 재배포** (5분)
   ```bash
   vercel --prod
   ```

4. **테스트**
   - Rate limiting: 10회 연속 채팅 요청
   - Admin 페이지: /admin 접속 테스트
   - Sentry: 의도적 에러 발생 후 Dashboard 확인

---

## ✅ 완료 확인

배포 후 다음을 확인하세요:

- [ ] Rate limiting 작동 확인 (11번째 요청에서 429 에러)
- [ ] Admin 페이지 접근 확인 (서버 사이드 검증)
- [ ] Sentry Dashboard에 에러 수집 확인
- [ ] Firebase Console에서 인덱스 "Enabled" 확인

---

**현재 진행률**: 2/3 완료 (67%) 🎯

Sentry만 설정하면 100% 완료됩니다!
