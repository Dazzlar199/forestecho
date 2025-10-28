# 🔥 Firebase 프로덕션 배포 최종 점검 체크리스트

## ⚠️ 중요: 실제 배포 전 반드시 확인해야 할 Firebase 설정들

Firebase 프로젝트: `forestecho-3514b`

---

## 📋 1단계: Firestore Database 모드 확인

### 현재 상태 체크
Firebase Console → Firestore Database로 이동

**확인 사항:**
- [ ] Database가 **프로덕션 모드**로 생성되어 있는가?
- [ ] **테스트 모드**로 생성되어 있는가?

### 테스트 모드로 되어 있는 경우 (30일 후 자동 차단)

만약 Firestore를 테스트 모드로 생성했다면:

```javascript
// 테스트 모드 기본 규칙 (30일 후 만료됨!)
allow read, write: if request.time < timestamp.date(2024, 12, 1);
```

**⚠️ 위험**: 30일 후 모든 접근이 차단되어 앱이 작동하지 않음!

### ✅ 해결 방법

1. Firebase Console → Firestore Database → Rules 탭
2. **즉시** 프로덕션 규칙으로 교체:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // 기본: 모든 접근 차단 (안전!)
    match /{document=**} {
      allow read, write: if false;
    }

    // 채팅 세션: 본인만 접근
    match /chatSessions/{sessionId} {
      allow read: if request.auth != null
                  && request.auth.uid == resource.data.userId;

      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.userId
                    && request.resource.data.userId is string
                    && request.resource.data.messages is list;

      allow update: if request.auth != null
                    && request.auth.uid == resource.data.userId;

      allow delete: if request.auth != null
                    && request.auth.uid == resource.data.userId;
    }

    // 심리 분석: 본인만 접근
    match /psychologicalAnalyses/{analysisId} {
      allow read: if request.auth != null
                  && request.auth.uid == resource.data.userId;

      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.userId
                    && request.resource.data.userId is string;

      allow update: if request.auth != null
                    && request.auth.uid == resource.data.userId;

      allow delete: if request.auth != null
                    && request.auth.uid == resource.data.userId;
    }

    // 사용자 프로필
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
                   && request.auth.uid == userId;
    }

    // 감정 기록
    match /emotions/{emotionId} {
      allow read: if request.auth != null
                  && request.auth.uid == resource.data.userId;

      allow write: if request.auth != null
                   && request.auth.uid == resource.data.userId;

      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.userId;
    }

    // 체크인 기록
    match /checkins/{checkinId} {
      allow read: if request.auth != null
                  && request.auth.uid == resource.data.userId;

      allow write: if request.auth != null
                   && request.auth.uid == resource.data.userId;

      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.userId;
    }

    // 커뮤니티 포스트
    match /posts/{postId} {
      allow read: if request.auth != null;

      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.authorId;

      allow update, delete: if request.auth != null
                            && request.auth.uid == resource.data.authorId;
    }

    // 커뮤니티 댓글
    match /posts/{postId}/comments/{commentId} {
      allow read: if request.auth != null;

      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.authorId;

      allow update, delete: if request.auth != null
                            && request.auth.uid == resource.data.authorId;
    }
  }
}
```

3. **"게시"** 버튼 클릭
4. 확인: "규칙이 게시되었습니다" 메시지 표시

---

## 📋 2단계: Firebase Authentication 설정 확인

### A. 로그인 방법 활성화 상태

Firebase Console → Authentication → Sign-in method

**확인 사항:**
- [ ] Email/Password: **사용 설정됨**
- [ ] Google: **사용 설정됨**
- [ ] 기타 불필요한 방법: 비활성화됨

### B. Authorized Domains 설정

Firebase Console → Authentication → Settings → Authorized domains

**현재 설정되어야 할 도메인:**
- [ ] `localhost` (로컬 개발용)
- [ ] `forestecho-3514b.firebaseapp.com` (Firebase 기본 도메인)

**배포 후 추가해야 할 도메인:**
- [ ] `your-project.vercel.app` (Vercel 배포 후 추가!)
- [ ] `your-custom-domain.com` (커스텀 도메인 연결 시)

⚠️ **중요**: Vercel에 배포한 직후, Vercel 도메인을 여기에 즉시 추가해야 로그인이 작동합니다!

### C. 이메일 템플릿 설정 (선택)

Firebase Console → Authentication → Templates

비밀번호 재설정, 이메일 인증 등의 이메일 템플릿을 커스터마이징할 수 있습니다.

**현재는 기본 설정 사용 (문제없음)**

---

## 📋 3단계: Firebase Billing 플랜 확인

### 현재 플랜 확인

Firebase Console → 프로젝트 설정 (톱니바퀴) → 사용량 및 결제

**확인 사항:**
- [ ] 현재 플랜: **Spark (무료)** vs **Blaze (종량제)**

### Spark 플랜 (무료)의 제한사항

```
Firestore:
- 읽기: 일 50,000회
- 쓰기: 일 20,000회
- 삭제: 일 20,000회
- 저장공간: 1GB

