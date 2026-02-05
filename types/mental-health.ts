/**
 * 멘탈 헬스 & 숲 상태 시스템
 */

export type ForestState =
  | 'barren'      // 황량한 땅 (0-15)
  | 'dry'         // 메마른 땅 (16-30)
  | 'sprouting'   // 첫 새싹 (31-45)
  | 'growing'     // 어린 나무 (46-60)
  | 'forest'      // 작은 숲 (61-75)
  | 'lush'        // 울창한 숲 (76-90)
  | 'blooming'    // 꽃 핀 숲 (91-100)

export type HealthTrend = 'improving' | 'stable' | 'declining'

export interface InitialAssessment {
  date: Date
  phq2Score: number    // 우울 척도 (0-6)
  gad2Score: number    // 불안 척도 (0-6)
  totalScore: number   // 합계 (0-12)
  initialHealthScore: number  // 변환된 건강도 (0-100)
}

export interface MentalHealthProfile {
  userId: string
  hasCompletedAssessment: boolean
  initialAssessment?: InitialAssessment
  currentHealthScore: number  // 0-100
  forestState: ForestState
  trend: HealthTrend
  lastUpdated: Date
  assessmentHistory: InitialAssessment[]
}

export interface AssessmentQuestion {
  id: string
  question: {
    ko: string
    en: string
    ja: string
    zh: string
  }
  options: {
    value: number
    label: {
      ko: string
      en: string
      ja: string
      zh: string
    }
  }[]
}

export interface ForestStateInfo {
  state: ForestState
  emoji: string
  name: {
    ko: string
    en: string
    ja: string
    zh: string
  }
  description: {
    ko: string
    en: string
    ja: string
    zh: string
  }
  color: string
}
