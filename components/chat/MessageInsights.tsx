'use client'

import { useState } from 'react'
import { Brain, Lightbulb, TrendingUp, ChevronDown, ChevronUp, Heart, AlertCircle, BookOpen } from 'lucide-react'
import type { MessageMetadata } from '@/types'

interface MessageInsightsProps {
  metadata: MessageMetadata
}

export default function MessageInsights({ metadata }: MessageInsightsProps) {
  // 오른쪽 사이드바에 표시되므로 메시지 아래에는 표시하지 않음
  return null

  /* 기존 코드 주석 처리 - 오른쪽 사이드바로 대체됨
  const [isExpanded, setIsExpanded] = useState(false)

  // 표시할 인사이트가 없으면 렌더링하지 않음
  if (!metadata.analysis && !metadata.riskAssessment) {
    return null
  }

  const { analysis, riskAssessment } = metadata

  return (
    <div className="mt-3 border-t border-emerald-100 pt-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-900 transition-colors font-medium"
      >
        <Brain className="w-4 h-4" />
        <span>심리 분석 및 제안</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-4">
          {/* 감정 분석 */}
          {analysis?.emotions && analysis.emotions.length > 0 && (
            <div className="bg-rose-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-rose-600" />
                <h4 className="text-sm font-bold text-rose-900">감지된 감정</h4>
              </div>
              <div className="space-y-2">
                {analysis.emotions.map((emotion, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-sm text-rose-700 font-medium">{emotion.name}</span>
                    <div className="flex-1 bg-rose-200 rounded-full h-2">
                      <div
                        className="bg-rose-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${emotion.intensity * 10}%` }}
                      />
                    </div>
                    <span className="text-xs text-rose-600">{emotion.intensity}/10</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 핵심 이슈 */}
          {analysis?.coreIssue && (
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-blue-900">핵심 문제</h4>
              </div>
              <p className="text-sm text-blue-800">{analysis.coreIssue}</p>
            </div>
          )}


          {/* 위험 평가 (medium/high만 표시) */}
          {riskAssessment && riskAssessment.level !== 'low' && (
            <div className={`rounded-lg p-3 ${
              riskAssessment.level === 'high' ? 'bg-red-50' : 'bg-yellow-50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className={`w-4 h-4 ${
                  riskAssessment.level === 'high' ? 'text-red-600' : 'text-yellow-600'
                }`} />
                <h4 className={`text-sm font-bold ${
                  riskAssessment.level === 'high' ? 'text-red-900' : 'text-yellow-900'
                }`}>
                  위험 평가: {riskAssessment.level === 'high' ? '높음' : '중간'}
                </h4>
              </div>
              {riskAssessment.concerns && riskAssessment.concerns.length > 0 && (
                <ul className={`space-y-1 text-xs ${
                  riskAssessment.level === 'high' ? 'text-red-800' : 'text-yellow-800'
                }`}>
                  {riskAssessment.concerns.map((concern, idx) => (
                    <li key={idx}>• {concern}</li>
                  ))}
                </ul>
              )}
              {riskAssessment.recommendProfessionalHelp && (
                <div className={`mt-2 text-sm font-medium ${
                  riskAssessment.level === 'high' ? 'text-red-900' : 'text-yellow-900'
                }`}>
                  ⚠️ 전문가 상담을 권장합니다
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
