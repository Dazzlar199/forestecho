import type { Metadata } from 'next'
import { Spectral, Nanum_Myeongjo } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/layout/AuthProvider'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { LanguageProvider } from '@/components/layout/LanguageProvider'
import { ChatProvider } from '@/contexts/ChatContext'
import Header from '@/components/layout/Header'

const spectral = Spectral({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
})

const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: '숲울림 - AI 심리상담 및 정신건강 케어 플랫폼',
  description: '24시간 AI 심리상담, 감정 기록, 우울증·불안장애 자가진단, 정신건강 교육 콘텐츠를 제공하는 종합 멘탈케어 플랫폼. 전문적이고 신뢰할 수 있는 심리 지원 서비스.',
  keywords: [
    '심리상담',
    'AI 상담',
    '정신건강',
    '멘탈케어',
    '우울증',
    '불안장애',
    '스트레스 관리',
    '감정 기록',
    '자가진단',
    '심리치료',
    '마음건강',
    '온라인 상담',
    '24시간 상담',
    '청소년 상담',
    '직장인 상담',
    '심리교육',
    '정신건강 정보',
    '감정 조절',
    '숲울림',
    'ForestEcho',
  ],
  authors: [{ name: '숲울림' }],
  verification: {
    // Google Search Console 인증 코드를 여기에 추가하세요
    // google: 'your-google-verification-code',
    // 네이버 서치어드바이저 인증 코드를 여기에 추가하세요
    // other: {
    //   'naver-site-verification': 'your-naver-verification-code',
    // },
  },
  openGraph: {
    title: '숲울림 - AI 심리상담 및 정신건강 케어',
    description: '24시간 AI 심리상담, 감정 기록, 우울증·불안장애 자가진단 서비스',
    type: 'website',
    url: 'https://forestecho.app',
    siteName: '숲울림',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: '숲울림 - AI 심리상담 및 정신건강 케어',
    description: '24시간 AI 심리상담, 감정 기록, 우울증·불안장애 자가진단 서비스',
  },
  alternates: {
    canonical: 'https://forestecho.app',
    languages: {
      'ko-KR': 'https://forestecho.app',
      'en-US': 'https://forestecho.app',
      'ja-JP': 'https://forestecho.app',
      'zh-CN': 'https://forestecho.app',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={`${spectral.className} ${nanumMyeongjo.className}`}>
        <div className="forest-mist"></div>
        <div className="forest-particles"></div>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <ChatProvider>
                <Header />
                {children}
              </ChatProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
