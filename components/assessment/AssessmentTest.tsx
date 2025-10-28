'use client'

import { useState } from 'react'
import { useLanguage } from '../layout/LanguageProvider'
import { useTheme } from '../layout/ThemeProvider'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'
import type { AssessmentQuestion, AssessmentType } from '@/types/assessment'

interface AssessmentTestProps {
  type: AssessmentType
  questions: AssessmentQuestion[]
  onComplete: (answers: Record<string, number>) => void
  onCancel: () => void
}

export default function AssessmentTest({ type, questions, onComplete, onCancel }: AssessmentTestProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const isAnswered = answers[question.id] !== undefined

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({ ...prev, [question.id]: value }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // 완료
      onComplete(answers)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const canProceed = isAnswered

  return (
    <div className={`backdrop-blur-xl border rounded-lg p-8 max-w-3xl mx-auto ${
      theme === 'dark'
        ? 'bg-black/80 border-white/10'
        : 'bg-white/90 border-gray-700/20'
    }`}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'ko' && `문항 ${currentQuestion + 1} / ${questions.length}`}
            {language === 'en' && `Question ${currentQuestion + 1} / ${questions.length}`}
            {language === 'ja' && `質問 ${currentQuestion + 1} / ${questions.length}`}
            {language === 'zh' && `问题 ${currentQuestion + 1} / ${questions.length}`}
          </span>
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${
          theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
        }`}>
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              theme === 'dark' ? 'bg-emerald-500' : 'bg-emerald-600'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className={`text-xl font-light leading-relaxed ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
        }`} style={{ lineHeight: 1.8 }}>
          {question.text[language as keyof typeof question.text]}
        </h3>
      </div>

      {/* Answer Options */}
      <div className="space-y-3 mb-8">
        {question.options.map((option) => {
          const isSelected = answers[question.id] === option.value
          return (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center justify-between ${
                isSelected
                  ? theme === 'dark'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-emerald-600 bg-emerald-100/50'
                  : theme === 'dark'
                    ? 'border-white/10 hover:border-white/30 bg-white/5'
                    : 'border-gray-300 hover:border-gray-400 bg-white'
              }`}
            >
              <span className={`${
                isSelected
                  ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'
                  : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {option.label[language as keyof typeof option.label]}
              </span>
              {isSelected && (
                <Check className="w-5 h-5" style={{
                  color: theme === 'dark' ? '#10b981' : '#059669'
                }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        {currentQuestion > 0 && (
          <button
            onClick={handlePrevious}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>
              {language === 'ko' && '이전'}
              {language === 'en' && 'Previous'}
              {language === 'ja' && '前へ'}
              {language === 'zh' && '上一题'}
            </span>
          </button>
        )}

        <button
          onClick={onCancel}
          className={`px-6 py-3 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'bg-white/5 hover:bg-white/10 text-gray-400'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
        >
          {language === 'ko' && '취소'}
          {language === 'en' && 'Cancel'}
          {language === 'ja' && 'キャンセル'}
          {language === 'zh' && '取消'}
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all ${
            canProceed
              ? theme === 'dark'
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>
            {currentQuestion === questions.length - 1 ? (
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
                {language === 'zh' && '下一题'}
              </>
            )}
          </span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
