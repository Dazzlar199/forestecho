'use client'

import { memo } from 'react'
import { User, Bot } from 'lucide-react'
import type { Message } from '@/types'

interface ChatMessageProps {
  message: Message
}

function ChatMessage({ message }: ChatMessageProps) {
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

      <div className={`chat-message ${isUser ? 'user' : 'assistant'} max-w-[90%] sm:max-w-none`}>
        <div className="whitespace-pre-wrap break-words text-base" style={{ letterSpacing: '0.01em' }}>
          {message.content}
        </div>

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

// React.memo로 최적화: 메시지 내용과 타임스탬프가 변경되지 않으면 리렌더링 방지
export default memo(ChatMessage, (prevProps, nextProps) => {
  // content와 timestamp가 같으면 리렌더링하지 않음 (true 반환)
  return (
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.timestamp.getTime() === nextProps.message.timestamp.getTime() &&
    prevProps.message.role === nextProps.message.role
  )
})
