'use client'

import { BarChart3, TrendingUp, Shield, Activity } from 'lucide-react'

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {/* 총 분석 횟수 */}
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/20 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-400" />
          </div>
          <h3
            className="text-gray-300"
            style={{ fontWeight: 400, letterSpacing: '0.02em' }}
          >
            총 분석 횟수
          </h3>
        </div>
        <div className="text-center">
          <div
            className="text-5xl font-light text-blue-400 mb-2"
            style={{ letterSpacing: '0.05em' }}
          >
            {stats.totalAnalyses}
          </div>
          <p className="text-sm text-gray-500" style={{ fontWeight: 300 }}>
            회
          </p>
        </div>
      </div>

      {/* 평균 위험 수준 */}
      <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-white/20 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <Shield className="w-6 h-6 text-yellow-400" />
          </div>
          <h3
            className="text-gray-300"
            style={{ fontWeight: 400, letterSpacing: '0.02em' }}
          >
            평균 위험 수준
          </h3>
        </div>
        <div className="text-center">
          <div
            className={`inline-block px-6 py-3 rounded-full border text-lg ${getRiskLevelColor(
              stats.averageRiskLevel
            )}`}
            style={{ fontWeight: 400, letterSpacing: '0.05em' }}
          >
            {getRiskLevelText(stats.averageRiskLevel)}
          </div>
        </div>
      </div>

      {/* 평균 회복 가능성 */}
      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-white/20 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <h3
            className="text-gray-300"
            style={{ fontWeight: 400, letterSpacing: '0.02em' }}
          >
            평균 회복 가능성
          </h3>
        </div>
        <div className="text-center">
          <div
            className={`text-5xl font-light mb-2 ${getRecoveryColor(
              stats.averageRecoveryPotential
            )}`}
            style={{ letterSpacing: '0.05em' }}
          >
            {stats.averageRecoveryPotential}
          </div>
          <p className="text-sm text-gray-500" style={{ fontWeight: 300 }}>
            / 10
          </p>
        </div>
      </div>
    </div>
  )
}
