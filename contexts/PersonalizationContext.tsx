'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface UserPreferences {
  // 테마 설정
  prefersDarkMode: boolean
  prefersReducedMotion: boolean
  prefersHighContrast: boolean

  // 사운드 & 햅틱
  soundEnabled: boolean
  hapticEnabled: boolean
  bgmEnabled: boolean
  bgmVolume: number

  // AI 페르소나
  aiPersona: 'professional' | 'friendly' | 'empathetic' | 'balanced'
  responseLength: 'concise' | 'balanced' | 'detailed'

  // 알림 설정
  dailyReminderEnabled: boolean
  dailyReminderTime: string // "09:00"
  encouragementEnabled: boolean

  // 데이터 & 프라이버시
  dataSaverMode: boolean
  analyticsEnabled: boolean
  shareAnonymousData: boolean

  // 게임피케이션
  gamificationEnabled: boolean
  showStreaks: boolean
  showAchievements: boolean

  // 언어 & 접근성
  preferredLanguage: 'ko' | 'en' | 'ja' | 'zh'
  fontSize: 'small' | 'medium' | 'large'
  lineHeight: 'compact' | 'comfortable' | 'relaxed'
}

const defaultPreferences: UserPreferences = {
  prefersDarkMode: true,
  prefersReducedMotion: false,
  prefersHighContrast: false,

  soundEnabled: true,
  hapticEnabled: true,
  bgmEnabled: false,
  bgmVolume: 0.3,

  aiPersona: 'balanced',
  responseLength: 'balanced',

  dailyReminderEnabled: false,
  dailyReminderTime: '09:00',
  encouragementEnabled: true,

  dataSaverMode: false,
  analyticsEnabled: true,
  shareAnonymousData: false,

  gamificationEnabled: true,
  showStreaks: true,
  showAchievements: true,

  preferredLanguage: 'ko',
  fontSize: 'medium',
  lineHeight: 'comfortable',
}

interface PersonalizationContextType {
  preferences: UserPreferences
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void
  resetPreferences: () => void
  exportPreferences: () => string
  importPreferences: (data: string) => boolean
}

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(
  undefined
)

export function PersonalizationProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)

  // localStorage에서 불러오기
  useEffect(() => {
    try {
      const saved = localStorage.getItem('forestecho_preferences')
      if (saved) {
        const parsed = JSON.parse(saved)
        setPreferences({ ...defaultPreferences, ...parsed })
      }

      // 시스템 설정 감지
      if (window.matchMedia) {
        const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
          .matches
        const highContrast = window.matchMedia('(prefers-contrast: high)').matches

        setPreferences((prev) => ({
          ...prev,
          prefersDarkMode: saved ? prev.prefersDarkMode : darkMode,
          prefersReducedMotion: reducedMotion,
          prefersHighContrast: highContrast,
        }))
      }
    } catch (error) {
      console.error('Failed to load preferences:', error)
    }
  }, [])

  // 변경 시 저장
  useEffect(() => {
    try {
      localStorage.setItem('forestecho_preferences', JSON.stringify(preferences))
    } catch (error) {
      console.error('Failed to save preferences:', error)
    }
  }, [preferences])

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const resetPreferences = () => {
    setPreferences(defaultPreferences)
    localStorage.removeItem('forestecho_preferences')
  }

  const exportPreferences = (): string => {
    return JSON.stringify(preferences, null, 2)
  }

  const importPreferences = (data: string): boolean => {
    try {
      const parsed = JSON.parse(data)
      setPreferences({ ...defaultPreferences, ...parsed })
      return true
    } catch (error) {
      console.error('Failed to import preferences:', error)
      return false
    }
  }

  return (
    <PersonalizationContext.Provider
      value={{
        preferences,
        updatePreference,
        resetPreferences,
        exportPreferences,
        importPreferences,
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  )
}

export function usePersonalization() {
  const context = useContext(PersonalizationContext)
  if (context === undefined) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider')
  }
  return context
}
