'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ChatContextType {
  showChat: boolean
  setShowChat: (show: boolean) => void
  resetToHome: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [showChat, setShowChat] = useState(false)

  const resetToHome = () => {
    setShowChat(false)
  }

  return (
    <ChatContext.Provider value={{ showChat, setShowChat, resetToHome }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}
