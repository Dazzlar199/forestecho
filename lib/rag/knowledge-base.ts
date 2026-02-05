/**
 * Psychology Knowledge Base
 *
 * Professional psychology knowledge for RAG system
 */

import type { Namespace } from './pinecone-config'

export interface KnowledgeEntry {
  id: string
  title: string
  content: string
  namespace: Namespace
  metadata?: Record<string, any>
}

/**
 * CBT (Cognitive Behavioral Therapy) Techniques
 */
export const CBT_KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: 'cbt-001',
    title: '인지적 왜곡 식별하기',
    namespace: 'cbt-techniques',
    content: `
인지적 왜곡(Cognitive Distortions)은 현실을 부정확하게 해석하는 사고 패턴입니다.

주요 인지적 왜곡 유형:
1. 흑백논리(All-or-Nothing Thinking): "완벽하지 않으면 실패다"
2. 과잉일반화(Overgeneralization): 한 번의 부정적 사건을 영원한 패턴으로 봄
3. 정신적 여과(Mental Filter): 긍정적인 면은 무시하고 부정적인 면만 집중
4. 긍정 무시(Disqualifying the Positive): 좋은 일이 있어도 "운이 좋았을 뿐"
5. 성급한 결론(Jumping to Conclusions): 충분한 증거 없이 결론 내림
6. 확대/축소(Magnification/Minimization): 실수는 크게, 성공은 작게 봄
7. 감정적 추론(Emotional Reasoning): "느낌이 그러니까 사실이다"
8. 당위적 사고(Should Statements): "~해야 한다"는 경직된 규칙
9. 낙인찍기(Labeling): "나는 패배자야"처럼 자신에게 부정적 꼬리표
10. 개인화(Personalization): 모든 부정적 일을 자신의 탓으로 돌림

치료적 개입:
- 사고 기록지를 통해 패턴 인식
- 증거 찾기: "이 생각을 뒷받침하는 증거는?"
- 대안적 해석 찾기
- 균형잡힌 사고로 재구성
    `,
    metadata: { category: 'cognitive-distortions', difficulty: 'beginner' }
  },
  {
    id: 'cbt-002',
    title: 'ABC 모델 (사건-믿음-결과)',
    namespace: 'cbt-techniques',
    content: `
ABC 모델은 CBT의 핵심 개념으로, 사건 자체가 아니라 그에 대한 믿음이 감정을 만든다는 이론입니다.

A (Activating Event): 촉발 사건
- 실제 발생한 객관적 사건

B (Belief): 믿음/해석
- 사건에 대한 주관적 해석과 신념
- 비합리적 믿음 vs 합리적 믿음

C (Consequence): 결과
- 감정적 결과 (불안, 우울, 분노 등)
- 행동적 결과 (회피, 공격, 위축 등)

예시:
A: 상사가 내 보고서에 피드백을 주지 않았다
B (비합리적): "내가 무능해서 상사가 실망했나봐"
C: 불안, 자신감 저하, 회피

D (Dispute): 반박하기
- "정말 그런가? 다른 해석은 없나?"
- "상사가 바빴을 수도 있다"
- "피드백이 없다는 건 큰 문제가 없다는 뜻일 수도"

E (Effect): 효과
- 더 합리적이고 균형잡힌 믿음
- 감정과 행동의 긍정적 변화

실습 방법:
1. 불편한 감정을 느낀 상황 기록
2. 그 순간 떠올랐던 생각 적기
3. 그 생각이 합리적인지 검토
4. 대안적 해석 만들기
5. 감정 변화 관찰
    `,
    metadata: { category: 'abc-model', difficulty: 'beginner' }
  },
  {
    id: 'cbt-003',
    title: '행동 활성화 (Behavioral Activation)',
    namespace: 'cbt-techniques',
    content: `
행동 활성화는 우울증 치료에 효과적인 기법으로, 기분이 좋아질 때까지 기다리지 않고 먼저 행동하는 것입니다.

핵심 원리:
- 우울할 때는 활동이 줄어들고, 이것이 우울을 더 악화시킴
- "기분 → 행동" 아니라 "행동 → 기분" 순서로 접근
- 작은 성취감이 쌓여 동기를 회복

단계별 실행:
1. 활동 모니터링
   - 일주일 동안 시간대별 활동 기록
   - 각 활동 후 기분 점수 (1-10점)

2. 활동 분석
   - 기분이 좋아지는 활동 vs 나빠지는 활동
   - 즐거움을 주는 활동 vs 성취감을 주는 활동

3. 활동 계획
   - 즐거운 활동: 취미, 사교, 휴식
   - 성취 활동: 청소, 운동, 과제 완료
   - 구체적 시간과 장소 정하기

4. 실행 및 평가
   - 계획대로 실행 (기분과 상관없이)
   - 실행 후 기분 변화 기록
   - 점진적으로 난이도 높이기

장애물 극복:
- "기분이 안 나는데" → "기분이 나빠도 5분만 해보자"
- "의미없어" → "의미는 나중에 생긴다"
- "피곤해" → "가장 쉬운 것부터 시작"

권장 활동 예시:
- 산책 10분
- 친구에게 문자 보내기
- 좋아하는 음악 듣기
- 설거지 하나만 하기
- 샤워하기
    `,
    metadata: { category: 'behavioral-activation', difficulty: 'beginner', indication: 'depression' }
  },
]

