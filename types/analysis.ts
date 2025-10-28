// 전문 심리 분석 결과 타입 정의

export interface EmotionScore {
  name: string // 감정 이름 (예: 우울, 불안, 분노)
  score: number // 0-10 점수
  description: string // 설명
}

export interface CognitivePattern {
  type: string // 인지 왜곡 유형
  description: string
  examples: string[]
}

export interface EmotionalAnalysis {
  dominantEmotions: EmotionScore[]
  emotionalStability: number // 0-10 점수
  emotionalTriggers: string[]
  hiddenEmotions: string
}

export interface CognitiveAnalysis {
  automaticThoughts: string[]
  cognitiveDistortions: CognitivePattern[]
  coreBeliefs: string[]
  selfEsteem: number // 0-10 점수
  selfEfficacy: number // 0-10 점수
}

export interface CoreIssue {
  surfaceProblems: string[]
  rootCauses: string[]
  patterns: string[]
  impactOnLife: {
    work: number // 0-10 영향도
    relationships: number
    selfCare: number
  }
  physicalSymptoms: string[]
}

export interface CopingStrategies {
  adaptive: string[]
  maladaptive: string[]
  avoidancePatterns: string[]
  defenseMechanisms: string[]
}

export interface StrengthsAndResources {
  resilience: number // 0-10 점수
  problemSolving: number
  socialSupport: string[]
  pastSuccesses: string[]
  internalResources: string[]
  externalResources: string[]
}

export interface RiskAssessment {
  riskLevel: 'low' | 'medium' | 'high'
  concerns: string[]
  crisisIndicators: string[]
  professionalHelpNeeded: boolean
}

export interface ClinicalImpression {
  description: string
  similarPatterns: string[]
  professionalReferralNeeded: boolean
}

export interface ActionPlan {
  immediate: {
    tasks: string[]
    expectedOutcome: string
    tips: string[]
  }
  shortTerm: {
    tasks: string[]
    duration: string
    focus: string[]
  }
  longTerm: {
    goals: string[]
    duration: string
    transformations: string[]
  }
  recommendedTechniques: {
    name: string
    description: string
    howTo: string
  }[]
}

export interface Prognosis {
  recoveryPotential: number // 0-10 점수
  positiveFactors: string[]
  expectedChanges: string[]
  growthOpportunities: string[]
  encouragingMessage: string
}

export interface PsychologicalAnalysis {
  id: string
  sessionId: string
  userId: string
  generatedAt: string

  // 분석 내용
  emotionalAnalysis: EmotionalAnalysis
  cognitiveAnalysis: CognitiveAnalysis
  coreIssue: CoreIssue
  copingStrategies: CopingStrategies
  strengthsAndResources: StrengthsAndResources
  riskAssessment: RiskAssessment
  clinicalImpression: ClinicalImpression
  actionPlan: ActionPlan
  prognosis: Prognosis

  // 전체 요약
  summary: string
}
