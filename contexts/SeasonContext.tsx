'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'auto'

interface SeasonContextType {
  season: Season
  currentSeason: Season
  setSeason: (season: Season) => void
  getSeasonColors: () => SeasonColors
}

interface SeasonColors {
  primary: string
  secondary: string
  accent: string
  background: string
  gradient: string
}

const SeasonContext = createContext<SeasonContextType | undefined>(undefined)

export function SeasonProvider({ children }: { children: ReactNode }) {
  const [season, setSeason] = useState<Season>('auto')
  const [currentSeason, setCurrentSeason] = useState<Season>('spring')

  // 현재 계절 자동 감지
  useEffect(() => {
    const detectSeason = (): Season => {
      const month = new Date().getMonth() + 1

      // 북반구 기준 계절 (남반구는 반대)
      if (month >= 3 && month <= 5) return 'spring'
      if (month >= 6 && month <= 8) return 'summer'
      if (month >= 9 && month <= 11) return 'autumn'
      return 'winter'
    }

    setCurrentSeason(detectSeason())

    // localStorage에서 설정 불러오기
    const savedSeason = localStorage.getItem('forestecho_season') as Season
    if (savedSeason) {
      setSeason(savedSeason)
    }
  }, [])

  // 계절 변경 시 저장
  const handleSetSeason = (newSeason: Season) => {
    setSeason(newSeason)
    localStorage.setItem('forestecho_season', newSeason)
  }

  // 계절별 색상 팔레트
  const getSeasonColors = (): SeasonColors => {
    const activeSeason = season === 'auto' ? currentSeason : season

    switch (activeSeason) {
      case 'spring':
        return {
          primary: '#10b981', // 밝은 초록 - 새싹
          secondary: '#f472b6', // 벚꽃 핑크
          accent: '#fbbf24', // 따뜻한 노랑
          background: 'linear-gradient(180deg, #a8e0d5 0%, #d5f0e8 60%, #b8e5d0 100%)',
          gradient: 'from-emerald-500/20 via-pink-400/20 to-yellow-400/20',
        }

      case 'summer':
        return {
          primary: '#059669', // 짙은 초록 - 울창한 숲
          secondary: '#0ea5e9', // 맑은 하늘색
          accent: '#f59e0b', // 태양 오렌지
          background: 'linear-gradient(180deg, #4fc3f7 0%, #81c784 60%, #66bb6a 100%)',
          gradient: 'from-green-600/20 via-sky-400/20 to-yellow-500/20',
        }

      case 'autumn':
        return {
          primary: '#d97706', // 단풍 주황
          secondary: '#dc2626', // 단풍 빨강
          accent: '#92400e', // 갈색 나뭇잎
          background: 'linear-gradient(180deg, #ffa726 0%, #ef6c00 40%, #8d6e63 80%, #5d4037 100%)',
          gradient: 'from-orange-600/20 via-red-600/20 to-amber-800/20',
        }

      case 'winter':
        return {
          primary: '#06b6d4', // 얼음 청록
          secondary: '#7c3aed', // 오로라 보라
          accent: '#e0f2fe', // 눈 흰색
          background: 'linear-gradient(180deg, #e1f5fe 0%, #b3e5fc 40%, #81d4fa 80%, #4fc3f7 100%)',
          gradient: 'from-cyan-400/20 via-blue-400/20 to-purple-500/20',
        }

      default:
        return getSeasonColors() // 재귀 호출로 기본값
    }
  }

  return (
    <SeasonContext.Provider
      value={{
        season,
        currentSeason,
        setSeason: handleSetSeason,
        getSeasonColors,
      }}
    >
      {children}
    </SeasonContext.Provider>
  )
}

export function useSeason() {
  const context = useContext(SeasonContext)
  if (context === undefined) {
    throw new Error('useSeason must be used within a SeasonProvider')
  }
  return context
}
