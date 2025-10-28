# MentalTouch 배포 및 수익화 가이드

완전한 단계별 가이드입니다.

## 1단계: Firebase 설정 (15분)

### 1.1 Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: `mentaltouch` (또는 원하는 이름)
4. Google Analytics 활성화 (추천)

### 1.2 Authentication 설정

1. Firebase Console에서 "Authentication" 선택
2. "시작하기" 클릭
3. "Sign-in method" 탭에서 활성화:
   - 이메일/비밀번호
   - Google

### 1.3 Firestore Database 설정

1. "Firestore Database" 선택
2. "데이터베이스 만들기" 클릭
3. "프로덕션 모드에서 시작" 선택
4. 위치: `asia-northeast3` (서울) 선택

### 1.4 보안 규칙 설정

Firestore 규칙 탭에서:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 프로필
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // 채팅 세션
    match /chatSessions/{sessionId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
\`\`\`

### 1.5 Firebase 설정 정보 복사

1. 프로젝트 설정 > 일반
2. "내 앱" > "웹 앱 추가"
3. 앱 닉네임: "MentalTouch Web"
4. Firebase SDK 설정 정보를 `.env.local`에 복사

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mentaltouch.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mentaltouch
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mentaltouch.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
\`\`\`

## 2단계: 로컬 테스트 (10분)

\`\`\`bash
# 패키지 설치 확인
npm install

# 개발 서버 실행
npm run dev
\`\`\`

브라우저에서 http://localhost:3000 접속하여 테스트:

- ✅ 웰컴 화면 확인
- ✅ 상담 시작 버튼 클릭
- ✅ 대화 테스트
- ✅ 로그인/회원가입 테스트
- ✅ BGM 작동 확인

## 3단계: Vercel 배포 (20분)

### 3.1 GitHub에 푸시

\`\`\`bash
git init
git add .
git commit -m "Initial commit: MentalTouch counseling platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mentaltouch.git
git push -u origin main
\`\`\`

### 3.2 Vercel 설정

1. [Vercel](https://vercel.com) 가입/로그인
2. "New Project" 클릭
3. GitHub 저장소 import
4. 환경 변수 추가:
   - `OPENAI_API_KEY`
   - `ELEVENLABS_API_KEY`
   - Firebase 관련 변수들 (`NEXT_PUBLIC_*`)

5. "Deploy" 클릭

배포 완료 후 Vercel URL 확인: `https://mentaltouch.vercel.app`

## 4단계: 도메인 연결 (30분)

### 4.1 도메인 구매

추천 도메인:
- `mentaltouch.com`
- `mentaltouch.co.kr`
- `mentaltouch.kr`

도메인 구매처:
- [가비아](https://www.gabia.com/)
- [호스팅케이알](https://www.hosting.kr/)
- [Namecheap](https://www.namecheap.com/)

가격: 연 10,000원 ~ 30,000원

### 4.2 도메인 연결

1. Vercel 프로젝트 > Settings > Domains
2. 도메인 입력 (예: mentaltouch.com)
3. DNS 레코드 추가:

**A 레코드:**
\`\`\`
Type: A
Name: @
Value: 76.76.21.21
\`\`\`

**CNAME 레코드:**
\`\`\`
Type: CNAME
Name: www
Value: cname.vercel-dns.com
\`\`\`

4. 24시간 내 DNS 전파 대기

### 4.3 환경 변수 업데이트

`.env.local`에 도메인 추가:
\`\`\`env
NEXT_PUBLIC_BASE_URL=https://mentaltouch.com
\`\`\`

## 5단계: Google AdSense 설정 (1-2주)

### 5.1 AdSense 가입

1. [Google AdSense](https://www.google.com/adsense/) 가입
2. 사이트 URL 입력: `https://mentaltouch.com`
3. 승인 대기 (보통 1-2주 소요)

### 5.2 필요 조건

AdSense 승인을 위해:
- ✅ 최소 20-30개의 양질의 콘텐츠 페이지
- ✅ 개인정보 처리방침 페이지
- ✅ 이용약관 페이지
- ✅ 회사 소개 페이지
- ✅ 일 방문자 50명 이상

### 5.3 광고 코드 삽입

승인 후:
1. AdSense에서 광고 단위 생성
2. 광고 슬롯 ID 복사
3. `.env.local`에 추가:

\`\`\`env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-1234567890123456
\`\`\`

4. `components/ads/AdSense.tsx`에서 슬롯 ID 업데이트

## 6단계: 수익화 전략

### 6.1 트래픽 증대

**SEO 최적화:**
- 블로그 섹션 추가 (심리 관련 글)
- 키워드 최적화
- 메타 태그 설정
- 사이트맵 제출

**콘텐츠 마케팅:**
- 주 2-3회 블로그 포스팅
- 심리 테스트 추가
- 명언/힐링 콘텐츠

**SNS 마케팅:**
- 인스타그램 계정 운영
- 페이스북 페이지
- 네이버 블로그
- 유튜브 쇼츠

### 6.2 광고 수익 예상

| 월 방문자 | 예상 AdSense 수익 | 프리미엄 구독자 | 예상 구독 수익 | 총 수익 |
|---------|-----------------|--------------|--------------|--------|
| 1,000   | 5만원           | 10명         | 10만원       | 15만원 |
| 5,000   | 25만원          | 50명         | 50만원       | 75만원 |
| 10,000  | 50만원          | 100명        | 100만원      | 150만원|
| 50,000  | 250만원         | 500명        | 500만원      | 750만원|

### 6.3 프리미엄 구독 설정 (Stripe)

1. [Stripe](https://stripe.com/kr) 가입
2. API 키 받기
3. 구독 상품 생성:
   - 월간: 9,900원
   - 3개월: 26,900원
   - 연간: 99,000원

4. 환경 변수 추가:
\`\`\`env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
\`\`\`

## 7단계: 법적 페이지 추가

### 7.1 개인정보 처리방침

\`\`\`bash
# app/privacy/page.tsx 생성
\`\`\`

내용:
- 수집하는 정보
- 정보 사용 목적
- 정보 보호 방법
- 사용자 권리

### 7.2 이용약관

\`\`\`bash
# app/terms/page.tsx 생성
\`\`\`

## 8단계: 분석 및 모니터링

### 8.1 Google Analytics 4

1. [Google Analytics](https://analytics.google.com/) 설정
2. 추적 ID 발급
3. `app/layout.tsx`에 추가

### 8.2 주요 지표 추적

- 일일 방문자 수
- 대화 시작률
- 회원가입 전환율
- 프리미엄 전환율
- 평균 대화 길이

## 9단계: BGM 파일 추가

무료 힐링 사운드 다운로드:

1. [Freesound](https://freesound.org/)에서 "forest ambience" 검색
2. [Free Music Archive](https://freemusicarchive.org/)에서 힐링 음악 다운로드
3. `public/sounds/` 폴더에 저장
4. `components/layout/BackgroundMusic.tsx` 업데이트:

\`\`\`typescript
audioRef.current.src = '/sounds/forest-ambience.mp3'
\`\`\`

## 10단계: 지속적 개선

### 월간 체크리스트

- [ ] 사용자 피드백 수집 및 반영
- [ ] 새로운 콘텐츠 추가
- [ ] SEO 순위 확인
- [ ] 광고 수익 분석
- [ ] 보안 업데이트
- [ ] 프롬프트 개선

### 분기별 목표

- **1분기**: 일 방문자 100명 달성
- **2분기**: 일 방문자 500명, 프리미엄 10명
- **3분기**: 일 방문자 1,000명, 프리미엄 50명
- **4분기**: 일 방문자 2,000명, 프리미엄 100명

## 문제 해결

### Firebase 에러

**"Firebase: Error (auth/unauthorized-domain)"**
- Firebase Console > Authentication > Settings > Authorized domains에 도메인 추가

### OpenAI API 에러

**"Rate limit exceeded"**
- OpenAI 대시보드에서 사용량 확인
- 필요시 결제 한도 증액

### 배포 에러

**"Build failed"**
- `npm run build` 로컬에서 테스트
- 환경 변수 확인
- TypeScript 에러 수정

## 연락처 및 지원

문제가 발생하면 GitHub Issues에 등록해주세요.

---

**성공을 기원합니다!** 🌿
