export type PostCategory = 'daily' | 'worry' | 'growth' | 'gratitude' | 'question' | 'support'

export interface Post {
  id: string
  authorId: string
  authorName: string // 익명 또는 닉네임
  isAnonymous: boolean
  category: PostCategory
  title: string
  content: string
  timestamp: Date
  likes: number
  commentCount: number
  likedBy: string[] // 좋아요 누른 사용자 ID
  tags?: string[]
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  authorName: string
  isAnonymous: boolean
  content: string
  timestamp: Date
  likes: number
  likedBy: string[]
}

export const CATEGORIES = [
  {
    id: 'daily' as PostCategory,
    name: { ko: '일상', en: 'Daily', ja: '日常', zh: '日常' },
    icon: 'Coffee',
    color: '#f59e0b',
    description: {
      ko: '오늘의 일상을 공유해요',
      en: 'Share your daily life',
      ja: '今日の日常をシェア',
      zh: '分享你的日常生活'
    }
  },
  {
    id: 'worry' as PostCategory,
    name: { ko: '고민', en: 'Worries', ja: '悩み', zh: '烦恼' },
    icon: 'Cloud',
    color: '#6b7280',
    description: {
      ko: '마음속 고민을 나눠요',
      en: 'Share your worries',
      ja: '悩みを共有しましょう',
      zh: '分享你的烦恼'
    }
  },
  {
    id: 'growth' as PostCategory,
    name: { ko: '성장', en: 'Growth', ja: '成長', zh: '成长' },
    icon: 'TrendingUp',
    color: '#10b981',
    description: {
      ko: '나의 성장 이야기를 들려줘요',
      en: 'Share your growth story',
      ja: '成長の物語をシェア',
      zh: '分享你的成长故事'
    }
  },
  {
    id: 'gratitude' as PostCategory,
    name: { ko: '감사', en: 'Gratitude', ja: '感謝', zh: '感恩' },
    icon: 'Heart',
    color: '#ec4899',
    description: {
      ko: '감사한 순간을 기록해요',
      en: 'Record grateful moments',
      ja: '感謝の瞬間を記録',
      zh: '记录感恩的时刻'
    }
  },
  {
    id: 'question' as PostCategory,
    name: { ko: '질문', en: 'Question', ja: '質問', zh: '提问' },
    icon: 'HelpCircle',
    color: '#3b82f6',
    description: {
      ko: '궁금한 것을 물어봐요',
      en: 'Ask your questions',
      ja: '質問をしましょう',
      zh: '提出你的问题'
    }
  },
  {
    id: 'support' as PostCategory,
    name: { ko: '응원', en: 'Support', ja: '応援', zh: '鼓励' },
    icon: 'Sparkles',
    color: '#8b5cf6',
    description: {
      ko: '서로를 응원해요',
      en: 'Support each other',
      ja: 'お互いを応援しましょう',
      zh: '互相鼓励'
    }
  }
] as const

// 익명 닉네임 생성기 (랜덤)
const ADJECTIVES = {
  ko: ['따뜻한', '밝은', '조용한', '평온한', '용감한', '부드러운', '지혜로운', '희망찬', '친절한', '강인한'],
  en: ['Warm', 'Bright', 'Quiet', 'Peaceful', 'Brave', 'Gentle', 'Wise', 'Hopeful', 'Kind', 'Strong'],
  ja: ['温かい', '明るい', '静かな', '穏やかな', '勇敢な', '優しい', '賢明な', '希望に満ちた', '親切な', '強い'],
  zh: ['温暖的', '明亮的', '安静的', '平静的', '勇敢的', '温柔的', '智慧的', '充满希望的', '善良的', '坚强的']
}

const NOUNS = {
  ko: ['나무', '바람', '구름', '별', '달', '꽃', '새', '물', '빛', '산'],
  en: ['Tree', 'Wind', 'Cloud', 'Star', 'Moon', 'Flower', 'Bird', 'Water', 'Light', 'Mountain'],
  ja: ['木', '風', '雲', '星', '月', '花', '鳥', '水', '光', '山'],
  zh: ['树', '风', '云', '星星', '月亮', '花', '鸟', '水', '光', '山']
}

export function generateAnonymousName(language: 'ko' | 'en' | 'ja' | 'zh' = 'ko'): string {
  const adjectives = ADJECTIVES[language]
  const nouns = NOUNS[language]
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]

  if (language === 'ko') {
    return `${adj} ${noun}`
  } else if (language === 'ja') {
    return `${adj}${noun}`
  } else {
    return `${adj} ${noun}`
  }
}

