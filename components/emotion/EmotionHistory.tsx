'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '../layout/LanguageProvider'
import { useTheme } from '../layout/ThemeProvider'
import { useAuth } from '../layout/AuthProvider'
import { emotionConfig, type EmotionRecord } from '@/types/emotion'
import { Calendar, TrendingUp, Clock, Laugh, Smile, Wind, Minus, AlertCircle, CloudRain, Flame, Zap, FileText } from 'lucide-react'

// Icon mapping
const emotionIconMap: Record<string, any> = {
  Laugh,
  Smile,
  Wind,
  Minus,
  AlertCircle,
  CloudRain,
  Flame,
  Zap,
}

interface EmotionHistoryProps {
  records: EmotionRecord[]
}

export default function EmotionHistory({ records }: EmotionHistoryProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [view, setView] = useState<'list' | 'calendar'>('list')

  // Group records by date
  const recordsByDate = records.reduce((acc, record) => {
    const date = new Date(record.timestamp).toLocaleDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(record)
    return acc
  }, {} as Record<string, EmotionRecord[]>)

  const sortedDates = Object.keys(recordsByDate).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  )

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString(language, {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  return (
    <div className={`backdrop-blur-xl border rounded-lg p-8 ${
      theme === 'dark'
        ? 'bg-black/80 border-white/10'
        : 'bg-white/90 border-gray-700/20'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className={`text-2xl font-light mb-2 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`} style={{ letterSpacing: '0.05em' }}>
            {language === 'ko' && '감정 기록'}
            {language === 'en' && 'Emotion History'}
            {language === 'ja' && '感情記録'}
            {language === 'zh' && '情绪记录'}
          </h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
            {language === 'ko' && `총 ${records.length}개의 기록`}
            {language === 'en' && `${records.length} total records`}
            {language === 'ja' && `合計${records.length}件の記録`}
            {language === 'zh' && `共${records.length}条记录`}
          </p>
        </div>

        {/* View Toggle */}
        <div className={`flex gap-2 p-1 rounded-lg ${
          theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
        }`}>
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-md transition-all ${
              view === 'list'
                ? theme === 'dark'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-600 text-white'
                : theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-600 hover:text-gray-700'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`px-4 py-2 rounded-md transition-all ${
              view === 'calendar'
                ? theme === 'dark'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-600 text-white'
                : theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-600 hover:text-gray-700'
            }`}
          >
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Empty State */}
      {records.length === 0 && (
        <div className="text-center py-16">
          <div className="mb-4 flex justify-center">
            <FileText className={`w-16 h-16 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
          </div>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'ko' && '아직 기록된 감정이 없습니다'}
            {language === 'en' && 'No emotions recorded yet'}
            {language === 'ja' && 'まだ記録された感情はありません'}
            {language === 'zh' && '还没有记录任何情绪'}
          </p>
        </div>
      )}

      {/* List View */}
      {view === 'list' && records.length > 0 && (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date} className="space-y-3">
              {/* Date Header */}
              <div className={`flex items-center gap-2 text-sm font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <Calendar className="w-4 h-4" />
                {formatDate(date)}
              </div>

              {/* Records for this date */}
              <div className="space-y-2">
                {recordsByDate[date]
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((record) => {
                    const config = emotionConfig[record.emotion]
                    const RecordIcon = emotionIconMap[config.iconName]
                    return (
                      <div
                        key={record.id}
                        className={`p-4 rounded-lg border transition-all hover:scale-[1.02] ${
                          theme === 'dark'
                            ? 'bg-white/5 border-white/10 hover:bg-white/10'
                            : 'bg-white border-gray-200 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Emotion Icon */}
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${config.color}15` }}
                          >
                            <RecordIcon className="w-6 h-6" style={{ color: config.color }} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`font-medium ${
                                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                              }`}>
                                {config.name[language as keyof typeof config.name]}
                              </span>

                              {/* Intensity */}
                              <div className="flex gap-1">
                                {Array.from({ length: 10 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-1.5 h-4 rounded-full ${
                                      i < record.intensity
                                        ? 'opacity-100'
                                        : 'opacity-20'
                                    }`}
                                    style={{ backgroundColor: config.color }}
                                  />
                                ))}
                              </div>

                              {/* Time */}
                              <div className={`flex items-center gap-1 text-xs ml-auto ${
                                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                              }`}>
                                <Clock className="w-3 h-3" />
                                {formatTime(record.timestamp)}
                              </div>
                            </div>

                            {/* Triggers */}
                            {record.triggers && record.triggers.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-2">
                                {record.triggers.map((trigger) => (
                                  <span
                                    key={trigger}
                                    className={`px-2 py-0.5 rounded-full text-xs ${
                                      theme === 'dark'
                                        ? 'bg-white/10 text-gray-400'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}
                                  >
                                    {trigger}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Note */}
                            {record.note && (
                              <p className={`text-sm leading-relaxed ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                              }`} style={{ fontWeight: 300 }}>
                                {record.note}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Calendar View */}
      {view === 'calendar' && records.length > 0 && (
        <div className="text-center py-16">
          <div className="mb-4 flex justify-center">
            <Calendar className={`w-16 h-16 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
          </div>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'ko' && '달력 뷰는 곧 추가될 예정입니다'}
            {language === 'en' && 'Calendar view coming soon'}
            {language === 'ja' && 'カレンダービューは近日公開予定です'}
            {language === 'zh' && '日历视图即将推出'}
          </p>
        </div>
      )}
    </div>
  )
}
