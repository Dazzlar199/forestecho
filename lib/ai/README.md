# AI Provider Abstraction Layer

통합된 AI Provider 시스템으로 OpenAI와 Gemini를 단일 인터페이스로 사용할 수 있습니다.

## 사용법

### 기본 사용

```typescript
import { getAIProvider } from '@/lib/ai'

// 사용자 구독 상태에 따라 자동으로 Provider 선택
const provider = getAIProvider(user.isPremium)

// 스트리밍 응답
await provider.streamCompletion({
  messages: [
    { role: 'system', content: '당신은 상담사입니다' },
    { role: 'user', content: '안녕하세요' }
  ],
  onToken: (token) => console.log(token),
  onComplete: (full) => console.log('완료:', full)
})

// 일반 응답
const response = await provider.getCompletion({
  messages: [...]
})
```

### 특정 Provider 사용

```typescript
import { getSpecificProvider } from '@/lib/ai'

const openai = getSpecificProvider('openai')
const gemini = getSpecificProvider('gemini')
```

## 아키텍처

```
lib/ai/
├── types.ts              # 공통 타입 정의
├── openai-provider.ts    # OpenAI 구현
├── gemini-provider.ts    # Gemini 구현
├── provider-factory.ts   # Provider 팩토리
└── index.ts              # 통합 export

lib/counseling/
├── prompts/              # 공통 프롬프트
│   ├── advanced.ts
│   ├── free-tier.ts
│   ├── enhanced.ts
│   ├── base.ts
│   └── index.ts
├── context-manager.ts    # 컨텍스트 관리
└── modes.ts              # 상담 모드
```

## Migration Guide

### Before (중복 코드)

```typescript
// OpenAI 사용 시
import { openai, OPENAI_CONFIG } from '@/lib/openai/config'
const stream = await openai.chat.completions.create({ ... })

// Gemini 사용 시
import { getGeminiModel } from '@/lib/gemini/config'
const model = getGeminiModel()
const result = await model.sendMessageStream(...)
```

### After (통합)

```typescript
import { getAIProvider } from '@/lib/ai'

const provider = getAIProvider(isPremium)
await provider.streamCompletion({
  messages: [...],
  onToken: (token) => { ... }
})
```

## Benefits

✅ **단일 인터페이스**: OpenAI와 Gemini를 동일한 방식으로 사용
✅ **코드 중복 제거**: 90% 중복 코드 제거
✅ **타입 안전성**: TypeScript로 완전한 타입 지원
✅ **확장성**: 새로운 Provider 추가 용이
✅ **테스트**: Mock Provider로 테스트 간소화

## Legacy Support

기존 코드와의 호환성을 위해 `lib/openai/config.ts`와 `lib/gemini/config.ts`는 deprecated 상태로 유지됩니다.

새로운 코드는 `lib/ai`를 사용하세요.
