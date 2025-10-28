'use client'

import { useRouter } from 'next/navigation'
import { FileText, Calendar, TrendingUp, AlertCircle } from 'lucide-react'
import type { PsychologicalAnalysis } from '@/types/analysis'

interface AnalysisHistoryCardProps {
  analysis: PsychologicalAnalysis
}

export default function AnalysisHistoryCard({ analysis }: AnalysisHistoryCardProps) {
  const router = useRouter()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getRiskLevelColor = (level?: string) => {
    switch (level) {
      case 'high':
        return 'text-red-400 bg-red-500/10 border-red-500/30'
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      case 'low':
        return 'text-green-400 bg-green-500/10 border-green-500/30'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
    }
  }

  const getRiskLevelText = (level?: string) => {
    switch (level) {
      case 'high':
        return '높음'
      case 'medium':
        return '중간'
      case 'low':
        return '낮음'
      default:
        return '미확인'
    }
  }

  return (
    <div
      onClick={() => router.push(`/analysis/${analysis.id}`)}
      className="bg-black/20 backdrop-blur-xl border border-white/10 p-6 rounded-lg hover:bg-black/30 hover:border-white/20 transition-all cursor-pointer group"
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg group-hover:bg-blue-500/20 transition-all">
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3
              className="text-gray-200 group-hover:text-white transition-colors"
              style={{ fontWeight: 400, letterSpacing: '0.02em' }}
            >
              심리 분석 리포트
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Calendar className="w-3 h-3" />
              <span style={{ fontWeight: 300 }}>{formatDate(analysis.generatedAt)}</span>
            </div>
          </div>
        </div>

        {/* 위험 수준 배지 */}
        {analysis.riskAssessment?.riskLevel && (
          <span
            className={`px-3 py-1 rounded-full border text-xs ${getRiskLevelColor(
              analysis.riskAssessment.riskLevel
            )}`}
            style={{ fontWeight: 400, letterSpacing: '0.03em' }}
          >
            위험도: {getRiskLevelText(analysis.riskAssessment.riskLevel)}
          </span>
        )}
      </div>

      {/* 요약 */}
      {analysis.summary && (
        <p
          className="text-gray-400 text-sm mb-4 line-clamp-2"
          style={{ fontWeight: 300, lineHeight: 1.7 }}
        >
          {analysis.summary}
        </p>
      )}

      {/* 하단 정보 */}
      <div className="flex items-center gap-6 pt-4 border-t border-white/5">
        {/* 회복 가능성 */}
        {typeof analysis.prognosis?.recoveryPotential === 'number' && (
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-500" style={{ fontWeight: 300 }}>
              회복 가능성:{' '}
              <span className="text-green-400 font-medium">
                {analysis.prognosis.recoveryPotential}/10
              </span>
            </span>
          </div>
        )}

        {/* 주요 감정 */}
        {analysis.emotionalAnalysis?.dominantEmotions &&
          analysis.emotionalAnalysis.dominantEmotions.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {analysis.emotionalAnalysis.dominantEmotions.slice(0, 3).map((emotion, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400"
                    style={{ fontWeight: 300 }}
                  >
                    {emotion.name}
                  </span>
                ))}
              </div>
            </div>
          )}
      </div>

      {/* 호버 시 표시되는 화살표 */}
      <div className="mt-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-sm text-gray-500" style={{ fontWeight: 300 }}>
          자세히 보기 →
        </span>
      </div>
    </div>
  )
}
