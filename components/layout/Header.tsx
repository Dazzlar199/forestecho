'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon, Languages, Heart, Home, Brain, Calendar, Users, BookOpen, LogOut, User as UserIcon, TreePine, Edit2, HelpCircle, MessageSquare, Menu, X } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { useTheme } from './ThemeProvider'
import { useLanguage, type Language } from './LanguageProvider'
import AuthModal from '@/components/auth/AuthModal'
import NicknameModal from '@/components/profile/NicknameModal'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'

export default function Header() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const pathname = usePathname()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNicknameModal, setShowNicknameModal] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const languages = [
    { code: 'ko' as Language, label: '한국어', flag: '🇰🇷' },
    { code: 'en' as Language, label: 'English', flag: '🇺🇸' },
    { code: 'ja' as Language, label: '日本語', flag: '🇯🇵' },
    { code: 'zh' as Language, label: '中文', flag: '🇨🇳' },
  ]

  const currentLang = languages.find((l) => l.code === language)

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const menuItems = [
    { href: '/myforest', icon: TreePine, label: { ko: '나의 숲', en: 'My Forest', ja: 'マイフォレスト', zh: '我的森林' } },
    { href: '/emotion', icon: Heart, label: { ko: '감정 기록', en: 'Emotion', ja: '感情記録', zh: '情绪追踪' } },
    { href: '/checkin', icon: Calendar, label: { ko: '일일 체크인', en: 'Check-in', ja: 'チェックイン', zh: '签到' } },
    { href: '/assessment', icon: Brain, label: { ko: '자가진단', en: 'Assessment', ja: 'セルフチェック', zh: '自我评估' } },
    { href: '/community', icon: Users, label: { ko: '커뮤니티', en: 'Community', ja: 'コミュニティ', zh: '社区' } },
    { href: '/education', icon: BookOpen, label: { ko: '심리 교육', en: 'Education', ja: '心理教育', zh: '心理教育' } },
    { href: '/faq', icon: HelpCircle, label: { ko: 'FAQ', en: 'FAQ', ja: 'FAQ', zh: '常见问题' } },
    { href: '/support', icon: MessageSquare, label: { ko: '고객 지원', en: 'Support', ja: 'サポート', zh: '客户支持' } },
  ]

  return (
    <>
      {/* 데스크톱 헤더 (md 이상) */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 px-8 py-6">
        <div className="flex items-center justify-between">
          {/* 왼쪽: 테마 토글 */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-3 text-sm transition-colors px-4 py-2 ${
              theme === 'dark'
                ? 'text-gray-500 hover:text-gray-300'
                : 'text-gray-700 hover:text-gray-900'
            }`}
            style={{ fontWeight: 300, letterSpacing: '0.1em' }}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-5 h-5" />
                <span>{t('lightMode')}</span>
              </>
            ) : (
              <>
                <Moon className="w-5 h-5" />
                <span>{t('darkMode')}</span>
              </>
            )}
          </button>

          {/* 중앙: 빈 공간 */}
          <div></div>

          {/* 오른쪽: 홈/언어/로그인/개인정보 */}
          <div className="flex items-center gap-6">
            {/* 홈 버튼 */}
            <Link
              href="/"
              className={`flex items-center gap-2 text-sm transition-colors px-4 py-2 ${
                theme === 'dark'
                  ? 'text-gray-500 hover:text-gray-300'
                  : 'text-gray-700 hover:text-gray-900'
              } ${mounted && pathname === '/' ? 'font-medium' : ''}`}
              style={{ fontWeight: mounted && pathname === '/' ? 400 : 300, letterSpacing: '0.1em' }}
            >
              <Home className="w-4 h-4" />
              <span>
                {language === 'ko' && '홈'}
                {language === 'en' && 'Home'}
                {language === 'ja' && 'ホーム'}
                {language === 'zh' && '首页'}
              </span>
            </Link>

            {/* 언어 선택 */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className={`flex items-center gap-2 text-sm transition-colors px-4 py-2 ${
                  theme === 'dark'
                    ? 'text-gray-500 hover:text-gray-300'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                style={{ fontWeight: 300, letterSpacing: '0.1em' }}
              >
                <Languages className="w-4 h-4" />
                <span>{currentLang?.flag}</span>
              </button>
              {showLangMenu && (
                <div className={`absolute top-full right-0 mt-2 backdrop-blur-xl border rounded-lg shadow-lg overflow-hidden ${
                  theme === 'dark'
                    ? 'bg-black/90 border-white/10'
                    : 'bg-white/95 border-gray-700/20'
                }`}>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code)
                        setShowLangMenu(false)
                      }}
                      className={`w-full px-6 py-3 text-left text-sm transition-colors flex items-center gap-3 ${
                        theme === 'dark'
                          ? 'hover:bg-white/10 text-gray-300'
                          : 'hover:bg-gray-100/50 text-gray-700'
                      } ${mounted && language === lang.code ? 'font-semibold' : ''}`}
                      style={{ fontWeight: mounted && language === lang.code ? 400 : 300, letterSpacing: '0.05em' }}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                  style={{ fontWeight: 300, letterSpacing: '0.05em' }}
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="text-sm">
                    {user.displayName || user.email}
                  </span>
                </button>
                {showProfileMenu && (
                  <div className={`absolute top-full right-0 mt-2 backdrop-blur-xl border rounded-lg shadow-lg overflow-hidden min-w-[220px] ${
                    theme === 'dark'
                      ? 'bg-black/90 border-white/10'
                      : 'bg-white/95 border-gray-700/20'
                  }`}>
                    {/* 프로필 정보 */}
                    <div className={`px-4 py-3 border-b ${
                      theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                    }`}>
                      <p className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        {user.displayName || 'User'}
                      </p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        {user.email}
                      </p>
                    </div>

                    {/* 닉네임 변경 */}
                    <button
                      onClick={() => {
                        setShowNicknameModal(true)
                        setShowProfileMenu(false)
                      }}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 ${
                        theme === 'dark'
                          ? 'hover:bg-white/10 text-gray-300'
                          : 'hover:bg-gray-100/50 text-gray-700'
                      }`}
                      style={{ fontWeight: 300, letterSpacing: '0.05em' }}
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>
                        {language === 'ko' && '닉네임 변경'}
                        {language === 'en' && 'Change Nickname'}
                        {language === 'ja' && 'ニックネーム変更'}
                        {language === 'zh' && '更改昵称'}
                      </span>
                    </button>

                    {/* 구분선 */}
                    <div className={`border-t ${
                      theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                    }`}></div>

                    {/* 나의 숲 */}
                    <Link
                      href="/myforest"
                      onClick={() => setShowProfileMenu(false)}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 ${
                        theme === 'dark'
                          ? 'hover:bg-white/10 text-gray-300'
                          : 'hover:bg-gray-100/50 text-gray-700'
                      }`}
                      style={{ fontWeight: 300, letterSpacing: '0.05em' }}
                    >
                      <TreePine className="w-4 h-4" />
                      <span>
                        {language === 'ko' && '나의 숲'}
                        {language === 'en' && 'My Forest'}
                        {language === 'ja' && 'マイフォレスト'}
                        {language === 'zh' && '我的森林'}
                      </span>
                    </Link>

                    {/* 감정 기록 */}
                    <Link
                      href="/emotion"
                      onClick={() => setShowProfileMenu(false)}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 ${
                        theme === 'dark'
                          ? 'hover:bg-white/10 text-gray-300'
                          : 'hover:bg-gray-100/50 text-gray-700'
                      }`}
                      style={{ fontWeight: 300, letterSpacing: '0.05em' }}
                    >
                      <Heart className="w-4 h-4" />
                      <span>
                        {language === 'ko' && '감정 기록'}
                        {language === 'en' && 'Emotion Tracking'}
                        {language === 'ja' && '感情記録'}
                        {language === 'zh' && '情绪追踪'}
                      </span>
                    </Link>

                    {/* 일일 체크인 */}
                    <Link
                      href="/checkin"
                      onClick={() => setShowProfileMenu(false)}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 ${
                        theme === 'dark'
                          ? 'hover:bg-white/10 text-gray-300'
                          : 'hover:bg-gray-100/50 text-gray-700'
                      }`}
                      style={{ fontWeight: 300, letterSpacing: '0.05em' }}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>
                        {language === 'ko' && '일일 체크인'}
                        {language === 'en' && 'Daily Check-in'}
                        {language === 'ja' && '毎日のチェックイン'}
                        {language === 'zh' && '每日签到'}
                      </span>
                    </Link>

                    {/* 자가진단 */}
                    <Link
                      href="/assessment"
                      onClick={() => setShowProfileMenu(false)}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 ${
                        theme === 'dark'
                          ? 'hover:bg-white/10 text-gray-300'
                          : 'hover:bg-gray-100/50 text-gray-700'
                      }`}
                      style={{ fontWeight: 300, letterSpacing: '0.05em' }}
                    >
                      <Brain className="w-4 h-4" />
                      <span>
                        {language === 'ko' && '자가진단'}
                        {language === 'en' && 'Self-Assessment'}
                        {language === 'ja' && 'セルフチェック'}
                        {language === 'zh' && '自我评估'}
                      </span>
                    </Link>

                    {/* 커뮤니티 */}
                    <Link
                      href="/community"
                      onClick={() => setShowProfileMenu(false)}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 ${
                        theme === 'dark'
                          ? 'hover:bg-white/10 text-gray-300'
                          : 'hover:bg-gray-100/50 text-gray-700'
                      }`}
                      style={{ fontWeight: 300, letterSpacing: '0.05em' }}
                    >
                      <Users className="w-4 h-4" />
                      <span>
                        {language === 'ko' && '커뮤니티'}
                        {language === 'en' && 'Community'}
                        {language === 'ja' && 'コミュニティ'}
                        {language === 'zh' && '社区'}
                      </span>
                    </Link>

                    {/* 교육 */}
                    <Link
                      href="/education"
                      onClick={() => setShowProfileMenu(false)}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 ${
                        theme === 'dark'
                          ? 'hover:bg-white/10 text-gray-300'
                          : 'hover:bg-gray-100/50 text-gray-700'
                      }`}
                      style={{ fontWeight: 300, letterSpacing: '0.05em' }}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>
                        {language === 'ko' && '심리 교육'}
                        {language === 'en' && 'Education'}
                        {language === 'ja' && '心理教育'}
                        {language === 'zh' && '心理教育'}
                      </span>
                    </Link>

                    {/* 구분선 */}
                    <div className={`border-t ${
                      theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                    }`}></div>

                    {/* FAQ */}
                    <Link
                      href="/faq"
                      onClick={() => setShowProfileMenu(false)}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 ${
                        theme === 'dark'
                          ? 'hover:bg-white/10 text-gray-300'
                          : 'hover:bg-gray-100/50 text-gray-700'
                      }`}
                      style={{ fontWeight: 300, letterSpacing: '0.05em' }}
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>
                        {language === 'ko' && 'FAQ'}
                        {language === 'en' && 'FAQ'}
                        {language === 'ja' && 'FAQ'}
                        {language === 'zh' && '常见问题'}
                      </span>
                    </Link>

                    {/* 고객 지원 */}
                    <Link
                      href="/support"
                      onClick={() => setShowProfileMenu(false)}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 ${
                        theme === 'dark'
                          ? 'hover:bg-white/10 text-gray-300'
                          : 'hover:bg-gray-100/50 text-gray-700'
                      }`}
                      style={{ fontWeight: 300, letterSpacing: '0.05em' }}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>
                        {language === 'ko' && '고객 지원'}
                        {language === 'en' && 'Support'}
                        {language === 'ja' && 'サポート'}
                        {language === 'zh' && '客户支持'}
                      </span>
                    </Link>

                    {/* 구분선 */}
                    <div className={`border-t ${
                      theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                    }`}></div>

                    {/* 로그아웃 */}
                    <button
                      onClick={() => {
                        handleLogout()
                        setShowProfileMenu(false)
                      }}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 ${
                        theme === 'dark'
                          ? 'hover:bg-red-500/20 text-red-400'
                          : 'hover:bg-red-50 text-red-600'
                      }`}
                      style={{ fontWeight: 300, letterSpacing: '0.05em' }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>
                        {language === 'ko' && '로그아웃'}
                        {language === 'en' && 'Logout'}
                        {language === 'ja' && 'ログアウト'}
                        {language === 'zh' && '登出'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className={`text-sm transition-colors px-4 py-2 ${
                  theme === 'dark'
                    ? 'text-gray-500 hover:text-gray-300'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                style={{ fontWeight: 300, letterSpacing: '0.1em' }}
              >
                {t('login')}
              </button>
            )}
            <button
              onClick={() => setShowPrivacy(true)}
              className={`text-sm transition-colors px-4 py-2 ${
                theme === 'dark'
                  ? 'text-gray-500 hover:text-gray-300'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
              style={{ fontWeight: 300, letterSpacing: '0.1em' }}
            >
              {t('privacy')}
            </button>
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <NicknameModal isOpen={showNicknameModal} onClose={() => setShowNicknameModal(false)} />

      {showPrivacy && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ${
          theme === 'dark' ? 'bg-black/80' : 'bg-black/60'
        }`} onClick={() => setShowPrivacy(false)}>
          <div className={`backdrop-blur-xl border p-10 max-w-2xl max-h-[80vh] overflow-y-auto ${
            theme === 'dark'
              ? 'bg-black/90 border-white/10'
              : 'bg-white/95 border-gray-700/20'
          }`} onClick={(e) => e.stopPropagation()}>
            <h2 className={`text-2xl mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`} style={{ fontWeight: 300, letterSpacing: '0.1em' }}>{t('privacyTitle')}</h2>
            <div className={`text-sm space-y-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`} style={{ fontWeight: 300, lineHeight: 1.8 }}>
              <p>{t('privacyIntro')}</p>
              <h3 className={`text-base mt-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{t('privacySection1')}</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{t('privacySection1Content')}</p>
              <h3 className={`text-base mt-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{t('privacySection2')}</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{t('privacySection2Content')}</p>
              <h3 className={`text-base mt-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{t('privacySection3')}</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{t('privacySection3Content')}</p>
            </div>
            <button
              onClick={() => setShowPrivacy(false)}
              className={`mt-8 px-6 py-3 border transition-all ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                  : 'bg-gray-200/50 border-gray-700/30 text-gray-800 hover:bg-gray-200/70'
              }`}
              style={{ fontWeight: 300, letterSpacing: '0.08em' }}
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}

      {/* 모바일 헤더 (md 이하) */}
      <header className={`md:hidden fixed top-0 left-0 right-0 z-50 ${
        theme === 'dark' ? 'bg-black/90' : 'bg-white/90'
      } backdrop-blur-lg border-b ${
        theme === 'dark' ? 'border-white/10' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between px-4 py-3">
          {/* 햄버거 메뉴 */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className={`p-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* 로고 */}
          <Link href="/" className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            숲울림
          </Link>

          {/* 테마 토글 */}
          <button
            onClick={toggleTheme}
            className={`p-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {showMobileMenu && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowMobileMenu(false)}
              style={{ top: '57px' }}
            />
            <div
              className={`fixed left-0 right-0 z-50 ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-white'
              } border-b ${
                theme === 'dark' ? 'border-white/10' : 'border-gray-200'
              } max-h-[calc(100vh-57px)] overflow-y-auto`}
              style={{ top: '57px' }}
            >
              <div className="p-4 space-y-2">
                {user ? (
                  <>
                    {/* 사용자 정보 */}
                    <div className={`p-4 rounded-xl mb-4 ${
                      theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <div className={`font-medium mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {user.displayName || '사용자'}
                      </div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user.email}
                      </div>
                    </div>

                    {/* 홈 */}
                    <Link
                      href="/"
                      onClick={() => setShowMobileMenu(false)}
                      className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
                        mounted && pathname === '/'
                          ? theme === 'dark'
                            ? 'bg-emerald-900/30 text-emerald-400'
                            : 'bg-emerald-50 text-emerald-600'
                          : theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-800'
                            : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Home className="w-5 h-5" />
                      <span>{language === 'ko' ? '홈' : language === 'en' ? 'Home' : language === 'ja' ? 'ホーム' : '首页'}</span>
                    </Link>

                    {/* 메뉴 아이템 */}
                    {menuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setShowMobileMenu(false)}
                        className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
                          mounted && pathname === item.href
                            ? theme === 'dark'
                              ? 'bg-emerald-900/30 text-emerald-400'
                              : 'bg-emerald-50 text-emerald-600'
                            : theme === 'dark'
                              ? 'text-gray-300 hover:bg-gray-800'
                              : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label[language as keyof typeof item.label]}</span>
                      </Link>
                    ))}

                    {/* 닉네임 변경 */}
                    <button
                      onClick={() => {
                        setShowMobileMenu(false)
                        setShowNicknameModal(true)
                      }}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl transition-colors ${
                        theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Edit2 className="w-5 h-5" />
                      <span>
                        {language === 'ko' ? '닉네임 변경' : language === 'en' ? 'Change Nickname' : language === 'ja' ? 'ニックネーム変更' : '更改昵称'}
                      </span>
                    </button>

                    {/* 로그아웃 */}
                    <button
                      onClick={() => {
                        handleLogout()
                        setShowMobileMenu(false)
                      }}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl transition-colors mt-2 ${
                        theme === 'dark'
                          ? 'text-red-400 hover:bg-red-900/20'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <LogOut className="w-5 h-5" />
                      <span>
                        {language === 'ko' ? '로그아웃' : language === 'en' ? 'Logout' : language === 'ja' ? 'ログアウト' : '登出'}
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* 로그인 안 한 경우 */}
                    <Link
                      href="/"
                      onClick={() => setShowMobileMenu(false)}
                      className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
                        mounted && pathname === '/'
                          ? theme === 'dark'
                            ? 'bg-emerald-900/30 text-emerald-400'
                            : 'bg-emerald-50 text-emerald-600'
                          : theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-800'
                            : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Home className="w-5 h-5" />
                      <span>{language === 'ko' ? '홈' : language === 'en' ? 'Home' : language === 'ja' ? 'ホーム' : '首页'}</span>
                    </Link>

                    <Link
                      href="/faq"
                      onClick={() => setShowMobileMenu(false)}
                      className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
                        mounted && pathname === '/faq'
                          ? theme === 'dark'
                            ? 'bg-emerald-900/30 text-emerald-400'
                            : 'bg-emerald-50 text-emerald-600'
                          : theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-800'
                            : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <HelpCircle className="w-5 h-5" />
                      <span>{language === 'ko' ? 'FAQ' : language === 'en' ? 'FAQ' : language === 'ja' ? 'FAQ' : '常见问题'}</span>
                    </Link>

                    <button
                      onClick={() => {
                        setShowMobileMenu(false)
                        setShowAuthModal(true)
                      }}
                      className={`w-full flex items-center justify-center gap-2 p-4 rounded-xl transition-colors mt-4 ${
                        theme === 'dark'
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      }`}
                    >
                      <span>
                        {language === 'ko' ? '로그인' : language === 'en' ? 'Login' : language === 'ja' ? 'ログイン' : '登录'}
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </header>
    </>
  )
}
