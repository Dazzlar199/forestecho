/**
 * 접근성이 개선된 모달 래퍼 컴포넌트
 */

'use client'

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useFocusTrap, useEscapeKey, useScrollLock, useFocusRestore } from '@/lib/hooks/useAccessibility'

interface AccessibleModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
}

export default function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  showCloseButton = true,
}: AccessibleModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // 접근성 훅 적용
  useFocusTrap(isOpen, modalRef)
  useEscapeKey(isOpen, onClose)
  useScrollLock(isOpen)
  useFocusRestore(isOpen)

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
          role="presentation"
        >
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* 모달 컨텐츠 */}
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className={`relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-lg w-full ${className}`}
          >
            {/* 스크린 리더용 타이틀 (화면에는 숨김) */}
            <h2 id="modal-title" className="sr-only">
              {title}
            </h2>

            {/* 닫기 버튼 */}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="모달 닫기"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            )}

            {/* 컨텐츠 */}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
