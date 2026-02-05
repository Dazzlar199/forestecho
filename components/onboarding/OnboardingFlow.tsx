'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Shield, Heart, Sparkles, ArrowRight, Check } from 'lucide-react'
import { useTheme } from '../layout/ThemeProvider'
import { useLanguage } from '../layout/LanguageProvider'

interface OnboardingFlowProps {
  onComplete: () => void
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('forestecho_onboarding_completed')
    if (!hasSeenOnboarding) {
      setIsVisible(true)
    }
  }, [])

  const completeOnboarding = () => {
    localStorage.setItem('forestecho_onboarding_completed', 'true')
    setIsVisible(false)
    onComplete()
  }

  const skipOnboarding = () => {
    completeOnboarding()
  }

  if (!isVisible) return null

  const slides = [
    {
      icon: Heart,
      title: {
        ko: '숲울림에 오신 것을 환영합니다',
        en: 'Welcome to ForestEcho',
        ja: 'ForestEchoへようこそ',
        zh: '欢迎来到ForestEcho',
      },
      description: {
        ko: '24시간 언제든지 마음을 나눌 수 있는 AI 심리상담 파트너입니다. 당신의 감정을 이해하고, 함께 성장하는 여정을 시작하세요.',
        en: 'Your 24/7 AI counseling partner, ready to listen and support you anytime. Start your journey of emotional growth with us.',
        ja: '24時間いつでも心を分かち合えるAI心理カウンセリングパートナーです。あなたの感情を理解し、共に成長する旅を始めましょう。',
        zh: '24小时随时可以分享心情的AI心理咨询伙伴。理解您的情绪，开启共同成长的旅程。',
      },
      gradient: 'from-emerald-500/20 to-teal-500/20',
    },
    {
      icon: Shield,
      title: {
        ko: '완벽한 개인정보 보호',
        en: 'Complete Privacy Protection',
        ja: '完全なプライバシー保護',
        zh: '完善的隐私保护',
      },
      description: {
        ko: '모든 대화는 엔드투엔드 암호화되며, 절대 제3자와 공유되지 않습니다. 당신의 비밀은 안전하게 보호됩니다.',
        en: 'All conversations are end-to-end encrypted and never shared with third parties. Your secrets are safe with us.',
        ja: 'すべての会話はエンドツーエンドで暗号化され、決して第三者と共有されません。あなたの秘密は安全に保護されます。',
        zh: '所有对话均经过端到端加密，绝不与第三方共享。您的秘密得到安全保护。',
      },
      gradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      icon: Sparkles,
      title: {
        ko: '당신만을 위한 맞춤 상담',
        en: 'Personalized Counseling',
        ja: 'あなただけのカウンセリング',
        zh: '专属定制咨询',
      },
      description: {
        ko: '감정 추적, 일일 체크인, 맞춤형 조언까지. 당신의 멘탈 헬스 여정을 함께 만들어갑니다.',
        en: 'From emotion tracking to daily check-ins and personalized advice. We create your mental health journey together.',
        ja: '感情トラッキング、毎日のチェックイン、パーソナライズされたアドバイスまで。あなたのメンタルヘルスの旅を一緒に作ります。',
        zh: '从情绪追踪到每日签到和个性化建议。我们共同创建您的心理健康之旅。',
      },
      gradient: 'from-purple-500/20 to-pink-500/20',
    },
  ]

  const currentSlide = slides[currentStep]
  const Icon = currentSlide.icon

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        background: theme === 'dark'
          ? 'radial-gradient(circle at center, rgba(10, 22, 18, 0.98) 0%, rgba(10, 22, 18, 0.95) 100%)'
          : 'radial-gradient(circle at center, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="w-full max-w-3xl mx-auto px-4">
        {/* Progress Indicators */}
        <div className="flex justify-center gap-3 mb-12">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'w-16 bg-emerald-500'
                  : index < currentStep
                  ? 'w-10 bg-emerald-500/60'
                  : 'w-10 bg-gray-500/20'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            />
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`relative overflow-hidden border-2 backdrop-blur-xl ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-gray-900/70 to-gray-800/70 border-white/20'
                : 'bg-gradient-to-br from-white/95 to-gray-50/95 border-gray-200'
            }`}
            style={{
              borderRadius: '40px',
              boxShadow: theme === 'dark'
                ? '0 20px 60px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.2)'
                : '0 20px 60px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08)'
            }}
          >
            {/* Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${currentSlide.gradient} opacity-20 pointer-events-none`}
            />

            {/* Content Container with proper spacing */}
            <div className="relative px-6 py-10 sm:px-12 sm:py-16">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className={`w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-8 sm:mb-10 rounded-3xl flex items-center justify-center shadow-2xl ${
                  theme === 'dark'
                    ? 'bg-emerald-500/15 border-2 border-emerald-500/40'
                    : 'bg-emerald-50 border-2 border-emerald-400'
                }`}
              >
                <Icon
                  className={`w-12 h-12 sm:w-14 sm:h-14 ${
                    theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                  }`}
                />
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`text-2xl sm:text-3xl md:text-4xl font-light text-center mb-5 sm:mb-6 leading-tight ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}
                style={{ fontFamily: 'var(--font-brand)', letterSpacing: '0.02em' }}
              >
                {currentSlide.title[language as keyof typeof currentSlide.title]}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`text-sm sm:text-base md:text-lg text-center leading-relaxed mb-10 sm:mb-12 max-w-2xl mx-auto px-4 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
                style={{ lineHeight: '1.8' }}
              >
                {currentSlide.description[language as keyof typeof currentSlide.description]}
              </motion.p>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
              >
                {currentStep < slides.length - 1 ? (
                  <>
                    <button
                      onClick={skipOnboarding}
                      className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium transition-all min-w-[120px] ${
                        theme === 'dark'
                          ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {language === 'ko' ? '건너뛰기' : language === 'en' ? 'Skip' : language === 'ja' ? 'スキップ' : '跳过'}
                    </button>
                    <button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className={`w-full sm:w-auto px-10 py-4 font-semibold transition-all flex items-center justify-center gap-2 min-w-[160px] ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white'
                          : 'bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-600 hover:to-emerald-500 text-white'
                      }`}
                      style={{
                        borderRadius: '20px',
                        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3), 0 4px 12px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      {language === 'ko' ? '다음' : language === 'en' ? 'Next' : language === 'ja' ? '次へ' : '下一步'}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={completeOnboarding}
                    className={`w-full sm:w-auto px-12 py-4 rounded-xl font-bold text-base sm:text-lg transition-all flex items-center justify-center gap-3 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-2xl shadow-emerald-500/40'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-2xl shadow-emerald-500/50'
                    }`}
                  >
                    <Check className="w-6 h-6" />
                    {language === 'ko' ? '시작하기' : language === 'en' ? 'Get Started' : language === 'ja' ? '始める' : '开始'}
                    <ArrowRight className="w-6 h-6" />
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Skip button for last screen */}
        {currentStep === slides.length - 1 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={skipOnboarding}
            className={`mt-8 text-sm mx-auto block px-4 py-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'text-gray-500 hover:text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {language === 'ko' ? '건너뛰기' : language === 'en' ? 'Skip' : language === 'ja' ? 'スキップ' : '跳过'}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
