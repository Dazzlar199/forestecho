'use client'

import { useState, useEffect } from 'react'
import { logger } from '@/lib/utils/logger'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import type { PsychologicalAnalysis } from '@/types/analysis'
import EmotionChart from '@/components/analysis/EmotionChart'
import LifeImpactChart from '@/components/analysis/LifeImpactChart'
import ScoreGauge from '@/components/analysis/ScoreGauge'
import RecommendedCareSection from '@/components/analysis/RecommendedCareSection'
import AnalysisDownload from '@/components/analysis/AnalysisDownload'
import AnalysisFeedback from '@/components/analysis/AnalysisFeedback'
import { useAuth } from '@/components/layout/AuthProvider'
import {
  FileText,
  Brain,
  Heart,
  Shield,
  Target,
  TrendingUp,
  AlertCircle,
  Sparkles,
  ArrowLeft,
} from 'lucide-react'

export default function AnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [analysis, setAnalysis] = useState<PsychologicalAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const analysisId = params.id as string
        const docRef = doc(db, 'psychologicalAnalyses', analysisId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setAnalysis({ id: docSnap.id, ...docSnap.data() } as PsychologicalAnalysis)
        } else {
          setError('분석 결과를 찾을 수 없습니다.')
        }
      } catch (err) {
        logger.error('Error fetching analysis:', err)
        setError('분석 결과를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchAnalysis()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-gray-400 animate-pulse mx-auto mb-4" />
          <p className="text-gray-400" style={{ fontWeight: 300, letterSpacing: '0.05em' }}>
            분석 결과를 불러오는 중...
          </p>
        </div>
      </div>
    )
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-6">{error || '분석 결과를 찾을 수 없습니다.'}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-white/5 border border-white/15 text-gray-300 hover:bg-white/10 transition-all"
            style={{ fontWeight: 300, letterSpacing: '0.05em' }}
          >
            돌아가기
          </button>
        </div>
      </div>
    )
  }

  const getRiskLevelColor = (level: string) => {
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

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'high':
        return '높음'
      case 'medium':
        return '중간'
      case 'low':
        return '낮음'
      default:
        return level
    }
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto" id="analysis-content">
        {/* 헤더 */}
        <div className="mb-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors mb-6"
            style={{ fontWeight: 300, letterSpacing: '0.02em' }}
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로 가기
          </button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1
                className="text-4xl text-gray-200 mb-2"
                style={{ fontWeight: 300, letterSpacing: '0.05em' }}
              >
                전문 심리 분석 리포트
              </h1>
              <p
                className="text-gray-500"
                style={{ fontWeight: 300, letterSpacing: '0.02em' }}
              >
                {new Date(analysis.generatedAt).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <AnalysisDownload analysisId={analysis.id} title="심리분석리포트" />
          </div>
        </div>

        {/* 요약 */}
        {analysis.summary && (
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/20 p-8 rounded-lg mb-12">
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h2
                  className="text-xl text-gray-200 mb-3"
                  style={{ fontWeight: 400, letterSpacing: '0.03em' }}
                >
                  종합 요약
                </h2>
                <p
                  className="text-gray-300"
                  style={{ fontWeight: 300, lineHeight: 1.8, letterSpacing: '0.01em' }}
                >
                  {analysis.summary}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 감정 상태 분석 */}
        {analysis.emotionalAnalysis && (
          <section className="mb-12">
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 p-10 rounded-lg">
              <div className="flex items-center gap-3 mb-8">
                <Heart className="w-6 h-6 text-pink-400" />
                <h2
                  className="text-2xl text-gray-200"
                  style={{ fontWeight: 400, letterSpacing: '0.03em' }}
                >
                  감정 상태 분석
                </h2>
              </div>

              {/* 주요 감정 */}
              {analysis.emotionalAnalysis.dominantEmotions && (
                <div className="mb-10">
                  <h3
                    className="text-gray-300 mb-6"
                    style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                  >
                    주요 감정 패턴
                  </h3>
                  <EmotionChart emotions={analysis.emotionalAnalysis.dominantEmotions} />
                </div>
              )}

              {/* 감정 안정성 */}
              {typeof analysis.emotionalAnalysis.emotionalStability === 'number' && (
                <div className="mb-10">
                  <h3
                    className="text-gray-300 mb-6"
                    style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                  >
                    감정 안정성
                  </h3>
                  <div className="flex justify-center">
                    <ScoreGauge
                      label="감정 조절 능력"
                      score={analysis.emotionalAnalysis.emotionalStability}
                    />
                  </div>
                </div>
              )}

              {/* 감정적 촉발 요인 */}
              {analysis.emotionalAnalysis.emotionalTriggers &&
                analysis.emotionalAnalysis.emotionalTriggers.length > 0 && (
                  <div className="mb-10">
                    <h3
                      className="text-gray-300 mb-4"
                      style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                    >
                      감정적 촉발 요인
                    </h3>
                    <ul className="space-y-3">
                      {analysis.emotionalAnalysis.emotionalTriggers.map((trigger, i) => (
                        <li
                          key={i}
                          className="text-gray-400 flex items-start gap-3"
                          style={{ fontWeight: 300, lineHeight: 1.7 }}
                        >
                          <span className="text-pink-400 flex-shrink-0">•</span>
                          {trigger}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* 숨겨진 감정 */}
              {analysis.emotionalAnalysis.hiddenEmotions && (
                <div className="bg-black/30 p-6 rounded-lg border border-white/5">
                  <h3
                    className="text-gray-300 mb-3"
                    style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                  >
                    표면 이면의 깊은 감정
                  </h3>
                  <p
                    className="text-gray-400"
                    style={{ fontWeight: 300, lineHeight: 1.8 }}
                  >
                    {analysis.emotionalAnalysis.hiddenEmotions}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 인지 패턴 분석 */}
        {analysis.cognitiveAnalysis && (
          <section className="mb-12">
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 p-10 rounded-lg">
              <div className="flex items-center gap-3 mb-8">
                <Brain className="w-6 h-6 text-purple-400" />
                <h2
                  className="text-2xl text-gray-200"
                  style={{ fontWeight: 400, letterSpacing: '0.03em' }}
                >
                  인지 패턴 분석
                </h2>
              </div>

              {/* 점수 게이지들 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {typeof analysis.cognitiveAnalysis.selfEsteem === 'number' && (
                  <ScoreGauge label="자존감 수준" score={analysis.cognitiveAnalysis.selfEsteem} />
                )}
                {typeof analysis.cognitiveAnalysis.selfEfficacy === 'number' && (
                  <ScoreGauge
                    label="자기효능감"
                    score={analysis.cognitiveAnalysis.selfEfficacy}
                  />
                )}
              </div>

              {/* 자동적 사고 */}
              {analysis.cognitiveAnalysis.automaticThoughts &&
                analysis.cognitiveAnalysis.automaticThoughts.length > 0 && (
                  <div className="mb-8">
                    <h3
                      className="text-gray-300 mb-4"
                      style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                    >
                      자동적 사고 패턴
                    </h3>
                    <ul className="space-y-3">
                      {analysis.cognitiveAnalysis.automaticThoughts.map((thought, i) => (
                        <li
                          key={i}
                          className="text-gray-400 flex items-start gap-3"
                          style={{ fontWeight: 300, lineHeight: 1.7 }}
                        >
                          <span className="text-purple-400 flex-shrink-0">•</span>
                          {thought}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* 인지적 왜곡 */}
              {analysis.cognitiveAnalysis.cognitiveDistortions &&
                analysis.cognitiveAnalysis.cognitiveDistortions.length > 0 && (
                  <div className="mb-8">
                    <h3
                      className="text-gray-300 mb-4"
                      style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                    >
                      인지적 왜곡
                    </h3>
                    <div className="space-y-4">
                      {analysis.cognitiveAnalysis.cognitiveDistortions.map((distortion, i) => (
                        <div
                          key={i}
                          className="bg-black/30 p-5 rounded-lg border border-white/5"
                        >
                          <h4
                            className="text-gray-300 mb-2"
                            style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                          >
                            {distortion.type}
                          </h4>
                          <p
                            className="text-gray-400 mb-3"
                            style={{ fontWeight: 300, lineHeight: 1.7 }}
                          >
                            {distortion.description}
                          </p>
                          {distortion.examples && distortion.examples.length > 0 && (
                            <div>
                              <p className="text-sm text-gray-500 mb-2">예시:</p>
                              <ul className="space-y-1">
                                {distortion.examples.map((example, j) => (
                                  <li
                                    key={j}
                                    className="text-sm text-gray-500 ml-4"
                                    style={{ fontWeight: 300 }}
                                  >
                                    - {example}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* 핵심 믿음 */}
              {analysis.cognitiveAnalysis.coreBeliefs &&
                analysis.cognitiveAnalysis.coreBeliefs.length > 0 && (
                  <div>
                    <h3
                      className="text-gray-300 mb-4"
                      style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                    >
                      핵심 믿음
                    </h3>
                    <ul className="space-y-3">
                      {analysis.cognitiveAnalysis.coreBeliefs.map((belief, i) => (
                        <li
                          key={i}
                          className="text-gray-400 flex items-start gap-3"
                          style={{ fontWeight: 300, lineHeight: 1.7 }}
                        >
                          <span className="text-purple-400 flex-shrink-0">•</span>
                          {belief}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </section>
        )}

        {/* 핵심 심리적 이슈 */}
        {analysis.coreIssue && (
          <section className="mb-12">
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 p-10 rounded-lg">
              <div className="flex items-center gap-3 mb-8">
                <Target className="w-6 h-6 text-red-400" />
                <h2
                  className="text-2xl text-gray-200"
                  style={{ fontWeight: 400, letterSpacing: '0.03em' }}
                >
                  핵심 심리적 이슈
                </h2>
              </div>

              {/* 삶의 영향도 */}
              {analysis.coreIssue.impactOnLife && (
                <div className="mb-10">
                  <h3
                    className="text-gray-300 mb-6"
                    style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                  >
                    일상생활에 미치는 영향
                  </h3>
                  <LifeImpactChart impact={analysis.coreIssue.impactOnLife} />
                </div>
              )}

              {/* 표면적 문제 */}
              {analysis.coreIssue.surfaceProblems &&
                analysis.coreIssue.surfaceProblems.length > 0 && (
                  <div className="mb-8">
                    <h3
                      className="text-gray-300 mb-4"
                      style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                    >
                      표면적 문제
                    </h3>
                    <ul className="space-y-3">
                      {analysis.coreIssue.surfaceProblems.map((problem, i) => (
                        <li
                          key={i}
                          className="text-gray-400 flex items-start gap-3"
                          style={{ fontWeight: 300, lineHeight: 1.7 }}
                        >
                          <span className="text-red-400 flex-shrink-0">•</span>
                          {problem}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* 근본 원인 */}
              {analysis.coreIssue.rootCauses && analysis.coreIssue.rootCauses.length > 0 && (
                <div className="mb-8">
                  <h3
                    className="text-gray-300 mb-4"
                    style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                  >
                    근본 원인
                  </h3>
                  <ul className="space-y-3">
                    {analysis.coreIssue.rootCauses.map((cause, i) => (
                      <li
                        key={i}
                        className="text-gray-400 flex items-start gap-3"
                        style={{ fontWeight: 300, lineHeight: 1.7 }}
                      >
                        <span className="text-red-400 flex-shrink-0">•</span>
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 반복 패턴 */}
              {analysis.coreIssue.patterns && analysis.coreIssue.patterns.length > 0 && (
                <div>
                  <h3
                    className="text-gray-300 mb-4"
                    style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                  >
                    반복되는 패턴
                  </h3>
                  <ul className="space-y-3">
                    {analysis.coreIssue.patterns.map((pattern, i) => (
                      <li
                        key={i}
                        className="text-gray-400 flex items-start gap-3"
                        style={{ fontWeight: 300, lineHeight: 1.7 }}
                      >
                        <span className="text-red-400 flex-shrink-0">•</span>
                        {pattern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 강점 및 자원 */}
        {analysis.strengthsAndResources && (
          <section className="mb-12">
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 p-10 rounded-lg">
              <div className="flex items-center gap-3 mb-8">
                <Shield className="w-6 h-6 text-green-400" />
                <h2
                  className="text-2xl text-gray-200"
                  style={{ fontWeight: 400, letterSpacing: '0.03em' }}
                >
                  강점 및 자원
                </h2>
              </div>

              {/* 점수 게이지들 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {typeof analysis.strengthsAndResources.resilience === 'number' && (
                  <ScoreGauge
                    label="회복탄력성"
                    score={analysis.strengthsAndResources.resilience}
                  />
                )}
                {typeof analysis.strengthsAndResources.problemSolving === 'number' && (
                  <ScoreGauge
                    label="문제해결 능력"
                    score={analysis.strengthsAndResources.problemSolving}
                  />
                )}
              </div>

              {/* 사회적 지지 */}
              {analysis.strengthsAndResources.socialSupport &&
                analysis.strengthsAndResources.socialSupport.length > 0 && (
                  <div className="mb-8">
                    <h3
                      className="text-gray-300 mb-4"
                      style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                    >
                      사회적 지지 체계
                    </h3>
                    <ul className="space-y-3">
                      {analysis.strengthsAndResources.socialSupport.map((support, i) => (
                        <li
                          key={i}
                          className="text-gray-400 flex items-start gap-3"
                          style={{ fontWeight: 300, lineHeight: 1.7 }}
                        >
                          <span className="text-green-400 flex-shrink-0">•</span>
                          {support}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* 내적 자원 */}
              {analysis.strengthsAndResources.internalResources &&
                analysis.strengthsAndResources.internalResources.length > 0 && (
                  <div>
                    <h3
                      className="text-gray-300 mb-4"
                      style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                    >
                      내적 자원
                    </h3>
                    <ul className="space-y-3">
                      {analysis.strengthsAndResources.internalResources.map((resource, i) => (
                        <li
                          key={i}
                          className="text-gray-400 flex items-start gap-3"
                          style={{ fontWeight: 300, lineHeight: 1.7 }}
                        >
                          <span className="text-green-400 flex-shrink-0">•</span>
                          {resource}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </section>
        )}

        {/* 위험 요소 평가 */}
        {analysis.riskAssessment && (
          <section className="mb-12">
            <div
              className={`backdrop-blur-xl border p-10 rounded-lg ${
                analysis.riskAssessment.riskLevel === 'high'
                  ? 'bg-red-500/10 border-red-500/30'
                  : analysis.riskAssessment.riskLevel === 'medium'
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : 'bg-green-500/10 border-green-500/30'
              }`}
            >
              <div className="flex items-center gap-3 mb-8">
                <AlertCircle
                  className={`w-6 h-6 ${
                    analysis.riskAssessment.riskLevel === 'high'
                      ? 'text-red-400'
                      : analysis.riskAssessment.riskLevel === 'medium'
                      ? 'text-yellow-400'
                      : 'text-green-400'
                  }`}
                />
                <h2
                  className="text-2xl text-gray-200"
                  style={{ fontWeight: 400, letterSpacing: '0.03em' }}
                >
                  위험 요소 평가
                </h2>
              </div>

              {/* 위험 수준 */}
              <div className="mb-8">
                <div className="flex items-center gap-4">
                  <span className="text-gray-400">위험 수준:</span>
                  <span
                    className={`px-4 py-2 rounded-full border text-sm ${getRiskLevelColor(
                      analysis.riskAssessment.riskLevel
                    )}`}
                    style={{ fontWeight: 400, letterSpacing: '0.05em' }}
                  >
                    {getRiskLevelText(analysis.riskAssessment.riskLevel)}
                  </span>
                </div>
              </div>

              {/* 우려 사항 */}
              {analysis.riskAssessment.concerns && analysis.riskAssessment.concerns.length > 0 && (
                <div className="mb-8">
                  <h3
                    className="text-gray-300 mb-4"
                    style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                  >
                    우려 사항
                  </h3>
                  <ul className="space-y-3">
                    {analysis.riskAssessment.concerns.map((concern, i) => (
                      <li
                        key={i}
                        className="text-gray-400 flex items-start gap-3"
                        style={{ fontWeight: 300, lineHeight: 1.7 }}
                      >
                        <span
                          className={`flex-shrink-0 ${
                            analysis.riskAssessment.riskLevel === 'high'
                              ? 'text-red-400'
                              : analysis.riskAssessment.riskLevel === 'medium'
                              ? 'text-yellow-400'
                              : 'text-green-400'
                          }`}
                        >
                          •
                        </span>
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 전문가 도움 필요 여부 */}
              {analysis.riskAssessment.professionalHelpNeeded && (
                <div className="bg-black/30 p-6 rounded-lg border border-white/10">
                  <p
                    className="text-gray-300"
                    style={{ fontWeight: 400, lineHeight: 1.8 }}
                  >
                    ⚠️ 전문가의 도움이 권장됩니다. 정신건강의학과 또는 심리상담센터를
                    방문하시는 것을 고려해보세요.
                  </p>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>긴급 상담 전화:</p>
                    <p>• 자살예방상담전화: 1393</p>
                    <p>• 정신건강위기상담: 1577-0199</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 실천 방안 */}
        {analysis.actionPlan && (
          <section className="mb-12">
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 p-10 rounded-lg">
              <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                <h2
                  className="text-2xl text-gray-200"
                  style={{ fontWeight: 400, letterSpacing: '0.03em' }}
                >
                  맞춤형 실천 방안
                </h2>
              </div>

              {/* 즉시 실천 */}
              {analysis.actionPlan.immediate && (
                <div className="mb-10">
                  <h3
                    className="text-gray-300 mb-4"
                    style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                  >
                    1단계: 즉시 실천 (1-2주)
                  </h3>
                  <div className="bg-black/30 p-6 rounded-lg border border-white/5 mb-4">
                    {analysis.actionPlan.immediate.tasks &&
                      analysis.actionPlan.immediate.tasks.length > 0 && (
                        <ul className="space-y-3 mb-4">
                          {analysis.actionPlan.immediate.tasks.map((task, i) => (
                            <li
                              key={i}
                              className="text-gray-400 flex items-start gap-3"
                              style={{ fontWeight: 300, lineHeight: 1.7 }}
                            >
                              <span className="text-blue-400 flex-shrink-0">✓</span>
                              {task}
                            </li>
                          ))}
                        </ul>
                      )}
                    {analysis.actionPlan.immediate.expectedOutcome && (
                      <p
                        className="text-sm text-gray-500 italic"
                        style={{ fontWeight: 300 }}
                      >
                        예상 효과: {analysis.actionPlan.immediate.expectedOutcome}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 중기 목표 */}
              {analysis.actionPlan.shortTerm && (
                <div className="mb-10">
                  <h3
                    className="text-gray-300 mb-4"
                    style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                  >
                    2단계: 중기 목표 (1-2개월)
                  </h3>
                  <div className="bg-black/30 p-6 rounded-lg border border-white/5">
                    {analysis.actionPlan.shortTerm.tasks &&
                      analysis.actionPlan.shortTerm.tasks.length > 0 && (
                        <ul className="space-y-3">
                          {analysis.actionPlan.shortTerm.tasks.map((task, i) => (
                            <li
                              key={i}
                              className="text-gray-400 flex items-start gap-3"
                              style={{ fontWeight: 300, lineHeight: 1.7 }}
                            >
                              <span className="text-blue-400 flex-shrink-0">✓</span>
                              {task}
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>
                </div>
              )}

              {/* 장기 목표 */}
              {analysis.actionPlan.longTerm && (
                <div className="mb-10">
                  <h3
                    className="text-gray-300 mb-4"
                    style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                  >
                    3단계: 장기 목표 (3-6개월)
                  </h3>
                  <div className="bg-black/30 p-6 rounded-lg border border-white/5">
                    {analysis.actionPlan.longTerm.goals &&
                      analysis.actionPlan.longTerm.goals.length > 0 && (
                        <ul className="space-y-3">
                          {analysis.actionPlan.longTerm.goals.map((goal, i) => (
                            <li
                              key={i}
                              className="text-gray-400 flex items-start gap-3"
                              style={{ fontWeight: 300, lineHeight: 1.7 }}
                            >
                              <span className="text-blue-400 flex-shrink-0">✓</span>
                              {goal}
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>
                </div>
              )}

              {/* 권장 심리 기법 */}
              {analysis.actionPlan.recommendedTechniques &&
                analysis.actionPlan.recommendedTechniques.length > 0 && (
                  <div>
                    <h3
                      className="text-gray-300 mb-4"
                      style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                    >
                      권장 심리 기법
                    </h3>
                    <div className="space-y-4">
                      {analysis.actionPlan.recommendedTechniques.map((technique, i) => (
                        <div
                          key={i}
                          className="bg-black/30 p-5 rounded-lg border border-white/5"
                        >
                          <h4
                            className="text-gray-300 mb-2"
                            style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                          >
                            {technique.name}
                          </h4>
                          <p
                            className="text-gray-400 mb-3"
                            style={{ fontWeight: 300, lineHeight: 1.7 }}
                          >
                            {technique.description}
                          </p>
                          {technique.howTo && (
                            <div>
                              <p className="text-sm text-gray-500 mb-2">실천 방법:</p>
                              <p
                                className="text-sm text-gray-500"
                                style={{ fontWeight: 300, lineHeight: 1.7 }}
                              >
                                {technique.howTo}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </section>
        )}

        {/* 희망적 전망 */}
        {analysis.prognosis && (
          <section className="mb-12">
            <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 backdrop-blur-xl border border-white/20 p-10 rounded-lg">
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="w-6 h-6 text-green-400" />
                <h2
                  className="text-2xl text-gray-200"
                  style={{ fontWeight: 400, letterSpacing: '0.03em' }}
                >
                  희망적 전망
                </h2>
              </div>

              {/* 회복 가능성 */}
              {typeof analysis.prognosis.recoveryPotential === 'number' && (
                <div className="mb-10 flex justify-center">
                  <ScoreGauge
                    label="회복 가능성"
                    score={analysis.prognosis.recoveryPotential}
                  />
                </div>
              )}

              {/* 긍정적 요인 */}
              {analysis.prognosis.positiveFactors &&
                analysis.prognosis.positiveFactors.length > 0 && (
                  <div className="mb-8">
                    <h3
                      className="text-gray-300 mb-4"
                      style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                    >
                      긍정적 예후 요인
                    </h3>
                    <ul className="space-y-3">
                      {analysis.prognosis.positiveFactors.map((factor, i) => (
                        <li
                          key={i}
                          className="text-gray-400 flex items-start gap-3"
                          style={{ fontWeight: 300, lineHeight: 1.7 }}
                        >
                          <span className="text-green-400 flex-shrink-0">✓</span>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* 격려 메시지 */}
              {analysis.prognosis.encouragingMessage && (
                <div className="bg-black/30 p-8 rounded-lg border border-white/10">
                  <p
                    className="text-gray-300 text-center"
                    style={{ fontWeight: 400, lineHeight: 2, letterSpacing: '0.02em' }}
                  >
                    {analysis.prognosis.encouragingMessage}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Recommended Care Section */}
        <RecommendedCareSection
          riskLevel={analysis.riskAssessment?.riskLevel}
          recoveryPotential={analysis.prognosis?.recoveryPotential}
        />

        {/* Feedback Section */}
        <section className="mb-12">
          <AnalysisFeedback analysisId={analysis.id} userId={user?.uid} />
        </section>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 mt-16">
          <p style={{ fontWeight: 300, letterSpacing: '0.02em' }}>
            이 분석은 AI 기반 심리 분석 도구로 생성되었으며, 전문 의료 진단을 대체할 수
            없습니다.
          </p>
          <p style={{ fontWeight: 300, letterSpacing: '0.02em' }}>
            지속적인 심리적 어려움이 있으시다면 전문가와 상담하시기를 권장합니다.
          </p>
        </div>
      </div>
    </div>
  )
}
