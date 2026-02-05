'use client'
import { logger } from '@/lib/utils/logger'

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
import GuestLimitModal from '../auth/GuestLimitModal'
import AuthModal from '../auth/AuthModal'
import UpgradeModal from '../trust/UpgradeModal'
import EmotionPicker from '../onboarding/EmotionPicker'
import QuickStartTemplates from '../onboarding/QuickStartTemplates'
import SOSButton from '../crisis/SOSButton'
import type { Message } from '@/types'
import type { CounselingMode } from '@/lib/openai/counseling-modes'
import {
  createChatSession,
  updateChatSession,
  generateChatTitle,
  getChatSession,
} from '@/lib/firebase/chat-sessions'
import ChatHistory from './ChatHistory'
import type { ChatSession } from '@/types/chat'
import { useGuestMode } from '@/hooks/useGuestMode'

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
  const [showGuestLimitModal, setShowGuestLimitModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showEmotionPicker, setShowEmotionPicker] = useState(false)
  const [showQuickStart, setShowQuickStart] = useState(true)
  const [selectedEmotion, setSelectedEmotion] = useState<{emotion: string, intensity: number} | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { user, isPremium} = useAuth()
  const { guestMessageCount, isGuestLimitReached, remainingMessages, incrementGuestCount } = useGuestMode()

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // 페이지 로드 시 이전 대화 세션 복원 + 감정 선택기 표시
  useEffect(() => {
    const restoreSession = async () => {
      if (!user) return

      const savedSessionId = localStorage.getItem('currentChatSessionId')
      if (savedSessionId) {
        try {
          const session = await getChatSession(savedSessionId)
          if (session && session.messages && session.messages.length > 0) {
            setMessages(session.messages)
            setCounselingMode(session.counselingMode)
            setCurrentSessionId(session.id)
            setShowQuickStart(false) // 기존 세션이 있으면 빠른 시작 숨김
          } else {
            // 세션이 비어있으면 localStorage 정리하고 초기 메시지 표시
            localStorage.removeItem('currentChatSessionId')
          }
        } catch (error) {
          logger.error('Error restoring session:', error)
          // 복원 실패 시 localStorage 정리
          localStorage.removeItem('currentChatSessionId')
        }
      }
    }

    restoreSession()

    // 첫 방문 시 감정 선택기 표시 (한번만)
    const hasShownEmotionPicker = localStorage.getItem('emotion_picker_shown')
    if (!hasShownEmotionPicker && messages.length === 1) {
      setShowEmotionPicker(true)
    }
  }, [user])

  const handleSend = useCallback(async () => {
    // 게스트 모드: 제한 도달 시 모달 표시
    if (!user && isGuestLimitReached) {
      setShowGuestLimitModal(true)
      return
    }

    if (!input.trim() || isLoading) return

    // 게스트 사용자 카운트 증가
    if (!user) {
      incrementGuestCount()
    }

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // 스트리밍 메시지를 위한 임시 assistant 메시지 추가
    const tempAssistantMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, tempAssistantMessage])

    try {
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
          responseTone,
          userId: user?.uid || null, // Tier 체크용
        }),
      })

      if (!response.ok) {
        // 에러 응답 상세 정보 가져오기
        let errorMessage = language === 'ko' ? '응답을 받는데 실패했습니다' :
                         language === 'en' ? 'Failed to get response' :
                         language === 'ja' ? '応答の取得に失敗しました' :
                         '获取响应失败'
        try {
          const errorData = await response.json()
          logger.error('API Error:', errorData)
          errorMessage = errorData.error || errorData.error_en || errorMessage
        } catch (e) {
          logger.error('Failed to parse error response')
        }
        throw new Error(errorMessage)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('Stream unavailable')
      }

      let fullContent = ''
      let metadata: any = null

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))

              if (data.content) {
                fullContent += data.content
                // 실시간으로 메시지 업데이트
                setMessages((prev) => {
                  const newMessages = [...prev]
                  newMessages[newMessages.length - 1] = {
                    ...newMessages[newMessages.length - 1],
                    content: fullContent,
                  }
                  return newMessages
                })
              }

              if (data.done) {
                metadata = data.metadata
                // 위기 상황 감지 시 모달 표시
                if (metadata?.isCrisis) {
                  setShowCrisisModal(true)
                }
              }
            } catch (e) {
              // JSON 파싱 에러 무시
            }
          }
        }
      }

      // 최종 메시지 업데이트
      let latestMessages: Message[] = []
      setMessages((prev) => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = {
          ...newMessages[newMessages.length - 1],
          content: fullContent,
          metadata: metadata,
        }
        latestMessages = newMessages
        return newMessages
      })

      // Firestore에 대화 저장 (비동기로 백그라운드에서 처리)
      if (user) {
        const allMessages: Message[] = latestMessages;

        (async () => {
          try {
            if (!currentSessionId) {
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
              await updateChatSession(currentSessionId, allMessages)
            }
          } catch (saveError) {
            logger.error('Error saving chat session:', saveError)
          }
        })()
      }
    } catch (error: any) {
      logger.error('Error:', error)

      let errorContent = ''

      if (error.name === 'AbortError') {
        errorContent = language === 'ko' ? '응답 시간이 초과되었습니다. 네트워크 연결을 확인하고 다시 시도해주세요.' :
                       language === 'en' ? 'Response timed out. Please check your connection and try again.' :
                       language === 'ja' ? '応答がタイムアウトしました。接続を確認して再度お試しください。' :
                       '响应超时。请检查网络连接并重试。'
      } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        errorContent = language === 'ko' ? '네트워크 연결에 실패했습니다. 인터넷 연결을 확인해주세요.' :
                       language === 'en' ? 'Network connection failed. Please check your internet.' :
                       language === 'ja' ? 'ネットワーク接続に失敗しました。インターネット接続を確認してください。' :
                       '网络连接失败。请检查您的网络。'
      } else if (error.message?.includes('DAILY_LIMIT_REACHED')) {
        setShowUpgradeModal(true)
      } else {
        errorContent = language === 'ko' ? '일시적인 오류가 발생했습니다. 다시 시도해주세요.' :
                       language === 'en' ? 'A temporary error occurred. Please try again.' :
                       language === 'ja' ? '一時的なエラーが発生しました。もう一度お試しください。' :
                       '发生了临时错误。请重试。'
      }

      // 에러 메시지를 어시스턴트 메시지로 표시 (alert 대신)
      if (errorContent) {
        setMessages((prev) => [
          ...prev.slice(0, -2),
          { role: 'assistant', content: errorContent, timestamp: new Date() },
        ])
        return // 아래 slice 실행 방지
      }

      // 에러 발생 시 마지막 2개 메시지 제거 (user + temp assistant)
      setMessages((prev) => prev.slice(0, -2))
    } finally {
      setIsLoading(false)
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
    setShowQuickStart(true)
  }, [])

  const handleEmotionSelect = useCallback((emotion: string, intensity: number) => {
    setSelectedEmotion({ emotion, intensity })
    setShowEmotionPicker(false)
    localStorage.setItem('emotion_picker_shown', 'true')

    // 감정 정보를 포함한 첫 메시지 자동 생성
    const emotionLabels: Record<string, Record<string, string>> = {
      happy: { ko: '행복', en: 'happiness', ja: '幸せ', zh: '开心' },
      sad: { ko: '슬픔', en: 'sadness', ja: '悲しみ', zh: '悲伤' },
      anxious: { ko: '불안', en: 'anxiety', ja: '不安', zh: '焦虑' },
      angry: { ko: '화남', en: 'anger', ja: '怒り', zh: '愤怒' },
      tired: { ko: '지침', en: 'tiredness', ja: '疲れ', zh: '疲惫' },
      calm: { ko: '평온', en: 'calmness', ja: '穏やかさ', zh: '平静' },
      excited: { ko: '설렘', en: 'excitement', ja: '興奮', zh: '兴奋' },
      confused: { ko: '혼란', en: 'confusion', ja: '混乱', zh: '困惑' },
    }
    const emotionLabel = emotionLabels[emotion]?.[language] || emotion
    const msg = language === 'ko' ? `지금 ${emotionLabel}을 느끼고 있어요 (강도: ${intensity}/10).` :
                language === 'en' ? `I'm feeling ${emotionLabel} right now (intensity: ${intensity}/10).` :
                language === 'ja' ? `今${emotionLabel}を感じています（強度：${intensity}/10）。` :
                `我现在感到${emotionLabel}（强度：${intensity}/10）。`
    setInput(msg)
  }, [])

  const handleTemplateSelect = useCallback((template: string) => {
    setInput(template)
    setShowQuickStart(false)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  const handleSkipEmotion = useCallback(() => {
    setShowEmotionPicker(false)
    localStorage.setItem('emotion_picker_shown', 'true')
  }, [])

  const handleSelectSession = useCallback((session: ChatSession) => {
    setMessages(session.messages)
    setCounselingMode(session.counselingMode)
    setCurrentSessionId(session.id)
    localStorage.setItem('currentChatSessionId', session.id)
  }, [])

  return (
    <div className="flex h-screen" style={{
      paddingBottom: 'var(--safe-area-inset-bottom)'
    }}>
      {/* Emotion Picker Sidebar (왼쪽) */}
      {showEmotionPicker && (
        <div className="w-80 border-r border-white/10 bg-black/20 backdrop-blur-xl p-4 overflow-y-auto hidden md:block">
          <div className="sticky top-0">
            <h3 className="text-lg font-medium text-gray-100 mb-4">
              {language === 'ko' ? '현재 감정 상태' :
               language === 'en' ? 'Current Mood' :
               language === 'ja' ? '現在の気分' : '当前情绪'}
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { id: 'happy', label: language === 'ko' ? '행복' : language === 'en' ? 'Happy' : language === 'ja' ? '幸せ' : '开心' },
                { id: 'sad', label: language === 'ko' ? '슬픔' : language === 'en' ? 'Sad' : language === 'ja' ? '悲しみ' : '悲伤' },
                { id: 'anxious', label: language === 'ko' ? '불안' : language === 'en' ? 'Anxious' : language === 'ja' ? '不安' : '焦虑' },
                { id: 'angry', label: language === 'ko' ? '분노' : language === 'en' ? 'Angry' : language === 'ja' ? '怒り' : '愤怒' },
                { id: 'tired', label: language === 'ko' ? '피로' : language === 'en' ? 'Tired' : language === 'ja' ? '疲れ' : '疲惫' },
                { id: 'calm', label: language === 'ko' ? '평온' : language === 'en' ? 'Calm' : language === 'ja' ? '穏やか' : '平静' },
                { id: 'excited', label: language === 'ko' ? '흥분' : language === 'en' ? 'Excited' : language === 'ja' ? '興奮' : '兴奋' },
                { id: 'confused', label: language === 'ko' ? '혼란' : language === 'en' ? 'Confused' : language === 'ja' ? '混乱' : '困惑' },
              ].map((emotion) => (
                <button
                  key={emotion.id}
                  onClick={() => handleEmotionSelect(emotion.id, 5)}
                  className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all text-center text-sm text-gray-300"
                >
                  {emotion.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleSkipEmotion}
              className="w-full text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              {language === 'ko' ? '건너뛰기' :
               language === 'en' ? 'Skip' :
               language === 'ja' ? 'スキップ' : '跳过'}
            </button>
          </div>
        </div>
      )}

      {/* Main Chat Area (중앙) */}
      <div className="flex-1 flex flex-col py-2 sm:py-4 px-3 sm:px-4 max-w-5xl mx-auto w-full">
        {/* 대화 모드 및 톤 설정 */}
        <div className="mb-3 sm:mb-4 space-y-3">
          <ModeSelector
            selectedMode={counselingMode}
            onModeChange={setCounselingMode}
          />
          <ToneSlider value={responseTone} onChange={setResponseTone} />
        </div>

        <div className="flex-1 flex flex-col bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden min-h-0">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 space-y-4 sm:space-y-6">
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

          {/* Quick Start Templates */}
          {showQuickStart && messages.length === 1 && (
            <div className="border-t border-white/10 bg-black/10 p-3">
              <div className="flex flex-wrap gap-2">
                {(language === 'ko' ? [
                  { label: '직장 스트레스', prompt: '요즘 직장에서 스트레스를 많이 받고 있습니다.' },
                  { label: '관계 문제', prompt: '주변 사람들과의 관계에서 어려움이 있습니다.' },
                  { label: '불안 증상', prompt: '요즘 이유 없이 불안하고 걱정이 많습니다.' },
                  { label: '가족 갈등', prompt: '가족 관계에서 갈등이 있습니다.' },
                  { label: '대인관계', prompt: '사람들과 어울리는 것이 힘듭니다.' },
                  { label: '자아 정체성', prompt: '내가 누구인지 모르겠습니다.' },
                ] : language === 'ja' ? [
                  { label: '仕事のストレス', prompt: '最近、仕事でストレスをたくさん感じています。' },
                  { label: '人間関係', prompt: '周りの人との関係で悩んでいます。' },
                  { label: '不安症状', prompt: '最近、理由もなく不安で心配が多いです。' },
                  { label: '家族の問題', prompt: '家族関係で葛藤があります。' },
                  { label: '対人関係', prompt: '人と付き合うのが辛いです。' },
                  { label: 'アイデンティティ', prompt: '自分が誰なのかわかりません。' },
                ] : language === 'zh' ? [
                  { label: '工作压力', prompt: '最近在工作中承受很大的压力。' },
                  { label: '人际关系', prompt: '与周围人的关系中遇到了困难。' },
                  { label: '焦虑症状', prompt: '最近无缘无故感到焦虑和担忧。' },
                  { label: '家庭矛盾', prompt: '家庭关系中存在矛盾。' },
                  { label: '社交困难', prompt: '与人交往感到很困难。' },
                  { label: '自我认同', prompt: '不知道自己是谁。' },
                ] : [
                  { label: 'Work Stress', prompt: 'I\'ve been feeling very stressed at work lately.' },
                  { label: 'Relationships', prompt: 'I\'m having difficulties in my relationships.' },
                  { label: 'Anxiety', prompt: 'I\'ve been feeling anxious and worried for no reason.' },
                  { label: 'Family Issues', prompt: 'There are conflicts in my family.' },
                  { label: 'Social Life', prompt: 'I find it hard to socialize with people.' },
                  { label: 'Identity', prompt: 'I don\'t know who I am.' },
                ]).map((template, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTemplateSelect(template.prompt)}
                    className="px-3 py-2 text-xs sm:text-sm bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-lg transition-all text-gray-300"
                  >
                    {template.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-white/10 bg-black/30 px-4 py-3 sm:px-6 sm:py-4"
            style={{
              paddingBottom: 'max(0.75rem, calc(var(--safe-area-inset-bottom) + 0.75rem))'
            }}>
            <div className="flex gap-2 sm:gap-3 items-end">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('placeholder')}
                className="flex-1 resize-none border-0 bg-transparent px-0 py-2 sm:py-3 focus:outline-none focus:ring-0 text-gray-200 placeholder-gray-600 text-sm sm:text-base"
                style={{ fontWeight: 300, fontSize: '16px', lineHeight: 1.8, letterSpacing: '0.02em' }}
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-3 text-gray-500 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Send message"
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
      </div>

      {/* Chat History Sidebar (오른쪽) */}
      {user && (
        <ChatHistory
          currentSessionId={currentSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
        />
      )}

      {/* Crisis Modal */}
      <CrisisModal isOpen={showCrisisModal} onClose={() => setShowCrisisModal(false)} />

      {/* Guest Limit Modal */}
      <GuestLimitModal
        isOpen={showGuestLimitModal}
        onClose={() => setShowGuestLimitModal(false)}
        onSignUp={() => {
          setShowGuestLimitModal(false)
          setShowAuthModal(true)
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentTier={user ? 'free' : 'guest'}
        dailyUsed={guestMessageCount}
        dailyLimit={user ? 20 : 3}
      />

      {/* Emotion Picker (모바일용 모달) */}
      {showEmotionPicker && (
        <div className="md:hidden">
          <EmotionPicker
            onSelect={handleEmotionSelect}
            onSkip={handleSkipEmotion}
          />
        </div>
      )}

      {/* SOS Button - Always visible */}
      <SOSButton onCrisisClick={() => setShowCrisisModal(true)} />
    </div>
  )
}
