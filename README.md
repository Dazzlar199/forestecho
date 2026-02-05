# 🌿 숲울림 (ForestEcho) - AI 심리상담 플랫폼

> 당신의 마음에 울리는 전문 AI 심리상담 서비스

힐링 숲 속에서 경험하는 따뜻하고 전문적인 AI 심리상담. 24시간 언제든지 당신의 이야기를 들어드립니다.

## 🌟 주요 특징

### ✨ 핵심 기능
- **Google Gemini 3 Flash AI 상담**: 최신 AI 모델 기반의 깊이 있는 공감과 전문적인 상담
- **다양한 상담 모드**: 일반 상담, CBT, DBT, 정신역동, 인지적 상담 등 10가지 모드
- **이성-감성 톤 조절**: 0-100 슬라이더로 AI 응답 스타일 조정
- **실시간 스트리밍**: AI 응답을 실시간으로 받아볼 수 있는 스트리밍 채팅
- **위기 감지 시스템**: 자살/자해 키워드 감지 시 즉시 응급 연락처 제공
- **힐링 숲 테마**: 자연의 편안함을 느낄 수 있는 UI/UX

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
- **앱인토스**: 토스 앱 내 미니앱으로 접근 가능

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

# Google AdSense (Optional)
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx

# Base URL (배포 후)
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
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
│   │   └── analysis/       # 심리 분석 생성
│   ├── terms/              # 이용약관
│   ├── disclaimer/         # 면책조항
│   ├── layout.tsx          # 루트 레이아웃
│   └── page.tsx            # 메인 페이지
│
├── components/              # React 컴포넌트
│   ├── auth/               # 인증 (로그인/회원가입)
│   ├── chat/               # 채팅 인터페이스
│   ├── counseling/         # 상담 모드 선택기, 톤 슬라이더
│   ├── crisis/             # 위기 대응 모달
│   ├── premium/            # 프리미엄 분석 리포트
│   ├── apps-in-toss/       # 앱인토스 SDK 연동
│   └── layout/             # 헤더, 배경, 언어 선택기
│
├── lib/                     # 비즈니스 로직
│   ├── gemini/             # Google Gemini AI
│   │   ├── config.ts       # 모델 설정 (gemini-3-flash-preview)
│   │   ├── advanced-prompts.ts  # 전문 상담사 프롬프트
│   │   ├── counseling-modes.ts  # 10가지 상담 모드
│   │   ├── context-manager.ts   # 위기 감지, 컨텍스트 생성
│   │   └── response-filter.ts   # 콘텐츠 안전 필터
│   ├── firebase/           # Firebase 클라이언트/Admin SDK
│   ├── search/             # Tavily 연구 검색 통합
│   ├── rate-limit.ts       # API 요청 제한 (10/분)
│   └── utils/              # 언어 감지, 아이콘 생성
│
├── contexts/                # React Context
│   └── ChatContext.tsx     # 채팅 상태 관리
│
├── types/                   # TypeScript 타입 정의
│
├── functions/              # Firebase Cloud Functions (Optional)
│   └── index.js           # Node.js 백엔드 API
│
├── public/                  # 정적 파일
│   ├── images/             # 이미지 에셋
│   ├── music/              # 배경 음악 (현재 비활성화)
│   └── manifest.json       # PWA 매니페스트
│
├── firestore.rules         # Firebase 보안 규칙
├── firebase.json           # Firebase 설정
├── next.config.js          # Next.js 설정
├── tailwind.config.ts      # Tailwind CSS 커스텀 테마
└── tsconfig.json           # TypeScript 설정
```

---

## 🎨 기술 스택

### Frontend
- **Framework**: Next.js 16.0.0 (App Router, React 19)
- **Language**: TypeScript 5.9.3 (Strict Mode)
- **Styling**: Tailwind CSS 3.4.18 + Custom Forest Theme
- **State**: React Context API
- **Animation**: Framer Motion 12.23.24
- **Icons**: Lucide React 0.548.0

### Backend
- **AI Model**: Google Gemini 3 Flash Preview
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Research**: Tavily API (심리학 연구 검색)
- **Rate Limiting**: In-memory (10 requests/min)

### Deployment
- **Web**: Vercel (Production)
- **Apps in Toss**: 토스 앱 미니앱 플랫폼

---

## 🔒 보안 기능

### 1. 콘텐츠 필터링
```typescript
// lib/gemini/response-filter.ts
- 마약/약물 관련
- 무기/폭력 관련
- 자해/자살 관련
- 미성년자 성적 콘텐츠
- 범죄 조장
- 혐오 발언
- 개인정보 노출
```

### 2. 위기 감지
```typescript
// lib/gemini/context-manager.ts
- 자살 키워드 실시간 감지
- 자해 키워드 감지
- 즉시 응급 연락처 제공 (1577-0199 등)
```

### 3. Firebase 보안 규칙
- 사용자별 데이터 격리 (userId 기반)
- Admin 권한 검증 (Custom Claims 필요)
- 읽기/쓰기 권한 세밀 제어

---

## 💰 수익 모델

### 1. 앱인토스 수익화

#### A. 인앱 광고 (IAA)
- 전면형/보상형 광고
- 토스 애즈 연동
- **수수료**: 광고매출의 30% (운영비) + 15% (앱인토스 수수료)

#### B. 인앱 결제 (IAP)
- 프리미엄 구독 (월 9,900원)
- **수수료**: 앱마켓 15-30% + 토스 5%

### 2. 웹 수익화

#### Google AdSense
- 배너 광고
- 네이티브 광고
- **예상 수익**: 월 10,000명 기준 $100-500

#### Stripe 결제
- 프리미엄 구독
- 월 9,900원

---

## 📱 앱인토스 배포

### 제출 준비물

1. **웹 서비스 URL** (배포 완료된 URL)
2. **서비스 정보**
   - 서비스명: 숲울림 (ForestEcho)
   - 카테고리: 건강/의료 또는 라이프스타일
   - 설명: AI 기반 24시간 심리상담 서비스
3. **법적 문서**
   - ✅ 이용약관 (/terms)
   - ✅ 면책조항 (/disclaimer)
   - ✅ 개인정보처리방침 (Firebase)
4. **심사용 계정**
   - 테스트 이메일/비밀번호
5. **스크린샷**
   - 5-8장 (채팅, 모드 선택, 분석 등)

### 토스 SDK 연동

```typescript
// components/apps-in-toss/AppsInTossProvider.tsx
// TODO: 토스 개발자 문서 참고하여 구현
// https://toss.im/developers/apps-in-toss
```

---

## 🧪 테스트

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build
npm run start

# 린트
npm run lint
```

