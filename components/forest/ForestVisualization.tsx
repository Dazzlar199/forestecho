'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  calculateForestLevel,
  getForestLevelInfo,
  getForestLevelColor,
  getForestLevelEmoji,
  type UserForestData,
} from '@/lib/forest-level'

interface ForestVisualizationProps {
  data: UserForestData
}

export default function ForestVisualization({ data }: ForestVisualizationProps) {
  const level = calculateForestLevel(data)
  const levelInfo = getForestLevelInfo(level)
  const levelColor = getForestLevelColor(level)
  const levelEmoji = getForestLevelEmoji(level)
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 0.02)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const treeCount = Math.min(level * 2, 14)
  const flowerCount = Math.max(0, (level - 2) * 6)
  const starCount = Math.max(0, (level - 6) * 4)
  const cloudCount = Math.max(2, Math.min(level, 4))

  // 나무 생성 (나무마다 고유한 위치와 크기)
  const trees = Array.from({ length: treeCount }, (_, i) => ({
    x: 100 + (i * 900 / treeCount) + (Math.sin(i) * 30),
    baseY: 380,
    trunkHeight: 60 + (i % 3) * 15,
    trunkWidth: 15 + (i % 2) * 5,
    crownRadius: 35 + (i % 3) * 10,
    depth: i % 2, // 0 = 뒤, 1 = 앞
  }))

  return (
    <div className="relative w-full h-full overflow-hidden">
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* 하늘 그라디언트 */}
          <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={level >= 7 ? "#1e3a8a" : "#87CEEB"} />
            <stop offset="100%" stopColor={level >= 7 ? "#93c5fd" : "#E0F6FF"} />
          </linearGradient>

          {/* 땅 그라디언트 */}
          <linearGradient id="ground" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={level >= 3 ? "#22c55e" : "#78716c"} />
            <stop offset="100%" stopColor={level >= 3 ? "#15803d" : "#57534e"} />
          </linearGradient>

          {/* 나무 잎 그라디언트 */}
          <radialGradient id="leaves">
            <stop offset="20%" stopColor={levelColor} stopOpacity="1" />
            <stop offset="100%" stopColor={levelColor} stopOpacity="0.7" />
          </radialGradient>
        </defs>

        {/* 배경 하늘 */}
        <rect width="1000" height="500" fill="url(#sky)" />

        {/* 태양 */}
        <motion.circle
          cx={level >= 7 ? 850 : 150}
          cy="80"
          r="45"
          fill={level >= 7 ? "#fef08a" : "#fbbf24"}
          opacity="0.9"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        />

        {/* 구름 */}
        {Array.from({ length: cloudCount }).map((_, i) => {
          const cloudX = 150 + (i * 250) + Math.sin(time + i) * 15
          const cloudY = 70 + (i % 2) * 30

          return (
            <g key={`cloud-${i}`} opacity="0.6">
              <ellipse cx={cloudX} cy={cloudY} rx="45" ry="20" fill="white" />
              <ellipse cx={cloudX + 25} cy={cloudY} rx="35" ry="18" fill="white" />
              <ellipse cx={cloudX - 20} cy={cloudY} rx="30" ry="16" fill="white" />
            </g>
          )
        })}

        {/* 산 (배경) */}
        {level >= 4 && (
          <>
            <path
              d="M 0 360 Q 250 280 500 360 T 1000 360 L 1000 500 L 0 500 Z"
              fill="#9ca3af"
              opacity="0.3"
            />
            <path
              d="M 0 380 Q 350 300 700 380 L 1000 380 L 1000 500 L 0 500 Z"
              fill="#6b7280"
              opacity="0.2"
            />
          </>
        )}

        {/* 땅 */}
        <motion.path
          d="M 0 350 Q 250 340 500 350 T 1000 350 L 1000 500 L 0 500 Z"
          fill="url(#ground)"
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ duration: 1.2 }}
        />

        {/* 잔디 */}
        {level >= 3 &&
          Array.from({ length: 60 }).map((_, i) => (
            <motion.line
              key={`grass-${i}`}
              x1={i * 17}
              y1={360 + (i % 5) * 3}
              x2={i * 17}
              y2={360 + (i % 5) * 3 - (8 + (i % 3) * 4)}
              stroke="#22c55e"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.5"
              initial={{ scaleY: 0 }}
              animate={{
                scaleY: 1,
                x: [0, Math.sin(time * 0.5 + i) * 2, 0],
              }}
              transition={{
                scaleY: { delay: 0.8 + i * 0.01, duration: 0.2 },
                x: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              }}
              style={{ transformOrigin: 'bottom' }}
            />
          ))}

        {/* 뒷배경 나무들 */}
        {trees
          .filter((tree) => tree.depth === 0)
          .map((tree, i) => {
            const sway = Math.sin(time * 0.5 + i) * 2

            return (
              <g key={`tree-back-${i}`} opacity="0.7">
                {/* 나무 줄기 */}
                <motion.rect
                  x={tree.x - tree.trunkWidth / 2 + sway}
                  y={tree.baseY - tree.trunkHeight}
                  width={tree.trunkWidth}
                  height={tree.trunkHeight}
                  fill="#78350f"
                  rx="3"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  style={{ transformOrigin: `${tree.x}px ${tree.baseY}px` }}
                />

                {/* 나무 잎 레이어 1 (가장 큰) */}
                <motion.ellipse
                  cx={tree.x + sway}
                  cy={tree.baseY - tree.trunkHeight - tree.crownRadius * 0.3}
                  rx={tree.crownRadius * 1.1}
                  ry={tree.crownRadius}
                  fill={levelColor}
                  opacity="0.6"
                  initial={{ scale: 0 }}
                  animate={{
                    scale: 1,
                    rotate: [0, 3, 0],
                  }}
                  transition={{
                    scale: { delay: i * 0.1 + 0.3, duration: 0.5 },
                    rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  style={{ transformOrigin: `${tree.x}px ${tree.baseY - tree.trunkHeight}px` }}
                />

                {/* 나무 잎 레이어 2 */}
                <motion.ellipse
                  cx={tree.x + sway}
                  cy={tree.baseY - tree.trunkHeight - tree.crownRadius * 0.5}
                  rx={tree.crownRadius * 0.85}
                  ry={tree.crownRadius * 0.85}
                  fill="url(#leaves)"
                  initial={{ scale: 0 }}
                  animate={{
                    scale: 1,
                    rotate: [0, -2, 0],
                  }}
                  transition={{
                    scale: { delay: i * 0.1 + 0.4, duration: 0.5 },
                    rotate: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  style={{ transformOrigin: `${tree.x}px ${tree.baseY - tree.trunkHeight}px` }}
                />
              </g>
            )
          })}

        {/* 앞배경 나무들 */}
        {trees
          .filter((tree) => tree.depth === 1)
          .map((tree, i) => {
            const sway = Math.sin(time * 0.7 + i) * 3

            return (
              <g key={`tree-front-${i}`}>
                {/* 그림자 */}
                <ellipse
                  cx={tree.x + 2}
                  cy={tree.baseY + 5}
                  rx={tree.crownRadius * 0.8}
                  ry="8"
                  fill="black"
                  opacity="0.2"
                />

                {/* 나무 줄기 */}
                <motion.rect
                  x={tree.x - tree.trunkWidth / 2 + sway}
                  y={tree.baseY - tree.trunkHeight}
                  width={tree.trunkWidth}
                  height={tree.trunkHeight}
                  fill="#92400e"
                  rx="4"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                  style={{ transformOrigin: `${tree.x}px ${tree.baseY}px` }}
                />

                {/* 줄기 디테일 (나뭇결) */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: i * 0.12 + 0.3 }}
                >
                  <line
                    x1={tree.x - 3 + sway}
                    y1={tree.baseY - tree.trunkHeight * 0.3}
                    x2={tree.x - 5 + sway}
                    y2={tree.baseY - tree.trunkHeight * 0.35}
                    stroke="#78350f"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1={tree.x + 3 + sway}
                    y1={tree.baseY - tree.trunkHeight * 0.6}
                    x2={tree.x + 5 + sway}
                    y2={tree.baseY - tree.trunkHeight * 0.65}
                    stroke="#78350f"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </motion.g>

                {/* 나무 잎 레이어 1 (가장 큰, 뒤쪽) */}
                <motion.ellipse
                  cx={tree.x + sway}
                  cy={tree.baseY - tree.trunkHeight - tree.crownRadius * 0.4}
                  rx={tree.crownRadius * 1.15}
                  ry={tree.crownRadius * 1.1}
                  fill={levelColor}
                  opacity="0.5"
                  initial={{ scale: 0 }}
                  animate={{
                    scale: 1,
                    rotate: [0, 4, 0],
                  }}
                  transition={{
                    scale: { delay: i * 0.12 + 0.5, duration: 0.6 },
                    rotate: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  style={{ transformOrigin: `${tree.x}px ${tree.baseY - tree.trunkHeight}px` }}
                />

                {/* 나무 잎 레이어 2 (중간) */}
                <motion.ellipse
                  cx={tree.x + 5 + sway}
                  cy={tree.baseY - tree.trunkHeight - tree.crownRadius * 0.3}
                  rx={tree.crownRadius}
                  ry={tree.crownRadius * 0.95}
                  fill="url(#leaves)"
                  initial={{ scale: 0 }}
                  animate={{
                    scale: 1,
                    rotate: [0, -3, 0],
                  }}
                  transition={{
                    scale: { delay: i * 0.12 + 0.6, duration: 0.6 },
                    rotate: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  style={{ transformOrigin: `${tree.x}px ${tree.baseY - tree.trunkHeight}px` }}
                />

                {/* 나무 잎 레이어 3 (앞쪽, 가장 진함) */}
                <motion.ellipse
                  cx={tree.x - 3 + sway}
                  cy={tree.baseY - tree.trunkHeight - tree.crownRadius * 0.2}
                  rx={tree.crownRadius * 0.9}
                  ry={tree.crownRadius * 0.85}
                  fill={levelColor}
                  opacity="1"
                  initial={{ scale: 0 }}
                  animate={{
                    scale: 1,
                    rotate: [0, 2, 0],
                  }}
                  transition={{
                    scale: { delay: i * 0.12 + 0.7, duration: 0.6 },
                    rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  style={{ transformOrigin: `${tree.x}px ${tree.baseY - tree.trunkHeight}px` }}
                />
              </g>
            )
          })}

        {/* 꽃들 */}
        {level >= 3 &&
          Array.from({ length: flowerCount }).map((_, i) => {
            const flowerX = 50 + (i * 900 / flowerCount) + ((i % 4) * 10)
            const flowerY = 370 + ((i % 3) * 5) + Math.sin(time + i) * 1.5
            const colors = [
              { petal: '#ff69b4', center: '#ff1493' },
              { petal: '#ffd700', center: '#ff8c00' },
              { petal: '#ff6347', center: '#dc143c' },
              { petal: '#9370db', center: '#8b008b' },
              { petal: '#00ced1', center: '#008b8b' },
            ]
            const color = colors[i % colors.length]

            return (
              <g key={`flower-${i}`}>
                {/* 줄기 */}
                <motion.line
                  x1={flowerX}
                  y1={flowerY}
                  x2={flowerX}
                  y2={flowerY + 12}
                  stroke="#16a34a"
                  strokeWidth="1.5"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 1.2 + i * 0.03, duration: 0.2 }}
                  style={{ transformOrigin: `${flowerX}px ${flowerY + 12}px` }}
                />

                {/* 꽃잎 (5개) */}
                {[0, 72, 144, 216, 288].map((angle, j) => (
                  <motion.ellipse
                    key={`petal-${j}`}
                    cx={flowerX + Math.cos((angle * Math.PI) / 180) * 4}
                    cy={flowerY + Math.sin((angle * Math.PI) / 180) * 4}
                    rx="3.5"
                    ry="6"
                    fill={color.petal}
                    transform={`rotate(${angle} ${flowerX} ${flowerY})`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2 + i * 0.03 + j * 0.01, duration: 0.2 }}
                  />
                ))}

                {/* 꽃 중심 */}
                <motion.circle
                  cx={flowerX}
                  cy={flowerY}
                  r="2.5"
                  fill={color.center}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2 + i * 0.03 + 0.05, duration: 0.15 }}
                />
              </g>
            )
          })}

        {/* 반딧불이 */}
        {level >= 7 &&
          Array.from({ length: starCount }).map((_, i) => {
            const fireflyX = 100 + (i * 200) % 900
            const fireflyY = 100 + Math.sin(time * 0.5 + i) * 40 + (i % 4) * 60

            return (
              <motion.g key={`firefly-${i}`}>
                {/* 빛나는 효과 (외곽) */}
                <motion.circle
                  cx={fireflyX}
                  cy={fireflyY}
                  r="8"
                  fill="#fef08a"
                  opacity="0.2"
                  animate={{
                    opacity: [0, 0.3, 0],
                    scale: [0.8, 1.5, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
                {/* 반딧불이 몸 */}
                <motion.circle
                  cx={fireflyX}
                  cy={fireflyY}
                  r="2.5"
                  fill="#fef08a"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              </motion.g>
            )
          })}
      </svg>

      {/* 레벨 정보 오버레이 */}
      <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md border border-white/20 rounded-lg p-4 max-w-xs">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{levelEmoji}</span>
          <div>
            <div className="text-white text-xl font-light" style={{ letterSpacing: '0.05em' }}>
              레벨 {level}
            </div>
            <div className="text-white/80 text-sm" style={{ fontWeight: 300 }}>
              {levelInfo.title}
            </div>
          </div>
        </div>
        <p className="text-white/70 text-xs mt-2" style={{ fontWeight: 300, lineHeight: 1.6 }}>
          {levelInfo.description}
        </p>
      </div>

      {/* 진행 바 */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md border border-white/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/80 text-sm" style={{ fontWeight: 300 }}>
            레벨 {level}
          </span>
          <span className="text-white/80 text-sm" style={{ fontWeight: 300 }}>
            {level >= 10 ? '완성!' : `레벨 ${level + 1}까지`}
          </span>
        </div>
        <div className="h-2 bg-black/40 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: levelColor }}
            initial={{ width: 0 }}
            animate={{ width: `${(level / 10) * 100}%` }}
            transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
          />
        </div>
        <div className="mt-2 text-xs text-white/60 text-center" style={{ fontWeight: 300 }}>
          {level >= 10 ? '축하합니다! 완벽한 숲을 완성했습니다!' : '상담을 받고 회복할수록 숲이 성장합니다'}
        </div>
      </div>
    </div>
  )
}
