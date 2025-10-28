'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { FIRST_MESSAGE } from '@/lib/openai/prompts'
import ChatMessage from './ChatMessage'
import { useAuth } from '../layout/AuthProvider'
import { useLanguage } from '../layout/LanguageProvider'
import AnalysisReport from '../premium/AnalysisReport'
import ModeSelector from '../counseling/ModeSelector'
import ToneSlider from '../counseling/ToneSlider'
import CrisisModal from '../crisis/CrisisModal'
import type { Message } from '@/types'
import type { CounselingMode } from '@/lib/openai/counseling-modes'
import {
  createChatSession,
  updateChatSession,
  generateChatTitle,
} from '@/lib/firebase/chat-sessions'
import ChatHistory from './ChatHistory'
import type { ChatSession } from '@/types/chat'

export default function ChatInterface() {
  const { language, t } = useLanguage()
  const [counselingMode, setCounselingMode] = useState<CounselingMode>('general')
  const [responseTone, setResponseTone] = useState(50) // 0: 이성적, 100: 감성적
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: FIRST_MESSAGE,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [showCrisisModal, setShowCrisisModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { user, isPremium} = useAuth()

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // 페이지 로드 시 이전 대화 세션 복원
  useEffect(() => {
    const restoreSession = async () => {
      if (!user) return

      const savedSessionId = localStorage.getItem('currentChatSessionId')
      if (savedSessionId) {
        try {
          const { getChatSession } = await import('@/lib/firebase/chat-sessions')
          const session = await getChatSession(savedSessionId)
          if (session && session.messages && session.messages.length > 0) {
            setMessages(session.messages)
            setCounselingMode(session.counselingMode)
            setCurrentSessionId(session.id)
          } else {
            // 세션이 비어있으면 localStorage 정리하고 초기 메시지 표시
            localStorage.removeItem('currentChatSessionId')
          }
        } catch (error) {
          console.error('Error restoring session:', error)
          // 복원 실패 시 localStorage 정리
          localStorage.removeItem('currentChatSessionId')
        }
      }
    }

    restoreSession()
  }, [user])

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // 30초 타임아웃 설정
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          language,
          counselingMode,
          responseTone, // 이성-감정 비율 전달
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error('응답을 받는데 실패했습니다')
      }

      const data = await response.json()

      // 위기 상황 감지 시 모달 표시
      if (data.metadata?.isCrisis) {
        setShowCrisisModal(true)
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      }

      let latestMessages: Message[] = []
      setMessages((prev) => {
        latestMessages = [...prev, assistantMessage]
        return latestMessages
      })

      // Firestore에 대화 저장 (비동기로 백그라운드에서 처리)
      if (user) {
        const allMessages: Message[] = latestMessages;

        // Promise를 await 없이 실행 - UI를 블로킹하지 않음
        (async () => {
          try {
            if (!currentSessionId) {
              // 새 세션 생성
              const title = generateChatTitle(allMessages)
              const sessionId = await createChatSession({
                userId: user.uid,
                title,
                messages: allMessages,
                counselingMode,
              })
              setCurrentSessionId(sessionId)
              localStorage.setItem('currentChatSessionId', sessionId)
            } else {
              // 기존 세션 업데이트
              await updateChatSession(currentSessionId, allMessages)
            }
          } catch (saveError) {
            console.error('Error saving chat session:', saveError)
            // 저장 실패해도 대화는 계속 진행
          }
        })()
      }
    } catch (error: any) {
      console.error('Error:', error)

      if (error.name === 'AbortError') {
        alert('응답 시간이 초과되었습니다. 다시 시도해주세요.')
      } else {
        alert('죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.')
      }

      // 에러 발생 시 마지막 메시지 제거
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
      // 응답 후 입력창 포커스 복원
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
        }
      })
    }
  }, [input, isLoading, isPremium, user, messages, language, counselingMode, responseTone, currentSessionId])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const handleNewChat = useCallback(() => {
    setMessages([
      {
        role: 'assistant',
        content: FIRST_MESSAGE,
        timestamp: new Date(),
      },
    ])
    setCurrentSessionId(null)
    localStorage.removeItem('currentChatSessionId')
    setCounselingMode('general')
  }, [])

  const handleSelectSession = useCallback((session: ChatSession) => {
    setMessages(session.messages)
    setCounselingMode(session.counselingMode)
    setCurrentSessionId(session.id)
    localStorage.setItem('currentChatSessionId', session.id)
  }, [])

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Chat History Sidebar */}
      {user && (
        <ChatHistory
          currentSessionId={currentSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
        />
      )}

      {/* Mode Selector */}
      <ModeSelector selectedMode={counselingMode} onModeChange={setCounselingMode} />

      {/* Tone Slider */}
      <ToneSlider value={responseTone} onChange={setResponseTone} />

      <div className="h-[65vh] flex flex-col bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-10 py-12 space-y-8">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span style={{ fontWeight: 300, letterSpacing: '0.02em' }}>{t('listening')}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 bg-black/30 px-10 py-8">
          <div className="flex gap-4">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('placeholder')}
              className="flex-1 resize-none border-0 bg-transparent px-0 py-3 focus:outline-none focus:ring-0 text-gray-200 placeholder-gray-600"
              style={{ fontWeight: 300, fontSize: '16px', lineHeight: 1.8, letterSpacing: '0.02em' }}
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="self-end p-3 text-gray-500 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

    {/* Premium Analysis */}
    {messages.length > 3 && (
      <AnalysisReport messages={messages} isPremium={isPremium} sessionId={currentSessionId} />
    )}

      {/* Crisis Modal */}
      <CrisisModal isOpen={showCrisisModal} onClose={() => setShowCrisisModal(false)} />
  </div>
  )
}
