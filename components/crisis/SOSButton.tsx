'use client'

import { useState } from 'react'
import { AlertCircle, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../layout/ThemeProvider'
import { useLanguage } from '../layout/LanguageProvider'
import { hapticWarning } from '@/lib/interactions/haptics'

interface SOSButtonProps {
  onCrisisClick: () => void
}

export default function SOSButton({ onCrisisClick }: SOSButtonProps) {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPulsing, setIsPulsing] = useState(true)

  const getText = () => {
    if (language === 'ko') return 'SOS'
    if (language === 'en') return 'SOS'
    if (language === 'ja') return 'SOS'
    return 'SOS'
  }

  const getHelpText = () => {
    if (language === 'ko') return '긴급 지원'
    if (language === 'en') return 'Emergency'
    if (language === 'ja') return '緊急支援'
    return '紧急支持'
  }

  return (
    <motion.div
      className="fixed z-50"
      style={{
        bottom: 'max(80px, calc(80px + var(--safe-area-inset-bottom)))',
        right: 'max(16px, calc(16px + var(--safe-area-inset-right)))',
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <div
        onMouseEnter={() => {
          setIsExpanded(true)
          setIsPulsing(false)
        }}
        onMouseLeave={() => {
          setIsExpanded(false)
          setIsPulsing(true)
        }}
      >
        <motion.button
          onClick={() => {
            hapticWarning()
            onCrisisClick()
          }}
          className={`relative flex items-center gap-3 rounded-full transition-all ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
              : 'bg-gradient-to-br from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white'
          }`}
          style={{
            minWidth: '64px',
            minHeight: '64px',
            padding: isExpanded ? '0 24px 0 20px' : '20px',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.35), 0 4px 16px rgba(0, 0, 0, 0.2)',
          }}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.95 }}
          aria-label={getHelpText()}
        >
          {/* Pulsing ring effect */}
          {isPulsing && (
            <motion.div
              className="absolute inset-0 rounded-full bg-red-500 opacity-75"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.75, 0, 0.75],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}

          {/* Icon */}
          <motion.div
            className="relative z-10"
            animate={{ rotate: isExpanded ? 0 : [0, -10, 10, -10, 0] }}
            transition={{
              rotate: {
                duration: 0.5,
                repeat: isPulsing ? Infinity : 0,
                repeatDelay: 3,
              },
            }}
          >
            <AlertCircle className="w-6 h-6" />
          </motion.div>

          {/* Expanded text */}
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-bold whitespace-nowrap overflow-hidden"
              >
                {getHelpText()}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none ${
                theme === 'dark'
                  ? 'bg-gray-900 text-gray-100 border border-white/10'
                  : 'bg-white text-gray-900 border border-gray-200 shadow-lg'
              }`}
            >
              {getHelpText()}
              <div
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 ${
                  theme === 'dark' ? 'bg-gray-900 border-r border-b border-white/10' : 'bg-white border-r border-b border-gray-200'
                }`}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
