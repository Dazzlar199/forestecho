'use client'

interface ScoreGaugeProps {
  label: string
  score: number
  maxScore?: number
  description?: string
}

export default function ScoreGauge({
  label,
  score,
  maxScore = 10,
  description,
}: ScoreGaugeProps) {
  const percentage = (score / maxScore) * 100
  const circumference = 2 * Math.PI * 45 // r=45
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const getScoreColor = (score: number): string => {
    if (score >= 8) return '#10b981' // green
    if (score >= 6) return '#3b82f6' // blue
    if (score >= 4) return '#f59e0b' // orange
    return '#ef4444' // red
  }

  return (
    <div className="flex flex-col items-center">
      {/* SVG 원형 게이지 */}
      <div className="relative w-32 h-32 mb-4">
        <svg className="transform -rotate-90 w-full h-full">
          {/* 배경 원 */}
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
            fill="none"
          />
          {/* 진행 원 */}
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke={getScoreColor(score)}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 10px ${getScoreColor(score)}40)`,
            }}
          />
        </svg>

        {/* 중앙 점수 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="text-3xl font-light text-gray-200"
            style={{ letterSpacing: '0.05em' }}
          >
            {score}
          </div>
          <div className="text-xs text-gray-600">/ {maxScore}</div>
        </div>
      </div>

      {/* 라벨 */}
      <h4
        className="text-gray-300 text-center mb-2"
        style={{ fontWeight: 400, letterSpacing: '0.02em' }}
      >
        {label}
      </h4>

      {/* 설명 */}
      {description && (
        <p
          className="text-sm text-gray-500 text-center max-w-xs"
          style={{ fontWeight: 300, lineHeight: 1.6, letterSpacing: '0.01em' }}
        >
          {description}
        </p>
      )}
    </div>
  )
}
