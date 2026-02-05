/**
 * 숲 상태 계산 시스템
 * 초기 평가 + 대화 분석 결과로 건강도 계산
 */

import type { ForestState, ForestStateInfo, HealthTrend } from '@/types/mental-health'
import type { PsychologicalAnalysis } from '@/types/analysis'

/**
 * 건강도 점수를 숲 상태로 변환
 */
export function getForestState(healthScore: number): ForestState {
  if (healthScore <= 15) return 'barren'
  if (healthScore <= 30) return 'dry'
  if (healthScore <= 45) return 'sprouting'
  if (healthScore <= 60) return 'growing'
  if (healthScore <= 75) return 'forest'
  if (healthScore <= 90) return 'lush'
  return 'blooming'
}

/**
 * 숲 상태별 정보
 */
export const FOREST_STATE_INFO: Record<ForestState, ForestStateInfo> = {
  barren: {
    state: 'barren',
    emoji: '🏜️',
    name: {
      ko: '황량한 땅',
      en: 'Barren Land',
      ja: '荒れた大地',
      zh: '荒凉之地',
    },
    description: {
      ko: '마음이 많이 지쳐있어요. 천천히 함께 회복해나가요.',
      en: 'Your mind is very tired. Let\'s recover together, slowly.',
      ja: '心がとても疲れています。ゆっくり一緒に回復していきましょう。',
      zh: '心灵非常疲惫。让我们一起慢慢恢复。',
    },
    color: '#8B7355',
  },
  dry: {
    state: 'dry',
    emoji: '🌾',
    name: {
      ko: '메마른 땅',
      en: 'Dry Land',
      ja: '乾いた大地',
      zh: '干涸之地',
    },
    description: {
      ko: '힘든 시기를 보내고 계시네요. 조금씩 나아질 거예요.',
      en: 'You\'re going through a difficult time. It will get better gradually.',
      ja: '困難な時期を過ごしていますね。少しずつ良くなります。',
      zh: '您正在经历艰难时期。会逐渐好转的。',
    },
    color: '#C4A777',
  },
  sprouting: {
    state: 'sprouting',
    emoji: '🌱',
    name: {
      ko: '첫 새싹',
      en: 'First Sprout',
      ja: '最初の芽',
      zh: '初萌新芽',
    },
    description: {
      ko: '회복의 시작이 보여요. 작은 변화가 일어나고 있어요.',
      en: 'Recovery is beginning. Small changes are happening.',
      ja: '回復の兆しが見えています。小さな変化が起こっています。',
      zh: '恢复的迹象正在显现。小小的变化正在发生。',
    },
    color: '#90C088',
  },
  growing: {
    state: 'growing',
    emoji: '🌿',
    name: {
      ko: '어린 나무',
      en: 'Young Tree',
      ja: '若木',
      zh: '幼树',
    },
    description: {
      ko: '조금씩 나아지고 있어요. 계속 성장하고 계세요.',
      en: 'You\'re getting better gradually. You\'re growing.',
      ja: '少しずつ良くなっています。成長し続けています。',
      zh: '正在逐渐好转。您正在成长。',
    },
    color: '#6FB66F',
  },
  forest: {
    state: 'forest',
    emoji: '🌳',
    name: {
      ko: '작은 숲',
      en: 'Small Forest',
      ja: '小さな森',
      zh: '小森林',
    },
    description: {
      ko: '건강하게 성장하고 있어요. 마음이 안정되어 가네요.',
      en: 'Growing healthily. Your mind is becoming stable.',
      ja: '健康に成長しています。心が安定してきています。',
      zh: '健康成长中。心灵正在变得稳定。',
    },
    color: '#4A9D4A',
  },
  lush: {
    state: 'lush',
    emoji: '🌲',
    name: {
      ko: '울창한 숲',
      en: 'Lush Forest',
      ja: '生い茂る森',
      zh: '茂密森林',
    },
    description: {
      ko: '마음이 건강해지고 있어요. 정말 잘하고 계세요.',
      en: 'Your mind is becoming healthy. You\'re doing great.',
      ja: '心が健康になってきています。本当に頑張っていますね。',
      zh: '心灵正在变得健康。您做得很好。',
    },
    color: '#2D8B2D',
  },
  blooming: {
    state: 'blooming',
    emoji: '🌸🌲',
    name: {
      ko: '꽃 핀 숲',
      en: 'Blooming Forest',
      ja: '花咲く森',
      zh: '花开森林',
    },
    description: {
      ko: '아름다운 마음의 정원이에요. 정말 멋지세요!',
      en: 'A beautiful garden of the mind. You\'re wonderful!',
      ja: '美しい心の庭です。素晴らしいですね！',
      zh: '美丽的心灵花园。您真棒！',
    },
    color: '#FF69B4',
  },
}

