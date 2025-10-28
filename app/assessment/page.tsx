'use client'

import { useState } from 'react'
import { useLanguage } from '@/components/layout/LanguageProvider'
import { useTheme } from '@/components/layout/ThemeProvider'
import { Brain, Heart, Zap, ChevronRight } from 'lucide-react'
import AssessmentTest from '@/components/assessment/AssessmentTest'
import AssessmentResult from '@/components/assessment/AssessmentResult'
import {
  PHQ9_QUESTIONS,
  GAD7_QUESTIONS,
  STRESS_QUESTIONS,
  interpretPHQ9,
  interpretGAD7,
  interpretStress,
  type AssessmentType,
  type AssessmentResult as AssessmentResultType
} from '@/types/assessment'

export default function AssessmentPage() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [activeTest, setActiveTest] = useState<AssessmentType | null>(null)
  const [result, setResult] = useState<AssessmentResultType | null>(null)

  const assessments = [
    {
      id: 'phq9' as AssessmentType,
      icon: Brain,
      color: '#60a5fa',
      name: { ko: 'PHQ-9', en: 'PHQ-9', ja: 'PHQ-9', zh: 'PHQ-9' },
      title: { ko: '우울증 선별검사', en: 'Depression Screening', ja: 'うつ病スクリーニング', zh: '抑郁症筛查' },
      description: { ko: '최근 2주간의 우울 증상을 평가합니다 (9문항)', en: 'Assess depression symptoms in the last 2 weeks (9 questions)', ja: '過去2週間のうつ症状を評価します（9問）', zh: '评估过去2周的抑郁症状（9题）' },
      duration: { ko: '약 3분', en: '~3 min', ja: '約3分', zh: '约3分钟' },
    },
    {
      id: 'gad7' as AssessmentType,
      icon: Heart,
      color: '#f97316',
      name: { ko: 'GAD-7', en: 'GAD-7', ja: 'GAD-7', zh: 'GAD-7' },
      title: { ko: '불안장애 선별검사', en: 'Anxiety Screening', ja: '不安障害スクリーニング', zh: '焦虑症筛查' },
      description: { ko: '최근 2주간의 불안 증상을 평가합니다 (7문항)', en: 'Assess anxiety symptoms in the last 2 weeks (7 questions)', ja: '過去2週間の不安症状を評価します（7問）', zh: '评估过去2周的焦虑症状（7题）' },
      duration: { ko: '약 2분', en: '~2 min', ja: '約2分', zh: '约2分钟' },
    },
    {
      id: 'stress' as AssessmentType,
      icon: Zap,
      color: '#8b5cf6',
      name: { ko: 'PSS', en: 'PSS', ja: 'PSS', zh: 'PSS' },
      title: { ko: '스트레스 척도', en: 'Stress Scale', ja: 'ストレス尺度', zh: '压力量表' },
      description: { ko: '최근 한 달간의 스트레스 수준을 평가합니다 (10문항)', en: 'Assess stress level in the last month (10 questions)', ja: '過去1ヶ月のストレスレベルを評価します（10問）', zh: '评估过去一个月的压力水平（10题）' },
      duration: { ko: '약 3분', en: '~3 min', ja: '約3分', zh: '约3分钟' },
    },
  ]

  const handleComplete = (answers: Record<string, number>) => {
    if (!activeTest) return

    const score = Object.values(answers).reduce((sum, val) => sum + val, 0)
    let interpretation

    if (activeTest === 'phq9') interpretation = interpretPHQ9(score)
    else if (activeTest === 'gad7') interpretation = interpretGAD7(score)
    else interpretation = interpretStress(score)

    const newResult: AssessmentResultType = {
      id: Date.now().toString(),
      userId: 'test-user',
      assessmentType: activeTest,
      score,
      answers,
      interpretation,
      timestamp: new Date(),
    }

    setResult(newResult)
    setActiveTest(null)
  }

  if (result) {
    return (
      <div className="min-h-screen py-12 px-6">
        <AssessmentResult
          result={result}
          onClose={() => setResult(null)}
          onRetake={() => {
            setActiveTest(result.assessmentType)
            setResult(null)
          }}
        />
      </div>
    )
  }

  if (activeTest) {
    const questions = activeTest === 'phq9' ? PHQ9_QUESTIONS : activeTest === 'gad7' ? GAD7_QUESTIONS : STRESS_QUESTIONS

    return (
      <div className="min-h-screen py-12 px-6">
        <AssessmentTest
          type={activeTest}
          questions={questions}
          onComplete={handleComplete}
          onCancel={() => setActiveTest(null)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-light mb-4 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`} style={{ letterSpacing: '0.1em' }}>
            {language === 'ko' && '심리 자가진단'}
            {language === 'en' && 'Self-Assessment'}
            {language === 'ja' && '心理セルフチェック'}
            {language === 'zh' && '心理自我评估'}
          </h1>
          <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'ko' && '전문적인 심리 선별 도구로 현재 상태를 확인하세요'}
            {language === 'en' && 'Check your current state with professional screening tools'}
            {language === 'ja' && '専門的なスクリーニングツールで現在の状態を確認しましょう'}
            {language === 'zh' && '使用专业筛查工具检查您的当前状态'}
          </p>
        </div>

        {/* Assessment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {assessments.map((assessment) => {
            const Icon = assessment.icon
            return (
              <button
                key={assessment.id}
                onClick={() => setActiveTest(assessment.id)}
                className={`p-5 sm:p-6 md:p-8 rounded-lg border-2 transition-all hover:scale-105 text-left ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 hover:border-white/30'
                    : 'bg-white border-gray-200 hover:border-gray-400 hover:shadow-xl'
                }`}
              >
                {/* Icon */}
                <div className="mb-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${assessment.color}15` }}
                  >
                    <Icon className="w-8 h-8" style={{ color: assessment.color }} />
                  </div>
                </div>

                {/* Name Badge */}
                <div className="mb-3">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${assessment.color}20`,
                      color: assessment.color
                    }}
                  >
                    {assessment.name[language as keyof typeof assessment.name]}
                  </span>
                </div>

                {/* Title */}
                <h3 className={`text-xl font-medium mb-3 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {assessment.title[language as keyof typeof assessment.title]}
                </h3>

                {/* Description */}
                <p className={`text-sm mb-4 leading-relaxed ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {assessment.description[language as keyof typeof assessment.description]}
                </p>

                {/* Duration */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    {assessment.duration[language as keyof typeof assessment.duration]}
                  </span>
                  <ChevronRight className="w-5 h-5" style={{ color: assessment.color }} />
                </div>
              </button>
            )
          })}
        </div>

        {/* Disclaimer */}
        <div className={`mt-12 p-6 rounded-lg border ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <p className={`text-sm text-center leading-relaxed ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {language === 'ko' && '이 검사는 선별 도구로서 참고용이며, 전문적인 진단을 대체할 수 없습니다. 증상이 심각하거나 지속되는 경우 반드시 전문가와 상담하시기 바랍니다.'}
            {language === 'en' && 'These assessments are screening tools for reference only and cannot replace professional diagnosis. If symptoms are severe or persist, please consult a professional.'}
            {language === 'ja' && 'これらの検査はスクリーニングツールであり、参考用です。専門的な診断に代わるものではありません。症状が深刻または持続する場合は、必ず専門家に相談してください。'}
            {language === 'zh' && '这些评估是筛查工具，仅供参考，不能替代专业诊断。如果症状严重或持续，请务必咨询专业人士。'}
          </p>
        </div>
      </div>
    </div>
  )
}
