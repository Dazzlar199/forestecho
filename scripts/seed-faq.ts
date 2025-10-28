/**
 * FAQ 초기 데이터 생성 스크립트
 * 실행: npx ts-node scripts/seed-faq.ts
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

// Firebase 설정 (환경 변수에서 가져오기)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const faqs = [
  // 일반
  {
    category: '일반',
    question: '숲울림(MentalTouch)은 어떤 서비스인가요?',
    answer: '숲울림은 AI 기반 심리 상담 서비스입니다. 24시간 언제든지 편안하게 고민을 나누고, 전문적인 심리 분석과 맞춤형 조언을 받을 수 있습니다. 숲을 산책하듯 마음을 정리하는 공간입니다.',
    order: 0,
  },
  {
    category: '일반',
    question: '무료로 이용할 수 있나요?',
    answer: '네, 기본 상담 기능은 무료로 제공됩니다. 채팅 상담, 감정 기록, 일일 체크인, 자가진단 등 대부분의 기능을 무료로 이용하실 수 있습니다.',
    order: 1,
  },
  {
    category: '일반',
    question: '실제 전문 상담사와 연결되나요?',
    answer: '현재는 AI 기반 상담을 제공하고 있습니다. AI는 심리학 이론과 상담 기법을 학습하여 공감적이고 전문적인 대화를 제공합니다. 다만, 심각한 정신건강 문제가 있다면 반드시 전문 의료기관을 방문하시길 권장합니다.',
    order: 2,
  },
  {
    category: '일반',
    question: '제 대화 내용이 안전하게 보호되나요?',
    answer: '네, 모든 대화는 암호화되어 안전하게 저장됩니다. 본인만 자신의 대화 기록을 볼 수 있으며, 관리자도 개인 대화 내용에 접근할 수 없습니다. 개인정보 보호를 최우선으로 합니다.',
    order: 3,
  },

  // 계정
  {
    category: '계정',
    question: '회원가입은 어떻게 하나요?',
    answer: '이메일과 비밀번호로 간단하게 가입할 수 있습니다. 또는 Google 계정으로 빠르게 로그인할 수도 있습니다. 가입 후 바로 모든 기능을 이용하실 수 있습니다.',
    order: 4,
  },
  {
    category: '계정',
    question: '닉네임을 변경할 수 있나요?',
    answer: '네, 언제든지 변경 가능합니다. 우측 상단 프로필 메뉴 → "닉네임 변경"을 클릭하여 원하는 닉네임으로 변경하세요.',
    order: 5,
  },
  {
    category: '계정',
    question: '비밀번호를 잊어버렸어요.',
    answer: '로그인 페이지에서 "비밀번호를 잊으셨나요?" 링크를 클릭하세요. 가입한 이메일로 비밀번호 재설정 링크가 전송됩니다.',
    order: 6,
  },
  {
    category: '계정',
    question: '계정을 삭제하고 싶어요.',
    answer: '고객 지원 페이지에서 계정 삭제 요청을 남겨주세요. 요청 후 7일 이내에 모든 데이터가 영구 삭제됩니다.',
    order: 7,
  },

  // 상담 기능
  {
    category: '상담 기능',
    question: 'AI 상담은 어떻게 시작하나요?',
    answer: '로그인 후 메인 페이지의 채팅창에서 바로 대화를 시작할 수 있습니다. "안녕하세요"나 "오늘 기분이 안 좋아요" 같은 자유로운 대화로 시작해보세요.',
    order: 8,
  },
  {
    category: '상담 기능',
    question: '대화 내용이 저장되나요?',
    answer: '네, 모든 대화 세션이 자동으로 저장됩니다. "나의 숲" 페이지에서 이전 대화를 다시 볼 수 있고, 언제든지 이어서 대화할 수 있습니다.',
    order: 9,
  },
  {
    category: '상담 기능',
    question: '이전 대화를 삭제할 수 있나요?',
    answer: '네, "나의 숲" 페이지에서 각 대화 세션 옆의 삭제 버튼(🗑️)을 클릭하여 삭제할 수 있습니다. 삭제된 대화는 복구할 수 없으니 신중하게 결정해주세요.',
    order: 10,
  },
  {
    category: '상담 기능',
    question: 'AI가 이해하지 못하는 것 같아요.',
    answer: '구체적이고 명확하게 상황을 설명해주시면 더 정확한 답변을 받을 수 있습니다. 예를 들어 "힘들어요" 보다는 "직장에서 상사와의 갈등 때문에 스트레스를 받고 있어요"처럼 구체적으로 말씀해주세요.',
    order: 11,
  },

  // 기능 사용
  {
    category: '기능',
    question: '감정 기록은 어떻게 사용하나요?',
    answer: '"감정 기록" 메뉴에서 현재 감정을 선택하고, 간단한 메모를 남길 수 있습니다. 시간이 지나면 감정 변화를 차트로 확인하여 패턴을 파악할 수 있습니다.',
    order: 12,
  },
  {
    category: '기능',
    question: '일일 체크인은 무엇인가요?',
    answer: '매일 아침과 저녁에 간단한 질문에 답하며 하루를 돌아보는 기능입니다. 수면, 기분, 스트레스 등을 기록하여 생활 패턴을 파악하고 개선할 수 있습니다.',
    order: 13,
  },
  {
    category: '기능',
    question: '자가진단은 무엇을 측정하나요?',
    answer: '우울, 불안, 스트레스 등 다양한 심리 상태를 자가진단할 수 있습니다. 표준화된 심리검사 도구를 기반으로 하며, 결과는 참고용이므로 정확한 진단은 전문의와 상담하세요.',
    order: 14,
  },
  {
    category: '기능',
    question: '나의 숲에서는 무엇을 볼 수 있나요?',
    answer: '"나의 숲"에서는 모든 대화 기록, 심리 분석 결과, 감정 통계를 한눈에 볼 수 있습니다. 자신의 심리 상태 변화를 시각적으로 확인할 수 있습니다.',
    order: 15,
  },
  {
    category: '기능',
    question: '커뮤니티는 어떻게 사용하나요?',
    answer: '익명으로 고민을 공유하고, 비슷한 경험을 가진 사람들과 소통할 수 있는 공간입니다. 서로를 응원하고 위로하며 함께 성장해요. 다만, 개인정보는 절대 공유하지 마세요.',
    order: 16,
  },

  // 심리 분석
  {
    category: '심리 분석',
    question: '심리 분석은 어떻게 받나요?',
    answer: '대화를 나누다 보면 AI가 자동으로 심리 상태를 분석합니다. "나의 숲"에서 자세한 분석 결과를 확인할 수 있으며, 위험도, 회복 가능성, 맞춤 조언을 제공합니다.',
    order: 17,
  },
  {
    category: '심리 분석',
    question: '분석 결과가 정확한가요?',
    answer: '심리학 이론과 대규모 데이터를 기반으로 분석하지만, 참고용으로만 활용해주세요. 실제 진단은 전문 의료인만 할 수 있습니다. 심각한 증상이 있다면 반드시 병원을 방문하세요.',
    order: 18,
  },
  {
    category: '심리 분석',
    question: '위험도가 높게 나왔어요.',
    answer: '분석 결과 위험도가 높다면, 전문 상담이나 의료 지원을 받는 것을 강력히 권장합니다. 앱 내에서 추천 기관 정보를 확인하거나, 위기상담전화(1577-0199)로 즉시 연락하세요.',
    order: 19,
  },

  // 기술 문제
  {
    category: '기술 문제',
    question: '앱이 느리거나 오류가 발생해요.',
    answer: '브라우저 캐시를 삭제하거나, 페이지를 새로고침해보세요. 문제가 계속되면 고객 지원 페이지에서 상세한 오류 내용을 알려주세요. 빠르게 해결해드리겠습니다.',
    order: 20,
  },
  {
    category: '기술 문제',
    question: '모바일에서도 사용할 수 있나요?',
    answer: '네, 모바일 웹 브라우저에서 완벽하게 작동합니다. 별도의 앱 설치 없이 브라우저에서 접속하시면 됩니다. 향후 네이티브 앱도 출시 예정입니다.',
    order: 21,
  },
  {
    category: '기술 문제',
    question: '지원하는 브라우저는 무엇인가요?',
    answer: 'Chrome, Safari, Firefox, Edge 등 최신 브라우저를 모두 지원합니다. 최상의 경험을 위해 브라우저를 최신 버전으로 업데이트해주세요.',
    order: 22,
  },

  // 기타
  {
    category: '기타',
    question: '위기 상황에서는 어떻게 해야 하나요?',
    answer: '자살이나 자해 생각이 든다면 즉시 전문 도움을 받으세요.\n\n- 정신건강 위기상담: 1577-0199\n- 자살예방 상담전화: 1393\n- 청소년 상담전화: 1388\n- 응급상황: 119\n\n숲울림은 응급 상황에 대응할 수 없으니 반드시 전문 기관에 연락하세요.',
    order: 23,
  },
  {
    category: '기타',
    question: '서비스 개선 제안을 하고 싶어요.',
    answer: '고객 지원 페이지에서 "피드백" 유형으로 의견을 남겨주세요. 모든 제안을 검토하여 서비스 개선에 반영하고 있습니다. 소중한 의견 감사합니다!',
    order: 24,
  },
  {
    category: '기타',
    question: '버그를 발견했어요.',
    answer: '고객 지원 페이지에서 "버그 제보" 유형으로 상세한 내용을 알려주세요. 어떤 상황에서 발생했는지, 사용 중인 기기와 브라우저 정보를 함께 적어주시면 빠르게 해결할 수 있습니다.',
    order: 25,
  },
]

async function seedFAQs() {
  console.log('FAQ 데이터 생성 시작...')

  try {
    for (const faq of faqs) {
      await addDoc(collection(db, 'faqs'), {
        ...faq,
        createdAt: new Date(),
      })
      console.log(`✓ ${faq.question}`)
    }

    console.log(`\n완료! 총 ${faqs.length}개의 FAQ가 생성되었습니다.`)
  } catch (error) {
    console.error('오류 발생:', error)
  }
}

seedFAQs()
