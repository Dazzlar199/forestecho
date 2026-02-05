import { logger } from '@/lib/utils/logger'
/**
 * Server-side Referral Management (Admin SDK)
 */

import { adminDb } from '../firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'
import { generateReferralCode } from './referral-utils'

const REFERRAL_BONUS = 3 // 양쪽 모두 +3회 대화

/**
 * Generate and assign referral code to user
 */
export async function assignReferralCode(userId: string): Promise<string> {
  const userRef = adminDb.collection('users').doc(userId)
  const userSnap = await userRef.get()

  if (!userSnap.exists) {
    throw new Error('User not found')
  }

  const userData = userSnap.data()

  // Already has code
  if (userData?.referralCode) {
    return userData.referralCode
  }

  // Generate unique code
  let code = generateReferralCode()
  let attempts = 0
  const maxAttempts = 10

  while (attempts < maxAttempts) {
    const existingUser = await adminDb
      .collection('users')
      .where('referralCode', '==', code)
      .limit(1)
      .get()

    if (existingUser.empty) {
      break
    }

    code = generateReferralCode()
    attempts++
  }

  if (attempts >= maxAttempts) {
    throw new Error('Failed to generate unique referral code')
  }

  // Assign code
  await userRef.update({
    referralCode: code,
    referralCount: 0,
    referralRewards: 0,
    updatedAt: FieldValue.serverTimestamp(),
  })

  return code
}

/**
 * Apply referral code when new user signs up
 * Gives bonus to both referrer and referee
 */
export async function applyReferralCode(
  newUserId: string,
  referralCode: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Find referrer by code
    const referrerQuery = await adminDb
      .collection('users')
      .where('referralCode', '==', referralCode.toUpperCase())
      .limit(1)
      .get()

    if (referrerQuery.empty) {
      return { success: false, error: 'Invalid referral code' }
    }

    const referrerDoc = referrerQuery.docs[0]
    const referrerId = referrerDoc.id

    // Can't refer yourself
    if (referrerId === newUserId) {
      return { success: false, error: 'Cannot use your own referral code' }
    }

    const newUserRef = adminDb.collection('users').doc(newUserId)
    const newUserSnap = await newUserRef.get()

    if (!newUserSnap.exists) {
      return { success: false, error: 'New user not found' }
    }

    const newUserData = newUserSnap.data()

    // Already used a referral code
    if (newUserData?.referredBy) {
      return { success: false, error: 'Referral code already applied' }
    }

    // Apply referral
    const batch = adminDb.batch()

    // Update new user: mark as referred, add bonus
    batch.update(newUserRef, {
      referredBy: referrerId,
      'subscription.dailyLimit': FieldValue.increment(REFERRAL_BONUS),
      referralRewards: REFERRAL_BONUS,
      updatedAt: FieldValue.serverTimestamp(),
    })

    // Update referrer: increment count, add bonus
    batch.update(referrerDoc.ref, {
      referralCount: FieldValue.increment(1),
      referralRewards: FieldValue.increment(REFERRAL_BONUS),
      'subscription.dailyLimit': FieldValue.increment(REFERRAL_BONUS),
      updatedAt: FieldValue.serverTimestamp(),
    })

    await batch.commit()

    return { success: true }
  } catch (error: any) {
    logger.error('Failed to apply referral code:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get referral stats for a user
 */
export async function getReferralStats(userId: string): Promise<{
  referralCode: string | null
  referralCount: number
  referralRewards: number
  referredBy: string | null
}> {
  const userRef = adminDb.collection('users').doc(userId)
  const userSnap = await userRef.get()

  if (!userSnap.exists) {
    return {
      referralCode: null,
      referralCount: 0,
      referralRewards: 0,
      referredBy: null,
    }
  }

  const data = userSnap.data()

  return {
    referralCode: data?.referralCode || null,
    referralCount: data?.referralCount || 0,
    referralRewards: data?.referralRewards || 0,
    referredBy: data?.referredBy || null,
  }
}
