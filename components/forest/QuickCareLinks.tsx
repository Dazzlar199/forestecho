'use client'

import Link from 'next/link'
import { Heart, Calendar, Brain, Users, BookOpen, MessageCircle } from 'lucide-react'

interface QuickCareLinksProps {
  theme: 'dark' | 'light'
  language: 'ko' | 'en' | 'ja' | 'zh'
}

export default function QuickCareLinks({ theme, language }: QuickCareLinksProps) {
  const getTitle = () => {
    if (language === 'ko') return '심리 케어 바로가기'
    if (language === 'en') return 'Quick Care Links'
    if (language === 'ja') return '心理ケアショートカット'
    return '心理护理快捷方式'
  }

  const getSubtitle = () => {
    if (language === 'ko') return '마음 건강을 위한 다양한 기능을 이용해보세요'
    if (language === 'en') return 'Explore various features for your mental health'
    if (language === 'ja') return '心の健康のための様々な機能をご利用ください'
    return '探索各种心理健康功能'
  }

  const features = [
    {
      icon: MessageCircle,
      label: { ko: 'AI 상담', en: 'AI Counseling', ja: 'AIカウンセリング', zh: 'AI咨询' },
      href: '/',
      color: 'blue',
    },
    {
      icon: Heart,
      label: { ko: '감정 기록', en: 'Emotion Tracking', ja: '感情記録', zh: '情绪追踪' },
      href: '/emotion',
      color: 'pink',
    },
    {
      icon: Calendar,
      label: { ko: '일일 체크인', en: 'Daily Check-in', ja: 'デイリーチェックイン', zh: '每日签到' },
      href: '/checkin',
      color: 'purple',
    },
    {
      icon: Brain,
      label: { ko: '자가진단', en: 'Self-Assessment', ja: 'セルフチェック', zh: '自我评估' },
      href: '/assessment',
      color: 'green',
    },
    {
      icon: Users,
      label: { ko: '커뮤니티', en: 'Community', ja: 'コミュニティ', zh: '社区' },
      href: '/community',
      color: 'orange',
    },
    {
      icon: BookOpen,
      label: { ko: '심리 교육', en: 'Education', ja: '心理教育', zh: '心理教育' },
      href: '/education',
      color: 'cyan',
    },
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-100/60',
        border: theme === 'dark' ? 'border-blue-500/30' : 'border-blue-600/40',
        text: theme === 'dark' ? 'text-blue-400' : 'text-blue-700',
        hover: theme === 'dark' ? 'hover:bg-blue-500/20' : 'hover:bg-blue-100/80',
      },
      pink: {
        bg: theme === 'dark' ? 'bg-pink-500/10' : 'bg-pink-100/60',
        border: theme === 'dark' ? 'border-pink-500/30' : 'border-pink-600/40',
        text: theme === 'dark' ? 'text-pink-400' : 'text-pink-700',
        hover: theme === 'dark' ? 'hover:bg-pink-500/20' : 'hover:bg-pink-100/80',
      },
      purple: {
        bg: theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-100/60',
        border: theme === 'dark' ? 'border-purple-500/30' : 'border-purple-600/40',
        text: theme === 'dark' ? 'text-purple-400' : 'text-purple-700',
        hover: theme === 'dark' ? 'hover:bg-purple-500/20' : 'hover:bg-purple-100/80',
      },
      green: {
        bg: theme === 'dark' ? 'bg-green-500/10' : 'bg-green-100/60',
        border: theme === 'dark' ? 'border-green-500/30' : 'border-green-600/40',
        text: theme === 'dark' ? 'text-green-400' : 'text-green-700',
        hover: theme === 'dark' ? 'hover:bg-green-500/20' : 'hover:bg-green-100/80',
      },
      orange: {
        bg: theme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-100/60',
        border: theme === 'dark' ? 'border-orange-500/30' : 'border-orange-600/40',
        text: theme === 'dark' ? 'text-orange-400' : 'text-orange-700',
        hover: theme === 'dark' ? 'hover:bg-orange-500/20' : 'hover:bg-orange-100/80',
      },
      cyan: {
        bg: theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-100/60',
        border: theme === 'dark' ? 'border-cyan-500/30' : 'border-cyan-600/40',
        text: theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700',
        hover: theme === 'dark' ? 'hover:bg-cyan-500/20' : 'hover:bg-cyan-100/80',
      },
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className={`p-8 rounded-lg border backdrop-blur-xl mb-12 ${
      theme === 'dark'
        ? 'bg-white/5 border-white/10'
        : 'bg-white/40 border-gray-300'
    }`}>
      <h3 className={`text-xl mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
        style={{ fontWeight: 400, letterSpacing: '0.02em' }}
      >
        {getTitle()}
      </h3>
      <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}
        style={{ fontWeight: 300, letterSpacing: '0.02em' }}
      >
        {getSubtitle()}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {features.map((feature, index) => {
          const Icon = feature.icon
          const colors = getColorClasses(feature.color)

          return (
            <Link
              key={index}
              href={feature.href}
              className={`flex flex-col items-center gap-3 p-4 rounded-lg border transition-all ${colors.bg} ${colors.border} ${colors.hover}`}
            >
              <Icon className={`w-6 h-6 ${colors.text}`} />
              <span className={`text-sm text-center ${colors.text}`}
                style={{ fontWeight: 300, letterSpacing: '0.02em' }}
              >
                {feature.label[language]}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
