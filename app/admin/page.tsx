'use client'

import { useState, useEffect } from 'react'
import { logger } from '@/lib/utils/logger'
import { useAuth } from '@/components/layout/AuthProvider'
import { useTheme } from '@/components/layout/ThemeProvider'
import { db } from '@/lib/firebase/config'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  where,
  getDocs,
} from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import {
  Shield,
  MessageSquare,
  Bug,
  Lightbulb,
  Users,
  FileText,
  Plus,
  Edit,
  Trash2,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  BarChart,
} from 'lucide-react'

interface Inquiry {
  id: string
  userId: string
  userEmail: string
  type: 'inquiry' | 'feedback' | 'bug'
  title: string
  content: string
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected'
  createdAt: Date
  adminReply?: string
  repliedAt?: Date
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
  createdAt: Date
}

interface Stats {
  totalUsers: number
  totalInquiries: number
  pendingInquiries: number
  totalFAQs: number
}

export default function AdminPage() {
  const { user, loading } = useAuth()
  const { theme } = useTheme()
  const router = useRouter()

  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState<'inquiries' | 'faqs' | 'stats'>('inquiries')
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [faqs, setFAQs] = useState<FAQ[]>([])
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalInquiries: 0, pendingInquiries: 0, totalFAQs: 0 })

  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replying, setReplying] = useState(false)

  const [showFAQForm, setShowFAQForm] = useState(false)
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null)
  const [faqFormData, setFaqFormData] = useState({ question: '', answer: '', category: '일반' })

  // 관리자 체크 (서버 사이드 API 호출)
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    async function checkAdminStatus() {
      if (!user) return

      try {
        // Firebase ID Token 가져오기
        const token = await user.getIdToken()

        // 서버 사이드 API로 admin 체크
        const res = await fetch('/api/admin/check', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if (data.isAdmin) {
          setIsAdmin(true)
        } else {
          alert('Admin access only.')
          router.push('/')
        }
      } catch (error) {
        logger.error('Admin check failed:', error)
        alert('Permission check failed.')
        router.push('/')
      }
    }

    if (user) {
      checkAdminStatus()
    }
  }, [user, loading, router])

  // 문의 불러오기
  useEffect(() => {
    if (!isAdmin) return

    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'))

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
  }, [isAdmin])

  // FAQ 불러오기
  useEffect(() => {
    if (!isAdmin) return

    const q = query(collection(db, 'faqs'), orderBy('order', 'asc'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const faqsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as FAQ[]
      setFAQs(faqsData)
    })

    return () => unsubscribe()
  }, [isAdmin])

  // 통계 불러오기
  useEffect(() => {
    if (!isAdmin) return

    const fetchStats = async () => {
      try {
        // 총 사용자 수
        const usersSnapshot = await getDocs(collection(db, 'users'))
        const totalUsers = usersSnapshot.size

        // 총 문의 수
        const totalInquiries = inquiries.length

        // 대기중인 문의 수
        const pendingInquiries = inquiries.filter((i) => i.status === 'pending').length

        // 총 FAQ 수
        const totalFAQs = faqs.length

        setStats({ totalUsers, totalInquiries, pendingInquiries, totalFAQs })
      } catch (error) {
        logger.error('통계 불러오기 오류:', error)
      }
    }

    fetchStats()
  }, [isAdmin, inquiries, faqs])

  // 문의 상태 업데이트
  const updateInquiryStatus = async (inquiryId: string, status: Inquiry['status']) => {
    try {
      await updateDoc(doc(db, 'inquiries', inquiryId), { status })
    } catch (error) {
      logger.error('상태 업데이트 오류:', error)
      alert('Status update failed.')
    }
  }

  // 답변 제출
  const handleReply = async () => {
    if (!selectedInquiry || !replyText.trim()) return

    setReplying(true)
    try {
      await updateDoc(doc(db, 'inquiries', selectedInquiry.id), {
        adminReply: replyText.trim(),
        repliedAt: new Date(),
        status: 'resolved',
      })

      setReplyText('')
      setSelectedInquiry(null)
      alert('Reply sent successfully.')
    } catch (error) {
      logger.error('답변 제출 오류:', error)
      alert('Reply submission failed.')
    } finally {
      setReplying(false)
    }
  }

  // FAQ 추가/수정
  const handleFAQSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!faqFormData.question.trim() || !faqFormData.answer.trim()) return

    try {
      if (editingFAQ) {
        // 수정
        await updateDoc(doc(db, 'faqs', editingFAQ.id), {
          question: faqFormData.question.trim(),
          answer: faqFormData.answer.trim(),
          category: faqFormData.category,
        })
        alert('FAQ updated.')
      } else {
        // 추가
        await addDoc(collection(db, 'faqs'), {
          question: faqFormData.question.trim(),
          answer: faqFormData.answer.trim(),
          category: faqFormData.category,
          order: faqs.length,
          createdAt: new Date(),
        })
        alert('FAQ added.')
      }

      setFaqFormData({ question: '', answer: '', category: '일반' })
      setShowFAQForm(false)
      setEditingFAQ(null)
    } catch (error) {
      logger.error('FAQ 저장 오류:', error)
      alert('FAQ save failed.')
    }
  }

  // FAQ 삭제
  const handleDeleteFAQ = async (faqId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      await deleteDoc(doc(db, 'faqs', faqId))
      alert('FAQ deleted.')
    } catch (error) {
      logger.error('FAQ 삭제 오류:', error)
      alert('FAQ delete failed.')
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'inquiry':
        return <MessageSquare className="w-4 h-4" />
      case 'feedback':
        return <Lightbulb className="w-4 h-4" />
      case 'bug':
        return <Bug className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'inquiry':
        return '문의'
      case 'feedback':
        return '피드백'
      case 'bug':
        return '버그'
      default:
        return '문의'
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: {
        bg: theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-100',
        text: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700',
        icon: <Clock className="w-4 h-4" />,
        label: '대기',
      },
      'in-progress': {
        bg: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100',
        text: theme === 'dark' ? 'text-blue-400' : 'text-blue-700',
        icon: <MessageSquare className="w-4 h-4" />,
        label: '확인중',
      },
      resolved: {
        bg: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100',
        text: theme === 'dark' ? 'text-green-400' : 'text-green-700',
        icon: <CheckCircle className="w-4 h-4" />,
        label: '완료',
      },
      rejected: {
        bg: theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100',
        text: theme === 'dark' ? 'text-red-400' : 'text-red-700',
        icon: <XCircle className="w-4 h-4" />,
        label: '거절',
      },
    }
    return styles[status as keyof typeof styles] || styles.pending
  }

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className={`w-6 sm:w-8 h-6 sm:h-8 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>관리자 대시보드</h1>
          </div>
          <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>문의 관리, FAQ 관리, 통계 확인</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {[
            { label: '총 사용자', value: stats.totalUsers, icon: Users, color: 'blue' },
            { label: '총 문의', value: stats.totalInquiries, icon: MessageSquare, color: 'purple' },
            { label: '대기중 문의', value: stats.pendingInquiries, icon: Clock, color: 'yellow' },
            { label: '총 FAQ', value: stats.totalFAQs, icon: FileText, color: 'green' },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`p-4 sm:p-6 rounded-2xl ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon
                  className={`w-6 sm:w-8 h-6 sm:h-8 ${
                    stat.color === 'blue'
                      ? theme === 'dark'
                        ? 'text-blue-400'
                        : 'text-blue-600'
                      : stat.color === 'purple'
                        ? theme === 'dark'
                          ? 'text-purple-400'
                          : 'text-purple-600'
                        : stat.color === 'yellow'
                          ? theme === 'dark'
                            ? 'text-yellow-400'
                            : 'text-yellow-600'
                          : theme === 'dark'
                            ? 'text-green-400'
                            : 'text-green-600'
                  }`}
                />
              </div>
              <div className={`text-2xl sm:text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </div>
              <div className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 탭 */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: 'inquiries', label: '문의 관리', icon: MessageSquare },
            { id: 'faqs', label: 'FAQ 관리', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all ${
                activeTab === tab.id
                  ? theme === 'dark'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-500 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 sm:w-5 h-4 sm:h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 문의 관리 탭 */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <div
                className={`p-4 sm:p-8 text-center rounded-2xl ${
                  theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
              >
                <MessageSquare
                  className={`w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}
                />
                <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>문의가 없습니다</p>
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
                        <div className="flex-1 min-w-0">
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
                            {inquiry.userEmail} • {inquiry.createdAt.toLocaleDateString('ko-KR')}{' '}
                            {inquiry.createdAt.toLocaleTimeString('ko-KR')}
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

                    {/* 답변 */}
                    {inquiry.adminReply ? (
                      <div
                        className={`p-3 sm:p-4 rounded-xl mb-3 ${
                          theme === 'dark'
                            ? 'bg-emerald-900/20 border border-emerald-800'
                            : 'bg-emerald-50 border border-emerald-200'
                        }`}
                      >
                        <div
                          className={`text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}
                        >
                          관리자 답변
                        </div>
                        <div className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{inquiry.adminReply}</div>
                      </div>
                    ) : selectedInquiry?.id === inquiry.id ? (
                      <div className="space-y-3 mb-3">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="답변을 입력하세요..."
                          rows={4}
                          className={`w-full px-4 py-3 rounded-xl border text-sm sm:text-base transition-colors resize-none ${
                            theme === 'dark'
                              ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
                              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                          }`}
                        />
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={handleReply}
                            disabled={replying || !replyText.trim()}
                            className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all ${
                              theme === 'dark'
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-gray-700'
                                : 'bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-gray-300'
                            }`}
                          >
                            <Send className="w-4 h-4" />
                            {replying ? '전송 중...' : '답변 전송'}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedInquiry(null)
                              setReplyText('')
                            }}
                            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all ${
                              theme === 'dark'
                                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {/* 액션 버튼 */}
                    <div className="flex gap-2 flex-wrap">
                      {!inquiry.adminReply && selectedInquiry?.id !== inquiry.id && (
                        <button
                          onClick={() => setSelectedInquiry(inquiry)}
                          className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all ${
                            theme === 'dark'
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                          }`}
                        >
                          답변하기
                        </button>
                      )}
                      <select
                        value={inquiry.status}
                        onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value as Inquiry['status'])}
                        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl border font-medium text-sm sm:text-base transition-colors ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="pending">대기</option>
                        <option value="in-progress">확인중</option>
                        <option value="resolved">완료</option>
                        <option value="rejected">거절</option>
                      </select>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* FAQ 관리 탭 */}
        {activeTab === 'faqs' && (
          <div className="space-y-4">
            {/* 새 FAQ 버튼 */}
            {!showFAQForm && (
              <button
                onClick={() => setShowFAQForm(true)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all ${
                  theme === 'dark'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                <Plus className="w-4 sm:w-5 h-4 sm:h-5 inline mr-2" />새 FAQ 추가
              </button>
            )}

            {/* FAQ 추가/수정 폼 */}
            {showFAQForm && (
              <div
                className={`p-4 sm:p-6 rounded-2xl ${
                  theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
              >
                <h3 className={`text-lg sm:text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {editingFAQ ? 'FAQ 수정' : '새 FAQ 추가'}
                </h3>
                <form onSubmit={handleFAQSubmit} className="space-y-4">
                  <div>
                    <label className={`block mb-2 font-medium text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      카테고리
                    </label>
                    <input
                      type="text"
                      value={faqFormData.category}
                      onChange={(e) => setFaqFormData({ ...faqFormData, category: e.target.value })}
                      placeholder="일반, 계정, 기능 등"
                      className={`w-full px-4 py-3 rounded-xl border text-sm sm:text-base transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block mb-2 font-medium text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      질문
                    </label>
                    <input
                      type="text"
                      value={faqFormData.question}
                      onChange={(e) => setFaqFormData({ ...faqFormData, question: e.target.value })}
                      placeholder="자주 묻는 질문을 입력하세요"
                      required
                      className={`w-full px-4 py-3 rounded-xl border text-sm sm:text-base transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block mb-2 font-medium text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      답변
                    </label>
                    <textarea
                      value={faqFormData.answer}
                      onChange={(e) => setFaqFormData({ ...faqFormData, answer: e.target.value })}
                      placeholder="답변을 입력하세요"
                      required
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border text-sm sm:text-base transition-colors resize-none ${
                        theme === 'dark'
                          ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      type="submit"
                      className={`flex-1 min-w-[120px] px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all ${
                        theme === 'dark'
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      }`}
                    >
                      {editingFAQ ? '수정하기' : '추가하기'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowFAQForm(false)
                        setEditingFAQ(null)
                        setFaqFormData({ question: '', answer: '', category: '일반' })
                      }}
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all ${
                        theme === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      취소
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* FAQ 목록 */}
            {faqs.length === 0 ? (
              <div
                className={`p-4 sm:p-8 text-center rounded-2xl ${
                  theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
              >
                <FileText className={`w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>FAQ가 없습니다</p>
              </div>
            ) : (
              faqs.map((faq) => (
                <div
                  key={faq.id}
                  className={`p-4 sm:p-6 rounded-2xl ${
                    theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <span
                        className={`inline-block text-xs px-2 py-1 rounded-full mb-2 ${
                          theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {faq.category}
                      </span>
                      <h4 className={`font-bold mb-2 break-words text-sm sm:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {faq.question}
                      </h4>
                      <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{faq.answer}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          setEditingFAQ(faq)
                          setFaqFormData({ question: faq.question, answer: faq.answer, category: faq.category })
                          setShowFAQForm(true)
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFAQ(faq.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          theme === 'dark' ? 'hover:bg-red-900/20 text-red-400' : 'hover:bg-red-100 text-red-600'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
