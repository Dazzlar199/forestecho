'use client'

import { useState, useEffect } from 'react'
import {
  Sun,
  Moon,
  Menu,
  X,
  Home,
  Heart,
  Calendar,
  Brain,
  Users,
  BookOpen,
  TreePine,
  Edit2,
  HelpCircle,
  MessageSquare,
  LogOut,
} from 'lucide-react'
import { useAuth } from './AuthProvider'
import { useTheme } from './ThemeProvider'
import { useLanguage } from './LanguageProvider'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'

export default function MobileHeader() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { language } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 모바일 메뉴 열릴 때 스크롤 방지
  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showMenu])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setShowMenu(false)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const menuItems = user
    ? [
        { href: '/', icon: Home, label: { ko: '홈', en: 'Home', ja: 'ホーム', zh: '首页' } },
        { href: '/myforest', icon: TreePine, label: { ko: '나의 숲', en: 'My Forest', ja: 'マイフォレスト', zh: '我的森林' } },
        { href: '/emotion', icon: Heart, label: { ko: '감정 기록', en: 'Emotion', ja: '感情記録', zh: '情绪追踪' } },
        { href: '/checkin', icon: Calendar, label: { ko: '일일 체크인', en: 'Check-in', ja: 'チェックイン', zh: '签到' } },
        { href: '/assessment', icon: Brain, label: { ko: '자가진단', en: 'Assessment', ja: 'セルフチェック', zh: '自我评估' } },
        { href: '/community', icon: Users, label: { ko: '커뮤니티', en: 'Community', ja: 'コミュニティ', zh: '社区' } },
        { href: '/education', icon: BookOpen, label: { ko: '심리 교육', en: 'Education', ja: '心理教育', zh: '心理教育' } },
        { href: '/faq', icon: HelpCircle, label: { ko: 'FAQ', en: 'FAQ', ja: 'FAQ', zh: '常见问题' } },
        { href: '/support', icon: MessageSquare, label: { ko: '고객 지원', en: 'Support', ja: 'サポート', zh: '客户支持' } },
      ]
    : [
        { href: '/', icon: Home, label: { ko: '홈', en: 'Home', ja: 'ホーム', zh: '首页' } },
        { href: '/faq', icon: HelpCircle, label: { ko: 'FAQ', en: 'FAQ', ja: 'FAQ', zh: '常见问题' } },
      ]

  return (
    <>
      {/* 모바일 헤더 (sm 이하에서만 표시) */}
      <header
        className={`sm:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 ${
          theme === 'dark' ? 'bg-black/80' : 'bg-white/80'
        } backdrop-blur-lg border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}
      >
        <div className="flex items-center justify-between">
          {/* 햄버거 메뉴 */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`p-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
          >
            {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* 로고 */}
          <Link href="/" className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            숲울림
          </Link>

          {/* 테마 토글 */}
          <button onClick={toggleTheme} className={`p-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* 모바일 메뉴 */}
      {showMenu && (
        <>
          {/* 오버레이 */}
          <div
            className="sm:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowMenu(false)}
            style={{ top: '57px' }}
          />

          {/* 메뉴 패널 */}
          <div
            className={`sm:hidden fixed left-0 right-0 z-50 ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            } border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} max-h-[calc(100vh-57px)] overflow-y-auto`}
            style={{ top: '57px' }}
          >
            <div className="p-4 space-y-2">
              {/* 사용자 정보 */}
              {user && (
                <div
                  className={`p-4 rounded-xl mb-4 ${
                    theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`font-medium mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {user.displayName || '사용자'}
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</div>
                </div>
              )}

              {/* 메뉴 아이템 */}
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMenu(false)}
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

              {/* 닉네임 변경 (로그인 시) */}
              {user && (
                <button
                  onClick={() => {
                    setShowMenu(false)
                    // 닉네임 모달 열기 로직 추가 필요
                  }}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-colors ${
                    theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Edit2 className="w-5 h-5" />
                  <span>
                    {language === 'ko' && '닉네임 변경'}
                    {language === 'en' && 'Change Nickname'}
                    {language === 'ja' && 'ニックネーム変更'}
                    {language === 'zh' && '更改昵称'}
                  </span>
                </button>
              )}

              {/* 로그아웃 / 로그인 */}
              {user ? (
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-colors ${
                    theme === 'dark'
                      ? 'text-red-400 hover:bg-red-900/20'
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  <LogOut className="w-5 h-5" />
                  <span>
                    {language === 'ko' && '로그아웃'}
                    {language === 'en' && 'Logout'}
                    {language === 'ja' && 'ログアウト'}
                    {language === 'zh' && '登出'}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowMenu(false)
                    router.push('/login')
                  }}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-colors ${
                    theme === 'dark'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                >
                  <span>
                    {language === 'ko' && '로그인'}
                    {language === 'en' && 'Login'}
                    {language === 'ja' && 'ログイン'}
                    {language === 'zh' && '登录'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
