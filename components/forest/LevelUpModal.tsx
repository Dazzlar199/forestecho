'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, TreePine, Star, Award } from 'lucide-react'
import { getForestLevelInfo, getForestLevelEmoji } from '@/lib/forest-level'
import Confetti from 'react-confetti'

interface LevelUpModalProps {
  isOpen: boolean
  newLevel: number
  onClose: () => void
}

export default function LevelUpModal({ isOpen, newLevel, onClose }: LevelUpModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const levelInfo = getForestLevelInfo(newLevel)
  const emoji = getForestLevelEmoji(newLevel)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Confetti */}
          {showConfetti && (
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={500}
              gravity={0.3}
            />
          )}

          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* 모달 */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-xl border-2 border-emerald-500/50 p-10 rounded-2xl max-w-md w-full relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 배경 애니메이션 */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute top-0 left-0 w-full h-full opacity-10"
              >
                <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-green-500" />
              </motion.div>

              {/* 콘텐츠 */}
              <div className="relative z-10">
                {/* 아이콘 */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="text-center mb-6"
                >
                  <div className="inline-block p-6 bg-gradient-to-br from-emerald-500/30 to-green-500/30 rounded-full border-4 border-emerald-400/50">
                    <Award className="w-16 h-16 text-emerald-300" />
                  </div>
                </motion.div>

                {/* 레벨업 텍스트 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-6"
                >
                  <h2
                    className="text-3xl text-emerald-200 mb-2"
                    style={{ fontWeight: 400, letterSpacing: '0.05em' }}
                  >
                    레벨 업!
                  </h2>
                  <div className="flex items-center justify-center gap-3 text-5xl font-bold text-white mb-4">
                    {emoji} Level {newLevel}
                  </div>
                </motion.div>

                {/* 레벨 정보 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center mb-6"
                >
                  <h3
                    className="text-2xl text-white mb-3"
                    style={{ fontWeight: 400, letterSpacing: '0.03em' }}
                  >
                    {levelInfo.title}
                  </h3>
                  <p
                    className="text-emerald-300 text-sm"
                    style={{ fontWeight: 300, lineHeight: 1.8, letterSpacing: '0.02em' }}
                  >
                    {levelInfo.description}
                  </p>
                </motion.div>

                {/* 새로 해금된 요소들 */}
                {levelInfo.elements.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-black/30 p-4 rounded-lg border border-emerald-500/30 mb-6"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span
                        className="text-sm text-emerald-300"
                        style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                      >
                        새로 해금된 요소
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {levelInfo.elements.map((element, index) => (
                        <motion.span
                          key={index}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-xs text-emerald-200"
                          style={{ fontWeight: 300, letterSpacing: '0.02em' }}
                        >
                          {element.name}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 확인 버튼 */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  onClick={onClose}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg transition-all"
                  style={{ fontWeight: 400, letterSpacing: '0.05em' }}
                >
                  나의 숲 확인하기
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
