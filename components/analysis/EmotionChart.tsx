'use client'

import { EmotionScore } from '@/types/analysis'

interface EmotionChartProps {
  emotions: EmotionScore[]
}

export default function EmotionChart({ emotions }: EmotionChartProps) {
  // 색상 매핑
  const getEmotionColor = (score: number): string => {
    if (score >= 8) return 'bg-red-500'
    if (score >= 6) return 'bg-orange-500'
    if (score >= 4) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getEmotionBorderColor = (score: number): string => {
    if (score >= 8) return 'border-red-400'
    if (score >= 6) return 'border-orange-400'
    if (score >= 4) return 'border-yellow-400'
    return 'border-green-400'
  }

  return (
    <div className="space-y-6">
      {emotions.map((emotion, index) => (
        <div key={index} className="space-y-2">
          {/* 감정 이름과 점수 */}
          <div className="flex justify-between items-baseline">
            <h4
              className="text-gray-300"
              style={{ fontWeight: 400, letterSpacing: '0.02em' }}
            >
              {emotion.name}
            </h4>
            <span
              className="text-2xl font-light text-gray-400"
              style={{ letterSpacing: '0.05em' }}
            >
              {emotion.score}
              <span className="text-sm text-gray-600">/10</span>
            </span>
          </div>

          {/* 프로그레스 바 */}
          <div className="relative h-3 bg-black/30 rounded-full overflow-hidden border border-white/10">
            <div
              className={`h-full ${getEmotionColor(emotion.score)} transition-all duration-1000 ease-out`}
              style={{
                width: `${(emotion.score / 10) * 100}%`,
                boxShadow: '0 0 10px rgba(255,255,255,0.2)',
              }}
            />
          </div>

          {/* 설명 */}
          {emotion.description && (
            <p
              className="text-sm text-gray-500 mt-2"
              style={{ fontWeight: 300, lineHeight: 1.7, letterSpacing: '0.01em' }}
            >
              {emotion.description}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
