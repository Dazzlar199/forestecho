'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ArrowRight, ArrowLeft } from 'lucide-react'
import { useTheme } from '@/components/layout/ThemeProvider'
import { useLanguage } from '@/components/layout/LanguageProvider'
import {
  ASSESSMENT_QUESTIONS,
  createInitialAssessment,
  getAssessmentInterpretation,
} from '@/lib/mental-health/assessment'
import { saveInitialAssessment } from '@/lib/firebase/mental-health'
import { logger } from '@/lib/utils/logger'

interface InitialAssessmentModalProps {
  isOpen: boolean
  userId: string
  onComplete: () => void
}

export default function InitialAssessmentModal({
  isOpen,
  userId,
  onComplete,
}: InitialAssessmentModalProps) {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentQuestion = ASSESSMENT_QUESTIONS[currentStep]
  const totalSteps = ASSESSMENT_QUESTIONS.length

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers]
    newAnswers[currentStep] = value
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // PHQ-2 점수 (첫 2문항)
      const phq2Score = (answers[0] || 0) + (answers[1] || 0)

      // GAD-2 점수 (마지막 2문항)
      const gad2Score = (answers[2] || 0) + (answers[3] || 0)

      // 초기 평가 생성
      const assessment = createInitialAssessment(phq2Score, gad2Score)

      // Firestore에 저장
      await saveInitialAssessment(userId, assessment)

      // 완료 알림
      const interpretation = getAssessmentInterpretation(assessment.totalScore)
      const interpMsg = language === 'ko' ? `${interpretation.ko.level}: ${interpretation.ko.message}` :
                        language === 'ja' ? `${interpretation.en.level}: ${interpretation.en.message}` :
                        language === 'zh' ? `${interpretation.en.level}: ${interpretation.en.message}` :
                        `${interpretation.en.level}: ${interpretation.en.message}`
      alert(interpMsg)

      onComplete()
    } catch (error) {
      logger.error('Failed to submit assessment:', error)
      const errorMsg = language === 'ko' ? '평가 저장에 실패했습니다. 다시 시도해주세요.' :
                       language === 'en' ? 'Failed to save assessment. Please try again.' :
                       language === 'ja' ? '評価の保存に失敗しました。もう一度お試しください。' :
                       '评估保存失败。请重试。'
      alert(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isAnswered = answers[currentStep] !== undefined
  const isLastStep = currentStep === totalSteps - 1

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative w-full max-w-2xl rounded-2xl border p-8 ${
          theme === 'dark'
            ? 'bg-gray-900 border-emerald-500/30'
            : 'bg-white border-emerald-300'
        }`}
      >
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-emerald-500/10 rounded-full mb-4">
            <Heart className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className={`text-2xl font-normal mb-2 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}>
            {language === 'ko' && '마음 건강 체크'}
            {language === 'en' && 'Mental Health Check'}
            {language === 'ja' && '心の健康チェック'}
            {language === 'zh' && '心理健康检查'}
          </h2>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {language === 'ko' && '4개의 간단한 질문으로 현재 상태를 확인합니다'}
            {language === 'en' && 'Check your current state with 4 simple questions'}
            {language === 'ja' && '4つの簡単な質問で現在の状態を確認します'}
            {language === 'zh' && '通过4个简单问题检查当前状态'}
          </p>
        </div>

        {/* 진행 바 */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[...Array(totalSteps)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 mx-1 rounded-full ${
                  i <= currentStep
                    ? 'bg-emerald-500'
                    : theme === 'dark'
                    ? 'bg-gray-700'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className={`text-xs text-center ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
          }`}>
            {currentStep + 1} / {totalSteps}
          </p>
        </div>

        {/* 질문 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className={`text-lg font-normal mb-6 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {currentQuestion.question[language as 'ko' | 'en' | 'ja' | 'zh']}
            </h3>

            {/* 선택지 */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    answers[currentStep] === option.value
                      ? theme === 'dark'
                        ? 'bg-emerald-500/20 border-emerald-500'
                        : 'bg-emerald-50 border-emerald-500'
                      : theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 hover:border-emerald-500/50'
                      : 'bg-white border-gray-300 hover:border-emerald-300'
                  }`}
                >
                  <span className={
                    answers[currentStep] === option.value
                      ? 'text-emerald-500 font-medium'
                      : theme === 'dark'
                      ? 'text-gray-300'
                      : 'text-gray-700'
                  }>
                    {option.label[language as 'ko' | 'en' | 'ja' | 'zh']}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 버튼 */}
        <div className="flex gap-3 mt-8">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              } disabled:opacity-50`}
            >
              <ArrowLeft className="w-4 h-4" />
              {language === 'ko' && '이전'}
              {language === 'en' && 'Back'}
              {language === 'ja' && '戻る'}
              {language === 'zh' && '上一步'}
            </button>
          )}

          <button
            onClick={isLastStep ? handleSubmit : handleNext}
            disabled={!isAnswered || isSubmitting}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              isAnswered && !isSubmitting
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-emerald-500/30 text-emerald-300 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {language === 'ko' && '저장 중...'}
                {language === 'en' && 'Saving...'}
              </>
            ) : isLastStep ? (
              <>
                {language === 'ko' && '완료'}
                {language === 'en' && 'Complete'}
                {language === 'ja' && '完了'}
                {language === 'zh' && '完成'}
              </>
            ) : (
              <>
                {language === 'ko' && '다음'}
                {language === 'en' && 'Next'}
                {language === 'ja' && '次へ'}
                {language === 'zh' && '下一步'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
