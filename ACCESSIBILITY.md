# 접근성 가이드

ForestEcho는 모든 사용자가 서비스를 이용할 수 있도록 웹 접근성(Web Accessibility)을 준수합니다.

## 구현된 접근성 기능

### 1. ARIA 속성

#### 모달 (Dialogs)
- `role="dialog"` - 모달 다이얼로그 식별
- `aria-modal="true"` - 모달 상태 표시
- `aria-labelledby` - 모달 제목 연결
- `aria-describedby` - 모달 설명 연결

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">제목</h2>
  <p id="modal-description">설명</p>
</div>
```

#### 버튼
- `aria-label` - 아이콘 버튼의 목적 설명
- `aria-pressed` - 토글 버튼 상태
- `aria-expanded` - 확장/축소 버튼 상태

```tsx
<button aria-label="메뉴 열기" aria-expanded={isOpen}>
  <Menu />
</button>
```

#### 폼 요소
- 모든 input에 연결된 `<label>` 또는 `aria-label`
- `aria-describedby` - 도움말 텍스트 연결
- `aria-invalid` - 유효성 검사 실패 표시
- `aria-errormessage` - 오류 메시지 연결

### 2. 키보드 내비게이션

#### 모달
- **Tab**: 다음 포커스 가능한 요소로 이동
- **Shift + Tab**: 이전 포커스 가능한 요소로 이동
- **Escape**: 모달 닫기
- 포커스 트랩 - 모달 내부에서만 포커스 이동

#### 네비게이션
- **Tab**: 메뉴 항목 간 이동
- **Enter** / **Space**: 링크 활성화
- **Arrow Keys**: 드롭다운 메뉴 탐색

### 3. 스크린 리더 지원

#### SR-Only 클래스
화면에는 보이지 않지만 스크린 리더에서 읽히는 텍스트:

```tsx
<span className="sr-only">로그인</span>
<User className="w-5 h-5" aria-hidden="true" />
```

#### ARIA Live Regions
동적 콘텐츠 변경 알림:

```tsx
<div role="status" aria-live="polite" aria-atomic="true">
  메시지가 전송되었습니다
</div>
```

### 4. 시맨틱 HTML

- `<header>`, `<nav>`, `<main>`, `<footer>` - 페이지 구조
- `<article>`, `<section>` - 콘텐츠 구조
- `<button>` vs `<a>` - 올바른 요소 사용
  - 버튼: 페이지 내 동작 (`onClick`)
  - 링크: 페이지 이동 (`href`)

### 5. 포커스 관리

- 모달 열릴 때: 첫 번째 포커스 가능 요소로 자동 포커스
- 모달 닫힐 때: 이전 포커스 위치로 복귀
- 스킵 링크: 메인 콘텐츠로 바로 이동

```tsx
<a href="#main-content" className="sr-only-focusable">
  메인 콘텐츠로 건너뛰기
</a>
```

## 접근성 훅 (Custom Hooks)

### useFocusTrap
모달 내에서만 포커스가 순환하도록 제한

```tsx
import { useFocusTrap } from '@/lib/hooks/useAccessibility'

const modalRef = useRef<HTMLDivElement>(null)
useFocusTrap(isOpen, modalRef)
```

### useEscapeKey
Escape 키로 모달 닫기

```tsx
import { useEscapeKey } from '@/lib/hooks/useAccessibility'

useEscapeKey(isOpen, onClose)
```

### useScrollLock
모달이 열릴 때 배경 스크롤 차단

```tsx
import { useScrollLock } from '@/lib/hooks/useAccessibility'

useScrollLock(isOpen)
```

### useFocusRestore
모달 닫힐 때 이전 포커스 위치로 복귀

```tsx
import { useFocusRestore } from '@/lib/hooks/useAccessibility'

useFocusRestore(isOpen)
```

## 컴포넌트 사용 예시

### AccessibleModal
접근성이 내장된 모달 컴포넌트:

```tsx
import AccessibleModal from '@/components/common/AccessibleModal'

<AccessibleModal
  isOpen={isOpen}
  onClose={onClose}
  title="설정"
>
  <div className="p-6">
    모달 콘텐츠
  </div>
</AccessibleModal>
```

### CrisisModal
긴급 도움 모달 (완전한 접근성 구현):

```tsx
import CrisisModal from '@/components/crisis/CrisisModal'

<CrisisModal isOpen={showCrisis} onClose={() => setShowCrisis(false)} />
```

## 테스트 도구

### 자동화 테스트
- **axe DevTools**: Chrome/Firefox 확장 프로그램
- **Lighthouse**: Chrome DevTools 내장
- **WAVE**: 웹 접근성 평가 도구

### 수동 테스트
1. **키보드만으로 탐색** - Tab, Enter, Escape만 사용
2. **스크린 리더 테스트**
   - macOS: VoiceOver (Cmd + F5)
   - Windows: NVDA (무료)
3. **확대/축소** - 200%까지 확대 시 레이아웃 유지
4. **색상 대비** - WCAG AA 기준 (4.5:1)

## WCAG 2.1 준수 레벨

현재 구현: **Level A** (부분적 AA)

### Level A (필수)
- ✅ 키보드 접근 가능
- ✅ 텍스트 대안 제공
- ✅ 시맨틱 마크업
- ✅ 포커스 표시

### Level AA (목표)
- ✅ 색상 대비 4.5:1
- ⏳ 자막/대본 (오디오 콘텐츠)
- ✅ 오류 식별 및 제안
- ⏳ 다중 입력 방식

## 개선 계획

### 단기 (1개월)
- [ ] 모든 폼 요소에 명확한 레이블
- [ ] 모든 아이콘 버튼에 aria-label
- [ ] 에러 메시지에 aria-live

### 중기 (3개월)
- [ ] 다국어 스크린 리더 지원
- [ ] 키보드 단축키 가이드
- [ ] 고대비 모드 지원

### 장기 (6개월)
- [ ] WCAG 2.1 AA 완전 준수
- [ ] 자동화된 접근성 테스트 CI/CD 통합
- [ ] 접근성 문서 완성

## 참고 자료

- [WCAG 2.1 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)
- [한국 웹 접근성 연구소](http://www.wah.or.kr/)

## 문의

접근성 관련 문제 발견 시:
- GitHub Issues에 [A11Y] 태그로 제보
- support@forestecho.app으로 이메일
