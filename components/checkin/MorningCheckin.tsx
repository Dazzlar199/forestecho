'use client'

import { useState } from 'react'
import { useLanguage } from '../layout/LanguageProvider'
import { useTheme } from '../layout/ThemeProvider'
import { Sunrise, ChevronRight, Star } from 'lucide-react'
import { MORNING_QUESTIONS, type CheckinData } from '@/types/checkin'

interface MorningCheckinProps {
  onComplete: (data: Omit<CheckinData, 'id' | 'userId' | 'timestamp'>) => void
  onClose: () => void
}

export default function MorningCheckin({ onComplete, onClose }: MorningCheckinProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})

  const question = MORNING_QUESTIONS[currentStep]
  const progress = ((currentStep + 1) / MORNING_QUESTIONS.length) * 100
  const isAnswered = answers[question.id] !== undefined

  const handleAnswer = (value: any) => {
    if (question.type === 'multiselect') {
      const current = (answers[question.id] as string[]) || []
      if (current.includes(value)) {
        setAnswers(prev => ({
          ...prev,
          [question.id]: current.filter(v => v !== value)
        }))
      } else {
        setAnswers(prev => ({
          ...prev,
          [question.id]: [...current, value]
        }))
      }
    } else {
      setAnswers(prev => ({ ...prev, [question.id]: value }))
    }
  }

  const handleNext = () => {
    if (currentStep < MORNING_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      // 완료
      const avgMood = Math.round(
        (answers.morning_mood + answers.energy_level + answers.sleep_quality) / 3
      )
      onComplete({
        type: 'morning',
        answers,
        mood: avgMood
      })
    }
  }

  const canProceed = question.type === 'multiselect'
    ? (answers[question.id] as string[])?.length > 0
    : isAnswered

  return (
    <div className={`backdrop-blur-xl border rounded-lg p-8 max-w-2xl mx-auto ${
      theme === 'dark'
        ? 'bg-black/80 border-white/10'
        : 'bg-white/90 border-gray-700/20'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#f59e0b20' }}
        >
          <Sunrise className="w-8 h-8" style={{ color: '#f59e0b' }} />
        </div>
        <div>
          <h2 className={`text-2xl font-light mb-1 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`} style={{ letterSpacing: '0.05em' }}>
            {language === 'ko' && '아침 체크인'}
            {language === 'en' && 'Morning Check-in'}
            {language === 'ja' && '朝のチェックイン'}
            {language === 'zh' && '早晨签到'}
          </h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'ko' && '좋은 아침입니다! 오늘 하루를 시작해볼까요?'}
            {language === 'en' && 'Good morning! Ready to start your day?'}
            {language === 'ja' && 'おはようございます！今日を始めましょう'}
            {language === 'zh' && '早上好！准备开始新的一天了吗？'}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'ko' && `질문 ${currentStep + 1} / ${MORNING_QUESTIONS.length}`}
            {language === 'en' && `Question ${currentStep + 1} / ${MORNING_QUESTIONS.length}`}
            {language === 'ja' && `質問 ${currentStep + 1} / ${MORNING_QUESTIONS.length}`}
            {language === 'zh' && `问题 ${currentStep + 1} / ${MORNING_QUESTIONS.length}`}
          </span>
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${
          theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
        }`}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              backgroundColor: '#f59e0b'
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className={`text-xl font-light mb-6 ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
        }`} style={{ lineHeight: 1.6 }}>
          {question.text[language as keyof typeof question.text]}
        </h3>

        {/* Rating Type */}
        {question.type === 'rating' && question.scale && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              {Array.from({ length: question.scale.max }, (_, i) => i + 1).map((value) => {
                const isSelected = answers[question.id] === value
                return (
                  <button
                    key={value}
                    onClick={() => handleAnswer(value)}
                    className={`flex-1 aspect-square rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/20 scale-110'
                        : theme === 'dark'
                          ? 'border-white/10 hover:border-white/30 bg-white/5'
                          : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                  >
                    <Star
                      className="w-6 h-6"
                      fill={isSelected ? '#f59e0b' : 'none'}
                      style={{ color: isSelected ? '#f59e0b' : theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                    />
                    <span className={`text-sm font-medium ${
                      isSelected
                        ? 'text-amber-500'
                        : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {value}
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="flex items-center justify-between text-xs px-1">
              <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                {language === 'ko' && '매우 나쁨'}
                {language === 'en' && 'Very poor'}
                {language === 'ja' && '非常に悪い'}
                {language === 'zh' && '非常差'}
              </span>
              <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                {language === 'ko' && '매우 좋음'}
                {language === 'en' && 'Excellent'}
                {language === 'ja' && '非常に良い'}
                {language === 'zh' && '非常好'}
              </span>
            </div>
          </div>
        )}

        {/* Multiselect Type */}
        {question.type === 'multiselect' && question.options && (
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((option) => {
              const isSelected = (answers[question.id] as string[])?.includes(option.value)
              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10'
                      : theme === 'dark'
                        ? 'border-white/10 hover:border-white/30 bg-white/5'
                        : 'border-gray-300 hover:border-gray-400 bg-white'
                  }`}
                >
                  <span className={`text-sm ${
                    isSelected
                      ? 'text-amber-500 font-medium'
                      : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {option.label[language as keyof typeof option.label]}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={onClose}
          className={`px-6 py-3 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'bg-white/5 hover:bg-white/10 text-gray-400'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
        >
          {language === 'ko' && '나중에'}
          {language === 'en' && 'Later'}
          {language === 'ja' && '後で'}
          {language === 'zh' && '稍后'}
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all ${
            canProceed
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>
            {currentStep === MORNING_QUESTIONS.length - 1 ? (
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
                {language === 'zh' && '下一个'}
              </>
            )}
          </span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
