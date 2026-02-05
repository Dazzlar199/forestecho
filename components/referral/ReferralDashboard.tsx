'use client'
import { logger } from '@/lib/utils/logger'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/layout/AuthProvider'
import { Copy, Users, Gift, Share2, CheckCircle2 } from 'lucide-react'

interface ReferralStats {
  referralCode: string | null
  referralCount: number
  referralRewards: number
  referredBy: string | null
}

export function ReferralDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [generatingCode, setGeneratingCode] = useState(false)

  useEffect(() => {
    if (user) {
      loadStats()
    }
  }, [user])

  async function loadStats() {
    if (!user) return

    try {
      const res = await fetch(`/api/referral?userId=${user.uid}`)
      const data = await res.json()
      setStats(data)
    } catch (error) {
      logger.error('Failed to load referral stats:', error)
    } finally {
      setLoading(false)
    }
  }

  async function generateCode() {
    if (!user) return

    setGeneratingCode(true)
    try {
      const res = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate', userId: user.uid }),
      })

      const data = await res.json()
      if (data.referralCode) {
        setStats((prev) => (prev ? { ...prev, referralCode: data.referralCode } : null))
      }
    } catch (error) {
      logger.error('Failed to generate referral code:', error)
    } finally {
      setGeneratingCode(false)
    }
  }

  function copyCode() {
    if (!stats?.referralCode) return

    navigator.clipboard.writeText(stats.referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function copyInviteText() {
    if (!stats?.referralCode) return

    const text = `ForestEcho에서 함께 성장해요! 🌲\n초대 코드: ${stats.referralCode}\n가입하면 우리 둘 다 무료 대화 +3회를 받아요!\n\n${window.location.origin}?ref=${stats.referralCode}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!user) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400 text-center">
          로그인하면 친구 초대 기능을 사용할 수 있습니다.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 초대 코드 카드 */}
      <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            내 초대 코드
          </h3>
        </div>

        {stats?.referralCode ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-green-300 dark:border-green-700">
                <p className="text-2xl font-mono font-bold text-center text-gray-900 dark:text-gray-100 tracking-wider">
                  {stats.referralCode}
                </p>
              </div>
              <button
                onClick={copyCode}
                className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title="코드 복사"
              >
                {copied ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>

            <button
              onClick={copyInviteText}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  복사됨!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  초대 메시지 복사
                </>
              )}
            </button>

            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-3">
              친구가 가입하면 둘 다 <span className="font-semibold text-green-600 dark:text-green-400">무료 대화 +3회</span>
            </p>
          </>
        ) : (
          <button
            onClick={generateCode}
            disabled={generatingCode}
            className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
          >
            {generatingCode ? '생성 중...' : '초대 코드 생성하기'}
          </button>
        )}
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">초대한 친구</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats?.referralCount || 0}
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">명</span>
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">받은 보너스</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            +{stats?.referralRewards || 0}
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">회</span>
          </p>
        </div>
      </div>

      {/* 초대받은 경우 */}
      {stats?.referredBy && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
            ✨ 친구의 초대로 가입하셨네요! 무료 대화 +3회를 받으셨습니다.
          </p>
        </div>
      )}
    </div>
  )
}
