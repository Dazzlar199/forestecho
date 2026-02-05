import { logger } from '@/lib/utils/logger'
/**
 * Client-side Referral Code Management
 */

const REFERRAL_KEY = 'forestecho_referral_code'

/**
 * Save referral code from URL to localStorage
 */
export function saveReferralCodeFromURL() {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams(window.location.search)
  const refCode = params.get('ref')

  if (refCode) {
    localStorage.setItem(REFERRAL_KEY, refCode.toUpperCase())
  }
}

/**
 * Get stored referral code
 */
export function getStoredReferralCode(): string | null {
  if (typeof window === 'undefined') return null

  return localStorage.getItem(REFERRAL_KEY)
}

/**
 * Clear stored referral code (after successful application)
 */
export function clearStoredReferralCode() {
  if (typeof window === 'undefined') return

  localStorage.removeItem(REFERRAL_KEY)
}

/**
 * Apply referral code for new user
 */
export async function applyStoredReferralCode(userId: string): Promise<boolean> {
  const code = getStoredReferralCode()

  if (!code) return false

  try {
    const res = await fetch('/api/referral', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'apply',
        userId,
        referralCode: code,
      }),
    })

    const data = await res.json()

    if (data.success) {
      clearStoredReferralCode()
      return true
    }

    return false
  } catch (error) {
    logger.error('Failed to apply referral code:', error)
    return false
  }
}
