'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Calendar, Activity } from 'lucide-react'
import type { EmotionStats } from '@/types/emotion'
import { emotionConfig } from '@/types/emotion'

interface EmotionStatsCardProps {
  stats: EmotionStats
}

export default function EmotionStatsCard({ stats }: EmotionStatsCardProps) {
  const dominantEmotionInfo = emotionConfig[stats.dominantEmotion]

  const formatDateRange = () => {
    const start = new Date(stats.dateRange.start).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    })
    const end = new Date(stats.dateRange.end).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    })
    return `${start} - ${end}`
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Dominant Emotion */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
        style={{
          borderColor: `${dominantEmotionInfo.color}40`,
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: `${dominantEmotionInfo.color}20`,
              color: dominantEmotionInfo.color,
            }}
          >
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-400">주된 감정</p>
            <p
              className="text-lg font-medium"
              style={{ color: dominantEmotionInfo.color }}
            >
              {dominantEmotionInfo.name.ko}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <div
            className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden"
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${stats.emotionDistribution[stats.dominantEmotion] || 0}%`,
                backgroundColor: dominantEmotionInfo.color,
              }}
            />
          </div>
          <span>{(stats.emotionDistribution[stats.dominantEmotion] || 0).toFixed(0)}%</span>
        </div>
      </motion.div>

      {/* Improvement Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              stats.improvementScore >= 0
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-orange-500/20 text-orange-400'
            }`}
          >
            {stats.improvementScore >= 0 ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
          </div>
          <div>
            <p className="text-xs text-gray-400">개선 지수</p>
            <p
              className={`text-lg font-medium ${
                stats.improvementScore >= 0 ? 'text-emerald-400' : 'text-orange-400'
              }`}
            >
              {stats.improvementScore > 0 ? '+' : ''}
              {stats.improvementScore}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          {stats.improvementScore >= 10
            ? '긍정적 감정이 증가하고 있어요 ✨'
            : stats.improvementScore >= 0
            ? '조금씩 나아지고 있어요'
            : '힘든 시기를 겪고 계시네요'}
        </p>
      </motion.div>

      {/* Average Intensity */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-400">평균 강도</p>
            <p className="text-lg font-medium text-blue-400">
              {stats.averageIntensity.toFixed(1)} / 10
            </p>
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
            style={{ width: `${(stats.averageIntensity / 10) * 100}%` }}
          />
        </div>
      </motion.div>

      {/* Session Count */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-400">누적 대화</p>
            <p className="text-lg font-medium text-purple-400">
              {stats.totalSessions}회
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-400">{formatDateRange()}</p>
      </motion.div>
    </div>
  )
}
