'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles } from 'lucide-react'
import { useAuth } from '../layout/AuthProvider'
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

  const handleGenerateAnalysis = async () => {
    if (!user) {
      alert('로그인이 필요한 서비스입니다.')
      return
    }

    if (messages.length < 4) {
      alert('충분한 대화가 진행된 후 분석을 요청해주세요. (최소 2회 이상 대화 필요)')
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
        console.error('Analysis API Error Response:', data)
        throw new Error(data.error || '분석 생성 실패')
      }

      // 분석 완료 후 전용 페이지로 이동
      if (data.analysisId) {
        router.push(`/analysis/${data.analysisId}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('분석 생성에 실패했습니다. 다시 시도해주세요.')
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
            <span>마음을 깊이 들여다보는 중입니다...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>전문 심리 분석 받기</span>
          </>
        )}
      </button>
      <p
        className="text-center text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4"
        style={{ fontWeight: 300, letterSpacing: '0.02em' }}
      >
        {!user
          ? '로그인 후 AI 기반 전문 심리 분석 리포트를 받아보세요'
          : 'AI 기반 전문 심리 분석 리포트를 생성합니다'
        }
      </p>
    </div>
  )
}
