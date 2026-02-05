'use client'

import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { motion } from 'framer-motion'
import type { EmotionTrend } from '@/types/emotion'
import { emotionConfig } from '@/types/emotion'

interface EmotionJourneyChartProps {
  trends: EmotionTrend[]
  mode?: 'line' | 'area'
}

export default function EmotionJourneyChart({
  trends,
  mode = 'area',
}: EmotionJourneyChartProps) {
  // Transform data for chart
  const chartData = useMemo(() => {
    return trends.map(trend => ({
      date: new Date(trend.date).toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
      }),
      ...trend.emotions,
    }))
  }, [trends])

  // Get emotion types present in data
  const emotionTypes = useMemo(() => {
    const types = new Set<string>()
    trends.forEach(trend => {
      Object.keys(trend.emotions).forEach(emotion => types.add(emotion))
    })
    return Array.from(types)
  }, [trends])

  if (trends.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        아직 감정 데이터가 없습니다. 상담을 시작해보세요.
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-lg border border-white/20 rounded-lg p-3">
          <p className="text-gray-200 font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-300">
                {emotionConfig[entry.dataKey as keyof typeof emotionConfig]?.name.ko}
              </span>
              <span className="text-white font-medium">
                {entry.value.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <ResponsiveContainer width="100%" height={400}>
        {mode === 'area' ? (
          <AreaChart data={chartData}>
            <defs>
              {emotionTypes.map((emotion) => (
                <linearGradient
                  key={emotion}
                  id={`color-${emotion}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={emotionConfig[emotion as keyof typeof emotionConfig]?.color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={emotionConfig[emotion as keyof typeof emotionConfig]?.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              domain={[0, 10]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) =>
                emotionConfig[value as keyof typeof emotionConfig]?.name.ko || value
              }
            />
            {emotionTypes.map((emotion) => (
              <Area
                key={emotion}
                type="monotone"
                dataKey={emotion}
                stroke={emotionConfig[emotion as keyof typeof emotionConfig]?.color}
                fillOpacity={1}
                fill={`url(#color-${emotion})`}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        ) : (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              domain={[0, 10]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) =>
                emotionConfig[value as keyof typeof emotionConfig]?.name.ko || value
              }
            />
            {emotionTypes.map((emotion) => (
              <Line
                key={emotion}
                type="monotone"
                dataKey={emotion}
                stroke={emotionConfig[emotion as keyof typeof emotionConfig]?.color}
                strokeWidth={3}
                dot={{ fill: emotionConfig[emotion as keyof typeof emotionConfig]?.color, r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </motion.div>
  )
}
