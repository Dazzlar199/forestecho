# MentalTouch 배포 가이드

## 📋 배포 전 체크리스트

### ✅ 완료된 최적화 작업
- [x] TypeScript 타입 에러 수정
- [x] 프로덕션 빌드 테스트 완료
- [x] 불필요한 console.log 제거
- [x] 보안 헤더 설정 (next.config.js)
- [x] 미사용 의존성 제거 (@heroicons/react)
- [x] 환경 변수 문서화 (.env.local.example)
- [x] Hydration 에러 수정

## 🚀 배포 방법

### 1. Vercel 배포 (권장)

#### 사전 준비
```bash
npm install -g vercel
```

#### 배포 단계
1. **프로젝트 연결**
   ```bash
   vercel
   ```

2. **환경 변수 설정**
   Vercel 대시보드에서 다음 환경 변수를 설정:
   - `OPENAI_API_KEY`
   - `TAVILY_API_KEY` (선택사항)
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_ADSENSE_CLIENT_ID` (선택사항)

3. **프로덕션 배포**
   ```bash
   vercel --prod
   ```

### 2. Firebase Hosting 배포

#### 사전 준비
```bash
npm install -g firebase-tools
firebase login
```

#### 배포 단계
1. **빌드**
   ```bash
   npm run build
   ```

2. **Firebase 초기화**
   ```bash
   firebase init hosting
   ```

3. **배포**
   ```bash
   firebase deploy --only hosting
   ```

## 🔐 보안 설정

### Firebase Security Rules
Firestore 규칙 설정 (Firebase Console):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 채팅 세션
    match /chatSessions/{sessionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }

    // 심리 분석
    match /psychologicalAnalyses/{analysisId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

### 환경 변수 보안
- ⚠️ `.env.local` 파일은 절대 Git에 커밋하지 마세요
- ✅ `.env.local.example` 파일을 참고하여 필요한 환경 변수 설정
- ✅ 프로덕션 환경에서는 플랫폼의 환경 변수 설정 기능 사용

## 📊 성능 모니터링

### 빌드 크기 확인
```bash
npm run build
```

### 추천 성능 최적화
1. **이미지 최적화**: Next.js Image 컴포넌트 사용
2. **코드 스플리팅**: 자동으로 처리됨 (Next.js)
3. **캐싱 전략**:
   - Static 페이지: 자동 CDN 캐싱
   - Dynamic 페이지: ISR (Incremental Static Regeneration) 고려

## 🐛 배포 후 확인 사항

### 필수 체크
- [ ] 홈페이지 로딩 확인
- [ ] Firebase 인증 작동 확인
- [ ] 채팅 기능 정상 작동
- [ ] 분석 생성 및 저장 확인
- [ ] 모바일 반응형 확인
- [ ] 보안 헤더 적용 확인 (개발자 도구 Network 탭)

### 테스트 URL
- 사용자 플로우 테스트
  1. 회원가입/로그인
  2. 채팅 대화
  3. 심리 분석 생성
  4. 나의 숲 페이지 확인
  5. 온보딩 튜토리얼 확인

## 📱 모바일 최적화

- ✅ 반응형 디자인 적용됨
- ✅ 터치 친화적 UI (최소 44px 버튼)
- ✅ iOS 자동 줌 방지 (16px 폰트)
- ✅ PWA 준비 완료 (향후 추가 가능)

## 🔄 CI/CD 설정 (선택사항)

### GitHub Actions 예시
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
```

## 📞 지원

문제 발생 시:
1. 빌드 로그 확인
2. 브라우저 콘솔 확인
3. Firebase Console에서 에러 로그 확인
4. Vercel Dashboard에서 배포 로그 확인

## 🎉 배포 완료!

배포가 완료되면:
- 사용자에게 URL 공유
- Google Analytics 설정 (선택사항)
- 피드백 수집 채널 오픈
