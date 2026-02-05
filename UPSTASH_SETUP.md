# Upstash Redis 설정 가이드

Upstash Redis를 사용하여 서버리스 환경(Vercel)에서 Rate Limiting을 구현합니다.

---

## 1. Upstash 계정 생성 및 Database 만들기

### 1.1 회원가입

https://upstash.com/ 에서 무료 계정 생성

- GitHub 또는 Google 계정으로 간편 가입
- **Free Tier**: 10,000 commands/day (충분함)

### 1.2 Redis Database 생성

1. Dashboard → **Create Database**
2. 설정:
   - **Name**: `mentaltouch-ratelimit`
   - **Region**: Seoul 또는 가장 가까운 지역 선택
   - **Type**: Regional (더 빠름)
   - **Eviction**: No eviction
3. **Create** 클릭

---

## 2. 환경 변수 설정

### 2.1 Upstash에서 Credentials 복사

Database 생성 후:
- **REST API** 탭 클릭
- **UPSTASH_REDIS_REST_URL** 복사
- **UPSTASH_REDIS_REST_TOKEN** 복사

### 2.2 `.env.local` 파일 업데이트

```bash
# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=https://us1-xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXXxxxxxxx
```

### 2.3 Vercel 환경 변수 설정

Vercel Dashboard → Project → Settings → Environment Variables

```
Key: UPSTASH_REDIS_REST_URL
Value: https://us1-xxx.upstash.io
Environment: Production, Preview, Development

Key: UPSTASH_REDIS_REST_TOKEN
Value: AXXXXxxxxxxx
Environment: Production, Preview, Development
```

---

## 3. 배포

```bash
# 로컬 테스트
npm run dev

# Vercel 배포
vercel --prod
```

---

## 4. 동작 확인

### 4.1 API 테스트

```bash
# 채팅 API (10 req/min)
for i in {1..11}; do
  curl -X POST http://localhost:3000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"messages":[{"role":"user","content":"안녕"}]}'
  echo ""
done

# 11번째 요청에서 429 응답 확인
```

### 4.2 Upstash Dashboard에서 확인

Upstash Console → Database → **Data Browser**

- `mentaltouch:ratelimit:*` 키 확인
- TTL (Time To Live) 확인

---

## 5. Rate Limit 설정 변경

### 5.1 기본 설정

| API Route | Limit | Window |
|-----------|-------|--------|
| `/api/chat` | 10 req | 60초 (1분) |
| `/api/analysis` | 3 req | 3600초 (1시간) |

### 5.2 커스텀 설정

`app/api/chat/route.ts`:

```typescript
const rateLimitResult = await rateLimit(identifier, {
  limit: 20,    // 20 requests
  window: 120   // per 2 minutes
})
```

---

## 6. 비용 및 한도

### Free Tier

- **10,000 commands/day**
- **100 MB storage**
- **Unlimited databases**

예상 사용량:
- 일일 사용자 1,000명
- 각 3회 채팅 = 3,000 rate limit checks
- 여유 있음 ✅

### Pro Tier (필요 시)

- $0.20 per 100K commands
- 월 사용자 50,000명 기준: 150K commands = **$0.30/month**

---

## 7. 문제 해결

### Redis 연결 실패

```
Error: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set
```

**해결**:
1. `.env.local` 파일 확인
2. Vercel 환경 변수 확인
3. 재배포

### Rate Limit이 작동하지 않음

```bash
# Upstash Dashboard에서 Database 상태 확인
# Data Browser에서 키 확인
```

**Fallback 동작**: Redis 연결 실패 시 자동으로 요청 허용 (서비스 중단 방지)

---

## 8. 모니터링

### Upstash Dashboard

- **Stats** 탭: 요청 수, 레이턴시 확인
- **Data Browser**: 실시간 키 확인
- **Logs**: 에러 로그 확인

### 주요 메트릭

- Daily Commands: 하루 사용량
- P99 Latency: 응답 속도
- Error Rate: 에러 비율

---

## 9. 보안

✅ REST Token은 환경 변수에만 저장
✅ `.env.local`은 `.gitignore`에 포함됨
✅ Vercel 환경 변수는 암호화됨
✅ HTTPS 통신만 허용

---

## 참고 링크

- [Upstash Docs](https://docs.upstash.com/)
- [@upstash/ratelimit](https://github.com/upstash/ratelimit)
- [Vercel + Upstash Integration](https://vercel.com/integrations/upstash)