/**
 * DBT (Dialectical Behavior Therapy) Techniques
 */
export const DBT_KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: 'dbt-001',
    title: '마음챙김 (Mindfulness)',
    namespace: 'dbt-techniques',
    content: `
마음챙김은 DBT의 핵심 기술로, 현재 순간에 판단 없이 주의를 기울이는 것입니다.

What Skills (무엇 기술):
1. 관찰하기 (Observe)
   - 생각, 감정, 감각을 알아차리기
   - 판단하지 않고 있는 그대로 보기
   - 예: "지금 불안을 느끼고 있구나"

2. 기술하기 (Describe)
   - 관찰한 것을 말로 표현하기
   - 사실과 해석 구분하기
   - 예: "심장이 빨리 뛴다" (사실) vs "나는 약해" (해석)

3. 참여하기 (Participate)
   - 현재 활동에 완전히 몰입하기
   - 자의식 없이 행동하기

How Skills (어떻게 기술):
1. 비판단적으로 (Non-judgmentally)
   - "좋다/나쁘다" 평가 멈추기
   - 있는 그대로 받아들이기

2. 한 가지에 집중 (One-mindfully)
   - 멀티태스킹 하지 않기
   - 현재 순간에만 집중

3. 효과적으로 (Effectively)
   - "옳다"보다 "효과적인지"에 집중
   - 목표 달성에 도움되는 행동

마음챙김 실습:
- 5-4-3-2-1 접지 기법
  5개 보이는 것
  4개 만져지는 것
  3개 들리는 것
  2개 냄새나는 것
  1개 맛보는 것

- 호흡 관찰 3분
- 바디스캔 5분
- 일상 활동 마음챙김 (식사, 걷기, 설거지)
    `,
    metadata: { category: 'mindfulness', difficulty: 'beginner' }
  },
  {
    id: 'dbt-002',
    title: '감정 조절 (Emotion Regulation)',
    namespace: 'dbt-techniques',
    content: `
감정 조절은 강렬한 감정을 건강하게 다루는 기술입니다.

1. 감정 이해하기
   - 모든 감정은 이유가 있고 기능이 있음
   - 불안: 위험 경고
   - 분노: 경계 침해 알림
   - 슬픔: 상실 처리

2. 취약성 줄이기 (PLEASE)
   - PL: 신체 질환 치료 (Treat PhysicaL illness)
   - E: 균형잡힌 식사 (Balanced Eating)
   - A: 기분 바꾸는 물질 피하기 (Avoid mood-altering substances)
   - S: 균형잡힌 수면 (Balanced Sleep)
   - E: 운동 (Exercise)

3. 긍정 경험 늘리기
   - 단기: 매일 즐거운 일 하기
   - 장기: 가치에 맞는 삶 살기
   - 감사 일기

4. 정반대로 행동하기 (Opposite Action)
   - 감정이 사실에 맞지 않을 때 사용
   - 불안 → 회피하고 싶지만 → 다가가기
   - 우울 → 누워있고 싶지만 → 활동하기
   - 분노 → 소리지르고 싶지만 → 부드럽게 말하기
   - 수치심 → 숨고 싶지만 → 드러내기

5. 문제 해결
   - 감정이 사실에 맞을 때 사용
   - 문제 명확히 하기
   - 해결책 브레인스토밍
   - 장단점 분석
   - 실행 및 평가
    `,
    metadata: { category: 'emotion-regulation', difficulty: 'intermediate' }
  },
  {
    id: 'dbt-003',
    title: '고통 감내 (Distress Tolerance)',
    namespace: 'dbt-techniques',
    content: `
고통 감내 기술은 위기 상황에서 즉각적으로 사용할 수 있는 대처 전략입니다.

TIPP 기법 (위기 즉시 대응):
1. Temperature (온도)
   - 찬물에 얼굴 담그기 (30초)
   - 얼음 쥐기
   - 찬물 샤워
   → 생리적 각성 빠르게 낮춤

2. Intense Exercise (격렬한 운동)
   - 팔굽혀펴기 20회
   - 제자리 뛰기 2분
   - 빠르게 걷기
   → 스트레스 호르몬 소진

3. Paced Breathing (페이스 호흡)
   - 4초 들이쉬기
   - 7초 참기
   - 8초 내쉬기
   → 부교감신경 활성화

4. Progressive Muscle Relaxation (점진적 이완)
   - 근육 긴장 → 이완 반복
   → 신체 긴장 해소

ACCEPTS 기법 (주의 전환):
- Activities: 활동하기
- Contributing: 남 돕기
- Comparisons: 비교하기 (더 힘든 때)
- Emotions: 정반대 감정 만들기
- Pushing away: 잠시 밀어내기
- Thoughts: 다른 생각하기
- Sensations: 강한 감각 느끼기

자기 위안 (Self-Soothe):
- 시각: 아름다운 것 보기
- 청각: 편안한 음악
- 후각: 좋은 향기
- 미각: 맛있는 차
- 촉각: 부드러운 천
    `,
    metadata: { category: 'distress-tolerance', difficulty: 'intermediate', indication: 'crisis' }
  },
]

