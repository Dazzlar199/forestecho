/**
 * 성능 최적화 유틸리티
 */

/**
 * Debounce 함수 - 연속 호출 방지
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle 함수 - 일정 시간 간격으로만 실행
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Intersection Observer로 요소 가시성 감지
 */
export function observeElement(
  element: HTMLElement,
  callback: (isVisible: boolean) => void,
  options?: IntersectionObserverInit
): () => void {
  const observer = new IntersectionObserver(
    ([entry]) => {
      callback(entry.isIntersecting)
    },
    {
      threshold: 0.1,
      ...options,
    }
  )

  observer.observe(element)

  return () => observer.disconnect()
}

/**
 * 이미지 프리로드
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

/**
 * 여러 이미지 프리로드
 */
export async function preloadImages(sources: string[]): Promise<void> {
  await Promise.all(sources.map(preloadImage))
}

/**
 * 메모리 사용량 확인 (Chrome만 지원)
 */
export function getMemoryUsage(): number | null {
  if (typeof window === 'undefined') return null

  const performance = window.performance as any
  if (performance.memory) {
    return performance.memory.usedJSHeapSize / 1048576 // MB로 변환
  }

  return null
}

/**
 * FPS 측정
 */
export class FPSMeter {
  private frames: number = 0
  private lastTime: number = performance.now()
  private fps: number = 0
  private rafId: number | null = null

  start() {
    const measure = () => {
      const now = performance.now()
      this.frames++

      if (now >= this.lastTime + 1000) {
        this.fps = Math.round((this.frames * 1000) / (now - this.lastTime))
        this.frames = 0
        this.lastTime = now
      }

      this.rafId = requestAnimationFrame(measure)
    }

    this.rafId = requestAnimationFrame(measure)
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  getFPS(): number {
    return this.fps
  }
}

/**
 * 리소스 힌트 추가
 */
export function addResourceHint(
  url: string,
  type: 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch',
  as?: string
) {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = type
  link.href = url

  if (as && type === 'preload') {
    link.as = as
  }

  document.head.appendChild(link)
}

/**
 * 네트워크 상태 확인
 */
export function getNetworkInfo() {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return null
  }

  const connection = (navigator as any).connection
  return {
    effectiveType: connection.effectiveType, // '4g', '3g', '2g', 'slow-2g'
    downlink: connection.downlink, // Mbps
    rtt: connection.rtt, // ms
    saveData: connection.saveData, // boolean
  }
}

/**
 * 데이터 절약 모드 확인
 */
export function isSaveDataMode(): boolean {
  if (typeof navigator === 'undefined') return false

  const connection = (navigator as any).connection
  return connection?.saveData === true
}
