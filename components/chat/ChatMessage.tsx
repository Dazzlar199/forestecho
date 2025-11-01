'use client'

import { User, Bot } from 'lucide-react'
import type { Message } from '@/types'
import MessageInsights from './MessageInsights'

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 sm:gap-4 md:gap-5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
        {isUser ? (
          <User className="w-4 h-4 text-gray-500" />
        ) : (
          <Bot className="w-4 h-4 text-gray-500" />
        )}
      </div>

      <div className={`chat-message ${isUser ? 'user' : 'assistant'} max-w-[85%] sm:max-w-none`}>
        <div className="whitespace-pre-wrap break-words text-sm sm:text-base" style={{ letterSpacing: '0.01em' }}>
          {message.content}
        </div>

        {/* Structured Output 인사이트 표시 (assistant 메시지만) */}
        {!isUser && message.metadata && (
          <MessageInsights metadata={message.metadata} />
        )}

        <div className={`text-xs mt-2 sm:mt-4 ${isUser ? 'text-gray-600' : 'text-gray-600'}`} style={{ letterSpacing: '0.03em' }}>
          {message.timestamp.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  )
}
