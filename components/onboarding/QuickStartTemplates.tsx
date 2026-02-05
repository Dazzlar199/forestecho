'use client'

import { motion } from 'framer-motion'
import { Briefcase, Heart, Brain, Users, Home, Sparkles } from 'lucide-react'

interface QuickStartTemplatesProps {
  onSelect: (template: string) => void
}

const templates = [
  {
    id: 'work',
    icon: Briefcase,
    label: '직장 스트레스',
    prompt: '요즘 직장에서 스트레스를 많이 받고 있습니다. 업무 압박도 심하고 상사와의 관계도 어렵습니다.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'relationship',
    icon: Heart,
    label: '관계 문제',
    prompt: '주변 사람들과의 관계에서 어려움이 있습니다. 소통이 잘 안 되고 오해가 생기는 것 같습니다.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'anxiety',
    icon: Brain,
    label: '불안 증상',
    prompt: '요즘 이유 없이 불안하고 걱정이 많습니다. 잠도 잘 안 오고 계속 신경이 쓰입니다.',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    id: 'family',
    icon: Home,
    label: '가족 갈등',
    prompt: '가족 관계에서 갈등이 있습니다. 서로를 이해하기 힘들고 대화가 어렵습니다.',
    color: 'from-orange-500 to-amber-500',
  },
  {
    id: 'social',
    icon: Users,
    label: '대인관계',
    prompt: '사람들과 어울리는 것이 힘듭니다. 사회적 상황에서 불편함을 느낍니다.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'self',
    icon: Sparkles,
    label: '자아 정체성',
    prompt: '내가 누구인지, 무엇을 원하는지 모르겠습니다. 삶의 방향을 찾고 싶습니다.',
    color: 'from-yellow-500 to-orange-500',
  },
]

export default function QuickStartTemplates({ onSelect }: QuickStartTemplatesProps) {
  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h3 className="text-xl sm:text-2xl font-light text-gray-100 mb-2">
          어떤 고민이 있으신가요?
        </h3>
        <p className="text-sm sm:text-base text-gray-400">
          주제를 선택하시면 더 빠르게 대화를 시작할 수 있어요
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {templates.map((template, index) => (
          <motion.button
            key={template.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(template.prompt)}
            className={`p-4 sm:p-6 rounded-xl bg-gradient-to-br ${template.color} bg-opacity-10 border border-white/10 hover:border-white/30 transition-all text-left group`}
          >
            <template.icon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300 mb-3 group-hover:scale-110 transition-transform" />
            <div className="text-sm sm:text-base font-medium text-gray-200">
              {template.label}
            </div>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-center"
      >
        <p className="text-xs sm:text-sm text-gray-500">
          또는 직접 입력해서 대화를 시작하세요
        </p>
      </motion.div>
    </div>
  )
}
