import { logger } from '@/lib/utils/logger'
/**
 * AI 응답 금지 콘텐츠 필터
 * 앱인토스 심사 기준에 따라 금지된 콘텐츠를 차단합니다.
 */

export interface FilterResult {
  filtered: string
  isBlocked: boolean
  reason?: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
}

// 금지 콘텐츠 패턴 (정규식)
const PROHIBITED_PATTERNS = {
  // 1. 마약 관련 (제조, 사용법, 구매 방법)
  drugs: {
    patterns: [
      /마약.*제조/gi,
      /대마초.*키우/gi,
      /필로폰.*만들/gi,
      /코카인.*구매/gi,
      /헤로인/gi,
      /마약.*사는.*방법/gi,
      /환각제.*만들/gi,
      /LSD.*제조/gi,
      /메스암페타민/gi,
    ],
    severity: 'critical' as const,
    reason: 'drug_related',
    safeResponse: '죄송합니다. 마약이나 불법 약물에 관한 정보는 제공할 수 없습니다. 약물 의존 문제로 어려움을 겪고 계신다면, 전문 의료기관이나 중독관리통합지원센터(1899-0893)로 연락해주세요.',
  },

  // 2. 무기 제조법
  weapons: {
    patterns: [
      /폭탄.*만들/gi,
      /총.*제조/gi,
      /화기.*만들/gi,
      /폭발물.*제조/gi,
      /칼.*만들.*방법/gi,
      /무기.*제작/gi,
      /화염병/gi,
    ],
    severity: 'critical' as const,
    reason: 'weapon_manufacturing',
    safeResponse: '죄송합니다. 무기 제조나 폭발물에 관한 정보는 제공할 수 없습니다. 위험한 생각이나 충동으로 어려움을 겪고 계신다면, 정신건강 위기상담(1577-0199)로 연락해주세요.',
  },

  // 3. 자해 방법 상세 설명
  selfHarm: {
    patterns: [
      /자해.*방법.*상세/gi,
      /손목.*그.*방법/gi,
      /자살.*가장.*효과/gi,
      /목.*매.*방법/gi,
      /약.*몇.*먹으면/gi,
      /자살.*고통.*없/gi,
      /자해.*안.*아프/gi,
    ],
    severity: 'critical' as const,
    reason: 'self_harm_methods',
    safeResponse: '지금 매우 힘든 시간을 보내고 계시는 것 같아 마음이 아픕니다. 제가 자해나 자살 방법에 대한 정보를 드릴 수는 없지만, 당신의 고통을 함께 나누고 싶습니다.\n\n지금 당장 도움을 받을 수 있는 곳에 연락해주세요:\n🚨 자살예방 상담전화: 1393 (24시간)\n🚨 정신건강 위기상담: 1577-0199 (24시간)\n\n혼자가 아닙니다. 도움을 받을 수 있습니다.',
  },

  // 4. 미성년자 성적 내용
  minorSexualContent: {
    patterns: [
      /미성년자.*성/gi,
      /청소년.*성행위/gi,
      /아동.*성/gi,
      /초등학생.*성/gi,
      /중학생.*성/gi,
    ],
    severity: 'critical' as const,
    reason: 'minor_sexual_content',
    safeResponse: '죄송합니다. 미성년자와 관련된 성적 내용은 제공할 수 없습니다. 이는 법적으로 금지된 내용입니다.',
  },

  // 5. 범죄 조장
  crimeEncouragement: {
    patterns: [
      /사기.*치는.*방법/gi,
      /절도.*방법/gi,
      /해킹.*방법/gi,
      /범죄.*저지르/gi,
      /불법.*돈.*버는/gi,
      /위조.*방법/gi,
      /남.*속이는.*방법/gi,
    ],
    severity: 'high' as const,
    reason: 'crime_encouragement',
    safeResponse: '죄송합니다. 범죄나 불법 행위에 관한 정보는 제공할 수 없습니다. 법적인 문제로 어려움을 겪고 계신다면, 법률 상담이나 전문가의 도움을 받으시기 바랍니다.',
  },

  // 6. 혐오 표현 조장
  hateSpeech: {
    patterns: [
      /인종.*차별/gi,
      /성별.*혐오/gi,
      /장애인.*비하/gi,
      /종교.*혐오/gi,
      /.*혐오.*조장/gi,
    ],
    severity: 'high' as const,
    reason: 'hate_speech',
    safeResponse: '죄송합니다. 특정 집단에 대한 혐오나 차별을 조장하는 내용은 제공할 수 없습니다. 우리 모두는 존중받을 가치가 있습니다.',
  },

  // 7. 개인정보 요청
  personalInfo: {
    patterns: [
      /주민등록번호/gi,
      /신용카드.*번호/gi,
      /비밀번호.*알려/gi,
      /계좌.*번호/gi,
    ],
    severity: 'medium' as const,
    reason: 'personal_info_request',
    safeResponse: '죄송합니다. 개인정보와 관련된 질문에는 답변할 수 없습니다. 개인정보는 절대 타인과 공유하지 마세요.',
  },
}

