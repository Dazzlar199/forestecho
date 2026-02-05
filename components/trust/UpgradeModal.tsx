'use client'

import { useState } from 'react'
import { X, Check, Sparkles, Zap, Crown, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/components/layout/LanguageProvider'
import { logger } from '@/lib/utils/logger'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentTier: 'guest' | 'free' | 'basic' | 'premium'
  dailyUsed?: number
  dailyLimit?: number
}

function getTierFeatures(language: string) {
  return {
    basic: {
      name: language === 'ko' ? '베이직' :
            language === 'en' ? 'Basic' :
            language === 'ja' ? 'ベーシック' : '基础版',
      price: 4900,
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      features: language === 'ko'
        ? ['하루 100회 대화', 'Gemini AI 전문 상담', '10가지 상담 모드', '대화 히스토리 무제한', '광고 없는 경험']
        : language === 'en'
        ? ['100 daily conversations', 'Gemini AI counseling', '10 counseling modes', 'Unlimited chat history', 'Ad-free experience']
        : language === 'ja'
        ? ['1日100回の会話', 'Gemini AI専門相談', '10種類の相談モード', '会話履歴無制限', '広告なしの体験']
        : ['每日100次对话', 'Gemini AI专业咨询', '10种咨询模式', '聊天记录无限', '无广告体验'],
    },
    premium: {
      name: language === 'ko' ? '프리미엄' :
            language === 'en' ? 'Premium' :
            language === 'ja' ? 'プレミアム' : '高级版',
      price: 9900,
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      features: language === 'ko'
        ? ['무제한 대화', 'Gemini AI 전문 상담', '10가지 상담 모드', '전문 심리 분석 리포트', '우선 응답 처리', '대화 히스토리 무제한', '광고 없는 경험']
        : language === 'en'
        ? ['Unlimited conversations', 'Gemini AI counseling', '10 counseling modes', 'Professional analysis report', 'Priority response', 'Unlimited chat history', 'Ad-free experience']
        : language === 'ja'
        ? ['無制限の会話', 'Gemini AI専門相談', '10種類の相談モード', '専門心理分析レポート', '優先応答処理', '会話履歴無制限', '広告なしの体験']
        : ['无限对话', 'Gemini AI专业咨询', '10种咨询模式', '专业心理分析报告', '优先响应处理', '聊天记录无限', '无广告体验'],
      badge: 'BEST',
    },
  }
}

export default function UpgradeModal({
  isOpen,
  onClose,
  currentTier,
  dailyUsed = 0,
  dailyLimit = 0,
}: UpgradeModalProps) {
  const { language } = useLanguage()
  const [purchasing, setPurchasing] = useState<'basic' | 'premium' | null>(null)

  if (!isOpen) return null

  const tierFeatures = getTierFeatures(language)

  const handleUpgrade = async (tier: 'basic' | 'premium') => {
    if (purchasing) return

    setPurchasing(tier)
    // TODO: 웹 결제 연동 (Stripe, Toss Payments 등)
    logger.info(`[UpgradeModal] Web payment for tier: ${tier}`)

    // 임시: 결제 페이지로 이동하거나 결제 모달 표시
    setTimeout(() => {
      setPurchasing(null)
      // 결제 연동 후 구현
    }, 1000)
  }

  const priceLabel = (price: number) => {
    if (language === 'ko') return `${price.toLocaleString()}원`
    if (language === 'ja') return `¥${Math.round(price * 0.11).toLocaleString()}`
    if (language === 'zh') return `¥${Math.round(price * 0.053).toLocaleString()}`
    return `$${(price / 1400).toFixed(2)}`
  }

  const perMonthLabel = language === 'ko' ? '/월' :
                         language === 'en' ? '/mo' :
                         language === 'ja' ? '/月' : '/月'

  const closeLabel = language === 'ko' ? '닫기' :
                     language === 'en' ? 'Close' :
                     language === 'ja' ? '閉じる' : '关闭'

  const headerTitle = language === 'ko' ? '더 나은 상담 경험을 위해' :
                      language === 'en' ? 'For a better counseling experience' :
                      language === 'ja' ? 'より良い相談体験のために' :
                      '为了更好的咨询体验'

  const startLabel = (tierName: string) =>
    language === 'ko' ? `${tierName} 시작하기` :
    language === 'en' ? `Start ${tierName}` :
    language === 'ja' ? `${tierName}を始める` :
    `开始${tierName}`

  const purchasingLabel = language === 'ko' ? '결제 중...' :
                          language === 'en' ? 'Processing...' :
                          language === 'ja' ? '決済中...' : '支付中...'

  const footerNotice = language === 'ko' ? '언제든 취소 가능 · 안전한 결제' :
                       language === 'en' ? 'Cancel anytime · Secure payment' :
                       language === 'ja' ? 'いつでもキャンセル可能 · 安全な決済' :
                       '随时可取消 · 安全支付'

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4 overflow-y-auto py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/10 rounded-2xl max-w-5xl w-full relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors z-10"
            aria-label={closeLabel}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="text-center pt-8 pb-6 px-6">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl sm:text-3xl font-light text-gray-100">
                {headerTitle}
              </h2>
            </motion.div>

            {currentTier === 'free' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 text-sm sm:text-base"
              >
                {language === 'ko' && (
                  <>오늘 {dailyUsed}/{dailyLimit}회 대화를 나눴어요<br />프리미엄으로 업그레이드하고 무제한으로 대화하세요</>
                )}
                {language === 'en' && (
                  <>You&apos;ve used {dailyUsed}/{dailyLimit} conversations today<br />Upgrade to Premium for unlimited conversations</>
                )}
                {language === 'ja' && (
                  <>今日 {dailyUsed}/{dailyLimit}回の会話を行いました<br />プレミアムにアップグレードして無制限に会話しましょう</>
                )}
                {language === 'zh' && (
                  <>今天已使用 {dailyUsed}/{dailyLimit} 次对话<br />升级到高级版享受无限对话</>
                )}
              </motion.p>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 px-4 sm:px-8 pb-8">
            {/* Basic Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <tierFeatures.basic.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-100">
                    {tierFeatures.basic.name}
                  </h3>
                  <div className="text-2xl font-light text-blue-400">
                    {priceLabel(tierFeatures.basic.price)}
                    <span className="text-sm text-gray-500">{perMonthLabel}</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {tierFeatures.basic.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade('basic')}
                disabled={purchasing !== null}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-all transform hover:scale-105"
              >
                {purchasing === 'basic' ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {purchasingLabel}
                  </span>
                ) : (
                  startLabel(tierFeatures.basic.name)
                )}
              </button>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/50 rounded-xl p-6"
            >
              {/* Best Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-medium">
                  {tierFeatures.premium.badge}
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <tierFeatures.premium.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-100">
                    {tierFeatures.premium.name}
                  </h3>
                  <div className="text-2xl font-light text-purple-400">
                    {priceLabel(tierFeatures.premium.price)}
                    <span className="text-sm text-gray-500">{perMonthLabel}</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {tierFeatures.premium.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade('premium')}
                disabled={purchasing !== null}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
              >
                {purchasing === 'premium' ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {purchasingLabel}
                  </span>
                ) : (
                  startLabel(tierFeatures.premium.name)
                )}
              </button>
            </motion.div>
          </div>

          {/* Footer Notice */}
          <div className="px-6 pb-6 text-center">
            <p className="text-xs text-gray-500">
              {footerNotice}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
