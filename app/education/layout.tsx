import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '심리 교육 | 숲울림 - 정신건강 정보',
  description: '우울증, 불안장애, 스트레스 관리, 감정 조절 등 신뢰할 수 있는 정신건강 정보를 제공합니다. WHO, NIMH, Mayo Clinic 등 전문 기관의 자료를 바탕으로 작성되었습니다.',
  keywords: [
    '심리교육',
    '정신건강',
    '우울증',
    '불안장애',
    '스트레스 관리',
    '감정 조절',
    '심리상담',
    '멘탈케어',
    '정신건강 정보',
    '심리치료',
    '마음건강',
    '청소년 정신건강',
    '직장 스트레스',
    '대인관계',
    '자기돌봄',
  ],
  openGraph: {
    title: '심리 교육 | 숲울림',
    description: '신뢰할 수 있는 정신건강 정보 - 우울증, 불안장애, 스트레스 관리 가이드',
    type: 'website',
    url: 'https://forestecho.app/education',
    siteName: '숲울림',
  },
  twitter: {
    card: 'summary_large_image',
    title: '심리 교육 | 숲울림',
    description: '신뢰할 수 있는 정신건강 정보 - 우울증, 불안장애, 스트레스 관리 가이드',
  },
  alternates: {
    canonical: 'https://forestecho.app/education',
    languages: {
      'ko-KR': 'https://forestecho.app/education',
      'en-US': 'https://forestecho.app/education',
      'ja-JP': 'https://forestecho.app/education',
      'zh-CN': 'https://forestecho.app/education',
    },
  },
}

export default function EducationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
