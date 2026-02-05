'use client'

import { useState, memo } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { useLanguage } from '../layout/LanguageProvider'
import { useTheme } from '../layout/ThemeProvider'
import { getAllCounselingModes, type CounselingMode } from '@/lib/openai/counseling-modes'
import { iconMap } from '@/lib/utils/icon-map'

interface ModeSelectorProps {
  selectedMode: CounselingMode
  onModeChange: (mode: CounselingMode) => void
}

function ModeSelector({ selectedMode, onModeChange }: ModeSelectorProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const modes = getAllCounselingModes(language as 'ko' | 'en' | 'ja' | 'zh')
  const currentMode = modes.find(m => m.id === selectedMode)

  const CurrentIcon = currentMode ? iconMap[currentMode.iconName] : iconMap['Heart']

  return (
    <div className="relative mb-4 sm:mb-6">
      {/* Selected Mode Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-lg border backdrop-blur-md transition-all ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10 hover:bg-white/10'
            : 'bg-white/50 border-gray-700/20 hover:bg-white/70'
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${currentMode?.color}15` }}>
            <CurrentIcon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: currentMode?.color }} />
          </div>
          <div className="text-left min-w-0 flex-1">
            <div className={`font-medium text-sm sm:text-base truncate ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              {currentMode?.name}
            </div>
            <div className={`text-xs hidden sm:block ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
              {currentMode?.description}
            </div>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''} ${
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
              const ModeIcon = iconMap[mode.iconName] || iconMap['Heart']
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    onModeChange(mode.id as CounselingMode)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-start gap-3 sm:gap-4 p-3 sm:p-4 transition-all ${
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
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${mode.color}15` }}>
                    <ModeIcon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: mode.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left min-w-0">
                    <div className={`font-medium mb-1 flex items-center gap-2 text-sm sm:text-base ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {mode.name}
                      {mode.id === selectedMode && (
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: mode.color }} />
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
export default memo(ModeSelector)
