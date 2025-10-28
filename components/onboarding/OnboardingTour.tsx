'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'

interface OnboardingTourProps {
  onComplete: () => void
}

export default function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // 온보딩 완료 여부 확인
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed')
    if (!hasCompletedOnboarding) {
      setIsOpen(true)
    }
  }, [])

  const steps = [
    {
      title: '숲울림에 오신 것을 환영합니다',
      description: 'AI 기반 심리 상담 서비스로 당신의 마음 건강을 돌보세요.',
      emoji: '🌿',
    },
    {
      title: 'AI 상담사와 대화하세요',
      description: '24시간 언제든지 전문적인 심리 상담을 받을 수 있습니다. 판단 없이 귀 기울여 듣습니다.',
      emoji: '💬',
    },
    {
      title: '답변 스타일을 조정하세요',
      description: '이성-감정 슬라이더로 AI의 답변 스타일을 원하는 대로 조정할 수 있습니다.',
      emoji: '🎚️',
    },
    {
      title: '전문 심리 분석 받기',
      description: '대화 후 전문적인 심리 분석 리포트를 받아보세요. 감정, 인지, 행동 패턴을 분석합니다.',
      emoji: '📊',
    },
    {
      title: '나의 숲을 키워가세요',
      description: '지속적인 케어로 마음이 성장하면 당신만의 숲도 함께 자랍니다.',
      emoji: '🌳',
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true')
    setIsOpen(false)
    onComplete()
  }

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true')
    setIsOpen(false)
    onComplete()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            {/* 모달 */}
            <motion.div
              key={currentStep}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 backdrop-blur-xl border-2 border-emerald-500/30 p-10 rounded-2xl max-w-md w-full relative"
            >
              {/* 건너뛰기 버튼 */}
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>

              {/* 콘텐츠 */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="text-7xl mb-6"
                >
                  {steps[currentStep].emoji}
                </motion.div>

                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl text-white mb-4"
                  style={{ fontWeight: 400, letterSpacing: '0.03em' }}
                >
                  {steps[currentStep].title}
                </motion.h2>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-300"
                  style={{ fontWeight: 300, lineHeight: 1.8, letterSpacing: '0.02em' }}
                >
                  {steps[currentStep].description}
                </motion.p>
              </div>

              {/* 진행 표시 */}
              <div className="flex justify-center gap-2 mb-8">
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className={`h-2 rounded-full transition-all ${
                      index === currentStep
                        ? 'w-8 bg-emerald-400'
                        : index < currentStep
                        ? 'w-2 bg-emerald-600'
                        : 'w-2 bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* 버튼들 */}
              <div className="flex gap-3">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all flex items-center justify-center gap-2"
                    style={{ fontWeight: 400, letterSpacing: '0.05em' }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    이전
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg transition-all flex items-center justify-center gap-2"
                  style={{ fontWeight: 400, letterSpacing: '0.05em' }}
                >
                  {currentStep < steps.length - 1 ? (
                    <>
                      다음
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    '시작하기'
                  )}
                </button>
              </div>

              {/* 스텝 카운터 */}
              <p className="text-center mt-4 text-sm text-gray-500">
                {currentStep + 1} / {steps.length}
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
