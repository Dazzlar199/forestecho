// 공통 타입 정의

export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
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
