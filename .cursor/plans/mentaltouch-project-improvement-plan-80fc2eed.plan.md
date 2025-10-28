<!-- 80fc2eed-24fb-493a-aae5-ebe0b0cc6ede abe91211-6e05-4592-867d-4099c6724282 -->
# 멘탈터치 프로젝트 개선 계획

## 🎯 목표

이 계획의 주요 목표는 다음과 같습니다.

1.  **실행 가능한 상태 복원**: 현재 프로젝트 실행을 막는 치명적인 오류들을 해결합니다.
2.  **핵심 기능 안정성 확보**: 주요 기능의 버그를 수정하고 안정적인 사용자 경험을 제공합니다.
3.  **코드 품질 및 확장성 기반 마련**: 테스트, 코드 스타일, 아키텍처를 개선하여 유지보수성과 확장성을 높입니다.

---

## 📋 개선 로드맵

### 🚀 1단계: 긴급 안정화 (P0 - 가장 시급)

> 먼저 프로젝트를 정상적으로 실행하고 핵심 기능이 동작하도록 만드는 데 집중합니다.

**1. 환경 변수 설정 (`.env`):**

- 모든 필수 API 키(Firebase, OpenAI, **Tavily**)가 포함된 `.env.local.example` 파일을 생성합니다.
- 개발자가 프로젝트를 처음 설정할 때 어떤 키가 필요한지 명확히 알 수 있도록 합니다.

**2. 타입 정의 통일:**

- 여러 곳에 중복으로 정의된 `Message` 타입을 `types/chat.ts` 파일의 정의로 통합합니다.
- 타입 불일치로 인한 잠재적 버그를 원천 차단합니다.

**3. Firebase 함수 오류 수정:**

- `lib/firebase/chat-sessions.ts` 파일의 함수들이 `ChatInterface.tsx`에서 올바르게 호출되도록 경로와 함수 시그니처를 수정합니다.
- 채팅 내역이 정상적으로 저장되고 복원되도록 합니다.

### 🛠️ 2단계: 핵심 기능 개선 (P1 - 중요)

> 애플리케이션의 안정성과 사용자 경험을 직접적으로 향상시킵니다.

**4. 테스트 코드 도입:**

- `Jest`와 `React Testing Library`를 설정합니다.
- 가장 중요한 `ChatInterface.tsx`, `AuthProvider.tsx` 컴포넌트에 대한 기본 단위/통합 테스트를 작성하여 코드 변경에 대한 안정성을 확보합니다.

**5. 사용자 친화적 에러 처리:**

- API 요청 실패 시 `alert()` 대신, 채팅창 내에 "메시지 전송에 실패했습니다. 잠시 후 다시 시도해주세요."와 같은 사용자 친화적인 UI 피드백을 표시하도록 개선합니다.

**6. BGM 오디오 파일 최적화:**

- `/public/music` 폴더의 대용량 `.wav` 파일들을 `.mp3` 형식으로 변환합니다.
- 페이지 초기 로딩 속도를 개선하고 사용자 데이터 사용량을 줄입니다.

### ✨ 3단계: 코드 품질 및 UX 향상 (P2 - 권장)

> 장기적인 유지보수성과 프로젝트의 완성도를 높입니다.

**7. 전역 상태 관리 도입:**

- `Zustand` 같은 경량 상태 관리 라이브러리를 도입하여 채팅 관련 상태(메시지 목록, 로딩 상태 등)를 관리합니다.
- `useState`와 `prop drilling`을 줄여 코드 구조를 단순화합니다.

**8. 코드 스타일 일관성 확보:**

- `Prettier`와 `ESLint` 설정을 강화하고, 모든 파일에 일괄 적용하여 코드 스타일을 통일합니다.

**9. 불필요한 코드 제거:**

- 구현되지 않은 `assessment`, `checkin` 등 관련 페이지와 컴포넌트를 분석하여 사용되지 않는 코드를 정리합니다.

---

이 계획에 따라 진행하시겠습니까? 동의하시면 가장 시급한 **1단계: 긴급 안정화** 작업부터 시작하겠습니다.

### To-dos

- [ ] Create `.env.local.example` file and document all required API keys (including the missing Tavily key).
- [ ] Consolidate duplicate `Message` type definitions into a single source of truth in `types/chat.ts`.
- [ ] Correct the Firebase function paths and signatures in `ChatInterface.tsx` to align with `lib/firebase/chat-sessions.ts`.
- [ ] Set up Jest and React Testing Library, and write initial tests for `ChatInterface.tsx` and `AuthProvider.tsx`.
- [ ] Replace `alert()` with user-friendly error components within the chat UI for better feedback.
- [ ] Convert large WAV audio files in `/public/music` to the more efficient MP3 format.
- [ ] Implement a global state manager (e.g., Zustand) to handle chat state, reducing prop drilling.