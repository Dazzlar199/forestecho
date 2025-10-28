'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/layout/AuthProvider'
import { useTheme } from '@/components/layout/ThemeProvider'
import { useLanguage } from '@/components/layout/LanguageProvider'
import NicknameModal from '@/components/profile/NicknameModal'
import AnalysisHistoryCard from '@/components/analysis/AnalysisHistoryCard'
import AnalysisStatsCard from '@/components/analysis/AnalysisStatsCard'
import ForestVisualization from '@/components/forest/ForestVisualization'
import QuickCareLinks from '@/components/forest/QuickCareLinks'
import LevelUpModal from '@/components/forest/LevelUpModal'
import { getUserAnalyses, getUserAnalysisStats } from '@/lib/firebase/analysis'
import { calculateForestLevel } from '@/lib/forest-level'
import type { PsychologicalAnalysis } from '@/types/analysis'
import type { UserForestData } from '@/lib/forest-level'
import { Heart, Calendar, Brain, Edit2, Sparkles, TreePine, FileText } from 'lucide-react'
import Link from 'next/link'

export default function MyForestPage() {
  const { user, loading } = useAuth()
  const { theme } = useTheme()
  const { language } = useLanguage()
  const router = useRouter()
  const [showNicknameModal, setShowNicknameModal] = useState(false)
  const [analyses, setAnalyses] = useState<PsychologicalAnalysis[]>([])
  const [analysisStats, setAnalysisStats] = useState<{
    totalAnalyses: number
    averageRiskLevel: 'low' | 'medium' | 'high'
    averageRecoveryPotential: number
  }>({
    totalAnalyses: 0,
    averageRiskLevel: 'low',
    averageRecoveryPotential: 0,
  })
  const [loadingAnalyses, setLoadingAnalyses] = useState(true)
  const [showLevelUpModal, setShowLevelUpModal] = useState(false)
  const [newLevel, setNewLevel] = useState(1)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  // 분석 데이터 가져오기 및 레벨 변화 감지
  useEffect(() => {
    const fetchAnalyses = async () => {
      if (!user) return

      setLoadingAnalyses(true)
      try {
        const [userAnalyses, stats] = await Promise.all([
          getUserAnalyses(user.uid, 10),
          getUserAnalysisStats(user.uid),
        ])

        setAnalyses(userAnalyses)
        setAnalysisStats(stats)

        // 레벨 계산
        const forestData: UserForestData = {
          analysisCount: stats.totalAnalyses,
          averageRecoveryPotential: stats.averageRecoveryPotential,
          riskLevel: stats.averageRiskLevel,
        }
        const currentLevel = calculateForestLevel(forestData)

        // 이전 레벨과 비교
        const previousLevelKey = `forest_level_${user.uid}`
        const previousLevel = parseInt(localStorage.getItem(previousLevelKey) || '0')

        if (previousLevel > 0 && currentLevel > previousLevel) {
          // 레벨업!
          setNewLevel(currentLevel)
          setShowLevelUpModal(true)
        }

        // 현재 레벨 저장
        localStorage.setItem(previousLevelKey, currentLevel.toString())
      } catch (error) {
        console.error('Error fetching analyses:', error)
      } finally {
        setLoadingAnalyses(false)
      }
    }

    if (user) {
      fetchAnalyses()
    }
  }, [user])

  if (loading) {
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

  return (
    <div className="min-h-screen py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TreePine className={`w-10 h-10 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-light ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`} style={{ letterSpacing: '0.1em' }}>
              {language === 'ko' && '나의 숲'}
              {language === 'en' && 'My Forest'}
              {language === 'ja' && 'マイフォレスト'}
              {language === 'zh' && '我的森林'}
            </h1>
          </div>

          <div className="flex items-center justify-center gap-3 mb-2">
            <p className={`text-lg sm:text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              style={{ fontWeight: 300, letterSpacing: '0.05em' }}>
              {language === 'ko' && `${displayName}님의 숲`}
              {language === 'en' && `${displayName}'s Forest`}
              {language === 'ja' && `${displayName}さんの森`}
              {language === 'zh' && `${displayName}的森林`}
            </p>
            <button
              onClick={() => setShowNicknameModal(true)}
              className={`p-2 rounded-full transition-colors ${
                theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-200/50 text-gray-600'
              }`}
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}
            style={{ fontWeight: 300, letterSpacing: '0.03em' }}>
            {language === 'ko' && '당신의 마음을 가꾸는 공간'}
            {language === 'en' && 'A space to nurture your mind'}
            {language === 'ja' && '心を育む空間'}
            {language === 'zh' && '培育心灵的空间'}
          </p>
        </div>

        {/* Forest Visualization */}
        <div className={`mb-8 sm:mb-12 rounded-lg border overflow-hidden ${
          theme === 'dark'
            ? 'bg-black/20 border-white/10'
            : 'bg-white/40 border-gray-300'
        }`} style={{ height: '400px' }}>
          <ForestVisualization
            data={{
              analysisCount: analysisStats.totalAnalyses,
              averageRecoveryPotential: analysisStats.averageRecoveryPotential,
              riskLevel: analysisStats.averageRiskLevel,
            }}
          />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className={`p-4 sm:p-6 rounded-lg border backdrop-blur-md ${
            theme === 'dark'
              ? 'bg-white/5 border-white/10'
              : 'bg-white/40 border-gray-300'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <h3 className={`text-base sm:text-lg font-light ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                {language === 'ko' && '연속 체크인'}
                {language === 'en' && 'Streak'}
                {language === 'ja' && '連続チェックイン'}
                {language === 'zh' && '连续签到'}
              </h3>
            </div>
            <p className={`text-2xl sm:text-3xl font-light ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              0 {language === 'ko' ? '일' : language === 'en' ? 'days' : language === 'ja' ? '日' : '天'}
            </p>
          </div>

          <div className={`p-4 sm:p-6 rounded-lg border backdrop-blur-md ${
            theme === 'dark'
              ? 'bg-white/5 border-white/10'
              : 'bg-white/40 border-gray-300'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <Heart className={`w-5 h-5 ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`} />
              <h3 className={`text-base sm:text-lg font-light ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                {language === 'ko' && '감정 기록'}
                {language === 'en' && 'Emotions Logged'}
                {language === 'ja' && '感情記録'}
                {language === 'zh' && '情绪记录'}
              </h3>
            </div>
            <p className={`text-2xl sm:text-3xl font-light ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              0 {language === 'ko' ? '회' : language === 'en' ? 'times' : language === 'ja' ? '回' : '次'}
            </p>
          </div>

          <div className={`p-4 sm:p-6 rounded-lg border backdrop-blur-md ${
            theme === 'dark'
              ? 'bg-white/5 border-white/10'
              : 'bg-white/40 border-gray-300'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <Brain className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              <h3 className={`text-base sm:text-lg font-light ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                {language === 'ko' && '자가진단'}
                {language === 'en' && 'Assessments'}
                {language === 'ja' && 'セルフチェック'}
                {language === 'zh' && '自我评估'}
              </h3>
            </div>
            <p className={`text-2xl sm:text-3xl font-light ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              0 {language === 'ko' ? '회' : language === 'en' ? 'times' : language === 'ja' ? '回' : '次'}
            </p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Emotion Tracking */}
          <Link href="/emotion" className="group">
            <div className={`p-4 sm:p-6 md:p-8 rounded-lg border backdrop-blur-md transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-pink-500/10 border-pink-500/30 hover:bg-pink-500/20 hover:border-pink-500/50'
                : 'bg-pink-100/60 border-pink-600/40 hover:bg-pink-100/80 hover:border-pink-600/60'
            }`}>
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 sm:p-4 rounded-full mb-3 sm:mb-4 transition-transform group-hover:scale-110 ${
                  theme === 'dark' ? 'bg-pink-500/20' : 'bg-pink-500/20'
                }`}>
                  <Heart className={`w-10 sm:w-12 h-10 sm:h-12 ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`} />
                </div>
                <h3 className={`text-lg sm:text-xl font-light mb-2 sm:mb-3 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`} style={{ letterSpacing: '0.05em' }}>
                  {language === 'ko' && '감정 기록'}
                  {language === 'en' && 'Emotion Tracking'}
                  {language === 'ja' && '感情記録'}
                  {language === 'zh' && '情绪追踪'}
                </h3>
                <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                  style={{ lineHeight: 1.6 }}>
                  {language === 'ko' && '오늘의 감정을 기록하고 패턴을 분석해보세요'}
                  {language === 'en' && 'Record your emotions and analyze patterns'}
                  {language === 'ja' && '今日の感情を記録し、パターンを分析しましょう'}
                  {language === 'zh' && '记录您的情绪并分析模式'}
                </p>
              </div>
            </div>
          </Link>

          {/* Daily Check-in */}
          <Link href="/checkin" className="group">
            <div className={`p-4 sm:p-6 md:p-8 rounded-lg border backdrop-blur-md transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 hover:border-purple-500/50'
                : 'bg-purple-100/60 border-purple-600/40 hover:bg-purple-100/80 hover:border-purple-600/60'
            }`}>
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 sm:p-4 rounded-full mb-3 sm:mb-4 transition-transform group-hover:scale-110 ${
                  theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-500/20'
                }`}>
                  <Calendar className={`w-10 sm:w-12 h-10 sm:h-12 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <h3 className={`text-lg sm:text-xl font-light mb-2 sm:mb-3 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`} style={{ letterSpacing: '0.05em' }}>
                  {language === 'ko' && '일일 체크인'}
                  {language === 'en' && 'Daily Check-in'}
                  {language === 'ja' && '毎日のチェックイン'}
                  {language === 'zh' && '每日签到'}
                </h3>
                <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                  style={{ lineHeight: 1.6 }}>
                  {language === 'ko' && '매일 체크인하고 마음 건강을 관리하세요'}
                  {language === 'en' && 'Check in daily to maintain mental wellness'}
                  {language === 'ja' && '毎日チェックインして心の健康を管理しましょう'}
                  {language === 'zh' && '每天签到并管理心理健康'}
                </p>
              </div>
            </div>
          </Link>

          {/* Self-Assessment */}
          <Link href="/assessment" className="group">
            <div className={`p-4 sm:p-6 md:p-8 rounded-lg border backdrop-blur-md transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500/50'
                : 'bg-blue-100/60 border-blue-600/40 hover:bg-blue-100/80 hover:border-blue-600/60'
            }`}>
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 sm:p-4 rounded-full mb-3 sm:mb-4 transition-transform group-hover:scale-110 ${
                  theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-500/20'
                }`}>
                  <Brain className={`w-10 sm:w-12 h-10 sm:h-12 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <h3 className={`text-lg sm:text-xl font-light mb-2 sm:mb-3 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`} style={{ letterSpacing: '0.05em' }}>
                  {language === 'ko' && '자가진단'}
                  {language === 'en' && 'Self-Assessment'}
                  {language === 'ja' && 'セルフチェック'}
                  {language === 'zh' && '自我评估'}
                </h3>
                <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                  style={{ lineHeight: 1.6 }}>
                  {language === 'ko' && '정신건강 상태를 확인하고 필요한 도움을 찾으세요'}
                  {language === 'en' && 'Assess your mental health and find support'}
                  {language === 'ja' && 'メンタルヘルスの状態を確認し、サポートを見つけましょう'}
                  {language === 'zh' && '评估您的心理健康并寻找支持'}
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Info Section */}
        <div className={`mt-8 sm:mt-12 p-4 sm:p-6 rounded-lg border ${
          theme === 'dark'
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : 'bg-emerald-50 border-emerald-600/40'
        }`}>
          <p className={`text-xs sm:text-sm text-center ${
            theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'
          }`} style={{ lineHeight: 1.8 }}>
            {language === 'ko' && '🌲 매일 조금씩 마음을 가꾸다 보면 어느새 건강한 숲이 자라납니다'}
            {language === 'en' && '🌲 Nurture your mind daily, and a healthy forest will grow'}
            {language === 'ja' && '🌲 毎日少しずつ心を育てれば、健康な森が育ちます'}
            {language === 'zh' && '🌲 每天培育您的心灵，健康的森林将会成长'}
          </p>
        </div>

        {/* Quick Care Links */}
        <div className="mt-12 sm:mt-16">
          <QuickCareLinks theme={theme} language={language} />
        </div>

        {/* Analysis History Section */}
        {analysisStats.totalAnalyses > 0 && (
          <div className="mt-12 sm:mt-16">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <FileText className={`w-6 sm:w-8 h-6 sm:h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              <h2 className={`text-2xl sm:text-3xl font-light ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`} style={{ letterSpacing: '0.05em' }}>
                {language === 'ko' && '심리 분석 히스토리'}
                {language === 'en' && 'Analysis History'}
                {language === 'ja' && '心理分析履歴'}
                {language === 'zh' && '心理分析历史'}
              </h2>
            </div>

            {/* Stats Cards */}
            <AnalysisStatsCard stats={analysisStats} />

            {/* Analysis List */}
            <div className="space-y-4 sm:space-y-6">
              {loadingAnalyses ? (
                <div className="text-center py-8 sm:py-12">
                  <div className={`text-base sm:text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {language === 'ko' && '분석 결과를 불러오는 중...'}
                    {language === 'en' && 'Loading analyses...'}
                    {language === 'ja' && '分析結果を読み込み中...'}
                    {language === 'zh' && '正在加载分析结果...'}
                  </div>
                </div>
              ) : analyses.length > 0 ? (
                <>
                  {analyses.map((analysis) => (
                    <AnalysisHistoryCard key={analysis.id} analysis={analysis} />
                  ))}

                  {analysisStats.totalAnalyses > analyses.length && (
                    <div className="text-center pt-4 sm:pt-6">
                      <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                        {language === 'ko' && `총 ${analysisStats.totalAnalyses}개의 분석 중 ${analyses.length}개 표시`}
                        {language === 'en' && `Showing ${analyses.length} of ${analysisStats.totalAnalyses} analyses`}
                        {language === 'ja' && `全${analysisStats.totalAnalyses}件の分析のうち${analyses.length}件を表示`}
                        {language === 'zh' && `显示 ${analysisStats.totalAnalyses} 个分析中的 ${analyses.length} 个`}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className={`text-center py-8 sm:py-12 p-4 sm:p-6 md:p-8 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10'
                    : 'bg-white/40 border-gray-300'
                }`}>
                  <FileText className={`w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <p className={`text-base sm:text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {language === 'ko' && '아직 분석 결과가 없습니다'}
                    {language === 'en' && 'No analyses yet'}
                    {language === 'ja' && 'まだ분석結果がありません'}
                    {language === 'zh' && '还没有分析结果'}
                  </p>
                  <p className={`text-xs sm:text-sm mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    {language === 'ko' && 'AI 상담을 받고 전문 심리 분석을 받아보세요'}
                    {language === 'en' && 'Get AI counseling and receive professional analysis'}
                    {language === 'ja' && 'AIカウンセリングを受けて専門的な心理分析を受けましょう'}
                    {language === 'zh' && '获得AI咨询并接受专业心理分析'}
                  </p>
                  <Link
                    href="/"
                    className={`inline-block mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border transition-all text-sm sm:text-base ${
                      theme === 'dark'
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'
                        : 'bg-blue-100/60 border-blue-600/40 text-blue-700 hover:bg-blue-100/80'
                    }`}
                  >
                    {language === 'ko' && '상담 시작하기'}
                    {language === 'en' && 'Start Counseling'}
                    {language === 'ja' && 'カウンセリングを始める'}
                    {language === 'zh' && '开始咨询'}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <NicknameModal
        isOpen={showNicknameModal}
        onClose={() => setShowNicknameModal(false)}
      />

      {/* Level Up Modal */}
      <LevelUpModal
        isOpen={showLevelUpModal}
        newLevel={newLevel}
        onClose={() => setShowLevelUpModal(false)}
      />
    </div>
  )
}
