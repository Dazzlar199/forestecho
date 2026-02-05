'use client'
import { logger } from '@/lib/utils/logger'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Activity } from 'lucide-react'
import EmotionJourneyChart from './EmotionJourneyChart'
import EmotionStatsCard from './EmotionStatsCard'
import { ShareProgress } from '../referral/ShareProgress'
import {
  getEmotionHistory,
  calculateEmotionTrends,
  calculateEmotionStats,
} from '@/lib/firebase/emotion-tracking'
import type { EmotionTrend, EmotionStats } from '@/types/emotion'

interface EmotionJourneySectionProps {
  userId: string
  theme: 'light' | 'dark'
  language: 'ko' | 'en' | 'ja' | 'zh'
}

export default function EmotionJourneySection({
  userId,
  theme,
  language,
}: EmotionJourneySectionProps) {
  const [trends, setTrends] = useState<EmotionTrend[]>([])
  const [stats, setStats] = useState<EmotionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [dayRange, setDayRange] = useState<7 | 30>(30)
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchEmotionData = async () => {
      setLoading(true)
      try {
        const history = await getEmotionHistory(userId, dayRange)

        if (history.length > 0) {
          const calculatedTrends = calculateEmotionTrends(history)
          const calculatedStats = calculateEmotionStats(history)

          setTrends(calculatedTrends)
          setStats(calculatedStats)
        } else {
          setTrends([])
          setStats(null)
        }
      } catch (error) {
        logger.error('Failed to fetch emotion data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEmotionData()
  }, [userId, dayRange])

  if (loading) {
    return (
      <div className="mt-12 sm:mt-16">
        <div className="text-center py-8">
          <div className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'ko' && '감정 데이터를 불러오는 중...'}
            {language === 'en' && 'Loading emotion data...'}
            {language === 'ja' && '感情データを読み込み中...'}
            {language === 'zh' && '正在加载情绪数据...'}
          </div>
        </div>
      </div>
    )
  }

  if (!stats || trends.length === 0) {
    return null // Don't show section if no data
  }

  return (
    <div className="mt-12 sm:mt-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <TrendingUp
            className={`w-6 sm:w-8 h-6 sm:h-8 ${
              theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
            }`}
          />
          <h2
            className={`text-2xl sm:text-3xl font-light ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}
            style={{ letterSpacing: '0.05em' }}
          >
            {language === 'ko' && '감정 여정'}
            {language === 'en' && 'Emotion Journey'}
            {language === 'ja' && '感情の旅'}
            {language === 'zh' && '情绪旅程'}
          </h2>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setDayRange(7)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-all ${
              dayRange === 7
                ? theme === 'dark'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                  : 'bg-emerald-100 text-emerald-700 border border-emerald-500'
                : theme === 'dark'
                ? 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                : 'bg-white/40 text-gray-600 border border-gray-300 hover:bg-white/60'
            }`}
          >
            {language === 'ko' && '7일'}
            {language === 'en' && '7 days'}
            {language === 'ja' && '7日'}
            {language === 'zh' && '7天'}
          </button>
          <button
            onClick={() => setDayRange(30)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-all ${
              dayRange === 30
                ? theme === 'dark'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                  : 'bg-emerald-100 text-emerald-700 border border-emerald-500'
                : theme === 'dark'
                ? 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                : 'bg-white/40 text-gray-600 border border-gray-300 hover:bg-white/60'
            }`}
          >
            {language === 'ko' && '30일'}
            {language === 'en' && '30 days'}
            {language === 'ja' && '30日'}
            {language === 'zh' && '30天'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8">
        <EmotionStatsCard stats={stats} />
      </div>

      {/* Emotion Chart */}
      <motion.div
        ref={chartRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-xl border backdrop-blur-md ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10'
            : 'bg-white/40 border-gray-300'
        }`}
      >
        <div className="flex items-center gap-2 mb-6">
          <Activity
            className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
          />
          <h3
            className={`text-lg font-medium ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}
          >
            {language === 'ko' && '감정 변화 추이'}
            {language === 'en' && 'Emotion Trends'}
            {language === 'ja' && '感情の変化'}
            {language === 'zh' && '情绪变化趋势'}
          </h3>
        </div>

        <EmotionJourneyChart trends={trends} mode="area" />

        <p
          className={`mt-4 text-xs text-center ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
          }`}
        >
          {language === 'ko' && '대화를 통해 기록된 감정 데이터를 기반으로 합니다'}
          {language === 'en' && 'Based on emotions recorded through conversations'}
          {language === 'ja' && '会話を通じて記録された感情データに基づいています'}
          {language === 'zh' && '基于通过对话记录的情绪数据'}
        </p>
      </motion.div>

      {/* Share Button */}
      <div className="mt-4">
        <ShareProgress
          title={
            language === 'ko'
              ? '나의 감정 여정'
              : language === 'en'
              ? 'My Emotion Journey'
              : language === 'ja'
              ? '私の感情の旅'
              : '我的情绪旅程'
          }
          description={
            language === 'ko'
              ? `ForestEcho와 함께 ${dayRange}일간의 감정 여정을 기록했습니다 🌲`
              : language === 'en'
              ? `Tracked my ${dayRange}-day emotion journey with ForestEcho 🌲`
              : language === 'ja'
              ? `ForestEchoで${dayRange}日間の感情の旅を記録しました 🌲`
              : `与ForestEcho一起记录了${dayRange}天的情绪旅程 🌲`
          }
          targetRef={chartRef}
        />
      </div>
    </div>
  )
}