---

## 📊 성능 최적화

### 구현된 최적화
- ✅ 코드 분할 (Dynamic imports)
- ✅ 이미지 최적화 (Next.js Image)
- ✅ 서비스 워커 (PWA 오프라인 지원)
- ✅ 스트리밍 응답 (AI 대기 시간 최소화)

### 추가 개선 필요
- ⏳ 번들 분석 (@next/bundle-analyzer)
- ⏳ Intersection Observer (애니메이션 최적화)
- ⏳ Redis 기반 rate limiting (Upstash)

---

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다.

---

## 🤝 기여

현재는 개인 프로젝트로 운영 중입니다.

---

## 📞 문의

- **이메일**: support@forestecho.app
- **웹사이트**: https://forestecho.app

---

## 📝 변경 이력

### v1.0.0 (2026-01-30)
- ✅ Google Gemini 3 Flash Preview 통합
- ✅ ElevenLabs 음성 기능 제거 (불필요)
- ✅ Capacitor/Flutter 제거 (웹 전용)
- ✅ 앱인토스 준비 (SDK 연동 예정)
- ✅ 보안 강화 (콘텐츠 필터, 위기 감지)
- ✅ 다국어 자동 감지
- ✅ 10가지 상담 모드
- ✅ 이성-감성 톤 조절

---

**Made with ❤️ for mental health support**
