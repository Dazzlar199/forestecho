/**
 * Server-side user subscription management (uses Admin SDK)
 * This bypasses Firestore security rules and should only be used in API routes
 */

import { adminDb } from './admin'
import type { UserTier, UserSubscription, UserProfile } from '@/types/user'
import { TIER_CONFIG } from '@/types/user'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * Get user subscription from Firestore (Admin SDK)
 */
export async function getUserSubscription(
  userId: string
): Promise<UserSubscription> {
  const userRef = adminDb.collection('users').doc(userId)
  const userSnap = await userRef.get()

  if (!userSnap.exists) {
    // New user: create default subscription
    const defaultSubscription: UserSubscription = {
      tier: 'free',
      dailyLimit: TIER_CONFIG.free.dailyLimit,
      dailyUsed: 0,
      lastResetDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    }

    await userRef.set({
      uid: userId,
      subscription: defaultSubscription,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    return defaultSubscription
  }

  const userData = userSnap.data() as UserProfile
  return userData.subscription
}

/**
 * Check if user has reached daily limit (Admin SDK)
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

    await adminDb.collection('users').doc(userId).update({
      'subscription.dailyUsed': 0,
      'subscription.lastResetDate': today,
      updatedAt: FieldValue.serverTimestamp(),
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
 * Increment daily usage count (Admin SDK)
 */
export async function incrementDailyUsage(userId: string): Promise<void> {
  const subscription = await getUserSubscription(userId)
  const today = new Date().toISOString().split('T')[0]

  // Reset if new day
  if (subscription.lastResetDate !== today) {
    await adminDb.collection('users').doc(userId).update({
      'subscription.dailyUsed': 1,
      'subscription.lastResetDate': today,
      updatedAt: FieldValue.serverTimestamp(),
    })
  } else {
    await adminDb.collection('users').doc(userId).update({
      'subscription.dailyUsed': subscription.dailyUsed + 1,
      updatedAt: FieldValue.serverTimestamp(),
    })
  }
}

/**
 * Upgrade user tier (Admin SDK, for payment integration)
 */
export async function upgradeUserTier(
  userId: string,
  newTier: UserTier,
  expiresAt?: Date
): Promise<void> {
  const tierConfig = TIER_CONFIG[newTier]

  await adminDb.collection('users').doc(userId).update({
    'subscription.tier': newTier,
    'subscription.dailyLimit': tierConfig.dailyLimit,
    'subscription.subscriptionExpiresAt': expiresAt
      ? expiresAt.toISOString()
      : null,
    updatedAt: FieldValue.serverTimestamp(),
  })
}

/**
 * Get AI model for user tier
 */
export function getModelForTier(tier: UserTier): 'gpt-4o-mini' | 'gemini-2.0-flash' {
  return TIER_CONFIG[tier].model
}
