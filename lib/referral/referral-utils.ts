/**
 * Referral Code Generation and Utilities
 */

/**
 * Generate a unique 8-character referral code
 * Format: XXXX-XXXX (uppercase letters and numbers)
 */
export function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Removed confusing chars (0, O, I, 1)
  let code = ''

  for (let i = 0; i < 8; i++) {
    if (i === 4) {
      code += '-'
    }
    code += chars[Math.floor(Math.random() * chars.length)]
  }

  return code
}

/**
 * Validate referral code format
 */
export function isValidReferralCode(code: string): boolean {
  return /^[A-Z2-9]{4}-[A-Z2-9]{4}$/.test(code)
}

/**
 * Normalize referral code (uppercase, add dash if missing)
 */
export function normalizeReferralCode(code: string): string {
  const cleaned = code.toUpperCase().replace(/[^A-Z0-9]/g, '')

  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`
  }

  return code.toUpperCase()
}
