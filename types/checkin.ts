export type CheckinType = 'morning' | 'evening'

export interface CheckinQuestion {
  id: string
  text: {
    ko: string
    en: string
    ja: string
    zh: string
  }
  type: 'rating' | 'multiselect' | 'text'
  options?: {
    value: string
    label: {
      ko: string
      en: string
      ja: string
      zh: string
    }
  }[]
  scale?: { min: number; max: number }
}

export interface CheckinData {
  id: string
  userId: string
  type: CheckinType
  timestamp: Date
  answers: Record<string, any>
  mood?: number
  note?: string
}

export interface RoutineItem {
  id: string
  userId: string
  title: {
    ko: string
    en: string
    ja: string
    zh: string
  }
  type: 'morning' | 'evening' | 'anytime'
  icon: string
  color: string
  completed: boolean
  streak: number
  lastCompletedDate?: Date
}

export interface DailyProgress {
  date: Date
  morningCheckin: boolean
  eveningCheckin: boolean
  routinesCompleted: number
  totalRoutines: number
  mood: number
}

// 아침 체크인 질문
export const MORNING_QUESTIONS: CheckinQuestion[] = [
  {
    id: 'sleep_quality',
    text: {
      ko: '어젯밤 숙면을 취하셨나요?',
      en: 'Did you sleep well last night?',
      ja: '昨夜はよく眠れましたか？',
      zh: '昨晚睡得好吗？'
    },
    type: 'rating',
    scale: { min: 1, max: 5 }
  },
  {
    id: 'morning_mood',
    text: {
      ko: '오늘 아침 기분은 어떤가요?',
      en: 'How are you feeling this morning?',
      ja: '今朝の気分はどうですか？',
      zh: '今天早上感觉如何？'
    },
    type: 'rating',
    scale: { min: 1, max: 5 }
  },
  {
    id: 'energy_level',
    text: {
      ko: '오늘의 에너지 수준은?',
      en: 'What is your energy level today?',
      ja: '今日のエネルギーレベルは？',
      zh: '今天的精力水平如何？'
    },
    type: 'rating',
    scale: { min: 1, max: 5 }
  },
  {
    id: 'intentions',
    text: {
      ko: '오늘의 목표는 무엇인가요?',
      en: 'What are your intentions for today?',
      ja: '今日の目標は何ですか？',
      zh: '今天的目标是什么？'
    },
    type: 'multiselect',
    options: [
      {
        value: 'productive',
        label: { ko: '생산적으로 보내기', en: 'Be productive', ja: '生産的に過ごす', zh: '提高效率' }
      },
      {
        value: 'relaxed',
        label: { ko: '여유롭게 보내기', en: 'Stay relaxed', ja: 'リラックスする', zh: '放松休息' }
      },
      {
        value: 'social',
        label: { ko: '사람들과 교류하기', en: 'Connect with people', ja: '人と交流する', zh: '与人交流' }
      },
      {
        value: 'exercise',
        label: { ko: '운동하기', en: 'Exercise', ja: '運動する', zh: '锻炼身体' }
      },
      {
        value: 'mindful',
        label: { ko: '마음챙김', en: 'Be mindful', ja: 'マインドフルネス', zh: '正念冥想' }
      },
      {
        value: 'creative',
        label: { ko: '창의적 활동', en: 'Be creative', ja: '創造的活動', zh: '创造性活动' }
      }
    ]
  }
]

