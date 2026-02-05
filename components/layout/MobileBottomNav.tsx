'use client'

import { Home, Heart, TreePine, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { theme } = useTheme()

  const navItems = [
    {
      href: '/',
      icon: Home,
      label: 'Home',
      labelKo: '홈',
    },
    {
      href: '/emotion',
      icon: Heart,
      label: 'Emotion',
      labelKo: '감정',
    },
    {
      href: '/myforest',
      icon: TreePine,
      label: 'My Forest',
      labelKo: '나의 숲',
    },
    {
      href: '/profile',
      icon: User,
      label: 'Profile',
      labelKo: '프로필',
    },
  ]

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 ${
        theme === 'dark' ? 'bg-black/95' : 'bg-white/95'
      } backdrop-blur-lg border-t ${
        theme === 'dark' ? 'border-white/10' : 'border-gray-200'
      }`}
      style={{
        paddingBottom: 'max(0.5rem, var(--safe-area-inset-bottom))',
        paddingLeft: 'var(--safe-area-inset-left)',
        paddingRight: 'var(--safe-area-inset-right)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all min-w-[44px] min-h-[44px] justify-center ${
                isActive
                  ? theme === 'dark'
                    ? 'text-emerald-400 bg-emerald-900/30'
                    : 'text-emerald-600 bg-emerald-50'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.labelKo}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
