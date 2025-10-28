// 숲 레벨 시스템

export interface ForestLevel {
  level: number // 1-10
  title: string
  description: string
  elements: ForestElement[]
}

export interface ForestElement {
  type: 'tree' | 'flower' | 'grass' | 'animal' | 'decoration'
  name: string
  unlocked: boolean
}

export interface UserForestData {
  analysisCount: number
  averageRecoveryPotential: number // 0-10
  riskLevel: 'low' | 'medium' | 'high'
}

// 숲 레벨 계산
export function calculateForestLevel(data: UserForestData): number {
  // 1. 분석 횟수 점수 (0-30점)
  const analysisScore = Math.min(data.analysisCount * 3, 30)

  // 2. 회복 가능성 점수 (0-40점)
  const recoveryScore = (data.averageRecoveryPotential / 10) * 40

  // 3. 위험 수준 점수 (0-30점)
  const riskScore =
    data.riskLevel === 'low' ? 30 : data.riskLevel === 'medium' ? 15 : 0

  // 총점 (0-100점)
  const totalScore = analysisScore + recoveryScore + riskScore

  // 레벨 변환 (1-10)
  const level = Math.min(Math.floor(totalScore / 10) + 1, 10)

  return level
}

// 레벨별 정보
export function getForestLevelInfo(level: number): ForestLevel {
  const levelData: Record<number, ForestLevel> = {
    1: {
      level: 1,
      title: '황량한 땅',
      description: '여정의 시작입니다. 마음의 씨앗을 뿌려보세요.',
      elements: [
        { type: 'grass', name: '마른 풀', unlocked: true },
        { type: 'tree', name: '작은 씨앗', unlocked: true },
      ],
    },
    2: {
      level: 2,
      title: '새싹의 땅',
      description: '작은 새싹이 돋아나기 시작했습니다.',
      elements: [
        { type: 'grass', name: '초록 풀', unlocked: true },
        { type: 'tree', name: '어린 새싹', unlocked: true },
        { type: 'flower', name: '작은 꽃봉오리', unlocked: true },
      ],
    },
    3: {
      level: 3,
      title: '성장하는 숲',
      description: '나무가 자라나고 있습니다.',
      elements: [
        { type: 'grass', name: '푸른 잔디', unlocked: true },
        { type: 'tree', name: '어린 나무', unlocked: true },
        { type: 'flower', name: '데이지', unlocked: true },
        { type: 'decoration', name: '작은 돌', unlocked: true },
      ],
    },
    4: {
      level: 4,
      title: '싱그러운 숲',
      description: '생명력이 넘치기 시작합니다.',
      elements: [
        { type: 'tree', name: '튼튼한 나무', unlocked: true },
        { type: 'flower', name: '튤립', unlocked: true },
        { type: 'flower', name: '해바라기', unlocked: true },
        { type: 'decoration', name: '작은 연못', unlocked: true },
      ],
    },
    5: {
      level: 5,
      title: '아늑한 숲',
      description: '이제 쉴 수 있는 공간이 생겼습니다.',
      elements: [
        { type: 'tree', name: '큰 나무', unlocked: true },
        { type: 'flower', name: '장미', unlocked: true },
        { type: 'decoration', name: '나무 벤치', unlocked: true },
        { type: 'animal', name: '나비', unlocked: true },
      ],
    },
    6: {
      level: 6,
      title: '평화로운 숲',
      description: '마음의 평화가 찾아왔습니다.',
      elements: [
        { type: 'tree', name: '벚나무', unlocked: true },
        { type: 'flower', name: '라벤더', unlocked: true },
        { type: 'animal', name: '새', unlocked: true },
        { type: 'decoration', name: '작은 폭포', unlocked: true },
      ],
    },
    7: {
      level: 7,
      title: '생기 넘치는 숲',
      description: '숲이 활기로 가득합니다.',
      elements: [
        { type: 'tree', name: '단풍나무', unlocked: true },
        { type: 'flower', name: '수국', unlocked: true },
        { type: 'animal', name: '토끼', unlocked: true },
        { type: 'animal', name: '다람쥐', unlocked: true },
      ],
    },
    8: {
      level: 8,
      title: '풍요로운 숲',
      description: '마음이 풍요로워졌습니다.',
      elements: [
        { type: 'tree', name: '느티나무', unlocked: true },
        { type: 'flower', name: '백합', unlocked: true },
        { type: 'animal', name: '사슴', unlocked: true },
        { type: 'decoration', name: '작은 다리', unlocked: true },
      ],
    },
    9: {
      level: 9,
      title: '조화로운 숲',
      description: '모든 것이 조화롭게 어우러집니다.',
      elements: [
        { type: 'tree', name: '은행나무', unlocked: true },
        { type: 'flower', name: '목련', unlocked: true },
        { type: 'animal', name: '여우', unlocked: true },
        { type: 'decoration', name: '돌탑', unlocked: true },
      ],
    },
    10: {
      level: 10,
      title: '완성된 낙원',
      description: '당신의 마음이 만든 완벽한 숲입니다.',
      elements: [
        { type: 'tree', name: '신성한 고목', unlocked: true },
        { type: 'flower', name: '철쭉', unlocked: true },
        { type: 'animal', name: '부엉이', unlocked: true },
        { type: 'animal', name: '반딧불이', unlocked: true },
        { type: 'decoration', name: '작은 오두막', unlocked: true },
      ],
    },
  }

  return (
    levelData[level] || {
      level: 1,
      title: '황량한 땅',
      description: '여정의 시작입니다.',
      elements: [],
    }
  )
}

// 다음 레벨까지 필요한 점수 계산
export function getPointsToNextLevel(currentLevel: number, currentScore: number): number {
  if (currentLevel >= 10) return 0

  const nextLevelScore = currentLevel * 10
  return Math.max(nextLevelScore - currentScore, 0)
}

// 레벨별 색상
export function getForestLevelColor(level: number): string {
  if (level <= 2) return '#8B7355' // 갈색 (황량)
  if (level <= 4) return '#9ACD32' // 연두색 (성장)
  if (level <= 6) return '#228B22' // 초록색 (평화)
  if (level <= 8) return '#32CD32' // 밝은 초록 (풍요)
  return '#00FF7F' // 봄 초록 (완성)
}

// 레벨에 따른 이모지
export function getForestLevelEmoji(level: number): string {
  if (level <= 2) return '🌱'
  if (level <= 4) return '🌿'
  if (level <= 6) return '🌳'
  if (level <= 8) return '🌲'
  return '🏞️'
}
