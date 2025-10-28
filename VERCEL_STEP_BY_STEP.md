# 🚀 Vercel 배포 완벽 가이드 (초보자용)

## 📋 준비물
- GitHub 계정 (이미 코드 업로드 완료 ✅)
- 환경 변수 (아래에 정리되어 있음)
- 5-10분의 시간

---

## 1단계: Vercel 가입 및 GitHub 연결

### 1-1. Vercel 웹사이트 접속
1. 브라우저에서 https://vercel.com 접속
2. 우측 상단 **"Sign Up"** 버튼 클릭

### 1-2. GitHub으로 가입
1. **"Continue with GitHub"** 버튼 클릭
2. GitHub 로그인 (이미 로그인되어 있으면 생략)
3. Vercel의 권한 요청 승인 (Repository 접근 허용)
4. 자동으로 Vercel 대시보드로 이동

---

## 2단계: 프로젝트 Import

### 2-1. 새 프로젝트 만들기
1. Vercel 대시보드 메인 화면
2. **"Add New..."** 버튼 클릭 (우측 상단)
3. 드롭다운에서 **"Project"** 선택

### 2-2. GitHub 저장소 찾기
1. "Import Git Repository" 화면이 나타남
2. 검색창에 **"forestecho"** 입력
3. **"Dazzlar199/forestecho"** 저장소 찾기
4. **"Import"** 버튼 클릭

### 2-3. 프로젝트 설정 화면
- Project Name: `forestecho` (기본값 그대로 사용)
- Framework Preset: **Next.js** (자동 감지됨)
- Root Directory: `./` (기본값 그대로)
- Build Command: `npm run build` (자동 설정됨)
- Output Directory: `.next` (자동 설정됨)

**아직 Deploy 버튼 누르지 마세요!** ⚠️
먼저 환경 변수를 설정해야 합니다.

---

## 3단계: 환경 변수 설정 (가장 중요!)

### 3-1. 환경 변수 섹션 찾기
1. 프로젝트 설정 화면에서 아래로 스크롤
2. **"Environment Variables"** 섹션 찾기
3. "NAME"과 "VALUE" 입력창이 있는 곳

### 3-2. 환경 변수 하나씩 입력

**⚠️ 주의: 아래 값들을 정확히 복사-붙여넣기 하세요!**

#### 필수 환경 변수 (반드시 입력!)

**💡 중요: 로컬의 `.env.local` 파일에서 복사하세요!**

아래는 입력해야 할 환경 변수 이름입니다.
**값은 `.env.local` 파일을 열어서 복사-붙여넣기 하세요!**

**1. OpenAI API Key**
```
NAME: OPENAI_API_KEY
VALUE: (로컬 .env.local 파일에서 복사)
```
- 입력 후 "Add" 버튼 클릭

**2. Tavily API Key** (검색 기능용)
```
NAME: TAVILY_API_KEY
VALUE: (로컬 .env.local 파일에서 복사)
```
- 입력 후 "Add" 버튼 클릭

**3. Firebase API Key**
```
NAME: NEXT_PUBLIC_FIREBASE_API_KEY
VALUE: (로컬 .env.local 파일에서 복사)
```

**4. Firebase Auth Domain**
```
NAME: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
VALUE: (로컬 .env.local 파일에서 복사)
```

**5. Firebase Project ID**
```
NAME: NEXT_PUBLIC_FIREBASE_PROJECT_ID
VALUE: (로컬 .env.local 파일에서 복사)
```

**6. Firebase Storage Bucket**
```
NAME: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
VALUE: (로컬 .env.local 파일에서 복사)
```

**7. Firebase Messaging Sender ID**
```
NAME: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
VALUE: (로컬 .env.local 파일에서 복사)
```

**8. Firebase App ID**
```
NAME: NEXT_PUBLIC_FIREBASE_APP_ID
VALUE: (로컬 .env.local 파일에서 복사)
```

#### 선택 환경 변수 (나중에 추가 가능)

**9. ElevenLabs API Key** (음성 기능용, 현재 미사용)
```
NAME: ELEVENLABS_API_KEY
VALUE: (로컬 .env.local 파일에서 복사)
```

**10. Google AdSense** (광고용, 나중에 설정)
```
NAME: NEXT_PUBLIC_ADSENSE_CLIENT_ID
VALUE: ca-pub-xxxxxxxxxxxxxxxx
```

