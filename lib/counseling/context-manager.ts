// 대화 맥락 관리 시스템

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ConversationContext {
  mainEmotions: string[]
  coreIssues: string[]
  cognitiveDistortions: string[]
  copingStrategies: string[]
  relationshipPatterns: string[]
  riskLevel: 'low' | 'medium' | 'high'
  therapeuticPhase: 'rapport' | 'exploration' | 'insight' | 'change'
  suggestedInterventions: string[]
}

// 대화 요약 생성
export function summarizeConversation(messages: Message[]): string {
  const recentMessages = messages.slice(-6) // 최근 6개 메시지

  return recentMessages
    .map(m => `${m.role === 'user' ? '내담자' : '상담사'}: ${m.content}`)
    .join('\n\n')
}

// 위기 키워드 감지
export function detectCrisisKeywords(text: string): boolean {
  const crisisKeywords = [
    '죽고싶',
    '자살',
    '자해',
    '살아갈 이유',
    '사라지고 싶',
    '끝내고 싶',
    '죽으면',
    '목숨',
    '뛰어내리',
    '약을 먹',
    '손목',
  ]

  return crisisKeywords.some(keyword => text.includes(keyword))
}

// 감정 키워드 분석
export function analyzeEmotions(text: string): string[] {
  const emotionKeywords = {
    슬픔: ['슬프', '우울', '눈물', '울', '외로', '쓸쓸'],
    불안: ['불안', '걱정', '두렵', '무서', '긴장', '초조'],
    분노: ['화', '짜증', '억울', '분노', '열받'],
    수치심: ['부끄럽', '창피', '수치', '자격없'],
    죄책감: ['죄책감', '미안', '잘못', '후회'],
    무기력: ['무기력', '지친', '힘들', '피곤', '지쳐'],
  }

  const detected: string[] = []

  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    if (keywords.some(keyword => text.includes(keyword))) {
      detected.push(emotion)
    }
  })

  return detected
}

// 인지 왜곡 감지
export function detectCognitiveDistortions(text: string): string[] {
  const distortions: string[] = []

  // 흑백논리
  if (text.match(/항상|절대|전혀|완전히|무조건/)) {
    distortions.push('흑백논리')
  }

  // 과잉일반화
  if (text.match(/매번|언제나|다|모두/)) {
    distortions.push('과잉일반화')
  }

  // 재앙화
  if (text.match(/망했|끝났|안 될|최악/)) {
    distortions.push('재앙화')
  }

  // "해야 한다" 진술
  if (text.match(/해야만|해야 돼|해야지|안 하면|못하면/)) {
    distortions.push('"해야 한다" 사고')
  }

  return distortions
}

// 대화 단계 판단
export function determineTherapeuticPhase(messageCount: number): string {
  if (messageCount <= 4) return 'rapport' // 라포 형성
  if (messageCount <= 10) return 'exploration' // 탐색
  if (messageCount <= 20) return 'insight' // 통찰
  return 'change' // 변화
}

// 맥락 기반 시스템 메시지 생성
export function generateContextualSystemMessage(
  messages: Message[],
  conversationContext?: Partial<ConversationContext>
): string {
  const phase = determineTherapeuticPhase(messages.length)
  const recentEmotions = analyzeEmotions(
    messages
      .filter(m => m.role === 'user')
      .slice(-3)
      .map(m => m.content)
      .join(' ')
  )

  let contextualGuidance = ''

  // 단계별 가이드
  switch (phase) {
    case 'rapport':
      contextualGuidance = `
현재 라포 형성 단계입니다.
- 따뜻하고 수용적인 태도 유지
- 내담자의 경험을 정상화
- 판단하지 않는 자세
- 안전한 공간 조성에 집중
`
      break
    case 'exploration':
      contextualGuidance = `
현재 문제 탐색 단계입니다.
- 개방형 질문으로 깊이 탐색
- 감정, 생각, 행동의 연결 파악
- 패턴과 촉발요인 식별
- 경청과 반영에 집중
`
      break
    case 'insight':
      contextualGuidance = `
현재 통찰 형성 단계입니다.
- 인지적 왜곡 지적 및 재구조화
- 대안적 관점 제시
- 내담자의 강점 강조
- 연결고리 발견 돕기
`
      break
    case 'change':
      contextualGuidance = `
현재 변화 실천 단계입니다.
- 구체적 실천 과제 제안
- 작은 성공 경험 격려
- 재발 방지 전략
- 자립 준비
`
      break
  }

  if (recentEmotions.length > 0) {
    contextualGuidance += `\n감지된 주요 감정: ${recentEmotions.join(', ')}\n이 감정들을 세심하게 다뤄주세요.`
  }

  if (conversationContext?.riskLevel === 'high') {
    contextualGuidance += `\n⚠️ 높은 위기 수준 감지. 안전 확보 우선, 필요시 전문기관 연계 고려.`
  }

  return contextualGuidance
}

// 대화 품질 체크
export function checkResponseQuality(response: string): {
  hasEmpathy: boolean
  hasQuestion: boolean
  hasInsight: boolean
  length: 'too_short' | 'good' | 'too_long'
} {
  const wordCount = response.length
  const hasQuestion = response.includes('?')
  const empathyWords = ['힘드', '어려우', '이해', '느끼', '마음']
  const hasEmpathy = empathyWords.some(word => response.includes(word))

  const insightIndicators = ['혹시', '그런데', '하지만', '다만', '만약']
  const hasInsight = insightIndicators.some(word => response.includes(word))

  let length: 'too_short' | 'good' | 'too_long' = 'good'
  if (wordCount < 50) length = 'too_short'
  if (wordCount > 500) length = 'too_long'

  return { hasEmpathy, hasQuestion, hasInsight, length }
}
