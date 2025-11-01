'use client'

import { memo } from 'react'
import { Sparkles, TrendingUp, AlertCircle, Activity } from 'lucide-react'
import type { MessageMetadata } from '@/types'

interface LiveAnalysisSidebarProps {
  latestMetadata: MessageMetadata | null
}

function LiveAnalysisSidebar({ latestMetadata }: LiveAnalysisSidebarProps) {
  if (!latestMetadata?.analysis) {
    return (
      <div className="hidden lg:block w-72 bg-black/20 backdrop-blur-xl border-r border-white/10 p-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-sm font-semibold text-gray-300">실시간 분석</h3>
        </div>
        <div className="text-center text-gray-500 text-xs mt-16">
          <Activity className="w-10 h-10 mx-auto mb-3 text-gray-600 animate-pulse" />
          <p className="leading-relaxed">대화를 시작하면<br />실시간 분석이 표시됩니다</p>
        </div>
      </div>
    )
  }

  const { analysis, riskAssessment } = latestMetadata

  return (
    <div className="hidden lg:block w-72 bg-black/20 backdrop-blur-xl border-r border-white/10 p-4 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-300">실시간 분석</h3>
      </div>

      <div className="space-y-3">
        {/* 감정 분석 */}
        {analysis.emotions && analysis.emotions.length > 0 && (
          <div className="bg-white/5 rounded-lg p-3 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
              <h4 className="text-xs font-semibold text-gray-300">감정 상태</h4>
            </div>
            <div className="space-y-2.5">
              {analysis.emotions.map((emotion, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">{emotion.name}</span>
                    <span className="text-xs font-bold text-rose-400">{emotion.intensity}/10</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-rose-500 to-pink-500 h-1.5 rounded-full transition-all duration-700 ease-out"
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
          <div className="bg-white/5 rounded-lg p-3 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
              <h4 className="text-xs font-semibold text-gray-300">핵심 문제</h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{analysis.coreIssue}</p>
          </div>
        )}

        {/* 위험 평가 */}
        {riskAssessment && riskAssessment.level !== 'low' && (
          <div className={`rounded-lg p-3 border backdrop-blur-sm ${
            riskAssessment.level === 'high'
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-yellow-500/10 border-yellow-500/30'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className={`w-3.5 h-3.5 ${
                riskAssessment.level === 'high' ? 'text-red-400' : 'text-yellow-400'
              }`} />
              <h4 className={`text-xs font-semibold ${
                riskAssessment.level === 'high' ? 'text-red-300' : 'text-yellow-300'
              }`}>
                위험 수준: {riskAssessment.level === 'high' ? '높음' : '중간'}
              </h4>
            </div>
            {riskAssessment.concerns && riskAssessment.concerns.length > 0 && (
              <ul className={`space-y-1 text-xs mb-2 ${
                riskAssessment.level === 'high' ? 'text-red-300' : 'text-yellow-300'
              }`}>
                {riskAssessment.concerns.map((concern, idx) => (
                  <li key={idx} className="flex gap-1.5">
                    <span className="opacity-50">•</span>
                    <span className="flex-1">{concern}</span>
                  </li>
                ))}
              </ul>
            )}
            {riskAssessment.recommendProfessionalHelp && (
              <div className={`text-xs font-medium mt-2 p-2 rounded ${
                riskAssessment.level === 'high'
                  ? 'bg-red-500/20 text-red-300'
                  : 'bg-yellow-500/20 text-yellow-300'
              }`}>
                ⚠️ 전문가 상담 권장
              </div>
            )}
          </div>
        )}

        {/* 위험 수준 Low일 때 */}
        {riskAssessment && riskAssessment.level === 'low' && (
          <div className="bg-white/5 rounded-lg p-3 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <h4 className="text-xs font-semibold text-gray-300">상태</h4>
            </div>
            <p className="text-xs text-emerald-400">안정적인 상태입니다</p>
          </div>
        )}

        {/* 안내 메시지 */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-xs text-gray-500 leading-relaxed">
            AI 기반 실시간 분석입니다.<br/>참고용으로만 활용해주세요.
          </p>
        </div>
      </div>
    </div>
  )
}

// React.memo로 최적화: latestMetadata가 변경되지 않으면 리렌더링 방지
export default memo(LiveAnalysisSidebar, (prevProps, nextProps) => {
  // metadata가 없는 경우
  if (!prevProps.latestMetadata && !nextProps.latestMetadata) return true
  if (!prevProps.latestMetadata || !nextProps.latestMetadata) return false

  // analysis 깊은 비교
  const prevAnalysis = prevProps.latestMetadata.analysis
  const nextAnalysis = nextProps.latestMetadata.analysis

  if (!prevAnalysis && !nextAnalysis) return true
  if (!prevAnalysis || !nextAnalysis) return false

  // emotions 배열 비교
  const emotionsEqual = JSON.stringify(prevAnalysis.emotions) === JSON.stringify(nextAnalysis.emotions)
  const coreIssueEqual = prevAnalysis.coreIssue === nextAnalysis.coreIssue

  // riskAssessment 비교
  const prevRisk = prevProps.latestMetadata.riskAssessment
  const nextRisk = nextProps.latestMetadata.riskAssessment
  const riskEqual = JSON.stringify(prevRisk) === JSON.stringify(nextRisk)

  return emotionsEqual && coreIssueEqual && riskEqual
})
