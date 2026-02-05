'use client'

import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Phone, ExternalLink, X } from 'lucide-react'
import { useFocusTrap, useEscapeKey, useScrollLock, useFocusRestore } from '@/lib/hooks/useAccessibility'
import { useLanguage } from '@/components/layout/LanguageProvider'

interface CrisisModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CrisisModal({ isOpen, onClose }: CrisisModalProps) {
  const { language } = useLanguage()
  const modalRef = useRef<HTMLDivElement>(null)

  // 접근성 훅
  useFocusTrap(isOpen, modalRef)
  useEscapeKey(isOpen, onClose)
  useScrollLock(isOpen)
  useFocusRestore(isOpen)

  const getEmergencyContacts = () => {
    if (language === 'ko') {
      return [
        { name: '자살예방상담전화', phone: '1393', description: '24시간 자살위기 상담', color: 'red' },
        { name: '정신건강위기상담', phone: '1577-0199', description: '24시간 정신건강 위기 상담', color: 'orange' },
        { name: '청소년전화', phone: '1388', description: '청소년 고민 상담', color: 'blue' },
        { name: '생명의전화', phone: '1588-9191', description: '자살예방 및 위기개입', color: 'green' },
      ]
    }

    // For international users, show international crisis hotlines
    return [
      { name: 'National Suicide Prevention Lifeline', phone: '988', description: '24/7 crisis support (USA)', color: 'red' },
      { name: 'Crisis Text Line', phone: '741741', description: 'Text HOME for crisis support (USA)', color: 'orange' },
      { name: 'International Association for Suicide Prevention', phone: '', description: 'Visit iasp.info for resources', color: 'blue' },
      { name: 'Befrienders Worldwide', phone: '', description: 'Visit befrienders.org for local help', color: 'green' },
    ]
  }

  const emergencyContacts = getEmergencyContacts()

