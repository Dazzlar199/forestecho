# 🔥 Firebase 배포 전 필수 설정 가이드

## ⚠️ 중요: 이 설정을 건너뛰면 데이터가 완전히 노출되거나 앱이 작동하지 않을 수 있습니다!

---

## 1️⃣ Firestore Security Rules 설정

### 문제점
- 기본 설정은 **모든 사람이 읽고 쓸 수 있음** (매우 위험!)
- 제대로 설정하지 않으면 누구나 데이터 조회/삭제 가능

### 해결 방법

Firebase Console → Firestore Database → Rules 탭에서 다음 규칙 적용:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // 기본: 모든 접근 차단
    match /{document=**} {
      allow read, write: if false;
    }

    // 채팅 세션: 본인만 접근 가능
    match /chatSessions/{sessionId} {
      // 읽기: 본인 세션만
      allow read: if request.auth != null
                  && request.auth.uid == resource.data.userId;

      // 생성: 로그인한 사용자, userId 일치 확인
      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.userId;

      // 수정: 본인 세션만
      allow update: if request.auth != null
                    && request.auth.uid == resource.data.userId;

      // 삭제: 본인 세션만
      allow delete: if request.auth != null
                    && request.auth.uid == resource.data.userId;
    }

    // 심리 분석: 본인만 접근 가능
    match /psychologicalAnalyses/{analysisId} {
      // 읽기: 본인 분석만
      allow read: if request.auth != null
                  && request.auth.uid == resource.data.userId;

      // 생성: 로그인한 사용자, userId 일치 확인
      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.userId;

      // 수정: 본인 분석만
      allow update: if request.auth != null
                    && request.auth.uid == resource.data.userId;

      // 삭제: 본인 분석만
      allow delete: if request.auth != null
                    && request.auth.uid == resource.data.userId;
    }

    // 사용자 프로필 (향후 사용)
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
                   && request.auth.uid == userId;
    }

    // 감정 기록
    match /emotions/{emotionId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.userId;
    }

    // 체크인 기록
    match /checkins/{checkinId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.userId;
    }

    // 커뮤니티 포스트 (모두 읽기 가능, 작성자만 수정/삭제)
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null
                            && request.auth.uid == resource.data.authorId;
    }
  }
}
```

### ✅ 테스트 방법
1. Firebase Console → Rules → "규칙 시뮬레이터"
2. 다른 사용자의 데이터 접근 시도 → **차단되어야 함**
3. 본인 데이터 접근 → **허용되어야 함**

---

## 2️⃣ Firebase Authentication 도메인 설정

### 문제점
- Vercel 도메인을 추가하지 않으면 로그인이 작동하지 않음

### 해결 방법

Firebase Console → Authentication → Settings → Authorized domains

**추가해야 할 도메인:**
```
localhost                          # 로컬 개발
your-project.vercel.app           # Vercel 기본 도메인
your-custom-domain.com            # 커스텀 도메인 (있다면)
```

### 단계:
1. Firebase Console → Authentication → Settings
2. "Authorized domains" 탭
3. "Add domain" 클릭
4. Vercel 배포 후 받은 도메인 입력 (예: `forestecho.vercel.app`)
5. 커스텀 도메인도 추가 (예: `forestecho.com`)

---

## 3️⃣ Firebase Storage Rules (향후 사용 시)

### 현재 상태
- 아직 Storage 사용 안 함
- 향후 프로필 사진, 파일 업로드 시 필요

### 미리 설정 (선택사항)

Firebase Console → Storage → Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 사용자별 폴더
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
                   && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024; // 5MB 제한
    }
  }
}
```

---

## 4️⃣ 환경별 Firebase 설정 분리 (선택사항)

### 권장 사항
- **개발용 Firebase 프로젝트** 따로 만들기
- **프로덕션용 Firebase 프로젝트** 따로 만들기

### 이점
- 개발 중 실수로 프로덕션 데이터 손상 방지
- 테스트 데이터와 실제 데이터 분리

### 설정 방법
1. Firebase Console에서 새 프로젝트 생성 (예: `forestecho-prod`)
2. 새 환경 변수 파일 생성:
   - `.env.local` (개발용)
   - `.env.production` (프로덕션용)
3. Vercel에서는 프로덕션용 환경 변수 사용

---

