'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Smile, Frown, Meh, Heart, Zap, Cloud, Sun, Moon } from 'lucide-react'

interface EmotionPickerProps {
  onSelect: (emotion: string, intensity: number) => void
  onSkip: () => void
}

const emotions = [
  { id: 'happy', label: '행복', icon: Smile, color: 'from-yellow-500 to-orange-500' },
  { id: 'sad', label: '슬픔', icon: Frown, color: 'from-blue-500 to-cyan-500' },
  { id: 'anxious', label: '불안', icon: Zap, color: 'from-purple-500 to-pink-500' },
  { id: 'angry', label: '분노', icon: Cloud, color: 'from-red-500 to-orange-500' },
  { id: 'tired', label: '피로', icon: Moon, color: 'from-indigo-500 to-blue-500' },
  { id: 'calm', label: '평온', icon: Sun, color: 'from-green-500 to-emerald-500' },
  { id: 'excited', label: '흥분', icon: Heart, color: 'from-pink-500 to-rose-500' },
  { id: 'confused', label: '혼란', icon: Meh, color: 'from-gray-500 to-slate-500' },
]

export default function EmotionPicker({ onSelect, onSkip }: EmotionPickerProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [intensity, setIntensity] = useState(5)
  const [step, setStep] = useState<'select' | 'intensity'>('select')

  const handleEmotionClick = (emotionId: string) => {
    setSelectedEmotion(emotionId)
    setStep('intensity')
  }

  const handleConfirm = () => {
    if (selectedEmotion) {
      onSelect(selectedEmotion, intensity)
    }
  }

  const selectedEmotionData = emotions.find((e) => e.id === selectedEmotion)

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-2xl max-w-2xl w-full"
      >
        <AnimatePresence mode="wait">
          {step === 'select' ? (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="text-center"
            >
              <h2 className="text-2xl sm:text-3xl font-light text-gray-100 mb-3">
                지금 어떤 감정이신가요?
              </h2>
              <p className="text-sm sm:text-base text-gray-400 mb-8">
                당신의 감정을 이해하고 맞춤형 상담을 제공해드릴게요
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {emotions.map((emotion, index) => (
                  <motion.button
                    key={emotion.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEmotionClick(emotion.id)}
                    className={`p-4 rounded-xl bg-gradient-to-br ${emotion.color} bg-opacity-10 border border-white/10 hover:border-white/30 transition-all group`}
                  >
                    <emotion.icon className="w-8 h-8 mx-auto mb-2 text-gray-300 group-hover:scale-110 transition-transform" />
                    <div className="text-sm text-gray-300">{emotion.label}</div>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={onSkip}
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                건너뛰기
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="intensity"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="text-center"
            >
              {selectedEmotionData && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                  className="mb-4"
                >
                  <selectedEmotionData.icon className="w-16 h-16 mx-auto text-gray-300" />
                </motion.div>
              )}

              <h2 className="text-2xl font-light text-gray-100 mb-2">
                {selectedEmotionData?.label}
              </h2>
              <p className="text-sm text-gray-400 mb-8">
                얼마나 강하게 느끼시나요?
              </p>

              <div className="mb-8">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, rgb(16, 185, 129) 0%, rgb(16, 185, 129) ${intensity * 10}%, rgb(55, 65, 81) ${intensity * 10}%, rgb(55, 65, 81) 100%)`,
                  }}
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>약함</span>
                  <span className="text-lg font-medium text-emerald-400">{intensity}</span>
                  <span>강함</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('select')}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg transition-all"
                >
                  다시 선택
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg transition-all"
                >
                  확인
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
