'use client'

import { Shield, Lock, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '../layout/ThemeProvider'
import { useLanguage } from '../layout/LanguageProvider'
import { useState } from 'react'

export default function PrivacyBadge() {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const [showTooltip, setShowTooltip] = useState(false)

  const getText = () => {
    if (language === 'ko') return '100% 비공개'
    if (language === 'en') return '100% Private'
    if (language === 'ja') return '100% プライベート'
    return '100% 私密'
  }

  const getTooltip = () => {
    if (language === 'ko') return '모든 대화는 엔드투엔드 암호화되며 절대 공유되지 않습니다'
    if (language === 'en') return 'All conversations are end-to-end encrypted and never shared'
    if (language === 'ja') return 'すべての会話はエンドツーエンドで暗号化され、決して共有されません'
    return '所有对话均经过端到端加密，绝不共享'
  }

  return (
    <div className="relative">
      <motion.div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onTouchStart={() => setShowTooltip(true)}
        onTouchEnd={() => setTimeout(() => setShowTooltip(false), 2000)}
        className={`flex items-center gap-2.5 px-4 py-2 rounded-full border-2 transition-all cursor-help ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-emerald-950/50 to-emerald-900/40 border-emerald-500/40 text-emerald-300'
            : 'bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-emerald-400/60 text-emerald-700'
        }`}
        style={{
          boxShadow: theme === 'dark'
            ? '0 4px 16px rgba(16, 185, 129, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)'
            : '0 4px 16px rgba(16, 185, 129, 0.2), 0 2px 8px rgba(0, 0, 0, 0.08)'
        }}
        whileHover={{ scale: 1.05, y: -2 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Shield className="w-3.5 h-3.5" />
        <span className="text-xs font-medium whitespace-nowrap">{getText()}</span>
        <Lock className="w-3 h-3 opacity-60" />
      </motion.div>

      {/* Tooltip */}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 max-w-xs ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}
        >
          <div
            className={`px-4 py-3 rounded-lg shadow-xl border backdrop-blur-lg ${
              theme === 'dark'
                ? 'bg-gray-900/95 border-white/10'
                : 'bg-white/95 border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg ${
                  theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-100'
                }`}
              >
                <Eye className={`w-4 h-4 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <div>
                <p className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  {language === 'ko' ? '완벽한 개인정보 보호' : language === 'en' ? 'Complete Privacy' : language === 'ja' ? '完全なプライバシー保護' : '完全隐私保护'}
                </p>
                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {getTooltip()}
                </p>
              </div>
            </div>
          </div>
          {/* Arrow */}
          <div
            className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${
              theme === 'dark' ? 'bg-gray-900 border-l border-t border-white/10' : 'bg-white border-l border-t border-gray-200'
            }`}
          />
        </motion.div>
      )}
    </div>
  )
}
