'use client'

import { useState, useEffect } from 'react'
import { logger } from '@/lib/utils/logger'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/layout/AuthProvider'
import { useTheme } from '@/components/layout/ThemeProvider'
import { useLanguage } from '@/components/layout/LanguageProvider'
import NicknameModal from '@/components/profile/NicknameModal'
import AnalysisHistoryCard from '@/components/analysis/AnalysisHistoryCard'
import ForestVisualization from '@/components/forest/ForestVisualization'
import DeleteDataModal from '@/components/forest/DeleteDataModal'
import InitialAssessmentModal from '@/components/mental-health/InitialAssessmentModal'
import { getUserAnalyses, deleteAllUserAnalyses } from '@/lib/firebase/analysis'
import {
  getMentalHealthProfile,
  updateHealthScore,
  resetMentalHealthProfile,
} from '@/lib/firebase/mental-health'
import {
  calculateCurrentHealthScore,
  calculateHealthTrend,
  getForestState,
  FOREST_STATE_INFO,
  getTrendMessage,
} from '@/lib/mental-health/forest-state'
import type { PsychologicalAnalysis } from '@/types/analysis'
import type { MentalHealthProfile } from '@/types/mental-health'
import { Heart, Calendar, Brain, Edit2, FileText, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import EmotionJourneySection from '@/components/emotion/EmotionJourneySection'
import { ReferralDashboard } from '@/components/referral/ReferralDashboard'

export default function MyForestPage() {
  const { user, loading } = useAuth()
  const { theme } = useTheme()
  const { language } = useLanguage()
  const router = useRouter()
  const [showNicknameModal, setShowNicknameModal] = useState(false)
  const [showAssessment, setShowAssessment] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [analyses, setAnalyses] = useState<PsychologicalAnalysis[]>([])
  const [mentalHealth, setMentalHealth] = useState<MentalHealthProfile | null>(null)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      setLoadingData(true)
      try {
        // 멘탈 헬스 프로필 & 분석 데이터 병렬 로드
        const [profile, userAnalyses] = await Promise.all([
          getMentalHealthProfile(user.uid),
          getUserAnalyses(user.uid, 20),
        ])

        setAnalyses(userAnalyses)

        if (!profile || !profile.hasCompletedAssessment) {
          // 초기 평가 필요
          setShowAssessment(true)
          setMentalHealth(null)
        } else {
          // 프로필 있음 - 최신 분석으로 건강도 재계산
          const newHealthScore = calculateCurrentHealthScore(
            profile.initialAssessment!.initialHealthScore,
            userAnalyses
          )
          const newTrend = calculateHealthTrend(userAnalyses)
          const newForestState = getForestState(newHealthScore)

          // 변경사항 있으면 업데이트
          if (
            newHealthScore !== profile.currentHealthScore ||
            newForestState !== profile.forestState ||
            newTrend !== profile.trend
          ) {
            await updateHealthScore(user.uid, newHealthScore, newForestState, newTrend)
            setMentalHealth({
              ...profile,
              currentHealthScore: newHealthScore,
              forestState: newForestState,
              trend: newTrend,
            })
          } else {
            setMentalHealth(profile)
          }
        }
      } catch (error) {
        logger.error('Error fetching forest data:', error)
      } finally {
        setLoadingData(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  const handleAssessmentComplete = async () => {
    setShowAssessment(false)
    // 데이터 재로드
    if (user) {
      const profile = await getMentalHealthProfile(user.uid)
      setMentalHealth(profile)
    }
  }

  const handleDeleteAllData = async () => {
    if (!user) return

    try {
      await Promise.all([
        deleteAllUserAnalyses(user.uid),
        resetMentalHealthProfile(user.uid),
      ])

      setAnalyses([])
      setMentalHealth(null)
      setShowAssessment(true)

      const deletedMsg = language === 'ko' ? '모든 데이터가 삭제되었습니다.' :
                         language === 'en' ? 'All data has been deleted.' :
                         language === 'ja' ? 'すべてのデータが削除されました。' :
                         '所有数据已删除。'
      alert(deletedMsg)
    } catch (error) {
      logger.error('Error deleting all data:', error)
      throw error
    }
  }

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {language === 'ko' && '로딩 중...'}
          {language === 'en' && 'Loading...'}
          {language === 'ja' && '読み込み中...'}
          {language === 'zh' && '加载中...'}
        </div>
      </div>
    )
  }

  if (!user) return null

  const displayName = user.displayName || user.email?.split('@')[0] || 'User'
  const forestInfo = mentalHealth
    ? FOREST_STATE_INFO[mentalHealth.forestState]
    : FOREST_STATE_INFO.sprouting

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className={`text-3xl font-light ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              {displayName}
              {language === 'ko' && '님의 마음의 숲'}
              {language === 'en' && "'s Mind Forest"}
              {language === 'ja' && 'さんの心の森'}
              {language === 'zh' && '的心灵森林'}
            </h1>
            <button
              onClick={() => setShowNicknameModal(true)}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === 'dark' ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-gray-200/50 text-gray-600'
              }`}
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Forest State Card */}
        {mentalHealth && (
          <div className={`mb-10 p-8 rounded-2xl border text-center ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/30'
              : 'bg-gradient-to-br from-emerald-50 to-transparent border-emerald-200'
          }`}>
            <div className="text-6xl mb-4">{forestInfo.emoji}</div>
            <h2 className={`text-2xl font-light mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              {forestInfo.name[language as 'ko' | 'en' | 'ja' | 'zh']}
            </h2>
            <p className={`text-base mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {forestInfo.description[language as 'ko' | 'en' | 'ja' | 'zh']}
            </p>

            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="text-center">
                <div className={`text-4xl font-light mb-1 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {mentalHealth.currentHealthScore}
                </div>
                <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                  {language === 'ko' && '건강도'}
                  {language === 'en' && 'Health'}
                  {language === 'ja' && '健康度'}
                  {language === 'zh' && '健康度'}
                </div>
              </div>

              <div className="text-center">
                <div className={`text-lg font-light mb-1 ${
                  mentalHealth.trend === 'improving'
                    ? 'text-green-500'
                    : mentalHealth.trend === 'declining'
                    ? 'text-red-500'
                    : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {getTrendMessage(mentalHealth.trend, language)}
                </div>
                <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                  {language === 'ko' && '추세'}
                  {language === 'en' && 'Trend'}
                  {language === 'ja' && 'トレンド'}
                  {language === 'zh' && '趋势'}
                </div>
              </div>

              <div className="text-center">
                <div className={`text-4xl font-light mb-1 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {analyses.length}
                </div>
                <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                  {language === 'ko' && '대화'}
                  {language === 'en' && 'Talks'}
                  {language === 'ja' && '会話'}
                  {language === 'zh' && '对话'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Forest Visualization */}
        <div className={`mb-10 rounded-xl border overflow-hidden ${
          theme === 'dark'
            ? 'bg-black/30 border-emerald-500/20'
            : 'bg-white/40 border-emerald-200'
        }`} style={{ height: '450px' }}>
          <ForestVisualization
            data={{
              analysisCount: analyses.length,
              averageRecoveryPotential: mentalHealth?.currentHealthScore || 50,
              riskLevel: 'low',
            }}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          <Link href="/emotion" className={`p-6 rounded-lg border transition-colors ${
            theme === 'dark'
              ? 'bg-transparent border-emerald-500/20 hover:border-emerald-500/40'
              : 'bg-white/30 border-emerald-200 hover:border-emerald-300'
          }`}>
            <div className="text-center">
              <Heart className={`w-8 h-8 mx-auto mb-3 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <h3 className={`text-base font-normal mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                {language === 'ko' && '감정 기록'}
                {language === 'en' && 'Emotions'}
                {language === 'ja' && '感情記録'}
                {language === 'zh' && '情绪'}
              </h3>
            </div>
          </Link>

          <Link href="/checkin" className={`p-6 rounded-lg border transition-colors ${
            theme === 'dark'
              ? 'bg-transparent border-emerald-500/20 hover:border-emerald-500/40'
              : 'bg-white/30 border-emerald-200 hover:border-emerald-300'
          }`}>
            <div className="text-center">
              <Calendar className={`w-8 h-8 mx-auto mb-3 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <h3 className={`text-base font-normal mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                {language === 'ko' && '체크인'}
                {language === 'en' && 'Check-in'}
                {language === 'ja' && 'チェックイン'}
                {language === 'zh' && '签到'}
              </h3>
            </div>
          </Link>

          <Link href="/assessment" className={`p-6 rounded-lg border transition-colors ${
            theme === 'dark'
              ? 'bg-transparent border-emerald-500/20 hover:border-emerald-500/40'
              : 'bg-white/30 border-emerald-200 hover:border-emerald-300'
          }`}>
            <div className="text-center">
              <Brain className={`w-8 h-8 mx-auto mb-3 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <h3 className={`text-base font-normal mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                {language === 'ko' && '자가진단'}
                {language === 'en' && 'Assessment'}
                {language === 'ja' && 'チェック'}
                {language === 'zh' && '评估'}
              </h3>
            </div>
          </Link>
        </div>

        {/* Emotion Journey */}
        <div className="mt-16">
          <h2 className={`text-xl font-normal mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {language === 'ko' && '감정 여정'}
            {language === 'en' && 'Emotion Journey'}
            {language === 'ja' && '感情の旅'}
            {language === 'zh' && '情绪旅程'}
          </h2>
          <EmotionJourneySection userId={user.uid} theme={theme} language={language} />
        </div>

        {/* Referral */}
        <div className="mt-16">
          <h2 className={`text-xl font-normal mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {language === 'ko' && '친구 초대'}
            {language === 'en' && 'Invite Friends'}
            {language === 'ja' && '友達を招待'}
            {language === 'zh' && '邀请朋友'}
          </h2>
          <ReferralDashboard />
        </div>

        {/* Analysis History */}
        {analyses.length > 0 && (
          <div className="mt-16">
            <h2 className={`text-xl font-normal mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {language === 'ko' && '대화 기록'}
              {language === 'en' && 'Chat History'}
              {language === 'ja' && '会話履歴'}
              {language === 'zh' && '对话记录'}
            </h2>

            <div className="space-y-4 sm:space-y-6">
              {analyses.map((analysis) => (
                <AnalysisHistoryCard key={analysis.id} analysis={analysis} />
              ))}
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className="mt-20 pt-10 border-t border-red-500/20">
          <h2 className={`text-xl font-normal mb-4 text-center ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
            {language === 'ko' && '⚠️ 위험 구역'}
            {language === 'en' && '⚠️ Danger Zone'}
            {language === 'ja' && '⚠️ 危険ゾーン'}
            {language === 'zh' && '⚠️ 危险区域'}
          </h2>
          <p className={`text-sm text-center mb-6 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
            {language === 'ko' && '이 작업들은 되돌릴 수 없습니다. 신중하게 결정하세요.'}
            {language === 'en' && 'These actions cannot be undone. Please decide carefully.'}
            {language === 'ja' && 'これらの操作は元に戻せません。慎重に決定してください。'}
            {language === 'zh' && '这些操作无法撤消。请谨慎决定。'}
          </p>

          <div className="max-w-md mx-auto space-y-3">
            <button
              onClick={() => setShowAssessment(true)}
              className={`w-full p-4 rounded-lg border transition-all ${
                theme === 'dark'
                  ? 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 text-blue-400'
                  : 'bg-blue-50 border-blue-300 hover:bg-blue-100 text-blue-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5" />
                <span>
                  {language === 'ko' && '건강 상태 재평가'}
                  {language === 'en' && 'Re-assess Health'}
                  {language === 'ja' && '健康状態の再評価'}
                  {language === 'zh' && '重新评估健康'}
                </span>
              </div>
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className={`w-full p-4 rounded-lg border transition-all ${
                theme === 'dark'
                  ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-400'
                  : 'bg-red-50 border-red-300 hover:bg-red-100 text-red-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                <span>
                  {language === 'ko' && '모든 데이터 삭제'}
                  {language === 'en' && 'Delete All Data'}
                  {language === 'ja' && 'すべてのデータを削除'}
                  {language === 'zh' && '删除所有数据'}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <NicknameModal
        isOpen={showNicknameModal}
        onClose={() => setShowNicknameModal(false)}
      />

      <InitialAssessmentModal
        isOpen={showAssessment}
        userId={user.uid}
        onComplete={handleAssessmentComplete}
      />

      <DeleteDataModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAllData}
      />
    </div>
  )
}
