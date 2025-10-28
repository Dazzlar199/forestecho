# 🌿 숲울림 - AI 심리상담 플랫폼

> 당신의 마음에 울리는 전문 AI 심리상담 서비스

힐링 숲 속에서 경험하는 따뜻하고 전문적인 AI 심리상담. 24시간 언제든지 당신의 이야기를 들어드립니다.

## ✨ 주요 기능

### 🎯 핵심 기능
- **전문 AI 심리상담**: GPT-4o 기반의 깊이 있는 공감과 전문적인 상담
- **힐링 숲 테마**: 자연의 편안함을 느낄 수 있는 UI/UX
- **힐링 BGM**: 숲 속의 평화로운 분위기를 조성하는 배경음악
- **24/7 상담**: 언제든지 이용 가능한 상담 서비스

### 🔐 사용자 관리
- Firebase 인증 (이메일/Google 로그인)
- 대화 히스토리 자동 저장
- 개인정보 보호 및 익명성 보장

### 💎 프리미엄 기능
- **무제한 대화** (무료는 하루 10회 제한)
- **전문 심리 분석 리포트**: AI 기반 심화 분석
- **음성 상담**: ElevenLabs를 통한 음성 응답
- **대화 히스토리 무제한 저장**
- **광고 없는 경험**

### 💰 수익화 모델
- Google AdSense 광고 (무료 사용자)
- 프리미엄 구독 (월 9,900원)
- Stripe 결제 시스템 통합 준비

## 🚀 시작하기

### 1. 환경 설정

\`\`\`bash
# 저장소 클론 (또는 현재 디렉토리 사용)
cd mentaltouch

# 패키지 설치
npm install
\`\`\`

### 2. 환경 변수 설정

`.env.local` 파일 생성:

\`\`\`env
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key

# ElevenLabs API Key (음성 기능)
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google AdSense
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx

# Base URL (배포 후)
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
\`\`\`

### 3. Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성
2. Authentication 활성화 (Email/Password, Google)
3. Firestore Database 생성
4. 프로젝트 설정에서 config 값을 `.env.local`에 복사

### 4. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 http://localhost:3000 접속

## 📁 프로젝트 구조

\`\`\`
mentaltouch/
├── app/                      # Next.js App Router
│   ├── api/                 # API 라우트
│   │   ├── chat/           # 채팅 API
│   │   ├── analysis/       # 심리 분석 API
│   │   └── voice/          # 음성 생성 API
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 메인 페이지
│   ├── sitemap.ts          # SEO Sitemap
│   └── robots.ts           # SEO Robots
├── components/              # React 컴포넌트
│   ├── auth/               # 인증 관련
│   ├── chat/               # 채팅 인터페이스
│   ├── layout/             # 레이아웃 컴포넌트
│   ├── premium/            # 프리미엄 기능
│   └── ads/                # 광고 컴포넌트
├── lib/                     # 유틸리티 & 설정
│   ├── firebase/           # Firebase 설정
│   └── openai/             # OpenAI 설정 & 프롬프트
└── public/                  # 정적 파일
    └── sounds/             # BGM 파일
\`\`\`

## 🎨 디자인 컨셉

### 힐링 숲 테마
- **색상**: 자연의 초록색, 하늘색, 따뜻한 오렌지톤
- **분위기**: 평화롭고 안정적인 숲 속 공간
- **BGM**: 새소리, 바람소리 등 자연의 소리
- **애니메이션**: 부드럽고 자연스러운 전환

## 📊 수익화 전략

### 1. 광고 수익 (Google AdSense)

**설정 방법:**
1. [Google AdSense](https://www.google.com/adsense/) 가입
2. 사이트 승인 받기
3. 광고 단위 생성
4. `.env.local`에 클라이언트 ID 추가
5. 컴포넌트에 광고 슬롯 ID 입력

**예상 수익:**
- 월간 방문자 10,000명 기준: 월 $100-500
- 월간 방문자 100,000명 기준: 월 $1,000-5,000

### 2. 프리미엄 구독 (Stripe)

**설정 방법:**
1. [Stripe](https://stripe.com/) 계정 생성
2. API 키 발급
3. 구독 상품 생성 (월 9,900원)
4. Webhook 설정
5. Firebase에 구독 상태 저장

**구독 가격 제안:**
- 월간: 9,900원
- 3개월: 26,900원 (10% 할인)
- 연간: 99,000원 (17% 할인)

### 3. 트래픽 증대 전략

**SEO 최적화:**
- ✅ 메타데이터 최적화
- ✅ Sitemap & Robots.txt
- 블로그 콘텐츠 (심리 관련 글)
- 키워드: "AI 심리상담", "온라인 상담", "멘탈케어"

**마케팅:**
- SNS 마케팅 (인스타그램, 페이스북)
- 유튜브 콘텐츠 (심리 팁, 서비스 소개)
- 네이버 블로그/카페 활용
- 구글/네이버 검색 광고

## 🌐 배포하기

### Vercel 배포 (추천)

1. [Vercel](https://vercel.com/) 계정 생성
2. GitHub에 프로젝트 푸시
3. Vercel에서 프로젝트 import
4. 환경 변수 설정
5. 배포 완료!

**장점:**
- Next.js에 최적화
- 무료 SSL 인증서
- 자동 배포
- CDN 기본 제공

### 도메인 연결

1. **도메인 구매**
   - 가비아, 호스팅케이알 등에서 구매
   - 추천: .com, .co.kr
   - 예: mentaltouch.com

2. **DNS 설정**
   - Vercel에서 제공하는 DNS 레코드 추가
   - 보통 24시간 내 적용

3. **SSL 인증서**
   - Vercel에서 자동 발급

## 💳 결제 시스템 구현

### Stripe 통합 예정

\`\`\`bash
# Stripe 패키지 설치
npm install @stripe/stripe-js stripe
\`\`\`

프리미엄 구독 기능은 기본 구조가 준비되어 있으며,
Stripe 설정 후 바로 사용 가능합니다.

## 📈 성장 로드맵

### Phase 1: 런칭 (1개월)
- ✅ 기본 채팅 기능
- ✅ Firebase 인증
- ✅ 광고 통합
- ✅ 보안 헤더 설정
- ✅ TypeScript 타입 안정성
- ✅ 프로덕션 빌드 최적화
- ✅ 모바일 반응형 UI/UX
- ✅ 온보딩 튜토리얼
- ✅ 위기 상황 긴급 연락처
- ✅ 심리 분석 다운로드 기능
- 도메인 연결
- SEO 최적화

### Phase 2: 성장 (2-3개월)
- Stripe 결제 연동
- 마케팅 시작
- 사용자 피드백 반영
- 블로그 콘텐츠 작성

### Phase 3: 확장 (4-6개월)
- 모바일 앱 개발 (React Native)
- 전문 상담사 매칭 기능
- 그룹 상담 기능
- 커뮤니티 기능

## 🔒 보안 & 개인정보

- Firebase Security Rules 설정
- HTTPS 필수
- 개인정보 암호화 저장
- 정기적인 보안 업데이트

## 🎯 목표

- **1개월**: 일 방문자 100명
- **3개월**: 일 방문자 500명
- **6개월**: 일 방문자 2,000명
- **1년**: 월 구독자 1,000명

## 📞 지원

문제가 발생하면 이슈를 등록해주세요.

## 📄 라이선스

MIT License

---

**만든 이:** MentalTouch Team
**연락처:** contact@mentaltouch.com (예시)
