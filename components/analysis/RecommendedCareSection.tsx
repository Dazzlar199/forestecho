'use client'

import Link from 'next/link'
import {
  Heart,
  Calendar,
  Brain,
  TreePine,
  Users,
  BookOpen,
  Sparkles,
  ArrowRight
} from 'lucide-react'

interface RecommendedCareSectionProps {
  riskLevel?: 'low' | 'medium' | 'high'
  recoveryPotential?: number
}

export default function RecommendedCareSection({
  riskLevel = 'medium',
  recoveryPotential = 5
}: RecommendedCareSectionProps) {

  // 위험도와 회복 가능성에 따라 추천 기능 결정
  const getRecommendedFeatures = () => {
    const features = [
      {
        icon: TreePine,
        title: '나의 숲',
        description: '당신의 마음이 성장하는 공간을 확인하세요',
        href: '/myforest',
        color: 'emerald',
        priority: 1,
      },
      {
        icon: Heart,
        title: '감정 기록',
        description: '매일의 감정을 기록하고 패턴을 파악하세요',
        href: '/emotion',
        color: 'pink',
        priority: riskLevel === 'high' ? 2 : 3,
      },
      {
        icon: Calendar,
        title: '일일 체크인',
        description: '하루를 시작하며 마음 상태를 체크하세요',
        href: '/checkin',
        color: 'blue',
        priority: 2,
      },
      {
        icon: Brain,
        title: '자가진단',
        description: '정기적인 자가진단으로 변화를 추적하세요',
        href: '/assessment',
        color: 'purple',
        priority: riskLevel === 'high' || recoveryPotential < 5 ? 1 : 3,
      },
      {
        icon: Users,
        title: '커뮤니티',
        description: '비슷한 경험을 가진 사람들과 소통하세요',
        href: '/community',
        color: 'orange',
        priority: 3,
      },
      {
        icon: BookOpen,
        title: '심리 교육',
        description: '심리학 지식으로 자신을 더 이해하세요',
        href: '/education',
        color: 'cyan',
        priority: 2,
      },
    ]

    // priority로 정렬하여 상위 4개만 반환
    return features.sort((a, b) => a.priority - b.priority).slice(0, 4)
  }

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: {
        bg: 'from-emerald-500/10 to-green-500/10',
        border: 'border-emerald-500/30',
        icon: 'text-emerald-400',
        hoverBg: 'hover:bg-emerald-500/10',
      },
      pink: {
        bg: 'from-pink-500/10 to-rose-500/10',
        border: 'border-pink-500/30',
        icon: 'text-pink-400',
        hoverBg: 'hover:bg-pink-500/10',
      },
      blue: {
        bg: 'from-blue-500/10 to-cyan-500/10',
        border: 'border-blue-500/30',
        icon: 'text-blue-400',
        hoverBg: 'hover:bg-blue-500/10',
      },
      purple: {
        bg: 'from-purple-500/10 to-violet-500/10',
        border: 'border-purple-500/30',
        icon: 'text-purple-400',
        hoverBg: 'hover:bg-purple-500/10',
      },
      orange: {
        bg: 'from-orange-500/10 to-amber-500/10',
        border: 'border-orange-500/30',
        icon: 'text-orange-400',
        hoverBg: 'hover:bg-orange-500/10',
      },
      cyan: {
        bg: 'from-cyan-500/10 to-teal-500/10',
        border: 'border-cyan-500/30',
        icon: 'text-cyan-400',
        hoverBg: 'hover:bg-cyan-500/10',
      },
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const recommendedFeatures = getRecommendedFeatures()

  return (
    <section className="mb-16">
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/20 p-10 rounded-lg">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h2
            className="text-2xl text-gray-200"
            style={{ fontWeight: 400, letterSpacing: '0.03em' }}
          >
            추천 심리 케어
          </h2>
        </div>

        <p
          className="text-gray-400 mb-8"
          style={{ fontWeight: 300, lineHeight: 1.8, letterSpacing: '0.02em' }}
        >
          분석 결과를 바탕으로 당신에게 도움이 될 기능들을 추천해드립니다.
          지속적인 케어로 마음의 건강을 지켜나가세요.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendedFeatures.map((feature, index) => {
            const Icon = feature.icon
            const colors = getColorClasses(feature.color)

            return (
              <Link
                key={index}
                href={feature.href}
                className={`group bg-gradient-to-br ${colors.bg} backdrop-blur-xl border ${colors.border} p-6 rounded-lg transition-all ${colors.hoverBg} hover:border-white/30`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 bg-black/30 border ${colors.border} rounded-lg`}>
                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className="text-gray-200 group-hover:text-white transition-colors"
                        style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                      >
                        {feature.title}
                      </h3>
                      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p
                      className="text-gray-500 text-sm"
                      style={{ fontWeight: 300, lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* 추가 안내 */}
        <div className="mt-8 bg-black/30 p-6 rounded-lg border border-white/10">
          <p
            className="text-gray-400 text-sm text-center"
            style={{ fontWeight: 300, lineHeight: 1.8, letterSpacing: '0.02em' }}
          >
            💡 정기적인 케어와 자가 관찰이 마음 건강 개선에 큰 도움이 됩니다.
            <br />
            하루에 몇 분씩 자신을 돌보는 시간을 가져보세요.
          </p>
        </div>
      </div>
    </section>
  )
}
