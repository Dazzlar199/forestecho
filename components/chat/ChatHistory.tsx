'use client'
import { logger } from '@/lib/utils/logger'

import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../layout/AuthProvider'
import { useTheme } from '../layout/ThemeProvider'
import { useLanguage } from '../layout/LanguageProvider'
import { MessageSquare, Plus, Trash2, Menu, X, Search, Inbox } from 'lucide-react'
import { getUserChatSessions, deleteChatSession } from '@/lib/firebase/chat-sessions'
import type { ChatSession } from '@/types/chat'
import EmptyState from '../empty-states/EmptyState'

interface ChatHistoryProps {
  currentSessionId: string | null
  onSelectSession: (session: ChatSession) => void
  onNewChat: () => void
}

export default function ChatHistory({ currentSessionId, onSelectSession, onNewChat }: ChatHistoryProps) {
  const { user } = useAuth()
  const { theme } = useTheme()
  const { language } = useLanguage()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (user) {
      loadSessions()
    }
  }, [user])

  const loadSessions = async () => {
    if (!user) return

    setLoading(true)
    try {
      const userSessions = await getUserChatSessions(user.uid)
      setSessions(userSessions)
    } catch (error) {
      logger.error('Error loading sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    const confirmMessage =
      language === 'ko'
        ? '이 대화를 삭제하시겠습니까?'
        : language === 'en'
        ? 'Delete this conversation?'
        : language === 'ja'
        ? 'この会話を削除しますか？'
        : '删除此对话？'

    if (!confirm(confirmMessage)) return

    try {
      await deleteChatSession(sessionId)
      setSessions((prev) => prev.filter((s) => s.id !== sessionId))

      // 현재 세션 삭제 시 새 대화 시작
      if (sessionId === currentSessionId) {
        onNewChat()
      }
    } catch (error) {
      logger.error('Error deleting session:', error)
      const errorMsg = language === 'ko' ? '삭제에 실패했습니다.' :
                       language === 'en' ? 'Failed to delete.' :
                       language === 'ja' ? '削除に失敗しました。' :
                       '删除失败。'
      alert(errorMsg)
    }
  }

  const handleNewChat = () => {
    onNewChat()
    setIsOpen(false)
  }

  const handleSelectSession = (session: ChatSession) => {
    onSelectSession(session)
    setIsOpen(false)
  }

  // 검색 필터링
  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions

    const query = searchQuery.toLowerCase()
    return sessions.filter((session) => {
      // 제목 검색
      if (session.title.toLowerCase().includes(query)) return true

      // 메시지 내용 검색
      return session.messages.some((message) =>
        message.content.toLowerCase().includes(query)
      )
    })
  }, [sessions, searchQuery])

  if (!user) return null

  return (
    <>
      {/* Toggle Button (왼쪽 아래) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 left-8 z-40 p-3 border transition-all ${
          theme === 'dark'
            ? 'bg-black/60 border-white/10 hover:bg-black/80 text-gray-300'
            : 'bg-white/60 border-gray-300 hover:bg-white/80 text-gray-700'
        }`}
        style={{ borderRadius: '2px' }}
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 backdrop-blur-sm bg-black/40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content (왼쪽에서 슬라이드) */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-40 w-80 bg-black/20 backdrop-blur-xl border-r border-white/10 overflow-y-auto transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full">
              {/* Header */}
              <div className="mb-6">
                <h2
                  className={`text-lg font-light mb-2 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}
                  style={{ letterSpacing: '0.05em' }}
                >
                  {language === 'ko' && '대화 히스토리'}
                  {language === 'en' && 'Chat History'}
                  {language === 'ja' && '会話履歴'}
                  {language === 'zh' && '对话历史'}
                </h2>

                <button
                  onClick={handleNewChat}
                  className={`w-full py-3 flex items-center justify-center gap-2 border transition-all ${
                    theme === 'dark'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-emerald-100 border-emerald-600/40 text-emerald-700 hover:bg-emerald-200'
                  }`}
                  style={{ borderRadius: '2px', fontWeight: 300, letterSpacing: '0.05em' }}
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {language === 'ko' && '새 대화'}
                    {language === 'en' && 'New Chat'}
                    {language === 'ja' && '新しい会話'}
                    {language === 'zh' && '新对话'}
                  </span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <div className={`relative border ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10'
                    : 'bg-gray-50 border-gray-300'
                }`} style={{ borderRadius: '2px' }}>
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  }`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      language === 'ko' ? '대화 검색...' :
                      language === 'en' ? 'Search conversations...' :
                      language === 'ja' ? '会話を検索...' :
                      '搜索对话...'
                    }
                    className={`w-full pl-10 pr-3 py-2 bg-transparent border-0 focus:outline-none ${
                      theme === 'dark' ? 'text-gray-300 placeholder-gray-600' : 'text-gray-800 placeholder-gray-500'
                    }`}
                    style={{ fontWeight: 300, fontSize: '14px' }}
                  />
                </div>
              </div>

              {/* Sessions List */}
              {loading ? (
                <div className={`text-sm text-center py-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                  {language === 'ko' && '불러오는 중...'}
                  {language === 'en' && 'Loading...'}
                  {language === 'ja' && '読み込み中...'}
                  {language === 'zh' && '加载中...'}
                </div>
              ) : sessions.length === 0 ? (
                <div className="py-8">
                  <EmptyState
                    icon={Inbox}
                    title={{
                      ko: '첫 대화를 시작하세요',
                      en: 'Start Your First Chat',
                      ja: '最初の会話を始める',
                      zh: '开始您的第一次对话'
                    }}
                    description={{
                      ko: '새로운 대화를 시작하면 자동으로 저장됩니다',
                      en: 'New conversations will be saved automatically',
                      ja: '新しい会話は自動的に保存されます',
                      zh: '新对话将自动保存'
                    }}
                    action={{
                      label: {
                        ko: '대화 시작',
                        en: 'Start Chat',
                        ja: 'チャット開始',
                        zh: '开始聊天'
                      },
                      onClick: handleNewChat
                    }}
                  />
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="py-8">
                  <EmptyState
                    icon={Search}
                    title={{
                      ko: '검색 결과 없음',
                      en: 'No Results Found',
                      ja: '検索結果なし',
                      zh: '未找到结果'
                    }}
                    description={{
                      ko: '다른 검색어를 시도해보세요',
                      en: 'Try different keywords',
                      ja: '別のキーワードで試してください',
                      zh: '尝试不同的关键词'
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => handleSelectSession(session)}
                      className={`w-full text-left p-3 border transition-all group relative ${
                        currentSessionId === session.id
                          ? theme === 'dark'
                            ? 'bg-emerald-500/20 border-emerald-500/40'
                            : 'bg-emerald-100 border-emerald-600/40'
                          : theme === 'dark'
                          ? 'bg-white/5 border-white/10 hover:bg-white/10'
                          : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                      }`}
                      style={{ borderRadius: '2px' }}
                    >
                      <div className="flex items-start gap-2">
                        <MessageSquare
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            currentSessionId === session.id
                              ? 'text-emerald-500'
                              : theme === 'dark'
                              ? 'text-gray-500'
                              : 'text-gray-600'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm truncate ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                            }`}
                            style={{ fontWeight: 300 }}
                          >
                            {session.title}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                            }`}
                          >
                            {new Date(session.updatedAt).toLocaleDateString(language)}
                          </p>
                        </div>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => handleDelete(session.id, e)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              handleDelete(session.id, e as any)
                            }
                          }}
                          className={`opacity-0 group-hover:opacity-100 p-1 transition-opacity cursor-pointer ${
                            theme === 'dark'
                              ? 'hover:bg-red-500/20 text-red-400'
                              : 'hover:bg-red-100 text-red-600'
                          }`}
                          style={{ borderRadius: '2px' }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
        </div>
      </div>
    </>
  )
}