// Mock 데이터
export const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    authorId: 'user-1',
    authorName: '익명',
    isAnonymous: true,
    category: 'daily',
    title: '오늘 회사 때려치우고 싶었던 순간 TOP3',
    content: '1. 아침 9시 출근했는데 10시부터 회의 3개 연속\n2. 점심 먹으러 나가려는데 갑자기 급한 일 생김\n3. 퇴근 5분전 상사가 "잠깐 얘기 좀"\n\n오늘 하루도 무사히... 살아남았습니다 ㅎ',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 142,
    commentCount: 23,
    likedBy: [],
    tags: ['일상', '직장', '공감']
  },
  {
    id: 'post-2',
    authorId: 'user-2',
    authorName: '익명',
    isAnonymous: true,
    category: 'worry',
    title: '취업 준비 6개월째인데 너무 힘들다',
    content: '주변 친구들은 다 취업했는데 나만 계속 떨어지니까 자존감이 바닥이네요. 면접 볼 때마다 긴장해서 말도 제대로 못하고... 이러다 진짜 평생 백수인가 싶어서 불안해요. 어떻게 마음 추스르시나요?',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 89,
    commentCount: 31,
    likedBy: [],
    tags: ['취업', '고민', '불안']
  },
  {
    id: 'post-3',
    authorId: 'user-3',
    authorName: '익명',
    isAnonymous: true,
    category: 'question',
    title: '요즘 유행하는 MBTI 진짜 믿어야 함?',
    content: 'INFP라는데 사람들이 막 특징 말하는거 보면 그냥 바넘효과 아닌가 싶고... 근데 또 맞는 것도 있어서 신기하긴 함. 여러분은 MBTI 어떻게 생각하세요?',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    likes: 67,
    commentCount: 45,
    likedBy: [],
    tags: ['질문', 'MBTI', '토론']
  },
  {
    id: 'post-4',
    authorId: 'user-4',
    authorName: '익명',
    isAnonymous: true,
    category: 'daily',
    title: '혼자 영화관 처음 가봤는데',
    content: '원래 친구랑 같이 보러 가려다가 일정이 안 맞아서 혼자 갔는데\n생각보다 괜찮네요? 영화 끝나고 밥도 혼자 먹고 왔는데 자유롭고 좋았음\n혼자 밥 먹는거 창피한 줄 알았는데 아무도 신경 안 쓰더라구요 ㅋㅋ',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likes: 156,
    commentCount: 18,
    likedBy: [],
    tags: ['일상', '혼자', '영화']
  },
  {
    id: 'post-5',
    authorId: 'user-5',
    authorName: '익명',
    isAnonymous: true,
    category: 'support',
    title: '오늘 운전면허 실기 합격했습니다!!!',
    content: '3번 만에 드디어 붙었어요 ㅠㅠ 첫 번째는 긴장해서 출발도 못하고 떨어지고, 두 번째는 주차에서 탈락... 오늘은 떨지 말자 하고 마음 단단히 먹고 갔는데 합격! 너무 기쁘네요',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    likes: 234,
    commentCount: 41,
    likedBy: [],
    tags: ['합격', '축하', '운전면허']
  },
  {
    id: 'post-6',
    authorId: 'user-6',
    authorName: '익명',
    isAnonymous: true,
    category: 'worry',
    title: '친구한테 고민 털어놨더니 반응이 없음',
    content: '요즘 진짜 힘든 일 있어서 친한 친구한테 고민 얘기했는데 "아 그렇구나" 하고 끝... 조언까지는 바라지도 않았는데 최소한 공감이라도 해주면 좋았을텐데. 내가 너무 기대한건가? 서운하네요',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
    likes: 73,
    commentCount: 28,
    likedBy: [],
    tags: ['인간관계', '친구', '고민']
  },
  {
    id: 'post-7',
    authorId: 'user-7',
    authorName: '익명',
    isAnonymous: true,
    category: 'growth',
    title: '금연 100일 달성',
    content: '담배 끊은지 정확히 100일째입니다. 처음엔 진짜 미칠 것 같았는데 이제는 담배 생각도 안 나네요. 건강검진 결과도 좋아졌고 돈도 아끼고 일석이조! 금연 고민하시는 분들 힘내세요',
    timestamp: new Date(Date.now() - 15 * 60 * 60 * 1000),
    likes: 312,
    commentCount: 52,
    likedBy: [],
    tags: ['금연', '성장', '100일']
  },
  {
    id: 'post-8',
    authorId: 'user-8',
    authorName: '익명',
    isAnonymous: true,
    category: 'question',
    title: '명절에 친척들 질문 대처법 좀',
    content: '다음주 명절인데 벌써부터 스트레스... "취업은 했니?" "연애는?" "결혼은 언제?" 이런 질문들 어떻게 대답하시나요? 적당히 넘기는 센스있는 멘트 좀 알려주세요 ㅠ',
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
    likes: 198,
    commentCount: 67,
    likedBy: [],
    tags: ['명절', '질문', '스트레스']
  }
]

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'comment-1',
    postId: 'post-1',
    authorId: 'user-10',
    authorName: '익명',
    isAnonymous: true,
    content: 'ㅋㅋㅋ 퇴근 5분전 상사 얘기 진짜 공감 미쳤다',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    likes: 34,
    likedBy: []
  },
  {
    id: 'comment-2',
    postId: 'post-1',
    authorId: 'user-11',
    authorName: '익명',
    isAnonymous: true,
    content: '점심 먹으러 나가려는데 급한 일 생기는거 진짜... 오늘도 편의점 도시락',
    timestamp: new Date(Date.now() - 50 * 60 * 1000),
    likes: 28,
    likedBy: []
  },
  {
    id: 'comment-3',
    postId: 'post-2',
    authorId: 'user-12',
    authorName: '익명',
    isAnonymous: true,
    content: '저도 1년 걸렸어요... 포기하지 마세요 ㅠ 기회는 분명 옵니다',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    likes: 45,
    likedBy: []
  },
  {
    id: 'comment-4',
    postId: 'post-2',
    authorId: 'user-13',
    authorName: '익명',
    isAnonymous: true,
    content: '면접 긴장되는거 너무 공감... 집에서 친구한테 모의면접 연습해보는것도 도움됐어요',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 21,
    likedBy: []
  },
  {
    id: 'comment-5',
    postId: 'post-5',
    authorId: 'user-14',
    authorName: '익명',
    isAnonymous: true,
    content: '축하드려요!! 저도 3번 만에 붙었는데 그 기분 알아요 ㅎㅎ',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 12,
    likedBy: []
  }
]
