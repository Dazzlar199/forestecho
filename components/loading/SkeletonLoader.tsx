'use client'

import { motion } from 'framer-motion'
import { useTheme } from '../layout/ThemeProvider'

interface SkeletonLoaderProps {
  variant?: 'text' | 'title' | 'avatar' | 'card' | 'button'
  width?: string
  height?: string
  className?: string
  count?: number
}

export default function SkeletonLoader({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1,
}: SkeletonLoaderProps) {
  const { theme } = useTheme()

  const getVariantStyles = () => {
    switch (variant) {
      case 'title':
        return 'h-8 w-3/4 rounded-lg'
      case 'avatar':
        return 'h-12 w-12 rounded-full'
      case 'card':
        return 'h-32 w-full rounded-xl'
      case 'button':
        return 'h-10 w-32 rounded-lg'
      case 'text':
      default:
        return 'h-4 w-full rounded'
    }
  }

  const baseStyles = getVariantStyles()
  const customStyles = width || height ? { width, height } : {}

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={`relative overflow-hidden ${baseStyles} ${className} ${
            theme === 'dark' ? 'bg-white/5' : 'bg-gray-200'
          }`}
          style={customStyles}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          {/* Shimmer effect */}
          <motion.div
            className={`absolute inset-0 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent'
                : 'bg-gradient-to-r from-transparent via-white to-transparent'
            }`}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      ))}
    </>
  )
}

/**
 * 채팅 메시지 스켈레톤
 */
export function ChatMessageSkeleton() {
  return (
    <div className="space-y-3 mb-6">
      <SkeletonLoader variant="avatar" />
      <SkeletonLoader variant="text" count={3} className="mb-2" />
      <SkeletonLoader variant="text" width="80%" />
    </div>
  )
}

/**
 * 카드 스켈레톤
 */
export function CardSkeleton() {
  const { theme } = useTheme()

  return (
    <div
      className={`p-6 rounded-xl border ${
        theme === 'dark'
          ? 'bg-white/5 border-white/10'
          : 'bg-white border-gray-200'
      }`}
    >
      <SkeletonLoader variant="title" className="mb-4" />
      <SkeletonLoader variant="text" count={3} className="mb-2" />
      <SkeletonLoader variant="button" className="mt-4" />
    </div>
  )
}
