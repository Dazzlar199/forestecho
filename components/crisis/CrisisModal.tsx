'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Phone, MessageCircle, ExternalLink, X } from 'lucide-react'

interface CrisisModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CrisisModal({ isOpen, onClose }: CrisisModalProps) {
  const emergencyContacts = [
    {
      name: '자살예방상담전화',
      phone: '1393',
      description: '24시간 자살위기 상담',
      color: 'red',
    },
    {
      name: '정신건강위기상담',
      phone: '1577-0199',
      description: '24시간 정신건강 위기 상담',
      color: 'orange',
    },
    {
      name: '청소년전화',
      phone: '1388',
      description: '청소년 고민 상담',
      color: 'blue',
    },
    {
      name: '생명의전화',
      phone: '1588-9191',
      description: '자살예방 및 위기개입',
      color: 'green',
    },
  ]

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            {/* 모달 */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-xl border-2 border-red-500/50 p-8 rounded-2xl max-w-lg w-full relative"
            >
              {/* 닫기 버튼 */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              {/* 헤더 */}
              <div className="text-center mb-8">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="inline-block p-4 bg-red-500/20 rounded-full mb-4"
                >
                  <AlertCircle className="w-12 h-12 text-red-400" />
                </motion.div>
                <h2
                  className="text-2xl text-white mb-2"
                  style={{ fontWeight: 400, letterSpacing: '0.03em' }}
                >
                  긴급 도움이 필요하신가요?
                </h2>
                <p
                  className="text-red-300 text-sm"
                  style={{ fontWeight: 300, lineHeight: 1.8, letterSpacing: '0.02em' }}
                >
                  전문가의 도움을 받으세요. 혼자가 아닙니다.
                </p>
              </div>

              {/* 긴급 연락처 목록 */}
              <div className="space-y-3 mb-6">
                {emergencyContacts.map((contact, index) => (
                  <motion.button
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleCall(contact.phone)}
                    className="w-full p-4 bg-black/30 hover:bg-black/50 border border-white/10 hover:border-white/20 rounded-lg transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${
                        contact.color === 'red' ? 'bg-red-500/20' :
                        contact.color === 'orange' ? 'bg-orange-500/20' :
                        contact.color === 'blue' ? 'bg-blue-500/20' :
                        'bg-green-500/20'
                      }`}>
                        <Phone className={`w-5 h-5 ${
                          contact.color === 'red' ? 'text-red-400' :
                          contact.color === 'orange' ? 'text-orange-400' :
                          contact.color === 'blue' ? 'text-blue-400' :
                          'text-green-400'
                        }`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className="text-white"
                            style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                          >
                            {contact.name}
                          </h3>
                          <ExternalLink className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p
                          className="text-gray-400 text-xs mb-1"
                          style={{ fontWeight: 300 }}
                        >
                          {contact.description}
                        </p>
                        <p
                          className={`text-lg font-mono ${
                            contact.color === 'red' ? 'text-red-400' :
                            contact.color === 'orange' ? 'text-orange-400' :
                            contact.color === 'blue' ? 'text-blue-400' :
                            'text-green-400'
                          }`}
                          style={{ fontWeight: 600, letterSpacing: '0.05em' }}
                        >
                          {contact.phone}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* 추가 안내 */}
              <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                <p
                  className="text-gray-300 text-sm text-center"
                  style={{ fontWeight: 300, lineHeight: 1.8, letterSpacing: '0.02em' }}
                >
                  💙 당신의 생명은 소중합니다. 지금 힘들더라도 반드시 나아질 수 있습니다.
                  <br />
                  전문가와 대화하는 것만으로도 큰 도움이 될 수 있습니다.
                </p>
              </div>

              {/* 닫기 버튼 */}
              <button
                onClick={onClose}
                className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                style={{ fontWeight: 400, letterSpacing: '0.05em' }}
              >
                대화 계속하기
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
