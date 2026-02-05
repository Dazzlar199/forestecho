'use client'

import { useState, useEffect } from 'react'
import { Quote, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Testimonial {
  id: number
  text: string
  author: string
  role: string
  rating: number
  date: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    text: '처음에는 AI 상담이 어색했는데, 정말 깊이 있게 제 마음을 이해해주더라고요. 24시간 언제든 대화할 수 있다는 게 가장 큰 장점이에요.',
    author: '김** 님',
    role: '베타 참여자',
    rating: 5,
    date: '베타 기간 중',
  },
  {
    id: 2,
    text: '야간 근무 후 새벽에 불안감이 심할 때 정말 큰 위로가 됐어요. 판단하지 않고 그저 들어주는 느낌이 좋았습니다.',
    author: '이** 님',
    role: '베타 참여자',
    rating: 5,
    date: '베타 기간 중',
  },
  {
    id: 3,
    text: '전문 상담소는 예약도 어렵고 비용도 부담스러웠는데, 여기서는 편하게 대화하면서 제 감정을 정리할 수 있었어요.',
    author: '박** 님',
    role: '베타 참여자',
    rating: 4,
    date: '베타 기간 중',
  },
  {
    id: 4,
    text: '상담 모드를 선택할 수 있는 게 좋아요. CBT 모드로 제 부정적 사고 패턴을 객관적으로 볼 수 있게 됐습니다.',
    author: '최** 님',
    role: '베타 참여자',
    rating: 5,
    date: '베타 기간 중',
  },
]

export default function SocialProof() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  const current = testimonials[currentIndex]

  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-light text-gray-100 mb-2">
          베타 참여자 후기
        </h2>
        <p className="text-sm sm:text-base text-gray-400">
          정식 출시 전 먼저 경험한 분들의 솔직한 평가
        </p>
      </motion.div>

      {/* 메인 후기 카드 */}
      <div className="relative min-h-[280px] sm:min-h-[240px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -50 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8"
          >
            {/* Quote Icon */}
            <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400/30 mb-4" />

            {/* Rating */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < current.rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Testimonial Text */}
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-6">
              "{current.text}"
            </p>

            {/* Author Info */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm sm:text-base font-medium text-gray-100">
                  {current.author}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  {current.role}
                </div>
              </div>
              <div className="text-xs text-gray-600">{current.date}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-emerald-400 w-8'
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
            aria-label={`후기 ${index + 1}번으로 이동`}
          />
        ))}
      </div>
    </div>
  )
}
