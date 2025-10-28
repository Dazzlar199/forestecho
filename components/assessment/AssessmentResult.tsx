'use client'

import { useLanguage } from '../layout/LanguageProvider'
import { useTheme } from '../layout/ThemeProvider'
import { AlertCircle, Check, Info, X } from 'lucide-react'
import type { AssessmentResult, AssessmentType } from '@/types/assessment'

interface AssessmentResultProps {
  result: AssessmentResult
  onClose: () => void
  onRetake?: () => void
}

const assessmentInfo = {
  phq9: {
    name: { ko: 'PHQ-9 우울증 선별검사', en: 'PHQ-9 Depression Screening', ja: 'PHQ-9うつ病スクリーニング', zh: 'PHQ-9 抑郁症筛查' },
    maxScore: 27,
  },
  gad7: {
    name: { ko: 'GAD-7 불안장애 선별검사', en: 'GAD-7 Anxiety Screening', ja: 'GAD-7不安障害スクリーニング', zh: 'GAD-7 焦虑症筛查' },
    maxScore: 21,
  },
  stress: {
    name: { ko: '스트레스 척도', en: 'Stress Scale', ja: 'ストレス尺度', zh: '压力量表' },
    maxScore: 40,
  },
}

export default function AssessmentResult({ result, onClose, onRetake }: AssessmentResultProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()

  const info = assessmentInfo[result.assessmentType]
  const percentage = (result.score / info.maxScore) * 100

  const getSeverityIcon = () => {
    if (result.interpretation.severity === 'minimal') return <Check className="w-8 h-8" />
    if (result.interpretation.severity === 'mild') return <Info className="w-8 h-8" />
    return <AlertCircle className="w-8 h-8" />
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`backdrop-blur-xl border rounded-lg p-8 max-w-2xl mx-auto ${
      theme === 'dark'
        ? 'bg-black/80 border-white/10'
        : 'bg-white/90 border-gray-700/20'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className={`text-2xl font-light mb-2 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`} style={{ letterSpacing: '0.05em' }}>
            {language === 'ko' && '검사 결과'}
            {language === 'en' && 'Assessment Result'}
            {language === 'ja' && '検査結果'}
            {language === 'zh' && '测试结果'}
          </h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
            {info.name[language as keyof typeof info.name]}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`p-2 rounded-full transition-colors ${
            theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-200/50'
          }`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Score Display */}
      <div className={`p-8 rounded-lg border mb-8 ${
        theme === 'dark'
          ? 'bg-white/5 border-white/10'
          : 'bg-white border-gray-200'
      }`}>
        <div className="text-center">
          {/* Icon */}
          <div className="mb-4 flex justify-center" style={{ color: result.interpretation.color }}>
            {getSeverityIcon()}
          </div>

          {/* Score */}
          <div className={`text-5xl font-light mb-2 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}>
            {result.score} <span className="text-2xl text-gray-500">/ {info.maxScore}</span>
          </div>

          {/* Severity Level */}
          <div className="mb-6">
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${result.interpretation.color}20`,
                color: result.interpretation.color
              }}
            >
              {result.interpretation.severity === 'minimal' && (
                <>
                  {language === 'ko' && '양호'}
                  {language === 'en' && 'Good'}
                  {language === 'ja' && '良好'}
                  {language === 'zh' && '良好'}
                </>
              )}
              {result.interpretation.severity === 'mild' && (
                <>
                  {language === 'ko' && '가벼움'}
                  {language === 'en' && 'Mild'}
                  {language === 'ja' && '軽度'}
                  {language === 'zh' && '轻度'}
                </>
              )}
              {result.interpretation.severity === 'moderate' && (
                <>
                  {language === 'ko' && '중간'}
                  {language === 'en' && 'Moderate'}
                  {language === 'ja' && '中程度'}
                  {language === 'zh' && '中度'}
                </>
              )}
              {result.interpretation.severity === 'moderately_severe' && (
                <>
                  {language === 'ko' && '중등도-심함'}
                  {language === 'en' && 'Moderately Severe'}
                  {language === 'ja' && '中等度-重度'}
                  {language === 'zh' && '中重度'}
                </>
              )}
              {result.interpretation.severity === 'severe' && (
                <>
                  {language === 'ko' && '심함'}
                  {language === 'en' && 'Severe'}
                  {language === 'ja' && '重度'}
                  {language === 'zh' && '严重'}
                </>
              )}
            </span>
          </div>

          {/* Progress Bar */}
          <div className={`h-3 rounded-full overflow-hidden mb-6 ${
            theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
          }`}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${percentage}%`,
                backgroundColor: result.interpretation.color
              }}
            />
          </div>

          {/* Message */}
          <p className={`text-base leading-relaxed ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`} style={{ lineHeight: 1.8 }}>
            {result.interpretation.message[language as keyof typeof result.interpretation.message]}
          </p>
        </div>
      </div>

      {/* Date */}
      <div className={`text-center text-sm mb-8 ${
        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
      }`}>
        {formatDate(result.timestamp)}
      </div>

      {/* Disclaimer */}
      <div className={`p-4 rounded-lg border mb-8 ${
        theme === 'dark'
          ? 'bg-amber-500/10 border-amber-500/30'
          : 'bg-amber-50 border-amber-300'
      }`}>
        <div className="flex gap-3">
          <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
          }`} />
          <p className={`text-sm leading-relaxed ${
            theme === 'dark' ? 'text-amber-200' : 'text-amber-800'
          }`}>
            {language === 'ko' && '이 검사는 자가진단 도구이며, 전문적인 진단을 대체할 수 없습니다. 증상이 지속되거나 심각한 경우 반드시 전문가와 상담하시기 바랍니다.'}
            {language === 'en' && 'This is a self-assessment tool and cannot replace professional diagnosis. If symptoms persist or are severe, please consult a professional.'}
            {language === 'ja' && 'これはセルフチェックツールであり、専門的な診断に代わるものではありません。症状が続く場合や深刻な場合は、必ず専門家に相談してください。'}
            {language === 'zh' && '这是一个自我评估工具，不能替代专业诊断。如果症状持续或严重，请务必咨询专业人士。'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        {onRetake && (
          <button
            onClick={onRetake}
            className={`px-6 py-3 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {language === 'ko' && '다시 검사'}
            {language === 'en' && 'Retake'}
            {language === 'ja' && '再検査'}
            {language === 'zh' && '重新测试'}
          </button>
        )}
        <button
          onClick={onClose}
          className={`flex-1 px-6 py-3 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {language === 'ko' && '확인'}
          {language === 'en' && 'OK'}
          {language === 'ja' && '確認'}
          {language === 'zh' && '确认'}
        </button>
      </div>
    </div>
  )
}
