import { logger } from '@/lib/utils/logger'
/**
 * Server-side Emotion Tracking (uses Admin SDK)
 * This bypasses Firestore security rules and should only be used in API routes
 */

import { adminDb } from './admin'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import type { EmotionSnapshot } from '@/types/emotion'

/**
 * Save emotion snapshot to Firestore (Admin SDK)
 */
export async function saveEmotionSnapshot(
  snapshot: Omit<EmotionSnapshot, 'id'>
): Promise<string> {
  try {
    const docRef = await adminDb.collection('emotionSnapshots').add({
      ...snapshot,
      timestamp: Timestamp.fromDate(snapshot.timestamp),
      createdAt: FieldValue.serverTimestamp(),
    })

    return docRef.id
  } catch (error) {
    logger.error('Failed to save emotion snapshot:', error)
    throw error
  }
}
