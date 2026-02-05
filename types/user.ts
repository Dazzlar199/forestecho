/**
 * User tier and subscription types
 */

export type UserTier = 'guest' | 'free' | 'basic' | 'premium'

export interface UserSubscription {
  tier: UserTier
  dailyLimit: number
  dailyUsed: number
  lastResetDate: string // ISO date string
  subscriptionExpiresAt?: string // ISO date string for paid tiers
}

export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  subscription: UserSubscription
  referralCode?: string // 내 초대 코드
  referredBy?: string // 나를 초대한 사람의 UID
  referralCount?: number // 내가 초대한 친구 수
  referralRewards?: number // 초대로 받은 보너스 대화 횟수
  createdAt: string
  updatedAt: string
}

// Tier configurations
export const TIER_CONFIG: Record<UserTier, {
  dailyLimit: number
  model: 'gpt-4o-mini' | 'gemini-2.0-flash'
  canAccessAnalysis: boolean
  canAccessAllModes: boolean
  price?: number
}> = {
  guest: {
    dailyLimit: 3,
    model: 'gpt-4o-mini',
    canAccessAnalysis: false,
    canAccessAllModes: false,
  },
  free: {
    dailyLimit: 20,
    model: 'gpt-4o-mini',
    canAccessAnalysis: false,
    canAccessAllModes: false,
  },
  basic: {
    dailyLimit: 100,
    model: 'gemini-2.0-flash',
    canAccessAnalysis: false,
    canAccessAllModes: true,
    price: 4900,
  },
  premium: {
    dailyLimit: 999999, // unlimited
    model: 'gemini-2.0-flash',
    canAccessAnalysis: true,
    canAccessAllModes: true,
    price: 9900,
  },
}