// 저녁 체크인 질문
export const EVENING_QUESTIONS: CheckinQuestion[] = [
  {
    id: 'day_rating',
    text: {
      ko: '오늘 하루를 평가한다면?',
      en: 'How would you rate your day?',
      ja: '今日の1日を評価すると？',
      zh: '你如何评价今天？'
    },
    type: 'rating',
    scale: { min: 1, max: 5 }
  },
  {
    id: 'accomplished',
    text: {
      ko: '오늘 무엇을 이루었나요?',
      en: 'What did you accomplish today?',
      ja: '今日何を達成しましたか？',
      zh: '今天完成了什么？'
    },
    type: 'multiselect',
    options: [
      {
        value: 'work',
        label: { ko: '업무/학업 목표', en: 'Work/study goals', ja: '仕事/学習目標', zh: '工作/学习目标' }
      },
      {
        value: 'exercise',
        label: { ko: '운동', en: 'Exercise', ja: '運動', zh: '锻炼' }
      },
      {
        value: 'social',
        label: { ko: '사회적 교류', en: 'Social connection', ja: '社会的交流', zh: '社交活动' }
      },
      {
        value: 'selfcare',
        label: { ko: '자기돌봄', en: 'Self-care', ja: 'セルフケア', zh: '自我照顾' }
      },
      {
        value: 'hobby',
        label: { ko: '취미활동', en: 'Hobbies', ja: '趣味活動', zh: '兴趣爱好' }
      },
      {
        value: 'rest',
        label: { ko: '충분한 휴식', en: 'Adequate rest', ja: '十分な休息', zh: '充分休息' }
      }
    ]
  },
  {
    id: 'challenges',
    text: {
      ko: '오늘의 어려움은 무엇이었나요?',
      en: 'What challenges did you face today?',
      ja: '今日の困難は何でしたか？',
      zh: '今天遇到了什么困难？'
    },
    type: 'multiselect',
    options: [
      {
        value: 'stress',
        label: { ko: '스트레스', en: 'Stress', ja: 'ストレス', zh: '压力' }
      },
      {
        value: 'anxiety',
        label: { ko: '불안', en: 'Anxiety', ja: '不安', zh: '焦虑' }
      },
      {
        value: 'sadness',
        label: { ko: '우울감', en: 'Sadness', ja: '憂鬱', zh: '忧郁' }
      },
      {
        value: 'fatigue',
        label: { ko: '피로', en: 'Fatigue', ja: '疲労', zh: '疲劳' }
      },
      {
        value: 'conflict',
        label: { ko: '대인관계 갈등', en: 'Conflict', ja: '対人関係の葛藤', zh: '人际冲突' }
      },
      {
        value: 'none',
        label: { ko: '특별한 어려움 없음', en: 'No major challenges', ja: '特に困難なし', zh: '没有重大困难' }
      }
    ]
  },
  {
    id: 'gratitude',
    text: {
      ko: '오늘 감사한 일은?',
      en: 'What are you grateful for today?',
      ja: '今日感謝することは？',
      zh: '今天感恩的是什么？'
    },
    type: 'text'
  },
  {
    id: 'tomorrow_prep',
    text: {
      ko: '내일을 위한 준비',
      en: 'Preparation for tomorrow',
      ja: '明日への準備',
      zh: '为明天做准备'
    },
    type: 'multiselect',
    options: [
      {
        value: 'sleep_early',
        label: { ko: '일찍 자기', en: 'Sleep early', ja: '早く寝る', zh: '早点睡' }
      },
      {
        value: 'plan',
        label: { ko: '일정 계획하기', en: 'Plan schedule', ja: '予定を計画する', zh: '计划日程' }
      },
      {
        value: 'prepare',
        label: { ko: '준비물 챙기기', en: 'Prepare items', ja: '準備物を揃える', zh: '准备物品' }
      },
      {
        value: 'relax',
        label: { ko: '긴장 풀기', en: 'Relax', ja: 'リラックスする', zh: '放松' }
      }
    ]
  }
]

// 기본 루틴 템플릿
export const DEFAULT_ROUTINES: Omit<RoutineItem, 'id' | 'userId' | 'completed' | 'streak' | 'lastCompletedDate'>[] = [
  {
    title: { ko: '명상 5분', en: '5-min meditation', ja: '5分瞑想', zh: '5分钟冥想' },
    type: 'morning',
    icon: 'Sunrise',
    color: '#f59e0b'
  },
  {
    title: { ko: '스트레칭', en: 'Stretching', ja: 'ストレッチ', zh: '伸展运动' },
    type: 'morning',
    icon: 'Activity',
    color: '#10b981'
  },
  {
    title: { ko: '물 한 잔', en: 'Drink water', ja: '水を1杯', zh: '喝杯水' },
    type: 'morning',
    icon: 'Droplets',
    color: '#3b82f6'
  },
  {
    title: { ko: '산책', en: 'Walk', ja: '散歩', zh: '散步' },
    type: 'anytime',
    icon: 'Footprints',
    color: '#8b5cf6'
  },
  {
    title: { ko: '감사일기', en: 'Gratitude journal', ja: '感謝日記', zh: '感恩日记' },
    type: 'evening',
    icon: 'BookHeart',
    color: '#ec4899'
  },
  {
    title: { ko: '디지털 디톡스', en: 'Digital detox', ja: 'デジタルデトックス', zh: '数字排毒' },
    type: 'evening',
    icon: 'PhoneOff',
    color: '#ef4444'
  },
  {
    title: { ko: '독서 10분', en: '10-min reading', ja: '10分読書', zh: '10分钟阅读' },
    type: 'evening',
    icon: 'BookOpen',
    color: '#6366f1'
  }
]
