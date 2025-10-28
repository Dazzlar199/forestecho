'use client'

import { useState } from 'react'
import {
  ChevronDown,
  Check,
  Heart,
  Brain,
  Target,
  Search,
  Flower2
} from 'lucide-react'
import { useLanguage } from '../layout/LanguageProvider'
import { useTheme } from '../layout/ThemeProvider'
import { getAllCounselingModes, type CounselingMode } from '@/lib/openai/counseling-modes'

// Icon mapping
const iconMap: Record<string, any> = {
  Heart,
  Brain,
  Target,
  Search,
  Flower2,
}

interface ModeSelectorProps {
  selectedMode: CounselingMode
  onModeChange: (mode: CounselingMode) => void
}

export default function ModeSelector({ selectedMode, onModeChange }: ModeSelectorProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const modes = getAllCounselingModes(language as 'ko' | 'en' | 'ja' | 'zh')
  const currentMode = modes.find(m => m.id === selectedMode)

  const CurrentIcon = currentMode ? iconMap[currentMode.iconName] : Heart

  return (
    <div className="relative mb-6">
      {/* Selected Mode Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 rounded-lg border backdrop-blur-md transition-all ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10 hover:bg-white/10'
            : 'bg-white/50 border-gray-700/20 hover:bg-white/70'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${currentMode?.color}15` }}>
            <CurrentIcon className="w-5 h-5" style={{ color: currentMode?.color }} />
          </div>
          <div className="text-left">
            <div className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              {currentMode?.name}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
              {currentMode?.description}
            </div>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''} ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Mode List */}
          <div
            className={`absolute top-full left-0 right-0 mt-2 rounded-lg border backdrop-blur-xl shadow-2xl overflow-hidden z-50 ${
              theme === 'dark'
                ? 'bg-black/95 border-white/10'
                : 'bg-white/98 border-gray-700/20'
            }`}
          >
            {modes.map((mode) => {
              const ModeIcon = iconMap[mode.iconName] || Heart
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    onModeChange(mode.id as CounselingMode)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-start gap-4 p-4 transition-all ${
                    theme === 'dark'
                      ? 'hover:bg-white/10'
                      : 'hover:bg-gray-100/50'
                  } ${
                    mode.id === selectedMode
                      ? theme === 'dark'
                        ? 'bg-white/5'
                        : 'bg-gray-100/30'
                      : ''
                  }`}
                  style={{
                    borderLeft: mode.id === selectedMode ? `3px solid ${mode.color}` : '3px solid transparent',
                  }}
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${mode.color}15` }}>
                    <ModeIcon className="w-5 h-5" style={{ color: mode.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left">
                    <div className={`font-medium mb-1 flex items-center gap-2 ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {mode.name}
                      {mode.id === selectedMode && (
                        <Check className="w-4 h-4" style={{ color: mode.color }} />
                      )}
                    </div>
                    <div className={`text-xs leading-relaxed ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {mode.description}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
