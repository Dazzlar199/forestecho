# 관리자 시스템 설정 가이드

## 개요

MentalTouch 앱에는 관리자 전용 기능이 추가되었습니다:
- 사용자 문의/피드백/버그 제보 관리
- FAQ 생성 및 관리
- 통계 확인

## 관리자 계정 설정

### 1. 환경 변수 설정

`.env.local` 파일에서 관리자 이메일을 설정하세요:

```bash
# Admin Email (관리자 이메일 - 이 이메일로 로그인하면 관리자 권한)
NEXT_PUBLIC_ADMIN_EMAIL=your-admin-email@example.com
```

**중요**: `your-admin-email@example.com`을 실제 관리자 이메일로 변경하세요!

예시:
```bash
NEXT_PUBLIC_ADMIN_EMAIL=admin@forestecho.com
```

### 2. Vercel 환경 변수 설정

Vercel에 배포할 때도 동일한 환경 변수를 추가해야 합니다:

1. Vercel Dashboard → 프로젝트 선택
2. Settings → Environment Variables
3. 새 환경 변수 추가:
   - **Name**: `NEXT_PUBLIC_ADMIN_EMAIL`
   - **Value**: `your-admin-email@example.com` (실제 이메일로 변경)
   - **Environment**: Production, Preview, Development 모두 선택
4. Save 클릭
5. **Redeploy** (환경 변수는 다음 배포부터 적용됨)

### 3. Firebase에서 관리자 계정 생성

1. Firebase Console → Authentication → Users
2. "Add user" 클릭
3. **관리자 이메일**로 계정 생성
4. 비밀번호 설정

또는 앱에서 직접 회원가입:
1. 앱 접속 → 로그인/회원가입
2. **관리자 이메일**로 회원가입
3. 이메일 인증 (필요시)

---

## 관리자 기능 사용 방법

### 1. 관리자 대시보드 접근

관리자 계정으로 로그인 후:
1. URL: `https://your-domain.com/admin`
2. 또는 브라우저에서 직접 `/admin` 경로 입력

**보안**:
- 관리자 이메일이 아닌 계정으로 접근 시 자동으로 홈으로 리다이렉트됨
- 로그인하지 않은 상태로 접근 시 로그인 페이지로 이동

### 2. 문의 관리 (Inquiries)

**대시보드 → 문의 관리 탭**

#### 문의 종류:
- 문의 (Inquiry): 일반 질문
- 피드백 (Feedback): 서비스 개선 제안
- 버그 (Bug): 버그 제보

#### 문의 상태:
- **대기 (Pending)**: 새로운 문의
- **확인중 (In-progress)**: 검토 중
- **완료 (Resolved)**: 답변 완료
- **거절 (Rejected)**: 처리 불가

#### 문의 처리 방법:
1. 문의 목록에서 문의 확인
2. "답변하기" 버튼 클릭
3. 답변 작성 후 "답변 전송"
4. 자동으로 상태가 "완료"로 변경됨
5. 사용자 화면에서 답변 확인 가능

#### 상태 변경:
- 드롭다운 메뉴에서 상태 선택
- 즉시 Firestore에 저장됨

### 3. FAQ 관리

**대시보드 → FAQ 관리 탭**

#### FAQ 추가:
1. "새 FAQ 추가" 버튼 클릭
2. **카테고리** 입력 (예: 일반, 계정, 기능, 결제 등)
3. **질문** 입력
4. **답변** 입력 (줄바꿈 가능)
5. "추가하기" 클릭

#### FAQ 수정:
1. FAQ 카드에서 연필 아이콘(✏️) 클릭
2. 내용 수정
3. "수정하기" 클릭

#### FAQ 삭제:
1. FAQ 카드에서 휴지통 아이콘(🗑️) 클릭
2. 확인 팝업에서 "확인"

#### FAQ 순서:
- FAQ는 생성 순서대로 표시됨
- `order` 필드로 순서 관리 가능 (수동 조정 필요 시 Firestore에서 직접 수정)

### 4. 통계 확인

대시보드 상단에 주요 통계 표시:
- **총 사용자**: 가입한 사용자 수
- **총 문의**: 전체 문의 건수
- **대기중 문의**: 답변이 필요한 문의 건수
- **총 FAQ**: 등록된 FAQ 개수

---

## 사용자 화면

### 1. FAQ 페이지 (`/faq`)

모든 사용자가 접근 가능 (로그인 불필요)

**기능:**
- FAQ 검색
- 카테고리별 필터
- 질문 클릭 시 답변 펼치기/접기
- "문의하기" 링크 제공

### 2. 고객 지원 페이지 (`/support`)

로그인한 사용자만 접근 가능