/**
 * Psychology Theory & Research
 */
export const PSYCHOLOGY_THEORY: KnowledgeEntry[] = [
  {
    id: 'theory-001',
    title: '애착 이론 (Attachment Theory)',
    namespace: 'psychology-theory',
    content: `
애착 이론은 John Bowlby와 Mary Ainsworth가 발전시킨 이론으로, 초기 양육자와의 관계가 평생의 대인관계 패턴을 형성한다고 봅니다.

4가지 애착 유형:

1. 안정 애착 (Secure)
   - 특징: 친밀감 편안, 의존과 독립 균형
   - 내적 작동 모델: "나는 사랑받을 만하고, 타인은 신뢰할 만하다"
   - 비율: 약 60%

2. 불안 애착 (Anxious-Preoccupied)
   - 특징: 관계에 집착, 버림받을까 두려움
   - 내적 작동 모델: "나는 부족하고, 타인은 떠날 것이다"
   - 행동: 과도한 연락, 재확인 요구, 질투
   - 비율: 약 20%

3. 회피 애착 (Dismissive-Avoidant)
   - 특징: 친밀감 불편, 독립 강조
   - 내적 작동 모델: "나는 혼자가 편하고, 타인은 믿을 수 없다"
   - 행동: 감정 억제, 거리두기, 독립성 과잉
   - 비율: 약 15%

4. 혼란 애착 (Fearful-Avoidant)
   - 특징: 친밀감 원하면서도 두려움
   - 내적 작동 모델: "나는 사랑받을 자격 없고, 타인은 위험하다"
   - 행동: 접근-회피 반복
   - 비율: 약 5%

치료적 함의:
- 애착 패턴은 고정되지 않음 (earned secure attachment 가능)
- 치료 관계에서 교정적 경험 제공
- 내적 작동 모델 인식 및 재구성
- 안정 애착 형성: 일관성, 반응성, 정서적 조율
    `,
    metadata: { category: 'attachment-theory', researcher: 'Bowlby, Ainsworth' }
  },
  {
    id: 'theory-002',
    title: '자기결정 이론 (Self-Determination Theory)',
    namespace: 'psychology-theory',
    content: `
Deci와 Ryan의 자기결정 이론은 인간의 내재적 동기와 심리적 건강을 설명합니다.

3가지 기본 심리 욕구:

1. 자율성 (Autonomy)
   - 자신의 행동을 스스로 결정하는 느낌
   - 외부 압력이 아닌 내적 선택
   - "내가 원해서 한다"

   충족 방법:
   - 선택권 제공
   - 이유 설명 (강요 아닌)
   - 개인 가치와 연결

2. 유능감 (Competence)
   - 환경을 효과적으로 다루는 능력
   - 성장과 숙달의 경험
   - "나는 할 수 있다"

   충족 방법:
   - 적절한 도전 과제
   - 긍정적 피드백
   - 작은 성공 경험

3. 관계성 (Relatedness)
   - 타인과 연결되고 소속된 느낌
   - 돌봄을 주고받는 관계
   - "나는 속해있다"

   충족 방법:
   - 따뜻한 관계
   - 소속감 제공
   - 공감과 지지

욕구 충족 시:
- 내재적 동기 증가
- 심리적 웰빙 향상
- 자아실현 촉진

욕구 좌절 시:
- 동기 저하
- 우울, 불안 증가
- 삶의 만족도 감소

상담 적용:
- 내담자의 자율성 존중
- 작은 성취 경험 제공
- 치료적 관계 형성
    `,
    metadata: { category: 'motivation', researcher: 'Deci, Ryan' }
  },
]

