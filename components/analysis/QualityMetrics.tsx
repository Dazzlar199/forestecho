'use client'
import { logger } from '@/lib/utils/logger'

import { useState, useEffect } from 'react'
import { TrendingUp, BarChart3, Users, CheckCircle2 } from 'lucide-react'
import { db } from '@/lib/firebase/config'
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore'

interface Metrics {
  totalAnalyses: number
  totalFeedback: number
  positiveRate: number
  avgGenerationTime: number
}

export default function QualityMetrics() {
  const [metrics, setMetrics] = useState<Metrics>({
    totalAnalyses: 0,
    totalFeedback: 0,
    positiveRate: 0,
    avgGenerationTime: 24.5,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      // 최근 30일 분석 수
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const analysesRef = collection(db, 'psychologicalAnalyses')
      const recentAnalyses = query(
        analysesRef,
        where('createdAt', '>=', Timestamp.fromDate(thirtyDaysAgo))
      )
      const analysesSnapshot = await getDocs(recentAnalyses)
      const totalAnalyses = analysesSnapshot.size

      // 피드백 수집
      const feedbackRef = collection(db, 'analysisFeedback')
      const feedbackSnapshot = await getDocs(feedbackRef)
      const totalFeedback = feedbackSnapshot.size

      // 긍정 피드백 비율 계산
      const positiveFeedback = feedbackSnapshot.docs.filter(
        (doc) => doc.data().rating === 'positive'
      ).length
      const positiveRate = totalFeedback > 0 ? (positiveFeedback / totalFeedback) * 100 : 0

      setMetrics({
        totalAnalyses,
        totalFeedback,
        positiveRate,
        avgGenerationTime: 24.5, // 실제로는 로그에서 가져와야 함
      })
    } catch (error) {
      logger.error('Failed to fetch metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse bg-black/20 border border-white/10 p-8 rounded-lg">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white/5 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  const metricCards = [
    {
      icon: BarChart3,
      label: '30일 분석',
      value: metrics.totalAnalyses,
      suffix: '건',
      color: 'text-blue-400',
    },
    {
      icon: Users,
      label: '피드백 수',
      value: metrics.totalFeedback,
      suffix: '건',
      color: 'text-purple-400',
    },
    {
      icon: CheckCircle2,
      label: '만족도',
      value: metrics.positiveRate.toFixed(1),
      suffix: '%',
      color: 'text-emerald-400',
    },
    {
      icon: TrendingUp,
      label: '평균 생성 시간',
      value: metrics.avgGenerationTime.toFixed(1),
      suffix: '초',
      color: 'text-yellow-400',
    },
  ]

  return (
    <div className="bg-black/20 backdrop-blur-xl border border-white/10 p-8 rounded-lg">
      <h3 className="text-xl text-gray-200 mb-6" style={{ fontWeight: 400, letterSpacing: '0.02em' }}>
        분석 품질 지표
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metricCards.map((metric, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/10 p-5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <metric.icon className={`w-5 h-5 ${metric.color} mb-3`} />
            <div className="text-2xl font-light text-gray-200 mb-1">
              {metric.value}
              <span className="text-sm text-gray-500 ml-1">{metric.suffix}</span>
            </div>
            <div className="text-xs text-gray-500">{metric.label}</div>
          </div>
        ))}
      </div>

      {metrics.positiveRate > 0 && (
        <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <p className="text-sm text-emerald-300">
            ✓ 사용자의 {metrics.positiveRate.toFixed(0)}%가 분석 결과에 만족했습니다
          </p>
        </div>
      )}
    </div>
  )
}
