# 🚀 Vercel 배포 가이드

## ✅ Git 업로드 완료!
- GitHub 저장소: https://github.com/Dazzlar199/forestecho
- .env.local 파일 보호됨 ✓
- 96개 파일 커밋 완료 ✓

## 🌐 Vercel 웹 배포 (추천)

### 1. Vercel 가입
1. https://vercel.com 접속
2. "Sign Up" 클릭
3. "Continue with GitHub" 선택
4. GitHub 로그인

### 2. 프로젝트 Import
1. Vercel 대시보드에서 "Add New..." → "Project"
2. "forestecho" 저장소 찾기
3. "Import" 클릭

### 3. 환경 변수 설정 ⚠️

**필수 환경 변수** (로컬의 .env.local에서 복사):

```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Tavily (선택사항)
TAVILY_API_KEY=tvly-...

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123...

# AdSense (선택사항)
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-...
```

### 4. 배포 시작
- "Deploy" 버튼 클릭
- 2-3분 대기
- 배포 완료! 🎉

### 5. 배포 URL 확인
- `https://your-project.vercel.app` 형태로 생성됨
- 바로 접속 가능!

---

## 💻 CLI 배포 (대안)

### 설치
```bash
npm install -g vercel
```

### 로그인
```bash
vercel login
```

### 배포
```bash
# 테스트 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 환경 변수 추가 (CLI)
```bash
vercel env add OPENAI_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# ... 나머지 환경 변수
```

---

## 🔐 보안 체크리스트

✅ .env.local 파일이 GitHub에 업로드되지 않음
✅ .gitignore에 환경 변수 파일 제외됨
✅ .env.local.example만 공개됨 (API 키 없음)
✅ 보안 헤더 설정됨 (next.config.js)

---

## 📱 배포 후 확인 사항

1. **홈페이지 로딩**: https://your-project.vercel.app
2. **회원가입/로그인** 작동 확인
3. **채팅 기능** 정상 작동
4. **심리 분석** 생성 확인
5. **모바일 반응형** 확인 (개발자 도구)

---

## 🔄 자동 배포 설정

Vercel은 이제 GitHub과 연결되어 있습니다!

- `git push` → 자동으로 배포됨
- Pull Request → 미리보기 URL 생성
- main 브랜치 → 프로덕션 배포

---

## 🌐 커스텀 도메인 연결 (선택)

1. Vercel 대시보드에서 "Domains" 탭
2. "Add Domain" 클릭
3. 도메인 입력 (예: forestecho.com)
4. DNS 설정 지침 따라하기
5. SSL 자동 발급됨

---

## 💡 유용한 명령어

```bash
# 현재 배포 상태 확인
vercel ls

# 로그 확인
vercel logs

# 환경 변수 목록
vercel env ls

# 배포 취소 (롤백)
vercel rollback
```

---

## ❓ 문제 해결

### 빌드 실패
- Vercel 대시보드에서 "Deployment" → "View Build Logs"
- 로컬에서 `npm run build` 테스트

### 환경 변수 오류
- Vercel 대시보드 → "Settings" → "Environment Variables"
- 모든 변수가 설정되었는지 확인
- 변수 수정 후 "Redeploy" 필요

### Firebase 연결 오류
- Firebase 콘솔에서 도메인 추가
- Authentication → Settings → Authorized domains
- Vercel 도메인 추가 (예: your-project.vercel.app)

---

## 📞 도움이 필요하면

- Vercel 문서: https://vercel.com/docs
- Discord: https://vercel.com/discord
- GitHub Issues: https://github.com/Dazzlar199/forestecho/issues

---

**축하합니다! 🎉 배포 준비가 완료되었습니다!**
