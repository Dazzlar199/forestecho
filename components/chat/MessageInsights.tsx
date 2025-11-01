'use client'

import { useState } from 'react'
import { Brain, Lightbulb, TrendingUp, ChevronDown, ChevronUp, Heart, AlertCircle, BookOpen } from 'lucide-react'
import type { MessageMetadata } from '@/types'

interface MessageInsightsProps {
  metadata: MessageMetadata
}

export default function MessageInsights({ metadata }: MessageInsightsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // 표시할 인사이트가 없으면 렌더링하지 않음
  if (!metadata.analysis && !metadata.suggestions && !metadata.riskAssessment) {
    return null
  }

  const { analysis, suggestions, riskAssessment } = metadata

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
              {analysis.emotions.some(e => e.trigger) && (
                <div className="mt-2 text-xs text-rose-700">
                  <span className="font-medium">촉발 요인:</span>{' '}
                  {analysis.emotions.find(e => e.trigger)?.trigger}
                </div>
              )}
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

          {/* 인지 왜곡 */}
          {analysis?.cognitiveDistortions && analysis.cognitiveDistortions.length > 0 && (
            <div className="bg-amber-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-amber-600" />
                <h4 className="text-sm font-bold text-amber-900">인지 왜곡 패턴</h4>
              </div>
              <div className="space-y-2">
                {analysis.cognitiveDistortions.map((distortion, idx) => (
                  <div key={idx} className="border-l-2 border-amber-400 pl-3">
                    <div className="text-sm font-medium text-amber-900">{distortion.type}</div>
                    <div className="text-xs text-amber-700 mt-1">
                      <span className="font-medium">예시:</span> {distortion.example}
                    </div>
                    <div className="text-xs text-amber-800 mt-1 italic">
                      💡 {distortion.challenge}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 치료적 통찰 */}
          {analysis?.insights && analysis.insights.length > 0 && (
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-purple-600" />
                <h4 className="text-sm font-bold text-purple-900">치료적 통찰</h4>
              </div>
              <div className="space-y-2">
                {analysis.insights.map((insight, idx) => (
                  <div key={idx} className="text-sm text-purple-800">
                    <div className="font-medium">패턴: {insight.pattern}</div>
                    {insight.underlyingNeed && (
                      <div className="text-xs mt-1">근본 욕구: {insight.underlyingNeed}</div>
                    )}
                    {insight.connectionToPast && (
                      <div className="text-xs mt-1">과거 연결: {insight.connectionToPast}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 실천 기법 */}
          {suggestions?.immediate && suggestions.immediate.length > 0 && (
            <div className="bg-emerald-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-emerald-900">즉시 실천 가능한 기법</h4>
              </div>
              <div className="space-y-3">
                {suggestions.immediate.map((technique, idx) => (
                  <div key={idx} className="border-l-2 border-emerald-400 pl-3">
                    <div className="text-sm font-medium text-emerald-900">
                      {technique.name} ({technique.category})
                    </div>
                    <div className="text-xs text-emerald-700 mt-1">{technique.description}</div>
                    <div className="mt-2 space-y-1">
                      {technique.steps.map((step, stepIdx) => (
                        <div key={stepIdx} className="text-xs text-emerald-800 flex gap-2">
                          <span className="font-bold">{stepIdx + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-emerald-600 mt-2 italic">
                      ✨ 기대 효과: {technique.expectedBenefit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 리소스 */}
          {suggestions?.resources && suggestions.resources.length > 0 && (
            <div className="bg-indigo-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-indigo-900">추천 리소스</h4>
              </div>
              <ul className="space-y-1">
                {suggestions.resources.map((resource, idx) => (
                  <li key={idx} className="text-xs text-indigo-800 flex gap-2">
                    <span>•</span>
                    <span>{resource}</span>
                  </li>
                ))}
              </ul>
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
