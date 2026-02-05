'use client'

import { useState, useEffect } from 'react'
import { logger } from '@/lib/utils/logger'
import { useAuth } from '@/components/layout/AuthProvider'
import { useTheme } from '@/components/layout/ThemeProvider'
import { useLanguage } from '@/components/layout/LanguageProvider'
import { db } from '@/lib/firebase/config'
import { collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { Send, MessageSquare, Bug, Lightbulb, Clock, CheckCircle, XCircle } from 'lucide-react'

interface Inquiry {
  id: string
  type: 'inquiry' | 'feedback' | 'bug'
  title: string
  content: string
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected'
  createdAt: Date
  adminReply?: string
  repliedAt?: Date
}

export default function SupportPage() {
  const { user, loading } = useAuth()
  const { theme } = useTheme()
  const { language } = useLanguage()
  const router = useRouter()

  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    type: 'inquiry' as 'inquiry' | 'feedback' | 'bug',
    title: '',
    content: '',
  })

  // 로그인 체크
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // 내 문의 내역 불러오기
  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'inquiries'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const inquiriesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        repliedAt: doc.data().repliedAt?.toDate(),
      })) as Inquiry[]
      setInquiries(inquiriesData)
    })

    return () => unsubscribe()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formData.title.trim() || !formData.content.trim()) return

    setSubmitting(true)
    try {
      await addDoc(collection(db, 'inquiries'), {
        userId: user.uid,
        userEmail: user.email,
        type: formData.type,
        title: formData.title.trim(),
        content: formData.content.trim(),
        status: 'pending',
        createdAt: new Date(),
      })

      setFormData({ type: 'inquiry', title: '', content: '' })
      setShowForm(false)
      const successMsg = language === 'ko' ? '문의가 성공적으로 제출되었습니다!' :
                         language === 'en' ? 'Inquiry submitted successfully!' :
                         language === 'ja' ? 'お問い合わせが正常に送信されました！' :
                         '咨询已成功提交！'
      alert(successMsg)
    } catch (error) {
      logger.error('Inquiry submission error:', error)
      const errorMsg = language === 'ko' ? '문의 제출 중 오류가 발생했습니다.' :
                       language === 'en' ? 'An error occurred while submitting.' :
                       language === 'ja' ? '送信中にエラーが発生しました。' :
                       '提交时发生错误。'
      alert(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'inquiry':
        return <MessageSquare className="w-5 h-5" />
      case 'feedback':
        return <Lightbulb className="w-5 h-5" />
      case 'bug':
        return <Bug className="w-5 h-5" />
      default:
        return <MessageSquare className="w-5 h-5" />
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, Record<string, string>> = {
      inquiry: { ko: '문의', en: 'Inquiry', ja: 'お問い合わせ', zh: '咨询' },
      feedback: { ko: '피드백', en: 'Feedback', ja: 'フィードバック', zh: '反馈' },
      bug: { ko: '버그 제보', en: 'Bug Report', ja: 'バグ報告', zh: '错误报告' },
    }
    return labels[type]?.[language] || labels.inquiry[language]
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: {
        bg: theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-100',
        text: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700',
        icon: <Clock className="w-4 h-4" />,
        label: language === 'ko' ? '대기중' : language === 'en' ? 'Pending' : language === 'ja' ? '待機中' : '待处理',
      },
      'in-progress': {
        bg: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100',
        text: theme === 'dark' ? 'text-blue-400' : 'text-blue-700',
        icon: <MessageSquare className="w-4 h-4" />,
        label: language === 'ko' ? '확인중' : language === 'en' ? 'In Progress' : language === 'ja' ? '確認中' : '处理中',
      },
      resolved: {
        bg: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100',
        text: theme === 'dark' ? 'text-green-400' : 'text-green-700',
        icon: <CheckCircle className="w-4 h-4" />,
        label: language === 'ko' ? '완료' : language === 'en' ? 'Resolved' : language === 'ja' ? '完了' : '已完成',
      },
      rejected: {
        bg: theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100',
        text: theme === 'dark' ? 'text-red-400' : 'text-red-700',
        icon: <XCircle className="w-4 h-4" />,
        label: language === 'ko' ? '거절됨' : language === 'en' ? 'Rejected' : language === 'ja' ? '却下' : '已拒绝',
      },
    }
    return styles[status as keyof typeof styles] || styles.pending
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          {language === 'ko' ? '로딩 중...' : language === 'en' ? 'Loading...' : language === 'ja' ? '読み込み中...' : '加载中...'}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6 sm:mb-8">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {language === 'ko' ? '고객 지원' : language === 'en' ? 'Support' : language === 'ja' ? 'サポート' : '客户支持'}
          </h1>
          <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'ko' ? '문의사항, 피드백, 버그 제보를 남겨주세요' :
             language === 'en' ? 'Submit inquiries, feedback, or bug reports' :
             language === 'ja' ? 'お問い合わせ、フィードバック、バグ報告をお送りください' :
             '提交咨询、反馈或错误报告'}
          </p>
        </div>

        {/* 새 문의 버튼 */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className={`mb-6 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all ${
              theme === 'dark'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            <Send className="w-4 sm:w-5 h-4 sm:h-5 inline mr-2" />
            {language === 'ko' ? '새 문의 작성' : language === 'en' ? 'New Inquiry' : language === 'ja' ? '新しいお問い合わせ' : '新建咨询'}
          </button>
        )}

        {/* 문의 작성 폼 */}
        {showForm && (
          <div
            className={`mb-6 p-4 sm:p-6 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
          >
            <h2 className={`text-lg sm:text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'ko' ? '새 문의 작성' : language === 'en' ? 'New Inquiry' : language === 'ja' ? '新しいお問い合わせ' : '新建咨询'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 타입 선택 */}
              <div>
                <label className={`block mb-2 font-medium text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {language === 'ko' ? '문의 유형' : language === 'en' ? 'Type' : language === 'ja' ? 'お問い合わせ種別' : '咨询类型'}
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { value: 'inquiry', label: language === 'ko' ? '문의' : language === 'en' ? 'Inquiry' : language === 'ja' ? 'お問い合わせ' : '咨询', icon: MessageSquare },
                    { value: 'feedback', label: language === 'ko' ? '피드백' : language === 'en' ? 'Feedback' : language === 'ja' ? 'フィードバック' : '反馈', icon: Lightbulb },
                    { value: 'bug', label: language === 'ko' ? '버그 제보' : language === 'en' ? 'Bug Report' : language === 'ja' ? 'バグ報告' : '错误报告', icon: Bug },
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value as any })}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all text-xs sm:text-sm ${
                        formData.type === type.value
                          ? theme === 'dark'
                            ? 'border-emerald-500 bg-emerald-900/20'
                            : 'border-emerald-500 bg-emerald-50'
                          : theme === 'dark'
                            ? 'border-gray-700 hover:border-gray-600'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <type.icon
                        className={`w-5 sm:w-6 h-5 sm:h-6 mx-auto mb-2 ${
                          formData.type === type.value
                            ? theme === 'dark'
                              ? 'text-emerald-400'
                              : 'text-emerald-600'
                            : theme === 'dark'
                              ? 'text-gray-400'
                              : 'text-gray-500'
                        }`}
                      />
                      <div
                        className={`font-medium ${
                          formData.type === type.value
                            ? theme === 'dark'
                              ? 'text-emerald-400'
                              : 'text-emerald-600'
                            : theme === 'dark'
                              ? 'text-gray-400'
                              : 'text-gray-600'
                        }`}
                      >
                        {type.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 제목 */}
              <div>
                <label className={`block mb-2 font-medium text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {language === 'ko' ? '제목' : language === 'en' ? 'Title' : language === 'ja' ? 'タイトル' : '标题'}
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={language === 'ko' ? '간단한 제목을 입력해주세요' : language === 'en' ? 'Enter a brief title' : language === 'ja' ? '簡単なタイトルを入力してください' : '请输入简短标题'}
                  required
                  className={`w-full px-4 py-3 rounded-xl border text-sm sm:text-base transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>

              {/* 내용 */}
              <div>
                <label className={`block mb-2 font-medium text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {language === 'ko' ? '내용' : language === 'en' ? 'Content' : language === 'ja' ? '内容' : '内容'}
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder={language === 'ko' ? '자세한 내용을 입력해주세요' : language === 'en' ? 'Please provide details' : language === 'ja' ? '詳しい内容を入力してください' : '请输入详细内容'}
                  required
                  rows={6}
                  className={`w-full px-4 py-3 rounded-xl border text-sm sm:text-base transition-colors resize-none ${
                    theme === 'dark'
                      ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 flex-wrap">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 min-w-[120px] px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all ${
                    theme === 'dark'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-gray-700'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-gray-300'
                  }`}
                >
                  {submitting
                    ? (language === 'ko' ? '제출 중...' : language === 'en' ? 'Submitting...' : language === 'ja' ? '送信中...' : '提交中...')
                    : (language === 'ko' ? '제출하기' : language === 'en' ? 'Submit' : language === 'ja' ? '送信する' : '提交')
                  }
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {language === 'ko' ? '취소' : language === 'en' ? 'Cancel' : language === 'ja' ? 'キャンセル' : '取消'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 문의 내역 */}
        <div className="space-y-4">
          <h2 className={`text-lg sm:text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {language === 'ko' ? '내 문의 내역' : language === 'en' ? 'My Inquiries' : language === 'ja' ? 'お問い合わせ履歴' : '我的咨询记录'}
          </h2>
          {inquiries.length === 0 ? (
            <div
              className={`p-4 sm:p-8 text-center rounded-2xl ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              <MessageSquare className={`w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {language === 'ko' ? '아직 문의 내역이 없습니다' : language === 'en' ? 'No inquiries yet' : language === 'ja' ? 'お問い合わせ履歴がありません' : '暂无咨询记录'}
              </p>
            </div>
          ) : (
            inquiries.map((inquiry) => {
              const statusBadge = getStatusBadge(inquiry.status)
              return (
                <div
                  key={inquiry.id}
                  className={`p-4 sm:p-6 rounded-2xl ${
                    theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}
                >
                  {/* 헤더 */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`flex-shrink-0 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {getTypeIcon(inquiry.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`font-medium break-words ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {inquiry.title}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                              theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {getTypeLabel(inquiry.type)}
                          </span>
                        </div>
                        <div className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {inquiry.createdAt.toLocaleDateString(language === 'ko' ? 'ko-KR' : language === 'ja' ? 'ja-JP' : language === 'zh' ? 'zh-CN' : 'en-US')} {inquiry.createdAt.toLocaleTimeString(language === 'ko' ? 'ko-KR' : language === 'ja' ? 'ja-JP' : language === 'zh' ? 'zh-CN' : 'en-US')}
                        </div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full flex-shrink-0 ${statusBadge.bg} ${statusBadge.text}`}>
                      {statusBadge.icon}
                      <span className="text-xs sm:text-sm font-medium">{statusBadge.label}</span>
                    </div>
                  </div>

                  {/* 내용 */}
                  <div className={`mb-3 text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {inquiry.content}
                  </div>

                  {/* 관리자 답변 */}
                  {inquiry.adminReply && (
                    <div
                      className={`mt-4 p-3 sm:p-4 rounded-xl ${
                        theme === 'dark' ? 'bg-emerald-900/20 border border-emerald-800' : 'bg-emerald-50 border border-emerald-200'
                      }`}
                    >
                      <div className={`text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        {language === 'ko' ? '관리자 답변' : language === 'en' ? 'Admin Reply' : language === 'ja' ? '管理者の回答' : '管理员回复'}
                      </div>
                      <div className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{inquiry.adminReply}</div>
                      {inquiry.repliedAt && (
                        <div className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                          {inquiry.repliedAt.toLocaleDateString(language === 'ko' ? 'ko-KR' : language === 'ja' ? 'ja-JP' : language === 'zh' ? 'zh-CN' : 'en-US')} {inquiry.repliedAt.toLocaleTimeString(language === 'ko' ? 'ko-KR' : language === 'ja' ? 'ja-JP' : language === 'zh' ? 'zh-CN' : 'en-US')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
