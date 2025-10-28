'use client'

import { useMemo } from 'react'
import { useLanguage } from '../layout/LanguageProvider'
import { useTheme } from '../layout/ThemeProvider'
import { emotionConfig, type EmotionRecord, type EmotionType } from '@/types/emotion'
import { TrendingUp, Calendar, Laugh, Smile, Wind, Minus, AlertCircle, CloudRain, Flame, Zap, BarChart3, FileText } from 'lucide-react'

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

interface EmotionGraphProps {
  records: EmotionRecord[]
  period: 'week' | 'month'
}

export default function EmotionGraph({ records, period }: EmotionGraphProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()

  // Analyze patterns
  const analysis = useMemo(() => {
    if (records.length === 0) {
      return {
        dominantEmotion: null,
        averageIntensity: 0,
        emotionDistribution: {},
        timeOfDayPattern: { morning: 0, afternoon: 0, evening: 0, night: 0 },
        weekdayPattern: {},
      }
    }

    // Emotion distribution
    const emotionCounts: Record<string, number> = {}
    records.forEach((r) => {
      emotionCounts[r.emotion] = (emotionCounts[r.emotion] || 0) + 1
    })

    const dominant = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]

    // Average intensity
    const avgIntensity = records.reduce((sum, r) => sum + r.intensity, 0) / records.length

    // Time of day pattern
    const timePattern = { morning: 0, afternoon: 0, evening: 0, night: 0 }
    records.forEach((r) => {
      const hour = new Date(r.timestamp).getHours()
      if (hour >= 6 && hour < 12) timePattern.morning++
      else if (hour >= 12 && hour < 18) timePattern.afternoon++
      else if (hour >= 18 && hour < 22) timePattern.evening++
      else timePattern.night++
    })

    // Weekday pattern
    const weekdayPattern: Record<string, number> = {}
    records.forEach((r) => {
      const day = new Date(r.timestamp).toLocaleDateString(language, { weekday: 'short' })
      weekdayPattern[day] = (weekdayPattern[day] || 0) + 1
    })

    return {
      dominantEmotion: dominant ? (dominant[0] as EmotionType) : null,
      averageIntensity: avgIntensity,
      emotionDistribution: emotionCounts,
      timeOfDayPattern: timePattern,
      weekdayPattern,
    }
  }, [records, language])

  // Get last N days for trend
  const trendDays = period === 'week' ? 7 : 30
  const trendData = useMemo(() => {
    const days = []
    const now = new Date()

    for (let i = trendDays - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const dayRecords = records.filter((r) => {
        const rDate = new Date(r.timestamp)
        return rDate >= date && rDate < nextDate
      })

      const avgIntensity = dayRecords.length > 0
        ? dayRecords.reduce((sum, r) => r.intensity, 0) / dayRecords.length
        : null

      days.push({
        date: date.toLocaleDateString(language, { month: 'short', day: 'numeric' }),
        intensity: avgIntensity,
        count: dayRecords.length,
      })
    }

    return days
  }, [records, trendDays, language])

  const maxIntensity = 10

  return (
    <div className={`backdrop-blur-xl border rounded-lg p-8 ${
      theme === 'dark'
        ? 'bg-black/80 border-white/10'
        : 'bg-white/90 border-gray-700/20'
    }`}>
      {/* Header */}
      <div className="mb-8">
        <h2 className={`text-2xl font-light mb-2 ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
        }`} style={{ letterSpacing: '0.05em' }}>
          {language === 'ko' && '감정 분석'}
          {language === 'en' && 'Emotion Analysis'}
          {language === 'ja' && '感情分析'}
          {language === 'zh' && '情绪分析'}
        </h2>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
          {language === 'ko' && `최근 ${period === 'week' ? '7일' : '30일'} 패턴`}
          {language === 'en' && `Last ${period === 'week' ? '7' : '30'} days pattern`}
          {language === 'ja' && `過去${period === 'week' ? '7' : '30'}日間のパターン`}
          {language === 'zh' && `最近${period === 'week' ? '7' : '30'}天的模式`}
        </p>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-16">
          <div className="mb-4 flex justify-center">
            <BarChart3 className={`w-16 h-16 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
          </div>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'ko' && '분석할 데이터가 충분하지 않습니다'}
            {language === 'en' && 'Not enough data to analyze'}
            {language === 'ja' && '分析するデータが不十分です'}
            {language === 'zh' && '没有足够的数据进行分析'}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Dominant Emotion */}
            {analysis.dominantEmotion && (() => {
              const DominantIcon = emotionIconMap[emotionConfig[analysis.dominantEmotion].iconName]
              return (
                <div className={`p-6 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10'
                    : 'bg-white border-gray-200'
                }`}>
                  <div className="text-center">
                    <div className="mb-2 flex justify-center">
                      <DominantIcon className="w-10 h-10" style={{ color: emotionConfig[analysis.dominantEmotion].color }} />
                    </div>
                    <div className={`text-sm mb-1 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      {language === 'ko' && '주요 감정'}
                      {language === 'en' && 'Dominant Emotion'}
                      {language === 'ja' && '主要な感情'}
                      {language === 'zh' && '主要情绪'}
                    </div>
                    <div className={`font-medium ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {emotionConfig[analysis.dominantEmotion].name[language as keyof typeof emotionConfig[typeof analysis.dominantEmotion]['name']]}
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* Average Intensity */}
            <div className={`p-6 rounded-lg border ${
              theme === 'dark'
                ? 'bg-white/5 border-white/10'
                : 'bg-white border-gray-200'
            }`}>
              <div className="text-center">
                <div className="text-4xl mb-2">
                  <TrendingUp className="w-10 h-10 mx-auto" style={{
                    color: theme === 'dark' ? '#6ee7b7' : '#10b981'
                  }} />
                </div>
                <div className={`text-sm mb-1 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  {language === 'ko' && '평균 강도'}
                  {language === 'en' && 'Avg Intensity'}
                  {language === 'ja' && '平均強度'}
                  {language === 'zh' && '平均强度'}
                </div>
                <div className={`text-2xl font-medium ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {analysis.averageIntensity.toFixed(1)} / 10
                </div>
              </div>
            </div>

            {/* Total Records */}
            <div className={`p-6 rounded-lg border ${
              theme === 'dark'
                ? 'bg-white/5 border-white/10'
                : 'bg-white border-gray-200'
            }`}>
              <div className="text-center">
                <div className="mb-2 flex justify-center">
                  <FileText className="w-10 h-10" style={{
                    color: theme === 'dark' ? '#6ee7b7' : '#10b981'
                  }} />
                </div>
                <div className={`text-sm mb-1 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  {language === 'ko' && '총 기록'}
                  {language === 'en' && 'Total Records'}
                  {language === 'ja' && '総記録'}
                  {language === 'zh' && '总记录'}
                </div>
                <div className={`text-2xl font-medium ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {records.length}
                </div>
              </div>
            </div>
          </div>

          {/* Trend Chart */}
          <div>
            <h3 className={`text-lg font-light mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {language === 'ko' && '감정 강도 추세'}
              {language === 'en' && 'Intensity Trend'}
              {language === 'ja' && '強度の推移'}
              {language === 'zh' && '强度趋势'}
            </h3>
            <div className="relative h-64">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-4">
                {[10, 8, 6, 4, 2, 0].map((val) => (
                  <div key={val}>{val}</div>
                ))}
              </div>

              {/* Chart area */}
              <div className="ml-8 h-full flex items-end gap-1">
                {trendData.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center group">
                    {/* Bar */}
                    <div className="w-full relative flex items-end justify-center" style={{ height: '100%' }}>
                      {day.intensity !== null && (
                        <div
                          className={`w-full rounded-t transition-all ${
                            theme === 'dark'
                              ? 'bg-emerald-500 group-hover:bg-emerald-400'
                              : 'bg-emerald-600 group-hover:bg-emerald-700'
                          }`}
                          style={{
                            height: `${(day.intensity / maxIntensity) * 100}%`,
                            minHeight: day.intensity > 0 ? '4px' : '0',
                          }}
                        />
                      )}

                      {/* Tooltip */}
                      {day.count > 0 && (
                        <div className={`absolute bottom-full mb-2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity ${
                          theme === 'dark'
                            ? 'bg-black/90 text-white'
                            : 'bg-gray-800 text-white'
                        }`}>
                          {day.intensity?.toFixed(1)} ({day.count})
                        </div>
                      )}
                    </div>

                    {/* Date label */}
                    <div className={`text-xs mt-2 ${
                      theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                    }`} style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                      {day.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emotion Distribution */}
          <div>
            <h3 className={`text-lg font-light mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {language === 'ko' && '감정 분포'}
              {language === 'en' && 'Emotion Distribution'}
              {language === 'ja' && '感情の分布'}
              {language === 'zh' && '情绪分布'}
            </h3>
            <div className="space-y-3">
              {Object.entries(analysis.emotionDistribution)
                .sort((a, b) => b[1] - a[1])
                .map(([emotion, count]) => {
                  const config = emotionConfig[emotion as EmotionType]
                  const percentage = (count / records.length) * 100
                  const DistIcon = emotionIconMap[config.iconName]
                  return (
                    <div key={emotion}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <DistIcon className="w-5 h-5" style={{ color: config.color }} />
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {config.name[language as keyof typeof config.name]}
                          </span>
                        </div>
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {count} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden ${
                        theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                      }`}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: config.color,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