Authentication:
- 무제한 (무료)

Cloud Functions:
- 사용 불가 (Blaze 플랜 필요)

외부 네트워크 요청:
- 제한적 (Google API만 가능)
```

### ⚠️ 현재 앱에서 문제될 수 있는 부분

**OpenAI API 호출**: Next.js API Routes에서 호출하므로 **문제없음**
**Tavily API 호출**: Next.js API Routes에서 호출하므로 **문제없음**

**결론**: **Spark 플랜으로도 당분간 운영 가능**

### Blaze 플랜으로 업그레이드가 필요한 경우

다음 기능을 추가할 때 필요:
- Cloud Functions (서버리스 함수)
- Firebase Storage (파일 업로드)
- 일 50,000회 이상의 Firestore 읽기

### ✅ Blaze 플랜 설정 방법

1. Firebase Console → 사용량 및 결제
2. **"Blaze 플랜으로 업그레이드"** 클릭
3. 결제 정보 입력 (신용카드)
4. **예산 알림 설정** (예: $10 초과 시 알림) ← 필수!

**무료 한도**:
```
Firestore:
- 읽기: 일 50,000회 (무료)
- 쓰기: 일 20,000회 (무료)
- 삭제: 일 20,000회 (무료)

초과 시 요금:
- 읽기: 10만 건당 $0.06
- 쓰기: 10만 건당 $0.18
- 삭제: 10만 건당 $0.02
```

**일반적으로 소규모 앱은 무료 한도 내에서 운영 가능합니다!**

---

## 📋 4단계: Firestore 인덱스 확인

### 인덱스란?

복잡한 쿼리를 빠르게 실행하기 위한 데이터베이스 색인

### 현재 앱에서 필요한 인덱스

Firebase Console → Firestore Database → 인덱스 탭

**자동 생성되는 인덱스:**
- 단일 필드 인덱스는 자동으로 생성됨

**수동 생성이 필요한 복합 인덱스:**

앱을 실행하다가 다음과 같은 에러가 나오면:

```
The query requires an index. You can create it here: https://console.firebase.google.com/...
```

해당 링크를 클릭하면 자동으로 인덱스 생성 페이지로 이동합니다.

**현재는 추가 작업 불필요 - 에러 발생 시 인덱스 생성하면 됩니다.**

---

## 📋 5단계: Firebase API 키 보안 설정

### Firebase API 키의 특징

Firebase API 키는 **공개되어도 괜찮습니다!**

이유:
- Firestore Security Rules로 보호됨
- 브라우저에서 사용되는 키 (클라이언트 키)
- Authentication Rules로 접근 제어

### 하지만 추가 보안이 필요하다면

Firebase Console → 프로젝트 설정 → 일반 탭 → 웹 API 키

**API 키 제한 설정 (선택사항):**

Google Cloud Console → API 및 서비스 → 사용자 인증 정보

1. Firebase 웹 API 키 선택
2. **"애플리케이션 제한사항"**:
   - HTTP 리퍼러 선택
   - 허용 도메인 추가:
     ```
     localhost:3000/*
     your-project.vercel.app/*
     your-custom-domain.com/*
     ```

3. **"API 제한사항"**:
   - API 선택
   - Firebase 관련 API만 활성화:
     - Identity Toolkit API
     - Token Service API
     - Cloud Firestore API

⚠️ **주의**: 이 설정은 선택사항이며, 잘못 설정하면 앱이 작동하지 않을 수 있습니다.

**권장**: 처음에는 제한 없이 사용하고, 서비스가 안정화된 후 추가 보안 설정 적용

---

## 📋 6단계: 환경 변수 재확인

### 로컬 .env.local 파일

**확인 사항:**
```bash
# OpenAI (필수)
OPENAI_API_KEY=sk-proj-...  ← 실제 키가 있는가?

# Tavily (선택, 검색 기능용)
TAVILY_API_KEY=tvly-...  ← 실제 키가 있는가?

# Firebase (7개 필수)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=forestecho-3514b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=forestecho-3514b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=forestecho-3514b.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Vercel 환경 변수

Vercel 배포 시 **정확히 동일한 환경 변수**를 입력해야 합니다!

**체크리스트:**
- [ ] OPENAI_API_KEY
- [ ] TAVILY_API_KEY (선택)
- [ ] NEXT_PUBLIC_FIREBASE_API_KEY
- [ ] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- [ ] NEXT_PUBLIC_FIREBASE_PROJECT_ID
- [ ] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- [ ] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- [ ] NEXT_PUBLIC_FIREBASE_APP_ID

---

## 📋 7단계: 비용 모니터링 설정

### A. Firebase 예산 알림

Firebase Console → 프로젝트 설정 → 사용량 및 결제

**설정 방법:**
1. **"예산 알림 관리"** 클릭
2. Google Cloud Console로 이동
3. **"예산 만들기"** 클릭
4. 예산 이름: `Firebase Monthly Budget`
5. 예산 금액: **$10/월** (권장)
6. 알림 설정:
   - 50% 사용 시: 이메일 알림
   - 90% 사용 시: 이메일 알림
   - 100% 초과 시: 이메일 알림

### B. OpenAI 사용량 제한

https://platform.openai.com/account/limits

**설정 방법:**
1. **"Usage limits"** 섹션
2. **"Set a monthly budget"** 클릭
3. 월 예산: **$50** (권장, 앱 규모에 따라 조정)
4. 예산 초과 시: API 호출 자동 차단

### C. 예상 비용 (참고용)

**사용자 100명/월 기준:**
```
Firebase:
- Firestore: 무료 한도 내 (예상 $0)
- Authentication: 무료 ($0)

OpenAI:
- GPT-4o-mini: 대화 1000회 기준
- 예상 비용: $5-15/월

Vercel:
- 취미 플랜: 무료 ($0)
- 프로 플랜: $20/월 (더 많은 기능)

총 예상 비용: $5-15/월 (소규모 사용자)
```

---

## 📋 8단계: 배포 후 즉시 해야 할 일

### Vercel 배포 완료 직후

1. **Vercel 도메인 확인**
   - 예: `https://forestecho.vercel.app`

2. **Firebase Authorized Domains 추가** (최우선!)
   - Firebase Console → Authentication → Settings → Authorized domains
   - **"Add domain"** 클릭
   - Vercel 도메인 입력: `forestecho.vercel.app`
   - 저장

3. **기능 테스트**
   - [ ] 회원가입 작동 확인
   - [ ] 로그인 작동 확인
   - [ ] 채팅 전송 확인
   - [ ] AI 응답 확인
   - [ ] 심리 분석 생성 확인
   - [ ] 데이터 저장 확인

4. **보안 테스트**
   - [ ] 다른 브라우저에서 다른 계정 생성
   - [ ] 첫 번째 계정의 데이터가 안 보이는지 확인
   - [ ] Firestore Console에서 데이터 확인

---

## 📋 9단계: 커스텀 도메인 연결 시 추가 작업

### Vercel에서 도메인 연결 후

1. **Firebase Authorized Domains 추가**
   - 커스텀 도메인도 추가 (예: `forestecho.com`)

2. **환경 변수 확인**
   - NEXT_PUBLIC_* 환경 변수는 빌드 시점에 주입됨
   - 도메인 변경 후 **Vercel에서 재배포** 필요

3. **SSL 인증서**
   - Vercel이 자동으로 발급 (Let's Encrypt)
   - 24시간 이내 활성화

4. **DNS 전파 대기**
   - 전 세계 DNS 서버에 전파: 24-48시간
   - https://www.whatsmydns.net/ 에서 확인 가능

---

## 🎯 최종 체크리스트

### 배포 전 필수 확인

- [ ] Firestore Rules가 프로덕션 모드로 설정됨
- [ ] Authentication Email/Password 활성화
- [ ] Authentication Google 로그인 활성화
- [ ] Firebase Billing 플랜 확인 (Spark 또는 Blaze)
- [ ] 예산 알림 설정 완료
- [ ] 환경 변수 8개 모두 준비됨
- [ ] .gitignore에 .env.local 포함 확인

### 배포 직후 필수 확인

- [ ] Vercel 도메인을 Firebase Authorized Domains에 추가
- [ ] 회원가입/로그인 테스트 통과
- [ ] 채팅 기능 테스트 통과
- [ ] 보안 테스트 통과 (다른 계정 데이터 접근 불가)

### 선택 사항

- [ ] Google Cloud Console에서 API 키 제한 설정
- [ ] Firebase App Check 설정 (봇 공격 방지)
- [ ] Google Analytics 연동
- [ ] SEO 최적화

---

## 🆘 문제 발생 시 대응

### "Permission Denied" 에러
→ Firestore Rules 확인, userId 일치 확인

### "auth/unauthorized-domain" 에러
→ Firebase Authorized Domains에 도메인 추가

### 로그인 후 데이터가 안 보임
→ Firestore Console에서 데이터 확인, userId 필드 확인

### API 비용이 갑자기 증가
→ Firebase Console, OpenAI Dashboard에서 사용량 확인
→ 의심스러운 활동 확인 후 API 키 재발급

---

## 📊 모니터링 대시보드

### 정기적으로 확인해야 할 곳

1. **Firebase Console**
   - Firestore 읽기/쓰기 횟수
   - Authentication 사용자 수
   - 사용량 및 결제

2. **Vercel Dashboard**
   - 배포 상태
   - 분석 (트래픽)
   - 로그 (에러)

3. **OpenAI Dashboard**
   - https://platform.openai.com/usage
   - API 호출 횟수
   - 비용 추이

---

## ✅ 완료!

모든 체크리스트를 완료하셨다면 **프로덕션 배포 준비 완료**입니다!

**다음 단계:**
1. Vercel에 배포
2. Firebase Authorized Domains에 Vercel 도메인 추가
3. 기능 테스트
4. 사용자 초대 및 피드백 수집

**행운을 빕니다! 🚀**
