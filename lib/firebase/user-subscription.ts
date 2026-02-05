/**
 * User subscription and tier management
 */

import { db } from './config'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import type { UserTier, UserSubscription, UserProfile } from '@/types/user'
import { TIER_CONFIG } from '@/types/user'

/**
 * Get user subscription from Firestore
 */
export async function getUserSubscription(
  userId: string
): Promise<UserSubscription> {
  const userRef = doc(db, 'users', userId)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    // New user: create default subscription
    const defaultSubscription: UserSubscription = {
      tier: 'free',
      dailyLimit: TIER_CONFIG.free.dailyLimit,
      dailyUsed: 0,
      lastResetDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    }

    await setDoc(userRef, {
      uid: userId,
      subscription: defaultSubscription,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return defaultSubscription
  }

  const userData = userSnap.data() as UserProfile
  return userData.subscription
}

/**
 * Check if user has reached daily limit
 */
export async function checkDailyLimit(
  userId: string
): Promise<{
  hasReachedLimit: boolean
  remaining: number
  tier: UserTier
}> {
  const subscription = await getUserSubscription(userId)
  const today = new Date().toISOString().split('T')[0]

  // Reset daily count if it's a new day
  if (subscription.lastResetDate !== today) {
    subscription.dailyUsed = 0
    subscription.lastResetDate = today

    await updateDoc(doc(db, 'users', userId), {
      'subscription.dailyUsed': 0,
      'subscription.lastResetDate': today,
      updatedAt: serverTimestamp(),
    })
  }

  const hasReachedLimit = subscription.dailyUsed >= subscription.dailyLimit
  const remaining = Math.max(0, subscription.dailyLimit - subscription.dailyUsed)

  return {
    hasReachedLimit,
    remaining,
    tier: subscription.tier,
  }
}

/**
 * Increment daily usage count
 */
export async function incrementDailyUsage(userId: string): Promise<void> {
  const subscription = await getUserSubscription(userId)
  const today = new Date().toISOString().split('T')[0]

  // Reset if new day
  if (subscription.lastResetDate !== today) {
    await updateDoc(doc(db, 'users', userId), {
      'subscription.dailyUsed': 1,
      'subscription.lastResetDate': today,
      updatedAt: serverTimestamp(),
    })
  } else {
    await updateDoc(doc(db, 'users', userId), {
      'subscription.dailyUsed': subscription.dailyUsed + 1,
      updatedAt: serverTimestamp(),
    })
  }
}

/**
 * Upgrade user tier (for payment integration)
 */
export async function upgradeUserTier(
  userId: string,
  newTier: UserTier,
  expiresAt?: Date
): Promise<void> {
  const tierConfig = TIER_CONFIG[newTier]

  await updateDoc(doc(db, 'users', userId), {
    'subscription.tier': newTier,
    'subscription.dailyLimit': tierConfig.dailyLimit,
    'subscription.subscriptionExpiresAt': expiresAt
      ? expiresAt.toISOString()
      : null,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Get AI model for user tier
 */
export function getModelForTier(tier: UserTier): 'gpt-4o-mini' | 'gemini-2.0-flash' {
  return TIER_CONFIG[tier].model
}
