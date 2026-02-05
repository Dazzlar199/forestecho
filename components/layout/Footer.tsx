'use client'

import { Shield, Lock, CheckCircle, Award } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { useLanguage } from './LanguageProvider'

interface TrustBadgeProps {
  icon: React.ElementType
  title: string
  subtitle: string
}

function TrustBadge({ icon: Icon, title, subtitle }: TrustBadgeProps) {
  const { theme } = useTheme()

  return (
    <div
      className={`flex items-center gap-3 px-5 py-3 border-2 backdrop-blur-sm transition-all ${
        theme === 'dark'
          ? 'bg-emerald-950/30 border-emerald-500/20 hover:border-emerald-500/40'
          : 'bg-emerald-50/50 border-emerald-400/30 hover:border-emerald-400/50'
      }`}
      style={{
        borderRadius: '20px',
      }}
    >
      <div
        className={`p-2 rounded-lg ${
          theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-100'
        }`}
      >
        <Icon
          className={`w-5 h-5 ${
            theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
          }`}
        />
      </div>
      <div>
        <p
          className={`text-sm font-medium ${
            theme === 'dark' ? 'text-emerald-100' : 'text-emerald-900'
          }`}
        >
          {title}
        </p>
        <p
          className={`text-xs ${
            theme === 'dark' ? 'text-emerald-400/60' : 'text-emerald-700/70'
          }`}
        >
          {subtitle}
        </p>
      </div>
    </div>
  )
}

export default function Footer() {
  const { theme } = useTheme()
  const { language } = useLanguage()

  const badges = {
    ko: [
      {
        icon: Shield,
        title: '개인정보보호',
        subtitle: 'GDPR 준수',
      },
      {
        icon: Lock,
        title: '데이터 암호화',
        subtitle: 'End-to-End',
      },
      {
        icon: CheckCircle,
        title: '의료기기 아님',
        subtitle: '명확한 고지',
      },
      {
        icon: Award,
        title: '전문 포플포트',
        subtitle: '임상심리학 기반',
      },
    ],
    en: [
      {
        icon: Shield,
        title: 'Privacy Protection',
        subtitle: 'GDPR Compliant',
      },
      {
        icon: Lock,
        title: 'Data Encryption',
        subtitle: 'End-to-End',
      },
      {
        icon: CheckCircle,
        title: 'Not Medical Device',
        subtitle: 'Clear Disclosure',
      },
      {
        icon: Award,
        title: 'Professional Support',
        subtitle: 'Clinical Psychology',
      },
    ],
    ja: [
      {
        icon: Shield,
        title: '個人情報保護',
        subtitle: 'GDPR準拠',
      },
      {
        icon: Lock,
        title: 'データ暗号化',
        subtitle: 'End-to-End',
      },
      {
        icon: CheckCircle,
        title: '医療機器ではない',
        subtitle: '明確な告知',
      },
      {
        icon: Award,
        title: '専門サポート',
        subtitle: '臨床心理学基盤',
      },
    ],
    zh: [
      {
        icon: Shield,
        title: '隐私保护',
        subtitle: 'GDPR合规',
      },
      {
        icon: Lock,
        title: '数据加密',
        subtitle: 'End-to-End',
      },
      {
        icon: CheckCircle,
        title: '非医疗设备',
        subtitle: '明确告知',
      },
      {
        icon: Award,
        title: '专业支持',
        subtitle: '临床心理学',
      },
    ],
  }

  const currentBadges = badges[language as keyof typeof badges] || badges.ko

  const footerText = {
    ko: {
      company: '© 2026 숲울림 (ForestEcho). All rights reserved.',
      disclaimer:
        '본 서비스는 의료기기가 아니며, 전문 의료 상담을 대체할 수 없습니다. 긴급한 상황에서는 전문가의 도움을 받으세요.',
    },
    en: {
      company: '© 2026 ForestEcho. All rights reserved.',
      disclaimer:
        'This service is not a medical device and cannot replace professional medical consultation. Seek professional help in emergency situations.',
    },
    ja: {
      company: '© 2026 ForestEcho. All rights reserved.',
      disclaimer:
        '本サービスは医療機器ではなく、専門的な医療相談に代わるものではありません。緊急時は専門家の助けを求めてください。',
    },
    zh: {
      company: '© 2026 ForestEcho. All rights reserved.',
      disclaimer:
        '本服务不是医疗设备，不能替代专业医疗咨询。紧急情况下请寻求专业帮助。',
    },
  }

  const currentText =
    footerText[language as keyof typeof footerText] || footerText.ko

  return (
    <footer
      className={`mt-16 py-8 border-t ${
        theme === 'dark'
          ? 'bg-transparent border-white/5'
          : 'bg-transparent border-gray-200/50'
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 max-w-4xl mx-auto">
          {currentBadges.map((badge, index) => (
            <TrustBadge
              key={index}
              icon={badge.icon}
              title={badge.title}
              subtitle={badge.subtitle}
            />
          ))}
        </div>

        {/* Disclaimer */}
        <div className="max-w-2xl mx-auto mb-6">
          <p
            className={`text-center text-xs leading-relaxed ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}
          >
            {currentText.disclaimer}
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p
            className={`text-xs ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
            }`}
          >
            {currentText.company}
          </p>
        </div>
      </div>
    </footer>
  )
}