/**
 * 응답에서 금지 콘텐츠를 필터링합니다.
 */
export function filterProhibitedContent(response: string): FilterResult {
  // 모든 카테고리 검사
  for (const [category, config] of Object.entries(PROHIBITED_PATTERNS)) {
    for (const pattern of config.patterns) {
      if (pattern.test(response)) {
        // 금지 콘텐츠 감지 - 로그 기록
        logger.warn(`🚨 Prohibited content detected: ${config.reason}`, {
          category,
          severity: config.severity,
          timestamp: new Date().toISOString(),
        })

        // 안전한 응답 반환
        return {
          filtered: config.safeResponse,
          isBlocked: true,
          reason: config.reason,
          severity: config.severity,
        }
      }
    }
  }

  // 금지 콘텐츠 없음
  return {
    filtered: response,
    isBlocked: false,
  }
}

/**
 * 사용자 입력에서 위험한 의도를 사전 감지합니다.
 */
export function detectDangerousIntent(userMessage: string): {
  isDangerous: boolean
  category?: string
  severity?: string
} {
  for (const [category, config] of Object.entries(PROHIBITED_PATTERNS)) {
    for (const pattern of config.patterns) {
      if (pattern.test(userMessage)) {
        logger.warn(`⚠️ Dangerous intent detected in user message: ${config.reason}`)
        return {
          isDangerous: true,
          category: config.reason,
          severity: config.severity,
        }
      }
    }
  }

  return { isDangerous: false }
}

/**
 * 응답 품질을 검증하고 부적절한 내용을 필터링합니다.
 */
export function validateResponseQuality(response: string): {
  isValid: boolean
  issues: string[]
} {
  const issues: string[] = []

  // 1. 너무 짧은 응답 (10자 미만)
  if (response.trim().length < 10) {
    issues.push('response_too_short')
  }

  // 2. 너무 긴 응답 (3000자 초과)
  if (response.length > 3000) {
    issues.push('response_too_long')
  }

  // 3. AI 자체 식별 확인 (금지)
  const aiSelfIdentification = [
    /저는 AI입니다/gi,
    /저는 인공지능입니다/gi,
    /I am an AI/gi,
    /I'm an artificial intelligence/gi,
  ]
  for (const pattern of aiSelfIdentification) {
    if (pattern.test(response)) {
      issues.push('ai_self_identification')
    }
  }

  // 4. 과도한 형식적 문구
  const formalPhrases = [
    /~하시는 것이 좋겠습니다/gi,
    /다음과 같은 방법을 추천드립니다:/gi,
    /전문가와 상담하시는 것을 권장드립니다/gi,
  ]
  let formalCount = 0
  for (const pattern of formalPhrases) {
    if (pattern.test(response)) formalCount++
  }
  if (formalCount > 2) {
    issues.push('too_formal')
  }

  return {
    isValid: issues.length === 0,
    issues,
  }
}