/**
 * 분석 결과들로부터 현재 건강도 계산
 * 최근 분석일수록 가중치가 높음
 */
export function calculateCurrentHealthScore(
  initialHealthScore: number,
  recentAnalyses: PsychologicalAnalysis[]
): number {
  // 분석이 없으면 초기 점수 유지
  if (recentAnalyses.length === 0) {
    return initialHealthScore
  }

  // 최근 10개 분석만 사용
  const analyses = recentAnalyses.slice(0, 10)

  // 가중치: 최신 분석일수록 높음
  let totalWeight = 0
  let weightedSum = 0

  analyses.forEach((analysis, index) => {
    const weight = 1 / (index + 1) // 첫 번째: 1, 두 번째: 0.5, 세 번째: 0.33...
    totalWeight += weight

    // 분석 결과를 점수로 변환
    const analysisScore = convertAnalysisToScore(analysis)
    weightedSum += analysisScore * weight
  })

  const averageAnalysisScore = weightedSum / totalWeight

  // 초기 점수(30%) + 분석 평균(70%) 혼합
  // 시간이 지날수록 분석 결과의 영향이 커짐
  const analysisWeight = Math.min(analyses.length * 0.1, 0.7)
  const initialWeight = 1 - analysisWeight

  return Math.round(
    initialHealthScore * initialWeight + averageAnalysisScore * analysisWeight
  )
}

/**
 * 분석 결과를 건강도 점수로 변환 (0-100)
 */
function convertAnalysisToScore(analysis: PsychologicalAnalysis): number {
  // riskLevel: high=0점, medium=50점, low=100점
  const riskScore =
    analysis.riskAssessment.riskLevel === 'low'
      ? 100
      : analysis.riskAssessment.riskLevel === 'medium'
      ? 50
      : 0

  // recoveryPotential: 0-10 → 0-100
  const recoveryScore = (analysis.prognosis.recoveryPotential / 10) * 100

  // 가중 평균: 위험도(60%) + 회복가능성(40%)
  return Math.round(riskScore * 0.6 + recoveryScore * 0.4)
}

/**
 * 건강도 추세 계산
 */
export function calculateHealthTrend(
  recentAnalyses: PsychologicalAnalysis[]
): HealthTrend {
  if (recentAnalyses.length < 3) {
    return 'stable'
  }

  // 최근 5개와 그 이전 5개 비교
  const recent = recentAnalyses.slice(0, 5)
  const older = recentAnalyses.slice(5, 10)

  if (older.length === 0) {
    return 'stable'
  }

  const recentScore =
    recent.reduce((sum, a) => sum + convertAnalysisToScore(a), 0) / recent.length
  const olderScore =
    older.reduce((sum, a) => sum + convertAnalysisToScore(a), 0) / older.length

  const diff = recentScore - olderScore

  if (diff > 10) return 'improving'
  if (diff < -10) return 'declining'
  return 'stable'
}

/**
 * 추세 메시지
 */
export function getTrendMessage(trend: HealthTrend, language: string = 'ko') {
  const messages = {
    ko: {
      improving: '좋아지고 있음',
      declining: '주의 필요',
      stable: '안정적',
    },
    en: {
      improving: 'Improving',
      declining: 'Needs attention',
      stable: 'Stable',
    },
    ja: {
      improving: '改善中',
      declining: '注意が必要',
      stable: '安定',
    },
    zh: {
      improving: '改善中',
      declining: '需要注意',
      stable: '稳定',
    },
  }

  return messages[language as 'ko' | 'en' | 'ja' | 'zh']?.[trend] || messages.ko[trend]
}
