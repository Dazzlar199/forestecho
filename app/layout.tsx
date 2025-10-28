import type { Metadata } from 'next'
import { Spectral, Nanum_Myeongjo } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/layout/AuthProvider'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { LanguageProvider } from '@/components/layout/LanguageProvider'
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
  title: '숲울림 - 심리상담',
  description: '전문 심리상담 서비스. 24시간 언제든지 당신의 이야기를 들어드립니다.',
  keywords: ['심리상담', '상담', '멘탈케어', '심리치료', '정신건강', '마음치유', '숲울림'],
  authors: [{ name: '숲울림' }],
  openGraph: {
    title: '숲울림 - 심리상담',
    description: '전문 심리상담 서비스',
    type: 'website',
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
              <Header />
              {children}
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