**기능:**
- 문의/피드백/버그 제보 작성
- 본인이 작성한 문의 내역 확인
- 관리자 답변 확인
- 문의 상태 실시간 업데이트

#### 문의 작성 방법:
1. "새 문의 작성" 버튼 클릭
2. 문의 유형 선택 (문의/피드백/버그)
3. 제목과 내용 작성
4. "제출하기" 클릭

#### 문의 상태 확인:
- 대기중 (⏰): 관리자가 아직 확인하지 않음
- 확인중 (💬): 관리자가 확인 중
- 완료 (✅): 답변 완료
- 거절됨 (❌): 처리 불가

---

## Firestore 데이터 구조

### 1. inquiries 컬렉션

```typescript
{
  userId: string            // 작성자 UID
  userEmail: string         // 작성자 이메일
  type: 'inquiry' | 'feedback' | 'bug'
  title: string             // 제목
  content: string           // 내용
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected'
  createdAt: Timestamp      // 작성 시간
  adminReply?: string       // 관리자 답변 (옵션)
  repliedAt?: Timestamp     // 답변 시간 (옵션)
}
```

### 2. faqs 컬렉션

```typescript
{
  question: string          // 질문
  answer: string            // 답변
  category: string          // 카테고리
  order: number             // 정렬 순서
  createdAt: Timestamp      // 생성 시간
}
```

---

## 보안 규칙

### Firestore Rules

**inquiries**:
- 읽기: 본인이 작성한 문의만 (관리자는 앱에서 전체 조회)
- 생성: 로그인한 사용자만
- 수정: 본인만
- 삭제: 본인만

**faqs**:
- 읽기: 모두 가능 (로그인 불필요)
- 생성/수정/삭제: 로그인 필요 (관리자 여부는 앱에서 체크)

### 클라이언트 관리자 체크

```typescript
// app/admin/page.tsx
const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
if (user.email === adminEmail) {
  setIsAdmin(true)
} else {
  alert('관리자만 접근할 수 있습니다.')
  router.push('/')
}
```

**장점**:
- 간단한 구현
- 환경 변수로 쉽게 변경 가능
- 추가 Firebase 설정 불필요

**제한사항**:
- 한 명의 관리자만 지원 (여러 명 필요 시 쉼표로 구분하거나 Firestore에 관리자 목록 저장)
- 클라이언트 체크이므로 Firestore Rules에서는 추가 보호 없음 (읽기 권한은 여전히 본인 문의만)

---

## 문제 해결

### 관리자 페이지에 접근할 수 없어요

1. `.env.local`에 `NEXT_PUBLIC_ADMIN_EMAIL`이 설정되어 있는지 확인
2. 환경 변수 값이 실제 로그인한 이메일과 정확히 일치하는지 확인
3. 로컬 개발: 개발 서버 재시작 (`npm run dev`)
4. Vercel 배포: Redeploy 실행

### 문의가 보이지 않아요

1. Firestore Rules가 제대로 설정되었는지 확인
2. Firebase Console → Firestore Database에서 `inquiries` 컬렉션 확인
3. 브라우저 콘솔에서 에러 확인

### FAQ가 저장되지 않아요

1. Firestore Rules에서 `faqs` 컬렉션 규칙 확인
2. 관리자로 로그인했는지 확인
3. Firebase Console에서 `faqs` 컬렉션이 생성되었는지 확인

---

## 추가 개선 사항 (향후)

### 여러 관리자 지원

**옵션 1: 환경 변수 확장**
```bash
NEXT_PUBLIC_ADMIN_EMAILS=admin1@example.com,admin2@example.com,admin3@example.com
```

**옵션 2: Firestore 기반**
```typescript
// admins 컬렉션 생성
{
  email: "admin@example.com",
  role: "admin",
  permissions: ["inquiries", "faqs", "users"]
}
```

### 권한 세분화

- Super Admin: 모든 권한
- Support Admin: 문의 관리만
- Content Admin: FAQ 관리만

### 알림 기능

- 새 문의 등록 시 이메일 알림
- Slack/Discord 웹훅 연동
- 푸시 알림

### 통계 고도화

- 문의 유형별 통계
- 일별/주별/월별 그래프
- 평균 응답 시간
- 사용자 만족도

---

## 요약

1. `.env.local`에 `NEXT_PUBLIC_ADMIN_EMAIL` 설정
2. 해당 이메일로 Firebase 계정 생성
3. `/admin` 페이지 접근
4. 문의 답변 및 FAQ 관리
5. Vercel 배포 시 환경 변수 추가 필수!

**관리자 이메일을 안전하게 관리하세요. 이 이메일은 중요한 권한을 가집니다!**
