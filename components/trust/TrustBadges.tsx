'use client'

import { Shield, Lock, CheckCircle, Award } from 'lucide-react'

const badges = [
  {
    icon: Shield,
    label: '개인정보보호',
    description: 'GDPR 준수',
  },
  {
    icon: Lock,
    label: '데이터 암호화',
    description: 'End-to-End',
  },
  {
    icon: CheckCircle,
    label: '의료기기 아님',
    description: '명확한 고지',
  },
  {
    icon: Award,
    label: '전문 프롬프트',
    description: '임상심리학 기반',
  },
]

export default function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 py-6 sm:py-8">
      {badges.map((badge, index) => (
        <div
          key={index}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
        >
          <badge.icon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
          <div className="text-left">
            <div className="text-xs sm:text-sm font-medium text-gray-200">
              {badge.label}
            </div>
            <div className="text-xs text-gray-500">{badge.description}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
