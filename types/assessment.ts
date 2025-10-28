// 심리 테스트 & 자가진단 타입 정의

export type AssessmentType = 'phq9' | 'gad7' | 'stress'

export interface AssessmentQuestion {
  id: string
  text: { ko: string; en: string; ja: string; zh: string }
  options: Array<{
    value: number
    label: { ko: string; en: string; ja: string; zh: string }
  }>
}

export interface AssessmentResult {
  id: string
  userId: string
  assessmentType: AssessmentType
  score: number
  answers: Record<string, number>
  interpretation: {
    severity: 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe'
    message: { ko: string; en: string; ja: string; zh: string }
    color: string
  }
  timestamp: Date
}

// PHQ-9 (Patient Health Questionnaire-9) - 우울증 선별 도구
export const PHQ9_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'phq9_1',
    text: {
      ko: '일 또는 여가 활동을 하는 데 흥미나 즐거움을 느끼지 못함',
      en: 'Little interest or pleasure in doing things',
      ja: '物事に対してほとんど興味がない、または楽しめない',
      zh: '做事时很少有兴趣或乐趣'
    },
    options: [
      { value: 0, label: { ko: '전혀 아님', en: 'Not at all', ja: '全くない', zh: '完全没有' } },
      { value: 1, label: { ko: '며칠 동안', en: 'Several days', ja: '数日間', zh: '几天' } },
      { value: 2, label: { ko: '7일 이상', en: 'More than half the days', ja: '半分以上の日数', zh: '一半以上的天数' } },
      { value: 3, label: { ko: '거의 매일', en: 'Nearly every day', ja: 'ほぼ毎日', zh: '几乎每天' } },
    ]
  },
  {
    id: 'phq9_2',
    text: {
      ko: '기분이 가라앉거나, 우울하거나, 희망이 없다고 느낌',
      en: 'Feeling down, depressed, or hopeless',
      ja: '気分が落ち込む、憂鬱になる、または絶望的な気持ちになる',
      zh: '感到沮丧、抑郁或绝望'
    },
    options: [
      { value: 0, label: { ko: '전혀 아님', en: 'Not at all', ja: '全くない', zh: '完全没有' } },
      { value: 1, label: { ko: '며칠 동안', en: 'Several days', ja: '数日間', zh: '几天' } },
      { value: 2, label: { ko: '7일 이상', en: 'More than half the days', ja: '半分以上の日数', zh: '一半以上的天数' } },
      { value: 3, label: { ko: '거의 매일', en: 'Nearly every day', ja: 'ほぼ毎日', zh: '几乎每天' } },
    ]
  },
  {
    id: 'phq9_3',
    text: {
      ko: '잠들기 어렵거나 자주 깨거나 또는 너무 많이 잠',
      en: 'Trouble falling or staying asleep, or sleeping too much',
      ja: '寝つきが悪い、途中で目が覚める、または寝すぎる',
      zh: '入睡困难、睡眠中断或睡眠过多'
    },
    options: [
      { value: 0, label: { ko: '전혀 아님', en: 'Not at all', ja: '全くない', zh: '完全没有' } },
      { value: 1, label: { ko: '며칠 동안', en: 'Several days', ja: '数日間', zh: '几天' } },
      { value: 2, label: { ko: '7일 이상', en: 'More than half the days', ja: '半分以上の日数', zh: '一半以上的天数' } },
      { value: 3, label: { ko: '거의 매일', en: 'Nearly every day', ja: 'ほぼ毎日', zh: '几乎每天' } },
    ]
  },
  {
    id: 'phq9_4',
    text: {
      ko: '피곤하다고 느끼거나 기력이 거의 없음',
      en: 'Feeling tired or having little energy',
      ja: '疲れた感じがする、または気力がほとんどない',
      zh: '感到疲倦或几乎没有精力'
    },
    options: [
      { value: 0, label: { ko: '전혀 아님', en: 'Not at all', ja: '全くない', zh: '完全没有' } },
      { value: 1, label: { ko: '며칠 동안', en: 'Several days', ja: '数日間', zh: '几天' } },
      { value: 2, label: { ko: '7일 이상', en: 'More than half the days', ja: '半分以上の日数', zh: '一半以上的天数' } },
      { value: 3, label: { ko: '거의 매일', en: 'Nearly every day', ja: 'ほぼ毎日', zh: '几乎每天' } },
    ]
  },
  {
    id: 'phq9_5',
    text: {
      ko: '식욕이 없거나 과식을 함',
      en: 'Poor appetite or overeating',
      ja: '食欲がない、または過食する',
      zh: '食欲不振或暴饮暴食'
    },
    options: [
      { value: 0, label: { ko: '전혀 아님', en: 'Not at all', ja: '全くない', zh: '完全没有' } },
      { value: 1, label: { ko: '며칠 동안', en: 'Several days', ja: '数日間', zh: '几天' } },
      { value: 2, label: { ko: '7일 이상', en: 'More than half the days', ja: '半分以上の日数', zh: '一半以上的天数' } },
      { value: 3, label: { ko: '거의 매일', en: 'Nearly every day', ja: 'ほぼ毎日', zh: '几乎每天' } },
    ]
  },
  {
    id: 'phq9_6',
    text: {
      ko: '자신이 실패자라고 느끼거나 자신 또는 가족을 실망시켰다고 느낌',
      en: 'Feeling bad about yourself - or that you are a failure or have let yourself or your family down',
      ja: '自分はダメな人間だ、失敗者だと感じる、または自分自身や家族を失望させたと感じる',
      zh: '觉得自己很糟糕——或者觉得自己是个失败者，或让自己或家人失望'
    },
    options: [
      { value: 0, label: { ko: '전혀 아님', en: 'Not at all', ja: '全くない', zh: '完全没有' } },
      { value: 1, label: { ko: '며칠 동안', en: 'Several days', ja: '数日間', zh: '几天' } },
      { value: 2, label: { ko: '7일 이상', en: 'More than half the days', ja: '半分以上の日数', zh: '一半以上的天数' } },
      { value: 3, label: { ko: '거의 매일', en: 'Nearly every day', ja: 'ほぼ毎日', zh: '几乎每天' } },
    ]
  },
  {
    id: 'phq9_7',
    text: {
      ko: '신문을 읽거나 TV를 보는 것과 같은 일에 집중하기 어려움',
      en: 'Trouble concentrating on things, such as reading the newspaper or watching television',
      ja: '新聞を読んだりテレビを見たりすることに集中するのが難しい',
      zh: '难以集中精力做事，例如阅读报纸或看电视'
    },
    options: [
      { value: 0, label: { ko: '전혀 아님', en: 'Not at all', ja: '全くない', zh: '完全没有' } },
      { value: 1, label: { ko: '며칠 동안', en: 'Several days', ja: '数日間', zh: '几天' } },
      { value: 2, label: { ko: '7일 이상', en: 'More than half the days', ja: '半分以上の日数', zh: '一半以上的天数' } },
      { value: 3, label: { ko: '거의 매일', en: 'Nearly every day', ja: 'ほぼ毎日', zh: '几乎每天' } },
    ]
  },
  {
    id: 'phq9_8',
    text: {
      ko: '다른 사람들이 알아챌 정도로 너무 느리게 움직이거나 말을 함. 또는 반대로 너무 안절부절 못하거나 들떠서 평소보다 많이 돌아다님',
      en: 'Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual',
      ja: '他の人が気づくほどゆっくりと動いたり話したりする。または反対に、そわそわして落ち着きがなく、普段より多く動き回っている',
      zh: '动作或说话缓慢到别人都注意到了。或者相反——坐立不安或烦躁，以至于比平时走动得更多'
    },
    options: [
      { value: 0, label: { ko: '전혀 아님', en: 'Not at all', ja: '全くない', zh: '完全没有' } },
      { value: 1, label: { ko: '며칠 동안', en: 'Several days', ja: '数日間', zh: '几天' } },
      { value: 2, label: { ko: '7일 이상', en: 'More than half the days', ja: '半分以上の日数', zh: '一半以上的天数' } },
      { value: 3, label: { ko: '거의 매일', en: 'Nearly every day', ja: 'ほぼ毎日', zh: '几乎每天' } },
    ]
  },
  {
    id: 'phq9_9',
    text: {
      ko: '자신이 죽는 것이 더 낫다고 생각하거나 자신을 해칠 생각을 함',
      en: 'Thoughts that you would be better off dead, or of hurting yourself',
      ja: '死んだ方がましだと思う、または自分を傷つけることを考える',
      zh: '想到死了更好，或想过伤害自己'
    },
    options: [
      { value: 0, label: { ko: '전혀 아님', en: 'Not at all', ja: '全くない', zh: '完全没有' } },
      { value: 1, label: { ko: '며칠 동안', en: 'Several days', ja: '数日間', zh: '几天' } },
      { value: 2, label: { ko: '7일 이상', en: 'More than half the days', ja: '半分以上の日数', zh: '一半以上的天数' } },
      { value: 3, label: { ko: '거의 매일', en: 'Nearly every day', ja: 'ほぼ毎日', zh: '几乎每天' } },
    ]
  },
]

