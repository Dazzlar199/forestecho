'use client'

import dynamic from 'next/dynamic'
import Script from 'next/script'
import { Loader2 } from 'lucide-react'
import ForestBackground from '@/components/layout/ForestBackground'
import { useChatContext } from '@/contexts/ChatContext'

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
  const { showChat, setShowChat } = useChatContext()

  // JSON-LD for homepage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '숲울림',
    alternateName: 'ForestEcho',
    url: 'https://forestecho.app',
    description: '24시간 AI 심리상담 및 정신건강 케어 플랫폼',
    sameAs: [
      // SNS 링크가 있다면 여기에 추가
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['Korean', 'English', 'Japanese', 'Chinese'],
    },
    areaServed: {
      '@type': 'Country',
      name: 'South Korea',
    },
    offers: {
      '@type': 'Offer',
      category: 'Mental Health Service',
      itemOffered: {
        '@type': 'Service',
        name: 'AI 심리상담 서비스',
        description: '우울증, 불안장애, 스트레스 관리를 위한 24시간 AI 상담 및 정신건강 교육',
        provider: {
          '@type': 'Organization',
          name: '숲울림',
        },
      },
    },
  }

  return (
    <>
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
    </>
  )
}
