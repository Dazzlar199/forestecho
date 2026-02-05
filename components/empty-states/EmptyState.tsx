'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { useTheme } from '../layout/ThemeProvider'
import { useLanguage } from '../layout/LanguageProvider'

interface EmptyStateProps {
  icon: LucideIcon
  title: {
    ko: string
    en: string
    ja: string
    zh: string
  }
  description: {
    ko: string
    en: string
    ja: string
    zh: string
  }
  action?: {
    label: {
      ko: string
      en: string
      ja: string
      zh: string
    }
    onClick: () => void
  }
  examples?: {
    ko: string[]
    en: string[]
    ja: string[]
    zh: string[]
  }
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  examples,
}: EmptyStateProps) {
  const { theme } = useTheme()
  const { language } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-8 sm:p-12 text-center"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20'
            : 'bg-gradient-to-br from-emerald-100 to-teal-100 border border-emerald-300'
        }`}
      >
        <Icon
          className={`w-12 h-12 ${
            theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
          }`}
        />
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`text-2xl sm:text-3xl font-light mb-4 ${
          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
        }`}
        style={{ fontFamily: 'var(--font-brand)' }}
      >
        {title[language as keyof typeof title]}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`text-base sm:text-lg max-w-md mb-8 leading-relaxed ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}
      >
        {description[language as keyof typeof description]}
      </motion.p>

      {/* Examples */}
      {examples && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`w-full max-w-lg mb-8 p-6 rounded-xl border ${
            theme === 'dark'
              ? 'bg-white/5 border-white/10'
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          <p
            className={`text-sm font-medium mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {language === 'ko' && '예시:'}
            {language === 'en' && 'Examples:'}
            {language === 'ja' && '例:'}
            {language === 'zh' && '示例:'}
          </p>
          <div className="space-y-3">
            {examples[language as keyof typeof examples].map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`flex items-start gap-3 text-left p-3 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-white/5 hover:bg-white/10'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                    theme === 'dark' ? 'bg-emerald-400' : 'bg-emerald-500'
                  }`}
                />
                <span
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {example}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Button */}
      {action && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: examples ? 0.9 : 0.6 }}
          onClick={action.onClick}
          className={`px-8 py-3 rounded-xl font-medium transition-all ${
            theme === 'dark'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {action.label[language as keyof typeof action.label]}
        </motion.button>
      )}
    </motion.div>
  )
}
