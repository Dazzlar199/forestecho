'use client'

import { useTheme } from './ThemeProvider'
import { useLanguage } from './LanguageProvider'
import { useAuth } from './AuthProvider'
import Link from 'next/link'
import { Heart, Brain, Calendar, Users, BookOpen, TreePine } from 'lucide-react'
import SocialProof from '../trust/SocialProof'

interface WelcomeScreenProps {
  onStartChat: () => void
}

export default function WelcomeScreen({ onStartChat }: WelcomeScreenProps) {
  const { theme } = useTheme()
  const { language, t } = useLanguage()
  const { user } = useAuth()

  const handleStartChat = () => {
    // 새로운 대화 시작 시 이전 세션 정보 제거
    localStorage.removeItem('currentChatSessionId')
    onStartChat()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-32">
      <div className="max-w-4xl mx-auto">
        {/* Main Content */}
        <div className="text-center space-y-16">
          {/* Logo Title */}
          <div className="mb-12 space-y-6">
            <h1 className={`forest-title text-7xl md:text-8xl ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
              style={{ fontWeight: 300, lineHeight: 1.2, letterSpacing: '0.15em' }}>
              {t('siteName')}
            </h1>
            <p className={`text-lg md:text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}
              style={{ fontWeight: 300, lineHeight: 1.8, letterSpacing: '0.08em' }}>
              {t('subtitle')}
            </p>
          </div>

          <div className="space-y-10">
            <p
              className={`text-base ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'} max-w-xl mx-auto`}
              style={{ fontWeight: 300, lineHeight: 2, letterSpacing: '0.03em' }}
            >
              {t('description1')}
              <br />
              {t('description2')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 flex-wrap justify-center">
            <button
              onClick={handleStartChat}
              className="group inline-block"
            >
              <div
                className={`px-12 py-5 backdrop-blur-md border transition-all duration-500 ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/20 text-gray-200 hover:bg-white/10 hover:border-white/30'
                    : 'bg-white/40 border-gray-700/30 text-gray-800 hover:bg-white/60 hover:border-gray-700/50'
                }`}
                style={{ fontWeight: 300, letterSpacing: '0.1em' }}
              >
                {t('startChat')}
              </div>
            </button>

            {user && (
              <Link href="/myforest" className="group inline-block">
                <div
                  className={`px-12 py-5 backdrop-blur-md border transition-all duration-500 flex items-center gap-3 ${
                    theme === 'dark'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50'
                      : 'bg-emerald-100/60 border-emerald-600/40 text-emerald-700 hover:bg-emerald-100/80 hover:border-emerald-600/60'
                  }`}
                  style={{ fontWeight: 300, letterSpacing: '0.1em' }}
                >
                  <TreePine className="w-5 h-5" />
                  <span>
                    {language === 'ko' && '나의 숲'}
                    {language === 'en' && 'My Forest'}
                    {language === 'ja' && 'マイフォレスト'}
                    {language === 'zh' && '我的森林'}
                  </span>
                </div>
              </Link>
            )}

            <Link href="/community" className="group inline-block">
              <div
                className={`px-12 py-5 backdrop-blur-md border transition-all duration-500 flex items-center gap-3 ${
                  theme === 'dark'
                    ? 'bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20 hover:border-orange-500/50'
                    : 'bg-orange-100/60 border-orange-600/40 text-orange-700 hover:bg-orange-100/80 hover:border-orange-600/60'
                }`}
                style={{ fontWeight: 300, letterSpacing: '0.1em' }}
              >
                <Users className="w-5 h-5" />
                <span>
                  {language === 'ko' && '커뮤니티'}
                  {language === 'en' && 'Community'}
                  {language === 'ja' && 'コミュニティ'}
                  {language === 'zh' && '社区'}
                </span>
              </div>
            </Link>

            <Link href="/education" className="group inline-block">
              <div
                className={`px-12 py-5 backdrop-blur-md border transition-all duration-500 flex items-center gap-3 ${
                  theme === 'dark'
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/50'
                    : 'bg-cyan-100/60 border-cyan-600/40 text-cyan-700 hover:bg-cyan-100/80 hover:border-cyan-600/60'
                }`}
                style={{ fontWeight: 300, letterSpacing: '0.1em' }}
              >
                <BookOpen className="w-5 h-5" />
                <span>
                  {language === 'ko' && '심리 교육'}
                  {language === 'en' && 'Education'}
                  {language === 'ja' && '心理教育'}
                  {language === 'zh' && '心理教育'}
                </span>
              </div>
            </Link>
          </div>

          {/* Info Section */}
          <div className="pt-20 max-w-md mx-auto">
            <div className="space-y-6 text-center">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontWeight: 300, letterSpacing: '0.08em' }}>
                {t('feature1')}
              </p>
              <div className={`border-t ${theme === 'dark' ? 'border-white/20' : 'border-gray-700/30'}`}></div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontWeight: 300, letterSpacing: '0.08em' }}>
                {t('feature2')}
              </p>
            </div>
          </div>
        </div>

        {/* 사용자 후기 */}
        <SocialProof />

        {/* Bottom Notice */}
        <div className="mt-32 text-center">
          <div className={`inline-block px-8 py-6 backdrop-blur-xl border max-w-xl ${
            theme === 'dark'
              ? 'bg-black/30 border-white/10'
              : 'bg-white/50 border-gray-700/20'
          }`}>
            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`} style={{ fontWeight: 300, letterSpacing: '0.05em' }}>
              {t('notice1')}
              <br />
              {t('notice2')}
            </p>
            <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-700/20'}`}>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`} style={{ fontWeight: 300, letterSpacing: '0.05em' }}>
                {t('emergencyLine')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