  const handleCall = (phone: string, name: string) => {
    if (!phone) return // Skip if no phone number

    window.location.href = `tel:${phone}`
    // 스크린 리더 알림
    const message = language === 'ko' ? `${name} ${phone}번으로 전화를 겁니다` :
                    language === 'en' ? `Calling ${name} at ${phone}` :
                    language === 'ja' ? `${name} ${phone}に電話をかけます` :
                    `正在拨打 ${name} ${phone}`
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', 'polite')
    announcement.className = 'sr-only'
    announcement.textContent = message
    document.body.appendChild(announcement)
    setTimeout(() => document.body.removeChild(announcement), 1000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
          role="presentation"
        >
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* 모달 */}
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="crisis-modal-title"
            aria-describedby="crisis-modal-description"
            className="relative bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-xl border-2 border-red-500/50 p-8 rounded-2xl max-w-lg w-full"
          >
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all"
              aria-label={
                language === 'ko' ? '긴급 도움 모달 닫기' :
                language === 'en' ? 'Close emergency help modal' :
                language === 'ja' ? '緊急ヘルプモーダルを閉じる' :
                '关闭紧急帮助模态框'
              }
            >
              <X className="w-5 h-5 text-gray-400" aria-hidden="true" />
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
                aria-hidden="true"
              >
                <AlertCircle className="w-12 h-12 text-red-400" />
              </motion.div>
              <h2
                id="crisis-modal-title"
                className="text-2xl text-white mb-2"
                style={{ fontWeight: 400, letterSpacing: '0.03em' }}
              >
                {language === 'ko' && '긴급 도움이 필요하신가요?'}
                {language === 'en' && 'Need Emergency Help?'}
                {language === 'ja' && '緊急の助けが必要ですか？'}
                {language === 'zh' && '需要紧急帮助吗？'}
              </h2>
              <p
                id="crisis-modal-description"
                className="text-red-300 text-sm"
                style={{ fontWeight: 300, lineHeight: 1.8, letterSpacing: '0.02em' }}
              >
                {language === 'ko' && '전문가의 도움을 받으세요. 혼자가 아닙니다.'}
                {language === 'en' && "Get professional help. You're not alone."}
                {language === 'ja' && '専門家の助けを受けてください。一人ではありません。'}
                {language === 'zh' && '寻求专业帮助。你并不孤单。'}
              </p>
            </div>

            {/* 긴급 연락처 목록 */}
            <div className="space-y-3 mb-6" role="list" aria-label={
              language === 'ko' ? '긴급 연락처 목록' :
              language === 'en' ? 'Emergency contacts list' :
              language === 'ja' ? '緊急連絡先リスト' :
              '紧急联系方式列表'
            }>
              {emergencyContacts.map((contact, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  role="listitem"
                >
                  <button
                    onClick={() => handleCall(contact.phone, contact.name)}
                    disabled={!contact.phone}
                    className="w-full p-4 bg-black/30 hover:bg-black/50 border border-white/10 hover:border-white/20 rounded-lg transition-all group text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={
                      contact.phone
                        ? (language === 'ko' ? `${contact.name} ${contact.phone}번으로 전화하기. ${contact.description}` :
                           language === 'en' ? `Call ${contact.name} at ${contact.phone}. ${contact.description}` :
                           language === 'ja' ? `${contact.name} ${contact.phone}に電話する。${contact.description}` :
                           `拨打 ${contact.name} ${contact.phone}。${contact.description}`)
                        : `${contact.name}. ${contact.description}`
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${
                        contact.color === 'red' ? 'bg-red-500/20' :
                        contact.color === 'orange' ? 'bg-orange-500/20' :
                        contact.color === 'blue' ? 'bg-blue-500/20' :
                        'bg-green-500/20'
                      }`} aria-hidden="true">
                        <Phone className={`w-5 h-5 ${
                          contact.color === 'red' ? 'text-red-400' :
                          contact.color === 'orange' ? 'text-orange-400' :
                          contact.color === 'blue' ? 'text-blue-400' :
                          'text-green-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className="text-white"
                            style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                          >
                            {contact.name}
                          </h3>
                          <ExternalLink className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
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
                  </button>
                </motion.div>
              ))}
            </div>

            {/* 추가 안내 */}
            <div className="bg-black/40 p-4 rounded-lg border border-white/10" role="note" aria-label={
              language === 'ko' ? '안내 메시지' :
              language === 'en' ? 'Information message' :
              language === 'ja' ? 'お知らせメッセージ' :
              '信息消息'
            }>
              <p
                className="text-gray-300 text-sm text-center"
                style={{ fontWeight: 300, lineHeight: 1.8, letterSpacing: '0.02em' }}
              >
                {language === 'ko' && (
                  <>
                    💙 당신의 생명은 소중합니다. 지금 힘들더라도 반드시 나아질 수 있습니다.
                    <br />
                    전문가와 대화하는 것만으로도 큰 도움이 될 수 있습니다.
                  </>
                )}
                {language === 'en' && (
                  <>
                    💙 Your life is precious. Things can get better, even when it's hard right now.
                    <br />
                    Just talking to a professional can make a big difference.
                  </>
                )}
                {language === 'ja' && (
                  <>
                    💙 あなたの命は大切です。今が辛くても、必ず良くなります。
                    <br />
                    専門家と話すだけでも大きな助けになります。
                  </>
                )}
                {language === 'zh' && (
                  <>
                    💙 你的生命很宝贵。即使现在很艰难，事情也一定会好起来。
                    <br />
                    仅仅与专业人士交谈就能带来很大帮助。
                  </>
                )}
              </p>
            </div>

            {/* 대화 계속하기 버튼 */}
            <button
              onClick={onClose}
              className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
              style={{ fontWeight: 400, letterSpacing: '0.05em' }}
              aria-label={
                language === 'ko' ? '긴급 도움 모달을 닫고 대화 계속하기' :
                language === 'en' ? 'Close emergency help modal and continue chat' :
                language === 'ja' ? '緊急ヘルプモーダルを閉じて会話を続ける' :
                '关闭紧急帮助模态框并继续聊天'
              }
            >
              {language === 'ko' && '대화 계속하기'}
              {language === 'en' && 'Continue Chat'}
              {language === 'ja' && '会話を続ける'}
              {language === 'zh' && '继续聊天'}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