// GAD-7 (Generalized Anxiety Disorder-7) - 범불안장애 선별 도구
export const GAD7_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'gad7_1',
    text: {
      ko: '초조하거나 불안하거나 조마조마하게 느낌',
      en: 'Feeling nervous, anxious, or on edge',
      ja: '緊張感、不安感、神経過敏を感じる',
      zh: '感到紧张、焦虑或不安'
    },
    options: [
      { value: 0, label: { ko: '전혀 아님', en: 'Not at all', ja: '全くない', zh: '完全没有' } },
      { value: 1, label: { ko: '며칠 동안', en: 'Several days', ja: '数日間', zh: '几天' } },
      { value: 2, label: { ko: '7일 이상', en: 'More than half the days', ja: '半分以上の日数', zh: '一半以上的天数' } },
      { value: 3, label: { ko: '거의 매일', en: 'Nearly every day', ja: 'ほぼ毎日', zh: '几乎每天' } },
    ]
  },
  {
    id: 'gad7_2',
    text: {
      ko: '걱정하는 것을 멈추거나 조절할 수 없음',
      en: 'Not being able to stop or control worrying',
      ja: '心配するのを止められない、またはコントロールできない',
      zh: '无法停止或控制担忧'
    },
    options: [
      { value: 0, label: { ko: '전혀 아님', en: 'Not at all', ja: '全くない', zh: '完全没有' } },
      { value: 1, label: { ko: '며칠 동안', en: 'Several days', ja: '数日間', zh: '几天' } },
      { value: 2, label: { ko: '7일 이상', en: 'More than half the days', ja: '半分以上の日数', zh: '一半以上的天数' } },
      { value: 3, label: { ko: '거의 매일', en: 'Nearly every day', ja: 'ほぼ毎日', zh: '几乎每天' } },
    ]
  },
  {
    id: 'gad7_3',
    text: {
      ko: '여러 가지 것들에 대해 너무 많이 걱정함',
      en: 'Worrying too much about different things',
      ja: 'いろいろなことについて心配しすぎる',
      zh: '对不同的事情过度担忧'
    },
    options: [
      { value: 0, label: { ko: '전혀 아님', en: 'Not at all', ja: '全くない', zh: '完全没有' } },
      { value: 1, label: { ko: '며칠 동안', en: 'Several days', ja: '数日間', zh: '几天' } },
      { value: 2, label: { ko: '7일 이상', en: 'More than half the days', ja: '半分以上の日数', zh: '一半以上的天数' } },
      { value: 3, label: { ko: '거의 매일', en: 'Nearly every day', ja: 'ほぼ毎日', zh: '几乎每天' } },
    ]
  },
  {
    id: 'gad7_4',
    text: {
      ko: '편하게 있기가 어려움',
      en: 'Trouble relaxing',
      ja: 'リラックスするのが難しい',
      zh: '难以放松'
    },
    options: [
      { value: 0, label: { ko: '전혀 아님', en: 'Not at all', ja: '全くない', zh: '完全没有' } },
      { value: 1, label: { ko: '며칠 동안', en: 'Several days', ja: '数日間', zh: '几天' } },
      { value: 2, label: { ko: '7일 이상', en: 'More than half the days', ja: '半分以上の日数', zh: '一半以上的天数' } },
      { value: 3, label: { ko: '거의 매일', en: 'Nearly every day', ja: 'ほぼ毎日', zh: '几乎每天' } },
    ]
  },
  {
    id: 'gad7_5',
    text: {
      ko: '너무 안절부절 못해서 가만히 있기 힘듦',
      en: 'Being so restless that it is hard to sit still',
      ja: 'そわそわして、じっとしているのが難しい',
      zh: '坐立不安，难以安坐'
    },
    options: [
      { value: 0, label: { ko: '전혀 아님', en: 'Not at all', ja: '全くない', zh: '完全没有' } },
      { value: 1, label: { ko: '며칠 동안', en: 'Several days', ja: '数日間', zh: '几天' } },
      { value: 2, label: { ko: '7일 이상', en: 'More than half the days', ja: '半分以上の日数', zh: '一半以上的天数' } },
      { value: 3, label: { ko: '거의 매일', en: 'Nearly every day', ja: 'ほぼ毎日', zh: '几乎每天' } },
    ]
  },
  {
    id: 'gad7_6',
    text: {
      ko: '쉽게 짜증이 나거나 과민해짐',
      en: 'Becoming easily annoyed or irritable',
      ja: '簡単にイライラしたり、怒りっぽくなる',
      zh: '容易烦躁或易怒'
    },
    options: [
      { value: 0, label: { ko: '전혀 아님', en: 'Not at all', ja: '全くない', zh: '完全没有' } },
      { value: 1, label: { ko: '며칠 동안', en: 'Several days', ja: '数日間', zh: '几天' } },
      { value: 2, label: { ko: '7일 이상', en: 'More than half the days', ja: '半分以上の日数', zh: '一半以上的天数' } },
      { value: 3, label: { ko: '거의 매일', en: 'Nearly every day', ja: 'ほぼ毎日', zh: '几乎每天' } },
    ]
  },
  {
    id: 'gad7_7',
    text: {
      ko: '마치 끔찍한 일이 일어날 것 같은 두려움을 느낌',
      en: 'Feeling afraid, as if something awful might happen',
      ja: '何か恐ろしいことが起こるかもしれないという恐怖を感じる',
      zh: '感到害怕，好像会发生可怕的事情'
    },
    options: [
      { value: 0, label: { ko: '전혀 아님', en: 'Not at all', ja: '全くない', zh: '完全没有' } },
      { value: 1, label: { ko: '며칠 동안', en: 'Several days', ja: '数日間', zh: '几天' } },
      { value: 2, label: { ko: '7일 이상', en: 'More than half the days', ja: '半分以上の日数', zh: '一半以上的天数' } },
      { value: 3, label: { ko: '거의 매일', en: 'Nearly every day', ja: 'ほぼ毎日', zh: '几乎每天' } },
    ]
  },
]

