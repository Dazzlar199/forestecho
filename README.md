# 🌿 숲울림 (ForestEcho) - AI 심리상담 플랫폼

> 당신의 마음에 울리는 전문 AI 심리상담 서비스

힐링 숲 속에서 경험하는 따뜻하고 전문적인 AI 심리상담. 24시간 언제든지 당신의 이야기를 들어드립니다.

## 🌟 주요 특징

### ✨ 핵심 기능
- **Google Gemini AI 상담**: 최신 AI 모델 기반의 깊이 있는 공감과 전문적인 상담
- **다양한 상담 모드**: 일반 상담, CBT, DBT, 정신역동, 인지적 상담 등 10가지 모드
- **이성-감성 톤 조절**: 0-100 슬라이더로 AI 응답 스타일 조정
- **실시간 스트리밍**: AI 응답을 실시간으로 받아볼 수 있는 스트리밍 채팅
- **위기 감지 시스템**: 자살/자해 키워드 감지 시 즉시 응급 연락처 제공
- **힐링 숲 테마**: 자연의 편안함을 느낄 수 있는 UI/UX
- **감정 기록**: 일일 감정 체크인 및 트렌드 분석
- **나의 숲**: 상담 참여도에 따른 힐링 숲 성장 시스템

### 🌍 다국어 지원
- 자동 언어 감지 (한국어, 영어, 일본어, 중국어)
- 언어별 최적화된 AI 응답

### 🔐 보안 & 안전
- Firebase 인증 (이메일/Google 로그인)
- 콘텐츠 필터링 시스템 (금지 콘텐츠 차단)
- 개인정보 보호 및 익명성 보장
- 위기 상황 즉시 감지 및 대응

### 💎 프리미엄 기능
- **무제한 대화** (무료는 하루 10회 제한)
- **전문 심리 분석 리포트**: AI 기반 심화 분석
- **대화 히스토리 무제한 저장**
- **광고 없는 경험**

### 📱 플랫폼
- **웹 앱**: Next.js 16 기반 PWA (Progressive Web App)
- **iOS/Android**: Capacitor 기반 네이티브 앱 (예정)

---

## 🚀 시작하기

### 1. 환경 설정

```bash
# 패키지 설치
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일 생성:

```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key

# Tavily API Key (심리학 연구 검색)
TAVILY_API_KEY=your_tavily_api_key

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# Sentry (Error Tracking)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

# Base URL
NEXT_PUBLIC_BASE_URL=https://forestecho.app
```

### 3. Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성
2. Authentication 활성화 (Email/Password, Google)
3. Firestore Database 생성
4. 보안 규칙 배포: `firebase deploy --only firestore:rules`
5. 프로젝트 설정에서 config 값을 `.env.local`에 복사

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

---

## 📁 프로젝트 구조

```
mentaltouch_App/
├── app/                      # Next.js App Router
│   ├── api/                 # API 라우트
│   │   ├── chat/           # Gemini AI 채팅 (스트리밍)
│   │   ├── analysis/       # 심리 분석 생성
│   │   └── subscription/   # 구독 관리
│   ├── emotion/            # 감정 기록 페이지
│   ├── myforest/           # 나의 숲 페이지
│   ├── assessment/         # 자가진단
│   ├── community/          # 커뮤니티
│   ├── education/          # 심리 교육 콘텐츠
│   ├── terms/              # 이용약관
│   ├── disclaimer/         # 면책조항
│   └── page.tsx            # 메인 페이지

├── components/              # React 컴포넌트
│   ├── auth/               # 인증 (로그인/회원가입)
│   ├── chat/               # 채팅 인터페이스
│   ├── counseling/         # 상담 모드 선택기
│   ├── crisis/             # 위기 대응 모달
│   ├── emotion/            # 감정 기록 컴포넌트
│   ├── forest/             # 숲 시스템 컴포넌트
│   └── layout/             # 헤더, 푸터, 네비게이션

├── lib/                     # 비즈니스 로직
│   ├── gemini/             # Google Gemini AI
│   ├── firebase/           # Firebase 클라이언트/Admin SDK
│   ├── search/             # Tavily 연구 검색
│   ├── rate-limit-upstash.ts # Upstash 기반 Rate Limiting
│   └── utils/              # 유틸리티 함수

├── contexts/                # React Context
│   ├── ChatContext.tsx     # 채팅 상태 관리
│   └── SeasonContext.tsx   # 계절 테마 관리

├── types/                   # TypeScript 타입 정의

├── public/                  # 정적 파일
│   ├── data/               # 교육 콘텐츠 JSON
│   └── manifest.json       # PWA 매니페스트

├── firestore.rules         # Firebase 보안 규칙
├── firebase.json           # Firebase 설정
└── capacitor.config.ts     # Capacitor 설정 (모바일)
```

---

## 🎨 기술 스택

### Frontend
- **Framework**: Next.js 16 (App Router, React 19)
- **Language**: TypeScript 5.9 (Strict Mode)
- **Styling**: Tailwind CSS + Custom Forest Theme
- **Animation**: Framer Motion
- **Charts**: Recharts (감정 그래프)
- **Icons**: Lucide React

### Backend
- **AI Model**: Google Gemini
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Research**: Tavily API
- **Rate Limiting**: Upstash Redis
- **Error Tracking**: Sentry

### Deployment
- **Web**: Vercel
- **Mobile**: Capacitor (iOS/Android)

---

## 🔒 보안 기능

### 1. 콘텐츠 필터링
- 마약/약물 관련
- 무기/폭력 관련
- 자해/자살 관련
- 미성년자 성적 콘텐츠
- 범죄 조장
- 혐오 발언
- 개인정보 노출

### 2. 위기 감지
- 자살 키워드 실시간 감지
- 자해 키워드 감지
- 즉시 응급 연락처 제공 (1577-0199 등)

### 3. Firebase 보안 규칙
- 사용자별 데이터 격리 (userId 기반)
- Admin 권한 검증 (Custom Claims)
- 읽기/쓰기 권한 세밀 제어

---

## 🧪 개발 명령어

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build
npm run start

# 린트
npm run lint

# Capacitor 동기화 (모바일)
npm run cap:sync
npm run cap:open:ios
npm run cap:open:android
```

---

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다.

---

## 📞 문의

- **이메일**: support@forestecho.app
- **웹사이트**: https://forestecho.app

---

**Made with ❤️ for mental health support**
