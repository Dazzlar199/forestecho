'use client'

import { motion } from 'framer-motion'
import { Leaf, Sun, Wind, Snowflake, Sparkles } from 'lucide-react'
import { useSeason } from '@/contexts/SeasonContext'
import { useTheme } from '../layout/ThemeProvider'
import { useLanguage } from '../layout/LanguageProvider'
import { hapticSelection } from '@/lib/interactions/haptics'

export default function SeasonSelector() {
  const { season, setSeason } = useSeason()
  const { theme } = useTheme()
  const { language } = useLanguage()

  const seasons = [
    {
      id: 'auto' as const,
      icon: Sparkles,
      label: { ko: '자동', en: 'Auto', ja: '自動', zh: '自动' },
      description: { ko: '현재 계절 자동 감지', en: 'Auto detect', ja: '自動検出', zh: '自动检测' },
      color: 'emerald',
    },
    {
      id: 'spring' as const,
      icon: Leaf,
      label: { ko: '봄', en: 'Spring', ja: '春', zh: '春' },
      description: { ko: '새싹과 벚꽃', en: 'Buds & Blossoms', ja: '新芽と桜', zh: '新芽与樱花' },
      color: 'pink',
    },
    {
      id: 'summer' as const,
      icon: Sun,
      label: { ko: '여름', en: 'Summer', ja: '夏', zh: '夏' },
      description: { ko: '울창한 초록', en: 'Lush Green', ja: '青々とした緑', zh: '郁郁葱葱' },
      color: 'green',
    },
    {
      id: 'autumn' as const,
      icon: Wind,
      label: { ko: '가을', en: 'Autumn', ja: '秋', zh: '秋' },
      description: { ko: '단풍과 낙엽', en: 'Colorful Leaves', ja: '紅葉', zh: '枫叶' },
      color: 'orange',
    },
    {
      id: 'winter' as const,
      icon: Snowflake,
      label: { ko: '겨울', en: 'Winter', ja: '冬', zh: '冬' },
      description: { ko: '설경과 오로라', en: 'Snow & Aurora', ja: '雪景色', zh: '雪景' },
      color: 'cyan',
    },
  ]

  const handleSeasonChange = (newSeason: typeof season) => {
    setSeason(newSeason)
    hapticSelection()
  }

  return (
    <div>
      <h3
        className={`text-lg font-medium mb-4 ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
        }`}
      >
        {language === 'ko' && '계절 테마'}
        {language === 'en' && 'Season Theme'}
        {language === 'ja' && '季節テーマ'}
        {language === 'zh' && '季节主题'}
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {seasons.map((item) => {
          const Icon = item.icon
          const isActive = season === item.id

          return (
            <motion.button
              key={item.id}
              onClick={() => handleSeasonChange(item.id)}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                isActive
                  ? theme === 'dark'
                    ? `border-${item.color}-500 bg-${item.color}-500/10`
                    : `border-${item.color}-500 bg-${item.color}-100`
                  : theme === 'dark'
                  ? 'border-white/10 bg-white/5 hover:bg-white/10'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Icon */}
              <div className="flex justify-center mb-2">
                <Icon
                  className={`w-8 h-8 ${
                    isActive
                      ? `text-${item.color}-500`
                      : theme === 'dark'
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }`}
                />
              </div>

              {/* Label */}
              <div
                className={`text-sm font-medium mb-1 ${
                  isActive
                    ? `text-${item.color}-600`
                    : theme === 'dark'
                    ? 'text-gray-200'
                    : 'text-gray-900'
                }`}
              >
                {item.label[language as keyof typeof item.label]}
              </div>

              {/* Description */}
              <div
                className={`text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}
              >
                {item.description[language as keyof typeof item.description]}
              </div>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="season-indicator"
                  className={`absolute inset-0 rounded-xl border-2 border-${item.color}-500 pointer-events-none`}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
