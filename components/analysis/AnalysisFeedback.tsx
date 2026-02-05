'use client'
import { logger } from '@/lib/utils/logger'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown, MessageSquare, CheckCircle2 } from 'lucide-react'
import { db } from '@/lib/firebase/config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useLanguage } from '@/components/layout/LanguageProvider'

interface AnalysisFeedbackProps {
  analysisId: string
  userId?: string
}

export default function AnalysisFeedback({ analysisId, userId }: AnalysisFeedbackProps) {
  const { language } = useLanguage()
  const [rating, setRating] = useState<'positive' | 'negative' | null>(null)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!rating) return

    setSubmitting(true)
    try {
      await addDoc(collection(db, 'analysisFeedback'), {
        analysisId,
        userId: userId || 'anonymous',
        rating,
        comment: comment.trim() || null,
        createdAt: serverTimestamp(),
      })
      setSubmitted(true)
    } catch (error) {
      logger.error('Failed to submit feedback:', error)
      const errorMsg = language === 'ko' ? '피드백 제출에 실패했습니다.' :
                       language === 'en' ? 'Failed to submit feedback.' :
                       language === 'ja' ? 'フィードバックの送信に失敗しました。' :
                       '反馈提交失败。'
      alert(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-lg">
        <div className="flex items-center gap-3 text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
          <p className="font-medium">
            {language === 'ko' && '피드백을 주셔서 감사합니다!'}
            {language === 'en' && 'Thank you for your feedback!'}
            {language === 'ja' && 'フィードバックをありがとうございます！'}
            {language === 'zh' && '感谢您的反馈！'}
          </p>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          {language === 'ko' && '여러분의 의견은 서비스 개선에 큰 도움이 됩니다.'}
          {language === 'en' && 'Your feedback helps us improve our service.'}
          {language === 'ja' && '皆様のご意見はサービス改善に大きく役立ちます。'}
          {language === 'zh' && '您的意见对改善服务有很大帮助。'}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-black/20 backdrop-blur-xl border border-white/10 p-8 rounded-lg">
      <div className="mb-6">
        <h3 className="text-lg text-gray-200 mb-2" style={{ fontWeight: 400, letterSpacing: '0.02em' }}>
          {language === 'ko' && '이 분석이 도움이 되셨나요?'}
          {language === 'en' && 'Was this analysis helpful?'}
          {language === 'ja' && 'この分析は役に立ちましたか？'}
          {language === 'zh' && '这个分析对您有帮助吗？'}
        </h3>
        <p className="text-sm text-gray-500">
          {language === 'ko' && '여러분의 피드백은 분석 품질 개선에 사용됩니다'}
          {language === 'en' && 'Your feedback helps improve analysis quality'}
          {language === 'ja' && 'あなたのフィードバックは分析品質の改善に使用されます'}
          {language === 'zh' && '您的反馈将用于改善分析质量'}
        </p>
      </div>

      {/* Rating Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setRating('positive')}
          className={`flex-1 py-4 px-6 rounded-lg border-2 transition-all ${
            rating === 'positive'
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
              : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
          }`}
        >
          <ThumbsUp className={`w-6 h-6 mx-auto mb-2 ${rating === 'positive' ? 'fill-emerald-400' : ''}`} />
          <span className="text-sm font-medium">
            {language === 'ko' && '도움됨'}
            {language === 'en' && 'Helpful'}
            {language === 'ja' && '役に立った'}
            {language === 'zh' && '有帮助'}
          </span>
        </button>

        <button
          onClick={() => setRating('negative')}
          className={`flex-1 py-4 px-6 rounded-lg border-2 transition-all ${
            rating === 'negative'
              ? 'bg-red-500/20 border-red-500/50 text-red-400'
              : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
          }`}
        >
          <ThumbsDown className={`w-6 h-6 mx-auto mb-2 ${rating === 'negative' ? 'fill-red-400' : ''}`} />
          <span className="text-sm font-medium">
            {language === 'ko' && '개선 필요'}
            {language === 'en' && 'Needs improvement'}
            {language === 'ja' && '改善が必要'}
            {language === 'zh' && '需要改进'}
          </span>
        </button>
      </div>

      {/* Comment Input */}
      {rating && (
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">
            <MessageSquare className="w-4 h-4 inline mr-1" />
            {language === 'ko' && '추가 의견 (선택사항)'}
            {language === 'en' && 'Additional comments (optional)'}
            {language === 'ja' && '追加コメント（任意）'}
            {language === 'zh' && '附加意见（可选）'}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              rating === 'positive'
                ? (language === 'ko' ? '어떤 점이 도움이 되었나요?' :
                   language === 'en' ? 'What was helpful?' :
                   language === 'ja' ? 'どの点が役に立ちましたか？' :
                   '哪些方面有帮助？')
                : (language === 'ko' ? '어떤 점을 개선하면 좋을까요?' :
                   language === 'en' ? 'What could be improved?' :
                   language === 'ja' ? 'どの点を改善すればよいですか？' :
                   '可以改进哪些方面？')
            }
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 resize-none"
            rows={3}
            maxLength={500}
          />
          <p className="text-xs text-gray-600 mt-1">{comment.length}/500</p>
        </div>
      )}

      {/* Submit Button */}
      {rating && (
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          {submitting ? (
            <>
              {language === 'ko' && '제출 중...'}
              {language === 'en' && 'Submitting...'}
              {language === 'ja' && '送信中...'}
              {language === 'zh' && '提交中...'}
            </>
          ) : (
            <>
              {language === 'ko' && '피드백 제출'}
              {language === 'en' && 'Submit Feedback'}
              {language === 'ja' && 'フィードバックを送信'}
              {language === 'zh' && '提交反馈'}
            </>
          )}
        </button>
      )}
    </div>
  )
}