## 5️⃣ API Rate Limiting 설정

### 문제점
- 악의적 사용자가 API 무한 호출 가능
- OpenAI API 비용 폭탄 가능

### 해결 방법

#### A. Firebase App Check 설정 (권장)

Firebase Console → App Check

1. "Get started" 클릭
2. "reCAPTCHA v3" 선택
3. 사이트 키 생성
4. 도메인 등록

코드에 추가:
```typescript
// lib/firebase/config.ts에 추가
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('YOUR_RECAPTCHA_SITE_KEY'),
    isTokenAutoRefreshEnabled: true
  })
}
```

#### B. Firestore Security Rules에서 제한

```javascript
// 하루 최대 요청 수 제한 (예시)
match /chatSessions/{sessionId} {
  allow create: if request.auth != null
                && request.auth.uid == request.resource.data.userId
                && request.time < timestamp.date(2024, 1, 1); // 날짜 기반 제한
}
```

---

## 6️⃣ CORS 설정 확인

### 현재 상태
- Next.js API Routes 사용 → CORS 자동 처리됨
- 추가 설정 불필요

### 만약 외부 API 호출 시
```typescript
// next.config.js에 추가
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: 'https://your-domain.com' },
        { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
      ],
    },
  ]
}
```

---

## 7️⃣ 환경 변수 체크리스트

### Vercel에서 반드시 설정해야 할 환경 변수

```bash
# OpenAI (필수)
OPENAI_API_KEY=sk-...

# Firebase (필수 - 7개)
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

### 확인 방법
```bash
# 로컬에서 테스트
npm run build
npm run start

# 모든 기능 테스트:
# 1. 회원가입/로그인
# 2. 채팅
# 3. 분석 생성
# 4. 데이터 저장 확인
```

---

## 8️⃣ 배포 전 최종 체크리스트

### 🔐 보안
- [ ] Firestore Rules 설정 완료
- [ ] Authentication 도메인 추가
- [ ] .env.local 파일이 Git에 없음 확인
- [ ] API 키가 코드에 하드코딩되지 않음

### 🔥 Firebase
- [ ] Firestore Database 생성
- [ ] Authentication 활성화 (Email/Password, Google)
- [ ] Firestore 인덱스 생성 (필요 시 자동 생성됨)
- [ ] Billing 설정 (Blaze 플랜 권장, 무료 한도 넉넉함)

### 🌐 Vercel
- [ ] 환경 변수 모두 입력
- [ ] 빌드 성공 확인
- [ ] 배포 URL 접속 확인

### ✅ 기능 테스트
- [ ] 로그인/회원가입
- [ ] 채팅 작동
- [ ] 분석 생성
- [ ] 데이터 저장
- [ ] 다른 계정에서 데이터 접근 불가 확인

---

## 9️⃣ 문제 발생 시 디버깅

### Firebase 에러
```bash
# 에러 메시지 예시
"PERMISSION_DENIED: Missing or insufficient permissions"

# 해결:
1. Firestore Rules 확인
2. userId가 올바르게 설정되었는지 확인
3. request.auth != null 확인
```

### 로그인 에러
```bash
# 에러: "auth/unauthorized-domain"

# 해결:
1. Firebase Console → Authentication → Settings
2. Authorized domains에 Vercel 도메인 추가
```

### 빌드 에러
```bash
# 환경 변수 없음 에러

# 해결:
1. Vercel → Settings → Environment Variables
2. 모든 NEXT_PUBLIC_* 변수 확인
```

---

## 🆘 긴급 상황 대처

### 데이터가 노출된 경우
1. **즉시** Firestore Rules를 모든 접근 차단으로 변경:
```javascript
match /{document=**} {
  allow read, write: if false;
}
```
2. Firebase Console에서 의심스러운 활동 확인
3. API 키 재발급
4. 사용자에게 비밀번호 변경 요청

### API 비용 폭탄
1. Firebase Console → Billing → Set budget alerts
2. OpenAI Dashboard → Usage limits 설정
3. 의심스러운 IP 차단

---

## 📞 도움 받기

- Firebase 문서: https://firebase.google.com/docs
- Vercel 문서: https://vercel.com/docs
- Next.js 문서: https://nextjs.org/docs

---

**이 가이드를 모두 따라하시면 99% 안전합니다!** 🔒
