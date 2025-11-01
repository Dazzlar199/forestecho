'use client'

import { Brain, Heart, AlertCircle, Activity } from 'lucide-react'
import type { MessageMetadata } from '@/types'

interface LiveAnalysisSidebarProps {
  latestMetadata: MessageMetadata | null
}

export default function LiveAnalysisSidebar({ latestMetadata }: LiveAnalysisSidebarProps) {
  if (!latestMetadata?.analysis) {
    return (
      <div className="hidden lg:block w-80 bg-gradient-to-b from-emerald-50 to-teal-50 border-l border-emerald-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-emerald-900">실시간 심리 분석</h3>
        </div>
        <div className="text-center text-gray-500 text-sm mt-12">
          <Activity className="w-12 h-12 mx-auto mb-3 text-gray-400 animate-pulse" />
          <p>대화를 시작하면</p>
          <p>실시간 분석이 표시됩니다</p>
        </div>
      </div>
    )
  }

  const { analysis, riskAssessment } = latestMetadata

  return (
    <div className="hidden lg:block w-80 bg-gradient-to-b from-emerald-50 to-teal-50 border-l border-emerald-200 p-6 overflow-y-auto">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-5 h-5 text-emerald-600" />
        <h3 className="font-bold text-emerald-900">실시간 심리 분석</h3>
      </div>

      <div className="space-y-4">
        {/* 감정 분석 */}
        {analysis.emotions && analysis.emotions.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-rose-600" />
              <h4 className="text-sm font-bold text-rose-900">현재 감정 상태</h4>
            </div>
            <div className="space-y-3">
              {analysis.emotions.map((emotion, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-rose-700">{emotion.name}</span>
                    <span className="text-xs font-bold text-rose-600">{emotion.intensity}/10</span>
                  </div>
                  <div className="w-full bg-rose-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-rose-400 to-rose-600 h-2.5 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${emotion.intensity * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 핵심 이슈 */}
        {analysis.coreIssue && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold text-blue-900">핵심 문제</h4>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">{analysis.coreIssue}</p>
          </div>
        )}

        {/* 위험 평가 */}
        {riskAssessment && riskAssessment.level !== 'low' && (
          <div className={`rounded-xl p-4 shadow-sm border ${
            riskAssessment.level === 'high'
              ? 'bg-red-50 border-red-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className={`w-4 h-4 ${
                riskAssessment.level === 'high' ? 'text-red-600' : 'text-yellow-600'
              }`} />
              <h4 className={`text-sm font-bold ${
                riskAssessment.level === 'high' ? 'text-red-900' : 'text-yellow-900'
              }`}>
                위험 수준: {riskAssessment.level === 'high' ? '높음' : '중간'}
              </h4>
            </div>
            {riskAssessment.concerns && riskAssessment.concerns.length > 0 && (
              <ul className={`space-y-1 text-xs mb-2 ${
                riskAssessment.level === 'high' ? 'text-red-800' : 'text-yellow-800'
              }`}>
                {riskAssessment.concerns.map((concern, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span>•</span>
                    <span>{concern}</span>
                  </li>
                ))}
              </ul>
            )}
            {riskAssessment.recommendProfessionalHelp && (
              <div className={`text-xs font-medium mt-2 p-2 rounded ${
                riskAssessment.level === 'high'
                  ? 'bg-red-100 text-red-900'
                  : 'bg-yellow-100 text-yellow-900'
              }`}>
                ⚠️ 전문가 상담을 권장합니다
              </div>
            )}
          </div>
        )}

        {/* 위험 수준 Low일 때 */}
        {riskAssessment && riskAssessment.level === 'low' && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h4 className="text-sm font-bold text-emerald-900">상태</h4>
            </div>
            <p className="text-sm text-emerald-700">현재 안정적인 상태입니다</p>
          </div>
        )}

        {/* 안내 메시지 */}
        <div className="mt-6 pt-4 border-t border-emerald-200">
          <p className="text-xs text-gray-600 leading-relaxed">
            이 분석은 AI가 대화 내용을 바탕으로 실시간으로 생성한 것입니다.
            참고용으로만 활용해주세요.
          </p>
        </div>
      </div>
    </div>
  )
}
