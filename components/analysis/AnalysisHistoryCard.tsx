'use client'

import { useRouter } from 'next/navigation'
import { Calendar } from 'lucide-react'
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
      className="bg-transparent border border-emerald-500/20 p-5 rounded-lg hover:border-emerald-500/40 transition-colors cursor-pointer"
    >
      {/* 헤더 - 간소화 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(analysis.generatedAt)}</span>
        </div>

        {analysis.riskAssessment?.riskLevel && (
          <span className="text-xs text-emerald-400">
            {getRiskLevelText(analysis.riskAssessment.riskLevel)}
          </span>
        )}
      </div>

      {/* 요약 */}
      {analysis.summary && (
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {analysis.summary}
        </p>
      )}

      {/* 하단 정보 */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        {typeof analysis.prognosis?.recoveryPotential === 'number' && (
          <span>
            회복 가능성 <span className="text-emerald-400">{analysis.prognosis.recoveryPotential}/10</span>
          </span>
        )}

        {analysis.emotionalAnalysis?.dominantEmotions &&
          analysis.emotionalAnalysis.dominantEmotions.length > 0 && (
            <div className="flex gap-1">
              {analysis.emotionalAnalysis.dominantEmotions.slice(0, 2).map((emotion, i) => (
                <span key={i} className="text-gray-500">
                  {emotion.name}
                </span>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}
