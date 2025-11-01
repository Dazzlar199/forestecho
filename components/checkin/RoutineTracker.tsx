'use client'

import { useState } from 'react'
import { useLanguage } from '../layout/LanguageProvider'
import { useTheme } from '../layout/ThemeProvider'
import { Check, Flame, Plus } from 'lucide-react'
import { DEFAULT_ROUTINES, type RoutineItem } from '@/types/checkin'
import { iconMap } from '@/lib/utils/icon-map'

interface RoutineTrackerProps {
  routines: RoutineItem[]
  onToggleRoutine: (routineId: string) => void
  onAddRoutine?: () => void
}

export default function RoutineTracker({ routines, onToggleRoutine, onAddRoutine }: RoutineTrackerProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [filter, setFilter] = useState<'all' | 'morning' | 'evening' | 'anytime'>('all')

  const filteredRoutines = routines.filter(r => filter === 'all' || r.type === filter)
  const completedToday = routines.filter(r => r.completed).length
  const totalRoutines = routines.length
  const completionRate = totalRoutines > 0 ? Math.round((completedToday / totalRoutines) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className={`p-6 rounded-lg border ${
        theme === 'dark'
          ? 'bg-white/5 border-white/10'
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-lg font-medium mb-1 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
              {language === 'ko' && '오늘의 루틴'}
              {language === 'en' && 'Today\'s Routines'}
              {language === 'ja' && '今日のルーティン'}
              {language === 'zh' && '今日例程'}
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {completedToday} / {totalRoutines}{' '}
              {language === 'ko' && '완료'}
              {language === 'en' && 'completed'}
              {language === 'ja' && '完了'}
              {language === 'zh' && '已完成'}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-light mb-1 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
              {completionRate}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`h-2 rounded-full overflow-hidden ${
          theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
        }`}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${completionRate}%`,
              backgroundColor: completionRate === 100 ? '#10b981' : '#3b82f6'
            }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: { ko: '전체', en: 'All', ja: '全て', zh: '全部' } },
          { key: 'morning', label: { ko: '아침', en: 'Morning', ja: '朝', zh: '早晨' } },
          { key: 'evening', label: { ko: '저녁', en: 'Evening', ja: '夜', zh: '晚上' } },
          { key: 'anytime', label: { ko: '언제나', en: 'Anytime', ja: 'いつでも', zh: '随时' } }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === tab.key
                ? theme === 'dark'
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-600 text-white'
                : theme === 'dark'
                  ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label[language as keyof typeof tab.label]}
          </button>
        ))}
      </div>

      {/* Routine Items */}
      <div className="space-y-3">
        {filteredRoutines.map((routine) => {
          const Icon = iconMap[routine.icon]
          return (
            <button
              key={routine.id}
              onClick={() => onToggleRoutine(routine.id)}
              className={`w-full p-5 rounded-lg border-2 transition-all flex items-center gap-4 ${
                routine.completed
                  ? theme === 'dark'
                    ? 'border-emerald-500/50 bg-emerald-500/10'
                    : 'border-emerald-600/50 bg-emerald-100/50'
                  : theme === 'dark'
                    ? 'border-white/10 hover:border-white/30 bg-white/5'
                    : 'border-gray-300 hover:border-gray-400 bg-white'
              }`}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: routine.completed
                    ? `${routine.color}30`
                    : `${routine.color}15`
                }}
              >
                {Icon && <Icon className="w-6 h-6" style={{ color: routine.color }} />}
              </div>

              {/* Content */}
              <div className="flex-1 text-left">
                <h4 className={`text-base font-medium mb-1 ${
                  routine.completed
                    ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'
                    : theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {routine.title[language as keyof typeof routine.title]}
                </h4>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    theme === 'dark'
                      ? 'bg-white/10 text-gray-400'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {routine.type === 'morning' && (
                      <>{language === 'ko' ? '아침' : language === 'en' ? 'Morning' : language === 'ja' ? '朝' : '早晨'}</>
                    )}
                    {routine.type === 'evening' && (
                      <>{language === 'ko' ? '저녁' : language === 'en' ? 'Evening' : language === 'ja' ? '夜' : '晚上'}</>
                    )}
                    {routine.type === 'anytime' && (
                      <>{language === 'ko' ? '언제나' : language === 'en' ? 'Anytime' : language === 'ja' ? 'いつでも' : '随时'}</>
                    )}
                  </span>
                  {routine.streak > 0 && (
                    <div className="flex items-center gap-1 text-xs">
                      <Flame className="w-4 h-4" style={{ color: '#f97316' }} />
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        {routine.streak}{' '}
                        {language === 'ko' && '일'}
                        {language === 'en' && 'days'}
                        {language === 'ja' && '日'}
                        {language === 'zh' && '天'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Check Icon */}
              {routine.completed && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#10b981' }}
                >
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Add Routine Button */}
      {onAddRoutine && (
        <button
          onClick={onAddRoutine}
          className={`w-full p-5 rounded-lg border-2 border-dashed transition-all flex items-center justify-center gap-2 ${
            theme === 'dark'
              ? 'border-white/20 hover:border-white/40 text-gray-400 hover:text-gray-300'
              : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700'
          }`}
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm">
            {language === 'ko' && '새 루틴 추가'}
            {language === 'en' && 'Add new routine'}
            {language === 'ja' && '新しいルーティンを追加'}
            {language === 'zh' && '添加新例程'}
          </span>
        </button>
      )}

      {filteredRoutines.length === 0 && (
        <div className={`text-center py-12 ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          <p className="text-sm">
            {language === 'ko' && '아직 루틴이 없습니다'}
            {language === 'en' && 'No routines yet'}
            {language === 'ja' && 'まだルーティンがありません'}
            {language === 'zh' && '还没有例程'}
          </p>
        </div>
      )}
    </div>
  )
}