**11-13. Stripe** (결제용, 나중에 설정)
```
NAME: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
VALUE: pk_test_xxxxx

NAME: STRIPE_SECRET_KEY
VALUE: sk_test_xxxxx

NAME: STRIPE_WEBHOOK_SECRET
VALUE: whsec_xxxxx
```

### 3-3. 환경 변수 입력 Tip

**쉬운 방법:**
1. 이 파일을 열어두고
2. 복사-붙여넣기로 하나씩 입력
3. "Add" 버튼을 매번 클릭
4. 총 8개 필수 변수 입력 완료

**확인 방법:**
- 입력한 변수들이 아래에 목록으로 보임
- 최소 8개는 있어야 함 (OPENAI, TAVILY, FIREBASE 6개)

---

## 4단계: 배포 시작!

### 4-1. Deploy 버튼 클릭
1. 환경 변수 입력 완료 확인
2. 화면 하단 **"Deploy"** 버튼 클릭
3. 배포 시작! 🚀

### 4-2. 빌드 과정 지켜보기
- "Building..." 상태 표시
- 빌드 로그가 실시간으로 나타남
- 약 2-3분 소요

### 4-3. 배포 완료 확인
- ✅ "Congratulations!" 메시지
- 배포 URL 표시 (예: `https://forestecho.vercel.app`)
- **"Visit"** 버튼으로 사이트 확인

---

## 5단계: Firebase 보안 설정 (필수!)

### 5-1. Firestore Security Rules 적용

**중요: 이걸 안 하면 누구나 데이터 접근 가능!** ⚠️

1. **Firebase Console 접속**
   - https://console.firebase.google.com
   - `forestecho-3514b` 프로젝트 선택

2. **Firestore Database로 이동**
   - 왼쪽 메뉴에서 "Firestore Database" 클릭

3. **Rules 탭 클릭**
   - 상단 탭에서 "Rules" 선택

4. **규칙 복사-붙여넣기**
   - 프로젝트 폴더의 `firestore.rules` 파일 열기
   - 전체 내용 복사
   - Firebase Console의 편집기에 붙여넣기
   - **"게시"** 버튼 클릭

5. **확인**
   - "규칙이 게시되었습니다" 메시지 확인

### 5-2. Authentication Authorized Domains 추가

**중요: 이걸 안 하면 로그인이 안 됨!** ⚠️

1. **Authentication으로 이동**
   - 왼쪽 메뉴에서 "Authentication" 클릭

2. **Settings 탭**
   - "Settings" 탭 클릭 (또는 톱니바퀴 아이콘)

3. **Authorized domains 섹션**
   - 아래로 스크롤하여 "Authorized domains" 찾기

4. **도메인 추가**
   - "Add domain" 버튼 클릭
   - Vercel에서 받은 도메인 입력 (예: `forestecho.vercel.app`)
   - "Add" 버튼 클릭

5. **확인**
   - 목록에 추가된 도메인이 보여야 함

---

## 6단계: 배포 테스트

### 6-1. 사이트 접속
1. Vercel Dashboard에서 배포 URL 클릭
2. 또는 브라우저에서 직접 입력 (예: `https://forestecho.vercel.app`)

### 6-2. 기능 테스트 체크리스트

**✅ 필수 테스트 (5분):**

1. **홈페이지 로딩**
   - [ ] 페이지가 정상적으로 보임
   - [ ] 숲 배경이 보임
   - [ ] "대화 시작하기" 버튼이 있음

2. **회원가입**
   - [ ] 이메일/비밀번호로 가입 가능
   - [ ] 또는 Google 로그인 가능
   - [ ] 가입 후 자동 로그인됨

3. **채팅 기능**
   - [ ] 메시지 입력창이 보임
   - [ ] 메시지 전송 가능
   - [ ] AI가 응답함 (10-20초 소요)

4. **심리 분석**
   - [ ] "분석 받기" 버튼 클릭
   - [ ] 분석 리포트 생성됨
   - [ ] 다운로드 가능

5. **나의 숲**
   - [ ] "나의 숲" 메뉴 클릭
   - [ ] 레벨 표시됨
   - [ ] 분석 히스토리 보임

### 6-3. 보안 테스트

**✅ 중요 테스트:**