// 스트레스 척도 (Perceived Stress Scale - 간소화 버전)
export const STRESS_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'stress_1',
    text: {
      ko: '예상치 못한 일 때문에 당황한 적이 있음',
      en: 'Been upset because of something that happened unexpectedly',
      ja: '予期しないことで動揺したことがある',
      zh: '因意外发生的事情而感到不安'
    },
    options: [
      { value: 0, label: { ko: '전혀 없음', en: 'Never', ja: '全くない', zh: '从未' } },
      { value: 1, label: { ko: '거의 없음', en: 'Almost never', ja: 'ほとんどない', zh: '几乎没有' } },
      { value: 2, label: { ko: '가끔', en: 'Sometimes', ja: '時々', zh: '有时' } },
      { value: 3, label: { ko: '자주', en: 'Fairly often', ja: 'かなり頻繁に', zh: '经常' } },
      { value: 4, label: { ko: '매우 자주', en: 'Very often', ja: '非常に頻繁に', zh: '非常频繁' } },
    ]
  },
  {
    id: 'stress_2',
    text: {
      ko: '중요한 일들을 조절할 수 없다고 느낌',
      en: 'Felt that you were unable to control the important things in your life',
      ja: '人生の重要なことをコントロールできないと感じた',
      zh: '感觉无法控制生活中的重要事情'
    },
    options: [
      { value: 0, label: { ko: '전혀 없음', en: 'Never', ja: '全くない', zh: '从未' } },
      { value: 1, label: { ko: '거의 없음', en: 'Almost never', ja: 'ほとんどない', zh: '几乎没有' } },
      { value: 2, label: { ko: '가끔', en: 'Sometimes', ja: '時々', zh: '有时' } },
      { value: 3, label: { ko: '자주', en: 'Fairly often', ja: 'かなり頻繁に', zh: '经常' } },
      { value: 4, label: { ko: '매우 자주', en: 'Very often', ja: '非常に頻繁に', zh: '非常频繁' } },
    ]
  },
  {
    id: 'stress_3',
    text: {
      ko: '신경이 예민하고 스트레스를 받았다고 느낌',
      en: 'Felt nervous and stressed',
      ja: '神経質でストレスを感じた',
      zh: '感到紧张和压力'
    },
    options: [
      { value: 0, label: { ko: '전혀 없음', en: 'Never', ja: '全くない', zh: '从未' } },
      { value: 1, label: { ko: '거의 없음', en: 'Almost never', ja: 'ほとんどない', zh: '几乎没有' } },
      { value: 2, label: { ko: '가끔', en: 'Sometimes', ja: '時々', zh: '有时' } },
      { value: 3, label: { ko: '자주', en: 'Fairly often', ja: 'かなり頻繁に', zh: '经常' } },
      { value: 4, label: { ko: '매우 자주', en: 'Very often', ja: '非常に頻繁に', zh: '非常频繁' } },
    ]
  },
  {
    id: 'stress_4',
    text: {
      ko: '개인적인 문제들을 다루는 데 자신감이 있음',
      en: 'Felt confident about your ability to handle your personal problems',
      ja: '個人的な問題を処理する能力に自信があった',
      zh: '对处理个人问题的能力有信心'
    },
    options: [
      { value: 4, label: { ko: '전혀 없음', en: 'Never', ja: '全くない', zh: '从未' } },
      { value: 3, label: { ko: '거의 없음', en: 'Almost never', ja: 'ほとんどない', zh: '几乎没有' } },
      { value: 2, label: { ko: '가끔', en: 'Sometimes', ja: '時々', zh: '有时' } },
      { value: 1, label: { ko: '자주', en: 'Fairly often', ja: 'かなり頻繁に', zh: '经常' } },
      { value: 0, label: { ko: '매우 자주', en: 'Very often', ja: '非常に頻繁に', zh: '非常频繁' } },
    ]
  },
  {
    id: 'stress_5',
    text: {
      ko: '일들이 자신의 뜻대로 진행되고 있다고 느낌',
      en: 'Felt that things were going your way',
      ja: '物事が自分の思い通りに進んでいると感じた',
      zh: '感觉事情按照自己的意愿进行'
    },
    options: [
      { value: 4, label: { ko: '전혀 없음', en: 'Never', ja: '全くない', zh: '从未' } },
      { value: 3, label: { ko: '거의 없음', en: 'Almost never', ja: 'ほとんどない', zh: '几乎没有' } },
      { value: 2, label: { ko: '가끔', en: 'Sometimes', ja: '時々', zh: '有时' } },
      { value: 1, label: { ko: '자주', en: 'Fairly often', ja: 'かなり頻繁に', zh: '经常' } },
      { value: 0, label: { ko: '매우 자주', en: 'Very often', ja: '非常に頻繁に', zh: '非常频繁' } },
    ]
  },
  {
    id: 'stress_6',
    text: {
      ko: '해야 할 일들을 처리할 수 없다고 느낌',
      en: 'Found that you could not cope with all the things that you had to do',
      ja: 'やるべきことすべてに対処できないと感じた',
      zh: '发现无法应对所有必须做的事情'
    },
    options: [
      { value: 0, label: { ko: '전혀 없음', en: 'Never', ja: '全くない', zh: '从未' } },
      { value: 1, label: { ko: '거의 없음', en: 'Almost never', ja: 'ほとんどない', zh: '几乎没有' } },
      { value: 2, label: { ko: '가끔', en: 'Sometimes', ja: '時々', zh: '有时' } },
      { value: 3, label: { ko: '자주', en: 'Fairly often', ja: 'かなり頻繁に', zh: '经常' } },
      { value: 4, label: { ko: '매우 자주', en: 'Very often', ja: '非常に頻繁に', zh: '非常频繁' } },
    ]
  },
  {
    id: 'stress_7',
    text: {
      ko: '일상의 짜증스러운 일들을 조절할 수 있었음',
      en: 'Been able to control irritations in your life',
      ja: '日常のイライラをコントロールできた',
      zh: '能够控制生活中令人烦躁的事情'
    },
    options: [
      { value: 4, label: { ko: '전혀 없음', en: 'Never', ja: '全くない', zh: '从未' } },
      { value: 3, label: { ko: '거의 없음', en: 'Almost never', ja: 'ほとんどない', zh: '几乎没有' } },
      { value: 2, label: { ko: '가끔', en: 'Sometimes', ja: '時々', zh: '有时' } },
      { value: 1, label: { ko: '자주', en: 'Fairly often', ja: 'かなり頻繁に', zh: '经常' } },
      { value: 0, label: { ko: '매우 자주', en: 'Very often', ja: '非常に頻繁に', zh: '非常频繁' } },
    ]
  },
  {
    id: 'stress_8',
    text: {
      ko: '모든 것을 감당할 수 있다고 느낌',
      en: 'Felt that you were on top of things',
      ja: 'すべてのことをうまく処理できていると感じた',
      zh: '感觉能掌控一切'
    },
    options: [
      { value: 4, label: { ko: '전혀 없음', en: 'Never', ja: '全くない', zh: '从未' } },
      { value: 3, label: { ko: '거의 없음', en: 'Almost never', ja: 'ほとんどない', zh: '几乎没有' } },
      { value: 2, label: { ko: '가끔', en: 'Sometimes', ja: '時々', zh: '有时' } },
      { value: 1, label: { ko: '자주', en: 'Fairly often', ja: 'かなり頻繁に', zh: '经常' } },
      { value: 0, label: { ko: '매우 자주', en: 'Very often', ja: '非常に頻繁に', zh: '非常频繁' } },
    ]
  },
  {
    id: 'stress_9',
    text: {
      ko: '통제할 수 없는 일들 때문에 화가 났음',
      en: 'Been angered because of things that were outside of your control',
      ja: 'コントロールできないことにイライラした',
      zh: '因无法控制的事情而生气'
    },
    options: [
      { value: 0, label: { ko: '전혀 없음', en: 'Never', ja: '全くない', zh: '从未' } },
      { value: 1, label: { ko: '거의 없음', en: 'Almost never', ja: 'ほとんどない', zh: '几乎没有' } },
      { value: 2, label: { ko: '가끔', en: 'Sometimes', ja: '時々', zh: '有时' } },
      { value: 3, label: { ko: '자주', en: 'Fairly often', ja: 'かなり頻繁に', zh: '经常' } },
      { value: 4, label: { ko: '매우 자주', en: 'Very often', ja: '非常に頻繁に', zh: '非常频繁' } },
    ]
  },
  {
    id: 'stress_10',
    text: {
      ko: '어려움이 너무 많이 쌓여서 극복할 수 없다고 느낌',
      en: 'Felt difficulties were piling up so high that you could not overcome them',
      ja: '困難が積み重なりすぎて克服できないと感じた',
      zh: '感觉困难堆积如山，无法克服'
    },
    options: [
      { value: 0, label: { ko: '전혀 없음', en: 'Never', ja: '全くない', zh: '从未' } },
      { value: 1, label: { ko: '거의 없음', en: 'Almost never', ja: 'ほとんどない', zh: '几乎没有' } },
      { value: 2, label: { ko: '가끔', en: 'Sometimes', ja: '時々', zh: '有时' } },
      { value: 3, label: { ko: '자주', en: 'Fairly often', ja: 'かなり頻繁に', zh: '经常' } },
      { value: 4, label: { ko: '매우 자주', en: 'Very often', ja: '非常に頻繁に', zh: '非常频繁' } },
    ]
  },
]

