/**
 * 햅틱 피드백 유틸리티
 * iOS/Android 진동 API + 향후 Apps in Toss SDK 통합
 */

export type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'

/**
 * 햅틱 피드백 트리거
 */
export function triggerHaptic(style: HapticStyle = 'light') {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return

  // Vibration API가 지원되는지 확인
  if (!('vibrate' in navigator)) return

  // 스타일별 진동 패턴
  const patterns: Record<HapticStyle, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: 30,
    success: [10, 50, 10], // 짧게-길게-짧게
    warning: [15, 100, 15, 100, 15], // 3번 경고
    error: [30, 100, 30], // 강하게 2번
  }

  try {
    navigator.vibrate(patterns[style])
  } catch (error) {
    // 진동 실패 시 조용히 무시
    // 진동 미지원 환경에서는 무시
  }
}

/**
 * 버튼 클릭 햅틱
 */
export function hapticClick() {
  triggerHaptic('light')
}

/**
 * 성공 햅틱
 */
export function hapticSuccess() {
  triggerHaptic('success')
}

/**
 * 경고 햅틱
 */
export function hapticWarning() {
  triggerHaptic('warning')
}

/**
 * 에러 햅틱
 */
export function hapticError() {
  triggerHaptic('error')
}

/**
 * 선택/선택 해제 햅틱
 */
export function hapticSelection() {
  triggerHaptic('medium')
}
