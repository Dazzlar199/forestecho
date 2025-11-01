// 공통 타입 정의

// Structured Output에서 받은 감정 데이터
export interface EmotionData {
  name: string
  intensity: number
  trigger?: string
}

// Structured Output에서 받은 인지 왜곡 데이터
export interface CognitiveDistortionData {
  type: string
  example: string
  challenge: string
}

// Structured Output에서 받은 심리 기법 데이터
export interface TechniqueData {
  name: string
  category: string
  description: string
  steps: string[]
  expectedBenefit: string
}

// Structured Output에서 받은 통찰 데이터
export interface InsightData {
  pattern: string
  underlyingNeed?: string
  connectionToPast?: string
}

// 메시지 메타데이터
export interface MessageMetadata {
  // 기본 분석 데이터
  emotions?: string[]
  distortions?: string[]
  isCrisis?: boolean
  quality?: any

  // Structured Output 분석 데이터
  analysis?: {
    emotions: EmotionData[]
    cognitiveDistortions?: CognitiveDistortionData[]
    coreIssue?: string
    insights?: InsightData[]
  }

  // Structured Output 제안 데이터
  suggestions?: {
    immediate?: TechniqueData[]
    questions?: string[]
    resources?: string[]
  }

  // Structured Output 위험 평가
  riskAssessment?: {
    level: 'low' | 'medium' | 'high'
    concerns?: string[]
    recommendProfessionalHelp: boolean
  }
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: MessageMetadata
}

export interface User {
  uid: string
  email: string | null
  displayName: string | null
  isPremium: boolean
}

export interface MusicTrack {
  title: string
  file: string
}

export interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface AnalysisData {
  emotionScore: number
  stressLevel: string
  mainIssues: string[]
  suggestions: string[]
}
