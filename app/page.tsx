'use client'

import { useState } from 'react'
import ChatInterface from '@/components/chat/ChatInterface'
import WelcomeScreen from '@/components/layout/WelcomeScreen'
import BGMPlayer from '@/components/audio/BGMPlayer'
import ForestBackground from '@/components/layout/ForestBackground'
import OnboardingTour from '@/components/onboarding/OnboardingTour'

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
