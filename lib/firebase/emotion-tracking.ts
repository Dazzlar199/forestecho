import { logger } from '@/lib/utils/logger'
/**
 * Emotion Tracking Firestore Operations
 */

import { db } from './config'
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
  limit as firestoreLimit,
} from 'firebase/firestore'
import type { EmotionSnapshot, EmotionRecord, EmotionTrend, EmotionStats, EmotionType } from '@/types/emotion'

/**
 * Save emotion snapshot to Firestore
 */
export async function saveEmotionSnapshot(
  snapshot: Omit<EmotionSnapshot, 'id'>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'emotionSnapshots'), {
      ...snapshot,
      timestamp: Timestamp.fromDate(snapshot.timestamp),
      createdAt: Timestamp.now(),
    })

    return docRef.id
  } catch (error) {
    logger.error('Failed to save emotion snapshot:', error)
    throw error
  }
}

/**
 * Get user's emotion history
 */
export async function getEmotionHistory(
  userId: string,
  days: number = 30
): Promise<EmotionSnapshot[]> {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const q = query(
      collection(db, 'emotionSnapshots'),
      where('userId', '==', userId),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      orderBy('timestamp', 'asc')
    )

    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    })) as EmotionSnapshot[]
  } catch (error) {
    logger.error('Failed to get emotion history:', error)
    return []
  }
}

/**
 * Calculate daily emotion trends
 */
export function calculateEmotionTrends(
  snapshots: EmotionSnapshot[]
): EmotionTrend[] {
  const trendsByDate = new Map<string, EmotionTrend>()

  for (const snapshot of snapshots) {
    const dateKey = snapshot.timestamp.toISOString().split('T')[0]

    if (!trendsByDate.has(dateKey)) {
      trendsByDate.set(dateKey, {
        date: dateKey,
        emotions: {},
        sessionCount: 0,
      })
    }

    const trend = trendsByDate.get(dateKey)!
    trend.sessionCount++

    // Accumulate emotion intensities
    if (!trend.emotions[snapshot.emotion]) {
      trend.emotions[snapshot.emotion] = 0
    }
    trend.emotions[snapshot.emotion]! += snapshot.intensity
  }

  // Calculate averages
  for (const trend of trendsByDate.values()) {
    for (const emotion in trend.emotions) {
      trend.emotions[emotion as EmotionType]! /= trend.sessionCount
    }
  }

  return Array.from(trendsByDate.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  )
}

/**
 * Calculate emotion statistics
 */
export function calculateEmotionStats(
  snapshots: EmotionSnapshot[]
): EmotionStats | null {
  if (snapshots.length === 0) return null

  // Count emotion occurrences
  const emotionCounts: Partial<Record<EmotionType, number>> = {}
  let totalIntensity = 0

  for (const snapshot of snapshots) {
    emotionCounts[snapshot.emotion] = (emotionCounts[snapshot.emotion] || 0) + 1
    totalIntensity += snapshot.intensity
  }

  // Find dominant emotion
  const dominantEmotion = Object.entries(emotionCounts).reduce((a, b) =>
    (a[1] || 0) > (b[1] || 0) ? a : b
  )[0] as EmotionType

  // Calculate emotion distribution (percentage)
  const emotionDistribution: Partial<Record<EmotionType, number>> = {}
  for (const [emotion, count] of Object.entries(emotionCounts)) {
    emotionDistribution[emotion as EmotionType] = (count / snapshots.length) * 100
  }

  // Calculate improvement score (긍정 감정 증가 추세)
  const positiveEmotions: EmotionType[] = ['very_happy', 'happy', 'calm']
  const recentSnapshots = snapshots.slice(-Math.min(7, snapshots.length)) // 최근 7개
  const olderSnapshots = snapshots.slice(0, Math.min(7, snapshots.length)) // 초기 7개

  const recentPositive = recentSnapshots.filter(s =>
    positiveEmotions.includes(s.emotion)
  ).length / Math.max(recentSnapshots.length, 1)

  const olderPositive = olderSnapshots.filter(s =>
    positiveEmotions.includes(s.emotion)
  ).length / Math.max(olderSnapshots.length, 1)

  const improvementScore = Math.round((recentPositive - olderPositive) * 100)

  return {
    dominantEmotion,
    averageIntensity: totalIntensity / snapshots.length,
    improvementScore,
    totalSessions: snapshots.length,
    dateRange: {
      start: snapshots[0].timestamp,
      end: snapshots[snapshots.length - 1].timestamp,
    },
    emotionDistribution,
  }
}

/**
 * Get recent emotion snapshots (for quick display)
 */
export async function getRecentEmotions(
  userId: string,
  limitCount: number = 10
): Promise<EmotionSnapshot[]> {
  try {
    const q = query(
      collection(db, 'emotionSnapshots'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      firestoreLimit(limitCount)
    )

    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    })) as EmotionSnapshot[]
  } catch (error) {
    logger.error('Failed to get recent emotions:', error)
    return []
  }
}

/**
 * Save emotion checkin record to Firestore
 */
export async function saveEmotionRecord(
  record: Omit<EmotionRecord, 'id'>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'emotionRecords'), {
      ...record,
      timestamp: Timestamp.fromDate(record.timestamp),
      createdAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    logger.error('Failed to save emotion record:', error)
    throw error
  }
}

/**
 * Get user's emotion records for checkin history
 */
export async function getEmotionRecords(
  userId: string,
  days: number = 30
): Promise<EmotionRecord[]> {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const q = query(
      collection(db, 'emotionRecords'),
      where('userId', '==', userId),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      orderBy('timestamp', 'desc')
    )

    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    })) as EmotionRecord[]
  } catch (error) {
    logger.error('Failed to get emotion records:', error)
    return []
  }
}