// 점수 해석 함수
export function interpretPHQ9(score: number) {
  if (score <= 4) {
    return {
      severity: 'minimal' as const,
      message: {
        ko: '최소 수준의 우울 증상입니다. 현재 상태를 잘 유지하세요.',
        en: 'Minimal depression. Keep maintaining your current state.',
        ja: '最小限の抑うつ症状です。現在の状態を維持してください。',
        zh: '轻微的抑郁症状。保持目前的状态。'
      },
      color: '#10b981'
    }
  } else if (score <= 9) {
    return {
      severity: 'mild' as const,
      message: {
        ko: '가벼운 우울 증상입니다. 자기 관리와 스트레스 관리를 권장합니다.',
        en: 'Mild depression. Self-care and stress management are recommended.',
        ja: '軽度の抑うつ症状です。セルフケアとストレス管理をお勧めします。',
        zh: '轻度抑郁。建议自我护理和压力管理。'
      },
      color: '#fbbf24'
    }
  } else if (score <= 14) {
    return {
      severity: 'moderate' as const,
      message: {
        ko: '중간 수준의 우울 증상입니다. 전문가 상담을 고려해보세요.',
        en: 'Moderate depression. Consider professional counseling.',
        ja: '中程度の抑うつ症状です。専門家への相談を検討してください。',
        zh: '中度抑郁。考虑寻求专业咨询。'
      },
      color: '#f97316'
    }
  } else if (score <= 19) {
    return {
      severity: 'moderately_severe' as const,
      message: {
        ko: '중등도에서 심한 우울 증상입니다. 전문가 상담이 권장됩니다.',
        en: 'Moderately severe depression. Professional help is recommended.',
        ja: '中等度から重度の抑うつ症状です。専門家の助けが推奨されます。',
        zh: '中重度抑郁。建议寻求专业帮助。'
      },
      color: '#ef4444'
    }
  } else {
    return {
      severity: 'severe' as const,
      message: {
        ko: '심한 우울 증상입니다. 즉시 전문가의 도움을 받으시기 바랍니다.',
        en: 'Severe depression. Please seek immediate professional help.',
        ja: '重度の抑うつ症状です。すぐに専門家の助けを求めてください。',
        zh: '严重抑郁。请立即寻求专业帮助。'
      },
      color: '#dc2626'
    }
  }
}

