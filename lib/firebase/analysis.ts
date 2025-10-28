import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
  doc,
  getDoc,
} from 'firebase/firestore'
import { db } from './config'
import type { PsychologicalAnalysis } from '@/types/analysis'

// 사용자의 모든 분석 결과 가져오기
export async function getUserAnalyses(
  userId: string,
  limitCount: number = 20
): Promise<PsychologicalAnalysis[]> {
  try {
    const q = query(
      collection(db, 'psychologicalAnalyses'),
      where('userId', '==', userId),
      orderBy('generatedAt', 'desc'),
      limit(limitCount)
    )

    const querySnapshot = await getDocs(q)
    const analyses: PsychologicalAnalysis[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      analyses.push({
        id: doc.id,
        ...data,
        generatedAt:
          data.generatedAt?.toDate?.()?.toISOString() ||
          data.generatedAt ||
          new Date().toISOString(),
      } as PsychologicalAnalysis)
    })

    return analyses
  } catch (error) {
    console.error('Error getting user analyses:', error)
    return []
  }
}

// 특정 분석 결과 가져오기
export async function getAnalysisById(
  analysisId: string
): Promise<PsychologicalAnalysis | null> {
  try {
    const docRef = doc(db, 'psychologicalAnalyses', analysisId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data,
        generatedAt:
          data.generatedAt?.toDate?.()?.toISOString() ||
          data.generatedAt ||
          new Date().toISOString(),
      } as PsychologicalAnalysis
    }

    return null
  } catch (error) {
    console.error('Error getting analysis:', error)
    return null
  }
}

// 사용자의 분석 통계
export async function getUserAnalysisStats(userId: string) {
  try {
    const analyses = await getUserAnalyses(userId, 100)

    if (analyses.length === 0) {
      return {
        totalAnalyses: 0,
        latestAnalysis: null,
        averageRiskLevel: 'low' as const,
        averageRecoveryPotential: 0,
      }
    }

    // 위험 수준 집계
    const riskLevels = analyses
      .map((a) => a.riskAssessment?.riskLevel)
      .filter(Boolean)
    const riskCounts = {
      low: riskLevels.filter((r) => r === 'low').length,
      medium: riskLevels.filter((r) => r === 'medium').length,
      high: riskLevels.filter((r) => r === 'high').length,
    }

    let averageRiskLevel: 'low' | 'medium' | 'high' = 'low'
    if (riskCounts.high > riskCounts.medium && riskCounts.high > riskCounts.low) {
      averageRiskLevel = 'high'
    } else if (riskCounts.medium >= riskCounts.low) {
      averageRiskLevel = 'medium'
    }

    // 회복 가능성 평균
    const recoveryPotentials = analyses
      .map((a) => a.prognosis?.recoveryPotential)
      .filter((p): p is number => typeof p === 'number')

    const averageRecoveryPotential =
      recoveryPotentials.length > 0
        ? recoveryPotentials.reduce((sum, p) => sum + p, 0) / recoveryPotentials.length
        : 0

    return {
      totalAnalyses: analyses.length,
      latestAnalysis: analyses[0],
      averageRiskLevel,
      averageRecoveryPotential: Math.round(averageRecoveryPotential * 10) / 10,
    }
  } catch (error) {
    console.error('Error getting analysis stats:', error)
    return {
      totalAnalyses: 0,
      latestAnalysis: null,
      averageRiskLevel: 'low' as const,
      averageRecoveryPotential: 0,
    }
  }
}
