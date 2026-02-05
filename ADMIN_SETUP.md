# 관리자 설정 가이드

## 방법 1: 환경 변수 (간단, 권장)

### 1. `.env.local` 파일에 관리자 이메일 추가

```bash
ADMIN_EMAIL=your-admin@example.com
```

**중요**: `NEXT_PUBLIC_` 접두사를 사용하지 마세요. 서버 사이드 전용입니다.

### 2. Vercel 배포 시 환경 변수 설정

Vercel Dashboard → Settings → Environment Variables

```
Key: ADMIN_EMAIL
Value: your-admin@example.com
Environment: Production, Preview, Development
```

### 3. 재배포

```bash
vercel --prod
```

---

## 방법 2: Firebase Custom Claims (고급, 더 안전)

### 1. Firebase CLI 설치

```bash
npm install -g firebase-tools
firebase login
```

### 2. Admin 권한 부여 스크립트 실행

Firebase Console → Authentication → Users에서 UID 복사

```bash
# Firebase Functions에서 실행
firebase functions:shell

# 함수 내에서 실행
const admin = require('firebase-admin');
await admin.auth().setCustomUserClaims('USER_UID_HERE', { admin: true });
```

또는 Node.js 스크립트:

```javascript
// scripts/set-admin.js
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setAdmin(email) {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  console.log(`✓ ${email}에게 관리자 권한이 부여되었습니다.`);
}

setAdmin('your-admin@example.com');
```

```bash
node scripts/set-admin.js
```

### 3. 사용자는 재로그인 필요

Custom Claims는 토큰에 저장되므로, 사용자가 로그아웃 후 다시 로그인해야 적용됩니다.

---

## 보안 체크리스트

✅ `ADMIN_EMAIL`은 절대 `NEXT_PUBLIC_` 접두사를 사용하지 않음
✅ `.env.local` 파일은 `.gitignore`에 포함됨
✅ Vercel 환경 변수는 Production에만 설정됨
✅ 관리자 체크는 서버 사이드 API(`/api/admin/check`)에서만 이루어짐
✅ Firebase ID Token 검증을 통해 토큰 위조 방지

---

## 테스트

1. 관리자 이메일로 로그인
2. `/admin` 페이지 접근
3. 문의 및 FAQ 관리 기능 확인
4. 다른 이메일로 로그인 시 접근 차단 확인
