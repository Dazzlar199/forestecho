'use client'

import { User, Bot } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
        {isUser ? (
          <User className="w-4 h-4 text-gray-500" />
        ) : (
          <Bot className="w-4 h-4 text-gray-500" />
        )}
      </div>

      <div className={`chat-message ${isUser ? 'user' : 'assistant'}`}>
        <div className="whitespace-pre-wrap break-words" style={{ letterSpacing: '0.01em' }}>
          {message.content}
        </div>
        <div className={`text-xs mt-4 ${isUser ? 'text-gray-600' : 'text-gray-600'}`} style={{ letterSpacing: '0.03em' }}>
          {message.timestamp.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  )
}
