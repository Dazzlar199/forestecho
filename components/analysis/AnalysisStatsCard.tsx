'use client'


interface AnalysisStatsCardProps {
  stats: {
    totalAnalyses: number
    averageRiskLevel: 'low' | 'medium' | 'high'
    averageRecoveryPotential: number
  }
}

export default function AnalysisStatsCard({ stats }: AnalysisStatsCardProps) {
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-red-400 bg-red-500/10 border-red-500/30'
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      case 'low':
        return 'text-green-400 bg-green-500/10 border-green-500/30'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
    }
  }

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'high':
        return '높음'
      case 'medium':
        return '중간'
      case 'low':
        return '낮음'
      default:
        return '미확인'
    }
  }

  const getRecoveryColor = (score: number) => {
    if (score >= 7) return 'text-green-400'
    if (score >= 4) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      {/* 총 분석 횟수 */}
      <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-lg text-center">
        <div className="text-4xl font-light text-emerald-400 mb-1">
          {stats.totalAnalyses}
        </div>
        <div className="text-xs text-gray-500">
          대화 횟수
        </div>
      </div>

      {/* 평균 위험 수준 */}
      <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-lg text-center">
        <div className="text-2xl font-light text-emerald-400 mb-1">
          {getRiskLevelText(stats.averageRiskLevel)}
        </div>
        <div className="text-xs text-gray-500">
          평균 위험도
        </div>
      </div>

      {/* 평균 회복 가능성 */}
      <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-lg text-center">
        <div className="text-4xl font-light text-emerald-400 mb-1">
          {stats.averageRecoveryPotential.toFixed(1)}
        </div>
        <div className="text-xs text-gray-500">
          회복 가능성
        </div>
      </div>
    </div>
  )
}
