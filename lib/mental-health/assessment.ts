/**
 * 정신 건강 초기 평가 시스템
 * PHQ-2 (우울) + GAD-2 (불안) 기반
 */

import type { AssessmentQuestion, InitialAssessment } from '@/types/mental-health'

// PHQ-2 + GAD-2 질문 (총 4문항)
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'phq1',
    question: {
      ko: '지난 2주 동안, 기분이 가라앉거나 우울하거나 희망이 없다고 느낀 적이 얼마나 자주 있었나요?',
      en: 'Over the past 2 weeks, how often have you felt down, depressed, or hopeless?',
      ja: '過去2週間で、気分が落ち込んだり、憂鬱になったり、絶望的だと感じたことはどのくらいありましたか？',
      zh: '在过去2周内，您有多频繁地感到情绪低落、沮丧或绝望？',
    },
    options: [
      {
        value: 0,
        label: {
          ko: '전혀 없음',
          en: 'Not at all',
          ja: '全くない',
          zh: '完全没有',
        },
      },
      {
        value: 1,
        label: {
          ko: '며칠 동안',
          en: 'Several days',
          ja: '数日',
          zh: '几天',
        },
      },
      {
        value: 2,
        label: {
          ko: '7일 이상',
          en: 'More than half the days',
          ja: '半分以上の日',
          zh: '超过一半的日子',
        },
      },
      {
        value: 3,
        label: {
          ko: '거의 매일',
          en: 'Nearly every day',
          ja: 'ほぼ毎日',
          zh: '几乎每天',
        },
      },
    ],
  },
  {
    id: 'phq2',
    question: {
      ko: '지난 2주 동안, 평소 즐기던 일에 흥미나 즐거움을 느끼지 못한 적이 얼마나 자주 있었나요?',
      en: 'Over the past 2 weeks, how often have you had little interest or pleasure in doing things?',
      ja: '過去2週間で、物事に対する興味や喜びをほとんど感じなかったことはどのくらいありましたか？',
      zh: '在过去2周内，您有多频繁地对做事情几乎没有兴趣或快乐？',
    },
    options: [
      { value: 0, label: { ko: '전혀 없음', en: 'Not at all', ja: '全くない', zh: '完全没有' } },
      { value: 1, label: { ko: '며칠 동안', en: 'Several days', ja: '数日', zh: '几天' } },
      { value: 2, label: { ko: '7일 이상', en: 'More than half the days', ja: '半分以上の日', zh: '超过一半的日子' } },
      { value: 3, label: { ko: '거의 매일', en: 'Nearly every day', ja: 'ほぼ毎日', zh: '几乎每天' } },
    ],
  },
  {
    id: 'gad1',
    question: {
      ko: '지난 2주 동안, 불안하거나 초조하거나 긴장된 느낌이 얼마나 자주 있었나요?',
      en: 'Over the past 2 weeks, how often have you felt nervous, anxious, or on edge?',
      ja: '過去2週間で、神経質になったり、不安になったり、緊張したりすることはどのくらいありましたか？',
      zh: '在过去2周内，您有多频繁地感到紧张、焦虑或不安？',
    },
    options: [
      { value: 0, label: { ko: '전혀 없음', en: 'Not at all', ja: '全くない', zh: '完全没有' } },
      { value: 1, label: { ko: '며칠 동안', en: 'Several days', ja: '数日', zh: '几天' } },
      { value: 2, label: { ko: '7일 이상', en: 'More than half the days', ja: '半分以上の日', zh: '超过一半的日子' } },
      { value: 3, label: { ko: '거의 매일', en: 'Nearly every day', ja: 'ほぼ毎日', zh: '几乎每天' } },
    ],
  },
  {
    id: 'gad2',
    question: {
      ko: '지난 2주 동안, 걱정을 멈추거나 조절할 수 없다고 느낀 적이 얼마나 자주 있었나요?',
      en: 'Over the past 2 weeks, how often have you been unable to stop or control worrying?',
      ja: '過去2週間で、心配を止めたりコントロールしたりできないと感じたことはどのくらいありましたか？',
      zh: '在过去2周内，您有多频繁地无法停止或控制担忧？',
    },
    options: [
      { value: 0, label: { ko: '전혀 없음', en: 'Not at all', ja: '全くない', zh: '完全没有' } },
      { value: 1, label: { ko: '며칠 동안', en: 'Several days', ja: '数日', zh: '几天' } },
      { value: 2, label: { ko: '7일 이상', en: 'More than half the days', ja: '半分以上の日', zh: '超过一半的日子' } },
      { value: 3, label: { ko: '거의 매일', en: 'Nearly every day', ja: 'ほぼ毎日', zh: '几乎每天' } },
    ],
  },
]

/**
 * 평가 점수를 건강도 점수로 변환 (0-12 → 0-100)
 * 점수가 낮을수록 건강함
 */
export function convertToHealthScore(totalScore: number): number {
  // 0점 = 100 (완전 건강)
  // 12점 = 0 (매우 힘듦)
  // 비선형 변환: 초기에는 완만하게, 중증으로 갈수록 가파르게

  if (totalScore === 0) return 100
  if (totalScore <= 2) return 85 - (totalScore * 5)
  if (totalScore <= 4) return 70 - ((totalScore - 2) * 10)
  if (totalScore <= 6) return 50 - ((totalScore - 4) * 10)
  if (totalScore <= 9) return 30 - ((totalScore - 6) * 7)
  return 10 - ((totalScore - 9) * 3)
}

/**
 * 초기 평가 생성
 */
export function createInitialAssessment(
  phq2Score: number,
  gad2Score: number
): InitialAssessment {
  const totalScore = phq2Score + gad2Score
  const initialHealthScore = convertToHealthScore(totalScore)

  return {
    date: new Date(),
    phq2Score,
    gad2Score,
    totalScore,
    initialHealthScore,
  }
}

/**
 * 평가 결과 해석
 */
export function getAssessmentInterpretation(totalScore: number) {
  return {
    ko: {
      level: totalScore <= 2 ? '양호' : totalScore <= 5 ? '주의' : totalScore <= 8 ? '경계' : '심각',
      message:
        totalScore <= 2
          ? '현재 정신 건강 상태가 양호합니다. 계속 긍정적으로 유지하세요.'
          : totalScore <= 5
          ? '약간의 스트레스나 불안이 있습니다. 대화를 통해 관리해보세요.'
          : totalScore <= 8
          ? '주의가 필요한 상태입니다. 전문적인 대화가 도움이 될 수 있습니다.'
          : '전문가의 도움이 필요할 수 있습니다. 1577-0199 (정신건강 위기상담)에 연락하는 것을 권장합니다.',
    },
    en: {
      level: totalScore <= 2 ? 'Good' : totalScore <= 5 ? 'Fair' : totalScore <= 8 ? 'Concerning' : 'Severe',
      message:
        totalScore <= 2
          ? 'Your mental health is in good condition. Keep it up!'
          : totalScore <= 5
          ? 'Some stress or anxiety detected. Talking may help manage it.'
          : totalScore <= 8
          ? 'Your condition needs attention. Professional conversation may help.'
          : 'Professional help may be needed. Consider contacting crisis support.',
    },
  }
}
