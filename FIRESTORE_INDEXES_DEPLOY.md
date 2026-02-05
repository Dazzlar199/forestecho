# Firestore 인덱스 배포 가이드

`firestore.indexes.json` 파일이 업데이트되었습니다. 다음 단계로 Firebase에 배포하세요.

---

## 방법 1: Firebase CLI로 배포 (권장)

### 1. Firebase CLI 로그인

```bash
firebase login
```

### 2. 프로젝트 확인

```bash
firebase projects:list
```

### 3. 인덱스 배포

```bash
firebase deploy --only firestore:indexes
```

또는 규칙과 함께 배포:

```bash
firebase deploy --only firestore
```

### 4. 배포 확인

Firebase Console → Firestore Database → Indexes 탭에서 확인

---

## 방법 2: Firebase Console에서 수동 생성

### 1. Firebase Console 접속

https://console.firebase.google.com/

### 2. Firestore Database → Indexes 탭

### 3. "Add Index" 클릭하여 다음 인덱스 생성

#### chatSessions
- Collection: `chatSessions`
- Fields:
  - `userId` (Ascending)
  - `updatedAt` (Descending)
- Query Scope: Collection

#### inquiries
- Collection: `inquiries`
- Fields:
  - `userId` (Ascending)
  - `createdAt` (Descending)
- Query Scope: Collection

#### psychologicalAnalyses
- Collection: `psychologicalAnalyses`
- Fields:
  - `userId` (Ascending)
  - `generatedAt` (Descending)
- Query Scope: Collection

#### posts
- Collection: `posts`
- Fields:
  - `timestamp` (Descending)
- Query Scope: Collection

#### comments
- Collection: `comments`
- Fields:
  - `timestamp` (Ascending)
- Query Scope: Collection Group

#### faqs
- Collection: `faqs`
- Fields:
  - `order` (Ascending)
- Query Scope: Collection

#### emotionSnapshots
- Collection: `emotionSnapshots`
- Fields:
  - `userId` (Ascending)
  - `timestamp` (Descending)
- Query Scope: Collection

#### emotions
- Collection: `emotions`
- Fields:
  - `userId` (Ascending)
  - `timestamp` (Descending)
- Query Scope: Collection

#### checkins
- Collection: `checkins`
- Fields:
  - `userId` (Ascending)
  - `date` (Descending)
- Query Scope: Collection

---

## 인덱스 생성 상태 확인

### CLI에서 확인

```bash
firebase firestore:indexes
```

### Console에서 확인

Firebase Console → Firestore Database → Indexes

- **Building**: 생성 중 (데이터 많으면 몇 분 소요)
- **Enabled**: 완료

---

## 인덱스가 필요한 이유

Firestore는 복합 쿼리(where + orderBy, 여러 where 조건 등)에 인덱스가 필수입니다.

### 인덱스 없이 쿼리 실행 시 에러:

```
FirebaseError: The query requires an index.
You can create it here: https://console.firebase.google.com/...
```

### 인덱스 있으면:

✅ 빠른 쿼리 성능
✅ 대량 데이터에서도 안정적
✅ 사용자 경험 개선

---

## 주의사항

1. **인덱스 생성 시간**: 데이터가 많으면 몇 분~몇 시간 소요
2. **인덱스 크기**: 스토리지 비용 증가 (미미함)
3. **자동 인덱스**: 단일 필드 쿼리는 자동 인덱스 사용

---

## 문제 해결

### Permission Denied

```bash
firebase login --reauth
```

### Project Not Found

`.firebaserc` 파일에서 프로젝트 ID 확인:

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### 인덱스 생성 실패

Firebase Console에서 수동으로 생성하거나, 에러 메시지에 포함된 링크를 클릭하여 자동 생성

---

## 참고

- [Firestore Indexes](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Index Best Practices](https://firebase.google.com/docs/firestore/query-data/index-overview)
