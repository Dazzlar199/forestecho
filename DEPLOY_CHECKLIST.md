# ✅ 배포 전 필수 체크리스트

## 🚨 이것들을 안 하면 데이터가 노출되거나 앱이 작동하지 않습니다!

---

## 1단계: Firebase 보안 설정 (가장 중요!)

### Firestore Security Rules 적용
- [ ] Firebase Console 접속
- [ ] Firestore Database → Rules 탭
- [ ] `firestore.rules` 파일 내용을 복사해서 붙여넣기
- [ ] "게시" 버튼 클릭
- [ ] ⚠️ **이걸 안 하면 누구나 데이터 읽기/쓰기 가능!**

**빠른 복사:**
```bash
cat firestore.rules
# 내용을 복사해서 Firebase Console에 붙여넣기
```

---

## 2단계: Firebase Authentication 도메인

### Vercel 도메인 추가
- [ ] Vercel에 배포 후 도메인 확인 (예: `forestecho.vercel.app`)
- [ ] Firebase Console → Authentication → Settings
- [ ] "Authorized domains" 섹션
- [ ] "Add domain" 클릭
- [ ] Vercel 도메인 입력
- [ ] ⚠️ **이걸 안 하면 로그인이 안 됨!**

**추가해야 할 도메인:**
- `localhost` (이미 있음)
- `your-project.vercel.app` (배포 후 추가)
- 커스텀 도메인 (있다면)

---

## 3단계: Vercel 환경 변수

### 필수 환경 변수 입력
- [ ] Vercel 대시보드 → Settings → Environment Variables
- [ ] 아래 변수들을 **모두** 입력

```bash
# OpenAI (필수!)
OPENAI_API_KEY=sk-proj-...

# Firebase (7개 모두 필수!)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123...

# Tavily (선택)
TAVILY_API_KEY=tvly-...

# AdSense (선택)
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-...
```

**Tip:** 로컬의 `.env.local` 파일을 열어서 복사-붙여넣기!

---

## 4단계: Firebase Billing 설정

### Blaze 플랜 활성화 (권장)
- [ ] Firebase Console → 프로젝트 설정 → 사용량 및 결제
- [ ] "Blaze 플랜으로 업그레이드"
- [ ] 카드 등록 (필수, 하지만 무료 한도 매우 넉넉함)

**무료 한도 (걱정 안 해도 됨):**
- Firestore 읽기: 일 50,000회
- Firestore 쓰기: 일 20,000회
- Authentication: 무제한

**비용 폭탄 방지:**
- [ ] "예산 알림" 설정 (예: $10 초과 시 알림)
- [ ] OpenAI 사용량 제한 설정

---

## 5단계: 배포 후 즉시 테스트

### 기능 테스트 (5분)
- [ ] 배포된 사이트 접속
- [ ] **회원가입** 시도 → 성공해야 함
- [ ] **로그인** 시도 → 성공해야 함
- [ ] **채팅** 전송 → AI 응답 받기
- [ ] **심리 분석** 생성 → 리포트 확인
- [ ] **나의 숲** 페이지 접근

### 보안 테스트 (중요!)
- [ ] 다른 브라우저에서 다른 계정으로 로그인
- [ ] 첫 번째 계정의 채팅이 보이면 안 됨! ⚠️
- [ ] 첫 번째 계정의 분석이 보이면 안 됨! ⚠️

---

## 6단계: 모니터링 설정

### Firebase Console
- [ ] Firestore → Usage 탭 → 읽기/쓰기 횟수 확인
- [ ] Authentication → Users 탭 → 사용자 수 확인

### Vercel Dashboard
- [ ] Analytics → 트래픽 확인
- [ ] Logs → 에러 확인

### OpenAI Dashboard
- [ ] https://platform.openai.com/usage
- [ ] API 사용량 확인
- [ ] 사용량 제한 설정 (예: 월 $50)

---

## 🆘 문제 발생 시 체크

### 로그인이 안 되는 경우
1. Firebase Console → Authentication → Settings
2. Authorized domains에 Vercel 도메인 있는지 확인
3. 없으면 추가하고 5분 대기

### 데이터가 저장 안 되는 경우
1. Firestore Rules 확인
2. userId가 제대로 설정되었는지 확인
3. Vercel Logs에서 에러 확인

### "Permission Denied" 에러
1. Firestore Rules가 제대로 적용되었는지 확인
2. request.auth.uid == resource.data.userId 조건 확인
3. Firebase Console → Firestore → Rules → "규칙 시뮬레이터"로 테스트

### API 비용이 너무 많이 나오는 경우
1. OpenAI Dashboard → Usage limits 설정
2. Firebase → Firestore Rules → Rate limiting 추가
3. Vercel → Environment Variables → API 키 재발급

---

## 📊 배포 완료 기준

### ✅ 모든 항목이 체크되어야 합니다:

#### 보안
- [ ] Firestore Rules 적용됨
- [ ] Authorized domains 설정됨
- [ ] .env.local이 GitHub에 없음
- [ ] 다른 계정에서 데이터 접근 불가

#### 기능
- [ ] 회원가입/로그인 작동
- [ ] 채팅 작동
- [ ] 분석 생성 작동
- [ ] 데이터 저장 확인
- [ ] 모바일에서도 작동

#### 비용 관리
- [ ] Firebase 예산 알림 설정
- [ ] OpenAI 사용량 제한 설정
- [ ] 모니터링 대시보드 확인

---

## 🎉 완료!

모든 체크리스트를 완료하셨다면 안전하게 배포된 것입니다!

### 다음 단계
- [ ] SEO 최적화 (Google Search Console)
- [ ] Google Analytics 설정
- [ ] 커스텀 도메인 연결
- [ ] 소셜 미디어 공유

---

## 📞 문제 해결

- Firebase 문서: https://firebase.google.com/docs/firestore/security/get-started
- Vercel 문서: https://vercel.com/docs/deployments/troubleshoot
- GitHub Issues: https://github.com/Dazzlar199/forestecho/issues

**긴급한 문제 발생 시:**
1. Vercel에서 이전 버전으로 롤백
2. Firebase Rules를 모든 접근 차단으로 임시 변경
3. 문제 해결 후 다시 배포
