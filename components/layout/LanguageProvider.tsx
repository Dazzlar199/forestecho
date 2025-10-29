'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'ko' | 'en' | 'ja' | 'zh'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  ko: {
    // Header
    lightMode: '라이트 모드',
    darkMode: '다크 모드',
    login: '로그인',
    privacy: '개인정보처리방침',

    // Welcome Screen
    siteName: '숲울림',
    subtitle: '당신의 속 마음, 울림에 귀 기울입니다',
    description1: '전문 AI 심리상담사가 24시간 당신의 이야기를 들어드립니다.',
    description2: '이곳은 당신만을 위한 안전한 공간입니다.',
    startChat: '대화 시작하기',
    feature1: '전문 심리학 기반 상담',
    feature2: '완전한 익명성 보장',
    notice1: '본 서비스는 전문 심리상담을 제공하지만,',
    notice2: '응급 상황 시 전문 기관에 연락해 주시기 바랍니다.',
    emergencyLine: '자살예방 상담전화: 1393 | 정신건강 위기상담: 1577-0199',

    // Privacy Modal
    privacyTitle: '개인정보처리방침',
    privacyIntro: '숲울림은 이용자의 개인정보를 소중히 여기며, 개인정보 보호법을 준수합니다.',
    privacySection1: '1. 수집하는 개인정보',
    privacySection1Content: '- 이메일 주소 (로그인 시)\n- 대화 내용 (서비스 제공 목적)',
    privacySection2: '2. 개인정보의 이용 목적',
    privacySection2Content: '- 심리상담 서비스 제공\n- 사용자 인증 및 관리\n- 서비스 개선',
    privacySection3: '3. 개인정보의 보유 및 이용 기간',
    privacySection3Content: '- 회원 탈퇴 시까지\n- 관련 법령에 따라 일정 기간 보관',
    close: '닫기',

    // Chat
    placeholder: '메시지를 입력하세요...',
    listening: '당신의 이야기를 듣고 있습니다...',
  },
  en: {
    // Header
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    login: 'Login',
    privacy: 'Privacy Policy',

    // Welcome Screen
    siteName: 'Forest Echo',
    subtitle: 'Listening to your inner voice and resonance',
    description1: 'Professional counselors are available 24/7 to listen to your story.',
    description2: 'This is a safe space just for you.',
    startChat: 'Start Counseling',
    feature1: 'Professional Psychology-Based Counseling',
    feature2: 'Complete Anonymity Guaranteed',
    notice1: 'This service provides professional psychological counseling,',
    notice2: 'but please contact professional agencies in emergency situations.',
    emergencyLine: 'Suicide Prevention Hotline: 1393 | Mental Health Crisis Line: 1577-0199',

    // Privacy Modal
    privacyTitle: 'Privacy Policy',
    privacyIntro: 'Forest Echo values user privacy and complies with privacy protection laws.',
    privacySection1: '1. Personal Information Collected',
    privacySection1Content: '- Email address (when logging in)\n- Conversation content (for service provision)',
    privacySection2: '2. Purpose of Using Personal Information',
    privacySection2Content: '- Providing psychological counseling services\n- User authentication and management\n- Service improvement',
    privacySection3: '3. Retention Period of Personal Information',
    privacySection3Content: '- Until account deletion\n- Retained for a certain period according to relevant laws',
    close: 'Close',

    // Chat
    placeholder: 'Type your message...',
    listening: 'Listening to your story...',
  },
  ja: {
    // Header
    lightMode: 'ライトモード',
    darkMode: 'ダークモード',
    login: 'ログイン',
    privacy: 'プライバシーポリシー',

    // Welcome Screen
    siteName: '森の響き',
    subtitle: 'あなたの心の声、響きに耳を傾けます',
    description1: '専門カウンセラーが24時間、あなたの話を聞きます。',
    description2: 'ここはあなただけの安全な空間です。',
    startChat: 'カウンセリングを始める',
    feature1: '専門心理学に基づくカウンセリング',
    feature2: '完全な匿名性を保証',
    notice1: '本サービスは専門的な心理カウンセリングを提供しますが、',
    notice2: '緊急時には専門機関にご連絡ください。',
    emergencyLine: '自殺予防相談電話: 1393 | メンタルヘルス危機相談: 1577-0199',

    // Privacy Modal
    privacyTitle: 'プライバシーポリシー',
    privacyIntro: '森の響きは利用者の個人情報を大切にし、個人情報保護法を遵守します。',
    privacySection1: '1. 収集する個人情報',
    privacySection1Content: '- メールアドレス（ログイン時）\n- 会話内容（サービス提供目的）',
    privacySection2: '2. 個人情報の利用目的',
    privacySection2Content: '- 心理カウンセリングサービスの提供\n- ユーザー認証と管理\n- サービスの改善',
    privacySection3: '3. 個人情報の保有・利用期間',
    privacySection3Content: '- 会員退会まで\n- 関連法令に従い一定期間保管',
    close: '閉じる',

    // Chat
    placeholder: 'メッセージを入力してください...',
    listening: 'あなたの話を聞いています...',
  },
  zh: {
    // Header
    lightMode: '亮色模式',
    darkMode: '暗色模式',
    login: '登录',
    privacy: '隐私政策',

    // Welcome Screen
    siteName: '森林回响',
    subtitle: '倾听您内心的声音与共鸣',
    description1: '专业心理咨询师24小时为您倾听。',
    description2: '这是一个专属于您的安全空间。',
    startChat: '开始咨询',
    feature1: '基于专业心理学的咨询',
    feature2: '保证完全匿名',
    notice1: '本服务提供专业心理咨询，',
    notice2: '但在紧急情况下请联系专业机构。',
    emergencyLine: '自杀预防咨询热线: 1393 | 心理健康危机咨询: 1577-0199',

    // Privacy Modal
    privacyTitle: '隐私政策',
    privacyIntro: '森林回响重视用户隐私，遵守隐私保护法。',
    privacySection1: '1. 收集的个人信息',
    privacySection1Content: '- 电子邮件地址（登录时）\n- 对话内容（服务提供目的）',
    privacySection2: '2. 个人信息使用目的',
    privacySection2Content: '- 提供心理咨询服务\n- 用户认证与管理\n- 服务改进',
    privacySection3: '3. 个人信息保留与使用期限',
    privacySection3Content: '- 直至账户注销\n- 根据相关法律保留一定期限',
    close: '关闭',

    // Chat
    placeholder: '请输入消息...',
    listening: '正在倾听您的故事...',
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ko')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && ['ko', 'en', 'ja', 'zh'].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (mounted) {
      localStorage.setItem('language', lang)
    }
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ko']] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
