'use client'
import { logger } from '@/lib/utils/logger'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles } from 'lucide-react'
import { useAuth } from '../layout/AuthProvider'
import { useLanguage } from '../layout/LanguageProvider'
import type { Message } from '@/types'

interface AnalysisReportProps {
  messages: Message[]
  isPremium: boolean
  sessionId?: string | null
}

export default function AnalysisReport({
  messages,
  isPremium,
  sessionId,
}: AnalysisReportProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const { language } = useLanguage()

  const handleGenerateAnalysis = async () => {
    if (!user) {
      const loginMsg = language === 'ko' ? '로그인이 필요한 서비스입니다.' :
                       language === 'en' ? 'Login required for this service.' :
                       language === 'ja' ? 'このサービスにはログインが必要です。' :
                       '此服务需要登录。'
      alert(loginMsg)
      return
    }

    if (messages.length < 4) {
      const minMsgMsg = language === 'ko' ? '충분한 대화가 진행된 후 분석을 요청해주세요. (최소 2회 이상 대화 필요)' :
                        language === 'en' ? 'Please request analysis after sufficient conversation. (At least 2 exchanges required)' :
                        language === 'ja' ? '十分な会話の後に分析をリクエストしてください。（最低2回以上の会話が必要）' :
                        '请在充分对话后请求分析。（至少需要2次以上的对话）'
      alert(minMsgMsg)
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userId: user?.uid || null,
          sessionId: sessionId || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        logger.error('Analysis API Error Response:', data)
        const errorMsg = language === 'ko' ? '분석 생성 실패' :
                         language === 'en' ? 'Analysis generation failed' :
                         language === 'ja' ? '分析生成に失敗しました' :
                         '分析生成失败'
        throw new Error(data.error || errorMsg)
      }

      // 분석 완료 후 전용 페이지로 이동
      if (data.analysisId) {
        router.push(`/analysis/${data.analysisId}`)
      }
    } catch (error) {
      logger.error('Error:', error)
      const errorMsg = language === 'ko' ? '분석 생성에 실패했습니다. 다시 시도해주세요.' :
                       language === 'en' ? 'Failed to generate analysis. Please try again.' :
                       language === 'ja' ? '分析の生成に失敗しました。もう一度お試しください。' :
                       '分析生成失败。请重试。'
      alert(errorMsg)
      setLoading(false)
    }
  }

  return (
    <div className="mt-8 sm:mt-12 max-w-4xl mx-auto">
      <button
        onClick={handleGenerateAnalysis}
        disabled={loading || messages.length < 4 || !user}
        className="w-full px-6 py-4 sm:px-8 sm:py-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md border border-white/20 text-gray-300 hover:from-blue-500/20 hover:to-purple-500/20 hover:border-white/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 rounded-lg text-sm sm:text-base"
        style={{ fontWeight: 300, letterSpacing: '0.08em' }}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            <span>
              {language === 'ko' && '마음을 깊이 들여다보는 중입니다...'}
              {language === 'en' && 'Deep analysis in progress...'}
              {language === 'ja' && '心を深く見つめています...'}
              {language === 'zh' && '正在深入分析...'}
            </span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>
              {language === 'ko' && '전문 심리 분석 받기'}
              {language === 'en' && 'Get Professional Analysis'}
              {language === 'ja' && '専門的な心理分析を受ける'}
              {language === 'zh' && '获取专业心理分析'}
            </span>
          </>
        )}
      </button>
      <p
        className="text-center text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4"
        style={{ fontWeight: 300, letterSpacing: '0.02em' }}
      >
        {!user ? (
          <>
            {language === 'ko' && '로그인 후 AI 기반 전문 심리 분석 리포트를 받아보세요'}
            {language === 'en' && 'Login to get AI-powered professional psychological analysis'}
            {language === 'ja' && 'ログイン後、AIベースの専門的な心理分析レポートをご覧ください'}
            {language === 'zh' && '登录后获取基于AI的专业心理分析报告'}
          </>
        ) : (
          <>
            {language === 'ko' && 'AI 기반 전문 심리 분석 리포트를 생성합니다'}
            {language === 'en' && 'Generate AI-powered professional psychological analysis'}
            {language === 'ja' && 'AIベースの専門的な心理分析レポートを生成します'}
            {language === 'zh' && '生成基于AI的专业心理分析报告'}
          </>
        )}
      </p>
    </div>
  )
}
