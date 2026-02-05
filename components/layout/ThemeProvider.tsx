'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  canToggleTheme: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTheme('dark')
  }, [])

  useEffect(() => {
    if (!mounted) return

    document.body.classList.remove('light-mode', 'dark-mode')
    document.body.classList.add(`${theme}-mode`)
  }, [theme, mounted])

  const toggleTheme = () => {
    // 테마 변경 불가 (항상 다크모드)
    return
  }

  return (
    <ThemeContext.Provider value={{
      theme: 'dark',
      toggleTheme,
      canToggleTheme: false
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