export function interpretGAD7(score: number) {
  if (score <= 4) {
    return {
      severity: 'minimal' as const,
      message: {
        ko: '최소 수준의 불안 증상입니다. 현재 상태를 잘 유지하세요.',
        en: 'Minimal anxiety. Keep maintaining your current state.',
        ja: '最小限の不安症状です。現在の状態を維持してください。',
        zh: '轻微的焦虑症状。保持目前的状态。'
      },
      color: '#10b981'
    }
  } else if (score <= 9) {
    return {
      severity: 'mild' as const,
      message: {
        ko: '가벼운 불안 증상입니다. 이완 기법과 스트레스 관리를 실천해보세요.',
        en: 'Mild anxiety. Practice relaxation techniques and stress management.',
        ja: '軽度の不安症状です。リラクゼーション技法とストレス管理を実践してください。',
        zh: '轻度焦虑。练习放松技巧和压力管理。'
      },
      color: '#fbbf24'
    }
  } else if (score <= 14) {
    return {
      severity: 'moderate' as const,
      message: {
        ko: '중간 수준의 불안 증상입니다. 전문가 상담을 고려해보세요.',
        en: 'Moderate anxiety. Consider professional counseling.',
        ja: '中程度の不安症状です。専門家への相談を検討してください。',
        zh: '中度焦虑。考虑寻求专业咨询。'
      },
      color: '#f97316'
    }
  } else {
    return {
      severity: 'severe' as const,
      message: {
        ko: '심한 불안 증상입니다. 전문가의 도움을 받으시기 바랍니다.',
        en: 'Severe anxiety. Please seek professional help.',
        ja: '重度の不安症状です。専門家の助けを求めてください。',
        zh: '严重焦虑。请寻求专业帮助。'
      },
      color: '#dc2626'
    }
  }
}

