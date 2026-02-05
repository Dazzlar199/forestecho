// 감정 타입 정의

export type EmotionType =
  | 'very_happy'    // 매우 행복
  | 'happy'         // 행복
  | 'calm'          // 평온
  | 'neutral'       // 보통
  | 'anxious'       // 불안
  | 'sad'           // 슬픔
  | 'angry'         // 화남
  | 'stressed'      // 스트레스

export interface EmotionRecord {
  id: string
  userId: string
  emotion: EmotionType
  intensity: number        // 1-10 강도
  note?: string           // 메모 (선택)
  triggers?: string[]     // 감정 유발 요인
  timestamp: Date
}

export interface EmotionPattern {
  dominantEmotion: EmotionType
  averageIntensity: number
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  dayOfWeek: string
  frequency: number
}

export const emotionConfig: Record<EmotionType, {
  name: { ko: string; en: string; ja: string; zh: string }
  color: string
  iconName: string // lucide-react icon name
}> = {
  very_happy: {
    name: { ko: '매우 행복', en: 'Very Happy', ja: 'とても幸せ', zh: '非常开心' },
    color: '#fbbf24',
    iconName: 'Laugh'
  },
  happy: {
    name: { ko: '행복', en: 'Happy', ja: '幸せ', zh: '开心' },
    color: '#a3e635',
    iconName: 'Smile'
  },
  calm: {
    name: { ko: '평온', en: 'Calm', ja: '穏やか', zh: '平静' },
    color: '#6ee7b7',
    iconName: 'Wind'
  },
  neutral: {
    name: { ko: '보통', en: 'Neutral', ja: '普通', zh: '一般' },
    color: '#94a3b8',
    iconName: 'Minus'
  },
  anxious: {
    name: { ko: '불안', en: 'Anxious', ja: '不安', zh: '焦虑' },
    color: '#fcd34d',
    iconName: 'AlertCircle'
  },
  sad: {
    name: { ko: '슬픔', en: 'Sad', ja: '悲しい', zh: '悲伤' },
    color: '#60a5fa',
    iconName: 'CloudRain'
  },
  angry: {
    name: { ko: '화남', en: 'Angry', ja: '怒り', zh: '生气' },
    color: '#f87171',
    iconName: 'Flame'
  },
  stressed: {
    name: { ko: '스트레스', en: 'Stressed', ja: 'ストレス', zh: '压力' },
    color: '#fb923c',
    iconName: 'Zap'
  },
}

export const emotionTriggers = {
  ko: ['일', '관계', '건강', '가족', '돈', '미래', '과거', '외로움', '기타'],
  en: ['Work', 'Relationships', 'Health', 'Family', 'Money', 'Future', 'Past', 'Loneliness', 'Other'],
  ja: ['仕事', '人間関係', '健康', '家族', 'お金', '未来', '過去', '孤独', 'その他'],
  zh: ['工作', '人际关系', '健康', '家庭', '金钱', '未来', '过去', '孤独', '其他'],
}

// 감정 여정 트래킹 (진행도 시각화용)
export interface EmotionSnapshot {
  id: string
  userId: string
  sessionId: string
  timestamp: Date
  emotion: EmotionType
  intensity: number // 1-10
  context?: string
  userMessage?: string
  metadata?: {
    conversationLength?: number
    counselingMode?: string
  }
}

export interface EmotionTrend {
  date: string // YYYY-MM-DD
  emotions: Partial<Record<EmotionType, number>> // 평균 intensity
  sessionCount: number
}

export interface EmotionStats {
  dominantEmotion: EmotionType
  averageIntensity: number
  improvementScore: number // -100 to 100 (긍정적 변화)
  totalSessions: number
  dateRange: {
    start: Date
    end: Date
  }
  emotionDistribution: Partial<Record<EmotionType, number>> // percentage
}
