/**
 * 접근성 관련 커스텀 훅
 */

import { useEffect, useRef, RefObject } from 'react'

/**
 * 모달 포커스 트랩 - 모달 내에서만 포커스 이동
 */
export function useFocusTrap(isActive: boolean, containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // 초기 포커스
    firstElement?.focus()

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTab)
    return () => container.removeEventListener('keydown', handleTab)
  }, [isActive, containerRef])
}

/**
 * Escape 키로 모달 닫기
 */
export function useEscapeKey(isActive: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!isActive) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isActive, onEscape])
}

/**
 * 스크롤 잠금 (모달 열릴 때)
 */
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isLocked])
}

/**
 * 포커스 복원 - 모달 닫힐 때 원래 요소로 포커스 복귀
 */
export function useFocusRestore(isActive: boolean) {
  const previousActiveElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isActive) {
      previousActiveElement.current = document.activeElement as HTMLElement
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus()
      previousActiveElement.current = null
    }
  }, [isActive])
}

/**
 * ARIA live region 업데이트 알림
 */
export function useAnnounce() {
  const announceRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // ARIA live region 생성
    if (!announceRef.current) {
      const liveRegion = document.createElement('div')
      liveRegion.setAttribute('role', 'status')
      liveRegion.setAttribute('aria-live', 'polite')
      liveRegion.setAttribute('aria-atomic', 'true')
      liveRegion.className = 'sr-only'
      document.body.appendChild(liveRegion)
      announceRef.current = liveRegion
    }

    return () => {
      if (announceRef.current) {
        document.body.removeChild(announceRef.current)
        announceRef.current = null
      }
    }
  }, [])

  const announce = (message: string) => {
    if (announceRef.current) {
      announceRef.current.textContent = message
    }
  }

  return announce
}
