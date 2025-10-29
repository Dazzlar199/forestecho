'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'
import ForestBackground from '@/components/layout/ForestBackground'

// Dynamic imports for code splitting
const ChatInterface = dynamic(() => import('@/components/chat/ChatInterface'), {
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
    </div>
  ),
})

const WelcomeScreen = dynamic(() => import('@/components/layout/WelcomeScreen'), {
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
    </div>
  ),
})

const BGMPlayer = dynamic(() => import('@/components/audio/BGMPlayer'), {
  ssr: false, // Audio API는 클라이언트 전용
})

const OnboardingTour = dynamic(() => import('@/components/onboarding/OnboardingTour'), {
  ssr: false, // localStorage 사용하므로 SSR 불필요
})

export default function Home() {
  const [showChat, setShowChat] = useState(false)

  return (
    <main className="min-h-screen relative">
      <ForestBackground />
      <BGMPlayer />
      <OnboardingTour onComplete={() => {}} />

      {!showChat ? (
        <WelcomeScreen onStartChat={() => setShowChat(true)} />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <ChatInterface />
        </div>
      )}
    </main>
  )
}