/**
 * Mental Health Information
 */
export const MENTAL_HEALTH_INFO: KnowledgeEntry[] = [
  {
    id: 'mh-001',
    title: '우울증 (Major Depressive Disorder)',
    namespace: 'mental-health-info',
    content: `
우울증은 지속적인 슬픔, 무기력, 흥미 상실을 특징으로 하는 기분 장애입니다.

DSM-5 진단 기준 (2주 이상, 5개 이상):
1. 거의 매일, 하루 대부분 우울한 기분
2. 거의 모든 활동에 대한 흥미/즐거움 상실
3. 식욕 변화 (증가 또는 감소)
4. 불면 또는 과다수면
5. 정신운동 초조 또는 지연
6. 피로, 활력 상실
7. 무가치감, 과도한 죄책감
8. 사고력/집중력 저하
9. 반복적 죽음 생각

우울증의 신경생물학:
- 세로토닌, 노르에피네프린, 도파민 불균형
- 해마, 편도체, 전전두엽 피질 변화
- HPA axis 과활성 (스트레스 호르몬)

치료 접근:
1. 약물 치료
   - SSRI (선택적 세로토닌 재흡수 억제제)
   - SNRI, TCA, MAOI 등
   - 효과: 2-4주 후 시작
   - 지속: 6-12개월 이상

2. 심리 치료
   - CBT: 부정적 사고 패턴 변화
   - IPT: 대인관계 문제 다루기
   - BA: 행동 활성화
   - ACT: 수용 기반 접근

3. 생활 습관
   - 규칙적 운동 (주 3-5회, 30분)
   - 수면 위생
   - 사회적 연결
   - 영양 관리

예후:
- 치료 시 70-80% 호전
- 재발률 50% (1차 에피소드 후)
- 유지 치료로 재발 예방
    `,
    metadata: { category: 'depression', dsm5: 'MDD' }
  },
  {
    id: 'mh-002',
    title: '불안 장애 (Anxiety Disorders)',
    namespace: 'mental-health-info',
    content: `
불안 장애는 과도하고 지속적인 걱정과 두려움을 특징으로 합니다.

주요 불안 장애 유형:

1. 범불안 장애 (GAD)
   - 다양한 주제에 대한 과도한 걱정 (6개월+)
   - 걱정 통제 어려움
   - 신체 증상: 긴장, 피로, 집중곤란, 불면

2. 공황 장애 (Panic Disorder)
   - 예상치 못한 공황 발작 반복
   - 공황 발작: 심계항진, 호흡곤란, 현기증, 죽을 것 같은 공포
   - 또 다시 발작 올까 걱정 (예기 불안)
   - 회피 행동 발전 가능

3. 사회불안 장애 (Social Anxiety)
   - 사회적 상황에서 평가받는 것에 대한 강한 두려움
   - 창피당하거나 거부될 것에 대한 공포
   - 회피: 발표, 모임, 대화 등

4. 특정 공포증 (Specific Phobia)
   - 특정 대상/상황에 대한 과도한 공포
   - 예: 고소, 폐쇄, 동물, 혈액, 비행기

불안의 악순환:
위협 인식 → 불안 증가 → 신체 반응 → 파국적 해석 → 더 큰 불안

치료:
1. 노출 치료 (Exposure Therapy)
   - 점진적 노출 (위계 만들기)
   - 체계적 둔감화
   - 회피 깨기가 핵심

2. 인지 재구성
   - 위협 과대평가 수정
   - 대처 능력 과소평가 수정
   - 증거 찾기, 현실 검증

3. 불안 관리 기술
   - 복식 호흡 (배로 호흡)
   - 점진적 근육 이완
   - 마음챙김 명상

4. 약물 (필요시)
   - SSRI, SNRI
   - 벤조디아제핀 (단기)
   - 베타 차단제 (상황적)

예후:
- 치료 효과: 60-80%
- 조기 치료가 중요
- 재발 방지: 유지 전략 필수
    `,
    metadata: { category: 'anxiety', dsm5: 'anxiety-disorders' }
  },
]

/**
 * All knowledge entries combined
 */
export const ALL_KNOWLEDGE: KnowledgeEntry[] = [
  ...CBT_KNOWLEDGE,
  ...DBT_KNOWLEDGE,
  ...PSYCHOLOGY_THEORY,
  ...MENTAL_HEALTH_INFO,
]