export function interpretStress(score: number) {
  if (score <= 13) {
    return {
      severity: 'minimal' as const,
      message: {
        ko: '낮은 수준의 스트레스입니다. 현재 스트레스 관리를 잘 하고 있습니다.',
        en: 'Low stress. You are managing stress well.',
        ja: '低いストレスレベルです。ストレス管理がうまくいっています。',
        zh: '低压力水平。你正在很好地管理压力。'
      },
      color: '#10b981'
    }
  } else if (score <= 26) {
    return {
      severity: 'moderate' as const,
      message: {
        ko: '중간 수준의 스트레스입니다. 스트레스 관리 기법을 실천해보세요.',
        en: 'Moderate stress. Practice stress management techniques.',
        ja: '中程度のストレスです。ストレス管理技法を実践してください。',
        zh: '中等压力水平。练习压力管理技巧。'
      },
      color: '#f97316'
    }
  } else {
    return {
      severity: 'severe' as const,
      message: {
        ko: '높은 수준의 스트레스입니다. 휴식과 전문가 상담을 권장합니다.',
        en: 'High stress. Rest and professional consultation are recommended.',
        ja: '高いストレスレベルです。休息と専門家への相談をお勧めします。',
        zh: '高压力水平。建议休息并咨询专业人士。'
      },
      color: '#dc2626'
    }
  }
}
