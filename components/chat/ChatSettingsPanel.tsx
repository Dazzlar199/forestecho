'use client'

import { useState } from 'react'
import { Settings, X, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../layout/ThemeProvider'
import { useLanguage } from '../layout/LanguageProvider'
import ModeSelector from '../counseling/ModeSelector'
import ToneSlider from '../counseling/ToneSlider'
import type { CounselingMode } from '@/lib/openai/counseling-modes'

interface ChatSettingsPanelProps {
  counselingMode: CounselingMode
  onModeChange: (mode: CounselingMode) => void
  responseTone: number
  onToneChange: (tone: number) => void
}

export default function ChatSettingsPanel({
  counselingMode,
  onModeChange,
  responseTone,
  onToneChange,
}: ChatSettingsPanelProps) {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const getText = () => {
    if (language === 'ko') return '설정'
    if (language === 'en') return 'Settings'
    if (language === 'ja') return '設定'
    return '设置'
  }

  const getAdvancedText = () => {
    if (language === 'ko') return '고급 설정'
    if (language === 'en') return 'Advanced Settings'
    if (language === 'ja') return '詳細設定'
    return '高级设置'
  }

  const getDescriptionText = () => {
    if (language === 'ko') return '대화 스타일과 상담 모드를 조정하세요'
    if (language === 'en') return 'Adjust conversation style and counseling mode'
    if (language === 'ja') return '会話スタイルとカウンセリングモードを調整'
    return '调整对话风格和咨询模式'
  }

  return (
    <>
      {/* Settings Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl border-2 transition-all ${
          theme === 'dark'
            ? isOpen
              ? 'bg-gradient-to-r from-white/15 to-white/10 border-white/30 text-white shadow-lg'
              : 'bg-white/8 border-white/15 text-gray-300 hover:text-gray-100 hover:bg-white/12 hover:border-white/25'
            : isOpen
              ? 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300 text-gray-900 shadow-md'
              : 'bg-white/70 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-white/90 hover:border-gray-300'
        }`}
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.98 }}
        aria-label={getText()}
      >
        <Settings className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">{getText()}</span>
        {isOpen && <X className="w-4 h-4" />}
      </motion.button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`fixed z-50 inset-x-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-2xl rounded-xl shadow-2xl border backdrop-blur-xl overflow-hidden ${
                theme === 'dark'
                  ? 'bg-gray-900/95 border-white/10'
                  : 'bg-white/95 border-gray-200'
              }`}
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            >
              {/* Header */}
              <div
                className={`px-6 py-4 border-b ${
                  theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-100'
                      }`}
                    >
                      <Sparkles
                        className={`w-5 h-5 ${
                          theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                        }`}
                      />
                    </div>
                    <div>
                      <h3
                        className={`text-lg font-medium ${
                          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}
                      >
                        {getAdvancedText()}
                      </h3>
                      <p
                        className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {getDescriptionText()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-white/10 text-gray-400 hover:text-gray-200'
                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                    }`}
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Mode Selector */}
                <div>
                  <ModeSelector
                    selectedMode={counselingMode}
                    onModeChange={onModeChange}
                  />
                </div>

                {/* Tone Slider */}
                <div>
                  <ToneSlider value={responseTone} onChange={onToneChange} />
                </div>
              </div>

              {/* Footer */}
              <div
                className={`px-6 py-4 border-t ${
                  theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className={`w-full px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {language === 'ko' ? '완료' : language === 'en' ? 'Done' : language === 'ja' ? '完了' : '完成'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
