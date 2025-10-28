'use client'

interface LifeImpactChartProps {
  impact: {
    work: number
    relationships: number
    selfCare: number
  }
}

export default function LifeImpactChart({ impact }: LifeImpactChartProps) {
  const categories = [
    { key: 'work', label: '직장/학업', value: impact.work },
    { key: 'relationships', label: '대인관계', value: impact.relationships },
    { key: 'selfCare', label: '자기관리', value: impact.selfCare },
  ]

  const getImpactColor = (score: number): string => {
    if (score >= 8) return 'text-red-400 border-red-400/50'
    if (score >= 6) return 'text-orange-400 border-orange-400/50'
    if (score >= 4) return 'text-yellow-400 border-yellow-400/50'
    return 'text-green-400 border-green-400/50'
  }

  const getImpactLabel = (score: number): string => {
    if (score >= 8) return '매우 높음'
    if (score >= 6) return '높음'
    if (score >= 4) return '중간'
    return '낮음'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div
          key={category.key}
          className="relative bg-black/20 backdrop-blur-md border border-white/10 p-8 rounded-lg hover:border-white/20 transition-all"
        >
          {/* 중앙 점수 */}
          <div className="text-center mb-6">
            <div
              className={`text-5xl font-light mb-2 ${getImpactColor(category.value).split(' ')[0]}`}
              style={{ letterSpacing: '0.1em' }}
            >
              {category.value}
            </div>
            <div
              className="text-xs text-gray-500 uppercase tracking-widest"
              style={{ letterSpacing: '0.2em' }}
            >
              {getImpactLabel(category.value)}
            </div>
          </div>

          {/* 카테고리 이름 */}
          <div className="text-center">
            <h4
              className="text-gray-300 mb-4"
              style={{ fontWeight: 400, letterSpacing: '0.03em' }}
            >
              {category.label}
            </h4>

            {/* 비주얼 인디케이터 */}
            <div className="flex justify-center gap-1">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full transition-all ${
                    i < category.value
                      ? getImpactColor(category.value).split(' ')[0].replace('text-', 'bg-')
                      : 'bg-white/10'
                  }`}
                  style={{
                    boxShadow:
                      i < category.value ? '0 0 10px rgba(255,255,255,0.3)' : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