1. **다른 브라우저로 테스트**
   - 시크릿 모드 또는 다른 브라우저 열기
   - 다른 계정으로 회원가입
   - 첫 번째 계정의 채팅이 보이면 안 됨! ⚠️
   - 첫 번째 계정의 분석이 보이면 안 됨! ⚠️

2. **확인 완료**
   - 각자 본인 데이터만 보임 → ✅ 정상
   - 다른 사람 데이터가 보임 → ⚠️ Firestore Rules 재확인

---

## 7단계: 모바일 테스트 (선택)

### 7-1. 반응형 확인
1. PC 브라우저에서 개발자 도구 열기 (F12)
2. 모바일 모드 토글 (Ctrl+Shift+M 또는 폰 아이콘)
3. iPhone/Android 선택
4. 화면이 제대로 보이는지 확인

### 7-2. 실제 모바일 테스트
1. 스마트폰에서 배포 URL 접속
2. 홈 화면에 추가 가능 (PWA)
3. 터치 동작 확인

---

## 8단계: 비용 관리 설정

### 8-1. Firebase 예산 알림
1. Firebase Console → 프로젝트 설정
2. "사용량 및 결제" 탭
3. "예산 알림 설정" 클릭
4. $10 초과 시 알림 설정

### 8-2. OpenAI 사용량 제한
1. https://platform.openai.com/account/limits
2. "Usage limits" 섹션
3. 월 $50 제한 설정 (권장)

---

## 🎉 배포 완료!

### 배포 성공 기준
- [ ] Vercel 배포 완료
- [ ] 환경 변수 8개 이상 입력
- [ ] Firestore Rules 적용
- [ ] Authorized domains 추가
- [ ] 로그인/채팅 작동 확인
- [ ] 보안 테스트 통과

### 다음 단계
- [ ] 커스텀 도메인 연결 (선택)
- [ ] Google Analytics 설정 (선택)
- [ ] SEO 최적화 (선택)
- [ ] 소셜 미디어 공유 (선택)

---

## ❓ 자주 묻는 질문 (FAQ)

### Q1. 배포는 성공했는데 로그인이 안 돼요
**A:** Firebase Authorized domains에 Vercel 도메인을 추가하세요.
- Firebase Console → Authentication → Settings → Authorized domains
- Vercel 도메인 추가 (예: `forestecho.vercel.app`)

### Q2. "Permission Denied" 에러가 나요
**A:** Firestore Security Rules를 적용하세요.
- Firebase Console → Firestore Database → Rules
- `firestore.rules` 파일 내용 복사-붙여넣기 → 게시

### Q3. AI가 응답하지 않아요
**A:** OpenAI API 키를 확인하세요.
- Vercel Dashboard → Settings → Environment Variables
- OPENAI_API_KEY 값 확인
- 잘못 입력했다면 수정 후 "Redeploy" 필요

### Q4. 환경 변수를 수정했는데 반영이 안 돼요
**A:** 재배포가 필요합니다.
- Vercel Dashboard → Deployments 탭
- 최신 배포의 "..." 메뉴 클릭
- "Redeploy" 선택

### Q5. 비용이 얼마나 나올까요?
**A:** 무료 한도가 매우 넉넉합니다.
- Vercel: 무료 (취미 프로젝트)
- Firebase: 일 50,000 읽기 무료
- OpenAI: 사용량에 따라 (월 $10-50 예상)

---

## 🆘 문제 해결

### 빌드 실패
1. Vercel Dashboard → Deployments → Build Logs 확인
2. 에러 메시지 읽고 해결
3. 로컬에서 `npm run build` 테스트

### 환경 변수 오류
1. Vercel → Settings → Environment Variables
2. 모든 필수 변수가 있는지 확인
3. 오타 확인 (특히 NEXT_PUBLIC_ 접두사)

### Firebase 연결 오류
1. Firebase Console에서 API 키 재확인
2. 환경 변수 값이 정확한지 확인
3. Vercel에서 재배포

---

## 📞 추가 도움

- Vercel 문서: https://vercel.com/docs
- Firebase 문서: https://firebase.google.com/docs
- GitHub 저장소: https://github.com/Dazzlar199/forestecho
- Issues: https://github.com/Dazzlar199/forestecho/issues

---

**축하합니다! 🎉**

이제 전 세계 어디서나 접속 가능한 AI 심리 상담 서비스를 운영하고 있습니다!
