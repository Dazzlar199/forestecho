import type { Metadata, Viewport } from 'next'

export { viewport } from './viewport'
import { Spectral, Nanum_Myeongjo, Inter } from 'next/font/google'
import './globals.css'
import '../styles/design-tokens.css'
import '../styles/warmth.css'
import { AuthProvider } from '@/components/layout/AuthProvider'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { LanguageProvider } from '@/components/layout/LanguageProvider'
import { ChatProvider } from '@/contexts/ChatContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ServiceWorkerRegister from '@/components/pwa/ServiceWorkerRegister'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import { SeasonProvider } from '@/contexts/SeasonContext'
import { PersonalizationProvider } from '@/contexts/PersonalizationContext'

// Brand Font - Serif for headings and brand elements
const spectral = Spectral({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-brand',
})

const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-brand-ko',
})

// UI Font - Sans-serif for body text and interface
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-ui',
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
  manifest: '/manifest.json', // PWA manifest 파일 연결
  appleWebApp: {
    capable: true, // iOS에서 웹앱으로 실행 가능
    statusBarStyle: 'default', // iOS 상태바 스타일
    title: '숲울림', // iOS 홈 화면 이름
  },
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
        {/* PWA를 위한 iOS 아이콘 설정 */}
        <link rel="apple-touch-icon" href="/icon-192x192.svg" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152x152.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192x192.svg" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icon-192x192.svg" />
        <link rel="icon" type="image/svg+xml" href="/icon-192x192.svg" />

        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={`${spectral.variable} ${nanumMyeongjo.variable} ${inter.variable}`}>
        {/* Skip to main content for keyboard navigation */}
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <div className="forest-mist"></div>
        <div className="forest-particles"></div>
        <ServiceWorkerRegister />
        <PersonalizationProvider>
          <SeasonProvider>
            <ThemeProvider>
              <LanguageProvider>
                <AuthProvider>
                  <ChatProvider>
                    <Header />
                    <main id="main-content" tabIndex={-1}>
                      {children}
                    </main>
                    <Footer />
                    <MobileBottomNav />
                  </ChatProvider>
                </AuthProvider>
              </LanguageProvider>
            </ThemeProvider>
          </SeasonProvider>
        </PersonalizationProvider>
      </body>
    </html>
  )
}
