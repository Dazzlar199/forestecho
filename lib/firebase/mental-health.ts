/**
 * 멘탈 헬스 프로필 Firestore 연동
 */

import { db } from './config'
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore'
import type {
  MentalHealthProfile,
  InitialAssessment,
  ForestState,
  HealthTrend,
} from '@/types/mental-health'
import { logger } from '@/lib/utils/logger'

/**
 * 멘탈 헬스 프로필 가져오기
 */
export async function getMentalHealthProfile(
  userId: string
): Promise<MentalHealthProfile | null> {
  try {
    const docRef = doc(db, 'mentalHealthProfiles', userId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return null
    }

    const data = docSnap.data()

    return {
      userId,
      hasCompletedAssessment: data.hasCompletedAssessment,
      initialAssessment: data.initialAssessment
        ? {
            ...data.initialAssessment,
            date: data.initialAssessment.date.toDate(),
          }
        : undefined,
      currentHealthScore: data.currentHealthScore,
      forestState: data.forestState,
      trend: data.trend,
      lastUpdated: data.lastUpdated.toDate(),
      assessmentHistory: (data.assessmentHistory || []).map((a: any) => ({
        ...a,
        date: a.date.toDate(),
      })),
    } as MentalHealthProfile
  } catch (error) {
    logger.error('Failed to get mental health profile:', error)
    return null
  }
}

/**
 * 초기 평가 저장
 */
export async function saveInitialAssessment(
  userId: string,
  assessment: InitialAssessment
): Promise<void> {
  try {
    const docRef = doc(db, 'mentalHealthProfiles', userId)
    const existingProfile = await getDoc(docRef)

    const assessmentData = {
      ...assessment,
      date: Timestamp.fromDate(assessment.date),
    }

    if (existingProfile.exists()) {
      // 기존 프로필 업데이트
      const history = existingProfile.data().assessmentHistory || []
      await updateDoc(docRef, {
        hasCompletedAssessment: true,
        initialAssessment: assessmentData,
        currentHealthScore: assessment.initialHealthScore,
        assessmentHistory: [...history, assessmentData],
        lastUpdated: Timestamp.now(),
      })
    } else {
      // 새 프로필 생성
      await setDoc(docRef, {
        userId,
        hasCompletedAssessment: true,
        initialAssessment: assessmentData,
        currentHealthScore: assessment.initialHealthScore,
        forestState: 'sprouting' as ForestState,
        trend: 'stable' as HealthTrend,
        lastUpdated: Timestamp.now(),
        assessmentHistory: [assessmentData],
      })
    }

    logger.info('Initial assessment saved for user:', userId)
  } catch (error) {
    logger.error('Failed to save initial assessment:', error)
    throw error
  }
}

/**
 * 건강도 및 숲 상태 업데이트
 */
export async function updateHealthScore(
  userId: string,
  newHealthScore: number,
  newForestState: ForestState,
  newTrend: HealthTrend
): Promise<void> {
  try {
    const docRef = doc(db, 'mentalHealthProfiles', userId)

    await updateDoc(docRef, {
      currentHealthScore: newHealthScore,
      forestState: newForestState,
      trend: newTrend,
      lastUpdated: Timestamp.now(),
    })

    logger.info('Health score updated:', {
      userId,
      newHealthScore,
      newForestState,
      newTrend,
    })
  } catch (error) {
    logger.error('Failed to update health score:', error)
    throw error
  }
}

/**
 * 프로필 초기화 (개발/테스트용)
 */
export async function resetMentalHealthProfile(userId: string): Promise<void> {
  try {
    const docRef = doc(db, 'mentalHealthProfiles', userId)
    await setDoc(docRef, {
      userId,
      hasCompletedAssessment: false,
      currentHealthScore: 50,
      forestState: 'sprouting' as ForestState,
      trend: 'stable' as HealthTrend,
      lastUpdated: Timestamp.now(),
      assessmentHistory: [],
    })

    logger.info('Mental health profile reset for user:', userId)
  } catch (error) {
    logger.error('Failed to reset mental health profile:', error)
    throw error
  }
}
