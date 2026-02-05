# RAG 시스템 설정 가이드

숲울림의 RAG (Retrieval-Augmented Generation) 시스템은 전문적인 심리학 지식을 AI 상담에 통합합니다.

## 📋 개요

- **Vector DB**: Pinecone (무료 tier)
- **임베딩**: OpenAI text-embedding-3-small ($0.02/1M tokens)
- **지식 베이스**: CBT, DBT, 심리학 이론, 정신 건강 정보
- **적용 범위**: 유료 tier (Basic, Premium) 전용

## 🚀 설정 단계

### 1. Pinecone 계정 생성

1. https://www.pinecone.io/ 접속
2. 무료 계정 가입
3. API 키 생성 (`API Keys` 메뉴)

**무료 Tier 제한:**
- 1개 인덱스
- 100,000 벡터
- 2GB 스토리지
→ 충분히 사용 가능 (현재 지식: ~15개 항목)

### 2. 환경 변수 설정

`.env.local` 파일에 추가:

```bash
PINECONE_API_KEY=pcsk_xxxxxx_xxxxxxxxxxxxxxxx
PINECONE_INDEX_NAME=psychology-kb
```

### 3. 지식 베이스 시딩

```bash
npm run seed:kb
```

**시딩 프로세스:**
1. Pinecone 인덱스 생성 (없으면)
2. 모든 지식 항목 임베딩 생성
3. Pinecone에 업로드

⏱️ 예상 시간: 1-2분

### 4. 확인

```bash
# 시딩 성공 시 출력:
✅ Seeding complete!
📊 Total entries: 15
🎯 Index: psychology-kb
🚀 Knowledge base is ready for use!
```

## 📚 지식 베이스 구성

### CBT (Cognitive Behavioral Therapy)
- 인지적 왜곡 식별
- ABC 모델
- 행동 활성화

### DBT (Dialectical Behavior Therapy)
- 마음챙김
- 감정 조절
- 고통 감내

### 심리학 이론
- 애착 이론
- 자기결정 이론

### 정신 건강 정보
- 우울증
- 불안 장애

## 🔍 작동 방식

### 유료 Tier (Basic, Premium)

1. 사용자 질문 수신
2. 질문을 임베딩으로 변환
3. Pinecone에서 유사한 지식 검색 (Top 2, 유사도 75%+)
4. 검색된 지식을 LLM 프롬프트에 추가
5. 전문적인 답변 생성

### 무료 Tier (Guest, Free)

- RAG 사용 안 함 (비용 절약)
- Tavily 웹 검색 fallback

## 💰 비용 예측

### 임베딩 비용
- 모델: text-embedding-3-small
- 가격: $0.02 / 1M tokens
- 예상 사용량:
  - 1,000명 × 20회/일 × 30일 = 600,000회
  - 평균 50 토큰/질문 = 30M 토큰
  - **월 비용: $0.60 (약 ₩800)**

### Pinecone 비용
- 무료 tier: $0/월
- (10만 벡터 이내)

### 총 RAG 비용
- **월 ₩800** (1,000 유료 사용자 기준)

## 🔧 지식 추가하기

`lib/rag/knowledge-base.ts` 편집:

```typescript
export const CBT_KNOWLEDGE: KnowledgeEntry[] = [
  // 기존 항목들...
  {
    id: 'cbt-004',
    title: '새로운 CBT 기법',
    namespace: 'cbt-techniques',
    content: `
      기법 설명...
    `,
    metadata: { category: 'new-technique' }
  },
]
```

재시딩:
```bash
npm run seed:kb
```

## 🐛 트러블슈팅

### "Failed to generate embedding"
- OpenAI API 키 확인
- 네트워크 연결 확인
- Rate limit 초과 여부 확인

### "Pinecone index not found"
- `PINECONE_INDEX_NAME` 환경변수 확인
- 시딩 완료 여부 확인 (60초 대기 필요)

### RAG 결과 없음 (빈 문자열)
- 정상 동작 (유사도 75% 미만일 경우)
- Graceful degradation: Tavily fallback 작동

## 📊 모니터링

### Pinecone 대시보드
- https://app.pinecone.io
- 쿼리 수, 저장 용량 확인

### OpenAI 대시보드
- https://platform.openai.com/usage
- 임베딩 비용 추적

## 🎯 최적화 팁

1. **유사도 임계값 조정**
   - 현재: 0.75
   - 올리면: 더 정확하지만 적게 매칭
   - 내리면: 더 많이 매칭하지만 관련성↓

2. **Top K 조정**
   - 현재: 2개
   - 늘리면: 더 많은 컨텍스트, 더 긴 프롬프트
   - 줄이면: 빠르지만 정보↓

3. **네임스페이스 필터링**
   ```typescript
   await searchKnowledge(query, {
     namespace: 'cbt-techniques' // CBT만 검색
   })
   ```

## 🚀 프로덕션 체크리스트

- [ ] Pinecone API 키 Vercel 환경변수 설정
- [ ] OpenAI API 키 Vercel 환경변수 설정
- [ ] 지식 베이스 시딩 완료
- [ ] 테스트 쿼리 실행 (예: "불안할 때 어떻게 해야 하나요?")
- [ ] RAG 비용 모니터링 설정
- [ ] Graceful degradation 테스트 (Pinecone 장애 시)

---

**문의**: RAG 시스템 관련 문제는 로그를 확인하세요 (`console.error` 출력)
