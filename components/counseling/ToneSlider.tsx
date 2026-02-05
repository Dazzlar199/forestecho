'use client'

import { memo } from 'react'
import { Brain, Heart } from 'lucide-react'
import { useTheme } from '../layout/ThemeProvider'
import { useLanguage } from '../layout/LanguageProvider'

interface ToneSliderProps {
  value: number // 0 (이성적) ~ 100 (감성적)
  onChange: (value: number) => void
}

function ToneSlider({ value, onChange }: ToneSliderProps) {
  const { theme } = useTheme()
  const { language } = useLanguage()

  const getLabel = () => {
    if (language === 'ko') return '답변 스타일'
    if (language === 'en') return 'Response Style'
    if (language === 'ja') return '回答スタイル'
    return '回答风格'
  }

  const getRationalLabel = () => {
    if (language === 'ko') return '이성적'
    if (language === 'en') return 'Rational'
    if (language === 'ja') return '理性的'
    return '理性'
  }

  const getEmotionalLabel = () => {
    if (language === 'ko') return '감성적'
    if (language === 'en') return 'Emotional'
    if (language === 'ja') return '感情的'
    return '感性'
  }

  return (
    <div className={`backdrop-blur-xl border p-4 sm:p-6 rounded-lg mb-3 sm:mb-4 ${
      theme === 'dark'
        ? 'bg-black/20 border-white/10'
        : 'bg-white/40 border-gray-700/20'
    }`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <label
          className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
          style={{ fontWeight: 400, letterSpacing: '0.02em' }}
        >
          {getLabel()}
        </label>
        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
          {value < 35 && getRationalLabel()}
          {value >= 35 && value <= 65 && (language === 'ko' ? '중립' : language === 'en' ? 'Balanced' : language === 'ja' ? '中立' : '中立')}
          {value > 65 && getEmotionalLabel()}
        </span>
      </div>

      <div className="relative">
        {/* 슬라이더 트랙 */}
        <div className={`h-2 rounded-full ${
          theme === 'dark' ? 'bg-white/10' : 'bg-gray-300/50'
        }`}>
          {/* 채워진 부분 */}
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${value}%`,
              background: `linear-gradient(to right,
                ${value < 50 ? '#3b82f6' : '#ec4899'} 0%,
                ${value < 50 ? '#8b5cf6' : '#f43f5e'} 100%)`
            }}
          />
        </div>

        {/* 슬라이더 핸들 */}
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
        />

        {/* 커스텀 핸들 */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 shadow-lg transition-all duration-300 cursor-pointer ${
            theme === 'dark'
              ? 'bg-white border-white/50'
              : 'bg-white border-gray-400'
          }`}
          style={{
            left: `calc(${value}% - 10px)`,
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* 아이콘 레이블 */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <Brain className={`w-4 h-4 ${value < 50 ? 'text-blue-400' : 'text-gray-500'}`} />
          <span className={`text-xs ${
            value < 50
              ? 'text-blue-400 font-medium'
              : theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
          }`} style={{ letterSpacing: '0.02em' }}>
            {getRationalLabel()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${
            value > 50
              ? 'text-pink-400 font-medium'
              : theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
          }`} style={{ letterSpacing: '0.02em' }}>
            {getEmotionalLabel()}
          </span>
          <Heart className={`w-4 h-4 ${value > 50 ? 'text-pink-400' : 'text-gray-500'}`} />
        </div>
      </div>
    </div>
  )
}

export default memo(ToneSlider)
